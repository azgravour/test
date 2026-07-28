// ============================================================
// Jeu de données statique pour la vitrine (mode démo).
// Aucun appel réseau : tout est servi depuis ce module par
// js/api.js. Contenu fictif, aucune donnée réelle de production.
// ============================================================

const now = () => new Date().toISOString();
const daysAgo = (n) => new Date(Date.now() - n * 86400000).toISOString();
const IMG = 'assets/images/';

export function buildSeed() {
  const categories = [
    { id: 'cat-miels', name: 'Miels', icon: '🍯', icon_image_url: null, sort_order: 0, is_hidden: false },
    { id: 'cat-pollen', name: 'Pollen & Propolis', icon: '🌼', icon_image_url: null, sort_order: 1, is_hidden: false },
    { id: 'cat-coffrets', name: 'Coffrets', icon: '🎁', icon_image_url: null, sort_order: 2, is_hidden: false },
  ];

  const subcategories = [
    { id: 'sub-miel-fleurs', name: 'Miel de fleurs', category_id: 'cat-miels', sort_order: 0 },
    { id: 'sub-miel-montagne', name: 'Miel de montagne', category_id: 'cat-miels', sort_order: 1 },
    { id: 'sub-pollen-frais', name: 'Pollen frais', category_id: 'cat-pollen', sort_order: 0 },
    { id: 'sub-propolis', name: 'Propolis', category_id: 'cat-pollen', sort_order: 1 },
  ];

  const badges = [
    { id: 'badge-bio', name: 'Bio', image_url: IMG + 'paw-logo.jpg' },
    { id: 'badge-artisanal', name: 'Artisanal', image_url: IMG + 'paw-logo.jpg' },
    { id: 'badge-local', name: 'Circuit court', image_url: IMG + 'paw-logo.jpg' },
  ];

  const products = [
    {
      id: 'prod-fleurs', name: 'Miel de fleurs sauvages', category_id: 'cat-miels', subcategory_id: 'sub-miel-fleurs',
      description: "Récolté au printemps dans les prairies non traitées, un miel doux et floral, parfait au quotidien.",
      highlights: 'Non pasteurisé, Récolte artisanale, Pot en verre consigné',
      sort_order: 0, is_hidden: false, is_featured: true, likes: 34,
      media: [{ id: 'm1', type: 'image', url: IMG + 'logo-splash.jpg', sort_order: 0 }],
      variants: [
        { id: 'v1', name: 'Standard', unit: '250g', price: 8.9, stock: 24, sort_order: 0, lots: [{ id: 'l1', quantity: 3, price: 24 }] },
        { id: 'v2', name: 'Grand pot', unit: '500g', price: 15.9, stock: 12, sort_order: 1, lots: [] },
      ],
      badges: [badges[0], badges[2]],
    },
    {
      id: 'prod-montagne', name: 'Miel de montagne', category_id: 'cat-miels', subcategory_id: 'sub-miel-montagne',
      description: "Un miel ambré au goût prononcé, issu de ruchers d'altitude.",
      highlights: 'Goût intense, Édition limitée',
      sort_order: 1, is_hidden: false, is_featured: false, likes: 19,
      media: [{ id: 'm2', type: 'image', url: IMG + 'logo-splash.jpg', sort_order: 0 }],
      variants: [
        { id: 'v3', name: 'Standard', unit: '250g', price: 10.5, stock: 4, sort_order: 0, lots: [] },
      ],
      badges: [badges[1]],
    },
    {
      id: 'prod-acacia', name: 'Miel d\'acacia', category_id: 'cat-miels', subcategory_id: 'sub-miel-fleurs',
      description: "Miel très clair et fluide, saveur douce et délicate, apprécié des enfants.",
      highlights: 'Texture fluide, Goût très doux',
      sort_order: 2, is_hidden: false, is_featured: true, likes: 41,
      media: [{ id: 'm3', type: 'image', url: IMG + 'logo-splash.jpg', sort_order: 0 }],
      variants: [
        { id: 'v4', name: 'Standard', unit: '250g', price: 9.4, stock: 0, sort_order: 0, lots: [] },
      ],
      badges: [badges[0]],
    },
    {
      id: 'prod-pollen', name: 'Pollen frais de fleurs', category_id: 'cat-pollen', subcategory_id: 'sub-pollen-frais',
      description: "Pollen récolté et surgelé sous 48h pour préserver ses qualités nutritives.",
      highlights: 'Riche en protéines, Conservation optimale',
      sort_order: 0, is_hidden: false, is_featured: true, likes: 27,
      media: [{ id: 'm4', type: 'image', url: IMG + 'logo-splash.jpg', sort_order: 0 }],
      variants: [
        { id: 'v5', name: 'Standard', unit: '200g', price: 12.9, stock: 8, sort_order: 0, lots: [] },
      ],
      badges: [badges[0], badges[2]],
    },
    {
      id: 'prod-propolis', name: 'Propolis pure', category_id: 'cat-pollen', subcategory_id: 'sub-propolis',
      description: "Résine de propolis brute, récoltée à la main sur nos ruches.",
      highlights: 'Récolte manuelle, Sans additif',
      sort_order: 1, is_hidden: false, is_featured: false, likes: 11,
      media: [{ id: 'm5', type: 'image', url: IMG + 'logo-splash.jpg', sort_order: 0 }],
      variants: [
        { id: 'v6', name: 'Pilulier', unit: '30 pièces', price: 14.5, stock: 15, sort_order: 0, lots: [] },
      ],
      badges: [badges[1]],
    },
    {
      id: 'prod-coffret', name: 'Coffret découverte', category_id: 'cat-coffrets', subcategory_id: null,
      description: "3 miels signatures + 1 pot de pollen, présentés dans un coffret cadeau.",
      highlights: 'Idée cadeau, 4 produits inclus',
      sort_order: 0, is_hidden: false, is_featured: true, likes: 52,
      media: [{ id: 'm6', type: 'image', url: IMG + 'logo-splash.jpg', sort_order: 0 }],
      variants: [
        { id: 'v7', name: 'Coffret', unit: 'pièce', price: 29.9, stock: 6, sort_order: 0, lots: [] },
      ],
      badges: [badges[0], badges[1], badges[2]],
    },
  ];

  const active_promotions = [
    { id: 'promo1', variant_id: 'v3', product_id: null, type: 'percent', value: 15 },
  ];

  const app_settings = {
    app_title: 'AZG TEST',
    welcome_message: 'Bienvenue sur AZG TEST 👋',
    contact_link: 'https://t.me/legendlabs_demo',
    payment_info: "Cette vitrine est une démonstration : aucun paiement réel n'est traité.\n\nDans une version connectée à un vrai commerce, cette section listerait les moyens de paiement acceptés (carte bancaire, virement, paiement à la livraison...) ainsi que les éventuelles conditions (acompte, paiement en plusieurs fois, etc.).",
    shipping_info: "Démonstration uniquement — aucune commande n'est réellement expédiée.\n\nCette section est prévue pour détailler les zones de livraison, les délais et les transporteurs utilisés, entièrement modifiable depuis le panneau admin sans toucher au code.",
    faq_content: "Cette mini-app est une vitrine de démonstration créée par Azgravour Dev pour présenter une architecture Telegram Mini App + Supabase (authentification, panneau admin, gestion de catalogue).\n\nAucune donnée n'est réelle et aucune action admin n'est sauvegardée — un rechargement de page réinitialise le contenu.\n\nPour un projet sur mesure (site vitrine, boutique en ligne, mini-app Telegram, automatisation), contacte Azgravour Dev via les liens ci-dessus.",
    maintenance_enabled: false,
    maintenance_title: 'Maintenance en cours',
    maintenance_message: "On revient très vite, merci de ta patience !",
    feature_notifications: true,
    feature_favoris: true,
    feature_promo: true,
  };

  const contact_links = [
    { id: 'c1', label: 'Telegram', url: 'https://t.me/legendlabs_demo', icon: '✈️', sort_order: 0 },
    { id: 'c2', label: 'Instagram', url: 'https://instagram.com', icon: '📷', sort_order: 1 },
  ];

  const reviews = [
    { id: 'r1', rating: 5, comment: 'Miel délicieux, livraison rapide !', author_name: 'Camille', created_at: daysAgo(3), product_id: 'prod-fleurs' },
    { id: 'r2', rating: 4, comment: 'Très bon produit, packaging soigné.', author_name: 'Nadia', created_at: daysAgo(8), product_id: 'prod-coffret' },
    { id: 'r3', rating: 5, comment: 'Le pollen est excellent, je recommande.', author_name: 'Yanis', created_at: daysAgo(14), product_id: 'prod-pollen' },
  ];

  const notifications = [
    { id: 'n1', title: 'Bienvenue sur la démo', message: "Explore le catalogue et le panneau admin librement.", type: 'info', created_at: daysAgo(0), is_published: true },
    { id: 'n2', title: 'Nouveau : coffret découverte', message: 'Idéal pour offrir.', type: 'promo', created_at: daysAgo(2), is_published: true },
  ];

  const banners = [
    { id: 'b1', image_url: IMG + 'logo-splash.jpg', link_url: null, product_id: 'prod-coffret', sort_order: 0, is_active: true },
    { id: 'b2', image_url: IMG + 'logo-splash.jpg', link_url: null, product_id: 'prod-fleurs', sort_order: 1, is_active: true },
  ];

  const promo_codes = [
    { id: 'pc1', code: 'DEMO10', type: 'percent', value: 10, max_uses: 100, used_count: 3 },
  ];

  return { categories, subcategories, products, active_promotions, app_settings, contact_links, reviews, notifications, banners, badges, promo_codes };
}
