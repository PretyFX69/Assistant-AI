/**
 * Pretvfx-Music — v11
 *  - FIX: marquee judul tidak lagi nyangkut saat ganti lagu
 *  - Marquee only re-init kalau teks berubah (biar animasi seamless, gak restart terus)
 *  - FIX: tombol repeat sekarang OFF ↔ ONE (ulang lagu yang sama), bukan ALL
 */

import { songs } from './music-data.js';
import {
  initPlayer, playSong, togglePlay, pause, stop, seek,
  playNext, playPrev, toggleShuffle, cycleRepeat,
  toggleLike, toggleSave, setPlaylist, playNextInQueue,
  setSleepTimer, getSleepRemaining, setPlaybackRate,
  downloadSongFile, downloadCoverImage, shareSong,
  getState, subscribe, formatTime, REPEAT
} from './player.js';
import { formatViews } from './player-state.js';

const PILLS = [
  { id: 'all', label: 'Semua' },
  { id: 'sad', label: 'Sedih' },
  { id: 'senang', label: 'Senang' },
  { id: 'trending', label: 'Trending' },
  { id: 'baru', label: 'Bersantai' }
];

const PREVIEW_COUNT = 10;
const SLIDE_SIZE = 5;
const SLIDE_COUNT = 5;
const ANCHOR_GAP = 10;

let root = null;
let currentFilter = 'all';
let searchQuery = '';
let heroIdx = 0;
let heroTimer = null;
let unsub = null;
let bubbleWasDragged = false;
let showAllSongs = false;
let currentSlide = 0;
let shuffledOrder = [];
let overlayOpenedAt = 0;
let overlayCloseTimer = null;
let lastOverlayCloseAt = 0;
let bubbleShowTimer = null;
let currentMenuSong = null;
let sleepTickInterval = null;

function el(tag, cls, html) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (html != null) e.innerHTML = html;
  return e;
}
function esc(s) {
  return String(s || '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}
function shuffleArray(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function chunk(arr, size) {
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}
function refreshShuffle() { shuffledOrder = shuffleArray(songs); }

function filterList(f) {
  if (f === 'all') return shuffledOrder.slice();
  if (f === 'baru') return shuffledOrder.slice(0, 15);
  return shuffledOrder.filter(s => {
    const tags = s.tags || [];
    if (tags.includes(f)) return true;
    if (f === 'sad' && tags.includes('sedih')) return true;
    return false;
  });
}

function fuzzy(q, list) {
  q = (q || '').trim().toLowerCase();
  if (!q) return list;
  if (window.Fuse) {
    const fuse = new window.Fuse(list, {
      keys: [
        { name: 'title', weight: 0.4 },
        { name: 'artist', weight: 0.3 },
        { name: 'tags', weight: 0.15 },
        { name: 'keywords', weight: 0.15 }
      ],
      threshold: 0.4, ignoreLocation: true, minMatchCharLength: 2
    });
    return fuse.search(q).map(r => r.item);
  }
  return list.filter(s => {
    const hay = [s.title, s.artist, ...(s.tags || []), ...(s.keywords || [])].join(' ').toLowerCase();
    return q.split(/\s+/).every(t => hay.includes(t));
  });
}

/* ========== DOM ========== */
function buildRoot() {
  if (root) return root;
  root = el('div', 'pfx-music-root');
  root.id = 'pfxMusicRoot';
  root.innerHTML = `
    <div class="pfx-m-topbar">
      <button type="button" class="pfx-m-icon-btn" id="pfxMusicBack" title="Kembali ke Pretvfx-AI">
        <i class="fa-solid fa-arrow-left"></i>
      </button>
      <div class="pfx-m-logo">
        <div class="pfx-m-logo-icon"><i class="fa-solid fa-music"></i></div>
        <span class="pfx-m-logo-title">Pretvfx</span>
        <span class="pfx-m-logo-sub">Music</span>
      </div>
      <div class="pfx-m-topbar-right">
        <button type="button" class="pfx-m-icon-btn" id="pfxMusicSearchBtn"><i class="fa-solid fa-magnifying-glass"></i></button>
      </div>
    </div>
    <div class="pfx-m-pills" id="pfxMusicPills"></div>
    <div class="pfx-m-body" id="pfxMusicBody"></div>
    <div class="pfx-npbar" id="pfxNpbar">
      <img class="pfx-npbar-cover" id="pfxNpCover" alt="" />
      <div class="pfx-npbar-meta">
        <div class="pfx-npbar-title"><span class="pfx-marquee" id="pfxNpTitle"></span></div>
        <div class="pfx-npbar-artist" id="pfxNpArtist"></div>
      </div>
      <div class="pfx-npbar-ctrls">
        <button type="button" class="pfx-npbar-btn" id="pfxNpPrev"><i class="fa-solid fa-backward-step"></i></button>
        <button type="button" class="pfx-npbar-btn" id="pfxNpPlay"><i class="fa-solid fa-play"></i></button>
        <button type="button" class="pfx-npbar-btn" id="pfxNpNext"><i class="fa-solid fa-forward-step"></i></button>
      </div>
      <div class="pfx-npbar-prog"><div class="pfx-npbar-prog-fill" id="pfxNpProg"></div></div>
    </div>
    <div class="pfx-search-view" id="pfxSearchView">
      <div class="pfx-search-bar">
        <button type="button" class="pfx-m-icon-btn" id="pfxSearchBack"><i class="fa-solid fa-arrow-left"></i></button>
        <input type="search" id="pfxSearchInput" placeholder="Cari lagu, artist, mood..." autocomplete="off" />
      </div>
      <div class="pfx-search-results" id="pfxSearchResults"></div>
    </div>
  `;
  document.body.appendChild(root);

  /* Full player */
  const fp = el('div', 'pfx-full-player');
  fp.id = 'pfxFullPlayer';
  fp.innerHTML = `
    <div class="pfx-fp-top">
      <button type="button" class="pfx-fp-back" id="pfxFpBack"><i class="fa-solid fa-chevron-down"></i></button>
      <div class="pfx-fp-source"><span>DIPUTAR DARI</span><strong>Pretvfx Music</strong></div>
      <button type="button" class="pfx-fp-more" id="pfxFpMore"><i class="fa-solid fa-ellipsis-vertical"></i></button>

      <div class="pfx-playermenu" id="pfxPlayerMenu">
        <button type="button" class="pfx-pm-item" data-act="download"><i class="fa-solid fa-download"></i> Download</button>
        <button type="button" class="pfx-pm-item" data-act="loop"><i class="fa-solid fa-repeat"></i> <span id="pfxLoopLabel">Loop: Off</span></button>
        <button type="button" class="pfx-pm-item" data-act="sleep"><i class="fa-solid fa-moon"></i> <span id="pfxSleepLabel">Sleep Timer</span></button>
        <button type="button" class="pfx-pm-item" data-act="speed"><i class="fa-solid fa-gauge-high"></i> <span id="pfxSpeedLabel">Kecepatan</span></button>
      </div>
    </div>
    <div class="pfx-fp-cover-wrap"><img class="pfx-fp-cover" id="pfxFpCover" alt="" /></div>
    <div class="pfx-fp-info">
      <div class="pfx-marquee-host"><div class="pfx-fp-title"><span class="pfx-marquee" id="pfxFpTitle"></span></div></div>
      <div class="pfx-marquee-host"><div class="pfx-fp-artist"><span class="pfx-marquee" id="pfxFpArtist"></span></div></div>
      <div class="pfx-fp-sleep" id="pfxFpSleep">
        <i class="fa-solid fa-moon"></i>
        <span id="pfxFpSleepTime">--:--</span>
      </div>
    </div>
    <div class="pfx-fp-actions">
      <button type="button" class="pfx-fp-action" id="pfxFpLike"><i class="fa-solid fa-thumbs-up"></i> Suka</button>
      <button type="button" class="pfx-fp-action" id="pfxFpDislike"><i class="fa-solid fa-thumbs-down"></i> Tidak Suka</button>
      <button type="button" class="pfx-fp-action" id="pfxFpSave"><i class="fa-solid fa-list-ul"></i> Simpan</button>
    </div>
    <div class="pfx-fp-progress">
      <div class="pfx-progress-bar" id="pfxFpProgressBar">
        <div class="pfx-progress-fill" id="pfxFpProgressFill"></div>
        <div class="pfx-progress-thumb" id="pfxFpProgressThumb"></div>
      </div>
      <div class="pfx-progress-times"><span id="pfxFpCur">0:00</span><span id="pfxFpDur">0:00</span></div>
    </div>
    <div class="pfx-fp-controls">
      <button type="button" class="pfx-ctrl" id="pfxFpShuffle"><i class="fa-solid fa-shuffle"></i></button>
      <button type="button" class="pfx-ctrl" id="pfxFpPrev"><i class="fa-solid fa-backward-step"></i></button>
      <button type="button" class="pfx-ctrl pfx-ctrl-play" id="pfxFpPlay"><i class="fa-solid fa-play"></i></button>
      <button type="button" class="pfx-ctrl" id="pfxFpNext"><i class="fa-solid fa-forward-step"></i></button>
      <button type="button" class="pfx-ctrl" id="pfxFpRepeat"><i class="fa-solid fa-repeat"></i></button>
    </div>
  `;
  document.body.appendChild(fp);

  /* Bubble */
  const bubble = el('div', 'pfx-music-bubble');
  bubble.id = 'pfxMusicBubble';
  bubble.innerHTML = `
    <div class="pfx-bubble-pulse"></div>
    <img id="pfxBubbleCover" alt="" />
    <button type="button" class="pfx-bubble-close" id="pfxBubbleClose"><i class="fa-solid fa-xmark"></i></button>
  `;
  document.body.appendChild(bubble);

  /* Float overlay */
  const fo = el('div', 'pfx-float-overlay');
  fo.id = 'pfxFloatOverlay';
  fo.innerHTML = `
    <div class="pfx-fo-head">
      <img class="pfx-fo-cover" id="pfxFoCover" alt="" />
      <div class="pfx-fo-meta">
        <div class="pfx-fo-title"><span class="pfx-marquee" id="pfxFoTitle"></span></div>
        <div class="pfx-fo-artist" id="pfxFoArtist"></div>
      </div>
      <button type="button" class="pfx-fo-close" id="pfxFoClose"><i class="fa-solid fa-xmark"></i></button>
    </div>
    <div class="pfx-fo-progress">
      <div class="pfx-progress-bar" id="pfxFoProgressBar">
        <div class="pfx-progress-fill" id="pfxFoProgressFill"></div>
        <div class="pfx-progress-thumb" id="pfxFoProgressThumb"></div>
      </div>
      <div class="pfx-progress-times"><span id="pfxFoCur">0:00</span><span id="pfxFoDur">0:00</span></div>
    </div>
    <div class="pfx-fo-controls">
      <button type="button" class="pfx-fo-ctrl" id="pfxFoShuffle"><i class="fa-solid fa-shuffle"></i></button>
      <button type="button" class="pfx-fo-ctrl" id="pfxFoPrev"><i class="fa-solid fa-backward-step"></i></button>
      <button type="button" class="pfx-fo-ctrl pfx-fo-play" id="pfxFoPlay"><i class="fa-solid fa-play"></i></button>
      <button type="button" class="pfx-fo-ctrl" id="pfxFoNext"><i class="fa-solid fa-forward-step"></i></button>
      <button type="button" class="pfx-fo-ctrl" id="pfxFoRepeat"><i class="fa-solid fa-repeat"></i></button>
    </div>
  `;
  document.body.appendChild(fo);

  /* Song menu bottom sheet */
  const songmenu = el('div', 'pfx-songmenu-overlay');
  songmenu.id = 'pfxSongMenuOverlay';
  songmenu.innerHTML = `
    <div class="pfx-songmenu" id="pfxSongMenu">
      <div class="pfx-sm-handle"></div>
      <div class="pfx-sm-head">
        <img class="pfx-sm-cover" id="pfxSmCover" alt="" />
        <div class="pfx-sm-info">
          <div class="pfx-sm-title" id="pfxSmTitle"></div>
          <div class="pfx-sm-artist" id="pfxSmArtist"></div>
        </div>
        <button type="button" class="pfx-sm-close" id="pfxSmClose"><i class="fa-solid fa-xmark"></i></button>
      </div>
      <div class="pfx-sm-actions">
        <button type="button" class="pfx-sm-action" data-act="playnext">
          <i class="fa-solid fa-list"></i><span>Putar<br>setelah ini</span>
        </button>
        <button type="button" class="pfx-sm-action" data-act="share">
          <i class="fa-solid fa-share-nodes"></i><span>Bagikan</span>
        </button>
        <button type="button" class="pfx-sm-action" data-act="savegallery">
          <i class="fa-regular fa-image"></i><span>Simpan ke<br>galeri</span>
        </button>
      </div>
      <div class="pfx-sm-list">
        <button type="button" class="pfx-sm-item" data-act="play"><i class="fa-solid fa-play"></i> Putar</button>
        <button type="button" class="pfx-sm-item" data-act="download"><i class="fa-solid fa-download"></i> Download</button>
      </div>
    </div>
  `;
  document.body.appendChild(songmenu);

  /* Sleep Timer sheet */
  const sleepOv = el('div', 'pfx-modal-overlay');
  sleepOv.id = 'pfxSleepOverlay';
  sleepOv.innerHTML = `
    <div class="pfx-modal" id="pfxSleepModal">
      <div class="pfx-modal-handle"></div>
      <div class="pfx-modal-head">
        <i class="fa-solid fa-moon"></i>
        <span>Sleep Timer</span>
      </div>
      <div class="pfx-modal-sub" id="pfxSleepSub">Pilih durasi timer</div>
      <div class="pfx-modal-grid">
        <button type="button" class="pfx-modal-opt" data-min="15">15<span>menit</span></button>
        <button type="button" class="pfx-modal-opt" data-min="30">30<span>menit</span></button>
        <button type="button" class="pfx-modal-opt" data-min="60">60<span>menit</span></button>
        <button type="button" class="pfx-modal-opt" data-min="90">90<span>menit</span></button>
        <button type="button" class="pfx-modal-opt" data-min="120">120<span>menit</span></button>
        <button type="button" class="pfx-modal-opt danger" data-min="0">Matikan<span>timer</span></button>
      </div>
      <div class="pfx-modal-custom-label">Custom</div>
      <div class="pfx-modal-custom">
        <div class="pfx-modal-input-wrap">
          <i class="fa-regular fa-clock"></i>
          <input type="number" min="1" max="600" placeholder="Menit..." id="pfxSleepInput" />
        </div>
        <button type="button" class="pfx-modal-set" id="pfxSleepSet">Set</button>
      </div>
    </div>
  `;
  document.body.appendChild(sleepOv);

  /* Speed sheet */
  const speedOv = el('div', 'pfx-modal-overlay');
  speedOv.id = 'pfxSpeedOverlay';
  speedOv.innerHTML = `
    <div class="pfx-modal" id="pfxSpeedModal">
      <div class="pfx-modal-handle"></div>
      <div class="pfx-modal-head">
        <i class="fa-solid fa-gauge-high"></i>
        <span>Kecepatan Music</span>
      </div>
      <div class="pfx-modal-sub">Sekarang: <strong id="pfxSpeedCurrent">1x</strong></div>
      <div class="pfx-modal-grid">
        <button type="button" class="pfx-modal-opt" data-rate="0.5">0.5x</button>
        <button type="button" class="pfx-modal-opt" data-rate="0.75">0.75x</button>
        <button type="button" class="pfx-modal-opt" data-rate="1">1x</button>
        <button type="button" class="pfx-modal-opt" data-rate="1.25">1.25x</button>
        <button type="button" class="pfx-modal-opt" data-rate="1.5">1.5x</button>
        <button type="button" class="pfx-modal-opt" data-rate="2">2x</button>
      </div>
      <div class="pfx-modal-custom-label">Custom</div>
      <div class="pfx-modal-custom">
        <div class="pfx-modal-input-wrap">
          <i class="fa-solid fa-gauge-high"></i>
          <input type="number" min="0.25" max="3" step="0.05" placeholder="cth: 1.5" id="pfxSpeedInput" />
        </div>
        <button type="button" class="pfx-modal-set" id="pfxSpeedSet">Set</button>
      </div>
    </div>
  `;
  document.body.appendChild(speedOv);

  const toast = el('div', 'pfx-toast');
  toast.id = 'pfxMusicToast';
  document.body.appendChild(toast);

  wireEvents();
  setupGlobalOverlayAutoClose();
  startSleepTicker();
  return root;
}

/* ========== EVENTS ========== */
function wireEvents() {
  document.getElementById('pfxMusicBack').onclick = () => closeMusicView(true);
  document.getElementById('pfxMusicSearchBtn').onclick = () => openSearch();
  document.getElementById('pfxSearchBack').onclick = () => closeSearch();
  document.getElementById('pfxSearchInput').oninput = (e) => {
    searchQuery = e.target.value;
    renderSearch();
  };

  const np = document.getElementById('pfxNpbar');
  np.addEventListener('click', (e) => {
    if (e.target.closest('.pfx-npbar-btn')) return;
    openFullPlayer();
  });
  document.getElementById('pfxNpPrev').onclick = (e) => { e.stopPropagation(); playPrev(); };
  document.getElementById('pfxNpPlay').onclick = (e) => { e.stopPropagation(); togglePlay(); };
  document.getElementById('pfxNpNext').onclick = (e) => { e.stopPropagation(); playNext(); };

  document.getElementById('pfxFpBack').onclick = () => closeFullPlayer();
  document.getElementById('pfxFpPlay').onclick = () => togglePlay();
  document.getElementById('pfxFpPrev').onclick = () => playPrev();
  document.getElementById('pfxFpNext').onclick = () => playNext();
  document.getElementById('pfxFpShuffle').onclick = () => toggleShuffle();
  document.getElementById('pfxFpRepeat').onclick = () => toggleRepeatOne();
  document.getElementById('pfxFpLike').onclick = () => { const s = getState().currentSong; if (s) toggleLike(s.id); };
  document.getElementById('pfxFpSave').onclick = () => { const s = getState().currentSong; if (s) toggleSave(s.id); };
  document.getElementById('pfxFpDislike').onclick = () => showToast('Masukan diterima');

  bindProgress('pfxFpProgressBar');
  bindProgress('pfxFoProgressBar');

  setupBubbleDrag();

  document.getElementById('pfxBubbleClose').addEventListener('click', (e) => {
    e.stopPropagation(); e.preventDefault();
    stop(); hideBubble(); hideFloatOverlay();
  });

  document.getElementById('pfxFoClose').addEventListener('click', (e) => {
    e.stopPropagation(); e.preventDefault();
    hideFloatOverlay();
  });

  document.getElementById('pfxFoPlay').onclick = (e) => { e.stopPropagation(); resetOverlayCloseTimer(); togglePlay(); };
  document.getElementById('pfxFoPrev').onclick = (e) => { e.stopPropagation(); resetOverlayCloseTimer(); playPrev(); };
  document.getElementById('pfxFoNext').onclick = (e) => { e.stopPropagation(); resetOverlayCloseTimer(); playNext(); };
  document.getElementById('pfxFoShuffle').onclick = (e) => { e.stopPropagation(); resetOverlayCloseTimer(); toggleShuffle(); };
  document.getElementById('pfxFoRepeat').onclick = (e) => { e.stopPropagation(); resetOverlayCloseTimer(); toggleRepeatOne(); };

  /* Full player 3-dot menu */
  document.getElementById('pfxFpMore').addEventListener('click', (e) => {
    e.stopPropagation();
    togglePlayerMenu();
  });
  document.querySelectorAll('#pfxPlayerMenu .pfx-pm-item').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      handlePlayerMenuAction(btn.dataset.act);
    });
  });

  /* Auto-close player menu saat klik/tap di luar */
  document.addEventListener('click', (e) => {
    const m = document.getElementById('pfxPlayerMenu');
    if (!m || !m.classList.contains('show')) return;
    if (m.contains(e.target)) return;
    if (e.target.closest && e.target.closest('#pfxFpMore')) return;
    closePlayerMenu();
  }, true);

  document.addEventListener('touchstart', (e) => {
    const m = document.getElementById('pfxPlayerMenu');
    if (!m || !m.classList.contains('show')) return;
    if (m.contains(e.target)) return;
    if (e.target.closest && e.target.closest('#pfxFpMore')) return;
    closePlayerMenu();
  }, { passive: true });

  /* Song menu bottom sheet */
  document.getElementById('pfxSongMenuOverlay').addEventListener('click', (e) => {
    if (e.target.id === 'pfxSongMenuOverlay') closeSongMenu();
  });
  document.getElementById('pfxSmClose').onclick = () => closeSongMenu();
  document.querySelectorAll('#pfxSongMenu .pfx-sm-action, #pfxSongMenu .pfx-sm-item').forEach(btn => {
    btn.addEventListener('click', () => handleSongMenuAction(btn.dataset.act));
  });

  /* Sleep Timer sheet */
  const sleepOv = document.getElementById('pfxSleepOverlay');
  sleepOv.addEventListener('click', (e) => { if (e.target === sleepOv) closeSleepSheet(); });
  sleepOv.querySelectorAll('.pfx-modal-opt').forEach(btn => {
    btn.addEventListener('click', () => {
      const min = Number(btn.dataset.min) || 0;
      setSleepTimer(min);
      showToast(min > 0 ? `Sleep timer ${min} menit diaktifkan` : 'Sleep timer dimatikan');
      closeSleepSheet();
      updatePlayerMenuLabels();
      updateSleepBadge();
    });
  });
  document.getElementById('pfxSleepSet').onclick = () => {
    const val = Number(document.getElementById('pfxSleepInput').value) || 0;
    if (val <= 0) { showToast('Masukkan menit yang valid'); return; }
    setSleepTimer(val);
    showToast(`Sleep timer ${val} menit diaktifkan`);
    closeSleepSheet();
    updatePlayerMenuLabels();
    updateSleepBadge();
  };

  /* Speed sheet */
  const speedOv = document.getElementById('pfxSpeedOverlay');
  speedOv.addEventListener('click', (e) => { if (e.target === speedOv) closeSpeedSheet(); });
  speedOv.querySelectorAll('.pfx-modal-opt').forEach(btn => {
    btn.addEventListener('click', () => {
      const rate = Number(btn.dataset.rate) || 1;
      setPlaybackRate(rate);
      document.getElementById('pfxSpeedCurrent').textContent = `${rate}x`;
      showToast(`Kecepatan: ${rate}x`);
      updatePlayerMenuLabels();
      setTimeout(closeSpeedSheet, 250);
    });
  });
  document.getElementById('pfxSpeedSet').onclick = () => {
    const val = Number(document.getElementById('pfxSpeedInput').value);
    if (!val || val < 0.25 || val > 3) { showToast('Rentang 0.25x – 3x'); return; }
    setPlaybackRate(val);
    document.getElementById('pfxSpeedCurrent').textContent = `${val}x`;
    showToast(`Kecepatan: ${val}x`);
    updatePlayerMenuLabels();
    setTimeout(closeSpeedSheet, 250);
  };

  window.addEventListener('pretvfx-music-error', (e) => showToast(e.detail || 'Gagal memutar lagu'));
}

function bindProgress(barId) {
  const bar = document.getElementById(barId);
  if (!bar) return;
  let seeking = false;
  const toTime = (x) => {
    const r = bar.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (x - r.left) / r.width));
    return ratio * (getState().duration || 0);
  };
  bar.addEventListener('mousedown', (e) => { seeking = true; bar.classList.add('seeking'); seek(toTime(e.clientX)); });
  window.addEventListener('mousemove', (e) => { if (seeking) seek(toTime(e.clientX)); });
  window.addEventListener('mouseup', () => { seeking = false; bar.classList.remove('seeking'); });
  bar.addEventListener('touchstart', (e) => { seeking = true; bar.classList.add('seeking'); seek(toTime(e.touches[0].clientX)); }, { passive: true });
  window.addEventListener('touchmove', (e) => { if (seeking) seek(toTime(e.touches[0].clientX)); }, { passive: true });
  window.addEventListener('touchend', () => { seeking = false; bar.classList.remove('seeking'); });
}

/* ========== RENDER ========== */
function renderPills() {
  const wrap = document.getElementById('pfxMusicPills');
  wrap.innerHTML = '';
  PILLS.forEach(p => {
    const b = el('button', 'pfx-m-pill' + (p.id === currentFilter ? ' active' : ''));
    b.type = 'button';
    b.textContent = p.label;
    b.onclick = () => {
      currentFilter = p.id; showAllSongs = false; currentSlide = 0;
      renderPills(); renderHome();
    };
    wrap.appendChild(b);
  });
}

function qitemHtml(s) {
  const st = getState();
  const playing = st.currentSong && st.currentSong.id === s.id;
  return `
    <div class="pfx-qitem${playing ? ' playing' : ''}" data-id="${s.id}">
      <img class="pfx-q-thumb" src="${s.image}" alt="" loading="lazy" decoding="async" width="52" height="52" onerror="this.style.opacity=0.3" />
      <div class="pfx-q-info">
        <div class="pfx-q-title">${esc(s.title)}</div>
        <div class="pfx-q-sub">${esc(s.artist)} · ${formatViews(s.views)} pemutaran</div>
      </div>
      <button type="button" class="pfx-q-dots-menu" data-id="${s.id}"><i class="fa-solid fa-ellipsis-vertical"></i></button>
    </div>`;
}

function renderHome() {
  const body = document.getElementById('pfxMusicBody');
  const list = filterList(currentFilter);
  setPlaylist(list);

  if (!list.length) {
    body.innerHTML = `<div class="pfx-m-empty"><i class="fa-solid fa-music"></i><strong>Musik tidak ditemukan</strong></div>`;
    return;
  }

  const heroList = list.slice(0, Math.min(8, list.length));
  const quickList = list.slice(0, SLIDE_SIZE * SLIDE_COUNT);
  const slides = chunk(quickList, SLIDE_SIZE);
  const trend = (filterList('trending').length ? filterList('trending') : list).slice(0, 8);
  const grid = list.slice(0, 6);
  const visibleList = showAllSongs ? list : list.slice(0, PREVIEW_COUNT);
  const hasMore = list.length > visibleList.length;

  let html = `
    <div class="pfx-hero" id="pfxHero">
      <div class="pfx-hero-track" id="pfxHeroTrack">
        ${heroList.map(s => `
          <div class="pfx-hero-slide" data-id="${s.id}">
            <img src="${s.image}" alt="" loading="eager" decoding="async" onerror="this.style.opacity=0.3" />
            <div class="pfx-hero-overlay">
              <div class="pfx-hero-label">Rekomendasi</div>
              <div class="pfx-hero-title">${esc(s.title)}</div>
              <div class="pfx-hero-meta">${esc(s.artist)} · ${formatViews(s.views)} pemutaran</div>
              <button type="button" class="pfx-hero-play" data-id="${s.id}"><i class="fa-solid fa-play"></i> Putar</button>
            </div>
          </div>`).join('')}
      </div>
      <div class="pfx-hero-dots" id="pfxHeroDots">
        ${heroList.map((_, i) => `<div class="pfx-hero-dot${i === 0 ? ' active' : ''}"></div>`).join('')}
      </div>
    </div>

    <div class="pfx-sec-head">
      <span class="pfx-sec-title">Pilihan cepat</span>
      <button type="button" class="pfx-play-all" id="pfxPlayAll"><i class="fa-solid fa-play"></i> Putar semua</button>
    </div>

    <div class="pfx-q-slides" id="pfxQSlides">
      <div class="pfx-q-track" id="pfxQTrack">
        ${slides.map(slide => `<div class="pfx-q-slide">${slide.map(s => qitemHtml(s)).join('')}</div>`).join('')}
      </div>
      <div class="pfx-q-dots" id="pfxQDots">
        ${slides.map((_, i) => `<button type="button" class="pfx-q-dot${i === 0 ? ' active' : ''}" data-slide="${i}" aria-label="Slide ${i + 1}"></button>`).join('')}
      </div>
    </div>

    <div class="pfx-sec-head" style="margin-top:12px"><span class="pfx-sec-title">Pintasan cepat</span></div>
    <div class="pfx-grid">
      ${grid.map(s => `
        <div class="pfx-gcard" data-id="${s.id}">
          <img src="${s.image}" alt="" loading="lazy" decoding="async" width="48" height="48" onerror="this.style.opacity=0.3" />
          <div class="pfx-glabel">${esc(s.title)}</div>
        </div>`).join('')}
    </div>

    <div class="pfx-sec-head"><span class="pfx-sec-title">Sedang Trending</span></div>
    <div class="pfx-hrow">
      ${trend.map(s => `
        <div class="pfx-hcard" data-id="${s.id}">
          <img class="pfx-h-img" src="${s.image}" alt="" loading="lazy" decoding="async" width="130" height="130" onerror="this.style.opacity=0.3" />
          <div class="pfx-h-title">${esc(s.title)}</div>
          <div class="pfx-h-sub">${esc(s.artist)}</div>
        </div>`).join('')}
    </div>

    <div class="pfx-sec-head">
      <span class="pfx-sec-title">Semua Lagu</span>
      <span class="pfx-sec-link">${list.length} lagu</span>
    </div>
    <div class="pfx-qlist" style="padding-bottom:6px">
      ${visibleList.map(s => qitemHtml(s)).join('')}
    </div>
    ${hasMore ? `<button type="button" class="pfx-more-btn" id="pfxShowMore"><i class="fa-solid fa-chevron-down"></i><span>Lihat lagu selengkapnya</span></button>` : ''}
  `;

  body.innerHTML = html;

  body.querySelectorAll('.pfx-qitem').forEach(item => {
    item.addEventListener('click', (e) => {
      if (e.target.closest('.pfx-q-dots-menu')) return;
      const id = Number(item.dataset.id);
      const song = songs.find(s => s.id === id);
      const idx = list.findIndex(s => s.id === id);
      if (song) { playSong(song, idx >= 0 ? idx : 0); openFullPlayer(); }
    });
  });
  body.querySelectorAll('.pfx-q-dots-menu').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = Number(btn.dataset.id);
      const song = songs.find(s => s.id === id);
      if (song) openSongMenu(song);
    });
  });
  body.querySelectorAll('.pfx-hero-play').forEach(btn => {
    btn.onclick = (e) => {
      e.stopPropagation();
      const id = Number(btn.dataset.id);
      const song = songs.find(s => s.id === id);
      const idx = list.findIndex(s => s.id === id);
      if (song) { playSong(song, idx); openFullPlayer(); }
    };
  });
  body.querySelectorAll('.pfx-hcard, .pfx-gcard').forEach(node => {
    node.addEventListener('click', () => {
      const id = Number(node.dataset.id);
      const song = songs.find(s => s.id === id);
      const idx = list.findIndex(s => s.id === id);
      if (song) { playSong(song, idx >= 0 ? idx : 0); openFullPlayer(); }
    });
  });
  body.querySelectorAll('.pfx-hero-slide').forEach(slide => {
    slide.addEventListener('click', (e) => {
      if (e.target.closest('.pfx-hero-play')) return;
      const id = Number(slide.dataset.id);
      const song = songs.find(s => s.id === id);
      const idx = list.findIndex(s => s.id === id);
      if (song) { playSong(song, idx >= 0 ? idx : 0); openFullPlayer(); }
    });
  });

  document.getElementById('pfxPlayAll')?.addEventListener('click', () => {
    if (list[0]) { playSong(list[0], 0); openFullPlayer(); }
  });

  const moreBtn = document.getElementById('pfxShowMore');
  if (moreBtn) {
    moreBtn.addEventListener('click', () => {
      showAllSongs = true;
      moreBtn.classList.add('expanded');
      renderHome();
      setTimeout(() => {
        const qlist = body.querySelectorAll('.pfx-qlist');
        const lastList = qlist[qlist.length - 1];
        if (lastList) lastList.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 30);
    });
  }

  initHero(heroList.length);
  initSlides(slides.length);
}

function initHero(total) {
  heroIdx = 0;
  clearInterval(heroTimer);
  const track = document.getElementById('pfxHeroTrack');
  const hero = document.getElementById('pfxHero');
  if (!track || !hero || total < 2) return;
  function go(i) {
    heroIdx = (i + total) % total;
    track.style.transform = `translateX(-${heroIdx * 100}%)`;
    document.querySelectorAll('#pfxHeroDots .pfx-hero-dot').forEach((d, j) => d.classList.toggle('active', j === heroIdx));
  }
  heroTimer = setInterval(() => go(heroIdx + 1), 4000);
  let tx = 0;
  hero.addEventListener('touchstart', e => { tx = e.touches[0].clientX; }, { passive: true });
  hero.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - tx;
    if (Math.abs(dx) > 40) go(heroIdx + (dx < 0 ? 1 : -1));
  }, { passive: true });
}

function goToSlide(i) {
  const total = document.querySelectorAll('#pfxQTrack .pfx-q-slide').length;
  if (!total) return;
  currentSlide = (i + total) % total;
  const track = document.getElementById('pfxQTrack');
  if (track) track.style.transform = `translateX(-${currentSlide * 100}%)`;
  document.querySelectorAll('#pfxQDots .pfx-q-dot').forEach((d, j) => d.classList.toggle('active', j === currentSlide));
}

function initSlides(total) {
  if (!total) return;
  currentSlide = 0;
  const track = document.getElementById('pfxQTrack');
  if (track) track.style.transform = 'translateX(0)';
  document.querySelectorAll('#pfxQDots .pfx-q-dot').forEach(dot => {
    dot.onclick = () => goToSlide(Number(dot.dataset.slide) || 0);
  });
  const container = document.getElementById('pfxQSlides');
  if (!container || container._swipeBound) return;
  container._swipeBound = true;
  let startX = 0, startY = 0, swiping = false;
  container.addEventListener('touchstart', (e) => {
    if (e.touches.length !== 1) return;
    startX = e.touches[0].clientX; startY = e.touches[0].clientY; swiping = false;
  }, { passive: true });
  container.addEventListener('touchmove', (e) => {
    if (e.touches.length !== 1) return;
    const dx = e.touches[0].clientX - startX;
    const dy = e.touches[0].clientY - startY;
    if (!swiping && Math.abs(dx) > Math.abs(dy) + 6 && Math.abs(dx) > 16) swiping = true;
    if (swiping && e.cancelable) e.preventDefault();
  }, { passive: false });
  container.addEventListener('touchend', (e) => {
    if (!swiping) return;
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 45) goToSlide(currentSlide + (dx < 0 ? 1 : -1));
    swiping = false;
  }, { passive: true });
}

function renderSearch() {
  const box = document.getElementById('pfxSearchResults');
  const q = (searchQuery || '').trim();
  if (!q) {
    box.innerHTML = `<div class="pfx-m-empty"><i class="fa-solid fa-magnifying-glass"></i><strong>Cari lagu</strong><span>Ketik judul, artis, atau mood</span></div>`;
    return;
  }
  const list = fuzzy(q, songs);
  setPlaylist(list);
  if (!list.length) {
    box.innerHTML = `<div class="pfx-m-empty"><i class="fa-solid fa-magnifying-glass"></i><strong>Musik tidak ditemukan</strong><span>Coba kata kunci lain</span></div>`;
    return;
  }
  const st = getState();
  box.innerHTML = `<div class="pfx-qlist">${list.map(s => {
    const playing = st.currentSong && st.currentSong.id === s.id;
    return `<div class="pfx-qitem${playing ? ' playing' : ''}" data-id="${s.id}">
      <img class="pfx-q-thumb" src="${s.image}" alt="" loading="lazy" decoding="async" width="52" height="52" />
      <div class="pfx-q-info">
        <div class="pfx-q-title">${esc(s.title)}</div>
        <div class="pfx-q-sub">${esc(s.artist)}</div>
      </div>
      <button type="button" class="pfx-q-dots-menu" data-id="${s.id}"><i class="fa-solid fa-ellipsis-vertical"></i></button>
    </div>`;
  }).join('')}</div>`;
  box.querySelectorAll('.pfx-qitem').forEach(item => {
    item.onclick = (e) => {
      if (e.target.closest('.pfx-q-dots-menu')) return;
      const id = Number(item.dataset.id);
      const song = songs.find(s => s.id === id);
      const idx = list.findIndex(s => s.id === id);
      if (song) { playSong(song, idx); closeSearch(); openFullPlayer(); }
    };
  });
  box.querySelectorAll('.pfx-q-dots-menu').forEach(btn => {
    btn.onclick = (e) => {
      e.stopPropagation();
      const id = Number(btn.dataset.id);
      const song = songs.find(s => s.id === id);
      if (song) openSongMenu(song);
    };
  });
}

function openSearch() {
  document.getElementById('pfxSearchView').classList.add('show');
  document.getElementById('pfxSearchInput').value = '';
  searchQuery = '';
  renderSearch();
  setTimeout(() => document.getElementById('pfxSearchInput').focus(), 80);
}
function closeSearch() { document.getElementById('pfxSearchView').classList.remove('show'); }

/* ========== SONG MENU ========== */
function openSongMenu(song) {
  currentMenuSong = song;
  document.getElementById('pfxSmCover').src = song.image || '';
  document.getElementById('pfxSmTitle').textContent = song.title || '';
  document.getElementById('pfxSmArtist').textContent = song.artist || '';
  document.getElementById('pfxSongMenuOverlay').classList.add('show');
}
function closeSongMenu() {
  document.getElementById('pfxSongMenuOverlay').classList.remove('show');
  currentMenuSong = null;
}

async function handleSongMenuAction(act) {
  const song = currentMenuSong;
  if (!song) return;
  switch (act) {
    case 'play':
      playSong(song); closeSongMenu(); openFullPlayer();
      break;
    case 'playnext':
      playNextInQueue(song);
      showToast('Akan diputar setelah lagu ini');
      closeSongMenu();
      break;
    case 'share': {
      const r = await shareSong(song);
      if (r === 'copied') showToast('Link lagu disalin');
      else if (r) showToast('Berhasil dibagikan');
      else showToast('Gagal membagikan');
      closeSongMenu();
      break;
    }
    case 'download': {
      closeSongMenu();
      showToast('Mengunduh...');
      const ok = await downloadSongFile(song);
      showToast(ok ? 'Unduhan dimulai' : 'Gagal mengunduh. Coba lagi.');
      break;
    }
    case 'savegallery': {
      closeSongMenu();
      showToast('Menyimpan cover...');
      const ok = await downloadCoverImage(song);
      showToast(ok ? 'Cover disimpan' : 'Gagal menyimpan');
      break;
    }
  }
}

/* ========== PLAYER MENU ========== */
function togglePlayerMenu() {
  const m = document.getElementById('pfxPlayerMenu');
  if (!m) return;
  if (m.classList.contains('show')) { m.classList.remove('show'); return; }
  updatePlayerMenuLabels();
  m.classList.add('show');
}
function closePlayerMenu() { document.getElementById('pfxPlayerMenu')?.classList.remove('show'); }

/* Toggle repeat hanya antara OFF ↔ ONE (ulang lagu yang sama).
   Aman kalau REPEAT.ONE belum didefinisikan di player.js. */
function toggleRepeatOne() {
  const one = REPEAT.ONE || 'one';
  const off = REPEAT.OFF || 'off';
  const cur = getState().repeatMode;
  const target = (cur === one) ? off : one;
  let guard = 0;
  while (getState().repeatMode !== target && guard++ < 5) cycleRepeat();
}

function updatePlayerMenuLabels() {
  const st = getState();
  const loop = document.getElementById('pfxLoopLabel');
  if (loop) {
    const one = REPEAT.ONE || 'one';
    const all = REPEAT.ALL || 'all';
    if (st.repeatMode === one) loop.textContent = 'Loop: Ulang lagu';
    else if (st.repeatMode === all) loop.textContent = 'Loop: Semua';
    else loop.textContent = 'Loop: Off';
  }
  const sp = document.getElementById('pfxSpeedLabel');
  if (sp) {
    const r = st.playbackRate || 1;
    sp.textContent = `Kecepatan: ${r}x`;
  }
  const sl = document.getElementById('pfxSleepLabel');
  if (sl) {
    const rem = getSleepRemaining();
    if (rem > 0) {
      const m = Math.ceil(rem / 60000);
      sl.textContent = `Sleep: ${m} menit`;
    } else {
      sl.textContent = 'Sleep Timer';
    }
  }
}

async function handlePlayerMenuAction(act) {
  const song = getState().currentSong;
  switch (act) {
    case 'download':
      closePlayerMenu();
      if (!song) { showToast('Tidak ada lagu aktif'); return; }
      showToast('Mengunduh...');
      showToast(await downloadSongFile(song) ? 'Unduhan dimulai' : 'Gagal mengunduh. Coba lagi.');
      break;
    case 'loop':
      toggleRepeatOne();
      updatePlayerMenuLabels();
      break;
    case 'sleep':
      closePlayerMenu();
      openSleepSheet();
      break;
    case 'speed':
      closePlayerMenu();
      openSpeedSheet();
      break;
  }
}

/* ========== SLEEP / SPEED SHEET ========== */
function openSleepSheet() {
  const ov = document.getElementById('pfxSleepOverlay');
  const sub = document.getElementById('pfxSleepSub');
  const rem = getSleepRemaining();
  if (rem > 0) {
    const m = Math.ceil(rem / 60000);
    sub.textContent = `Aktif · sisa ± ${m} menit`;
  } else {
    sub.textContent = 'Pilih durasi timer';
  }
  document.getElementById('pfxSleepInput').value = '';
  ov.classList.add('show');
}
function closeSleepSheet() { document.getElementById('pfxSleepOverlay').classList.remove('show'); }

function openSpeedSheet() {
  const ov = document.getElementById('pfxSpeedOverlay');
  const cur = getState().playbackRate || 1;
  document.getElementById('pfxSpeedCurrent').textContent = `${cur}x`;
  document.getElementById('pfxSpeedInput').value = '';
  ov.classList.add('show');
}
function closeSpeedSheet() { document.getElementById('pfxSpeedOverlay').classList.remove('show'); }

/* ========== SLEEP BADGE ========== */
function startSleepTicker() {
  if (sleepTickInterval) clearInterval(sleepTickInterval);
  sleepTickInterval = setInterval(updateSleepBadge, 1000);
}

function updateSleepBadge() {
  const badge = document.getElementById('pfxFpSleep');
  const timeEl = document.getElementById('pfxFpSleepTime');
  if (!badge || !timeEl) return;
  const rem = getSleepRemaining();
  if (rem > 0) {
    const totalSec = Math.floor(rem / 1000);
    const h = Math.floor(totalSec / 3600);
    const m = Math.floor((totalSec % 3600) / 60);
    const s = totalSec % 60;
    timeEl.textContent = h > 0
      ? `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
      : `${m}:${String(s).padStart(2, '0')}`;
    badge.classList.add('show');
  } else {
    badge.classList.remove('show');
  }
  updatePlayerMenuLabels();
}

/* ========== MARQUEE ========== */
/* Set teks + jalankan marquee HANYA kalau teks berubah.
   Ini cegah animasi restart tiap kali syncUI dipanggil timeupdate. */
function setMarqueeText(node, text, force = false) {
  if (!node) return;
  const t = text == null ? '' : String(text);
  if (!force && node.dataset.curText === t) return; // teks sama, jangan sentuh DOM
  node.dataset.curText = t;
  node.textContent = t;
  node.classList.remove('running');
  node.style.animationDuration = '';
  applyMarquee(node);
}

function applyMarquee(node) {
  if (!node) return;
  const parent = node.parentElement;
  if (!parent) return;

  // Pastikan ukuran terbaru
  void node.offsetWidth;

  const originalText = node.textContent || '';
  const textWidth = node.scrollWidth;
  const containerWidth = parent.clientWidth;

  if (textWidth <= containerWidth + 4) return; // teks pendek, gak perlu marquee

  // Duplikat 2x → animasi translateX(-50%) seamless loop
  node.innerHTML = '';
  const part1 = document.createElement('span');
  part1.className = 'pfx-marquee-part';
  part1.textContent = originalText;
  const part2 = document.createElement('span');
  part2.className = 'pfx-marquee-part';
  part2.textContent = originalText;
  node.appendChild(part1);
  node.appendChild(part2);

  const partWidth = part1.getBoundingClientRect().width || (textWidth + 40);
  const pixelsPerSecond = 45;
  const duration = Math.max(6, partWidth / pixelsPerSecond);
  node.style.animationDuration = duration.toFixed(2) + 's';
  node.classList.add('running');
}


/* ========== UI SYNC ========== */
function syncUI(st) {
  const inMusic = root && root.classList.contains('show');
  if (root) root.classList.toggle('player-active', !!(st.currentSong && inMusic));

  const np = document.getElementById('pfxNpbar');
  if (st.currentSong && inMusic) {
    np.classList.add('show');
    document.getElementById('pfxNpCover').src = st.currentSong.image;
    setMarqueeText(document.getElementById('pfxNpTitle'), st.currentSong.title);
    document.getElementById('pfxNpArtist').textContent = st.currentSong.artist;
    document.getElementById('pfxNpPlay').innerHTML = st.isPlaying ? '<i class="fa-solid fa-pause"></i>' : '<i class="fa-solid fa-play"></i>';
    const pct = st.duration ? (st.currentTime / st.duration) * 100 : 0;
    document.getElementById('pfxNpProg').style.width = pct + '%';
  } else {
    np.classList.remove('show');
  }

  if (st.currentSong) {
    document.getElementById('pfxFpCover').src = st.currentSong.image;
    setMarqueeText(document.getElementById('pfxFpTitle'), st.currentSong.title);
    setMarqueeText(document.getElementById('pfxFpArtist'), st.currentSong.artist);
    document.getElementById('pfxFpPlay').innerHTML = st.isPlaying ? '<i class="fa-solid fa-pause"></i>' : '<i class="fa-solid fa-play"></i>';
    document.getElementById('pfxFpCur').textContent = formatTime(st.currentTime);
    document.getElementById('pfxFpDur').textContent = formatTime(st.duration);
    const pct = st.duration ? (st.currentTime / st.duration) * 100 : 0;
    document.getElementById('pfxFpProgressFill').style.width = pct + '%';
    document.getElementById('pfxFpProgressThumb').style.left = pct + '%';
    document.getElementById('pfxFpShuffle').classList.toggle('active', st.shuffle);
    const rep = document.getElementById('pfxFpRepeat');
    rep.classList.toggle('active', st.repeatMode !== REPEAT.OFF);
    document.getElementById('pfxFpLike').classList.toggle('liked', !!st.liked[st.currentSong.id]);
    document.getElementById('pfxFpSave').classList.toggle('active', !!st.saved[st.currentSong.id]);

    document.getElementById('pfxFoCover').src = st.currentSong.image;
    setMarqueeText(document.getElementById('pfxFoTitle'), st.currentSong.title);
    document.getElementById('pfxFoArtist').textContent = st.currentSong.artist;
    document.getElementById('pfxFoPlay').innerHTML = st.isPlaying ? '<i class="fa-solid fa-pause"></i>' : '<i class="fa-solid fa-play"></i>';
    document.getElementById('pfxFoCur').textContent = formatTime(st.currentTime);
    document.getElementById('pfxFoDur').textContent = formatTime(st.duration);
    document.getElementById('pfxFoProgressFill').style.width = pct + '%';
    document.getElementById('pfxFoProgressThumb').style.left = pct + '%';
    document.getElementById('pfxFoShuffle').classList.toggle('active', st.shuffle);
    const rep2 = document.getElementById('pfxFoRepeat');
    rep2.classList.toggle('active', st.repeatMode !== REPEAT.OFF);
  }

  const foOpen = document.getElementById('pfxFloatOverlay')?.classList.contains('show');
  const isLoading = !!(st.currentSong && (
    st.isLoading === true ||
    st.loading === true ||
    (st.isPlaying && !(st.duration > 0) && !(st.currentTime > 0.15))
  ));
  if (st.currentSong && !inMusic && !foOpen && !isLoading) {
    showBubble();
    document.getElementById('pfxBubbleCover').src = st.currentSong.image;
  } else {
    hideBubble();
  }

  if (inMusic) {
    document.querySelectorAll('.pfx-qitem').forEach(item => {
      const id = Number(item.dataset.id);
      item.classList.toggle('playing', st.currentSong && st.currentSong.id === id);
    });
  }

  updatePlayerMenuLabels();
  updateSleepBadge();
}

/* ========== NAV ========== */
export function openMusicView() {
  buildRoot();
  root.classList.add('show');
  hideBubble();
  hideFloatOverlay();
  closeSearch();
  closeFullPlayer();
  currentFilter = 'all';
  showAllSongs = false;
  currentSlide = 0;
  renderPills();
  renderHome();
  setPlaylist(filterList(currentFilter));
  syncUI(getState());
}

export function closeMusicView(keepAudio = true) {
  if (!root) return;
  root.classList.remove('show');
  closeFullPlayer();
  closeSearch();
  closePlayerMenu();
  closeSleepSheet();
  closeSpeedSheet();
  clearInterval(heroTimer);
  if (!keepAudio) stop();
  const st = getState();
  if (st.currentSong) {
    if (bubbleShowTimer) clearTimeout(bubbleShowTimer);
    bubbleShowTimer = setTimeout(() => {
      const s = getState();
      const foOpen = document.getElementById('pfxFloatOverlay')?.classList.contains('show');
      const stillInMusic = root && root.classList.contains('show');
      if (s.currentSong && !foOpen && !stillInMusic) showBubble();
    }, 150);
  }
  syncUI(st);
}

function openFullPlayer() {
  document.getElementById('pfxFullPlayer')?.classList.add('show');
  syncUI(getState());
  updateSleepBadge();
}
function closeFullPlayer() {
  document.getElementById('pfxFullPlayer')?.classList.remove('show');
  closePlayerMenu();
}

function showToast(msg) {
  const t = document.getElementById('pfxMusicToast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.remove('show'), 2200);
}

/* ========== BUBBLE ========== */
function setupBubbleDrag() {
  const bubble = document.getElementById('pfxMusicBubble');
  if (!bubble || bubble._bound) return;
  bubble._bound = true;

  let startX = 0, startY = 0, origX = 0, origY = 0, dragging = false;
  const xy = (e) => {
    if (e.touches?.[0]) return { x: e.touches[0].clientX, y: e.touches[0].clientY };
    if (e.changedTouches?.[0]) return { x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY };
    return { x: e.clientX, y: e.clientY };
  };

  function onDown(e) {
    if (e.target.closest('.pfx-bubble-close')) return;
    const p = xy(e);
    startX = p.x; startY = p.y;
    const r = bubble.getBoundingClientRect();
    origX = r.left; origY = r.top;
    dragging = true; bubbleWasDragged = false;
    bubble.classList.add('dragging');
    if (e.cancelable) e.preventDefault();
  }
  function onMove(e) {
    if (!dragging) return;
    const p = xy(e);
    const dx = p.x - startX, dy = p.y - startY;
    if (Math.abs(dx) > 6 || Math.abs(dy) > 6) bubbleWasDragged = true;
    if (!bubbleWasDragged) return;
    let nx = Math.max(0, Math.min(window.innerWidth - bubble.offsetWidth, origX + dx));
    let ny = Math.max(0, Math.min(window.innerHeight - bubble.offsetHeight, origY + dy));
    bubble.style.left = nx + 'px';
    bubble.style.top = ny + 'px';
    bubble.style.right = 'auto';
    bubble.style.bottom = 'auto';
    if (e.cancelable) e.preventDefault();
  }
  function onUp() {
    if (!dragging) return;
    dragging = false;
    bubble.classList.remove('dragging');
    if (!bubbleWasDragged) {
      setTimeout(() => {
        if (bubbleWasDragged) return;
        if (Date.now() - lastOverlayCloseAt < 500) return;
        openFloatOverlay();
      }, 10);
    }
  }

  bubble.addEventListener('mousedown', onDown);
  window.addEventListener('mousemove', onMove);
  window.addEventListener('mouseup', onUp);
  bubble.addEventListener('touchstart', onDown, { passive: false });
  window.addEventListener('touchmove', onMove, { passive: false });
  window.addEventListener('touchend', onUp);
  window.addEventListener('touchcancel', onUp);
}

function showBubble() {
  if (bubbleShowTimer) { clearTimeout(bubbleShowTimer); bubbleShowTimer = null; }
  document.getElementById('pfxMusicBubble')?.classList.add('show');
}
function hideBubble() {
  document.getElementById('pfxMusicBubble')?.classList.remove('show');
}

/* ========== FLOAT OVERLAY ========== */
function openFloatOverlay() {
  if (Date.now() - lastOverlayCloseAt < 500) return;
  const fo = document.getElementById('pfxFloatOverlay');
  const bubble = document.getElementById('pfxMusicBubble');
  if (!fo || !bubble) return;

  const wasHidden = !fo.classList.contains('show');
  if (wasHidden) { fo.style.visibility = 'hidden'; fo.classList.add('show'); }
  const foW = fo.offsetWidth || Math.min(340, window.innerWidth - 24);
  const foH = fo.offsetHeight || 240;
  const br = bubble.getBoundingClientRect();

  let left = br.left + br.width / 2 - foW / 2;
  left = Math.max(12, Math.min(window.innerWidth - foW - 12, left));

  const spaceAbove = br.top;
  const spaceBelow = window.innerHeight - br.bottom;
  let top;
  if (spaceAbove >= foH + ANCHOR_GAP) top = br.top - ANCHOR_GAP - foH;
  else if (spaceBelow >= foH + ANCHOR_GAP) top = br.bottom + ANCHOR_GAP;
  else top = spaceAbove >= spaceBelow
    ? Math.max(12, br.top - ANCHOR_GAP - foH)
    : Math.min(window.innerHeight - foH - 12, br.bottom + ANCHOR_GAP);
  top = Math.max(12, Math.min(window.innerHeight - foH - 12, top));

  fo.style.left = left + 'px';
  fo.style.top = top + 'px';
  fo.style.right = 'auto';
  fo.style.bottom = 'auto';
  fo.style.transform = 'none';
  if (wasHidden) fo.style.visibility = '';

  hideBubble();
  setupFloatOverlayDrag();
  syncUI(getState());

  // Force re-measure marquee setelah overlay benar-benar terlihat
  // (sebelumnya container width = 0 karena display:none)
  requestAnimationFrame(() => {
    const st = getState();
    if (!st.currentSong) return;
    const foTitle = document.getElementById('pfxFoTitle');
    const foArtist = document.getElementById('pfxFoArtist');
    if (foTitle) setMarqueeText(foTitle, st.currentSong.title, true);
    if (foArtist) {
      // artist di overlay pakai textContent biasa, gak perlu marquee
      foArtist.textContent = st.currentSong.artist;
    }
  });

  overlayOpenedAt = Date.now();
  resetOverlayCloseTimer();
}

function hideFloatOverlay() {
  const fo = document.getElementById('pfxFloatOverlay');
  const bubble = document.getElementById('pfxMusicBubble');
  if (!fo) return;
  fo.classList.remove('show');
  clearTimeout(overlayCloseTimer);
  lastOverlayCloseAt = Date.now();
  const st = getState();
  const inMusic = root && root.classList.contains('show');
  if (st.currentSong && !inMusic && bubble) {
    if (bubbleShowTimer) clearTimeout(bubbleShowTimer);
    bubbleShowTimer = setTimeout(() => {
      const foNow = document.getElementById('pfxFloatOverlay');
      if (foNow && foNow.classList.contains('show')) return;
      const s = getState();
      const stillInMusic = root && root.classList.contains('show');
      if (s.currentSong && !stillInMusic) showBubble();
    }, 130);
  }
}

function resetOverlayCloseTimer() {
  clearTimeout(overlayCloseTimer);
  overlayCloseTimer = setTimeout(() => {
    const fo = document.getElementById('pfxFloatOverlay');
    if (fo && fo.classList.contains('show')) hideFloatOverlay();
  }, 8000);
}

function setupGlobalOverlayAutoClose() {
  document.addEventListener('click', (e) => {
    const fo = document.getElementById('pfxFloatOverlay');
    if (!fo || !fo.classList.contains('show')) return;
    if (Date.now() - overlayOpenedAt < 250) return;
    if (fo.contains(e.target)) { resetOverlayCloseTimer(); return; }
    if (e.target.closest && e.target.closest('#pfxMusicBubble')) return;
    hideFloatOverlay();
  }, true);
  document.addEventListener('touchstart', (e) => {
    const fo = document.getElementById('pfxFloatOverlay');
    if (!fo || !fo.classList.contains('show')) return;
    if (Date.now() - overlayOpenedAt < 250) return;
    if (fo.contains(e.target)) { resetOverlayCloseTimer(); return; }
    if (e.target.closest && e.target.closest('#pfxMusicBubble')) return;
    hideFloatOverlay();
  }, { passive: true });
}

function setupFloatOverlayDrag() {
  const fo = document.getElementById('pfxFloatOverlay');
  if (!fo || fo._dragBound) return;
  fo._dragBound = true;
  const head = fo.querySelector('.pfx-fo-head') || fo;
  let startX = 0, startY = 0, origX = 0, origY = 0, dragging = false, moved = false;
  const xy = (e) => {
    if (e.touches?.[0]) return { x: e.touches[0].clientX, y: e.touches[0].clientY };
    if (e.changedTouches?.[0]) return { x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY };
    return { x: e.clientX, y: e.clientY };
  };
  function onDown(e) {
    if (e.target.closest('button') || e.target.closest('.pfx-progress-bar') || e.target.closest('.pfx-fo-controls')) return;
    const p = xy(e);
    startX = p.x; startY = p.y;
    const r = fo.getBoundingClientRect();
    origX = r.left; origY = r.top;
    dragging = true; moved = false;
    fo.classList.add('dragging');
    fo.style.left = origX + 'px'; fo.style.top = origY + 'px';
    fo.style.right = 'auto'; fo.style.bottom = 'auto'; fo.style.transform = 'none';
    if (e.cancelable) e.preventDefault();
  }
  function onMove(e) {
    if (!dragging) return;
    const p = xy(e);
    const dx = p.x - startX, dy = p.y - startY;
    if (Math.abs(dx) > 5 || Math.abs(dy) > 5) moved = true;
    if (!moved) return;
    const w = fo.offsetWidth || 280;
    const h = fo.offsetHeight || 180;
    let nx = Math.max(0, Math.min(window.innerWidth - w, origX + dx));
    let ny = Math.max(0, Math.min(window.innerHeight - h, origY + dy));
    fo.style.left = nx + 'px';
    fo.style.top = ny + 'px';
    if (e.cancelable) e.preventDefault();
  }
  function onUp() {
    if (!dragging) return;
    dragging = false;
    fo.classList.remove('dragging');
    if (moved) { fo.dataset.userMoved = '1'; resetOverlayCloseTimer(); }
  }
  head.addEventListener('mousedown', onDown);
  window.addEventListener('mousemove', onMove);
  window.addEventListener('mouseup', onUp);
  head.addEventListener('touchstart', onDown, { passive: false });
  window.addEventListener('touchmove', onMove, { passive: false });
  window.addEventListener('touchend', onUp);
  window.addEventListener('touchcancel', onUp);
}

/* ========== INIT ========== */
export function initPretvfxMusic() {
  buildRoot();
  initPlayer(songs);
  refreshShuffle();
  setPlaylist(songs);
  if (unsub) unsub();
  unsub = subscribe(syncUI);
  syncUI(getState());
  window.PretvfxMusic = { open: openMusicView, close: closeMusicView, playSong, togglePlay, getState };
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initPretvfxMusic);
} else {
  initPretvfxMusic();
}