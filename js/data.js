// Données centrales - Panier de Grâce · Thanksgiving & Semaine de la Gratitude 2026 (Cotonou, Bénin)

export const SITE_CONFIG = {
  key: 'pdg',
  brand: 'Panier de Grâce',
  title: 'Panier de Grâce – Paniers gourmands de Thanksgiving & Semaine de la Gratitude · Cotonou',
  description: 'Paniers gourmands d\'artisans béninois pour Thanksgiving & la Semaine de la Gratitude : miel de Parakou, cajou de Grand-Popo, bissap de Cotonou, mangues de Natitingou.',
  lowStock: 6,
  freeShip: 35000,
  shipFee: 2000,
  event: {
    start: '2026-11-20T00:00:00+01:00',
    end: '2026-11-26T12:00:00+01:00',
    labels: {
      before: 'Thanksgiving & la Semaine de la Gratitude commencent dans',
      live: 'Dernières commandes pour le jeudi 26 novembre dans',
      after: 'Merci ! Rendez-vous en novembre 2027'
    }
  },
  demoTime: {
    before: '2026-10-20T12:00:00+01:00',
    live: '2026-11-24T10:00:00+01:00',
    after: '2026-11-28T10:00:00+01:00'
  },
  codes: {
    MERCI10: 10,
    GRATITUDE15: 15
  },
  delivery: 'Précommandes ouvertes. Livraison au créneau de votre choix <b>du 20 au 26 novembre 2026</b> à Cotonou, Calavi et Porto-Novo.',
  deliveryLong: 'Livraison express sur créneau (matin 8h-12h ou après-midi 14h-18h) du 20 au 26 novembre. Frais : 2 000 FCFA (offerte dès 35 000 FCFA). Produits frais du terroir : remplacement immédiat sous 48h si un article arrive endommagé.',
  returns: 'Produit abîmé ? Remplacement ou remboursement sous 48 h garanti',
  ctaCard: 'Offrir',
  ctaPdp: 'Offrir ce panier',
  ctaSticky: 'Offrir',
  ctaCheckout: 'Valider ma commande',
  crossTitle: 'Complétez votre geste de gratitude',
  emptyCart: 'Composez un panier pour dire merci à ceux qui comptent.',
  cats: [
    ['paniers', 'Paniers complets'],
    ['coffrets', 'Coffrets duo & trio'],
    ['epicerie', 'Épicerie fine & Terroir']
  ]
};

export const PRODUCTS = [
  {
    id: 'panier-famille',
    name: 'Panier Famille',
    cat: 'paniers',
    catLabel: 'Panier · 4 à 6 personnes',
    price: 29900,
    was: 36500,
    img: 'img/panier-famille.webp',
    rating: 4.9,
    reviews: 312,
    stock: 18,
    badge: 'Le plus choisi',
    region: 'Multi-terroirs',
    short: 'Le panier emblématique qui dit merci à toute la famille : miel de Parakou, cajou grillées, bissap, confiture de mangue et fruits séchés.',
    desc: 'Panier traditionnel en raphia tressé à la main à Ouidah, garni de 7 trésors de nos artisans partenaires. Chaque produit est sélectionné pour son goût pur et son authenticité. Valeur au détail : 36 500 FCFA.',
    details: [
      'Miel pur toutes fleurs de Parakou (500 g)',
      'Noix de cajou grillées au sel de Grand-Popo (400 g)',
      'Bissap artisanal hibiscus & menthe (2 × 75 cl)',
      'Confiture artisanale mangue-gingembre de Natitingou (250 g)',
      'Ananas pain de sucre & mangues séchés d\'Allada (300 g)',
      'Sablés fondants au beurre de karité et sésame (200 g)',
      'Carte « Merci » calligraphiée à la main offerte'
    ],
    cross: ['bissap', 'confiture', 'miel-cajou'],
    reviewsList: [
      ['Clarisse M., Cotonou', 'Ma belle-mère a été très émue en lisant la carte manuscrite. Et le miel de Parakou est d\'une pureté remarquable.', 5],
      ['Jean-Marc D., Paris (Diaspora)', 'Commandé depuis Paris pour mes parents à Porto-Novo. Livré à l\'heure convenue avec la photo de remise sur WhatsApp.', 5],
      ['Amina S., Fidjrossè', 'Le panier en raphia sert maintenant de décoration au salon. Tous les produits étaient frais et parfumés.', 5]
    ]
  },
  {
    id: 'panier-tablee',
    name: 'Panier Grande Tablée',
    cat: 'paniers',
    catLabel: 'Panier · 10 à 12 personnes',
    price: 54900,
    was: 68000,
    img: 'img/panier-tablee.webp',
    rating: 4.8,
    reviews: 141,
    stock: 5,
    badge: 'Grand format',
    region: 'Multi-terroirs',
    short: 'Pour les grandes réunions de famille et les repas qui débordent. 12 délices généreux pour combler toute la maisonnée.',
    desc: 'Grand panier tressé double anse d\'Ouidah, garni de 12 spécialités béninoises dont 2 ananas frais pain de sucre d\'Allada cueillis à maturité.',
    details: [
      'Tout le contenu du Panier Famille en format double',
      '2 Ananas pain de sucre d\'Allada extra-doux',
      'Coffret infusion kinkeliba de l\'Atacora & tasse en poterie de Sè',
      'Pur jus de pulpe de baobab bio (75 cl)',
      'Chips de banane plantain au sel marin (2 × 150 g)',
      'Carte « Merci » grand format personnalisée'
    ],
    cross: ['kinkeliba', 'bissap', 'confiture'],
    reviewsList: [
      ['Association des Parents, Calavi', 'Nous avons partagé ce panier lors de notre fête de fin d\'année. Une abondance de saveurs locales appréciée de tous.', 5],
      ['Éric K., Cotonou Haie Vive', 'Parfait pour notre déjeuner du dimanche en famille. Les ananas étaient extrêmement sucrés.', 5]
    ]
  },
  {
    id: 'miel-cajou',
    name: 'Coffret Miel & Cajou',
    cat: 'coffrets',
    catLabel: 'Coffret · 1 à 2 personnes',
    price: 14900,
    was: null,
    img: 'img/miel-cajou.webp',
    rating: 4.7,
    reviews: 208,
    stock: 26,
    badge: 'Cadeau idéal',
    region: 'Parakou & Grand-Popo',
    short: 'L\'attention raffinée qui touche au cœur : miel doré de Parakou et noix de cajou croquantes au sel de mer de Grand-Popo.',
    desc: 'Écrin éco-conçu en kraft naturel avec ruban terracotta tissé, renfermant le duo le plus apprécié de notre terroir pour une pause gourmande inoubliable.',
    details: [
      'Miel doré de fleurs sauvages de Parakou (250 g)',
      'Noix de cajou W180 grillées au sel marin (250 g)',
      'Cuillère à miel en bois d\'iroko sculptée à la main',
      'Carte « Merci » personnalisée'
    ],
    cross: ['confiture', 'kinkeliba', 'panier-famille'],
    reviewsList: [
      ['Sophie B., Ganhi', 'Offert à mes collègues de bureau. Emballage soigné et cajou ultra-croquantes.', 5],
      ['Patrick T., Cotonou', 'Le sel de Grand-Popo fait toute la différence sur les noix de cajou !', 4]
    ]
  },
  {
    id: 'kinkeliba',
    name: 'Coffret Thé Kinkeliba & Biscuits',
    cat: 'coffrets',
    catLabel: 'Coffret · 2 personnes',
    price: 11900,
    was: null,
    img: 'img/kinkeliba.webp',
    rating: 4.6,
    reviews: 97,
    stock: 14,
    badge: 'Bien-être',
    region: 'Atacora & Sè',
    short: 'Rituel apaisant : feuilles de kinkeliba séchées au soleil, tasse artisanale en poterie de Sè et sablés au karité.',
    desc: 'Un coffret pensé pour les matins sereins et les fins d\'après-midi de gratitude. Le kinkeliba est réputé pour ses vertus détoxifiantes et sa saveur boisée.',
    details: [
      'Feuilles entières de kinkeliba sauvage d\'Atacora (100 g)',
      'Tasse en céramique cuite au feu de bois à Sè (pièce unique)',
      'Sablés pur beurre de karité doux (150 g)',
      'Filtre à thé en coton bio réutilisable'
    ],
    cross: ['miel-cajou', 'confiture', 'panier-famille'],
    reviewsList: [
      ['Dr. Rodrigue L., Akpakpa', 'La tasse en poterie garde le thé bien chaud. Très beau coffret authentique.', 5]
    ]
  },
  {
    id: 'bissap',
    name: 'Bissap Artisanal Grand Cru × 6',
    cat: 'epicerie',
    catLabel: 'Épicerie fine · 6 bouteilles',
    price: 8900,
    was: null,
    img: 'img/bissap.webp',
    rating: 4.9,
    reviews: 264,
    stock: 40,
    badge: 'Rafraîchissant',
    region: 'Cotonou',
    short: 'Pack de 6 bouteilles (33 cl) d\'hibiscus bio infusé à froid, menthe fraîche et touche de gingembre. Faiblement sucré au miel.',
    desc: 'Infusion lente à froid pour préserver tous les antioxydants et arômes floraux. Recette de Mariette transmise de mère en fille.',
    details: [
      '6 bouteilles en verre consigné de 33 cl',
      'Calices d\'hibiscus sabdariffa récoltés à la main',
      'Infusion menthe poivrée & zeste de citron vert',
      'Sans conservateurs ni arômes artificiels'
    ],
    cross: ['confiture', 'miel-cajou', 'panier-famille'],
    reviewsList: [
      ['Nadia O., Fidjrossè Plage', 'Le meilleur bissap de Cotonou, pas trop sucré et très parfumé. Parfait bien frais.', 5]
    ]
  },
  {
    id: 'confiture',
    name: 'Duo Confiture Mangue-Gingembre',
    cat: 'epicerie',
    catLabel: 'Épicerie fine · 2 pots',
    price: 4900,
    was: null,
    img: 'img/confiture.webp',
    rating: 4.8,
    reviews: 133,
    stock: 22,
    badge: 'Artisanal',
    region: 'Natitingou',
    short: 'Mangues Gouverneur gorgées de soleil de Natitingou, gingembre frais râpé, cuisson douce au chaudron de cuivre.',
    desc: 'Une explosion de soleil en bouche avec une légère note épicée de gingembre qui réveille les papilles au petit-déjeuner.',
    details: [
      '2 pots en verre de 250 g',
      '70 % de fruits entiers pour 100 g',
      'Sucre de canne non raffiné',
      'Idéal sur pain chaud, brioche ou fromage frais'
    ],
    cross: ['bissap', 'kinkeliba', 'miel-cajou'],
    reviewsList: [
      ['Gilles V., Cotonou', 'L\'équilibre mangue et gingembre est sublime. Je recommande les yeux fermés.', 5]
    ]
  }
];

export const TERROIRS = [
  {
    id: 'parakou',
    name: 'Parakou (Borgou)',
    product: 'Miel sauvage toutes fleurs',
    artisan: 'Issa & sa coopérative apicole',
    story: 'Issa pose ses ruches traditionnelles au cœur des savanes arborées. La récolte respecte le cycle des abeilles et garantit un miel cru 100% pur non chauffé.',
    impact: '+22% de revenu direct pour les apiculteurs de Parakou',
    coords: { x: '52%', y: '42%' }
  },
  {
    id: 'natitingou',
    name: 'Natitingou (Atacora)',
    product: 'Mangues Gouverneur & Kinkeliba',
    artisan: 'Théophile & les vergers familiaux',
    story: 'Dans les collines de l\'Atacora, les manguiers centenaires produisent des fruits charnus au parfum incomparable, cuisinés en chaudron le jour même de la récolte.',
    impact: 'Zéro déchet de récolte grâce à la transformation locale',
    coords: { x: '35%', y: '28%' }
  },
  {
    id: 'ouidah',
    name: 'Ouidah (Atlantique)',
    product: 'Vannerie en raphia & packaging naturel',
    artisan: 'Atelier des tisseuses de Ouidah',
    story: 'Chaque panier est tressé à la main avec du raphia végétal durable. Une œuvre d\'artisanat conçue pour être réutilisée des années dans votre intérieur.',
    impact: 'Soutien direct à l\'autonomisation de 28 artisanes',
    coords: { x: '45%', y: '82%' }
  },
  {
    id: 'grand-popo',
    name: 'Grand-Popo (Mono)',
    product: 'Sel marin & Noix de cajou W180',
    artisan: 'Coopérative de la lagune de Grand-Popo',
    story: 'Le sel est récolté traditionnellement sur la lagune, apportant une délicate note iodée aux noix de cajou grillées au feu de bois.',
    impact: 'Préservation des méthodes de récolte lagunaires',
    coords: { x: '25%', y: '86%' }
  },
  {
    id: 'allada',
    name: 'Allada (Atlantique)',
    product: 'Ananas Pain de Sucre',
    artisan: 'Plantations agroécologiques d\'Allada',
    story: 'L\'ananas pain de sucre du Bénin, célèbre dans toute l\'Afrique de l\'Ouest pour son cœur tendre et son jus suave sans acidité.',
    impact: 'Culture certifiée sans pesticides de synthèse',
    coords: { x: '58%', y: '74%' }
  }
];

export const QUIZ_QUESTIONS = [
  {
    id: 'recipient',
    title: 'À qui souhaitez-vous dire Merci ?',
    subtitle: 'Choisissez la personne ou le groupe que vous voulez honorer',
    options: [
      { label: 'Toute la famille réunie', iconSvg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>', value: 'family' },
      { label: 'Un parent, ami ou mentor', iconSvg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>', value: 'single' },
      { label: 'Une grande tablée (> 8 pers.)', iconSvg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="10" rx="2"/><path d="M6 17v4"/><path d="M18 17v4"/><path d="M6 7V3"/><path d="M18 7V3"/></svg>', value: 'large' },
      { label: 'Des collègues ou partenaires pro', iconSvg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>', value: 'pro' }
    ]
  },
  {
    id: 'taste',
    title: 'Quelle ambiance gustative préférez-vous ?',
    subtitle: 'Chaque panier a son harmonie de saveurs',
    options: [
      { label: 'Sucré & Douceurs (Miel, Confitures, Sablés)', iconSvg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a7 7 0 0 0-7 7c0 2.38 1.19 4.47 3 5.74V17a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-2.26c1.81-1.27 3-3.36 3-5.74a7 7 0 0 0-7-7z"/><path d="M10 21h4"/></svg>', value: 'sweet' },
      { label: 'Complet & Festif (Boissons, Fruits & Cajou)', iconSvg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 8h14l-1 13H6z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg>', value: 'festive' },
      { label: 'Pause thé & infusion bien-être', iconSvg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>', value: 'wellness' }
    ]
  },
  {
    id: 'budget',
    title: 'Quel est votre budget idéal ?',
    subtitle: 'Livraison offerte dès 35 000 FCFA',
    options: [
      { label: 'Moins de 15 000 FCFA', iconSvg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>', value: 'low' },
      { label: 'Entre 15 000 et 35 000 FCFA', iconSvg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2"/></svg>', value: 'mid' },
      { label: 'Plus de 50 000 FCFA (Prestige)', iconSvg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></polygon></svg>', value: 'high' }
    ]
  }
];
