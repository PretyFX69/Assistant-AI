/* ============================================================
   Pretvfx-Tools — Downloader
   FIX: API_BASE bisa diarahkan ke server Node (beda domain/port).
   Set di index.html:  window.PRETVFX_API_BASE = "https://node-xxx:3600";
   atau biarkan kosong = same origin.
   ============================================================ */
(function () {
  "use strict";

  const FORMATS = [
    { id: "mp4", label: "MP4" },
    { id: "720p", label: "720p" },
    { id: "1080p", label: "1080p" },
    { id: "mp3", label: "MP3" }
  ];

  const state = { fmt: "mp4", jobId: null, pollTimer: null };

  /** Base URL backend Node. Tanpa slash di akhir. */
  function apiBase() {
    var b =
      (typeof window.PRETVFX_API_BASE === "string" && window.PRETVFX_API_BASE) ||
      (localStorage.getItem("pretvfx_api_base") || "") ||
      "";
    return String(b).replace(/\/+$/, "");
  }
  function apiUrl(path) {
    var base = apiBase();
    var p = path.charAt(0) === "/" ? path : "/" + path;
    return base ? base + p : p;
  }

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  async function parseJsonSafe(res) {
    var text = await res.text();
    var trimmed = (text || "").trim();
    if (!trimmed) {
      throw new Error(res.ok ? "Respons server kosong" : "Server error " + res.status);
    }
    try {
      return JSON.parse(trimmed);
    } catch (_) {
      var short = trimmed.replace(/\s+/g, " ").slice(0, 120);
      if (/file not found/i.test(short) || res.status === 404) {
        throw new Error(
          "API downloader tidak ditemukan di " +
            (apiBase() || location.origin) +
            ". Set window.PRETVFX_API_BASE ke URL Node (contoh port 3600)."
        );
      }
      throw new Error(short || "HTTP " + res.status);
    }
  }

  function shellHtml() {
    return (
      '<div class="pfx-dl-wrap">' +
      '<div class="pfx-dl-section">' +
      '<label class="pfx-dl-label">Link video</label>' +
      '<div class="pfx-dl-inputrow">' +
      '<input id="pfxDlUrl" class="pfx-dl-input" type="url" inputmode="url" autocomplete="off" ' +
      'placeholder="Tempel link TikTok / YouTube / Instagram / Facebook..." />' +
      '<button type="button" id="pfxDlPaste" class="pfx-dl-iconbtn" title="Tempel dari clipboard">' +
      '<i class="fa-solid fa-paste"></i></button>' +
      "</div></div>" +
      '<div class="pfx-dl-section">' +
      '<label class="pfx-dl-label">Format</label>' +
      '<div class="pfx-dl-chips" id="pfxDlChips">' +
      FORMATS.map(function (f) {
        return (
          '<button type="button" class="pfx-dl-chip' +
          (f.id === state.fmt ? " active" : "") +
          '" data-fmt="' +
          f.id +
          '">' +
          f.label +
          "</button>"
        );
      }).join("") +
      "</div></div>" +
      '<button type="button" id="pfxDlGo" class="pfx-dl-btn primary" style="width:100%;margin-top:4px;">' +
      '<i class="fa-solid fa-download"></i> Unduh</button>' +
      '<div id="pfxDlProgress" class="pfx-dl-progress" style="display:none;">' +
      '<div class="pfx-dl-progress-top"><i class="fa-solid fa-spinner fa-spin"></i> ' +
      '<span id="pfxDlProgressText">Memulai...</span></div>' +
      '<div class="pfx-dl-bar-track"><div class="pfx-dl-bar-fill" id="pfxDlBarFill" style="width:0%"></div></div>' +
      "</div>" +
      '<div id="pfxDlResult" class="pfx-dl-result" style="display:none;"></div>' +
      '<div id="pfxDlError" class="pfx-dl-error" style="display:none;"></div>' +
      "</div>"
    );
  }

  var toastTimer = null;
  function showToast(msg) {
    var t = document.getElementById("pfxDlToast");
    if (!t) {
      t = document.createElement("div");
      t.id = "pfxDlToast";
      t.className = "pfx-dl-toast";
      document.body.appendChild(t);
    }
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      t.classList.remove("show");
    }, 2200);
  }

  function fmtSize(mb) {
    if (!mb) return "";
    return mb >= 1 ? mb.toFixed(2) + " MB" : (mb * 1024).toFixed(0) + " KB";
  }

  function stopPolling() {
    if (state.pollTimer) {
      clearInterval(state.pollTimer);
      state.pollTimer = null;
    }
  }

  function resetUi() {
    stopPolling();
    state.jobId = null;
    var progress = document.getElementById("pfxDlProgress");
    var result = document.getElementById("pfxDlResult");
    var error = document.getElementById("pfxDlError");
    if (progress) progress.style.display = "none";
    if (result) {
      result.style.display = "none";
      result.innerHTML = "";
    }
    if (error) {
      error.style.display = "none";
      error.textContent = "";
    }
  }

  function setGoBtnBusy(busy) {
    var goBtn = document.getElementById("pfxDlGo");
    if (!goBtn) return;
    goBtn.disabled = busy;
    goBtn.innerHTML = busy
      ? '<i class="fa-solid fa-spinner fa-spin"></i> Memproses...'
      : '<i class="fa-solid fa-download"></i> Unduh';
  }

  function showError(msg) {
    stopPolling();
    setGoBtnBusy(false);
    var error = document.getElementById("pfxDlError");
    var progress = document.getElementById("pfxDlProgress");
    if (progress) progress.style.display = "none";
    if (error) {
      error.style.display = "flex";
      error.innerHTML =
        '<i class="fa-solid fa-triangle-exclamation"></i> ' + esc(msg);
    }
    showToast("Gagal: " + msg);
  }

  function showResult(job) {
    stopPolling();
    setGoBtnBusy(false);
    var progress = document.getElementById("pfxDlProgress");
    var result = document.getElementById("pfxDlResult");
    if (progress) progress.style.display = "none";

    var fileUrl = apiUrl("/api/tools/download/file/" + state.jobId);
    var typeLabel = job.is_zip
      ? (job.photo_count || 0) + " Foto (ZIP)"
      : job.content_type === "audio"
      ? "Audio MP3"
      : "Video";
    var icon = job.is_zip
      ? "fa-images"
      : job.content_type === "audio"
      ? "fa-music"
      : "fa-video";

    if (result) {
      result.style.display = "block";
      result.innerHTML =
        '<div class="pfx-dl-result-row">' +
        (job.thumbnail
          ? '<img class="pfx-dl-thumb" src="' + esc(job.thumbnail) + '" alt="">'
          : '<div class="pfx-dl-thumb pfx-dl-thumb-fallback"><i class="fa-solid ' +
            icon +
            '"></i></div>') +
        '<div class="pfx-dl-result-info">' +
        '<div class="pfx-dl-result-title">' +
        (job.title ? esc(job.title) : "Selesai diunduh") +
        "</div>" +
        '<div class="pfx-dl-result-meta">' +
        typeLabel +
        (job.size_mb ? " · " + fmtSize(job.size_mb) : "") +
        "</div></div></div>" +
        '<a href="' +
        fileUrl +
        '" download class="pfx-dl-btn primary" style="width:100%;margin-top:10px;">' +
        '<i class="fa-solid fa-download"></i> Simpan File</a>';
    }
    showToast("Berhasil, siap diunduh");
  }

  function poll() {
    if (!state.jobId) return;
    fetch(apiUrl("/api/tools/download/status/" + state.jobId))
      .then(parseJsonSafe)
      .then(function (job) {
        if (job.status === "error")
          return showError(job.error || "Gagal memproses");
        var fill = document.getElementById("pfxDlBarFill");
        var text = document.getElementById("pfxDlProgressText");
        if (fill) fill.style.width = (job.progress || 0) + "%";
        if (text)
          text.textContent =
            (job.status_text || "Memproses...") +
            " (" +
            (job.progress || 0) +
            "%)";
        if (job.status === "done") showResult(job);
      })
      .catch(function (e) {
        if (
          e &&
          /API downloader|tidak ditemukan|PRETVFX_API_BASE|Node/i.test(
            String(e.message || e)
          )
        ) {
          showError(e.message || String(e));
        }
      });
  }

  function startDownload() {
    var input = document.getElementById("pfxDlUrl");
    var url = ((input && input.value) || "").trim();
    if (!url) {
      showToast("Tempel link dulu");
      return;
    }
    if (!/^https?:\/\//i.test(url)) {
      showToast("Link tidak valid");
      return;
    }

    resetUi();
    setGoBtnBusy(true);
    var progress = document.getElementById("pfxDlProgress");
    if (progress) progress.style.display = "block";

    fetch(apiUrl("/api/tools/download/start"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: url, format: state.fmt })
    })
      .then(parseJsonSafe)
      .then(function (data) {
        if (data.error || !data.job_id)
          throw new Error(data.error || "Gagal memulai job");
        state.jobId = data.job_id;
        state.pollTimer = setInterval(poll, 1200);
        poll();
      })
      .catch(function (e) {
        showError(e.message || "Gagal menghubungi server");
      });
  }

  function bindEvents() {
    document.querySelectorAll("#pfxDlChips .pfx-dl-chip").forEach(function (chip) {
      chip.addEventListener("click", function () {
        state.fmt = chip.dataset.fmt;
        document.querySelectorAll("#pfxDlChips .pfx-dl-chip").forEach(function (c) {
          c.classList.toggle("active", c === chip);
        });
      });
    });

    var goBtn = document.getElementById("pfxDlGo");
    if (goBtn) goBtn.addEventListener("click", startDownload);

    var pasteBtn = document.getElementById("pfxDlPaste");
    if (pasteBtn)
      pasteBtn.addEventListener("click", function () {
        if (!navigator.clipboard || !navigator.clipboard.readText) {
          showToast("Tidak bisa akses clipboard");
          return;
        }
        navigator.clipboard.readText().then(function (text) {
          var input = document.getElementById("pfxDlUrl");
          if (input && text) {
            input.value = text.trim();
            showToast("Link ditempel");
          }
        }).catch(function () {
          showToast("Tidak bisa akses clipboard");
        });
      });

    var input = document.getElementById("pfxDlUrl");
    if (input)
      input.addEventListener("keydown", function (e) {
        if (e.key === "Enter") startDownload();
      });
  }

  function renderDownloader(mount) {
    mount.innerHTML = shellHtml();
    bindEvents();
  }

  function register() {
    if (typeof window.PretvfxToolsRegister === "function") {
      window.PretvfxToolsRegister("downloader", function (mount) {
        renderDownloader(mount);
      });
      console.log(
        "[Downloader] OK terdaftar | API_BASE =",
        apiBase() || "(same origin)"
      );
    } else {
      console.error("[Downloader] window.PretvfxToolsRegister tidak ada");
    }
  }

  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", register);
  else register();
})();
