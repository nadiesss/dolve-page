# DOCUMENTO DE REQUERIMIENTOS & ARQUITECTURA TÉCNICA: DOLVE

Este documento es la **fuente de verdad oficial** del proyecto. Define los estándares de ingeniería de software, arquitectura de infraestructura, base de datos y diseño modular antes del desarrollo.

---

# ==============================================================================
# PARTE 1: BANCO DE IDEAS, DEBATES & DECISIONES ESTRATÉGICAS
# ==============================================================================

## 1.1. Debate de Infraestructura: Cloud Hosting vs. Servidor Propio 24/7 (On-Premises)

| Criterio | Servidor Propio 24/7 (On-Premises en Casa/Oficina) | Cloud Hosting / VPS Moderno (Hetzner, DigitalOcean, Supabase) |
| :--- | :--- | :--- |
| **Costo inicial** | Alto (requiere hardware potente dedicado). | $0 (planes gratuitos o $4 - $10 USD/mes). |
| **Disponibilidad (Uptime)** | Riesgoso (cortes de luz, fallos de router, reinicios de ISP). Requiere UPS y generador. | 99.95% - 99.99% garantizado en centros de datos con generadores diésel y fibra redundante. |
| **Conectividad & Concurrencia** | Conexión de hogar asimétrica (baja velocidad de subida). Muchos ISPs bloquean puertos 80/443. | Ancho de banda de 1 Gbps a 10 Gbps simétrico con protección anti-DDoS. |
| **Seguridad de Red** | Peligro: Expones la IP pública de tu hogar u oficina a ataques y escaneos de vulnerabilidades. | Red aislada con Firewall en la nube y proxy inverso (Cloudflare). |
| **Costo Eléctrico** | Una PC potente consumiendo ~200W-400W 24/7 genera un costo visible en la factura eléctrica mensual. | Ya incluido en la tarifa del proveedor. |

> [!NOTE]
> **Decisión de Arquitectura Aprobada:**
> * **Entorno de Desarrollo (Local):** Tu máquina potente local para programar a máxima velocidad con contenedores Docker / PostgreSQL local.
> * **Entorno de Producción:** Servidor Cloud / VPS optimizado con proxy inverso. Si se desea usar la máquina local para servir hacia afuera temporalmente, se usará un **Túnel Criptográfico (Cloudflare Tunnel)** para no exponer la IP de tu hogar.

---

## 1.2. Decisión de Base de Datos: PostgreSQL ("El Elefante")
* **Estado:** **APROBADO (10/10).**
* **Justificación de Ingeniería:**
  * **Concurrencia de Alto Nivel:** PostgreSQL utiliza **MVCC (Multi-Version Concurrency Control)**, lo que significa que las lecturas nunca bloquean a las escrituras y las escrituras nunca bloquean a las lecturas. Es ideal para tiendas con alto tráfico simultáneo.
  * **Fiabilidad Absoluta (ACID):** Garantiza que un pedido o pago nunca quede "a medias" si el sistema sufre una interrupción.
  * **Híbrido Relacional + NoSQL (`JSONB`):** Permite tener tablas relacionales estrictas (precios, IDs, inventario) y a la vez campos `JSONB` ultra rápidos para especificaciones técnicas variables de cada gadget sin tener que rediseñar la base de datos cada vez que un producto nuevo tiene características distintas.

---

## 1.3. Estrategia de Dominio: Implementación Desacoplada
* El nombre de dominio final se comprará y vinculará al final del proyecto.
* **Requisito Técnico:** El código **NUNCA** tendrá URLs absolutas fijas (`http://localhost...` o `http://dolve.com`).
* **Implementación:** Todas las URLs, rutas de API y assets se gestionarán mediante variables de entorno (`APP_URL`, `API_URL`, `PORT`) y rutas relativas, permitiendo conectar el dominio definitivo en 2 minutos mediante DNS (registros A / CNAME y SSL automático vía Let's Encrypt / Cloudflare).

---

## 1.4. Regla Estricta: "Cero Hardcodeo" (Design Tokens & Variables)
* **Prohibido:** Colocar colores hex directos (`#00f0ff`), tamaños de fuente en píxeles fijos o fuentes en medio de los componentes CSS.
* **Obligatorio:** Toda la interfaz se construirá sobre un **Sistema de Tokens de Diseño**:
  * Paleta semántica (`--color-primary`, `--color-bg-base`, `--color-surface-hover`, etc.).
  * Escala tipográfica modular (`--font-size-xs` hasta `--font-size-4xl`).
  * Escala de espaciados (`--space-1` hasta `--space-12`).
  * Si se cambia un color o fuente en la raíz del tema, el 100% de la aplicación cambia automáticamente.

---

# ==============================================================================
# PARTE 2: REQUERIMIENTOS FORMALES Y ESTÁNDARES DE SOFTWARE
# ==============================================================================

## 2.1. Estándares de Calidad y Principios de Código
* **Modularidad:** Separación estricta de responsabilidades (SoC - Separation of Concerns).
  * Capa de Presentación (Frontend).
  * Capa de Lógica de Negocio / Controladores.
  * Capa de Acceso a Datos (Repositorios / Consultas a PostgreSQL).
* **Mantenibilidad:** Código auto-documentado, nomenclatura semántica en inglés o español estandarizado, funciones puras y reutilizables.
* **Seguridad (OWASP Top 10):**
  * Sanitización estricta de entradas para prevenir inyecciones SQL (uso obligatorio de consultas parametrizadas / ORM).
  * Encabezados de seguridad HTTP (Content Security Policy, X-Frame-Options).
  * CORS restringido para el API.
* **Manejo de Concurrencia:**
  * Uso de **Connection Pooling** (Pool de conexiones a PostgreSQL) para reutilizar conexiones y no colapsar la memoria del servidor con cientos de usuarios simultáneos.
  * Operaciones asíncronas no bloqueantes (Event Loop / Async I/O).

---

## 2.2. Alcance y Límites del Sistema (Scope Management)

### ✅ Alcance Versión 1 (MVP de Alto Estándar):
1. **Frontend Público (Tienda + Blog):**
   * Portada de alto impacto visual (estética ASUS ROG / Tech vanguardista).
   * Catálogo de productos interactivo alimentado dinámicamente desde PostgreSQL.
   * Filtros multi-categoría y búsqueda optimizada.
   * Modal de detalles técnicos y vista rápida.
   * Carrito de pedidos reactivo con checkout para WhatsApp.
   * Magazine / Blog de novedades con lectura completa.
2. **Backend & Persistencia:**
   * Servidor modular con API RESTful documentada.
   * Base de datos PostgreSQL con migraciones de esquema versionadas.
   * Pool de conexiones y transacciones seguras.
3. **Consola de Administración (Backoffice):**
   * Panel privado para gestión de inventario (CRUD de productos: Crear, Leer, Actualizar, Eliminar).
   * Visualización de métricas de catálogo en tiempo real.

### ❌ Fuera de Límites (Versión 2):
* Cobros automáticos con tarjetas de crédito internacionales (Stripe Webhooks).
* Cuentas con autenticación OAuth de Google/Discord para clientes finales.

---

## 2.3. Esquema Relacional de PostgreSQL (Modelo de Datos)

### Tabla: `products`
```sql
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    slug VARCHAR(180) UNIQUE NOT NULL,
    category VARCHAR(50) NOT NULL,
    price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
    rating NUMERIC(2, 1) DEFAULT 5.0,
    badge VARCHAR(30) DEFAULT 'NUEVO',
    image_url TEXT NOT NULL,
    description TEXT NOT NULL,
    specs JSONB DEFAULT '[]'::jsonb, -- Flexibilidad para specs técnicas
    stock_quantity INT DEFAULT 10 CHECK (stock_quantity >= 0),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_slug ON products(slug);
```

### Tabla: `articles` (Blog)
```sql
CREATE TABLE articles (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(280) UNIQUE NOT NULL,
    category VARCHAR(80) NOT NULL,
    read_time VARCHAR(30) NOT NULL,
    cover_image TEXT NOT NULL,
    excerpt TEXT NOT NULL,
    content_html TEXT NOT NULL,
    published_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

---

## 2.4. Tokens de Diseño Base (Cero Hardcodeo)
```css
:root {
  /* Paleta Base */
  --color-bg-base: #080a0f;
  --color-bg-surface: #0f141f;
  --color-bg-card: rgba(18, 24, 38, 0.75);
  --color-bg-card-hover: rgba(28, 36, 56, 0.9);

  /* Acentos Dinámicos */
  --color-accent-primary: #00f0ff;
  --color-accent-secondary: #9d4edd;
  --color-accent-hot: #ff007f;
  --color-accent-success: #00f59b;

  /* Escala Tipográfica Modular */
  --font-family-display: 'Outfit', sans-serif;
  --font-family-body: 'Plus Jakarta Sans', sans-serif;
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.125rem;
  --font-size-xl: 1.25rem;
  --font-size-2xl: 1.5rem;
  --font-size-3xl: 2rem;
  --font-size-4xl: 3rem;

  /* Espaciados */
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;
  --spacing-2xl: 48px;

  /* Bordes y Transiciones */
  --radius-sm: 6px;
  --radius-md: 12px;
  --radius-lg: 18px;
  --transition-fast: 0.15s ease;
  --transition-normal: 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
```
