/* ============================================================
   Pretvfx-Tools — QR Code Generator
   Pakai API: https://api.qrserver.com (QR standar, bisa di-scan)
   Tidak butuh library lokal.
   ============================================================ */
(function () {
  "use strict";

  var TABS = [
    { id: "text", label: "Teks" },
    { id: "url", label: "Link" },
    { id: "tel", label: "Telepon" },
    { id: "email", label: "Email" },
    { id: "wifi", label: "WiFi" }
  ];

  var state = {
    type: "text",
    fields: { text: "", url: "", tel: "", email: "", wifiSsid: "", wifiPass: "", wifiAuth: "WPA" },
    size: 320,
    fg: "#000000",
    bg: "#ffffff",
    level: "M",
    lastPayload: "",
    lastUrl: ""
  };

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }
  function escAttr(s) {
    return esc(s).replace(/"/g, "&quot;");
  }

  function buildPayload() {
    switch (state.type) {
      case "url": {
        var u = (state.fields.url || "").trim();
        if (!u) return "";
        if (!/^https?:\/\//i.test(u)) u = "https://" + u;
        return u;
      }
      case "tel": {
        var t = (state.fields.tel || "").replace(/[^\d+]/g, "");
        return t ? "tel:" + t : "";
      }
      case "email": {
        var e = (state.fields.email || "").trim();
        return e ? "mailto:" + e : "";
      }
      case "wifi": {
        var s = (state.fields.wifiSsid || "").trim();
        if (!s) return "";
        function es(v) {
          return String(v || "").replace(/([\\;,":])/g, "\\$1");
        }
        return (
          "WIFI:T:" +
          (state.fields.wifiAuth || "WPA") +
          ";S:" +
          es(s) +
          ";P:" +
          es(state.fields.wifiPass || "") +
          ";;"
        );
      }
      default:
        return (state.fields.text || "").trim();
    }
  }

  function buildQrUrl(text) {
    var fg = String(state.fg || "#000000").replace("#", "");
    var bg = String(state.bg || "#ffffff").replace("#", "");
    var size = state.size || 320;
    // qzone=4 = quiet zone standar biar gampang di-scan
    return (
      "https://api.qrserver.com/v1/create-qr-code/" +
      "?size=" + size + "x" + size +
      "&data=" + encodeURIComponent(text) +
      "&color=" + fg +
      "&bgcolor=" + bg +
      "&qzone=4" +
      "&format=png" +
      "&ecc=" + (state.level || "M")
    );
  }

  function fieldsHtml() {
    switch (state.type) {
      case "url":
        return (
          '<div class="pfx-qr-field"><label class="pfx-qr-label" for="pfxQrUrl">Link / URL</label>' +
          '<input class="pfx-qr-input" id="pfxQrUrl" type="url" placeholder="https://example.com" value="' +
          escAttr(state.fields.url) +
          '" /></div>'
        );
      case "tel":
        return (
          '<div class="pfx-qr-field"><label class="pfx-qr-label" for="pfxQrTel">Nomor Telepon</label>' +
          '<input class="pfx-qr-input" id="pfxQrTel" type="tel" placeholder="+62812345678" value="' +
          escAttr(state.fields.tel) +
          '" /></div>'
        );
      case "email":
        return (
          '<div class="pfx-qr-field"><label class="pfx-qr-label" for="pfxQrEmail">Alamat Email</label>' +
          '<input class="pfx-qr-input" id="pfxQrEmail" type="email" placeholder="nama@email.com" value="' +
          escAttr(state.fields.email) +
          '" /></div>'
        );
      case "wifi":
        return (
          '<div class="pfx-qr-field"><label class="pfx-qr-label" for="pfxQrWifiSsid">Nama WiFi (SSID)</label>' +
          '<input class="pfx-qr-input" id="pfxQrWifiSsid" type="text" placeholder="Nama WiFi" value="' +
          escAttr(state.fields.wifiSsid) +
          '" /></div>' +
          '<div class="pfx-qr-field"><label class="pfx-qr-label" for="pfxQrWifiPass">Password</label>' +
          '<input class="pfx-qr-input" id="pfxQrWifiPass" type="text" placeholder="Password WiFi" value="' +
          escAttr(state.fields.wifiPass) +
          '" /></div>' +
          '<div class="pfx-qr-field"><label class="pfx-qr-label" for="pfxQrWifiAuth">Keamanan</label>' +
          '<select class="pfx-qr-select" id="pfxQrWifiAuth">' +
          '<option value="WPA"' + (state.fields.wifiAuth === "WPA" ? " selected" : "") + ">WPA / WPA2</option>" +
          '<option value="WEP"' + (state.fields.wifiAuth === "WEP" ? " selected" : "") + ">WEP</option>" +
          '<option value="nopass"' + (state.fields.wifiAuth === "nopass" ? " selected" : "") + ">Tanpa Password</option>" +
          "</select></div>"
        );
      default:
        return (
          '<div class="pfx-qr-field"><label class="pfx-qr-label" for="pfxQrText">Teks / Isi QR</label>' +
          '<textarea class="pfx-qr-textarea" id="pfxQrText" placeholder="Tulis teks di sini...">' +
          esc(state.fields.text) +
          "</textarea></div>"
        );
    }
  }

  function shellHtml() {
    var tabs = TABS.map(function (t) {
      return (
        '<button type="button" class="pfx-qr-tab' +
        (t.id === state.type ? " active" : "") +
        '" data-type="' + t.id + '">' + t.label + "</button>"
      );
    }).join("");
    var sizes = [200, 320, 480, 640]
      .map(function (n) {
        return (
          '<option value="' + n + '"' + (state.size === n ? " selected" : "") +
          ">" + n + " \u00d7 " + n + " px</option>"
        );
      })
      .join("");
    var levels = ["L", "M", "Q", "H"]
      .map(function (l) {
        var pct = { L: 7, M: 15, Q: 25, H: 30 }[l];
        return (
          '<option value="' + l + '"' + (state.level === l ? " selected" : "") +
          ">" + l + " \u2014 " + pct + "%</option>"
        );
      })
      .join("");
    return (
      '<div class="pfx-qr-wrap">' +
      '<div class="pfx-qr-tabs" role="tablist">' + tabs + "</div>" +
      '<div class="pfx-qr-fields" id="pfxQrFields">' + fieldsHtml() + "</div>" +
      '<div class="pfx-qr-opts">' +
      '<div class="pfx-qr-opt"><label class="pfx-qr-label" for="pfxQrSize">Ukuran</label>' +
      '<select class="pfx-qr-select" id="pfxQrSize">' + sizes + "</select></div>" +
      '<div class="pfx-qr-opt"><label class="pfx-qr-label" for="pfxQrLevel">Koreksi Error</label>' +
      '<select class="pfx-qr-select" id="pfxQrLevel">' + levels + "</select></div>" +
      '<div class="pfx-qr-opt"><label class="pfx-qr-label">Warna QR</label>' +
      '<div class="pfx-qr-color-row"><input type="color" id="pfxQrFg" value="' + state.fg +
      '" /><span class="pfx-qr-color-hex" id="pfxQrFgHex">' + state.fg + "</span></div></div>" +
      '<div class="pfx-qr-opt"><label class="pfx-qr-label">Warna Latar</label>' +
      '<div class="pfx-qr-color-row"><input type="color" id="pfxQrBg" value="' + state.bg +
      '" /><span class="pfx-qr-color-hex" id="pfxQrBgHex">' + state.bg + "</span></div></div>" +
      "</div>" +
      '<button type="button" class="pfx-qr-btn primary" id="pfxQrGenerate">' +
      '<i class="fa-solid fa-wand-magic-sparkles"></i> Generate QR</button>' +
      '<div class="pfx-qr-preview">' +
      '<div class="pfx-qr-canvas-wrap" id="pfxQrCanvasWrap">' +
      '<div class="pfx-qr-empty" id="pfxQrEmpty">' +
      '<i class="fa-solid fa-qrcode"></i> Isi data, lalu tekan <b>Generate QR</b></div>' +
      '<img id="pfxQrImg" alt="QR Code" style="display:none;max-width:260px;width:100%;height:auto;border-radius:6px;" />' +
      "</div>" +
      '<div class="pfx-qr-actions">' +
      '<button type="button" class="pfx-qr-btn primary" id="pfxQrDownload" disabled>' +
      '<i class="fa-solid fa-download"></i> Unduh PNG</button>' +
      '<button type="button" class="pfx-qr-btn ghost" id="pfxQrCopy" disabled>' +
      '<i class="fa-solid fa-copy"></i> Salin Isi</button>' +
      "</div></div></div>"
    );
  }

  var toastTimer = null;
  function showToast(msg) {
    var t = document.getElementById("pfxQrToast");
    if (!t) {
      t = document.createElement("div");
      t.id = "pfxQrToast";
      t.className = "pfx-qr-toast";
      document.body.appendChild(t);
    }
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      t.classList.remove("show");
    }, 2500);
  }

  function resetPreview() {
    var img = document.getElementById("pfxQrImg");
    var empty = document.getElementById("pfxQrEmpty");
    var wrap = document.getElementById("pfxQrCanvasWrap");
    var dlBtn = document.getElementById("pfxQrDownload");
    var cpBtn = document.getElementById("pfxQrCopy");
    if (img) {
      img.style.display = "none";
      img.removeAttribute("src");
    }
    if (empty) {
      empty.style.display = "";
      empty.innerHTML =
        '<i class="fa-solid fa-qrcode"></i> Isi data, lalu tekan <b>Generate QR</b>';
    }
    if (wrap) {
      wrap.classList.remove("has-qr");
      wrap.style.opacity = "1";
    }
    if (dlBtn) dlBtn.disabled = true;
    if (cpBtn) cpBtn.disabled = true;
    state.lastPayload = "";
    state.lastUrl = "";
  }

  function markStale() {
    var wrap = document.getElementById("pfxQrCanvasWrap");
    if (wrap && wrap.classList.contains("has-qr")) wrap.style.opacity = "0.45";
  }

  var renderToken = 0;
  function render() {
    var img = document.getElementById("pfxQrImg");
    var empty = document.getElementById("pfxQrEmpty");
    var wrap = document.getElementById("pfxQrCanvasWrap");
    var dlBtn = document.getElementById("pfxQrDownload");
    var cpBtn = document.getElementById("pfxQrCopy");
    if (!img || !empty || !wrap) return;

    var payload = buildPayload();
    if (!payload) {
      showToast("Isi data dulu sebelum generate");
      resetPreview();
      return;
    }

    var myToken = ++renderToken;
    var url = buildQrUrl(payload) + "&_=" + Date.now();
    state.lastPayload = payload;
    state.lastUrl = buildQrUrl(payload);

    empty.innerHTML =
      '<i class="fa-solid fa-spinner fa-spin"></i> Membuat QR...';
    empty.style.display = "";
    img.style.display = "none";

    var timeoutId = setTimeout(function () {
      if (myToken !== renderToken) return;
      showToast("Timeout — cek koneksi ke api.qrserver.com");
      resetPreview();
    }, 15000);

    img.onload = function () {
      clearTimeout(timeoutId);
      if (myToken !== renderToken) return;
      empty.style.display = "none";
      img.style.display = "block";
      wrap.classList.add("has-qr");
      wrap.style.opacity = "1";
      if (dlBtn) dlBtn.disabled = false;
      if (cpBtn) cpBtn.disabled = false;
      showToast("QR berhasil dibuat");
    };
    img.onerror = function () {
      clearTimeout(timeoutId);
      if (myToken !== renderToken) return;
      showToast("Gagal load QR — cek internet / CSP");
      console.error("[QR] gagal load", url);
      resetPreview();
    };
    img.src = url;
  }

  function bindFields() {
    var map = {
      pfxQrText: function (v) { state.fields.text = v; },
      pfxQrUrl: function (v) { state.fields.url = v; },
      pfxQrTel: function (v) { state.fields.tel = v; },
      pfxQrEmail: function (v) { state.fields.email = v; },
      pfxQrWifiSsid: function (v) { state.fields.wifiSsid = v; },
      pfxQrWifiPass: function (v) { state.fields.wifiPass = v; },
      pfxQrWifiAuth: function (v) { state.fields.wifiAuth = v; }
    };
    Object.keys(map).forEach(function (id) {
      var el = document.getElementById(id);
      if (!el) return;
      el.addEventListener(el.tagName === "SELECT" ? "change" : "input", function () {
        map[id](el.value);
        markStale();
      });
    });
  }

  function bindEvents() {
    var wrap = document.querySelector(".pfx-qr-wrap");
    if (!wrap) return;

    wrap.querySelectorAll(".pfx-qr-tab").forEach(function (tab) {
      tab.addEventListener("click", function () {
        state.type = tab.dataset.type;
        wrap.querySelectorAll(".pfx-qr-tab").forEach(function (t) {
          t.classList.toggle("active", t === tab);
        });
        var fields = document.getElementById("pfxQrFields");
        if (fields) fields.innerHTML = fieldsHtml();
        bindFields();
        resetPreview();
      });
    });

    var sizeEl = document.getElementById("pfxQrSize");
    if (sizeEl)
      sizeEl.addEventListener("change", function (e) {
        state.size = Number(e.target.value) || 320;
        markStale();
      });
    var levelEl = document.getElementById("pfxQrLevel");
    if (levelEl)
      levelEl.addEventListener("change", function (e) {
        state.level = e.target.value || "M";
        markStale();
      });

    var fg = document.getElementById("pfxQrFg");
    var bg = document.getElementById("pfxQrBg");
    if (fg)
      fg.addEventListener("input", function () {
        state.fg = fg.value;
        var hex = document.getElementById("pfxQrFgHex");
        if (hex) hex.textContent = fg.value;
        markStale();
      });
    if (bg)
      bg.addEventListener("input", function () {
        state.bg = bg.value;
        var hex = document.getElementById("pfxQrBgHex");
        if (hex) hex.textContent = bg.value;
        markStale();
      });

    var gen = document.getElementById("pfxQrGenerate");
    if (gen) gen.addEventListener("click", render);

    var dl = document.getElementById("pfxQrDownload");
    if (dl)
      dl.addEventListener("click", function () {
        if (!state.lastUrl && !state.lastPayload) {
          showToast("Generate QR dulu");
          return;
        }
        var url = state.lastUrl || buildQrUrl(state.lastPayload);
        showToast("Mengunduh...");
        fetch(url)
          .then(function (r) {
            return r.blob();
          })
          .then(function (blob) {
            var blobUrl = URL.createObjectURL(blob);
            var a = document.createElement("a");
            a.href = blobUrl;
            a.download = "pretvfx-qr-" + Date.now() + ".png";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            setTimeout(function () {
              URL.revokeObjectURL(blobUrl);
            }, 3000);
            showToast("QR berhasil diunduh");
          })
          .catch(function () {
            window.open(url, "_blank");
            showToast("QR dibuka di tab baru");
          });
      });

    var cp = document.getElementById("pfxQrCopy");
    if (cp)
      cp.addEventListener("click", function () {
        var payload = state.lastPayload || buildPayload();
        if (!payload) return;
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(payload).then(
            function () {
              showToast("Isi QR disalin");
            },
            function () {
              showToast("Gagal menyalin");
            }
          );
        } else showToast("Gagal menyalin");
      });

    bindFields();
  }

  function renderQrGenerator(mount) {
    mount.innerHTML = shellHtml();
    bindEvents();
    resetPreview();
  }

  function register() {
    if (typeof window.PretvfxToolsRegister === "function") {
      window.PretvfxToolsRegister("qrcode", function (mount) {
        renderQrGenerator(mount);
      });
      console.log("[QR] OK — api.qrserver.com");
    } else {
      console.error("[QR] PretvfxToolsRegister tidak ada");
    }
  }

  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", register);
  else register();
})();
