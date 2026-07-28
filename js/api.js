// ============================================================
// MODE VITRINE — Couche de données 100% simulée en mémoire.
// Aucun appel réseau, aucune donnée réelle de production.
// Mêmes exports que la version connectée à Supabase, pour que
// tout le reste de l'application (shop.js, admin-panel.js, etc.)
// fonctionne sans aucune modification.
// Rien n'est persisté : un rechargement de page réinitialise
// le jeu de données (comportement voulu pour la démo).
// ============================================================

import { buildSeed } from './mock-data.js';

const DB = buildSeed();
let uidCounter = 1;
const uid = (prefix) => `${prefix}-${Date.now().toString(36)}-${(uidCounter++).toString(36)}`;

function delay(min = 220, max = 480) {
  const ms = min + Math.random() * (max - min);
  return new Promise((res) => setTimeout(res, ms));
}

function clone(v) { return JSON.parse(JSON.stringify(v)); }

// ---------- Helpers internes ----------
function withBadgeLinks(product) {
  const p = clone(product);
  p.badges = (p.badges || []).map((b) => ({ id: `pb-${p.id}-${b.id}`, product_id: p.id, badge_id: b.id, badge: b }));
  return p;
}
function findProductRaw(id) { return DB.products.find((p) => p.id === id); }
function findVariantAnywhere(id) {
  for (const p of DB.products) {
    const v = (p.variants || []).find((v) => v.id === id);
    if (v) return { product: p, variant: v };
  }
  return null;
}
function findBadgeLinkAnywhere(linkId) {
  for (const p of DB.products) {
    const link = (p.badges || []).find((b) => `pb-${p.id}-${b.id}` === linkId);
    if (link) return { product: p, badge: link };
  }
  return null;
}

// ============================================================
// Lecture publique (remplace REST Supabase)
// ============================================================
export async function restGet(path) {
  await delay(120, 320);
  const table = path.split('?')[0];
  switch (table) {
    case 'categories':
      return clone(DB.categories).sort((a, b) => a.sort_order - b.sort_order);
    case 'subcategories':
      return clone(DB.subcategories).sort((a, b) => a.sort_order - b.sort_order);
    case 'products':
      return DB.products.slice().sort((a, b) => a.sort_order - b.sort_order).map(withBadgeLinks);
    case 'active_promotions':
      return clone(DB.active_promotions);
    case 'app_settings':
      return Object.entries(DB.app_settings).map(([key, value]) => ({ key, value }));
    case 'contact_links':
      return clone(DB.contact_links).sort((a, b) => a.sort_order - b.sort_order);
    case 'reviews':
      return clone(DB.reviews).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    case 'notifications':
      return clone(DB.notifications).sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 30);
    case 'banners':
      return clone(DB.banners).sort((a, b) => a.sort_order - b.sort_order);
    default:
      return [];
  }
}

export async function rpcIncrementLikes(productId) {
  await delay(80, 200);
  const product = findProductRaw(productId);
  if (!product) throw new Error('not_found');
  product.likes = (product.likes || 0) + 1;
  return product.likes;
}

// ============================================================
// Authentification — TOUT est automatiquement validé (mode vitrine).
// Les popups et écrans restent affichés pour la démonstration
// visuelle, mais aucune vérification réelle n'a lieu.
// ============================================================
export async function telegramLogin(initData) {
  await delay(400, 750); // délai simulé pour laisser l'animation de vérification se jouer
  return {
    challenge_token: uid('challenge'),
    expires_at: new Date(Date.now() + 5 * 60000).toISOString(),
    requires_admin_login: true,
  };
}

export async function registerUser(initData) {
  await delay(200, 400);
  return {
    telegram_id: 'demo-000001',
    first_name: 'Visiteur',
    last_name: 'Démo',
    username: 'demo_visitor',
    photo_url: null,
    preferences: {},
    created_at: new Date().toISOString(),
  };
}

// ---------- Favoris (en mémoire, non persistés — cohérent avec le mode démo) ----------
const favoriteIds = new Set();
export async function addFavorite(initData, product_id) {
  await delay(80, 180);
  favoriteIds.add(product_id);
  return { ok: true };
}
export async function removeFavorite(initData, product_id) {
  await delay(80, 180);
  favoriteIds.delete(product_id);
  return { ok: true };
}
export async function listFavorites(initData) {
  await delay(80, 180);
  return Array.from(favoriteIds);
}

// ============================================================
// Panneau admin — CRUD simulé en mémoire. Toute action "a l'air
// de marcher" mais rien n'est jamais persisté côté serveur (il
// n'y a pas de serveur). Un rechargement repart du jeu de données
// de démo initial.
// ============================================================
export async function adminCall(sessionToken, payload) {
  await delay();
  const { action, table, id, data } = payload;

  if (action === 'list_admin_data') return { data: adminSnapshot() };
  if (action === 'dashboard_stats') return { data: dashboardStats() };
  if (action === 'duplicate_product') return { data: duplicateProduct(id) };
  if (action === 'create_upload_url') return { data: createUploadUrlMock(payload) };
  if (action === 'upload_media') return { data: uploadMediaBase64(payload) };
  if (action === 'delete_media') return deleteMedia(id);

  if (action === 'insert') return { data: insertRow(table, data) };
  if (action === 'update') return { data: updateRow(table, id, data) };
  if (action === 'upsert') return { data: upsertRow(table, data) };
  if (action === 'delete') return deleteRow(table, id);

  throw new Error('unsupported_action');
}

function adminSnapshot() {
  return {
    categories: clone(DB.categories).sort((a, b) => a.sort_order - b.sort_order),
    subcategories: clone(DB.subcategories).sort((a, b) => a.sort_order - b.sort_order),
    products: DB.products.slice().sort((a, b) => a.sort_order - b.sort_order).map(withBadgeLinks),
    contactLinks: clone(DB.contact_links).sort((a, b) => a.sort_order - b.sort_order),
    promoCodes: clone(DB.promo_codes),
    reviews: clone(DB.reviews),
    notifications: clone(DB.notifications),
    banners: clone(DB.banners),
    badges: clone(DB.badges),
  };
}
function dashboardStats() {
  return {
    products: DB.products.length,
    cats: DB.categories.length,
    badges: DB.badges.length,
    banners: DB.banners.length,
    promos: DB.promo_codes.length,
    notifs: DB.notifications.length,
    contact: DB.contact_links.length,
  };
}

function insertRow(table, data) {
  switch (table) {
    case 'categories': { const row = { id: uid('cat'), is_hidden: false, ...data }; DB.categories.push(row); return clone(row); }
    case 'subcategories': { const row = { id: uid('sub'), ...data }; DB.subcategories.push(row); return clone(row); }
    case 'badges': { const row = { id: uid('badge'), ...data }; DB.badges.push(row); return clone(row); }
    case 'products': { const row = { id: uid('prod'), is_hidden: false, is_featured: false, likes: 0, media: [], variants: [], badges: [], ...data }; DB.products.push(row); return clone(row); }
    case 'product_variants': {
      const product = findProductRaw(data.product_id);
      if (!product) throw new Error('product_not_found');
      const { product_id, ...rest } = data;
      const row = { id: uid('var'), lots: [], ...rest };
      product.variants = product.variants || [];
      product.variants.push(row);
      return clone(row);
    }
    case 'product_lots': {
      const found = findVariantAnywhere(data.variant_id);
      if (!found) throw new Error('variant_not_found');
      const { variant_id, ...rest } = data;
      const row = { id: uid('lot'), ...rest };
      found.variant.lots = found.variant.lots || [];
      found.variant.lots.push(row);
      return clone(row);
    }
    case 'product_badges': {
      const product = findProductRaw(data.product_id);
      const badge = DB.badges.find((b) => b.id === data.badge_id);
      if (!product || !badge) throw new Error('not_found');
      product.badges = product.badges || [];
      product.badges.push(clone(badge));
      return { id: `pb-${product.id}-${badge.id}`, product_id: product.id, badge_id: badge.id };
    }
    case 'product_media': {
      const product = findProductRaw(data.product_id);
      if (!product) throw new Error('product_not_found');
      const { product_id, ...rest } = data;
      const row = { id: uid('media'), ...rest };
      product.media = product.media || [];
      product.media.push(row);
      return clone(row);
    }
    case 'contact_links': { const row = { id: uid('link'), ...data }; DB.contact_links.push(row); return clone(row); }
    case 'promo_codes': { const row = { id: uid('promo'), used_count: 0, ...data }; DB.promo_codes.push(row); return clone(row); }
    case 'banners': { const row = { id: uid('banner'), ...data }; DB.banners.push(row); return clone(row); }
    case 'notifications': { const row = { id: uid('notif'), created_at: new Date().toISOString(), ...data }; DB.notifications.push(row); return clone(row); }
    case 'reviews': { const row = { id: uid('review'), created_at: new Date().toISOString(), ...data }; DB.reviews.push(row); return clone(row); }
    default: throw new Error('unsupported_table');
  }
}

function updateRow(table, id, data) {
  switch (table) {
    case 'categories': { const row = DB.categories.find((c) => c.id === id); if (!row) throw new Error('not_found'); Object.assign(row, data); return clone(row); }
    case 'subcategories': { const row = DB.subcategories.find((c) => c.id === id); if (!row) throw new Error('not_found'); Object.assign(row, data); return clone(row); }
    case 'badges': { const row = DB.badges.find((b) => b.id === id); if (!row) throw new Error('not_found'); Object.assign(row, data); return clone(row); }
    case 'products': { const row = findProductRaw(id); if (!row) throw new Error('not_found'); Object.assign(row, data); return clone(row); }
    case 'product_variants': { const found = findVariantAnywhere(id); if (!found) throw new Error('not_found'); Object.assign(found.variant, data); return clone(found.variant); }
    case 'contact_links': { const row = DB.contact_links.find((c) => c.id === id); if (!row) throw new Error('not_found'); Object.assign(row, data); return clone(row); }
    case 'banners': { const row = DB.banners.find((b) => b.id === id); if (!row) throw new Error('not_found'); Object.assign(row, data); return clone(row); }
    case 'notifications': { const row = DB.notifications.find((n) => n.id === id); if (!row) throw new Error('not_found'); Object.assign(row, data); return clone(row); }
    case 'reviews': { const row = DB.reviews.find((r) => r.id === id); if (!row) throw new Error('not_found'); Object.assign(row, data); return clone(row); }
    default: throw new Error('unsupported_table');
  }
}

function upsertRow(table, data) {
  if (table === 'app_settings') {
    DB.app_settings[data.key] = data.value;
    return { key: data.key, value: data.value };
  }
  throw new Error('unsupported_table');
}

function deleteRow(table, id) {
  switch (table) {
    case 'categories': DB.categories = DB.categories.filter((c) => c.id !== id); break;
    case 'subcategories': DB.subcategories = DB.subcategories.filter((c) => c.id !== id); break;
    case 'badges':
      DB.badges = DB.badges.filter((b) => b.id !== id);
      DB.products.forEach((p) => { p.badges = (p.badges || []).filter((b) => b.id !== id); });
      break;
    case 'products': DB.products = DB.products.filter((p) => p.id !== id); break;
    case 'product_variants':
      DB.products.forEach((p) => { p.variants = (p.variants || []).filter((v) => v.id !== id); });
      break;
    case 'product_lots':
      DB.products.forEach((p) => (p.variants || []).forEach((v) => { v.lots = (v.lots || []).filter((l) => l.id !== id); }));
      break;
    case 'product_badges': {
      const found = findBadgeLinkAnywhere(id);
      if (found) found.product.badges = (found.product.badges || []).filter((b) => `pb-${found.product.id}-${b.id}` !== id);
      break;
    }
    case 'contact_links': DB.contact_links = DB.contact_links.filter((c) => c.id !== id); break;
    case 'promo_codes': DB.promo_codes = DB.promo_codes.filter((p) => p.id !== id); break;
    case 'banners': DB.banners = DB.banners.filter((b) => b.id !== id); break;
    case 'notifications': DB.notifications = DB.notifications.filter((n) => n.id !== id); break;
    case 'reviews': DB.reviews = DB.reviews.filter((r) => r.id !== id); break;
    default: throw new Error('unsupported_table');
  }
  return { ok: true };
}

function duplicateProduct(id) {
  const original = findProductRaw(id);
  if (!original) throw new Error('not_found');
  const copy = clone(original);
  copy.id = uid('prod');
  copy.name = `${original.name} (copie)`;
  copy.variants = (copy.variants || []).map((v) => ({ ...v, id: uid('var'), lots: (v.lots || []).map((l) => ({ ...l, id: uid('lot') })) }));
  copy.media = (copy.media || []).map((m) => ({ ...m, id: uid('media') }));
  DB.products.push(copy);
  return clone(copy);
}

// ---------- Facteurs 2/3 de la connexion admin — auto-validés ----------
export async function adminLoginCall(payload) {
  await delay(400, 800);
  if (payload.action === 'start') {
    return { ok: true, message: 'Code envoyé (démo).' };
  }
  if (payload.action === 'verify_otp') {
    return {
      token: uid('session'),
      expires_at: new Date(Date.now() + 20 * 60000).toISOString(),
      name: 'Admin Démo',
    };
  }
  throw new Error('unsupported_action');
}

// ---------- Médias : upload simulé (data URL en mémoire, jamais envoyé) ----------
const mediaStore = new Map();
function createUploadUrlMock({ folder, product_id, file_name }) {
  const path = `${folder || product_id || 'misc'}/${uid('file')}-${(file_name || 'fichier').replace(/[^a-zA-Z0-9._-]/g, '_')}`;
  return { path, token: 'demo-token' };
}
export async function uploadToSignedUrl({ bucket, path, token, file }) {
  await delay(250, 600);
  try {
    const dataUrl = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
    mediaStore.set(path, dataUrl);
  } catch {
    // en cas d'échec de lecture locale, on laisse publicMediaUrl retomber sur un visuel par défaut
  }
}
export function publicMediaUrl(bucket, path) {
  return mediaStore.get(path) || 'assets/images/logo-splash.jpg';
}
function uploadMediaBase64({ product_id, file_base64, file_name }) {
  const path = `product-media/${uid('file')}-${file_name || 'fichier'}`;
  if (file_base64) mediaStore.set(path, file_base64);
  return { path, url: publicMediaUrl('product-media', path) };
}
function deleteMedia(mediaId) {
  DB.products.forEach((p) => { p.media = (p.media || []).filter((m) => m.id !== mediaId); });
  return { ok: true };
}

// ---------- Codes promo ----------
export async function validatePromoCode(code, cartTotal) {
  await delay(150, 350);
  const promo = DB.promo_codes.find((p) => p.code.toLowerCase() === String(code || '').toLowerCase());
  if (!promo) return { valid: false, reason: 'not_found' };
  return { valid: true, type: promo.type, value: promo.value, code: promo.code };
}
