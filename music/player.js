/**
 * Pretvfx-Music — Single Audio Engine
 */

import {
  getState, setState, subscribe, loadPersisted, persist,
  REPEAT, formatTime
} from './player-state.js';

let audio = null;
let songsRef = [];
let lastNotify = 0;
let sleepCheckInterval = null;

function ensureAudio() {
  if (audio) return audio;
  audio = new Audio();
  audio.preload = 'metadata';

  audio.addEventListener('loadedmetadata', () => {
    setState({ duration: audio.duration || 0 });
  });

  audio.addEventListener('timeupdate', () => {
    const now = performance.now();
    if (now - lastNotify < 250) return;
    lastNotify = now;
    setState({ currentTime: audio.currentTime || 0, duration: audio.duration || 0 });
  });

  audio.addEventListener('play', () => setState({ isPlaying: true }));
  audio.addEventListener('pause', () => setState({ isPlaying: false }));
  audio.addEventListener('ended', onEnded);
  audio.addEventListener('error', () => {
    const code = audio.error && audio.error.code;
    console.warn('[Pretvfx-Music] Audio error code=', code, 'src=', audio.src);
    setState({ isPlaying: false });
    let msg = 'Gagal memutar lagu';
    if (code === 2) msg = 'Jaringan error — cek koneksi';
    else if (code === 3) msg = 'File audio rusak / tidak didukung';
    else if (code === 4) msg = 'Link audio tidak ditemukan (404)';
    window.dispatchEvent(new CustomEvent('pretvfx-music-error', { detail: msg }));
  });

  return audio;
}

/* Lagu habis → cek dulu mode repeat.
   - REPEAT.ONE  : ulang lagu yang sama (reset waktu ke 0, putar ulang)
   - REPEAT.OFF  : lanjut ke lagu berikutnya
   - REPEAT.ALL  : lanjut lagu berikutnya, wrap ke awal kalau udah akhir playlist */
function onEnded() {
  const st = getState();
  if (st.repeatMode === REPEAT.ONE && st.currentSong) {
    const a = ensureAudio();
    a.currentTime = 0;
    setState({ currentTime: 0 });
    a.play()
      .then(() => setState({ isPlaying: true }))
      .catch(() => setState({ isPlaying: false }));
    return;
  }
  playNext(true);
}

export function initPlayer(songs) {
  songsRef = Array.isArray(songs) ? songs : [];
  ensureAudio();
  loadPersisted();
  const st = getState();
  audio.volume = st.volume;
  audio.playbackRate = st.playbackRate || 1;
  startSleepWatch();
}

export function getAudio() { return ensureAudio(); }

export function setPlaylist(list) {
  setState({ playlist: list || [], originalPlaylist: list || [] });
}

function findIndexInPlaylist(song) {
  const list = getState().playlist;
  if (!song || !list.length) return -1;
  return list.findIndex(s => s.id === song.id);
}

export function playSong(song, index = -1) {
  if (!song) return;
  const a = ensureAudio();
  const st = getState();
  const same = st.currentSong && st.currentSong.id === song.id;
  if (!same) { a.src = song.audio; a.currentTime = 0; }
  const idx = index >= 0 ? index : findIndexInPlaylist(song);
  setState({
    currentSong: song,
    currentIndex: idx,
    currentTime: same ? a.currentTime : 0,
    duration: a.duration || 0
  });
  a.volume = getState().volume;
  a.playbackRate = getState().playbackRate || 1;
  a.play().then(() => setState({ isPlaying: true })).catch(err => {
    console.warn('play blocked', err);
    setState({ isPlaying: false });
  });
}

export function togglePlay() {
  const a = ensureAudio();
  const st = getState();
  if (!st.currentSong) return;
  if (a.paused) a.play().then(() => setState({ isPlaying: true })).catch(() => {});
  else { a.pause(); setState({ isPlaying: false }); }
}

export function pause() {
  const a = ensureAudio();
  a.pause();
  setState({ isPlaying: false });
}

export function stop() {
  const a = ensureAudio();
  a.pause(); a.currentTime = 0;
  setState({ isPlaying: false, currentTime: 0, currentSong: null, currentIndex: -1 });
  persist();
}

export function seek(time) {
  const a = ensureAudio();
  if (!isFinite(time)) return;
  a.currentTime = Math.max(0, Math.min(time, a.duration || time));
  setState({ currentTime: a.currentTime });
}

export function setVolume(v) {
  v = Math.max(0, Math.min(1, v));
  ensureAudio().volume = v;
  setState({ volume: v });
}

export function setPlaybackRate(rate) {
  rate = Math.max(0.25, Math.min(3, Number(rate) || 1));
  ensureAudio().playbackRate = rate;
  setState({ playbackRate: rate });
}

export function cyclePlaybackRate() {
  const rates = [0.75, 1, 1.25, 1.5, 2];
  const cur = getState().playbackRate || 1;
  const idx = rates.indexOf(cur);
  const next = rates[(idx + 1) % rates.length];
  setPlaybackRate(next);
  return next;
}

export function playNext(fromEnded = false) {
  const st = getState();
  const list = st.playlist.length ? st.playlist : songsRef;
  if (!list.length) return;
  let nextIdx;
  if (st.shuffle) {
    if (list.length === 1) nextIdx = 0;
    else { do { nextIdx = Math.floor(Math.random() * list.length); } while (nextIdx === st.currentIndex && list.length > 1); }
  } else {
    nextIdx = st.currentIndex + 1;
    if (nextIdx >= list.length) {
      // di akhir playlist
      if (st.repeatMode === REPEAT.ALL || fromEnded) nextIdx = 0;
      else { pause(); return; }
    }
  }
  playSong(list[nextIdx], nextIdx);
}

export function playPrev() {
  const a = ensureAudio();
  const st = getState();
  if (a.currentTime > 3) { a.currentTime = 0; setState({ currentTime: 0 }); return; }
  const list = st.playlist.length ? st.playlist : songsRef;
  if (!list.length) return;
  let prevIdx;
  if (st.shuffle) {
    if (list.length === 1) prevIdx = 0;
    else { do { prevIdx = Math.floor(Math.random() * list.length); } while (prevIdx === st.currentIndex && list.length > 1); }
  } else {
    prevIdx = st.currentIndex - 1;
    if (prevIdx < 0) prevIdx = list.length - 1;
  }
  playSong(list[prevIdx], prevIdx);
}

export function playNextInQueue(song) {
  if (!song) return;
  const st = getState();
  const list = [...(st.playlist || [])];
  const curIdx = st.currentIndex;
  const existIdx = list.findIndex(s => s.id === song.id);
  if (existIdx >= 0) list.splice(existIdx, 1);
  const insertAt = curIdx >= 0 ? curIdx + 1 : 0;
  list.splice(insertAt, 0, song);
  setState({ playlist: list });
}

export function toggleShuffle() { setState({ shuffle: !getState().shuffle }); }

/* REPEAT di player-state.js = { OFF: 0, ALL: 1, ONE: 2 }
   Tombol repeat di UI toggle antara OFF ↔ ONE (ulang lagu yang sama).
   Mode ALL tetap bisa dipakai kalau nanti mau (ubah fungsi ini). */
export function cycleRepeat() {
  const cur = getState().repeatMode;
  setState({ repeatMode: cur === REPEAT.OFF ? REPEAT.ONE : REPEAT.OFF });
}

export function toggleLike(songId) {
  const liked = { ...getState().liked };
  if (liked[songId]) delete liked[songId]; else liked[songId] = true;
  setState({ liked });
}

export function toggleSave(songId) {
  const saved = { ...getState().saved };
  if (saved[songId]) delete saved[songId]; else saved[songId] = true;
  setState({ saved });
}

/* ---------- Sleep Timer ---------- */
export function setSleepTimer(minutes) {
  const ms = (Number(minutes) || 0) * 60 * 1000;
  const end = ms > 0 ? Date.now() + ms : 0;
  setState({ sleepTimerEnd: end });
  startSleepWatch();
}

export function getSleepRemaining() {
  const end = getState().sleepTimerEnd || 0;
  if (!end) return 0;
  return Math.max(0, end - Date.now());
}

function startSleepWatch() {
  if (sleepCheckInterval) clearInterval(sleepCheckInterval);
  sleepCheckInterval = setInterval(() => {
    const end = getState().sleepTimerEnd || 0;
    if (!end) return;
    if (Date.now() >= end) {
      setState({ sleepTimerEnd: 0 });
      pause();
      window.dispatchEvent(new CustomEvent('pretvfx-music-error', { detail: 'Sleep timer selesai — pemutaran dihentikan' }));
    }
  }, 1000);
}

/* ---------- URL helper: convert github.com/X/Y/raw/... -> raw.githubusercontent.com/X/Y/... ---------- */
function normalizeMediaUrl(url) {
  if (!url) return url;
  return String(url).replace(
    /^https?:\/\/github\.com\/([^\/]+)\/([^\/]+)\/(raw|blob)\//i,
    'https://raw.githubusercontent.com/$1/$2/'
  );
}

function sanitizeFilename(name) {
  return String(name || 'file').replace(/[\\/:*?"<>|]+/g, '_').slice(0, 120);
}

/* ---------- Download file generik ---------- */
async function downloadUrlAsFile(url, filename) {
  const cleanUrl = normalizeMediaUrl(url);
  if (!cleanUrl) return false;

  // 1) Native bridge: coba downloadUrl langsung
  if (window.AndroidDownloader) {
    if (typeof window.AndroidDownloader.downloadUrl === 'function') {
      try { window.AndroidDownloader.downloadUrl(cleanUrl, filename); return true; } catch (_) {}
    }
  }

  // 2) fetch + blob (butuh CORS)
  try {
    const res = await fetch(cleanUrl, { mode: 'cors', credentials: 'omit' });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const blob = await res.blob();
    if (!blob || blob.size < 64) throw new Error('File kosong');

    // Native base64 fallback
    if (window.AndroidDownloader && typeof window.AndroidDownloader.saveBase64File === 'function') {
      return await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          try { window.AndroidDownloader.saveBase64File(reader.result, filename); resolve(true); }
          catch (_) { resolve(false); }
        };
        reader.onerror = () => resolve(false);
        reader.readAsDataURL(blob);
      });
    }

    // Browser blob download
    const blobUrl = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = filename;
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(blobUrl), 4000);
    return true;
  } catch (e) {
    console.warn('[Pretvfx-Music] fetch download gagal, fallback direct:', e?.message || e);
  }

  // 3) Fallback terakhir: buka link langsung (browser/WebView akan tawarkan simpan / buka tab)
  try {
    const a = document.createElement('a');
    a.href = cleanUrl;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.download = filename;
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    return true;
  } catch (_) { return false; }
}

export async function downloadSongFile(song) {
  if (!song) return false;
  const url = song.audio || song.audio_320;
  if (!url) return false;
  const ext = (String(url).match(/\.(mp3|m4a|wav|ogg|opus|aac|flac)(\?|$)/i) || [null, 'mp3'])[1].toLowerCase();
  const filename = sanitizeFilename(`${song.artist || 'Pretvfx'} - ${song.title || 'Lagu'}.${ext}`);
  return downloadUrlAsFile(url, filename);
}

export async function downloadCoverImage(song) {
  if (!song || !song.image) return false;
  const ext = (String(song.image).match(/\.(jpg|jpeg|png|webp|gif)(\?|$)/i) || [null, 'jpg'])[1].toLowerCase();
  const filename = sanitizeFilename(`${song.artist || 'Pretvfx'} - ${song.title || 'Cover'}.${ext}`);
  return downloadUrlAsFile(song.image, filename);
}

export async function shareSong(song) {
  if (!song) return false;
  const shareData = {
    title: song.title,
    text: `${song.title} - ${song.artist} · Pretvfx Music`,
    url: normalizeMediaUrl(song.audio || '')
  };
  try {
    if (navigator.share) { await navigator.share(shareData); return true; }
    await navigator.clipboard.writeText(shareData.text + '\n' + shareData.url);
    return 'copied';
  } catch (e) { return false; }
}

export { subscribe, getState, formatTime, REPEAT };