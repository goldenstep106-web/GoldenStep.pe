'use strict';
document.documentElement.classList.add('js');

/* =========================================================================
   1) VALORES, TIPOS Y OPERADORES
   ========================================================================= */
const NOMBRE_TIENDA = 'GoldenStep';        // string (const: valor que no cambia)
let carritoAbierto = false;                // boolean (let: valor que cambia)
const IGV = 0.18;                          // number
const ENVIO_GRATIS_DESDE = 250;            // se conserva para la demostración; hoy todos los envíos son gratis
let ultimaBusqueda = '';                   // string vacío por defecto
const CLAVE_CARRITO = 'goldenstep_carrito'; // nombre con el que el carrito se guarda en el navegador
const MAX_POR_PRODUCTO = 20;               // coincide con el límite de la base de datos

// WhatsApp del negocio: código de país (51 = Perú) + número, sin "+" ni espacios.
const WHATSAPP_NUMERO = '51968294133';

const ICONO_WHATSAPP = `<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>`;

const ICONO_CORAZON = `<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" aria-hidden="true"><path d="M12 20.5s-7.5-4.6-9.2-9.3C1.6 8 3.4 4.8 6.6 4.8c2 0 3.5 1.1 5.4 3.2 1.9-2.1 3.4-3.2 5.4-3.2 3.2 0 5 3.2 3.8 6.4-1.7 4.7-9.2 9.3-9.2 9.3Z"/></svg>`;

const ICONO_BOLSA = `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 8h14l-1 12H6L5 8Z"/><path d="M9 8a3 3 0 0 1 6 0"/></svg>`;

// Imagen de respaldo (se usa si una foto no carga): silueta simple, sin emojis
const IMAGEN_RESPALDO = 'data:image/svg+xml,' + encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"><rect width="400" height="300" fill="#eceff1"/>' +
  '<path d="M95 190c18-4 30-20 36-44l24 10c10 6 22 8 36 8 22 0 34 14 52 20 18 6 36 6 54 16v18H95z" fill="none" stroke="#9aa4a8" stroke-width="6" stroke-linejoin="round"/></svg>');

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
   -------------------------------------------------------------------------
   Aquí se agregan, quitan o editan los productos.
   - nombre:         nombre TEMPORAL. Reemplázalo por el nombre real del modelo.
   - precioAnterior: opcional. Ponlo solo si de verdad hubo un precio anterior
                     (se muestra tachado). Si no hay, déjalo en null.
   - etiqueta:       'Nuevo', 'Oferta' o '' (vacío = sin etiqueta).
                     Usa 'Oferta' solo junto con un precioAnterior real.
   - descripcion:    texto corto que aparece en la ficha del producto.
   - imagen:         ruta a la foto (carpeta imaganes/).
   - palabrasClave:  palabras que el buscador también revisa.
   ========================================================================= */
const productos = [
  { id: '1', nombre: 'Zapatilla deportiva GS-01', categoria: 'deportivo', precio: 120, precioAnterior: null, etiqueta: 'Nuevo', stock: 10, imagen: 'imaganes/3.jpeg',   descripcion: 'Zapatilla deportiva de estilo moderno, pensada para tu rutina y tu día a día.', palabrasClave: ['correr', 'running', 'gimnasio', 'entrenar'] },
  { id: '2', nombre: 'Zapatilla casual GS-02',    categoria: 'casual',    precio: 120, precioAnterior: null, etiqueta: 'Nuevo', stock: 6,  imagen: 'imaganes/4.jpeg',   descripcion: 'Zapatilla casual de estilo urbano para combinar con tu look diario.', palabrasClave: ['oficina', 'elegante', 'dia a dia'] },
  { id: '3', nombre: 'Zapatilla casual GS-03',    categoria: 'casual',    precio: 120, precioAnterior: null, etiqueta: 'Nuevo', stock: 4,  imagen: 'imaganes/5.jpeg',   descripcion: 'Zapatilla casual con diseño llamativo para destacar en cada paso.', palabrasClave: ['outdoor', 'paseo'] },
  { id: '4', nombre: 'Zapatilla casual GS-04',    categoria: 'casual',    precio: 120, precioAnterior: null, etiqueta: 'Nuevo', stock: 9,  imagen: 'imaganes/6.jpeg',   descripcion: 'Zapatilla casual cómoda para la universidad, el paseo o el día a día.', palabrasClave: ['universidad', 'uso casual', 'paseo'] },
  { id: '5', nombre: 'Zapatilla deportiva GS-05', categoria: 'deportivo', precio: 100, precioAnterior: null, etiqueta: 'Nuevo', stock: 10, imagen: 'imaganes/7.jpeg',   descripcion: 'Zapatilla deportiva de estilo moderno para entrenar o salir con estilo.', palabrasClave: ['futbol', 'correr', 'entrenar'] },
  { id: '6', nombre: 'Zapatilla casual GS-06',    categoria: 'casual',    precio: 100, precioAnterior: null, etiqueta: 'Nuevo', stock: 3,  imagen: 'imaganes/9.jpeg',   descripcion: 'Zapatilla casual con diseño robusto para acompañarte en cualquier plan.', palabrasClave: ['frio', 'outdoor'] },
  { id: '7', nombre: 'Zapatilla casual GS-07',    categoria: 'casual',    precio: 100, precioAnterior: null, etiqueta: 'Nuevo', stock: 7,  imagen: 'imaganes/12.jpeg',  descripcion: 'Zapatilla casual elegante para tus salidas y ocasiones especiales.', palabrasClave: ['formal', 'fiesta', 'elegante'] },
  { id: '8', nombre: 'Zapatilla deportiva GS-08', categoria: 'deportivo', precio: 100, precioAnterior: null, etiqueta: 'Nuevo', stock: 8,  imagen: 'imaganes/444.jpeg', descripcion: 'Zapatilla deportiva versátil para el gimnasio, la calle o el fútbol.', palabrasClave: ['futbol', 'gimnasio', 'running'] },
];

const NOMBRES_CATEGORIA = { deportivo: 'Zapatillas deportivas', casual: 'Calzado casual', bota: 'Botas' };

/* =========================================================================
   6) PROTOTIPOS Y CLASES  /  7) POLIMORFISMO
   ========================================================================= */
class Zapato {
  constructor({ id, nombre, categoria, precio, precioAnterior = null, etiqueta = '', stock, imagen, descripcion = '', palabrasClave = [] }) {
    this.id = id;
    this.nombre = nombre;
    this.categoria = categoria;
    this.precio = precio;
    this.precioAnterior = precioAnterior;
    this.etiqueta = etiqueta;
    this.stock = stock;
    this.imagen = imagen;
    this.descripcion = descripcion;
    this.palabrasClave = palabrasClave; // palabras clave para el buscador
  }

  // Getter: se comporta como una propiedad, pero es un método (encapsulamiento)
  get categoriaTexto() {
    return NOMBRES_CATEGORIA[this.categoria] ?? 'Calzado';
  }

  get precioFormateado() {
    return `S/ ${this.precio.toFixed(2)}`;
  }

  get precioAnteriorFormateado() {
    return this.tieneOferta() ? `S/ ${this.precioAnterior.toFixed(2)}` : '';
  }

  tieneOferta() {
    return typeof this.precioAnterior === 'number' && this.precioAnterior > this.precio;
  }

  hayStock() {
    return this.stock > 0;
  }

  // HTML de la foto: si no carga, el propio evento "error" pone la imagen de respaldo.
  renderMiniatura(claseImg) {
    const alt = `${this.nombre}, ${this.categoriaTexto.toLowerCase()}`;
    return `<img src="${this.imagen || IMAGEN_RESPALDO}" alt="${alt}" class="${claseImg}" loading="lazy" decoding="async"
      onerror="this.onerror=null;this.src=IMAGEN_RESPALDO">`;
  }

  // URL completa de la foto, para que se pueda ver en WhatsApp.
  // Solo existe cuando la página está publicada (http/https).
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
  obtenerEtiqueta() { return 'Deportivo'; }
}

class ZapatoCasual extends Zapato {
  obtenerEtiqueta() { return 'Casual'; }
}

class ZapatoBota extends Zapato {
  obtenerEtiqueta() { return 'Outdoor'; }
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
   -------------------------------------------------------------------------
   El carrito se guarda en localStorage: al recargar la página, los
   productos siguen ahí. Los datos guardados se validan al cargarlos.
   ========================================================================= */
class Carrito {
  #items = new Map(); // Map privado: "id|talla" -> cantidad

  constructor() {
    this.#cargar();
  }

  #cargar() {
    try {
      const guardado = JSON.parse(localStorage.getItem(CLAVE_CARRITO) || '[]');
      if (!Array.isArray(guardado)) return;
      for (const par of guardado) {
        if (!Array.isArray(par)) continue;
        const [clave, cantidad] = par;
        if (typeof clave === 'string' && Number.isInteger(cantidad) && cantidad > 0 && cantidad <= MAX_POR_PRODUCTO) {
          this.#items.set(clave, cantidad);
        }
      }
    } catch (error) {
      // Si el navegador bloquea el almacenamiento, el carrito funciona igual, solo que sin guardarse.
    }
  }

  #guardar() {
    try {
      localStorage.setItem(CLAVE_CARRITO, JSON.stringify([...this.#items]));
    } catch (error) {
      // Sin almacenamiento disponible: se ignora.
    }
  }

  agregar(zapato, cantidad = 1, talla = '') {
    if (!esNumeroValido(cantidad)) return false;      // 1) validación con typeof
    if (!zapato.hayStock()) return false;

    const clave = `${zapato.id}|${talla}`;           // mismo modelo en otra talla = otra fila
    const actual = this.#items.get(clave) ?? 0;
    this.#items.set(clave, Math.min(actual + cantidad, MAX_POR_PRODUCTO));
    this.#guardar();
    return true;
  }

  quitar(clave) {
    this.#items.delete(clave);
    this.#guardar();
  }

  actualizarCantidad(clave, cantidad) {
    if (cantidad <= 0) {                              // 2) estructura de control: if
      this.quitar(clave);
    } else {
      this.#items.set(clave, Math.min(cantidad, MAX_POR_PRODUCTO));
      this.#guardar();
    }
  }

  vaciar() {
    this.#items.clear();
    this.#guardar();
  }

  estaVacio() {
    return this.listar().length === 0;
  }

  // Devuelve [{zapato, cantidad, talla, clave}] combinando el Map con el catálogo
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
    for (const fila of this.listar()) {                // 2) estructura de control: for...of
      total += fila.cantidad;
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
const btnCarrito       = document.getElementById('btn-carrito');

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
      || (categoriaActiva === 'ultimas' ? z.stock <= 4 && z.hayStock() : z.categoria === categoriaActiva);
    const terminos = [z.nombre, z.categoria, z.categoriaTexto, ...z.palabrasClave].map(normalizar);
    const coincideBusqueda = terminos.some(t => t.includes(busqueda) || busqueda.includes(t));
    return coincideCategoria && coincideBusqueda; // 1) operador lógico &&
  });
}

function renderCatalogo() {
  const lista = obtenerProductosFiltrados();
  gridProductos.innerHTML = '';
  resultadoInfo.textContent = `${lista.length} de ${catalogo.length} productos`;

  if (lista.length === 0) {
    gridProductos.innerHTML = '<p class="sin-resultados" role="status">Lo sentimos, no encontramos productos que coincidan con tu búsqueda.</p>';
    return;
  }

  lista.forEach(z => {
    const esFav = favoritos.has(z.id);
    const etiquetas = [
      z.etiqueta ? `<span class="etiqueta ${z.etiqueta === 'Oferta' ? 'etiqueta--oferta' : ''}">${z.etiqueta}</span>` : '',
      !z.hayStock() ? '<span class="etiqueta">Agotado</span>'
        : z.stock <= 4 ? '<span class="etiqueta etiqueta--ultimas">Últimas unidades</span>' : '',
    ].join('');

    const tarjeta = document.createElement('article');
    tarjeta.className = 'tarjeta';
    tarjeta.dataset.id = z.id;
    tarjeta.innerHTML = `
      <div class="tarjeta__media">
        ${z.renderMiniatura('tarjeta__imagen')}
        <div class="tarjeta__etiquetas">${etiquetas}</div>
        <button type="button" class="tarjeta__fav ${esFav ? 'tarjeta__fav--activo' : ''}" data-accion="favorito" data-id="${z.id}"
          aria-label="Guardar ${z.nombre} en favoritos" aria-pressed="${esFav}">
          ${ICONO_CORAZON}
        </button>
      </div>
      <div class="tarjeta__cuerpo">
        <h3 class="tarjeta__nombre">${z.nombre}</h3>
        <p class="tarjeta__categoria">${z.categoriaTexto}</p>
        <p class="tarjeta__precios">
          <span class="tarjeta__precio">${z.precioFormateado}</span>
          ${z.tieneOferta() ? `<s class="tarjeta__precio-anterior"><span class="sr-only">Precio anterior </span>${z.precioAnteriorFormateado}</s>` : ''}
        </p>
        <div class="tarjeta__acciones">
          <button type="button" class="tarjeta__btn tarjeta__btn--primario" data-accion="agregar" data-id="${z.id}"
            aria-label="Agregar ${z.nombre} al carrito" ${z.hayStock() ? '' : 'disabled'}>Agregar al carrito</button>
          <button type="button" class="tarjeta__btn" data-accion="ver" data-id="${z.id}"
            aria-label="Ver producto ${z.nombre}">Ver producto</button>
        </div>
      </div>
    `;
    gridProductos.appendChild(tarjeta);
  });
}

function renderCarrito() {
  const filas = carrito.listar();
  const cantidad = carrito.cantidadTotal();
  contadorCarrito.textContent = cantidad;
  btnCarrito.setAttribute('aria-label', `Abrir carrito, ${cantidad} ${cantidad === 1 ? 'producto' : 'productos'}`);

  if (filas.length === 0) {
    itemsCarritoEl.innerHTML = '<p class="vacio">Tu carrito está vacío.</p>';
  } else {
    itemsCarritoEl.innerHTML = filas.map(({ zapato, cantidad, talla, clave }) => `
      <div class="item-carrito" data-id="${clave}">
        ${zapato.renderMiniatura('item-carrito__imagen')}
        <div class="item-carrito__info">
          <p class="item-carrito__nombre">${zapato.nombre}</p>
          ${talla ? `<p class="item-carrito__talla">Talla ${talla}</p>` : ''}
          <p>${zapato.precioFormateado}</p>
          <div class="item-carrito__controles">
            <button type="button" data-accion="restar" data-id="${clave}" aria-label="Disminuir cantidad de ${zapato.nombre}">−</button>
            <span aria-label="Cantidad">${cantidad}</span>
            <button type="button" data-accion="sumar" data-id="${clave}" aria-label="Aumentar cantidad de ${zapato.nombre}">+</button>
          </div>
        </div>
        <button type="button" class="item-carrito__quitar" data-accion="quitar" data-id="${clave}" aria-label="Quitar ${zapato.nombre} del carrito">Quitar</button>
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

  setTimeout(() => toast.remove(), 2800); // temporizador: desaparece solo
}

/* =========================================================================
   VENTANAS (modales y carrito): foco, tecla Escape y bloqueo del scroll
   ========================================================================= */
const FOCUSABLES = 'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';
const dialogosAbiertos = []; // pila: el último es el que está al frente

function registrarApertura(elemento, focoInicial) {
  elemento._focoPrevio = document.activeElement;
  if (!dialogosAbiertos.includes(elemento)) dialogosAbiertos.push(elemento);
  document.body.classList.add('sin-scroll');
  requestAnimationFrame(() => (focoInicial || elemento.querySelector(FOCUSABLES) || elemento).focus());
}

function registrarCierre(elemento) {
  const i = dialogosAbiertos.indexOf(elemento);
  if (i === -1) return;
  dialogosAbiertos.splice(i, 1);
  if (dialogosAbiertos.length === 0) document.body.classList.remove('sin-scroll');
  const previo = elemento._focoPrevio;
  elemento._focoPrevio = null;
  if (previo && document.contains(previo) && typeof previo.focus === 'function') previo.focus();
}

function abrirModalEl(elemento, focoInicial) {
  elemento.hidden = false;
  registrarApertura(elemento, focoInicial);
}

function cerrarModalEl(elemento) {
  if (elemento.hidden) return;
  elemento.hidden = true;
  registrarCierre(elemento);
}

/* =========================================================================
   8) EVENTOS DEL DOM
   ========================================================================= */

// --- Evento "load": se dispara cuando toda la página terminó de cargar ---
window.addEventListener('load', () => {
  document.getElementById('loader').classList.add('loader--oculto');
  mostrarToast(`Bienvenido a ${NOMBRE_TIENDA}`);
  renderCatalogo();
  renderCarrito();
});

// --- Evento de scroll: sombra del header y botón "volver arriba" ---
const header = document.getElementById('header');
const btnArriba = document.getElementById('btn-arriba');
window.addEventListener('scroll', () => {
  header.classList.toggle('header--con-scroll', window.scrollY > 40);
  btnArriba.hidden = window.scrollY < 400;
}, { passive: true });
btnArriba.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// --- Eventos de teclado en el buscador (keyup / keydown) ---
const buscador = document.getElementById('buscador');
const buscadorPanel = document.getElementById('buscador-panel');
const btnLupa = document.getElementById('btn-lupa');

function alternarBuscador(abrir) {
  buscadorPanel.hidden = !abrir;
  btnLupa.setAttribute('aria-expanded', String(abrir));
  if (abrir) buscador.focus();
}

buscador.addEventListener('keyup', (evento) => {
  ultimaBusqueda = evento.target.value;
  renderCatalogo();
});
buscador.addEventListener('keydown', (evento) => {
  if (evento.key === 'Enter') {              // lleva a los resultados
    evento.preventDefault();
    document.getElementById('catalogo').scrollIntoView({ behavior: 'smooth' });
  }
});

// --- Clic en la lupa del panel: busca lo escrito y lleva a los resultados ---
document.getElementById('btn-buscar').addEventListener('click', () => {
  ultimaBusqueda = buscador.value;
  renderCatalogo();
  buscador.focus();
  if (buscador.value.trim() !== '') {
    document.getElementById('catalogo').scrollIntoView({ behavior: 'smooth' });
  }
});
btnLupa.addEventListener('click', () => alternarBuscador(buscadorPanel.hidden));

// --- Eventos de foco / desenfoque ---
buscador.addEventListener('focus', () => buscador.classList.add('buscador--enfocado'));
buscador.addEventListener('blur',  () => buscador.classList.remove('buscador--enfocado'));

// --- Menú móvil (hamburguesa) ---
const nav = document.getElementById('nav');
const btnMenu = document.getElementById('btn-menu');
function cerrarMenu() {
  nav.classList.remove('nav--abierto');
  btnMenu.setAttribute('aria-expanded', 'false');
  btnMenu.setAttribute('aria-label', 'Abrir menú');
}
btnMenu.addEventListener('click', () => {
  const abierto = nav.classList.toggle('nav--abierto');
  btnMenu.setAttribute('aria-expanded', String(abierto));
  btnMenu.setAttribute('aria-label', abierto ? 'Cerrar menú' : 'Abrir menú');
});
window.addEventListener('resize', () => { if (window.innerWidth > 820) cerrarMenu(); });

// --- Filtro por categoría: menú, tarjetas de categoría y botones ---
function filtrarCategoria(categoria) {
  categoriaActiva = categoria;
  document.querySelectorAll('.nav__link[data-categoria]').forEach(enlace => {
    const activo = enlace.dataset.categoria === categoria;
    enlace.classList.toggle('nav__link--activo', activo);
    if (activo) enlace.setAttribute('aria-current', 'true');
    else enlace.removeAttribute('aria-current');
  });
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
  // Corazón: marca/desmarca favorito sin abrir la ficha
  const botonFav = evento.target.closest('[data-accion="favorito"]');
  if (botonFav) {
    evento.stopPropagation();
    const idFav = botonFav.dataset.id;
    if (favoritos.has(idFav)) favoritos.delete(idFav);
    else favoritos.add(idFav);
    botonFav.classList.toggle('tarjeta__fav--activo');
    botonFav.setAttribute('aria-pressed', String(favoritos.has(idFav)));
    return;
  }

  // "Consultar": abre WhatsApp (se conserva por si se vuelve a usar)
  const consultar = evento.target.closest('[data-accion="consultar"]');
  if (consultar) {
    evento.stopPropagation();
    const zapatoConsulta = catalogo.find(z => z.id === consultar.dataset.id);
    window.open(zapatoConsulta.enlaceConsulta(), '_blank', 'noopener');
    return;
  }

  // "Ver producto": abre la ficha
  const ver = evento.target.closest('[data-accion="ver"]');
  if (ver) {
    evento.stopPropagation();
    abrirModal(ver.dataset.id);
    return;
  }

  // "Agregar al carrito": la talla es obligatoria, así que abre la ficha para elegirla
  const agregar = evento.target.closest('[data-accion="agregar"]');
  if (agregar) {
    evento.stopPropagation();
    abrirModal(agregar.dataset.id, true);
    return;
  }

  // Clic en cualquier otra parte de la tarjeta: abre la ficha
  const tarjeta = evento.target.closest('.tarjeta');
  if (tarjeta) {
    abrirModal(tarjeta.dataset.id);
  }
});

/* --- Delegación de eventos dentro del carrito (sumar/restar/quitar) --- */
itemsCarritoEl.addEventListener('click', (evento) => {
  const boton = evento.target.closest('button[data-accion]');
  if (!boton) return;
  const clave = boton.dataset.id;
  const accion = boton.dataset.accion;
  const fila = carrito.listar().find(f => f.clave === clave);
  if (!fila) return;

  switch (accion) {                                      // 2) estructura de control: switch
    case 'sumar':
      carrito.actualizarCantidad(clave, fila.cantidad + 1);
      break;
    case 'restar':
      carrito.actualizarCantidad(clave, fila.cantidad - 1);
      break;
    case 'quitar':
      carrito.quitar(clave);
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
  panelCarrito.setAttribute('aria-hidden', String(!abrir));
  overlay.hidden = !abrir;
  if (abrir) registrarApertura(panelCarrito, document.getElementById('cerrar-carrito'));
  else registrarCierre(panelCarrito);
}
btnCarrito.addEventListener('click', () => alternarCarrito(true));
document.getElementById('cerrar-carrito').addEventListener('click', () => alternarCarrito(false));
overlay.addEventListener('click', () => alternarCarrito(false));

/* --- Ficha del producto (modal) --- */
const modal = document.getElementById('modal');
const TALLAS = ['36', '37', '38', '39', '40', '41', '42', '43', '44', '45'];
const TALLAS_AGOTADAS = []; // ejemplo: ['36', '37'] -> salen tachadas y no se pueden elegir
let tallaSeleccionada = null;
let zapatoModal = null;

function abrirModal(id, pedirTalla = false) {
  const z = catalogo.find(p => p.id === id);
  if (!z) return;
  zapatoModal = z;
  tallaSeleccionada = null;
  const esFav = favoritos.has(z.id);
  const consultaTalla = `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(`Hola, tengo una duda sobre la talla de este calzado: ${z.nombre}. ¿Me pueden ayudar, por favor?`)}`;

  document.getElementById('modal-cuerpo').innerHTML = `
    <div class="detalle">
      <div class="detalle__galeria">
        ${z.renderMiniatura('detalle__imagen')}
      </div>
      <div class="detalle__info">
        <p class="detalle__origen">${z.categoriaTexto}</p>
        <div class="detalle__tags">
          ${z.etiqueta ? `<span class="etiqueta ${z.etiqueta === 'Oferta' ? 'etiqueta--oferta' : ''}">${z.etiqueta}</span>` : ''}
          <span class="etiqueta etiqueta--ultimas">Envío gratis</span>
        </div>
        <h2 id="ficha-titulo" class="detalle__titulo">${z.nombre}</h2>
        <p class="detalle__descripcion">${z.descripcion}</p>
        <p class="detalle__precios">
          <span class="detalle__precio">${z.precioFormateado}</span>
          ${z.tieneOferta() ? `<s class="tarjeta__precio-anterior"><span class="sr-only">Precio anterior </span>${z.precioAnteriorFormateado}</s>` : ''}
        </p>

        <p class="detalle__subtitulo" id="ficha-tallas-titulo">Tallas</p>
        <div class="detalle__tallas" id="ficha-tallas" role="group" aria-labelledby="ficha-tallas-titulo">
          ${TALLAS.map(t => `<button type="button" class="detalle__talla" data-talla="${t}" aria-pressed="false" aria-label="Talla ${t}" ${TALLAS_AGOTADAS.includes(t) ? 'disabled' : ''}>${t}</button>`).join('')}
        </div>
        <p class="detalle__ayuda" id="ficha-ayuda" role="status"></p>
        <p class="detalle__aviso">Elige tu talla habitual. ¿Dudas? <a href="${consultaTalla}" target="_blank" rel="noopener noreferrer">Escríbenos por WhatsApp</a>.</p>

        <div class="detalle__acciones">
          <button type="button" class="detalle__principal" data-accion="pedir" ${z.hayStock() ? '' : 'disabled'}>${z.hayStock() ? 'Pedir ahora' : 'Producto agotado'}</button>
          <button type="button" class="detalle__secundario" data-accion="agregar-ficha" ${z.hayStock() ? '' : 'disabled'}>${ICONO_BOLSA} Agregar al carrito</button>
          <button type="button" class="detalle__fav ${esFav ? 'detalle__fav--activo' : ''}" data-accion="favorito-modal" aria-label="Guardar en favoritos" aria-pressed="${esFav}">
            ${ICONO_CORAZON}
          </button>
        </div>
        <p class="detalle__stock">Stock disponible en todas las tallas</p>
      </div>
    </div>
  `;
  abrirModalEl(modal, document.getElementById('cerrar-modal'));

  if (pedirTalla) {
    document.getElementById('ficha-ayuda').textContent = 'Elige tu talla para agregar este producto al carrito.';
    setTimeout(() => document.getElementById('ficha-tallas').scrollIntoView({ behavior: 'smooth', block: 'center' }), 150);
  }
}

document.getElementById('cerrar-modal').addEventListener('click', () => cerrarModalEl(modal));
modal.addEventListener('click', (evento) => {          // clic fuera de la ficha: cierra
  if (evento.target === modal) cerrarModalEl(modal);
});

// Comprueba que haya una talla elegida antes de agregar o pedir
function validarTalla() {
  if (tallaSeleccionada) return true;
  const grupo = document.getElementById('ficha-tallas');
  document.getElementById('ficha-ayuda').textContent = 'Elige tu talla para continuar.';
  grupo.classList.add('detalle__tallas--error');
  grupo.scrollIntoView({ behavior: 'smooth', block: 'center' });
  mostrarToast('Elige tu talla antes de continuar', 'error');
  return false;
}

document.getElementById('modal-cuerpo').addEventListener('click', (evento) => {
  // Elegir talla
  const botonTalla = evento.target.closest('.detalle__talla');
  if (botonTalla && !botonTalla.disabled) {
    document.querySelectorAll('.detalle__talla').forEach(b => {
      b.classList.remove('detalle__talla--activa');
      b.setAttribute('aria-pressed', 'false');
    });
    botonTalla.classList.add('detalle__talla--activa');
    botonTalla.setAttribute('aria-pressed', 'true');
    tallaSeleccionada = botonTalla.dataset.talla;
    document.getElementById('ficha-ayuda').textContent = '';
    document.getElementById('ficha-tallas').classList.remove('detalle__tallas--error');
    return;
  }

  // Corazón de la ficha
  const botonFav = evento.target.closest('[data-accion="favorito-modal"]');
  if (botonFav) {
    if (favoritos.has(zapatoModal.id)) favoritos.delete(zapatoModal.id);
    else favoritos.add(zapatoModal.id);
    botonFav.classList.toggle('detalle__fav--activo');
    botonFav.setAttribute('aria-pressed', String(favoritos.has(zapatoModal.id)));
    renderCatalogo();
    return;
  }

  // Pedir ahora: agrega el producto y abre directo el formulario del pedido
  if (evento.target.closest('[data-accion="pedir"]')) {
    if (!validarTalla()) return;
    if (carrito.agregar(zapatoModal, 1, tallaSeleccionada)) {
      contadorClicsAgregar(); // función "creciente": suma un clic más
      renderCarrito();
      renderCatalogo();
      cerrarModalEl(modal);
      abrirPedido();
    }
    return;
  }

  // Agregar al carrito: suma el producto y deja seguir comprando
  if (evento.target.closest('[data-accion="agregar-ficha"]')) {
    if (!validarTalla()) return;
    if (carrito.agregar(zapatoModal, 1, tallaSeleccionada)) {
      contadorClicsAgregar();
      mostrarToast(`${zapatoModal.nombre} (talla ${tallaSeleccionada}) agregado al carrito`);
      renderCarrito();
      renderCatalogo();
      cerrarModalEl(modal);
    }
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
const dialogoPedido    = document.getElementById('dialogo-pedido');
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
  dialogoPedido.setAttribute('aria-labelledby', 'pedido-titulo');
  abrirModalEl(modalPedido, document.getElementById('cerrar-pedido'));
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
  dialogoPedido.setAttribute('aria-labelledby', 'pedido-exito-titulo');
  document.getElementById('pedido-whatsapp').focus();
}

document.getElementById('btn-finalizar').addEventListener('click', abrirPedido);
document.getElementById('cerrar-pedido').addEventListener('click', () => cerrarModalEl(modalPedido));
document.getElementById('pedido-seguir').addEventListener('click', () => cerrarModalEl(modalPedido));
document.getElementById('pedido-volver').addEventListener('click', () => cerrarModalEl(modalPedido));
modalPedido.addEventListener('click', (evento) => {
  if (evento.target === modalPedido) cerrarModalEl(modalPedido);
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
   TECLADO: Escape cierra lo que esté abierto y el foco se queda dentro
   ========================================================================= */
function cerrarDialogoSuperior() {
  const ultimo = dialogosAbiertos[dialogosAbiertos.length - 1];
  if (!ultimo) return false;
  if (ultimo === modal) cerrarModalEl(modal);
  else if (ultimo === modalPedido) cerrarModalEl(modalPedido);
  else if (ultimo === panelCarrito) alternarCarrito(false);
  return true;
}

document.addEventListener('keydown', (evento) => {
  if (evento.key === 'Escape') {
    if (cerrarDialogoSuperior()) return;
    if (nav.classList.contains('nav--abierto')) { cerrarMenu(); btnMenu.focus(); return; }
    if (!buscadorPanel.hidden) { alternarBuscador(false); btnLupa.focus(); }
    return;
  }

  if (evento.key === 'Tab' && dialogosAbiertos.length > 0) {   // el foco no se escapa de la ventana
    const ventana = dialogosAbiertos[dialogosAbiertos.length - 1];
    const enfocables = [...ventana.querySelectorAll(FOCUSABLES)].filter(el => el.offsetParent !== null);
    if (enfocables.length === 0) return;
    const primero = enfocables[0];
    const ultimo = enfocables[enfocables.length - 1];
    if (!ventana.contains(document.activeElement)) {
      evento.preventDefault();
      primero.focus();
    } else if (evento.shiftKey && document.activeElement === primero) {
      evento.preventDefault();
      ultimo.focus();
    } else if (!evento.shiftKey && document.activeElement === ultimo) {
      evento.preventDefault();
      primero.focus();
    }
  }
});

/* =========================================================================
   PIE DE PÁGINA: WhatsApp, redes y boletín
   ========================================================================= */
// Pega aquí los enlaces de tus redes. Si dejas uno vacío, ese enlace no aparece.
const REDES = { Instagram: '', Facebook: '', TikTok: '' };

document.getElementById('enlace-whatsapp').innerHTML = ICONO_WHATSAPP;
document.getElementById('wa-flotante').insertAdjacentHTML('afterbegin', ICONO_WHATSAPP);
document.querySelectorAll('.enlace-wa').forEach(a => {
  a.href = `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(a.dataset.mensaje)}`;
});
document.getElementById('lista-atencion').innerHTML =
  `<li><a href="https://wa.me/${WHATSAPP_NUMERO}" target="_blank" rel="noopener noreferrer">WhatsApp</a></li>` +
  Object.entries(REDES).filter(([, url]) => url)
    .map(([nombre, url]) => `<li><a href="${url}" target="_blank" rel="noopener noreferrer">${nombre}</a></li>`).join('');

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
   ANIMACIÓN: las secciones aparecen suavemente al hacer scroll
   ========================================================================= */
const revelables = document.querySelectorAll('.revelar');
if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const observador = new IntersectionObserver((entradas) => {
    entradas.forEach(entrada => {
      if (entrada.isIntersecting) {
        entrada.target.classList.add('revelar--visible');
        observador.unobserve(entrada.target);
      }
    });
  }, { threshold: 0.12 });
  revelables.forEach(el => observador.observe(el));
} else {
  revelables.forEach(el => el.classList.add('revelar--visible'));
}

/* =========================================================================
   TEMPORIZADOR: carrusel de la portada (setInterval + setTimeout)
   -------------------------------------------------------------------------
   Con una sola foto no rota. Si agregas más rutas a GIFS_HERO, la portada
   cambiará sola cada 6 segundos con un desvanecimiento.
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
      setTimeout(() => {                                     // 2) a los 0,5 s cambia la imagen
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