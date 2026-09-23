/**
 * ============================================================================
 * DOLVE - MOTOR DEL PANEL DE ADMINISTRACIÓN (js/admin.js)
 * ============================================================================
 * 
 * Este archivo simula la lógica del "Backend / CMS":
 *  1. Administra los datos del catálogo en localStorage (la base de datos local).
 *  2. Procesa el formulario para inyectar nuevos productos.
 *  3. Calcula estadísticas del inventario en tiempo real.
 *  4. Permite eliminar o restaurar el inventario de fábrica.
 */

// Productos iniciales por defecto (catálogo base)
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

// Obtener productos desde localStorage o inicializar con los datos base
function getProducts() {
  const data = localStorage.getItem('dolve_catalog_products');
  if (data) {
    try {
      return JSON.parse(data);
    } catch (e) {
      console.error("Error al parsear catálogo:", e);
    }
  }
  // Si no hay datos guardados aún, guardamos los iniciales
  saveProducts(DEFAULT_PRODUCTS);
  return DEFAULT_PRODUCTS;
}

// Guardar lista en localStorage
function saveProducts(productsList) {
  localStorage.setItem('dolve_catalog_products', JSON.stringify(productsList));
}

// Actualizar las tarjetas de métricas en el panel
function updateStats(products) {
  const totalCountEl = document.getElementById('stat-total-products');
  const totalValueEl = document.getElementById('stat-inventory-value');
  const categoriesEl = document.getElementById('stat-active-categories');
  const avgPriceEl = document.getElementById('stat-avg-price');

  const total = products.length;
  const totalValue = products.reduce((acc, p) => acc + p.price, 0);
  const categories = new Set(products.map(p => p.category)).size;
  const avgPrice = total > 0 ? totalValue / total : 0;

  if (totalCountEl) totalCountEl.textContent = total;
  if (totalValueEl) totalValueEl.textContent = `$${totalValue.toFixed(2)}`;
  if (categoriesEl) categoriesEl.textContent = categories;
  if (avgPriceEl) avgPriceEl.textContent = `$${avgPrice.toFixed(2)}`;
}

// Renderizar la tabla de productos
function renderInventoryTable() {
  const tbody = document.getElementById('inventory-tbody');
  if (!tbody) return;

  const products = getProducts();
  updateStats(products);

  if (products.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="5" style="text-align: center; color: #94a3b8; padding: 30px;">
          No hay productos en el inventario. Publica uno con el formulario o presiona "Restaurar Catálogo Base".
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = products.map(product => {
    let badgeClass = '';
    if (product.badge === 'HOT') badgeClass = 'hot';
    else if (product.badge === 'LIMITADA') badgeClass = 'limitada';
    else if (product.badge === 'FLAGSHIP') badgeClass = 'flagship';

    return `
      <tr>
        <td>
          <div class="table-product-cell">
            <img src="${product.image}" alt="${product.name}" class="table-product-thumb">
            <div class="table-product-info">
              <strong>${product.name}</strong>
              <small>ID: #${product.id} • ${product.ratingScore || '4.9/5'}</small>
            </div>
          </div>
        </td>
        <td>
          <span style="color: var(--accent-cyan); text-transform: capitalize;">${product.categoryLabel || product.category}</span>
        </td>
        <td>
          <strong style="color: #fff;">$${product.price.toFixed(2)} USD</strong>
        </td>
        <td>
          <span class="badge-tag ${badgeClass}">${product.badge || 'ESTÁNDAR'}</span>
        </td>
        <td>
          <button class="delete-btn" onclick="deleteProduct(${product.id})">
            🗑️ Eliminar
          </button>
        </td>
      </tr>
    `;
  }).join('');
}

// Eliminar un producto
window.deleteProduct = function(productId) {
  let products = getProducts();
  const productToDelete = products.find(p => p.id === productId);

  if (!productToDelete) return;

  if (confirm(`¿Estás seguro de que deseas eliminar "${productToDelete.name}" del catálogo?`)) {
    products = products.filter(p => p.id !== productId);
    saveProducts(products);
    renderInventoryTable();
    showToast(`Producto "${productToDelete.name}" eliminado del catálogo.`);
  }
};

// Mostrar notificación Toast
let toastTimer;
function showToast(message) {
  const toast = document.getElementById('toast-notification');
  const msgEl = document.getElementById('toast-message');
  if (!toast || !msgEl) return;

  msgEl.textContent = message;
  toast.classList.add('show');

  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

// Inicialización de Eventos
document.addEventListener('DOMContentLoaded', () => {
  renderInventoryTable();

  // Selector de imagen preset vs personalizada
  const presetSelect = document.getElementById('prod-image-preset');
  const customImageInput = document.getElementById('prod-image-custom');

  presetSelect?.addEventListener('change', (e) => {
    if (e.target.value === 'custom') {
      customImageInput.style.display = 'block';
      customImageInput.required = true;
    } else {
      customImageInput.style.display = 'none';
      customImageInput.required = false;
    }
  });

  // Envío del formulario de nuevo producto
  const form = document.getElementById('new-product-form');
  form?.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('prod-name').value.trim();
    const category = document.getElementById('prod-category').value;
    const price = parseFloat(document.getElementById('prod-price').value);
    const badge = document.getElementById('prod-badge').value;
    const ratingScore = document.getElementById('prod-rating').value;
    const desc = document.getElementById('prod-desc').value.trim();

    // Obtener imagen
    let image = presetSelect.value;
    if (image === 'custom') {
      image = customImageInput.value.trim() || 'assets/hero-headset.jpg';
    }

    // Especificaciones
    const spec1Key = document.getElementById('spec-key-1').value.trim() || "Conectividad";
    const spec1Val = document.getElementById('spec-val-1').value.trim() || "Estándar";
    const spec2Key = document.getElementById('spec-key-2').value.trim() || "Garantía";
    const spec2Val = document.getElementById('spec-val-2').value.trim() || "2 Años Dolve Care";

    // Generar etiqueta de categoría bonita
    let categoryLabel = "General";
    if (category === "audio") categoryLabel = "Audio Pro";
    else if (category === "perifericos") categoryLabel = "Periféricos";
    else if (category === "smart") categoryLabel = "Smart Gear";

    // Crear el nuevo objeto producto
    const products = getProducts();
    const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;

    const newProduct = {
      id: newId,
      name: name,
      category: category,
      categoryLabel: categoryLabel,
      price: price,
      rating: "★★★★★",
      ratingScore: ratingScore,
      badge: badge,
      badgeClass: badge === 'HOT' ? 'hot' : (badge === 'LIMITADA' ? 'limitada' : (badge === 'FLAGSHIP' ? 'flagship' : '')),
      image: image,
      description: desc,
      specs: [
        { label: spec1Key, value: spec1Val },
        { label: spec2Key, value: spec2Val }
      ]
    };

    // Guardar en la "base de datos" local
    products.unshift(newProduct); // Añadir al inicio
    saveProducts(products);

    // Actualizar la interfaz
    renderInventoryTable();
    form.reset();
    presetSelect.value = "assets/hero-headset.jpg";
    customImageInput.style.display = "none";

    showToast(`🚀 ¡"${name}" se ha publicado con éxito en el catálogo de DOLVE!`);
  });

  // Botón para restablecer el catálogo base
  const resetBtn = document.getElementById('reset-inventory-btn');
  resetBtn?.addEventListener('click', () => {
    if (confirm("¿Deseas restablecer el catálogo a los 4 productos originales de fábrica?")) {
      saveProducts(DEFAULT_PRODUCTS);
      renderInventoryTable();
      showToast("Catálogo restablecido a valores de fábrica.");
    }
  });
});
