'use strict';

/* =========================================================================
   1) VALORES, TIPOS Y OPERADORES
   ========================================================================= */
const NOMBRE_TIENDA = 'GoldenStep';        // string (const: valor que no cambia)
let carritoAbierto = false;                // boolean (let: valor que cambia)
const IGV = 0.18;                          // number
const ENVIO_GRATIS_DESDE = 250;            // envío gratis desde S/ 250
let ultimaBusqueda = '';                   // string vacío por defecto

// WhatsApp del negocio: código de país (51 = Perú) + número, sin "+" ni espacios.
const WHATSAPP_NUMERO = '51980222965';

// Logo de WhatsApp (SVG en línea, hereda el color del texto con currentColor)
const ICONO_WHATSAPP = `<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>`;

// Corazón de favoritos (contorno; se rellena cuando está activo)
const ICONO_CORAZON = `<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" aria-hidden="true"><path d="M12 20.5s-7.5-4.6-9.2-9.3C1.6 8 3.4 4.8 6.6 4.8c2 0 3.5 1.1 5.4 3.2 1.9-2.1 3.4-3.2 5.4-3.2 3.2 0 5 3.2 3.8 6.4-1.7 4.7-9.2 9.3-9.2 9.3Z"/></svg>`;

// Operadores aritméticos, de comparación y lógicos en uso real:
function calcularEnvio(subtotal) {
  // operador de comparación (>=) + operador ternario (condicional)
  return subtotal >= ENVIO_GRATIS_DESDE ? 0 : 12.9;
}

// typeof (operador) para validar tipos antes de operar
function esNumeroValido(valor) {
  return typeof valor === 'number' && !Number.isNaN(valor) && valor > 0;
}

/* =========================================================================
   4) DATOS: PRODUCTOS (array de objetos)
   ========================================================================= */
// "imagen" es la ruta al archivo real (carpeta imaganes/). Si el archivo no
// existe o no carga, el <img> se reemplaza solo por el emoji de respaldo.
// "etiquetas" son palabras clave que el buscador también revisa.
const productos = [
  { id: '1', nombre: 'Adidas campus',     categoria: 'deportivo', precio: 199.9, stock: 10, emoji: '👟', imagen: 'imaganes/3.jpeg',   etiquetas: ['correr', 'running', 'gimnasio', 'entrenar'] },
  { id: '2', nombre: 'Adidas campus',  categoria: 'casual',    precio: 189.9, stock: 6,  emoji: '👞', imagen: 'imaganes/4.jpeg',   etiquetas: ['oficina', 'elegante', 'dia a dia'] },
  { id: '3', nombre: 'AIRMAX',    categoria: 'casual',      precio: 269.9, stock: 4,  emoji: '🥾', imagen: 'imaganes/5.jpeg',   etiquetas: ['montaña', 'trekking', 'lluvia', 'outdoor'] },
  { id: '4', nombre: 'Adidas campus',    categoria: 'casual',    precio: 169.9, stock: 9,  emoji: '👞', imagen: 'imaganes/6.jpeg',   etiquetas: ['universidad', 'uso casual', 'paseo'] },
  { id: '5', nombre: 'Adidas Hello kitty',    categoria: 'deportivo', precio: 179.9, stock: 10,  emoji: '👟', imagen: 'imaganes/7.jpeg',   etiquetas: ['futbol', 'correr', 'entrenar'] },
  { id: '6', nombre: 'AIRMAX',  categoria: 'casual',      precio: 299.0, stock: 3,  emoji: '🥾', imagen: 'imaganes/9.jpeg',   etiquetas: ['frio', 'montaña', 'outdoor'] },
  { id: '7', nombre: 'Adidas campus',   categoria: 'casual',    precio: 219.9, stock: 7,  emoji: '👞', imagen: 'imaganes/12.jpeg',  etiquetas: ['formal', 'fiesta', 'elegante'] },
  { id: '8', nombre: 'Adidas campus',    categoria: 'deportivo', precio: 209.9, stock: 8,  emoji: '👟', imagen: 'imaganes/444.jpeg', etiquetas: ['futbol', 'gimnasio', 'running'] },
];

/* =========================================================================
   6) PROTOTIPOS Y CLASES  /  7) POLIMORFISMO
   ========================================================================= */
class Zapato {
  constructor({ id, nombre, categoria, precio, stock, emoji, imagen, etiquetas = [] }) {
    this.id = id;
    this.nombre = nombre;
    this.categoria = categoria;
    this.precio = precio;
    this.stock = stock;
    this.emoji = emoji;
    this.imagen = imagen; // ruta a la foto real (opcional)
    this.etiquetas = etiquetas; // palabras clave para el buscador
  }

  // Genera el HTML de la miniatura: <img> si hay foto; si la foto no carga,
  // el propio evento "error" de la imagen la reemplaza por el emoji.
  renderMiniatura(claseImg, claseFallback) {
    if (!this.imagen) return `<div class="${claseFallback}">${this.emoji}</div>`;
    return `<img src="${this.imagen}" alt="${this.nombre}" class="${claseImg}" loading="lazy"
      onerror="this.replaceWith(Object.assign(document.createElement('div'),{className:'${claseFallback}',textContent:'${this.emoji}'}))">`;
  }

  // Getter: se comporta como una propiedad, pero es un método (encapsulamiento)
  get precioFormateado() {
    return `S/ ${this.precio.toFixed(2)}`;
  }

  hayStock() {
    return this.stock > 0;
  }

  // Enlace (URL completa) de la foto del zapato, para que se pueda ver en WhatsApp.
  // Solo existe cuando la página está publicada (http/https), no al abrir el archivo suelto.
  urlFoto() {
    if (this.imagen && window.location.protocol.startsWith('http')) {
      return new URL(this.imagen, window.location.href).href;
    }
    return '';
  }

  // Enlace de WhatsApp con el mensaje de consulta de precio.
  enlaceConsulta() {
    let mensaje = `Hola, quiero consultar el precio de este calzado: ${this.nombre}. ¿Me podría brindar más información, por favor?`;
    const foto = this.urlFoto();
    if (foto) mensaje += `\n${foto}`;
    return `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(mensaje)}`;
  }

  // Método "genérico": las subclases lo sobrescriben (polimorfismo)
  obtenerEtiqueta() {
    return 'Calzado';
  }
}

class ZapatoDeportivo extends Zapato {
  obtenerEtiqueta() { return '⚡casual'; }
}

class ZapatoCasual extends Zapato {
  obtenerEtiqueta() { return '✨ Casual'; }
}

class ZapatoBota extends Zapato {
  obtenerEtiqueta() { return '🥾 Outdoor'; }
}

// Fábrica: decide qué subclase instanciar según la categoría (más POO)
function crearZapato(datos) {
  switch (datos.categoria) {                       // 2) estructura de control: switch
    case 'deportivo': return new ZapatoDeportivo(datos);
    case 'casual':    return new ZapatoCasual(datos);
    case 'bota':       return new ZapatoBota(datos);
    default:           return new Zapato(datos);
  }
}

const catalogo = productos.map(crearZapato); // array de instancias polimórficas

// Demostración de la cadena de prototipos (revisar en consola del navegador)
console.log(
  'Prototipo de catalogo[0]:',
  Object.getPrototypeOf(catalogo[0]) === ZapatoDeportivo.prototype
);
catalogo.forEach(z => console.log(z.nombre, '->', z.obtenerEtiqueta())); // polimorfismo en acción

/* =========================================================================
   5) ENCAPSULAMIENTO Y MÉTODOS  /  7) MAPAS
   ========================================================================= */
class Carrito {
  #items = new Map(); // Map privado: id del zapato -> cantidad

  agregar(zapato, cantidad = 1, talla = '') {
    if (!esNumeroValido(cantidad)) return false;      // 1) validación con typeof
    if (!zapato.hayStock()) return false;

    const clave = `${zapato.id}|${talla}`;           // mismo modelo en otra talla = otra fila
    const actual = this.#items.get(clave) ?? 0;
    this.#items.set(clave, actual + cantidad);
    return true;
  }

  quitar(idProducto) {
    this.#items.delete(idProducto);
  }

  actualizarCantidad(idProducto, cantidad) {
    if (cantidad <= 0) {                              // 2) estructura de control: if
      this.quitar(idProducto);
    } else {
      this.#items.set(idProducto, cantidad);
    }
  }

  vaciar() {
    this.#items.clear();
  }

  estaVacio() {
    return this.#items.size === 0;
  }

  // Devuelve [{zapato, cantidad}] combinando el Map con el catálogo
  listar() {
    const filas = [];
    for (const [clave, cantidad] of this.#items) {     // 2) estructura de control: for...of
      const [id, talla] = clave.split('|');
      const zapato = catalogo.find(z => z.id === id);
      if (zapato) filas.push({ zapato, cantidad, talla, clave });
    }
    return filas;
  }

  cantidadTotal() {
    let total = 0;
    for (const cantidad of this.#items.values()) {     // 2) estructura de control: for...of
      total += cantidad;
    }
    return total;
  }

  subtotal() {
    // reduce + arrow function (function programming style)
    return this.listar().reduce((acc, fila) => acc + fila.zapato.precio * fila.cantidad, 0);
  }
}

const carrito = new Carrito();

/* =========================================================================
   3) FUNCIONES: normal, flecha, con "arguments", recursiva y "creciente"
   ========================================================================= */

// --- Función normal con estructura de control (if / else if / else) ---
function calcularDescuento(subtotal) {
  if (subtotal >= 600) {
    return subtotal * 0.15;
  } else if (subtotal >= 300) {
    return subtotal * 0.10;
  } else if (subtotal >= 150) {
    return subtotal * 0.05;
  } else {
    return 0;
  }
}

// --- Función de flecha ---
const formatearMoneda = (valor) => `S/ ${valor.toFixed(2)}`;

// --- Función que usa el objeto "arguments" (no es de flecha a propósito) ---
function sumarVarios() {
  let total = 0;
  for (let i = 0; i < arguments.length; i++) {   // arguments: objeto tipo-arreglo
    total += arguments[i];
  }
  return total;
}

// --- Función RECURSIVA: suma el total de una lista de filas del carrito ---
function calcularTotalRecursivo(filas, indice = 0) {
  if (indice >= filas.length) return 0;           // caso base
  const fila = filas[indice];
  const importe = fila.zapato.precio * fila.cantidad;
  return importe + calcularTotalRecursivo(filas, indice + 1); // llamada recursiva
}

// --- Función "creciente" (closure que va acumulando estado) ---
function crearContador(inicio = 0) {
  let valor = inicio;
  return function siguiente(paso = 1) {
    valor += paso;
    return valor;
  };
}
const contadorClicsAgregar = crearContador(0);

// --- Función que "crece" por composición (currying) ---
function crearDescuentoPorTemporada(porcentaje) {
  return (precio) => precio - precio * (porcentaje / 100);
}
const descuentoNavidad = crearDescuentoPorTemporada(20); // ejemplo de uso disponible en consola

/* =========================================================================
   RENDER: pintar el catálogo y el carrito en el DOM
   ========================================================================= */
const gridProductos   = document.getElementById('grid-productos');
const resultadoInfo    = document.getElementById('resultado-info');
const itemsCarritoEl   = document.getElementById('items-carrito');
const contadorCarrito  = document.getElementById('contador-carrito');

let categoriaActiva = 'todos';

// Favoritos (corazón de la tarjeta): guarda los ids marcados
const favoritos = new Set();

// Quita tildes y mayúsculas: "Fútbol" -> "futbol"
const normalizar = (texto) =>
  texto.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

function obtenerProductosFiltrados() {
  const busqueda = normalizar(ultimaBusqueda.trim());

  return catalogo.filter(z => {
    const coincideCategoria = categoriaActiva === 'todos'
      || (categoriaActiva === 'ultimas' ? z.stock <= 4 : z.categoria === categoriaActiva);
    const terminos = [z.nombre, z.categoria, ...z.etiquetas].map(normalizar);
    const coincideBusqueda = terminos.some(t => t.includes(busqueda) || busqueda.includes(t));
    return coincideCategoria && coincideBusqueda; // 1) operador lógico &&
  });
}

function renderCatalogo() {
  const lista = obtenerProductosFiltrados();
  gridProductos.innerHTML = '';

  lista.forEach(z => {
    const esFav = favoritos.has(z.id);
    const categoriaTexto = z.categoria.charAt(0).toUpperCase() + z.categoria.slice(1);

    const tarjeta = document.createElement('article');
    tarjeta.className = 'tarjeta';
    tarjeta.dataset.id = z.id;
    tarjeta.innerHTML = `
      <div class="tarjeta__media">
        ${z.renderMiniatura('tarjeta__imagen', 'tarjeta__emoji')}
        <button class="tarjeta__fav ${esFav ? 'tarjeta__fav--activo' : ''}" data-accion="favorito" data-id="${z.id}" aria-label="Agregar a favoritos">
          ${ICONO_CORAZON}
        </button>
      </div>
      <div class="tarjeta__cuerpo">
        <p class="tarjeta__precio">${z.precioFormateado}</p>
        <p class="tarjeta__nombre">${z.nombre}</p>
        <p class="tarjeta__categoria">${categoriaTexto} Originals</p>
        <p class="tarjeta__envio">${z.hayStock() ? 'Envío Gratis · Nuevo' : 'Agotado'}</p>
      </div>
    `;
    gridProductos.appendChild(tarjeta);
  });

  resultadoInfo.textContent = `${lista.length} de ${catalogo.length} productos`;
}

function renderCarrito() {
  const filas = carrito.listar();
  contadorCarrito.textContent = carrito.cantidadTotal();

  if (filas.length === 0) {
    itemsCarritoEl.innerHTML = '<p class="vacio">Tu carrito está vacío.</p>';
  } else {
    itemsCarritoEl.innerHTML = filas.map(({ zapato, cantidad, talla, clave }) => `
      <div class="item-carrito" data-id="${clave}">
        ${zapato.renderMiniatura('item-carrito__imagen', 'item-carrito__emoji')}
        <div class="item-carrito__info">
          <p class="item-carrito__nombre">${zapato.nombre}</p>
          ${talla ? `<p class="item-carrito__talla">Talla ${talla}</p>` : ''}
          <p>${zapato.precioFormateado}</p>
          <div class="item-carrito__controles">
            <button data-accion="restar" data-id="${clave}">−</button>
            <span>${cantidad}</span>
            <button data-accion="sumar" data-id="${clave}">+</button>
          </div>
        </div>
        <button class="item-carrito__quitar" data-accion="quitar" data-id="${clave}">Quitar</button>
      </div>
    `).join('');
  }

  const subtotal   = carrito.subtotal();
  // Verificación cruzada: el total recursivo debe coincidir con reduce()
  const totalRec   = calcularTotalRecursivo(carrito.listar());
  console.assert(Math.abs(subtotal - totalRec) < 0.01, 'El total recursivo no coincide con el subtotal');

  // Sin descuento y con envío gratis: el total es el precio exacto de los productos
  const total = subtotal;

  document.getElementById('res-subtotal').textContent = formatearMoneda(subtotal);
  document.getElementById('res-envio').textContent = 'Gratis';
  document.getElementById('res-total').textContent = formatearMoneda(total);
}

/* =========================================================================
   NOTIFICACIONES (toast) — usa setTimeout (temporizador)
   ========================================================================= */
function mostrarToast(mensaje, tipo = 'info') {
  const contenedor = document.getElementById('toast-contenedor');
  const toast = document.createElement('div');
  toast.className = `toast ${tipo === 'error' ? 'toast--error' : ''}`;
  toast.textContent = mensaje;
  contenedor.appendChild(toast);

  setTimeout(() => toast.remove(), 2600); // temporizador: desaparece solo
}

/* =========================================================================
   8) EVENTOS DEL DOM
   ========================================================================= */

// --- Evento "load": se dispara cuando toda la página terminó de cargar ---
window.addEventListener('load', () => {
  document.getElementById('loader').classList.add('loader--oculto');
  mostrarToast(`Bienvenido a ${NOMBRE_TIENDA} 👋`);
  renderCatalogo();
  renderCarrito();
});

// --- Evento de scroll: encoge el header y muestra/oculta "volver arriba" ---
const header = document.getElementById('header');
const btnArriba = document.getElementById('btn-arriba');
window.addEventListener('scroll', () => {
  const desplazado = window.scrollY > 40;
  header.classList.toggle('header--con-scroll', desplazado);
  btnArriba.hidden = window.scrollY < 400;
});
btnArriba.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// --- Eventos de teclado en el buscador (keyup / keydown) ---
const buscador = document.getElementById('buscador');
buscador.addEventListener('keyup', (evento) => {
  ultimaBusqueda = evento.target.value;
  renderCatalogo();
});
buscador.addEventListener('keydown', (evento) => {
  if (evento.key === 'Escape') {            // tecla especial: limpiar
    buscador.value = '';
    ultimaBusqueda = '';
    renderCatalogo();
  }
  if (evento.key === 'Enter') {
    mostrarToast(`Buscando "${evento.target.value}"...`);
  }
});

// --- Clic en la lupa: busca lo escrito y devuelve el foco al campo ---
document.getElementById('btn-buscar').addEventListener('click', () => {
  ultimaBusqueda = buscador.value;
  renderCatalogo();
  buscador.focus();
  if (buscador.value.trim() !== '') {
    document.getElementById('catalogo').scrollIntoView({ behavior: 'smooth' });
  }
});

// --- Eventos de foco / desenfoque ---
buscador.addEventListener('focus', () => buscador.classList.add('buscador--enfocado'));
buscador.addEventListener('blur',  () => buscador.classList.remove('buscador--enfocado'));

// --- Menú móvil (hamburguesa) y buscador desplegable ---
const nav = document.getElementById('nav');
const btnMenu = document.getElementById('btn-menu');
function cerrarMenu() {
  nav.classList.remove('nav--abierto');
  btnMenu.setAttribute('aria-expanded', 'false');
}
btnMenu.addEventListener('click', () => {
  const abierto = nav.classList.toggle('nav--abierto');
  btnMenu.setAttribute('aria-expanded', String(abierto));
});
const buscadorPanel = document.getElementById('buscador-panel');
document.getElementById('btn-lupa').addEventListener('click', () => {
  buscadorPanel.hidden = !buscadorPanel.hidden;
  if (!buscadorPanel.hidden) buscador.focus();
});

// --- Filtro por categoría: menú y tarjetas de categoría ---
function filtrarCategoria(categoria) {
  categoriaActiva = categoria;
  document.querySelectorAll('.nav__link[data-categoria]').forEach(b =>
    b.classList.toggle('nav__link--activo', b.dataset.categoria === categoria));
  renderCatalogo();
}
document.querySelectorAll('[data-categoria]').forEach(el => {
  el.addEventListener('click', () => { filtrarCategoria(el.dataset.categoria); cerrarMenu(); });
});
document.querySelectorAll('.nav__link:not([data-categoria])').forEach(el => el.addEventListener('click', cerrarMenu));

/* =========================================================================
   9) PROPAGACIÓN DE EVENTOS (burbujeo y captura)
   ========================================================================= */
gridProductos.addEventListener('click', (evento) => {
  console.log('1) FASE DE CAPTURA en el grid'); // se ejecuta primero
}, true); // true = capturar

gridProductos.addEventListener('click', (evento) => {
  // Corazón: marca/desmarca favorito sin abrir el modal
  const botonFav = evento.target.closest('[data-accion="favorito"]');
  if (botonFav) {
    evento.stopPropagation();
    const idFav = botonFav.dataset.id;
    if (favoritos.has(idFav)) favoritos.delete(idFav);
    else favoritos.add(idFav);
    botonFav.classList.toggle('tarjeta__fav--activo');
    return;
  }

  // "Consultar": abre WhatsApp y evita que el clic también abra el modal
  const consultar = evento.target.closest('[data-accion="consultar"]');
  if (consultar) {
    evento.stopPropagation();
    const zapatoConsulta = catalogo.find(z => z.id === consultar.dataset.id);
    window.open(zapatoConsulta.enlaceConsulta(), '_blank', 'noopener');
    return;
  }

  const boton = evento.target.closest('[data-accion="agregar"]');
  if (boton) {
    evento.stopPropagation(); // evita que el clic también "abra" la tarjeta
    const id = boton.dataset.id;
    const zapato = catalogo.find(z => z.id === id);
    const agregado = carrito.agregar(zapato, 1);

    contadorClicsAgregar(); // función "creciente": suma un clic más
    if (agregado) {
      mostrarToast(`${zapato.nombre} agregado al carrito`);
      renderCarrito();
      renderCatalogo();
    } else {
      mostrarToast('No se pudo agregar el producto', 'error');
    }
    return;
  }

  // Si el clic no fue en ningún botón, entonces sí abrimos el detalle
  const tarjeta = evento.target.closest('.tarjeta');
  if (tarjeta) {
    abrirModal(tarjeta.dataset.id);
  }
});

/* --- Delegación de eventos dentro del carrito (sumar/restar/quitar) --- */
itemsCarritoEl.addEventListener('click', (evento) => {
  const boton = evento.target.closest('button[data-accion]');
  if (!boton) return;
  const id = boton.dataset.id;
  const accion = boton.dataset.accion;
  const fila = carrito.listar().find(f => f.clave === id);
  if (!fila) return;

  switch (accion) {                                      // 2) estructura de control: switch
    case 'sumar':
      carrito.actualizarCantidad(id, fila.cantidad + 1);
      break;
    case 'restar':
      carrito.actualizarCantidad(id, fila.cantidad - 1);
      break;
    case 'quitar':
      carrito.quitar(id);
      break;
  }
  renderCarrito();
});

document.getElementById('btn-vaciar').addEventListener('click', () => {
  carrito.vaciar();
  renderCarrito();
  mostrarToast('Carrito vaciado');
});

/* --- Abrir / cerrar carrito lateral --- */
const panelCarrito = document.getElementById('panel-carrito');
const overlay = document.getElementById('overlay');

function alternarCarrito(abrir) {
  carritoAbierto = abrir;
  panelCarrito.classList.toggle('panel-carrito--abierto', abrir);
  overlay.hidden = !abrir;
}
document.getElementById('btn-carrito').addEventListener('click', () => alternarCarrito(true));
document.getElementById('cerrar-carrito').addEventListener('click', () => alternarCarrito(false));
overlay.addEventListener('click', () => alternarCarrito(false));

/* --- Modal de detalle (ficha de producto) --- */
const modal = document.getElementById('modal');
// Tallas de Perú
const TALLAS = ['36', '37', '38', '39', '40', '41', '42', '43', '44', '45'];
const TALLAS_AGOTADAS = []; // ejemplo: ['36', '37'] -> salen tachadas y no se pueden elegir
const ICONO_BOLSA = `<svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 8h14l-1 12H6L5 8Z"/><path d="M9 8a3 3 0 0 1 6 0"/><path d="M12 12v5M9.500 14.500h5"/></svg>`;
let tallaSeleccionada = null;
let zapatoModal = null;

function abrirModal(id) {
  const z = catalogo.find(p => p.id === id);
  if (!z) return;
  zapatoModal = z;
  tallaSeleccionada = null;
  const categoriaTexto = z.categoria.charAt(0).toUpperCase() + z.categoria.slice(1);
  const esFav = favoritos.has(z.id);

  document.getElementById('modal-cuerpo').innerHTML = `
    <div class="detalle">
      <div class="detalle__galeria">
        ${z.renderMiniatura('detalle__imagen', 'detalle__emoji')}
      </div>
      <div class="detalle__info">
        <p class="detalle__origen">${categoriaTexto} • Originals</p>
        <div class="detalle__tags">
          <span class="detalle__tag">Envío Gratis</span>
          <span class="detalle__tag">Nuevo</span>
        </div>
        <h3 class="detalle__titulo">${z.nombre}</h3>
        <p class="detalle__descripcion">Zapatillas clásicas con un diseño y unas proporciones renovados para un look moderno.</p>
        <p class="detalle__precio">${z.precioFormateado}</p>
        <p class="detalle__promo">No aplica ningún código promocional en este artículo</p>

        <p class="detalle__subtitulo">Colores</p>
        <div class="detalle__color">${z.renderMiniatura('detalle__color-img', 'detalle__color-emoji')}</div>
        <p class="detalle__color-nombre">${z.nombre}</p>

        <div class="detalle__subtitulo detalle__subtitulo--fila">
          <span>Tallas</span>
          <span class="detalle__guia">Guía de tallas</span>
        </div>
        <div class="detalle__tallas">
          ${TALLAS.map(t => `<button class="detalle__talla" data-talla="${t}" ${TALLAS_AGOTADAS.includes(t) ? 'disabled' : ''}>${t}</button>`).join('')}
        </div>

        <p class="detalle__aviso"><strong>Talla real.</strong> Te recomendamos pedir tu talla habitual.</p>

        <div class="detalle__acciones">
          <button class="detalle__agregar" data-accion="agregar" data-id="${z.id}" ${z.hayStock() ? '' : 'disabled'}>
            <span>${z.hayStock() ? 'Pedir ahora' : 'Producto agotado'}</span>
            ${ICONO_BOLSA}
          </button>
          <button class="detalle__fav ${esFav ? 'detalle__fav--activo' : ''}" data-accion="favorito-modal" aria-label="Agregar a favoritos">
            ${ICONO_CORAZON}
          </button>
        </div>
        <p class="detalle__stock">Stock disponible en todas las tallas</p>
      </div>
    </div>
  `;
  modal.hidden = false;
}

document.getElementById('cerrar-modal').addEventListener('click', () => (modal.hidden = true));
modal.addEventListener('click', (evento) => {          // clic fuera de la ficha: cierra
  if (evento.target === modal) modal.hidden = true;
});

document.getElementById('modal-cuerpo').addEventListener('click', (evento) => {
  // Elegir talla
  const botonTalla = evento.target.closest('.detalle__talla');
  if (botonTalla && !botonTalla.disabled) {
    document.querySelectorAll('.detalle__talla').forEach(b => b.classList.remove('detalle__talla--activa'));
    botonTalla.classList.add('detalle__talla--activa');
    tallaSeleccionada = botonTalla.dataset.talla;
    return;
  }

  // Corazón de la ficha
  const botonFav = evento.target.closest('[data-accion="favorito-modal"]');
  if (botonFav) {
    if (favoritos.has(zapatoModal.id)) favoritos.delete(zapatoModal.id);
    else favoritos.add(zapatoModal.id);
    botonFav.classList.toggle('detalle__fav--activo');
    renderCatalogo();
    return;
  }

  // Añadir al carrito (exige elegir talla)
  const boton = evento.target.closest('[data-accion="agregar"]');
  if (!boton) return;
  if (!tallaSeleccionada) {
    mostrarToast('Elige tu talla antes de añadir al carrito', 'error');
    return;
  }
  if (carrito.agregar(zapatoModal, 1, tallaSeleccionada)) {
    contadorClicsAgregar(); // función "creciente": suma un clic más
    renderCarrito();
    renderCatalogo();
    modal.hidden = true;
    abrirPedido();          // abre directo el formulario para completar el pedido
  }
});

/* =========================================================================
   PEDIDOS: formulario + base de datos (Supabase)
   -------------------------------------------------------------------------
   La clave "publishable" es PÚBLICA a propósito: la seguridad real la dan las
   reglas (RLS) de la base de datos, que solo permiten CREAR pedidos.
   NUNCA pegues aquí la clave "secret" ni "service_role".
   ========================================================================= */
const SUPABASE_URL = 'https://awqsounbjbalagyzrggj.supabase.co';
const SUPABASE_CLAVE = 'sb_publishable_6U1o0iK4yhWiAQEV7Kte9Q_WkiM1Skz';
const db = (window.supabase && window.supabase.createClient)
  ? window.supabase.createClient(SUPABASE_URL, SUPABASE_CLAVE)
  : null;

const modalPedido      = document.getElementById('modal-pedido');
const formPedido       = document.getElementById('form-pedido');
const resumenPedidoEl  = document.getElementById('pedido-resumen');
const pedidoFormulario = document.getElementById('pedido-formulario');
const pedidoExito      = document.getElementById('pedido-exito');
const btnEnviarPedido  = document.getElementById('btn-enviar-pedido');

// UUID para identificar el pedido (con respaldo si el navegador no tiene randomUUID)
function generarId() {
  if (window.crypto && typeof window.crypto.randomUUID === 'function') return window.crypto.randomUUID();
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
}

function abrirPedido() {
  if (carrito.estaVacio()) {
    mostrarToast('Tu carrito está vacío', 'error');
    return;
  }
  alternarCarrito(false);

  const filas = carrito.listar();
  resumenPedidoEl.innerHTML = filas.map(({ zapato, cantidad, talla }) => `
    <div class="pedido__fila">
      <span>${cantidad} × ${zapato.nombre}${talla ? ` · talla ${talla}` : ''}</span>
      <span>${formatearMoneda(zapato.precio * cantidad)}</span>
    </div>
  `).join('') + `
    <div class="pedido__fila"><span>Envío</span><span>Gratis</span></div>
    <div class="pedido__fila pedido__fila--total"><span>Total</span><span>${formatearMoneda(carrito.subtotal())}</span></div>
  `;

  pedidoFormulario.hidden = false;
  pedidoExito.hidden = true;
  modalPedido.hidden = false;
}

function mostrarPedidoExitoso(id, filas, datos, total) {
  const codigo = id.slice(0, 8).toUpperCase();
  const lineas = filas.map(f => {
    const foto = f.zapato.urlFoto();
    return `- ${f.cantidad} x ${f.zapato.nombre} (talla ${f.talla}) - ${formatearMoneda(f.zapato.precio * f.cantidad)}` + (foto ? `\n  ${foto}` : '');
  }).join('\n');
  const mensaje =
`Hola, quiero consultar el precio y que me brinden más información, por favor.
Pedido N° ${codigo}

Nombre: ${datos.nombre}
Teléfono: ${datos.telefono}
Dirección: ${datos.direccion}

Productos:
${lineas}

Total: ${formatearMoneda(total)}`;

  document.getElementById('pedido-codigo').textContent = codigo;
  document.getElementById('pedido-whatsapp').href = `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(mensaje)}`;
  pedidoFormulario.hidden = true;
  pedidoExito.hidden = false;
}

document.getElementById('btn-finalizar').addEventListener('click', abrirPedido);
document.getElementById('cerrar-pedido').addEventListener('click', () => (modalPedido.hidden = true));
document.getElementById('pedido-seguir').addEventListener('click', () => (modalPedido.hidden = true));
document.getElementById('pedido-volver').addEventListener('click', () => (modalPedido.hidden = true));
modalPedido.addEventListener('click', (evento) => {
  if (evento.target === modalPedido) modalPedido.hidden = true;
});

formPedido.addEventListener('submit', async (evento) => {
  evento.preventDefault();

  if (!db) {
    mostrarToast('No se pudo conectar con la base de datos', 'error');
    return;
  }
  const filas = carrito.listar();
  if (filas.length === 0) {
    mostrarToast('Tu carrito está vacío', 'error');
    return;
  }

  const form = new FormData(formPedido);
  const datos = {
    nombre:    String(form.get('nombre')).trim(),
    telefono:  String(form.get('telefono')).trim(),
    direccion: String(form.get('direccion')).trim(),
    nota:      String(form.get('nota')).trim(),
  };
  const id = generarId();
  const total = Number(carrito.subtotal().toFixed(2));

  btnEnviarPedido.disabled = true;
  btnEnviarPedido.textContent = 'Enviando...';

  try {
    const { error } = await db.from('pedidos').insert({
      id,
      nombre: datos.nombre,
      telefono: datos.telefono,
      direccion: datos.direccion,
      nota: datos.nota || null,
      total,
    });
    if (error) throw error;

    const { error: errorItems } = await db.from('pedido_items').insert(
      filas.map(f => ({
        pedido_id: id,
        producto_id: f.zapato.id,
        nombre: f.zapato.nombre,
        talla: f.talla || 'sin talla',
        cantidad: f.cantidad,
        precio: f.zapato.precio,
      }))
    );
    if (errorItems) throw errorItems;

    mostrarPedidoExitoso(id, filas, datos, total);
    carrito.vaciar();
    renderCarrito();
    formPedido.reset();
  } catch (err) {
    console.error('Error al guardar el pedido:', err);
    mostrarToast('No se pudo enviar el pedido. Inténtalo de nuevo.', 'error');
  } finally {
    btnEnviarPedido.disabled = false;
    btnEnviarPedido.textContent = 'Confirmar pedido';
  }
});

/* =========================================================================
   PIE DE PÁGINA: WhatsApp, redes y boletín
   ========================================================================= */
// Pega aquí los enlaces de tus redes. Si dejas uno vacío, ese botón no aparece.
const REDES = { Instagram: '', Facebook: '', TikTok: '' };

document.getElementById('enlace-whatsapp').innerHTML = ICONO_WHATSAPP;
document.querySelectorAll('.enlace-wa').forEach(a => {
  a.href = `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(a.dataset.mensaje)}`;
});
document.getElementById('redes').innerHTML =
  `<a href="https://wa.me/${WHATSAPP_NUMERO}" target="_blank" rel="noopener">WhatsApp</a>` +
  Object.entries(REDES).filter(([, url]) => url)
    .map(([nombre, url]) => `<a href="${url}" target="_blank" rel="noopener">${nombre}</a>`).join('');

document.getElementById('form-newsletter').addEventListener('submit', async (evento) => {
  evento.preventDefault();
  const formulario = evento.target;
  const correo = formulario.elements.correo.value.trim();
  if (!db) { mostrarToast('No se pudo conectar. Inténtalo más tarde.', 'error'); return; }
  const { error } = await db.from('suscriptores').insert({ correo });
  if (!error) {
    mostrarToast('¡Gracias por suscribirte!');
    formulario.reset();
  } else if (error.code === '23505') {
    mostrarToast('Ese correo ya está suscrito');
  } else {
    console.error('Error al suscribir:', error);
    mostrarToast('No se pudo suscribir. Inténtalo de nuevo.', 'error');
  }
});

/* =========================================================================
   TEMPORIZADOR: mensajes rotativos del hero (setInterval)
   ========================================================================= */
const mensajesHero = ['Colección nueva cada temporada', 'Envío gratis en todos tus pedidos', 'Hecho para moverte rápido'];
let indiceMensaje = 0;
setInterval(() => {
  indiceMensaje = (indiceMensaje + 1) % mensajesHero.length; // 2) operador módulo
  document.getElementById('hero-mensaje').textContent = mensajesHero[indiceMensaje];
}, 4000);

/* =========================================================================
   TEMPORIZADOR: carrusel de GIFs del hero (setInterval + setTimeout)
   ========================================================================= */
const imgHero = document.querySelector('.hero__fondo img');
if (imgHero) {
  const GIFS_HERO = [
    'imaganes/portada.jpg',
    // Agrega aquí más fotos o GIFs y la portada rotará sola entre ellos
  ];
  let indiceGif = 0;
  imgHero.src = GIFS_HERO[0];                                // arranca con el primero

  if (GIFS_HERO.length > 1) {
    GIFS_HERO.forEach(ruta => { new Image().src = ruta; }); // precarga para que no parpadee

    setInterval(() => {
      imgHero.classList.add('hero-gif--oculto');             // 1) se desvanece
      setTimeout(() => {                                     // 2) a los 0,5 s cambia el GIF
        indiceGif = (indiceGif + 1) % GIFS_HERO.length;      //    operador módulo: vuelve al primero
        imgHero.onload = imgHero.onerror = () => imgHero.classList.remove('hero-gif--oculto'); // 3) reaparece
        imgHero.src = GIFS_HERO[indiceGif];
      }, 500);
    }, 6000);                                                // cada 6 segundos
  }
}

/* =========================================================================
   Demostraciones adicionales en consola (para la sustentación oral)
   ========================================================================= */
console.log('Suma con "arguments":', sumarVarios(10, 20, 30));       // 30 -> 60
console.log('Descuento de temporada sobre S/200:', descuentoNavidad(200).toFixed(2));