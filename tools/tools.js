// ============================================================
// Pretvfx-Tools — Daftar Tool
// Format: { id, icon, accent, title, desc, category }
// accent: indigo | cyan | green | amber | rose
// ============================================================
// ============================================================
// Registry renderer custom — tool yang punya tampilan sendiri
// Daftarkan dari file lain: window.PretvfxToolsRegister('id', fn)
// ============================================================
const TOOL_RENDERERS = {};

window.PretvfxToolsRegister = function(id, renderFn) {
  if (typeof id === 'string' && typeof renderFn === 'function') {
    TOOL_RENDERERS[id] = renderFn;
  }
};

const TOOLS_LIST = [
  {
    id: 'qrcode',
    icon: 'fa-solid fa-qrcode',
    accent: 'indigo',
    title: 'QR Code',
    desc: 'Bikin QR dari teks, link, atau nomor telepon',
    category: 'Generator'
  },
  {
    id: 'downloader',
    icon: 'fa-solid fa-circle-down',
    accent: 'cyan',
    title: 'Downloader',
    desc: 'TikTok / YouTube / Instagram / Facebook tanpa watermark',
    category: 'Downloader'
  },
  {
    id: 'ngaji',
    icon: 'fa-solid fa-book-quran',
    accent: 'green',
    title: 'Ngaji',
    desc: '114 surah + audio murottal Al-Quran',
    category: 'Utility'
  },
  {
    id: 'wordcount',
    icon: 'fa-solid fa-calculator',
    accent: 'green',
    title: 'Kalkulator',
    desc: 'Hitung angka: +, −, ×, ÷ & persen',
    category: 'Utility'
  },
  {
    id: 'colorpicker',
    icon: 'fa-solid fa-palette',
    accent: 'indigo',
    title: 'Pemilih Warna',
    desc: 'Ambil warna & bikin palet pilihan',
    category: 'Design'
  },
  {
    id: 'unitconvert',
    icon: 'fa-solid fa-wand-magic-sparkles',
    accent: 'green',
    title: 'Peng HD Imagine',
    desc: 'per hd foto anda',
    category: 'Utility'
  }
];

// ---------- Suntik markup ----------
document.body.insertAdjacentHTML('beforeend', `
  <div class="tools-overlay" id="toolsOverlay" aria-hidden="true">
    <div class="tools-header">
      <button type="button" class="tools-close-btn" id="toolsCloseBtn" aria-label="Tutup" title="Tutup">
        <i class="fa-solid fa-arrow-left" id="toolsCloseIcon"></i>
      </button>
      <div class="tools-title-wrap">
        <div class="tools-title" id="toolsTitle">Pretvfx-Tools</div>
        <div class="tools-subtitle" id="toolsSubtitle">Kumpulan alat bantu cepat</div>
      </div>
    </div>
    <div class="tools-scroll" id="toolsScroll">
      <div class="tools-grid" id="toolsGrid"></div>
    </div>
  </div>
`);

const overlayEl  = document.getElementById('toolsOverlay');
const scrollEl   = document.getElementById('toolsScroll');
const titleEl    = document.getElementById('toolsTitle');
const subtitleEl = document.getElementById('toolsSubtitle');
const closeBtnEl = document.getElementById('toolsCloseBtn');

// ---------- Ikon tombol header ----------
function setHeaderIconToBack() {
  const icon = document.getElementById('toolsCloseIcon');
  if (!icon) return;
  icon.className = 'fa-solid fa-arrow-left';
  closeBtnEl.classList.remove('is-logo-only');
  closeBtnEl.disabled = false;
  closeBtnEl.title = 'Tutup';
  closeBtnEl.setAttribute('aria-label', 'Tutup');
}

// ---------- Render grid ----------
function renderGrid() {
  scrollEl.innerHTML = `<div class="tools-grid" id="toolsGrid"></div>`;
  const grid = document.getElementById('toolsGrid');

  grid.innerHTML = TOOLS_LIST.map((t, i) => `
    <button type="button" class="tools-card" data-tool="${t.id}" style="animation-delay:${i * 40}ms">
      <div class="tools-card-icon accent-${t.accent}">
        <i class="${t.icon}"></i>
      </div>
      <div class="tools-card-title">${t.title}</div>
      <div class="tools-card-desc">${t.desc}</div>
    </button>
  `).join('');

  grid.querySelectorAll('.tools-card').forEach(card => {
    card.addEventListener('click', () => openTool(card.dataset.tool));
  });
}

// ============================================================
// History state — supaya tombol back / gestur HP bisa di-handle
// ============================================================
let pfxToolsHistoryDepth = 0;   // 0 = tertutup, 1 = grid, 2 = detail

// ---------- Buka detail tool ----------
function openTool(id) {
  const tool = TOOLS_LIST.find(t => t.id === id);
  if (!tool) return;

  titleEl.textContent = tool.title;
  subtitleEl.textContent = tool.category || 'Tool';
  setHeaderIconToBack();  // tetap panah kembali (bukan logo tool)

  scrollEl.innerHTML = `
    <div class="tools-detail-view">
      <div id="toolsToolMount"></div>
    </div>
  `;

  const mount = document.getElementById('toolsToolMount');
  const renderer = TOOL_RENDERERS[id];

  if (renderer) {
    // Tool punya tampilan custom sendiri (QR, Downloader, Ngaji, Kalkulator, dll)
    renderer(mount, tool);
  } else {
    // Fallback: placeholder
    mount.innerHTML = `
      <div class="tools-detail-hero">
        <div class="tools-detail-icon">
          <i class="${tool.icon}"></i>
        </div>
        <div class="tools-detail-title">${tool.title}</div>
        <div class="tools-detail-desc">${tool.desc}</div>
      </div>
      <div class="tools-placeholder">
        <i class="fa-solid fa-screwdriver-wrench"></i>
        <div class="tools-placeholder-title">Fitur segera hadir</div>
        <div class="tools-placeholder-desc">
          Tampilan <b>${tool.title}</b> sudah siap. Fungsi/logika-nya tinggal ditambahkan
          di file <code>tools/tools.js</code> bagian <code>openTool('${tool.id}')</code>.
        </div>
      </div>
    `;
  }

  scrollEl.scrollTop = 0;

  // Push state untuk detail (kedalaman 2)
  try {
    history.pushState({ pfxtools: 'detail', toolId: id }, '');
    pfxToolsHistoryDepth = 2;
  } catch (e) {}
}

// ---------- Balik ke grid ----------
function backToGrid() {
  titleEl.textContent = 'Pretvfx-Tools';
  subtitleEl.textContent = 'Kumpulan alat bantu cepat';
  setHeaderIconToBack();
  renderGrid();
  scrollEl.scrollTop = 0;
}

// ---------- Cek lagi di detail atau grid ----------
function isInDetailView() {
  return !document.getElementById('toolsGrid');
}

// ---------- Kontrol buka/tutup ----------
function openTools() {
  backToGrid();
  overlayEl.classList.add('show');
  overlayEl.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';

  // Push state untuk grid (kedalaman 1)
  try {
    history.pushState({ pfxtools: 'grid' }, '');
    pfxToolsHistoryDepth = 1;
  } catch (e) {}
}

function closeToolsInternal() {
  overlayEl.classList.remove('show');
  overlayEl.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  pfxToolsHistoryDepth = 0;
}

// Dipanggil dari tombol header / Escape / API publik
function closeTools() {
  const depth = pfxToolsHistoryDepth;
  pfxToolsHistoryDepth = 0;
  closeToolsInternal();
  if (depth > 0) {
    try { history.go(-depth); } catch (e) {}
  }
}

// ============================================================
// Popstate — ini yang nangkep tombol back / gestur HP
// ============================================================
window.addEventListener('popstate', (e) => {
  // Kalau overlay gak sedang terbuka, biarin browser handle sendiri
  if (!overlayEl.classList.contains('show')) return;

  const st = e.state;

  if (st && st.pfxtools === 'grid') {
    // User mundur dari DETAIL → balik ke GRID
    backToGrid();
    pfxToolsHistoryDepth = 1;
  } else {
    // User mundur dari GRID → tutup Tools
    closeToolsInternal();
  }
});

// ---------- Handler tombol header ----------
// Grid  → tombol panah = tutup Tools
// Detail → tombol panah = balik ke grid (via history.back)
closeBtnEl.addEventListener('click', () => {
  if (closeBtnEl.disabled) return;
  if (isInDetailView()) {
    try { history.back(); } catch (e) { backToGrid(); }
  } else {
    closeTools();
  }
});

// ---------- Keyboard: Escape ----------
document.addEventListener('keydown', (e) => {
  if (e.key !== 'Escape' || !overlayEl.classList.contains('show')) return;
  if (isInDetailView()) {
    try { history.back(); } catch (err) { backToGrid(); }
  } else {
    closeTools();
  }
});

// ---------- Init render sekali ----------
renderGrid();

// ---------- Expose ke window (dipanggil dari pretvfx-ai.js) ----------
window.PretvfxTools = {
  open: openTools,
  close: closeTools,
  openTool,
  backToGrid,
  _tools: TOOLS_LIST
};