// ============================================================
// État partagé entre les modules boutique et admin, et utilitaires
// communs (Telegram WebApp, retour haptique, ouverture des panneaux).
// ============================================================

import * as UI from './ui.js?v20260728s';

// ============================================================
// MODE VITRINE : si l'app n'est pas ouverte depuis Telegram (cas normal
// pour une démo consultée dans un navigateur classique), on simule un
// environnement Telegram minimal pour que l'app reste entièrement
// navigable (profil, favoris, panneau admin...) sans aucune restriction.
// Si l'app est réellement ouverte dans Telegram, le vrai WebApp est
// utilisé normalement.
// ============================================================
const realTg = (window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.initData) ? window.Telegram.WebApp : null;
export const tg = realTg || {
  initData: 'vitrine-demo-mode',
  initDataUnsafe: { user: { id: 0, first_name: 'Visiteur', last_name: 'Démo', username: 'demo' } },
  ready() {}, expand() {}, disableVerticalSwipes() {}, setHeaderColor() {},
  HapticFeedback: { impactOccurred() {}, notificationOccurred() {}, selectionChanged() {} },
};
if (realTg) {
  tg.ready();
  tg.expand();
  tg.setHeaderColor && tg.setHeaderColor('#0A0705');
  // Empêche le geste "glisser vers le bas pour fermer" de Telegram
  // d'entrer en conflit avec le défilement normal de la page —
  // sans ça, Telegram peut intercepter les glissements verticaux
  // au lieu de laisser l'app défiler.
  tg.disableVerticalSwipes && tg.disableVerticalSwipes();
}

export function haptic(type) {
  if (tg && tg.HapticFeedback) { try { tg.HapticFeedback.impactOccurred(type || 'light'); } catch (e) { /* pas grave */ } }
  playTick();
}

// ---------- Lecture automatique des vidéos (réglable dans Profil) ----------
const AUTOPLAY_KEY = 'legendlabs_autoplay';
export function isAutoplayEnabled() {
  const v = localStorage.getItem(AUTOPLAY_KEY);
  return v === null ? true : v === '1'; // activé par défaut
}
export function setAutoplayEnabled(on) { try { localStorage.setItem(AUTOPLAY_KEY, on ? '1' : '0'); } catch { /* pas grave */ } }

// ---------- Son de l'app (réglable dans Profil) ----------
const SOUND_KEY = 'legendlabs_sound';
let audioCtx = null;
export function isSoundEnabled() { return localStorage.getItem(SOUND_KEY) === '1'; }
export function setSoundEnabled(on) { try { localStorage.setItem(SOUND_KEY, on ? '1' : '0'); } catch { /* pas grave */ } }
function playTick() {
  if (!isSoundEnabled()) return;
  try {
    audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.value = 720;
    gain.gain.setValueAtTime(0.06, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.08);
    osc.connect(gain).connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.08);
  } catch (e) { /* audio indisponible, pas grave */ }
}

export const state = {
  settings: {},
  categories: [],
  subcategories: [],
  products: [],
  contactLinks: [],
  promoCodes: [],
  reviews: [],
  notifications: [],
  banners: [],
  badges: [],
  currentUser: null,
  expandedProducts: new Set(),
  filters: { cat: 'all', sub: 'all', query: '', onlyPromo: false, onlyNew: false, onlyFavorites: false, sort: 'default' },
  cart: {},
  currentProductId: null,
  currentVariantId: null,
};

export const sheets = {
  filter: [document.getElementById('sheetFilter'), document.getElementById('backdropFilter')],
  cart: [document.getElementById('sheetCart'), document.getElementById('backdropCart')],
  product: [document.getElementById('sheetProduct'), document.getElementById('backdropProduct')],
  adminLogin: [document.getElementById('sheetAdminLogin'), document.getElementById('backdropAdminLogin')],
  admin: [document.getElementById('sheetAdmin'), document.getElementById('backdropAdmin')],
  notif: [document.getElementById('sheetNotif'), document.getElementById('backdropNotif')],
};

export function open(key) { UI.openSheet(...sheets[key]); }
export function close(key) { UI.closeSheet(...sheets[key]); }
