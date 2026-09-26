/* ============================================================
   Pretvfx-Tools — Extra tools
   - wordcount   → KALKULATOR (hitung-hitungan)
   - colorpicker → Pemilih Warna + palet
   - unitconvert → Peng HD Imagine (image upscaler)
   ============================================================ */
(function () {
  'use strict';

  const esc = (s) => String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');

  /* ---------------------------------------------------------
     1) KALKULATOR
  --------------------------------------------------------- */
  function renderCalculator(mount) {
    mount.innerHTML = `
      <div class="pfx-tool-hero">
        <div class="pfx-tool-hero-icon" style="--c1:#10b981;--c2:#06b6d4">
          <i class="fa-solid fa-calculator"></i>
        </div>
        <div>
          <div class="pfx-tool-hero-title">Kalkulator</div>
          <div class="pfx-tool-hero-desc">Hitung cepat: +, −, ×, ÷, persen & tanda.</div>
        </div>
      </div>

      <div class="pfx-calc">
        <div class="pfx-calc-display">
          <div class="pfx-calc-history" id="pfxCalcHistory">&nbsp;</div>
          <div class="pfx-calc-screen" id="pfxCalcScreen">0</div>
        </div>

        <div class="pfx-calc-grid">
          <button type="button" class="pfx-calc-btn fn" data-action="clear">AC</button>
          <button type="button" class="pfx-calc-btn fn" data-action="back"><i class="fa-solid fa-delete-left"></i></button>
          <button type="button" class="pfx-calc-btn fn" data-action="percent">%</button>
          <button type="button" class="pfx-calc-btn op" data-op="/">÷</button>

          <button type="button" class="pfx-calc-btn" data-num="7">7</button>
          <button type="button" class="pfx-calc-btn" data-num="8">8</button>
          <button type="button" class="pfx-calc-btn" data-num="9">9</button>
          <button type="button" class="pfx-calc-btn op" data-op="*">×</button>

          <button type="button" class="pfx-calc-btn" data-num="4">4</button>
          <button type="button" class="pfx-calc-btn" data-num="5">5</button>
          <button type="button" class="pfx-calc-btn" data-num="6">6</button>
          <button type="button" class="pfx-calc-btn op" data-op="-">−</button>

          <button type="button" class="pfx-calc-btn" data-num="1">1</button>
          <button type="button" class="pfx-calc-btn" data-num="2">2</button>
          <button type="button" class="pfx-calc-btn" data-num="3">3</button>
          <button type="button" class="pfx-calc-btn op" data-op="+">+</button>

          <button type="button" class="pfx-calc-btn" data-action="sign">±</button>
          <button type="button" class="pfx-calc-btn" data-num="0">0</button>
          <button type="button" class="pfx-calc-btn" data-action="dot">.</button>
          <button type="button" class="pfx-calc-btn op eq" data-action="equals">=</button>
        </div>
      </div>
    `;

    const screenEl  = mount.querySelector('#pfxCalcScreen');
    const historyEl = mount.querySelector('#pfxCalcHistory');

    const st = {
      current: '0',      // string angka yang sedang diketik
      previous: null,    // angka sebelumnya (number)
      operator: null,    // '+','-','*','/'
      waiting: false     // kalau true → digit berikutnya ganti current
    };

    const OPSYM = { '+': '+', '-': '−', '*': '×', '/': '÷' };

    function formatNumber(n) {
      if (!isFinite(n)) return 'Error';
      // batasi panjang biar gak overflow
      const s = Math.abs(n) >= 1e12 || (Math.abs(n) < 1e-6 && n !== 0)
        ? n.toExponential(6)
        : String(parseFloat(n.toFixed(10)));
      return s;
    }

    function prettyCurrent() {
      // tampilkan dengan pemisah ribuan di bagian integer (kecuali scientific)
      const c = st.current;
      if (c.includes('e')) return c;
      const neg = c.startsWith('-');
      const raw = neg ? c.slice(1) : c;
      const [ip, dp] = raw.split('.');
      const ipFmt = ip.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
      return (neg ? '-' : '') + ipFmt + (dp !== undefined ? ',' + dp : '');
    }

    function render() {
      const text = prettyCurrent();
      // auto-shrink kalau kepanjangan
      screenEl.textContent = text;
      screenEl.classList.toggle('pfx-calc-screen-sm', text.length > 10);
      screenEl.classList.toggle('pfx-calc-screen-xs', text.length > 14);

      if (st.previous !== null && st.operator) {
        historyEl.textContent = `${formatNumber(st.previous)} ${OPSYM[st.operator]}`;
      } else {
        historyEl.innerHTML = '&nbsp;';
      }
    }

    function inputDigit(d) {
      if (st.waiting) { st.current = d; st.waiting = false; return; }
      if (st.current === '0') st.current = d;
      else if (st.current === '-0') st.current = '-' + d;
      else st.current += d;
      if (st.current.replace('-', '').replace('.', '').length > 12) {
        st.current = st.current.slice(0, st.current.length - 1);
      }
    }

    function inputDot() {
      if (st.waiting) { st.current = '0.'; st.waiting = false; return; }
      if (!st.current.includes('.')) st.current += '.';
    }

    function clearAll() {
      st.current = '0';
      st.previous = null;
      st.operator = null;
      st.waiting = false;
    }

    function backspace() {
      if (st.waiting) return;
      if (st.current.length <= 1 || (st.current.length === 2 && st.current.startsWith('-'))) {
        st.current = '0';
      } else {
        st.current = st.current.slice(0, -1);
      }
    }

    function toggleSign() {
      if (st.current === '0') return;
      st.current = st.current.startsWith('-') ? st.current.slice(1) : '-' + st.current;
    }

    function percent() {
      const v = parseFloat(st.current) || 0;
      st.current = String(v / 100);
    }

    function compute(a, b, op) {
      switch (op) {
        case '+': return a + b;
        case '-': return a - b;
        case '*': return a * b;
        case '/': return b === 0 ? NaN : a / b;
      }
      return b;
    }

    function chooseOperator(op) {
      const inputValue = parseFloat(st.current);

      if (st.previous === null) {
        st.previous = inputValue;
      } else if (st.operator && !st.waiting) {
        const result = compute(st.previous, inputValue, st.operator);
        if (!isFinite(result)) {
          st.current = 'Error';
          st.previous = null;
          st.operator = null;
          st.waiting = true;
          return;
        }
        st.previous = result;
        st.current = formatNumber(result);
      }

      st.operator = op;
      st.waiting = true;
    }

    function equals() {
      if (st.operator === null || st.previous === null) return;
      const inputValue = parseFloat(st.current);
      const result = compute(st.previous, inputValue, st.operator);

      if (!isFinite(result)) {
        st.current = 'Error';
        st.previous = null;
        st.operator = null;
        st.waiting = true;
        return;
      }

      historyEl.textContent =
        `${formatNumber(st.previous)} ${OPSYM[st.operator]} ${formatNumber(inputValue)} =`;

      st.current = formatNumber(result);
      st.previous = null;
      st.operator = null;
      st.waiting = true;
    }

    // handler klik
    mount.querySelectorAll('.pfx-calc-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        if (btn.dataset.num !== undefined) inputDigit(btn.dataset.num);
        else if (btn.dataset.op !== undefined) chooseOperator(btn.dataset.op);
        else {
          const a = btn.dataset.action;
          if (a === 'clear')   clearAll();
          if (a === 'back')    backspace();
          if (a === 'sign')    toggleSign();
          if (a === 'dot')     inputDot();
          if (a === 'percent') percent();
          if (a === 'equals')  equals();
        }
        render();
      });
    });

    // keyboard support
    function onKey(e) {
      if (!document.body.contains(screenEl)) {
        document.removeEventListener('keydown', onKey);
        return;
      }
      const k = e.key;
      if (/^[0-9]$/.test(k)) { inputDigit(k); render(); e.preventDefault(); return; }
      if (k === '.') { inputDot(); render(); e.preventDefault(); return; }
      if (k === '+' || k === '-' || k === '*' || k === '/') {
        chooseOperator(k); render(); e.preventDefault(); return;
      }
      if (k === 'Enter' || k === '=') { equals(); render(); e.preventDefault(); return; }
      if (k === 'Backspace') { backspace(); render(); e.preventDefault(); return; }
      if (k === 'Escape' || k.toLowerCase() === 'c') { clearAll(); render(); e.preventDefault(); return; }
      if (k === '%') { percent(); render(); e.preventDefault(); return; }
    }
    document.addEventListener('keydown', onKey);

    render();
  }

  /* ---------------------------------------------------------
     2) PEMILIH WARNA
  --------------------------------------------------------- */
  function renderColorPicker(mount) {
    mount.innerHTML = `
      <div class="pfx-tool-hero">
        <div class="pfx-tool-hero-icon" style="--c1:#6366f1;--c2:#a855f7">
          <i class="fa-solid fa-palette"></i>
        </div>
        <div>
          <div class="pfx-tool-hero-title">Pemilih Warna</div>
          <div class="pfx-tool-hero-desc">Ambil warna & bikin palet otomatis.</div>
        </div>
      </div>

      <div class="pfx-cp-preview" id="pfxCpPreview">
        <input type="color" id="pfxCpInput" value="#6366f1" aria-label="Pilih warna" />
        <div class="pfx-cp-hex" id="pfxCpHex">#6366F1</div>
      </div>

      <div class="pfx-cp-values" id="pfxCpValues"></div>

      <div class="pfx-cp-row">
        <button type="button" class="pfx-tool-btn" id="pfxCpRandom">
          <i class="fa-solid fa-shuffle"></i> Acak
        </button>
        <button type="button" class="pfx-tool-btn" id="pfxCpCopy">
          <i class="fa-solid fa-copy"></i> Copy HEX
        </button>
      </div>

      <div class="pfx-cp-section-title">Palet</div>
      <div class="pfx-cp-palette" id="pfxCpPalette"></div>
    `;

    const input   = mount.querySelector('#pfxCpInput');
    const preview = mount.querySelector('#pfxCpPreview');
    const hexEl   = mount.querySelector('#pfxCpHex');
    const valsEl  = mount.querySelector('#pfxCpValues');
    const palEl   = mount.querySelector('#pfxCpPalette');

    function hexToRgb(hex) {
      hex = hex.replace('#', '');
      if (hex.length === 3) hex = hex.split('').map((c) => c + c).join('');
      return [
        parseInt(hex.substring(0, 2), 16),
        parseInt(hex.substring(2, 4), 16),
        parseInt(hex.substring(4, 6), 16)
      ];
    }
    function rgbToHex(r, g, b) {
      return '#' + [r, g, b]
        .map((x) => Math.max(0, Math.min(255, Math.round(x))).toString(16).padStart(2, '0'))
        .join('').toUpperCase();
    }
    function rgbToHsl(r, g, b) {
      r /= 255; g /= 255; b /= 255;
      const max = Math.max(r, g, b), min = Math.min(r, g, b);
      let h = 0, s = 0;
      const l = (max + min) / 2;
      if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        if (max === r)      h = (g - b) / d + (g < b ? 6 : 0);
        else if (max === g) h = (b - r) / d + 2;
        else                h = (r - g) / d + 4;
        h /= 6;
      }
      return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
    }
    function hslToRgb(h, s, l) {
      h = ((h % 360) + 360) % 360 / 360;
      s /= 100; l /= 100;
      if (s === 0) {
        const v = Math.round(l * 255);
        return [v, v, v];
      }
      const hue2rgb = (p, q, t) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
      };
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      return [
        Math.round(hue2rgb(p, q, h + 1 / 3) * 255),
        Math.round(hue2rgb(p, q, h) * 255),
        Math.round(hue2rgb(p, q, h - 1 / 3) * 255)
      ];
    }

    function copyText(t, onDone) {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(t).then(onDone).catch(() => {});
      } else {
        const ta = document.createElement('textarea');
        ta.value = t; ta.style.position = 'fixed'; ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand('copy'); onDone(); } catch (e) {}
        document.body.removeChild(ta);
      }
    }

    function update(hex) {
      const [r, g, b] = hexToRgb(hex);
      const [h, s, l] = rgbToHsl(r, g, b);
      const hexUp = rgbToHex(r, g, b);

      hexEl.textContent = hexUp;
      preview.style.background =
        `linear-gradient(135deg, ${hexUp}, ${rgbToHex.apply(null, hslToRgb(h, s, Math.max(0, l - 18)))})`;

      const values = [
        { l: 'HEX', v: hexUp },
        { l: 'RGB', v: `${r}, ${g}, ${b}` },
        { l: 'HSL', v: `${h}°, ${s}%, ${l}%` }
      ];

      valsEl.innerHTML = values.map((v, i) => `
        <div class="pfx-cp-val" data-i="${i}">
          <div class="pfx-cp-val-l">${v.l}</div>
          <div class="pfx-cp-val-v">${esc(v.v)}</div>
        </div>
      `).join('');

      valsEl.querySelectorAll('.pfx-cp-val').forEach((el) => {
        el.addEventListener('click', () => {
          const val = values[parseInt(el.dataset.i, 10)].v;
          const vEl = el.querySelector('.pfx-cp-val-v');
          const old = vEl.textContent;
          copyText(val, () => {
            el.classList.add('copied');
            vEl.textContent = 'Copied!';
            setTimeout(() => {
              el.classList.remove('copied');
              vEl.textContent = old;
            }, 900);
          });
        });
      });

      const tints  = [92, 80, 68, 56].map((L) => rgbToHex.apply(null, hslToRgb(h, s, L)));
      const shades = [40, 28, 18, 10].map((L) => rgbToHex.apply(null, hslToRgb(h, s, L)));
      const palette = [...tints, hexUp, ...shades];

      palEl.innerHTML = palette.map((c) => `
        <div class="pfx-cp-swatch" style="background:${c}" data-color="${c}" title="${c}">
          <span>${c.replace('#', '')}</span>
        </div>
      `).join('');

      palEl.querySelectorAll('.pfx-cp-swatch').forEach((sw) => {
        sw.addEventListener('click', () => {
          input.value = sw.dataset.color;
          update(sw.dataset.color);
        });
      });
    }

    input.addEventListener('input', () => update(input.value));
    mount.querySelector('#pfxCpRandom').addEventListener('click', () => {
      const c = '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
      input.value = c;
      update(c);
    });
    mount.querySelector('#pfxCpCopy').addEventListener('click', () => {
      const btn = mount.querySelector('#pfxCpCopy');
      const old = btn.innerHTML;
      copyText(hexEl.textContent, () => {
        btn.innerHTML = '<i class="fa-solid fa-check"></i> Tersalin';
        setTimeout(() => { btn.innerHTML = old; }, 900);
      });
    });

    update(input.value);
  }

  /* ---------------------------------------------------------
     3) PENG HD IMAGINE (image upscaler)
  --------------------------------------------------------- */
  function renderPengHD(mount) {
    mount.innerHTML = `
      <div class="pfx-tool-hero">
        <div class="pfx-tool-hero-icon" style="--c1:#10b981;--c2:#06b6d4">
          <i class="fa-solid fa-wand-magic-sparkles"></i>
        </div>
        <div>
          <div class="pfx-tool-hero-title">Peng HD Imagine</div>
          <div class="pfx-tool-hero-desc">Tingkatkan resolusi foto biar lebih tajam & jernih.</div>
        </div>
      </div>

      <label class="pfx-phd-drop" id="pfxPhdDrop">
        <input type="file" accept="image/*" id="pfxPhdFile" hidden />
        <i class="fa-solid fa-cloud-arrow-up"></i>
        <div class="pfx-phd-drop-title">Pilih Foto</div>
        <div class="pfx-phd-drop-desc">Tap untuk upload dari galeri</div>
      </label>

      <div class="pfx-phd-stage" id="pfxPhdStage" style="display:none;">
        <div class="pfx-phd-compare">
          <img id="pfxPhdImg" alt="preview" />
        </div>
        <div class="pfx-phd-info" id="pfxPhdInfo"></div>

        <div class="pfx-phd-row">
          <label class="pfx-phd-scale">
            <span>Skala</span>
            <select id="pfxPhdScale">
              <option value="2">2×</option>
              <option value="3">3×</option>
              <option value="4" selected>4×</option>
            </select>
          </label>
          <button type="button" class="pfx-tool-btn pfx-tool-btn-primary" id="pfxPhdProcess">
            <i class="fa-solid fa-wand-sparkles"></i> Proses HD
          </button>
        </div>

        <div class="pfx-phd-progress" id="pfxPhdProgress" style="display:none;">
          <div class="pfx-phd-progress-bar">
            <div class="pfx-phd-progress-fill" id="pfxPhdProgFill"></div>
          </div>
          <div class="pfx-phd-progress-text" id="pfxPhdProgText">Memproses...</div>
        </div>

        <div class="pfx-phd-result" id="pfxPhdResult" style="display:none;">
          <img id="pfxPhdOutImg" alt="hasil" />
          <a class="pfx-tool-btn pfx-tool-btn-primary" id="pfxPhdDownload" download="peng-hd.jpg">
            <i class="fa-solid fa-download"></i> Unduh Hasil HD
          </a>
        </div>
      </div>
    `;

    const fileIn   = mount.querySelector('#pfxPhdFile');
    const drop     = mount.querySelector('#pfxPhdDrop');
    const stage    = mount.querySelector('#pfxPhdStage');
    const img      = mount.querySelector('#pfxPhdImg');
    const info     = mount.querySelector('#pfxPhdInfo');
    const scaleSel = mount.querySelector('#pfxPhdScale');
    const procBtn  = mount.querySelector('#pfxPhdProcess');
    const progress = mount.querySelector('#pfxPhdProgress');
    const progFill = mount.querySelector('#pfxPhdProgFill');
    const progText = mount.querySelector('#pfxPhdProgText');
    const result   = mount.querySelector('#pfxPhdResult');
    const outImg   = mount.querySelector('#pfxPhdOutImg');
    const dl       = mount.querySelector('#pfxPhdDownload');

    let srcImg = null;
    let srcName = 'image';

    fileIn.addEventListener('change', () => {
      const f = fileIn.files && fileIn.files[0];
      if (!f) return;

      srcName = (f.name || 'image').replace(/\.[^.]+$/, '') || 'image';
      const url = URL.createObjectURL(f);
      const im = new Image();

      im.onload = () => {
        srcImg = im;
        img.src = url;
        stage.style.display = 'block';
        drop.style.display = 'none';
        result.style.display = 'none';
        progress.style.display = 'none';
        info.textContent =
          `Original: ${im.naturalWidth} × ${im.naturalHeight} px • ${(f.size / 1024).toFixed(1)} KB`;
      };
      im.onerror = () => { info.textContent = 'Gagal memuat gambar.'; };
      im.src = url;
    });

    function upscaleStep(src, w, h) {
      const c = document.createElement('canvas');
      c.width = w; c.height = h;
      const cx = c.getContext('2d');
      cx.imageSmoothingEnabled = true;
      cx.imageSmoothingQuality = 'high';
      cx.drawImage(src, 0, 0, w, h);
      return c;
    }

    procBtn.addEventListener('click', () => {
      if (!srcImg) return;

      const scale = parseInt(scaleSel.value, 10) || 2;
      const W = srcImg.naturalWidth * scale;
      const H = srcImg.naturalHeight * scale;

      if (W * H > 40e6) {
        progText.textContent = 'Gambar terlalu besar untuk diproses di perangkat ini.';
        progress.style.display = 'block';
        return;
      }

      procBtn.disabled = true;
      progress.style.display = 'block';
      result.style.display = 'none';
      progFill.style.width = '0%';
      progText.textContent = 'Mempersiapkan...';

      let p = 0;
      const tick = () => {
        p = Math.min(95, p + (p < 70 ? 14 : 5));
        progFill.style.width = p + '%';
        if (p < 95) setTimeout(tick, 70);
      };
      tick();

      setTimeout(() => {
        try {
          let cur = srcImg;
          let cw = srcImg.naturalWidth;
          let ch = srcImg.naturalHeight;

          while (cw * 2 <= W) {
            const nw = cw * 2, nh = ch * 2;
            cur = upscaleStep(cur, nw, nh);
            cw = nw; ch = nh;
            if (cw >= W) break;
          }

          const out = document.createElement('canvas');
          out.width = W; out.height = H;
          const ctx = out.getContext('2d');
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.filter = 'contrast(1.05) saturate(1.08) brightness(1.02)';
          ctx.drawImage(cur, 0, 0, W, H);
          ctx.filter = 'none';

          ctx.globalAlpha = 0.15;
          ctx.globalCompositeOperation = 'overlay';
          ctx.drawImage(out, 0, 0);
          ctx.globalAlpha = 1;
          ctx.globalCompositeOperation = 'source-over';

          const dataUrl = out.toDataURL('image/jpeg', 0.94);
          outImg.src = dataUrl;
          dl.href = dataUrl;
          dl.download = srcName + '-hd.jpg';

          result.style.display = 'block';
          info.textContent = `Hasil: ${W} × ${H} px (${scale}×)`;
          progFill.style.width = '100%';
          progText.textContent = 'Selesai!';

          setTimeout(() => {
            progress.style.display = 'none';
            if (result.scrollIntoView) {
              result.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
          }, 500);
        } catch (e) {
          progText.textContent = 'Gagal memproses: ' + (e && e.message ? e.message : 'unknown');
        } finally {
          procBtn.disabled = false;
        }
      }, 350);
    });
  }

  /* ---------------------------------------------------------
     Register
  --------------------------------------------------------- */
  function register() {
    if (typeof window.PretvfxToolsRegister !== 'function') {
      console.warn('[Tools-Extra] PretvfxToolsRegister belum tersedia');
      return;
    }
    window.PretvfxToolsRegister('wordcount',   renderCalculator);
    window.PretvfxToolsRegister('colorpicker', renderColorPicker);
    window.PretvfxToolsRegister('unitconvert', renderPengHD);
    console.log('[Tools-Extra] ✅ terdaftar');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', register);
  } else {
    register();
  }
})();