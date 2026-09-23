/**
 * ============================================================================
 * DOLVE - MOTOR DE INTERACTIVIDAD & ANIMACIONES (JavaScript)
 * ============================================================================
 * 
 * Este archivo es el "cerebro" de la página web.
 * Aquí aprenderás cómo JavaScript:
 *  1. Escucha eventos (scroll del usuario, clics en botones, texto en el buscador).
 *  2. Utiliza "IntersectionObserver" para detectar cuándo un elemento entra en pantalla
 *     y activar animaciones automáticas al scrollear.
 *  3. Manipula el DOM (Document Object Model) para insertar productos, abrir modales
 *     y calcular el carrito de compras en tiempo real.
 */

// ============================================================================
// 1. BASE DE DATOS LOCAL DE PRODUCTOS (Simulada para aprender)
// ============================================================================
// Catálogo de fábrica por defecto
const DEFAULT_PRODUCTS = [
  {
    id: 1,
    name: "Dolve Nova Pro Wireless",
    category: "audio",
    categoryLabel: "Audio Pro",
    price: 189.00,
    rating: "★★★★★",
    ratingScore: "4.9/5",
    badge: "FLAGSHIP",
    badgeClass: "flagship",
    image: "assets/hero-headset.jpg",
    description: "Auriculares inalámbricos de estudio con transductores de titanio de 50mm, cancelación activa de ruido adaptativa y sonido espacial Dolby Atmos.",
    specs: [
      { label: "Conectividad", value: "Dolve HyperSync 2.4GHz + Bluetooth 5.4" },
      { label: "Batería", value: "Hasta 50 horas continuas (Carga rápida USB-C)" },
      { label: "Latencia", value: "0.8 milisegundos en modo Gaming" },
      { label: "Micrófono", value: "Cápsula de condensador con IA de reducción de ruido" }
    ]
  },
  {
    id: 2,
    name: "Dolve Quantum Ghost Keyboard",
    category: "perifericos",
    categoryLabel: "Periféricos",
    price: 145.00,
    rating: "★★★★★",
    ratingScore: "5.0/5",
    badge: "HOT",
    badgeClass: "hot",
    image: "assets/keyboard-cyber.jpg",
    description: "Teclado mecánico custom con chasis acrílico traslúcido humo, switches lineales lubricados de fábrica y retroiluminación RGB por tecla con pantalla OLED.",
    specs: [
      { label: "Switches", value: "Dolve Glacier Linear (45g accionamiento)" },
      { label: "Estructura", value: "Gasket Mount con 5 capas de amortiguación" },
      { label: "Keycaps", value: "Policarbonato doble inyección perfil Cherry" },
      { label: "Compatibilidad", value: "Windows, macOS, Linux y Android" }
    ]
  },
  {
    id: 3,
    name: "Dolve CyberPods Transparent ANC",
    category: "audio",
    categoryLabel: "Audio Pro",
    price: 99.00,
    rating: "★★★★☆",
    ratingScore: "4.8/5",
    badge: "NUEVO",
    badgeClass: "",
    image: "assets/earbuds-transparent.jpg",
    description: "Audífonos True Wireless intrauditivos con diseño cibernético transparente, indicador LED de batería dinámico y resistencia al sudor IPX5.",
    specs: [
      { label: "Cancelación de Ruido", value: "Híbrida de hasta -42dB" },
      { label: "Autonomía", value: "8 hrs audífonos + 28 hrs estuche de carga" },
      { label: "Códecs", value: "LDAC Hi-Res Audio, AAC, SBC" },
      { label: "Modo Transparencia", value: "Sensibilidad ambiental ajustable" }
    ]
  },
  {
    id: 4,
    name: "Dolve DeskHUD Ambient Smart Display",
    category: "smart",
    categoryLabel: "Smart Gear",
    price: 220.00,
    rating: "★★★★★",
    ratingScore: "4.9/5",
    badge: "LIMITADA",
    badgeClass: "limitada",
    image: "assets/smart-display.jpg",
    description: "Pantalla OLED transparente de escritorio que sincroniza tus estadísticas del sistema (CPU/GPU/RAM), reloj holográfico, clima y espectro de audio en vivo.",
    specs: [
      { label: "Panel", value: "OLED Transparente 8.8 pulgadas 120Hz" },
      { label: "Base", value: "Aluminio aeroespacial con barra de sonido Hi-Fi" },
      { label: "Software", value: "Dolve Synapse App para monitoreo en vivo" },
      { label: "Alimentación", value: "USB-C Power Delivery 30W" }
    ]
  }
];

// Obtener productos desde localStorage (compartido con la consola de administración)
function getCatalogProducts() {
  const data = localStorage.getItem('dolve_catalog_products');
  if (data) {
    try {
      return JSON.parse(data);
    } catch (e) {
      console.error("Error al leer catálogo:", e);
    }
  }
  // Si aún no se ha guardado en localStorage, guardamos los valores iniciales
  localStorage.setItem('dolve_catalog_products', JSON.stringify(DEFAULT_PRODUCTS));
  return DEFAULT_PRODUCTS;
}

let DOLVE_PRODUCTS = getCatalogProducts();

// Base de datos de artículos del Blog
const DOLVE_ARTICLES = {
  1: {
    title: "El Setup Definitivo 2026: Ergonomía, pantallas curvas y estética futurista",
    category: "GUÍA DE SETUP",
    date: "Septiembre 2026",
    readTime: "5 min de lectura",
    image: "assets/blog-desk.jpg",
    content: `
      <p>Un espacio de trabajo contemporáneo no se trata únicamente de tener la computadora más potente; se trata de diseñar un entorno donde la concentración y la inspiración fluyan sin fricción.</p>
      
      <p class="article-modal-quote">"El orden físico y visual de tu escritorio es el reflejo directo de la claridad mental de tus proyectos."</p>

      <h4>1. La iluminación estratégica</h4>
      <p>La luz difusa indirecta reduce el contraste brusco entre los monitores brillantes y la habitación oscura. Utilizar tiras LED RGB sincronizadas con tonos fríos y violetas ayuda a mantener el foco durante largas sesiones de desarrollo y diseño.</p>

      <h4>2. Cero cables a la vista</h4>
      <p>La gestión de cables por debajo del escritorio mediante bandejas y brazos articulados libera espacio para el movimiento del mouse y reduce el estrés visual.</p>

      <h4>3. Ergonomía acústica</h4>
      <p>Colocar monitores de sonido a la altura de los oídos y contar con auriculares confortables con diadema acolchada de titanio como los Dolve Nova Pro previene la fatiga cervical tras horas de creación continua.</p>
    `
  },
  2: {
    title: "Detrás del Audio Cuántico: ¿Cómo procesamos sonido espacial en tiempo real?",
    category: "INGENIERÍA ACÚSTICA",
    date: "Septiembre 2026",
    readTime: "7 min de lectura",
    image: "assets/blog-audio.jpg",
    content: `
      <p>¿Alguna vez te has preguntado cómo el cerebro humano logra determinar con milimétrica precisión si un sonido proviene de atrás, de arriba o de la esquina derecha de una habitación?</p>

      <p>En el laboratorio de sonido de Dolve, pasamos más de 18 meses perfeccionando el transductor acústico de los Dolve Nova Pro para simular las funciones de transferencia relativas a la cabeza (HRTF).</p>

      <p class="article-modal-quote">"El sonido espacial no es solo eco o estéreo ampliado; es geometría pura calculada en milisegundos por chips de procesamiento neuronal."</p>

      <h4>Algoritmos de baja latencia</h4>
      <p>A diferencia de los protocolos Bluetooth convencionales que introducen retrasos de 150 a 200 milisegundos, nuestro protocolo Dolve HyperSync transmite audio de 24 bits a 96 kHz en solo 0.8 milisegundos, garantizando que lo que ves en pantalla ocurra en el instante exacto en que lo escuchas.</p>
    `
  }
};

// ============================================================================
// 2. ESTADO DE LA APLICACIÓN (CARRITO)
// ============================================================================
let cartState = [];

// Intentar recuperar carrito previo de localStorage si el usuario ya nos visitó
try {
  const savedCart = localStorage.getItem('dolve_cart');
  if (savedCart) {
    cartState = JSON.parse(savedCart);
  }
} catch (e) {
  console.log("No se pudo leer localStorage:", e);
}

// ============================================================================
// 3. FUNCIONES DE RENDERIZADO DINÁMICO
// ============================================================================

/**
 * Dibuja los productos en la cuadrícula según la categoría y búsqueda actual
 */
function renderProducts(filterCategory = 'todos', searchQuery = '') {
  const container = document.getElementById('products-grid');
  const noResultsMsg = document.getElementById('no-results');
  
  if (!container) return;

  // Filtrar productos
  const filtered = DOLVE_PRODUCTS.filter(product => {
    const matchesCategory = filterCategory === 'todos' || product.category === filterCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          product.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (filtered.length === 0) {
    container.innerHTML = '';
    if (noResultsMsg) noResultsMsg.style.display = 'block';
    return;
  }

  if (noResultsMsg) noResultsMsg.style.display = 'none';

  // Generar HTML de cada tarjeta de producto
  container.innerHTML = filtered.map(product => `
    <div class="product-card reveal active" data-product-id="${product.id}">
      <div class="product-image-container">
        <span class="product-badge ${product.badgeClass}">${product.badge}</span>
        <img src="${product.image}" alt="${product.name}" loading="lazy">
        <button class="product-quickview-btn" onclick="openQuickView(${product.id})">
          👁️ Vista Rápida
        </button>
      </div>

      <div class="product-info">
        <span class="product-category">${product.categoryLabel}</span>
        <h3 class="product-title">${product.name}</h3>
        <div class="product-rating">
          ${product.rating} <span>(${product.ratingScore})</span>
        </div>

        <div class="product-bottom-row">
          <span class="product-price">$${product.price.toFixed(2)} USD</span>
          <button class="add-cart-icon-btn" onclick="addToCart(${product.id})" title="Añadir al pedido">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </button>
        </div>
      </div>
    </div>
  `).join('');
}

// ============================================================================
// 4. ANIMACIONES AL SCROLLEAR (LO QUE QUERÍAS APRENDER: SCROLL DINÁMICO)
// ============================================================================

/**
 * A) BARRA DE PROGRESO DE LECTURA (Top Scroll Indicator)
 * Calcula el porcentaje de la página que el usuario ha recorrido
 */
function handleScrollProgress() {
  const scrollBar = document.getElementById('scroll-progress');
  if (!scrollBar) return;

  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

  scrollBar.style.width = `${scrollPercent}%`;
}

/**
 * B) SCROLL REVEAL CON INTERSECTION OBSERVER
 * Esta es la tecnología moderna que "ve" cuando un elemento entra en el campo de visión
 */
function initScrollObserver() {
  const revealElements = document.querySelectorAll('.reveal');

  // Si el navegador soporta IntersectionObserver (casi todos hoy en día)
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, observerInstance) => {
      entries.forEach(entry => {
        // Cuando el elemento es visible al menos un 10%
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          // Una vez animado, dejamos de observarlo para ahorrar rendimiento
          observerInstance.unobserve(entry.target);
        }
      });
    }, {
      root: null, // viewport entero
      threshold: 0.12, // se dispara al mostrarse el 12%
      rootMargin: "0px 0px -40px 0px" // margen inferior para anticipar
    });

    revealElements.forEach(el => observer.observe(el));
  } else {
    // Fallback si es un navegador antiguo: mostrar todos
    revealElements.forEach(el => el.classList.add('active'));
  }
}

/**
 * C) CONTADORES NUMÉRICOS ANIMADOS AL LLEGAR A LA SECCIÓN
 * Los números empiezan en 0 y suben fluidamente
 */
function initAnimatedCounters() {
  const counters = document.querySelectorAll('.stat-number');
  if (!counters.length) return;

  const counterObserver = new IntersectionObserver((entries, observerInstance) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const counter = entry.target;
        const target = parseFloat(counter.getAttribute('data-target'));
        const duration = 1500; // 1.5 segundos de animación
        const startTime = performance.now();

        function updateNumber(currentTime) {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          
          // Efecto de desaceleración suave (easeOutQuad)
          const easeProgress = 1 - (1 - progress) * (1 - progress);
          const currentVal = Math.floor(easeProgress * target);

          counter.textContent = currentVal;

          if (progress < 1) {
            requestAnimationFrame(updateNumber);
          } else {
            counter.textContent = target;
          }
        }

        requestAnimationFrame(updateNumber);
        observerInstance.unobserve(counter);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => counterObserver.observe(counter));
}

// ============================================================================
// 5. GESTIÓN DEL CARRITO DE COMPRAS Y PEDIDOS
// ============================================================================

/**
 * Añadir producto al carrito
 */
function addToCart(productId, qty = 1) {
  const product = DOLVE_PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  const existing = cartState.find(item => item.id === productId);
  if (existing) {
    existing.qty += qty;
  } else {
    cartState.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      qty: qty
    });
  }

  saveCart();
  updateCartUI();
  showToast(`¡Añadido al pedido: ${product.name}!`);
}

/**
 * Modificar cantidad de un producto en el carrito (+ o -)
 */
function changeCartItemQty(productId, delta) {
  const itemIndex = cartState.findIndex(item => item.id === productId);
  if (itemIndex === -1) return;

  cartState[itemIndex].qty += delta;

  if (cartState[itemIndex].qty <= 0) {
    cartState.splice(itemIndex, 1);
  }

  saveCart();
  updateCartUI();
}

/**
 * Guardar estado en localStorage
 */
function saveCart() {
  try {
    localStorage.setItem('dolve_cart', JSON.stringify(cartState));
  } catch (e) {
    console.error("Error guardando carrito:", e);
  }
}

/**
 * Actualizar interfaz gráfica del carrito
 */
function updateCartUI() {
  const countBadge = document.getElementById('cart-count');
  const drawerCount = document.getElementById('cart-drawer-count');
  const itemsContainer = document.getElementById('cart-items-container');
  const subtotalEl = document.getElementById('cart-subtotal');
  const totalEl = document.getElementById('cart-total-final');

  const totalItems = cartState.reduce((sum, item) => sum + item.qty, 0);
  const totalPrice = cartState.reduce((sum, item) => sum + (item.price * item.qty), 0);

  if (countBadge) countBadge.textContent = totalItems;
  if (drawerCount) drawerCount.textContent = totalItems;
  if (subtotalEl) subtotalEl.textContent = `$${totalPrice.toFixed(2)} USD`;
  if (totalEl) totalEl.textContent = `$${totalPrice.toFixed(2)} USD`;

  if (itemsContainer) {
    if (cartState.length === 0) {
      itemsContainer.innerHTML = `
        <div class="empty-cart-msg">
          <p>Tu carrito de DOLVE está vacío.</p>
          <small>Explora el catálogo y añade tus dispositivos favoritos.</small>
        </div>
      `;
    } else {
      itemsContainer.innerHTML = cartState.map(item => `
        <div class="cart-item">
          <img src="${item.image}" alt="${item.name}">
          <div class="cart-item-info">
            <h4>${item.name}</h4>
            <div class="cart-item-price">$${(item.price * item.qty).toFixed(2)} USD</div>
            <div class="cart-qty-controls">
              <button class="qty-btn" onclick="changeCartItemQty(${item.id}, -1)">-</button>
              <span>${item.qty}</span>
              <button class="qty-btn" onclick="changeCartItemQty(${item.id}, 1)">+</button>
            </div>
          </div>
          <button class="cart-item-remove" onclick="changeCartItemQty(${item.id}, -999)" title="Eliminar">&times;</button>
        </div>
      `).join('');
    }
  }
}

/**
 * Abre y cierra el carrito deslizante
 */
function toggleCartDrawer(open = true) {
  const backdrop = document.getElementById('cart-drawer-backdrop');
  if (!backdrop) return;

  if (open) {
    backdrop.classList.add('open');
  } else {
    backdrop.classList.remove('open');
  }
}

/**
 * Formatea y envía el pedido a WhatsApp con los datos del carrito
 */
function checkoutViaWhatsApp() {
  if (cartState.length === 0) {
    showToast("Tu carrito está vacío. Añade algún producto primero.");
    return;
  }

  let text = `¡Hola DOLVE! 👋 Quiero solicitar el siguiente pedido:%0A%0A`;
  let total = 0;

  cartState.forEach((item, idx) => {
    const sub = item.price * item.qty;
    total += sub;
    text += `${idx + 1}. *${item.name}* x${item.qty} - $${sub.toFixed(2)} USD%0A`;
  });

  text += `%0A*Total estimado:* $${total.toFixed(2)} USD%0A*Envío:* Express Gratis%0A%0A¿Tienen disponibilidad para coordinar la entrega?`;

  const whatsappUrl = `https://wa.me/?text=${text}`;
  window.open(whatsappUrl, '_blank');
}

// ============================================================================
// 6. MODALES: VISTA RÁPIDA DE PRODUCTO & LECTOR DE ARTÍCULOS
// ============================================================================

/**
 * Abre el modal de Vista Rápida de producto
 */
function openQuickView(productId) {
  const product = DOLVE_PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  const modal = document.getElementById('quickview-modal');
  const imgEl = document.getElementById('modal-img');
  const badgeEl = document.getElementById('modal-badge');
  const titleEl = document.getElementById('modal-title');
  const ratingEl = document.getElementById('modal-rating');
  const priceEl = document.getElementById('modal-price');
  const descEl = document.getElementById('modal-description');
  const specsEl = document.getElementById('modal-specs');
  const addCartBtn = document.getElementById('modal-add-cart-btn');
  const waBtn = document.getElementById('modal-whatsapp-btn');

  if (imgEl) imgEl.src = product.image;
  if (badgeEl) badgeEl.textContent = product.badge;
  if (titleEl) titleEl.textContent = product.name;
  if (ratingEl) ratingEl.textContent = `${product.rating} (${product.ratingScore})`;
  if (priceEl) priceEl.textContent = `$${product.price.toFixed(2)} USD`;
  if (descEl) descEl.textContent = product.description;

  if (specsEl) {
    specsEl.innerHTML = product.specs.map(spec => `
      <div class="spec-item">
        <span class="spec-key">${spec.label}:</span>
        <span class="spec-val">${spec.value}</span>
      </div>
    `).join('');
  }

  if (addCartBtn) {
    addCartBtn.onclick = () => {
      addToCart(product.id);
      closeAllModals();
    };
  }

  if (waBtn) {
    const waText = encodeURIComponent(`Hola DOLVE, me interesa el producto "${product.name}" ($${product.price} USD). ¿Tienen stock?`);
    waBtn.href = `https://wa.me/?text=${waText}`;
  }

  if (modal) modal.classList.add('open');
}

/**
 * Abre el lector del Blog
 */
function openArticleModal(articleId) {
  const article = DOLVE_ARTICLES[articleId];
  if (!article) return;

  const modal = document.getElementById('article-modal');
  const contentEl = document.getElementById('article-modal-content');

  if (contentEl) {
    contentEl.innerHTML = `
      <div class="article-modal-header">
        <span class="blog-category-tag">${article.category}</span>
        <h2>${article.title}</h2>
        <div class="blog-meta">
          <span>🗓️ ${article.date}</span>
          <span>⏱️ ${article.readTime}</span>
        </div>
      </div>
      <img src="${article.image}" alt="${article.title}" class="article-modal-img">
      <div class="article-modal-text">
        ${article.content}
      </div>
    `;
  }

  if (modal) modal.classList.add('open');
}

/**
 * Cierra todos los modales abiertos
 */
function closeAllModals() {
  document.querySelectorAll('.modal-backdrop').forEach(modal => {
    modal.classList.remove('open');
  });
}

// ============================================================================
// 7. TOAST NOTIFICATION (MENSAJES FLOTANTES)
// ============================================================================
let toastTimeout;
function showToast(message) {
  const toast = document.getElementById('toast-notification');
  const msgEl = document.getElementById('toast-message');
  if (!toast || !msgEl) return;

  msgEl.textContent = message;
  toast.classList.add('show');

  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 3200);
}

// ============================================================================
// 8. INICIALIZACIÓN Y EVENT LISTENERS (CUANDO CARGA LA PÁGINA)
// ============================================================================
document.addEventListener('DOMContentLoaded', () => {
  // 1. Renderizar productos iniciales
  renderProducts();

  // 2. Cargar estado del carrito
  updateCartUI();

  // 3. Iniciar observadores de scroll (animaciones dinámicas)
  initScrollObserver();
  initAnimatedCounters();

  // 4. Escuchar el desplazamiento (scroll) para la barra de lectura
  window.addEventListener('scroll', handleScrollProgress, { passive: true });

  // 5. Filtros por categoría
  const filterButtons = document.querySelectorAll('.filter-btn');
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.getAttribute('data-category');
      const searchVal = document.getElementById('catalog-search-input')?.value || '';
      renderProducts(cat, searchVal);
    });
  });

  // 6. Buscador en tiempo real del catálogo
  const catalogSearch = document.getElementById('catalog-search-input');
  if (catalogSearch) {
    catalogSearch.addEventListener('input', (e) => {
      const activeCatBtn = document.querySelector('.filter-btn.active');
      const activeCat = activeCatBtn ? activeCatBtn.getAttribute('data-category') : 'todos';
      renderProducts(activeCat, e.target.value);
    });
  }

  // 7. Botón de restablecer filtros cuando no hay resultados
  const resetBtn = document.getElementById('reset-filter-btn');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (catalogSearch) catalogSearch.value = '';
      filterButtons.forEach(b => b.classList.remove('active'));
      const allBtn = document.querySelector('.filter-btn[data-category="todos"]');
      if (allBtn) allBtn.classList.add('active');
      renderProducts('todos', '');
    });
  }

  // 8. Buscador rápido de la cabecera (Navbar)
  const searchToggleBtn = document.getElementById('search-toggle-btn');
  const headerSearchBar = document.getElementById('header-search-bar');
  const closeSearchBtn = document.getElementById('close-search-btn');
  const quickSearchInput = document.getElementById('quick-search-input');

  if (searchToggleBtn && headerSearchBar) {
    searchToggleBtn.addEventListener('click', () => {
      headerSearchBar.classList.toggle('open');
      if (headerSearchBar.classList.contains('open')) {
        quickSearchInput?.focus();
      }
    });
  }

  if (closeSearchBtn && headerSearchBar) {
    closeSearchBtn.addEventListener('click', () => {
      headerSearchBar.classList.remove('open');
    });
  }

  if (quickSearchInput) {
    quickSearchInput.addEventListener('input', (e) => {
      // Scroll hasta el catálogo y filtrar
      const catalogSection = document.getElementById('catalogo');
      if (catalogSection) {
        catalogSection.scrollIntoView({ behavior: 'smooth' });
      }
      if (catalogSearch) catalogSearch.value = e.target.value;
      renderProducts('todos', e.target.value);
    });
  }

  // 9. Eventos de apertura / cierre del carrito
  const cartToggleBtn = document.getElementById('cart-toggle-btn');
  const closeCartBtn = document.getElementById('close-cart-btn');
  const cartBackdrop = document.getElementById('cart-drawer-backdrop');

  if (cartToggleBtn) {
    cartToggleBtn.addEventListener('click', () => toggleCartDrawer(true));
  }

  if (closeCartBtn) {
    closeCartBtn.addEventListener('click', () => toggleCartDrawer(false));
  }

  if (cartBackdrop) {
    cartBackdrop.addEventListener('click', (e) => {
      if (e.target === cartBackdrop) toggleCartDrawer(false);
    });
  }

  // 10. Botones de Checkout del carrito
  const waCheckoutBtn = document.getElementById('cart-whatsapp-checkout-btn');
  const simCheckoutBtn = document.getElementById('cart-simulated-checkout-btn');

  if (waCheckoutBtn) {
    waCheckoutBtn.addEventListener('click', checkoutViaWhatsApp);
  }

  if (simCheckoutBtn) {
    simCheckoutBtn.addEventListener('click', () => {
      if (cartState.length === 0) {
        showToast("Tu carrito está vacío.");
        return;
      }
      showToast("🎉 ¡Pedido demo simulado con éxito! Gracias por probar DOLVE.");
      cartState = [];
      saveCart();
      updateCartUI();
      setTimeout(() => toggleCartDrawer(false), 1200);
    });
  }

  // 11. Cierre de Modales con botón o clic fuera
  const closeQuickviewBtn = document.getElementById('close-quickview-btn');
  const closeArticleBtn = document.getElementById('close-article-btn');

  if (closeQuickviewBtn) closeQuickviewBtn.addEventListener('click', closeAllModals);
  if (closeArticleBtn) closeArticleBtn.addEventListener('click', closeAllModals);

  document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) closeAllModals();
    });
  });

  // Cerrar modales con tecla Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeAllModals();
      toggleCartDrawer(false);
      headerSearchBar?.classList.remove('open');
    }
  });

  // 12. Menú Móvil
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('navMenu');
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
    });
    // Cerrar al hacer clic en un link
    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => navMenu.classList.remove('open'));
    });
  }

  // 13. Formulario de Newsletter
  const newsletterForm = document.getElementById('newsletter-form');
  const newsletterFeedback = document.getElementById('newsletter-feedback');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('newsletter-email')?.value;
      if (newsletterFeedback) {
        newsletterFeedback.className = 'newsletter-feedback success';
        newsletterFeedback.textContent = `¡Excelente! Te has suscrito con éxito con: ${email}. Te avisaremos en el próximo drop.`;
        newsletterForm.reset();
      }
    });
  }

  // 14. Botón Volver Arriba
  const backToTopBtn = document.getElementById('back-to-top');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // 15. Atajo de teclado secreto para entrar al Panel de Administración (Ctrl + Alt + A)
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.altKey && (e.key === 'a' || e.key === 'A')) {
      e.preventDefault();
      showToast("🔐 Accediendo a la Consola de Administración DOLVE...");
      setTimeout(() => {
        window.location.href = 'admin.html';
      }, 700);
    }
  });

  // 16. Sincronizar catálogo en tiempo real si el admin lo cambia en otra pestaña
  window.addEventListener('storage', (e) => {
    if (e.key === 'dolve_catalog_products') {
      DOLVE_PRODUCTS = getCatalogProducts();
      renderProducts();
    }
  });
});
