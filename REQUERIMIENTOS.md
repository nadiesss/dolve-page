# DOCUMENTO DE REQUERIMIENTOS & BANCO DE IDEAS: PROYECTO DOLVE

Este documento sirve como la **única fuente de verdad** para la planificación, diseño y desarrollo del software antes de escribir una sola línea de código. 

Se divide en dos partes fundamentales:
1. **Parte 1: Banco de Ideas & Brainstorming** (Espacio abierto para la visión, experimentos e inspiración).
2. **Parte 2: Requerimientos Formales del Proyecto** (Límites, especificaciones funcionales y arquitectura técnica).

---

# ==============================================================================
# PARTE 1: BANCO DE IDEAS & VISIÓN CREATIVA
# ==============================================================================

## 1.1. Visión General de la Marca y Propósito
* **Nombre del Proyecto:** DOLVE
* **Giro / Propósito:** 
  <!-- Escribiremos aquí la misión: ¿Qué vende DOLVE? ¿Qué vibra transmite? -->
* **Público Objetivo:**
  <!-- ¿A quién va dirigida la web? (Gamers, creadores de contenido, profesionales de audio, etc.) -->

## 1.2. Inspiraciones y Referencias
* **Estilo Visual:** Tipo ASUS ROG / Cyberpunk / Tech vanguardista (colores vibrantes, contrastes oscuros, micro-animaciones).
* **Sensación al interactuar:** 
  <!-- ¿Qué debe sentir el usuario al entrar por primera vez? -->

## 1.3. Ideas "Fuera de lo Convencional" para Debatir
* [ ] **Efectos de sonido cibernéticos:** Sonidos sutiles con Web Audio API al presionar botones o abrir el carrito.
* [ ] **Personalizador de producto en tiempo real:** Cambiar colores de luces o accesorios directamente en la pantalla.
* [ ] **Cursor interactivo:** Estela de luz o distorsión magnética al pasar sobre elementos clave.
* [ ] **Visualizador de especificaciones holográfico / 3D.**
<!-- Iremos agregando aquí todas las ideas que se nos ocurran en la conversación -->

## 1.4. Preguntas Abiertas & Dilemas de Diseño
* *Dilema 1:* ¿Queremos que la página funcione como una Single Page Application (todo en una sola página con scroll suave) o páginas separadas?
* *Dilema 2:* ¿Cómo será el flujo de compra principal? (¿Directo a WhatsApp? ¿Pasarela simulada? ¿Formulario de cotización?).
<!-- Añadiremos preguntas a debatir aquí -->

---

# ==============================================================================
# PARTE 2: REQUERIMIENTOS FORMALES DEL PROYECTO
# ==============================================================================

## 2.1. Alcance y Límites del Sistema (Scope Management)

### ✅ Lo que SÍ incluirá la Versión 1 (MVP - Enfoque Principal):
* **R1.1:** Portada principal (Hero Section) con alto impacto visual y mensaje de marca claro.
* **R1.2:** Catálogo de productos interactivo con filtrado por categorías y buscador en tiempo real.
* **R1.3:** Modal de Vista Rápida (*Quick View*) con especificaciones técnicas detalladas.
* **R1.4:** Carrito de pedidos con cálculo automático de totales y botón para enviar pedido a WhatsApp.
* **R1.5:** Sección de Blog / Magazine (*Dolve Pulse*) con artículos de tecnología y lector integrado.
* **R1.6:** Panel de Administración privado (*Backoffice*) para gestionar el catálogo sin tocar código HTML.

### ❌ Lo que NO incluirá la Versión 1 (Fuera de límites por ahora):
* Pasarela de pagos bancarios reales con tarjeta (Stripe/PayPal) — *Se deja para v2*.
* Sistema de login/contraseña para clientes compradores — *Se deja para v2*.
* Base de datos en servidor físico remoto pagado — *Iniciaremos con almacenamiento local/cloud gratuito*.

---

## 2.2. Requerimientos Funcionales (RF)
*(Lo que el sistema DEBE hacer exactamente)*

* **RF-01 (Navegación):** El sistema debe permitir al usuario navegar de forma fluida entre el inicio, catálogo, blog y soporte.
* **RF-02 (Catálogo Dinámico):** El catálogo no debe estar codificado en duro en el HTML; debe renderizarse a partir de un modelo de datos.
* **RF-03 (Búsqueda y Filtros):** El usuario debe poder filtrar productos por categoría y por texto instantáneamente sin recargar la página.
* **RF-04 (Gestión de Carrito):** El usuario debe poder añadir productos, incrementar/decrementar unidades, ver el total y vaciar el carrito.
* **RF-05 (Checkout WhatsApp):** El sistema debe generar un mensaje preformateado y abrir el enlace de WhatsApp con el detalle exacto del pedido.
* **RF-06 (Panel de Administración):** El administrador debe contar con una interfaz protegida/privada para crear, editar y eliminar productos.

---

## 2.3. Requerimientos No Funcionales (RNF)
*(Cómo debe comportarse y rendir el sistema)*

* **RNF-01 (Rendimiento):** La página debe cargar en menos de 1.5 segundos en conexiones estándar.
* **RNF-02 (Responsividad):** La interfaz debe adaptarse fluidamente a dispositivos móviles, tablets y monitores ultraanchos.
* **RNF-03 (Animaciones y Scroll):** Las animaciones de scroll (`IntersectionObserver`) deben ejecutarse a 60 FPS sin ralentizar el navegador.
* **RNF-04 (Código Limpio & Didáctico):** El código debe estar documentado con explicaciones claras para fines de aprendizaje.

---

## 2.4. Modelo de Entidades y Datos

### Entidad: Producto (`Product`)
```text
Product {
  id: Integer (Único)
  name: String (Nombre comercial)
  category: String (audio | perifericos | smart)
  categoryLabel: String (Etiqueta legible)
  price: Float (Precio en USD)
  ratingScore: String (ej: 4.9/5)
  badge: String (ej: HOT | NUEVO | LIMITADA)
  image: String (Ruta local o URL)
  description: String (Texto descriptivo)
  specs: Array<{ label: String, value: String }> (Especificaciones clave)
}
```

### Entidad: Artículo de Blog (`Article`)
```text
Article {
  id: Integer (Único)
  title: String (Titular de la noticia)
  category: String (Guía | Ingeniería | Reseña)
  date: String (Fecha de publicación)
  readTime: String (Tiempo estimado de lectura)
  image: String (Portada)
  contentHtml: String (Cuerpo completo del artículo)
}
```

---

## 2.5. Arquitectura Técnica y Estructura del Código
<!-- Definiremos aquí las carpetas, tecnologías y convenciones que adoptaremos -->
