// Application Logic - Panier de Grâce (Vanilla JS)
import { SITE_CONFIG, PRODUCTS, TERROIRS, QUIZ_QUESTIONS } from './data.js';

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const fcfa = n => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF', maximumFractionDigits: 0 }).format(Math.round(n));
const pct = (was, now) => Math.round((1 - now / was) * 100);
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const P = Object.fromEntries(PRODUCTS.map(p => [p.id, p]));

// DEMO time handling
const qs = new URLSearchParams(location.search);
const DEMO = qs.get('demo');
const NOW = () => {
  if (DEMO && SITE_CONFIG.demoTime && SITE_CONFIG.demoTime[DEMO]) {
    return Date.parse(SITE_CONFIG.demoTime[DEMO]);
  }
  return Date.now();
};

// Cart state
const CART_KEY = 'pdg_cart_2026';
let cart = [];
try { cart = JSON.parse(localStorage.getItem(CART_KEY)) || []; } catch (e) { cart = []; }
let promoCode = null;

const saveCart = () => {
  try { localStorage.setItem(CART_KEY, JSON.stringify(cart)); } catch (e) {}
};

export function addToCart(id, qty = 1, note = '') {
  const item = cart.find(x => x.id === id);
  if (item) {
    item.qty += qty;
    if (note) item.note = note;
  } else {
    cart.push({ id, qty, note });
  }
  saveCart();
  renderCart();
  
  // Bump animation on cart badge
  $$('.cart-count').forEach(c => {
    c.classList.remove('bump');
    void c.offsetWidth;
    c.classList.add('bump');
  });
  
  toast(`✓ ${P[id].name} ajouté au panier`);
  setTimeout(openCart, 300);
}

export function openCart() {
  $('.drawer')?.classList.add('open');
  $('.overlay')?.classList.add('open');
  $('.drawer')?.setAttribute('aria-hidden', 'false');
  setTimeout(() => $('.close-btn', $('.drawer'))?.focus(), 50);
}

export function closeCart() {
  $('.drawer')?.classList.remove('open');
  $('.overlay')?.classList.remove('open');
  $('.drawer')?.setAttribute('aria-hidden', 'true');
}

function subtotal() {
  return cart.reduce((sum, item) => sum + (P[item.id] ? P[item.id].price * item.qty : 0), 0);
}

function renderCart() {
  const count = cart.reduce((sum, item) => sum + item.qty, 0);
  $$('.cart-count').forEach(c => c.textContent = count);
  
  const body = $('.drawer-b');
  const foot = $('.drawer-f');
  if (!body || !foot) return;
  
  if (!cart.length) {
    body.innerHTML = `
      <div style="text-align:center; padding: 4rem 1rem; color: var(--muted);">
        <svg style="width:54px; height:54px; margin:0 auto 1rem; opacity:0.4;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M5 8h14l-1 13H6z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg>
        <h3 style="font-size:1.2rem; color:var(--sec); margin-bottom:0.5rem;">Votre panier est vide</h3>
        <p style="font-size:0.92rem; margin-bottom:1.5rem;">${SITE_CONFIG.emptyCart}</p>
        <a class="btn btn-acc btn-sm" href="#/boutique" onclick="window.PanierApp.closeCart()">Découvrir nos paniers</a>
      </div>
    `;
    foot.hidden = true;
    return;
  }
  
  foot.hidden = false;
  const sub = subtotal();
  const freeThresh = SITE_CONFIG.freeShip;
  const missingForFree = Math.max(0, freeThresh - sub);
  const shipFee = missingForFree > 0 ? SITE_CONFIG.shipFee : 0;
  const discount = promoCode ? Math.round(sub * (promoCode.pct / 100)) : 0;
  const total = sub - discount + shipFee;
  
  const shipProgress = Math.min(100, (sub / freeThresh) * 100);
  
  body.innerHTML = `
    <div style="background:var(--bg-warm); padding:0.9rem 1rem; border-radius:8px; margin-bottom:1.2rem; font-size:0.88rem;">
      <div style="display:flex; justify-content:space-between; font-weight:700; margin-bottom:0.4rem;">
        <span>${missingForFree > 0 ? `Plus que <b>${fcfa(missingForFree)}</b> pour la livraison offerte` : '🎉 Livraison offerte débloquée !'}</span>
        <span style="color:var(--acc);">${Math.round(shipProgress)}%</span>
      </div>
      <div style="height:6px; background:var(--line); border-radius:999px; overflow:hidden;">
        <div style="height:100%; width:${shipProgress}%; background:var(--acc); border-radius:999px; transition:width 0.3s ease;"></div>
      </div>
    </div>
    <div class="cart-items-list">
      ${cart.map((item, idx) => {
        const prod = P[item.id];
        if (!prod) return '';
        return `
          <div class="cart-item">
            <img src="${prod.img}" alt="${esc(prod.name)}">
            <div>
              <h4 style="margin:0 0 0.2rem; font-size:0.95rem; font-weight:700;">${esc(prod.name)}</h4>
              <div style="font-size:0.8rem; color:var(--muted);">${prod.catLabel}</div>
              ${item.note ? `<div style="font-size:0.78rem; font-style:italic; color:var(--acc); margin-top:0.2rem;">Mot : « ${esc(item.note)} »</div>` : ''}
              <div class="qty-stepper" style="margin-top:0.4rem; transform:scale(0.85); transform-origin:left;">
                <button data-cart-q="${idx}" data-delta="-1" aria-label="Moins">−</button>
                <output>${item.qty}</output>
                <button data-cart-q="${idx}" data-delta="1" aria-label="Plus">+</button>
              </div>
            </div>
            <div style="text-align:right;">
              <b class="tnum" style="font-size:1rem; color:var(--sec);">${fcfa(prod.price * item.qty)}</b><br>
              <button class="cart-rm-btn" data-cart-rm="${idx}" style="background:none; border:0; color:var(--muted); font-size:0.8rem; text-decoration:underline; padding:0; margin-top:0.3rem;">Retirer</button>
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;
  
  foot.innerHTML = `
    <div style="display:flex; gap:0.5rem;">
      <input id="cart-promo-input" placeholder="CODE PROMO (ex: MERCI10)" value="${promoCode ? promoCode.code : ''}" style="flex:1; border:1.5px solid var(--line-strong); border-radius:8px; padding:0.6rem 0.8rem; text-transform:uppercase; font-size:0.9rem; background:var(--surface);">
      <button class="btn btn-ghost btn-sm" id="cart-promo-btn">Appliquer</button>
    </div>
    <div style="display:grid; gap:0.35rem; font-size:0.92rem; border-top:1px solid var(--line); padding-top:0.8rem;">
      <div style="display:flex; justify-content:space-between;"><span>Sous-total</span><b class="tnum">${fcfa(sub)}</b></div>
      ${promoCode ? `<div style="display:flex; justify-content:space-between; color:var(--acc);"><span>Remise (${promoCode.code} -${promoCode.pct}%)</span><b class="tnum">−${fcfa(discount)}</b></div>` : ''}
      <div style="display:flex; justify-content:space-between;"><span>Livraison (Cotonou / Calavi / Porto-Novo)</span><b class="tnum">${shipFee ? fcfa(shipFee) : '<span style="color:#1FAF55;">Offerte</span>'}</b></div>
      <div style="display:flex; justify-content:space-between; font-size:1.25rem; font-weight:800; color:var(--sec); border-top:1.5px dashed var(--line); padding-top:0.5rem; margin-top:0.2rem;">
        <span>Total TTC</span><b class="tnum">${fcfa(total)}</b>
      </div>
    </div>
    <button class="btn btn-acc btn-block" id="cart-checkout-btn">
      ${SITE_CONFIG.ctaCheckout} (${fcfa(total)})
    </button>
    <div style="display:flex; justify-content:center; gap:0.4rem; flex-wrap:wrap; font-size:0.72rem; font-weight:700; color:var(--muted); opacity:0.9;">
      <span style="border:1px solid var(--line); padding:0.2rem 0.5rem; border-radius:4px;">MTN MoMo</span>
      <span style="border:1px solid var(--line); padding:0.2rem 0.5rem; border-radius:4px;">Moov Money</span>
      <span style="border:1px solid var(--line); padding:0.2rem 0.5rem; border-radius:4px;">Wave</span>
      <span style="border:1px solid var(--line); padding:0.2rem 0.5rem; border-radius:4px;">Paiement à la livraison</span>
    </div>
  `;
}

// Toast
let toastTimer;
export function toast(msg) {
  let el = $('.toast');
  if (!el) {
    el = document.createElement('div');
    el.className = 'toast';
    document.body.appendChild(el);
  }
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 2800);
}

// Modal
export function showModal(html) {
  const existing = $('.modal');
  if (existing) existing.remove();
  
  const m = document.createElement('div');
  m.className = 'modal';
  m.setAttribute('role', 'dialog');
  m.setAttribute('aria-modal', 'true');
  m.innerHTML = `
    <div class="modal-bg"></div>
    <div class="modal-card">
      <button class="close-btn" style="position:absolute; top:0.8rem; right:0.8rem;" aria-label="Fermer">×</button>
      ${html}
    </div>
  `;
  document.body.appendChild(m);
  
  const close = () => m.remove();
  m.querySelector('.modal-bg')?.addEventListener('click', close);
  m.querySelector('.close-btn')?.addEventListener('click', close);
  
  document.addEventListener('keydown', function escListener(e) {
    if (e.key === 'Escape') {
      close();
      document.removeEventListener('keydown', escListener);
    }
  });
  return m;
}

// Feature 1: Quiz Logic
let quizAnswers = { recipient: null, taste: null, budget: null };
let quizStep = 0;

function initQuiz() {
  const container = $('#quiz-container');
  if (!container) return;
  
  renderQuizStep();
}

function renderQuizStep() {
  const container = $('#quiz-container');
  if (!container) return;
  
  if (quizStep >= QUIZ_QUESTIONS.length) {
    // Show Quiz Recommendation
    let recId = 'panier-famille';
    if (quizAnswers.recipient === 'single' || quizAnswers.budget === 'low') {
      recId = quizAnswers.taste === 'wellness' ? 'kinkeliba' : 'miel-cajou';
    } else if (quizAnswers.recipient === 'large' || quizAnswers.budget === 'high') {
      recId = 'panier-tablee';
    } else {
      recId = 'panier-famille';
    }
    
    const prod = P[recId];
    container.innerHTML = `
      <div class="quiz-card" style="text-align:center;">
        <span class="eyebrow" style="justify-content:center;">Votre recommandation personnalisée</span>
        <h3 style="font-size:1.8rem; margin-bottom:0.5rem;">Le cadeau parfait pour votre geste</h3>
        <p class="muted" style="max-width:48ch; margin:0 auto 1.5rem;">Selon vos réponses, ce panier créera la plus belle émotion auprès de vos destinataires.</p>
        
        <div class="quiz-result">
          <img src="${prod.img}" alt="${esc(prod.name)}" style="width:140px; height:140px; object-fit:cover; border-radius:12px;">
          <div style="text-align:left;">
            <div style="font-size:0.8rem; font-weight:800; color:var(--acc); text-transform:uppercase;">${prod.catLabel}</div>
            <h4 style="font-size:1.35rem; margin:0.2rem 0 0.5rem;">${esc(prod.name)}</h4>
            <p style="font-size:0.88rem; color:var(--muted); margin-bottom:0.8rem;">${prod.short}</p>
            <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.8rem;">
              <div class="price"><strong>${fcfa(prod.price)}</strong>${prod.was ? `<s>${fcfa(prod.was)}</s>` : ''}</div>
              <div style="display:flex; gap:0.5rem;">
                <button class="btn btn-acc btn-sm" onclick="window.PanierApp.addToCart('${prod.id}', 1)">Ajouter ce panier</button>
                <a class="btn btn-ghost btn-sm" href="#/produit/${prod.id}">Voir les détails</a>
              </div>
            </div>
          </div>
        </div>
        <button class="btn btn-ghost btn-sm" style="margin-top:1.5rem;" onclick="window.PanierApp.resetQuiz()">Recommencer le guide</button>
      </div>
    `;
    return;
  }
  
  const q = QUIZ_QUESTIONS[quizStep];
  container.innerHTML = `
    <div class="quiz-card">
      <div class="quiz-steps">
        ${QUIZ_QUESTIONS.map((_, idx) => `<div class="quiz-step-dot ${idx <= quizStep ? 'active' : ''}"></div>`).join('')}
      </div>
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.4rem;">
        <span class="eyebrow" style="margin:0;">Étape ${quizStep + 1} sur ${QUIZ_QUESTIONS.length}</span>
        ${quizStep > 0 ? `<button class="btn btn-ghost btn-sm" style="padding:0.2rem 0.6rem; min-height:28px;" onclick="window.PanierApp.prevQuizStep()">← Retour</button>` : ''}
      </div>
      <h3 style="font-size:clamp(1.4rem, 3vw, 1.8rem);">${q.title}</h3>
      <p class="muted" style="font-size:0.92rem; margin-bottom:1.2rem;">${q.subtitle}</p>
      
      <div class="quiz-options">
        ${q.options.map(opt => `
          <button class="quiz-opt-btn ${quizAnswers[q.id] === opt.value ? 'selected' : ''}" onclick="window.PanierApp.selectQuizOption('${q.id}', '${opt.value}')">
            ${opt.iconSvg ? `<span class="opt-icon">${opt.iconSvg}</span>` : ''}
            <span class="opt-title">${opt.label}</span>
          </button>
        `).join('')}
      </div>
    </div>
  `;
}

// Feature 2: Terroirs & Producers Interactive Section
function initTerroirs() {
  const container = $('#terroir-container');
  if (!container) return;
  
  let activeTerroirId = 'parakou';
  
  const render = () => {
    const t = TERROIRS.find(x => x.id === activeTerroirId) || TERROIRS[0];
    container.innerHTML = `
      <div class="terroir-grid">
        <div class="terroir-map">
          <div>
            <span class="eyebrow" style="color:var(--gold);">Traçabilité & Terroirs</span>
            <h3 style="font-size:1.8rem; color:#FAF3E8; margin-bottom:0.8rem;">14 Producteurs du Bénin</h3>
            <p style="color:rgba(250,243,232,0.8); font-size:0.92rem;">Cliquez sur un terroir pour découvrir son histoire et son impact direct.</p>
          </div>
          <div class="terroir-tabs">
            ${TERROIRS.map(item => `
              <button class="terroir-btn" aria-selected="${item.id === activeTerroirId}" data-terroir-id="${item.id}">
                <div>
                  <b style="display:block; font-size:1rem;">${item.name}</b>
                  <small style="opacity:0.8; font-size:0.8rem;">${item.product}</small>
                </div>
                <span>→</span>
              </button>
            `).join('')}
          </div>
        </div>
        
        <div class="terroir-detail">
          <div style="display:flex; justify-content:space-between; align-items:flex-start;">
            <div>
              <span class="eyebrow" style="margin-bottom:0.3rem;">Foyer artisanal</span>
              <h3>${t.name}</h3>
              <div class="terroir-artisan">${t.artisan}</div>
            </div>
            <span style="color:var(--acc);"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg></span>
          </div>
          <p style="font-size:1rem; line-height:1.65; color:var(--fg);">${t.story}</p>
          <div class="terroir-impact">
            <b>Impact direct garanti :</b> ${t.impact}
          </div>
          <div style="margin-top:1.5rem; display:flex; gap:1rem; align-items:center;">
            <a href="#/boutique" class="btn btn-acc btn-sm">Voir les paniers de ce terroir</a>
          </div>
        </div>
      </div>
    `;
    
    container.querySelectorAll('.terroir-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        activeTerroirId = btn.dataset.terroirId;
        render();
      });
    });
  };
  
  render();
}

// Interactive Handwritten Canvas Card Generator
function initCardCanvas() {
  const cv = document.getElementById('card-cv');
  if (!cv) return;
  const ctx = cv.getContext('2d');
  const to = document.getElementById('c-to');
  const msg = document.getElementById('c-msg');
  const from = document.getElementById('c-from');
  
  function wrapText(text, maxWidth) {
    const words = text.split(' ');
    const lines = [];
    let currentLine = '';
    words.forEach(w => {
      const testLine = currentLine ? currentLine + ' ' + w : w;
      if (ctx.measureText(testLine).width > maxWidth) {
        lines.push(currentLine);
        currentLine = w;
      } else {
        currentLine = testLine;
      }
    });
    if (currentLine) lines.push(currentLine);
    return lines;
  }
  
  function draw() {
    // Background cream parchment
    ctx.fillStyle = '#FAF3E8';
    ctx.fillRect(0, 0, 1080, 1350);
    
    // Outer terracotta decorative border
    ctx.fillStyle = '#C65D3B';
    ctx.fillRect(0, 0, 1080, 20);
    ctx.fillRect(0, 1330, 1080, 20);
    ctx.fillRect(0, 0, 20, 1350);
    ctx.fillRect(1060, 0, 20, 1350);
    
    // Inner gold border
    ctx.strokeStyle = '#D9A441';
    ctx.lineWidth = 4;
    ctx.strokeRect(55, 55, 970, 1240);
    
    // Header Calligraphy
    ctx.fillStyle = '#5C3D2E';
    ctx.textAlign = 'center';
    ctx.font = 'italic 600 140px Fraunces, Georgia, serif';
    ctx.fillText('Merci', 540, 360);
    
    // Sub-title "Pour..."
    ctx.font = '600 42px "Work Sans", sans-serif';
    ctx.fillStyle = '#C65D3B';
    const recipientText = (to && to.value ? to.value : 'Toi').toUpperCase();
    ctx.fillText(`POUR ${recipientText}`, 540, 480);
    
    // Decorative separator line
    ctx.strokeStyle = '#D9A441';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(340, 520);
    ctx.lineTo(740, 520);
    ctx.stroke();
    
    // Body handwritten message
    ctx.font = 'italic 400 52px Fraunces, serif';
    ctx.fillStyle = '#5C3D2E';
    const messageText = msg && msg.value ? msg.value : 'Merci pour chaque instant partagé à ta table, cette année comme toujours.';
    const lines = wrapText(messageText, 800).slice(0, 6);
    lines.forEach((l, i) => {
      ctx.fillText(l, 540, 660 + (i * 74));
    });
    
    // Sender Signature
    ctx.font = '500 42px "Work Sans", sans-serif';
    ctx.fillStyle = '#7A6152';
    const senderText = from && from.value ? from.value : 'Avec toute ma gratitude';
    ctx.fillText(`— ${senderText}`, 540, 1140);
    
    // Footer watermark
    ctx.font = '700 24px "Work Sans", sans-serif';
    ctx.fillStyle = '#A94A2C';
    ctx.fillText('PANIER DE GRÂCE · SEMAINE DE LA GRATITUDE 2026', 540, 1240);
  }
  
  [to, msg, from].forEach(inp => inp && inp.addEventListener('input', draw));
  document.fonts.ready.then(draw);
  draw();
  
  // Download / Share handler
  $('#c-dl')?.addEventListener('click', async () => {
    const url = cv.toDataURL('image/png');
    try {
      if (navigator.canShare) {
        const blob = await (await fetch(url)).blob();
        const file = new File([blob], 'carte-merci-panier-de-grace.png', { type: 'image/png' });
        if (navigator.canShare({ files: [file] })) {
          await navigator.share({
            files: [file],
            title: 'Carte Merci - Panier de Grâce',
            text: 'Une carte de remerciement pour la Semaine de la Gratitude.'
          });
          return;
        }
      }
    } catch (e) {}
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'carte-merci-panier-de-grace.png';
    a.click();
    toast('✓ Carte Merci téléchargée avec succès');
  });
}

// Guest Calculator
function initCalculator() {
  const r = document.getElementById('guests');
  const o = document.getElementById('guests-out');
  const n = document.getElementById('guests-n');
  if (!r || !o || !n) return;
  
  const update = () => {
    const g = +r.value;
    n.textContent = g;
    let pick = 'panier-famille';
    let q = 1;
    if (g <= 2) {
      pick = 'miel-cajou';
      q = 1;
    } else if (g <= 6) {
      pick = 'panier-famille';
      q = 1;
    } else if (g <= 12) {
      pick = 'panier-tablee';
      q = 1;
    } else {
      pick = 'panier-tablee';
      q = Math.ceil(g / 12);
    }
    
    const prod = P[pick];
    o.innerHTML = `
      <img src="${prod.img}" alt="${esc(prod.name)}" style="width:120px; height:120px; object-fit:cover; border-radius:10px;">
      <div>
        <span class="eyebrow" style="color:var(--acc);">Conseil pour ${g} convive${g > 1 ? 's' : ''}</span>
        <h3 style="font-size:1.45rem; margin:0.2rem 0;">${q > 1 ? q + ' × ' : ''}${prod.name}</h3>
        <p class="muted" style="font-size:0.88rem; margin-bottom:0.5rem;">${prod.catLabel}</p>
        <div class="price">
          <strong>${fcfa(prod.price * q)}</strong>
          ${prod.was ? `<s>${fcfa(prod.was * q)}</s>` : ''}
        </div>
        <button class="btn btn-acc btn-sm" style="margin-top:0.8rem;" onclick="window.PanierApp.addToCart('${pick}', ${q})">
          Offrir ${q > 1 ? 'ces paniers' : 'ce panier'}
        </button>
      </div>
    `;
    r.style.setProperty('--v', `${((g - 1) / 19) * 100}%`);
  };
  
  r.addEventListener('input', update);
  update();
}

// Shop Rendering
let currentCat = 'all';
let currentSort = 'pop';

function renderShop() {
  const view = $('[data-view="shop"]');
  if (!view) return;
  
  const chips = $('#shop-chips', view);
  if (chips) {
    chips.innerHTML = [
      ['all', 'Tous les délices'],
      ...SITE_CONFIG.cats
    ].map(([k, l]) => `
      <button class="chip" aria-pressed="${k === currentCat}" data-shop-cat="${k}">${esc(l)}</button>
    `).join('');
  }
  
  let list = PRODUCTS.filter(p => currentCat === 'all' || p.cat === currentCat);
  const sorts = {
    pop: (a, b) => (b.reviews || 0) - (a.reviews || 0),
    asc: (a, b) => a.price - b.price,
    desc: (a, b) => b.price - a.price,
    disc: (a, b) => ((b.was ? pct(b.was, b.price) : 0) - (a.was ? pct(a.was, a.price) : 0))
  };
  list.sort(sorts[currentSort]);
  
  const countEl = $('#shop-count', view);
  if (countEl) countEl.textContent = `${list.length} produit${list.length > 1 ? 's' : ''}`;
  
  const grid = $('#shop-grid', view);
  if (grid) {
    grid.innerHTML = list.map(cardMarkup).join('');
  }
}

function cardMarkup(p) {
  const discount = p.was ? pct(p.was, p.price) : 0;
  return `
    <article class="card" data-id="${p.id}">
      <div class="card-media">
        ${p.badge ? `<span class="card-badge ${p.badge === 'Grand format' ? 'gold' : ''}">${esc(p.badge)}</span>` : ''}
        ${discount ? `<span class="card-badge" style="left:auto; right:0.8rem; background:var(--fg); color:var(--bg);">-${discount}%</span>` : ''}
        <img src="${p.img}" alt="${esc(p.name)}" loading="lazy" width="600" height="600">
      </div>
      <div class="card-body">
        <span class="card-cat">${esc(p.catLabel)}</span>
        <h3><a href="#/produit/${p.id}">${esc(p.name)}</a></h3>
        <p class="card-desc">${esc(p.short)}</p>
        <div class="price">
          <strong>${fcfa(p.price)}</strong>
          ${p.was ? `<s>${fcfa(p.was)}</s>` : ''}
        </div>
        <div class="card-actions">
          <button class="btn btn-acc btn-sm btn-block" onclick="window.PanierApp.addToCart('${p.id}', 1)">
            ${SITE_CONFIG.ctaCard} ce panier
          </button>
        </div>
      </div>
    </article>
  `;
}

// Product Details Page (PDP)
let pdpQty = 1;
function renderProduct(id) {
  const p = P[id];
  const v = $('[data-view="product"]');
  if (!v) return;
  if (!p) {
    v.innerHTML = `
      <div class="wrap" style="text-align:center; padding:5rem 1rem;">
        <h1>Produit introuvable</h1>
        <p class="muted">Ce panier n'est pas disponible pour cette édition.</p>
        <a class="btn btn-acc" href="#/boutique">Retour à la boutique</a>
      </div>
    `;
    return;
  }
  
  pdpQty = 1;
  document.title = `${p.name} – ${SITE_CONFIG.brand}`;
  const d = p.was ? pct(p.was, p.price) : 0;
  const crossProds = (p.cross || []).map(x => P[x]).filter(Boolean);
  
  v.innerHTML = `
    <div class="wrap">
      <nav class="crumbs" aria-label="Fil d'Ariane">
        <a href="#/">Accueil</a> / <a href="#/boutique">Nos Paniers</a> / <a href="#/boutique/${p.cat}">${esc(p.catLabel)}</a> / <span aria-current="page">${esc(p.name)}</span>
      </nav>
      
      <div class="pdp">
        <div class="pdp-media">
          <img src="${p.img}" alt="${esc(p.name)}" width="900" height="900" fetchpriority="high">
        </div>
        
        <div>
          <span class="eyebrow">${esc(p.catLabel)} · ${esc(p.region)}</span>
          <h1 style="margin-bottom:0.5rem;">${esc(p.name)}</h1>
          <div style="display:flex; align-items:center; gap:0.8rem; margin-bottom:1.2rem;">
            <span style="color:var(--gold); font-size:1.1rem;">★★★★★</span>
            <span class="muted" style="font-size:0.9rem;">${p.rating}/5 (${p.reviews} avis vérifiés)</span>
          </div>
          
          <div class="price" style="margin-bottom:1rem;">
            <strong>${fcfa(p.price)}</strong>
            ${p.was ? `<s>${fcfa(p.was)}</s> <span class="save-badge">Économisez ${fcfa(p.was - p.price)} (-${d}%)</span>` : ''}
          </div>
          
          <p style="font-size:1.05rem; line-height:1.6; margin-bottom:1.5rem;">${p.desc || p.short}</p>
          
          ${p.cat !== 'epicerie' ? `
            <div style="background:var(--bg-warm); padding:1rem 1.2rem; border-radius:var(--r); margin-bottom:1.5rem; border:1px solid var(--line-strong);">
              <label for="pdp-custom-msg" style="display:flex; align-items:center; gap:0.5rem; font-weight:700; font-size:0.92rem; margin-bottom:0.4rem; color:var(--sec);">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg> Votre mot sur la carte « Merci » manuscrite (Offerte)
              </label>
              <textarea id="pdp-custom-msg" rows="2" maxlength="160" placeholder="Ex: Merci Maman pour ta bienveillance et tes repas du dimanche..." style="width:100%; border:1.5px solid var(--line-strong); border-radius:8px; padding:0.6rem; font-size:0.92rem; background:var(--surface);"></textarea>
            </div>
          ` : ''}
          
          <div style="display:flex; align-items:center; gap:0.6rem; margin-bottom:1.5rem; font-size:0.88rem; font-weight:700; color:var(--acc);">
            <span>●</span> ${p.stock <= SITE_CONFIG.lowStock ? `Plus que ${p.stock} paniers restants pour le 26 novembre !` : 'En stock · Précommande ouverte pour livraison du 20 au 26 novembre'}
          </div>
          
          <div class="buy-row">
            <div class="qty-stepper">
              <button id="pdp-qty-minus">−</button>
              <output id="pdp-qty-val">1</output>
              <button id="pdp-qty-plus">+</button>
            </div>
            <button class="btn btn-acc" id="pdp-add-btn">
              ${SITE_CONFIG.ctaPdp} · <span id="pdp-calc-total">${fcfa(p.price)}</span>
            </button>
          </div>
          
          <a class="btn btn-wa btn-block" target="_blank" rel="noopener" href="https://wa.me/?text=${encodeURIComponent(`Bonjour ${SITE_CONFIG.brand}, je souhaite réserver : ${p.name} (${fcfa(p.price)}).`)}" style="margin-bottom:1.5rem;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2c-1.5 0-3-.4-4.3-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1-.7-.3-1.4-.7-2-1.3-.5-.5-1-1.1-1.3-1.7-.1-.2 0-.4.1-.5l.4-.5.3-.4v-.5l-.8-1.9c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.7.7-1 1.6-1 2.5.1 1.1.5 2.1 1.2 3 1.2 1.8 2.8 3.2 4.7 4 .5.2 1 .4 1.6.5.6.2 1.2.2 1.8.1.7-.1 1.4-.6 1.8-1.2.2-.4.2-.9.1-1.3l-.5-.2z"/></svg> Commander directement sur WhatsApp
          </a>
          
          <div style="display:grid; gap:0.8rem; border-top:1px solid var(--line); padding-top:1.5rem; font-size:0.92rem;">
            <div style="display:flex; gap:0.8rem; align-items:center;">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
              <div><b>Livraison garantie :</b> ${SITE_CONFIG.delivery}</div>
            </div>
            <div style="display:flex; gap:0.8rem; align-items:center;">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              <div><b>Fraîcheur & authenticité :</b> ${SITE_CONFIG.returns}</div>
            </div>
            <div style="display:flex; gap:0.8rem; align-items:center;">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
              <div><b>Paiement souple :</b> MTN MoMo, Moov Money, Wave, Orange Money ou à la livraison</div>
            </div>
          </div>
          
          ${p.details ? `
            <div style="margin-top:2rem; background:var(--surface); border:1px solid var(--line); border-radius:var(--r); padding:1.25rem;">
              <h3 style="font-size:1.15rem; margin-bottom:0.8rem; color:var(--sec);">Contenu détaillé du panier :</h3>
              <ul style="padding-left:1.2rem; margin:0; display:grid; gap:0.4rem; font-size:0.92rem;">
                ${p.details.map(item => `<li>${item}</li>`).join('')}
              </ul>
            </div>
          ` : ''}
        </div>
      </div>
      
      ${p.reviewsList && p.reviewsList.length ? `
        <section class="sec" style="padding-bottom:1rem;">
          <div class="sec-h"><h2>Avis de nos clients</h2></div>
          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(280px, 1fr)); gap:1.5rem;">
            ${p.reviewsList.map(r => `
              <div style="background:var(--surface); border:1px solid var(--line); border-radius:var(--r); padding:1.5rem;">
                <div style="color:var(--gold); margin-bottom:0.5rem;">★★★★★</div>
                <p style="font-style:italic; margin-bottom:0.8rem;">« ${r[1]} »</p>
                <b style="font-size:0.85rem; color:var(--muted);">${r[0]}</b>
              </div>
            `).join('')}
          </div>
        </section>
      ` : ''}
      
      ${crossProds.length ? `
        <section class="sec">
          <div class="sec-h"><h2>${SITE_CONFIG.crossTitle}</h2></div>
          <div class="grid">
            ${crossProds.map(cardMarkup).join('')}
          </div>
        </section>
      ` : ''}
    </div>
  `;
  
  // Handlers for PDP
  const updatePdpTotal = () => {
    const valEl = $('#pdp-qty-val');
    const totEl = $('#pdp-calc-total');
    if (valEl) valEl.textContent = pdpQty;
    if (totEl) totEl.textContent = fcfa(p.price * pdpQty);
  };
  
  $('#pdp-qty-minus')?.addEventListener('click', () => {
    if (pdpQty > 1) { pdpQty--; updatePdpTotal(); }
  });
  $('#pdp-qty-plus')?.addEventListener('click', () => {
    if (pdpQty < 99) { pdpQty++; updatePdpTotal(); }
  });
  
  $('#pdp-add-btn')?.addEventListener('click', () => {
    const msg = $('#pdp-custom-msg')?.value || '';
    addToCart(p.id, pdpQty, msg);
  });
  
  // Sticky bar on mobile
  const sticky = $('.sticky-buy');
  if (sticky) {
    sticky.innerHTML = `
      <div style="flex:1;">
        <div style="font-size:0.8rem; color:var(--muted);">${esc(p.name)}</div>
        <strong style="font-size:1.15rem; color:var(--sec);">${fcfa(p.price)}</strong>
      </div>
      <button class="btn btn-acc btn-sm" onclick="window.PanierApp.addToCart('${p.id}', 1)">${SITE_CONFIG.ctaSticky}</button>
    `;
  }
}

// Router
function route() {
  const hash = location.hash;
  if (hash && !hash.startsWith('#/')) {
    const target = document.getElementById(hash.slice(1));
    if (target && $('[data-view="home"]').hidden) {
      showView('home');
    }
    return;
  }
  
  const parts = (hash.slice(2) || '').split('/');
  const viewName = parts[0];
  const arg = parts[1];
  
  const currentView = viewName === 'boutique' ? 'shop' : viewName === 'produit' ? 'product' : 'home';
  showView(currentView);
  
  if (currentView === 'shop') {
    currentCat = arg || 'all';
    renderShop();
    document.title = `Nos Paniers – ${SITE_CONFIG.brand}`;
  } else if (currentView === 'product') {
    renderProduct(arg);
  } else {
    document.title = SITE_CONFIG.title;
  }
  
  $$('.nav a').forEach(a => {
    a.toggleAttribute('aria-current', a.getAttribute('href') === (hash || '#/'));
  });
  
  closeCart();
  window.scrollTo(0, 0);
  reveal();
}

function showView(name) {
  $$('[data-view]').forEach(el => {
    el.hidden = el.dataset.view !== name;
  });
  document.body.classList.toggle('on-pdp', name === 'product');
}

// Countdown Tick
function updateCountdown() {
  const cdEl = $('[data-cd]');
  const labelEl = $('[data-cd-label]');
  if (!cdEl || !labelEl) return;
  
  const n = NOW();
  const ev = SITE_CONFIG.event;
  const start = Date.parse(ev.start);
  const end = Date.parse(ev.end);
  
  let state = 'before';
  let target = start;
  if (n >= start && n <= end) {
    state = 'live';
    target = end;
  } else if (n > end) {
    state = 'after';
  }
  
  labelEl.textContent = ev.labels[state];
  
  if (state === 'after') {
    cdEl.innerHTML = `<b style="min-width:auto; padding:0.6rem 1.2rem;">${ev.labels.after}</b>`;
    return;
  }
  
  const diff = Math.max(0, target - n);
  const s = Math.floor(diff / 1000);
  const d = Math.floor(s / 86400);
  const h = Math.floor((s % 86400) / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  const pad = v => String(v).padStart(2, '0');
  
  cdEl.innerHTML = `
    <b>${d}<small>jours</small></b>
    <b>${pad(h)}<small>heures</small></b>
    <b>${pad(m)}<small>min</small></b>
    <b>${pad(sec)}<small>sec</small></b>
  `;
}

// Reveal on scroll
let observer;
function reveal() {
  if (!('IntersectionObserver' in window)) {
    $$('.rv').forEach(e => e.classList.add('in'));
    return;
  }
  observer = observer || new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        observer.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px -6% 0px' });
  
  $$('.rv:not(.in)').forEach(e => observer.observe(e));
}

// Global Event Listeners
document.addEventListener('click', e => {
  // Cart open / close
  if (e.target.closest('[data-open-cart]')) openCart();
  if (e.target.closest('[data-close-cart]') || e.target.classList.contains('overlay')) closeCart();
  
  // Cart item modifiers
  const qBtn = e.target.closest('[data-cart-q]');
  if (qBtn) {
    const idx = +qBtn.dataset.cartQ;
    const delta = +qBtn.dataset.delta;
    if (cart[idx]) {
      cart[idx].qty += delta;
      if (cart[idx].qty <= 0) cart.splice(idx, 1);
      saveCart();
      renderCart();
    }
  }
  
  const rmBtn = e.target.closest('[data-cart-rm]');
  if (rmBtn) {
    const idx = +rmBtn.dataset.cartRm;
    if (cart[idx]) {
      cart.splice(idx, 1);
      saveCart();
      renderCart();
    }
  }
  
  // Promo code in cart
  if (e.target.closest('#cart-promo-btn')) {
    const code = ($('#cart-promo-input')?.value || '').trim().toUpperCase();
    if (SITE_CONFIG.codes[code]) {
      promoCode = { code, pct: SITE_CONFIG.codes[code] };
      toast(`✓ Code ${code} appliqué : -${promoCode.pct}%`);
    } else {
      promoCode = null;
      toast('Code promo non reconnu ou expiré');
    }
    renderCart();
  }
  
  // Checkout modal
  if (e.target.closest('#cart-checkout-btn')) {
    const sub = subtotal();
    const discount = promoCode ? Math.round(sub * (promoCode.pct / 100)) : 0;
    const shipFee = (sub >= SITE_CONFIG.freeShip) ? 0 : SITE_CONFIG.shipFee;
    const total = sub - discount + shipFee;
    
    const lines = cart.map(l => `${l.qty} × ${P[l.id]?.name || l.id}${l.note ? ' (Mot: ' + l.note + ')' : ''}`).join('\n• ');
    
    const waText = encodeURIComponent(
      `Bonjour ${SITE_CONFIG.brand}, je souhaite commander pour la Semaine de la Gratitude 2026 :\n\n• ${lines}\n\nSous-total : ${fcfa(sub)}\nLivraison : ${shipFee ? fcfa(shipFee) : 'Offerte'}\nTotal : ${fcfa(total)}\n\nMerci de me confirmer la disponibilité et le créneau de livraison !`
    );
    
    showModal(`
      <span class="eyebrow">Dernière étape</span>
      <h2 style="font-size:1.6rem; color:var(--sec); margin-bottom:0.6rem;">Finalisez votre geste de gratitude</h2>
      <p style="font-size:0.95rem; margin-bottom:1.2rem;">
        Ce site est une <b>démonstration pour la Semaine de la Gratitude 2026 à Cotonou</b>. Aucun débit bancaire n'est requis ici.
      </p>
      
      <div style="background:var(--bg-warm); border-radius:8px; padding:1rem; margin-bottom:1.5rem; font-size:0.9rem;">
        <b>Récapitulatif de votre sélection :</b>
        <div style="margin-top:0.4rem; color:var(--muted); line-height:1.5;">
          • ${cart.map(l => `${l.qty} × ${P[l.id]?.name || l.id}`).join('<br>• ')}
        </div>
        <div style="margin-top:0.8rem; font-weight:800; color:var(--sec); font-size:1.1rem; border-top:1px dashed var(--line-strong); padding-top:0.5rem;">
          Total à régler : ${fcfa(total)}
        </div>
      </div>
      
      <a class="btn btn-wa btn-block" target="_blank" rel="noopener" href="https://wa.me/?text=${waText}" style="margin-bottom:0.8rem;">
        💬 Valider & Envoyer ma commande sur WhatsApp
      </a>
      <p style="font-size:0.82rem; text-align:center; color:var(--muted); margin:0;">
        Paiement sécurisé par Mobile Money (MTN / Moov / Wave) ou à la réception du panier.
      </p>
    `);
  }
  
  // Shop category filter clicks
  const catBtn = e.target.closest('[data-shop-cat]');
  if (catBtn) {
    currentCat = catBtn.dataset.shopCat;
    renderShop();
  }
});

// Shop sort dropdown
document.addEventListener('change', e => {
  if (e.target.id === 'shop-sort-select') {
    currentSort = e.target.value;
    renderShop();
  }
});

// Sticky PDP observer
window.addEventListener('scroll', () => {
  const buyBtn = $('#pdp-add-btn');
  const sticky = $('.sticky-buy');
  if (!buyBtn || !sticky || !document.body.classList.contains('on-pdp')) return;
  const rect = buyBtn.getBoundingClientRect();
  sticky.classList.toggle('show', rect.bottom < 0);
}, { passive: true });

// Expose PanierApp to global window for inline onclicks
window.PanierApp = {
  addToCart,
  openCart,
  closeCart,
  selectQuizOption: (qId, val) => {
    quizAnswers[qId] = val;
    quizStep++;
    renderQuizStep();
  },
  prevQuizStep: () => {
    if (quizStep > 0) {
      quizStep--;
      renderQuizStep();
    }
  },
  resetQuiz: () => {
    quizAnswers = { recipient: null, taste: null, budget: null };
    quizStep = 0;
    renderQuizStep();
  }
};

// Initial boot
window.addEventListener('DOMContentLoaded', () => {
  renderCart();
  updateCountdown();
  setInterval(updateCountdown, 1000);
  initQuiz();
  initTerroirs();
  initCardCanvas();
  initCalculator();
  route();
  window.addEventListener('hashchange', route);
});
