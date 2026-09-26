/**
 * Pretvfx-Music — Shared Player State
 * Single source of truth for audio + UI across AI page & Music page.
 *
 * CATATAN PENTING:
 * currentSong sengaja TIDAK dipersist supaya saat aplikasi baru dibuka,
 * mini player tidak muncul otomatis. Player hanya aktif setelah user
 * memilih lagu sendiri.
 *
 * repeatMode selalu mulai dari OFF (mati) setiap kali app dibuka —
 * tidak di-restore dari localStorage, sesuai request default mati.
 */

const STORAGE_KEY = 'pretvfx_music_state_v2';
const BUBBLE_POS_KEY = 'pretvfx_music_bubble_pos';

export const REPEAT = { OFF: 0, ALL: 1, ONE: 2 };

const defaultState = () => ({
  currentSong: null,
  currentIndex: -1,
  currentTime: 0,
  duration: 0,
  volume: 0.85,
  isPlaying: false,
  shuffle: false,
  repeatMode: REPEAT.OFF,
  playbackRate: 1,
  playlist: [],
  originalPlaylist: [],
  liked: {},
  saved: {}
});

let state = defaultState();
const listeners = new Set();

export function getState() {
  return state;
}

export function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

function notify() {
  listeners.forEach(fn => {
    try { fn(state); } catch (e) { console.warn('[player-state] listener error', e); }
  });
}

export function setState(partial) {
  state = { ...state, ...partial };
  notify();
  persist();
}

export function persist() {
  try {
    // currentSong & repeatMode sengaja TIDAK disimpan:
    // - currentSong: biar app buka tanpa mini player
    // - repeatMode: selalu default OFF tiap buka app
    const toSave = {
      volume: state.volume,
      shuffle: state.shuffle,
      playbackRate: state.playbackRate,
      liked: state.liked,
      saved: state.saved
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  } catch (_) {}
}

export function loadPersisted(songs) {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const data = JSON.parse(raw);
    if (typeof data.volume === 'number') state.volume = Math.max(0, Math.min(1, data.volume));
    if (typeof data.shuffle === 'boolean') state.shuffle = data.shuffle;
    if (typeof data.playbackRate === 'number') {
      state.playbackRate = Math.max(0.5, Math.min(2, data.playbackRate));
    }
    if (data.liked) state.liked = data.liked;
    if (data.saved) state.saved = data.saved;
    // repeatMode SELALU tetap OFF saat load — default mati
    state.repeatMode = REPEAT.OFF;
  } catch (_) {}
}

export function saveBubblePos(x, y) {
  try { localStorage.setItem(BUBBLE_POS_KEY, JSON.stringify({ x, y })); } catch (_) {}
}

export function loadBubblePos() {
  try {
    const raw = localStorage.getItem(BUBBLE_POS_KEY);
    if (raw) return JSON.parse(raw);
  } catch (_) {}
  return null;
}

export function formatTime(sec) {
  if (!isFinite(sec) || sec < 0) return '0:00';
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return m + ':' + String(s).padStart(2, '0');
}

export function formatViews(n) {
  if (n >= 1e9) return (n / 1e9).toFixed(1).replace(/\.0$/, '') + ' M';
  if (n >= 1e6) return (n / 1e6).toFixed(1).replace(/\.0$/, '') + ' jt';
  if (n >= 1e3) return (n / 1e3).toFixed(1).replace(/\.0$/, '') + ' rb';
  return String(n);
}
