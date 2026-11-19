'use strict';

// Única fuente de datos del catálogo. Textos originales para este prototipo.
const libros = [
  { id: 'a-dos-metros-de-ti', titulo: 'A dos metros de ti', autor: 'Rachael Lippincott', genero: 'Romance', precio: 15500, imagen: 'a-dos-metros-de-ti.jpg', descripcion: 'Hay encuentros que acercan incluso cuando la distancia parece inevitable. Una lectura sensible sobre los pequeños gestos, el cuidado y las ganas de compartir el mundo con alguien.' },
  { id: 'alas-de-hierro', titulo: 'Alas de hierro', autor: 'Rebecca Yarros', genero: 'Fantasía', precio: 28900, imagen: 'alas-de-hierro.jpg', descripcion: 'El coraje también se construye en los días de incertidumbre. Dejá que una aventura de cielos inmensos y decisiones difíciles te recuerde por qué algunas historias se leen con el corazón acelerado.' },
  { id: 'bajo-la-misma-historia', titulo: 'Bajo la misma estrella', autor: 'John Green', genero: 'Romance', precio: 17900, imagen: 'bajo-la-misma-historia.jpg', descripcion: 'Dos caminos pueden cruzarse en el momento menos pensado. Una invitación a mirar los recuerdos con ternura y descubrir cuánto puede cambiar una conversación pendiente.' },
  { id: 'el-fabricante-de-lagrimas', titulo: 'El fabricante de lágrimas', autor: 'Erin Doom', genero: 'Romance', precio: 21800, imagen: 'el-fabricante-de-lagrimas.jpg', descripcion: 'Algunas emociones necesitan tiempo para encontrar su nombre. Entre silencios y nuevas oportunidades, esta lectura invita a pensar en los vínculos que nos ayudan a volver a empezar.' },
  { id: 'el-nino-con-el-pijama-a-rayas', titulo: 'El niño con el pijama a rayas', autor: 'John Boyne', genero: 'Ficción histórica', precio: 16900, imagen: 'el-nino-con-el-pijama-a-rayas.jpg', descripcion: 'Mirar el mundo con ojos nuevos puede volver visibles sus contradicciones. Una lectura para hacer una pausa, conversar sobre la memoria y pensar en la humanidad que compartimos.' },
  { id: 'el-pecador-de-oxford', titulo: 'El pecador de Oxford', autor: 'Mar Petryk', genero: 'Romance', precio: 23500, imagen: 'el-pecador-de-oxford.jpg', descripcion: 'Las certezas se tambalean cuando aparece alguien capaz de desafiarlas. Un libro para quienes disfrutan de la tensión, los sentimientos intensos y los personajes con mucho por descubrir.' },
  { id: 'el-secreto-de-la-asistenta', titulo: 'El secreto de la asistenta', autor: 'Freida McFadden', genero: 'Thriller', precio: 24900, imagen: 'el-secreto-de-la-asistenta.jpg', descripcion: 'Una puerta cerrada puede despertar más preguntas que respuestas. Elegí esta lectura si te gusta observar los detalles, sospechar de las apariencias y cambiar de teoría a cada página.' },
  { id: 'la-chica-del-tren', titulo: 'La chica del tren', autor: 'Paula Hawkins', genero: 'Thriller', precio: 19800, imagen: 'la-chica-del-tren.jpg', descripcion: 'La rutina tiene rincones que casi nunca miramos de cerca. Un viaje de lectura para quienes disfrutan de las perspectivas incompletas y las preguntas que siguen resonando después de cerrar el libro.' },
  { id: 'romper-el-circulo', titulo: 'Romper el círculo', autor: 'Colleen Hoover', genero: 'Romance', precio: 22500, imagen: 'romper-el-circulo.jpg', descripcion: 'A veces la decisión más valiente empieza con escucharse. Una lectura emotiva para pensar en los límites, los afectos y la posibilidad de escribir una vida diferente.' },
  { id: 'tempestade-de-onix', titulo: 'Tempestade de ônix', autor: 'Rebecca Yarros', genero: 'Fantasía', precio: 32900, imagen: 'tempestade-de-onix.jpg', descripcion: 'Cuando el horizonte se llena de tormentas, cada elección cuenta. Una propuesta para lectores que buscan mundos amplios, lealtades a prueba y aventuras que invitan a seguir una página más.' },
  { id: 'verity', titulo: 'Verity', autor: 'Colleen Hoover', genero: 'Thriller', precio: 20900, imagen: 'verity.jpg', descripcion: 'Las palabras pueden iluminar una historia o llenarla de sombras. Una lectura inquietante para jugar con la duda y preguntarte cuánto confiás en aquello que alguien decide contar.' }
];
const generos = [...new Set(libros.map(libro => libro.genero))];
const escritores = [...new Set(libros.map(libro => libro.autor))].map(nombre => {
  const obras = libros.filter(libro => libro.autor === nombre);
  return {
    nombre,
    iniciales: nombre.trim().split(/\s+/).map(parte => parte[0]).slice(0, 2).join('').toLocaleUpperCase('es-AR'),
    cantidad: obras.length,
    generos: [...new Set(obras.map(libro => libro.genero))],
    frase: 'En el catálogo podés explorar ' + obras.map(libro => '“' + libro.titulo + '”').join(' y ') + '.'
  };
});
const pesos = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', minimumFractionDigits: 2 });
const precio = valor => pesos.format(valor).replace(/\s/g, ' ');
const normalizar = texto => texto.toLocaleLowerCase('es-AR').trim().replace(/\s+/g, ' ');
const $ = selector => document.querySelector(selector);
const contenido = $('#contenido');
const aplicacion = $('.aplicacion');
const lateral = $('#menu-lateral');
const movil = window.matchMedia('(max-width: 640px)');
let generoSeleccionado = 'Todos';
let autorSeleccionado = '';
let usuario = null;
let modoRegistro = false;
let menuAbierto = false;
let rutaAnterior = '';
const documentoNavegacion = location.href.split('#')[0];
let entradaRenderizada = '';
let temporizadorToast;
const movimientoReducido = window.matchMedia('(prefers-reduced-motion: reduce)');
const limpiezasCarruseles = [];

function estadoInterno() {
  const estado = history.state?.codexNavegacion;
  return estado?.documento === documentoNavegacion && Number.isInteger(estado.indice) && estado.indice >= 0 ? estado : null;
}
function marcarEntrada(indice) {
  const estado = { documento: documentoNavegacion, indice, id: Date.now().toString(36) + Math.random().toString(36).slice(2) };
  history.replaceState({ ...history.state, codexNavegacion: estado }, '', location.href);
  return estado;
}
function navegar(destino, opciones = {}) {
  if ((location.hash || '#inicio') === destino) {
    if (opciones.foco !== false) contenido.querySelector('h1')?.focus();
    return;
  }
  const anterior = estadoInterno() || marcarEntrada(0);
  const estado = { documento: documentoNavegacion, indice: anterior.indice + 1, id: Date.now().toString(36) + Math.random().toString(36).slice(2) };
  history.pushState({ codexNavegacion: estado }, '', destino);
  renderizar(opciones);
}
function botonVolver() {
  const boton = elemento('button', 'boton boton--secundario regreso', '← Volver');
  boton.type = 'button';
  boton.addEventListener('click', () => {
    if ((estadoInterno()?.indice || 0) > 0) history.back();
    else navegar('#inicio');
  });
  return boton;
}
function rutaNavegacion(pasos) {
  const nav = elemento('nav', 'ruta-navegacion');
  nav.setAttribute('aria-label', 'Ruta de navegación');
  const lista = elemento('ol', 'ruta-navegacion__lista');
  pasos.forEach(([texto, destino], indice) => {
    const item = elemento('li', 'ruta-navegacion__paso');
    if (indice) {
      const separador = elemento('span', 'ruta-navegacion__separador', '›');
      separador.setAttribute('aria-hidden', 'true');
      item.append(separador);
    }
    if (indice === pasos.length - 1) {
      const actual = elemento('span', 'ruta-navegacion__actual', texto);
      actual.setAttribute('aria-current', 'page');
      item.append(actual);
    } else item.append(enlace(texto, destino, 'ruta-navegacion__enlace'));
    lista.append(item);
  });
  nav.append(lista);
  return nav;
}

function activarDesplazamientoPorBordes(fila) {
  const controlador = new AbortController();
  const opciones = { passive: true, signal: controlador.signal };
  let cuadro = null;
  let velocidad = 0;
  let instanteAnterior = null;
  let posicion = 0;
  let limite = 0;

  function detener() {
    if (cuadro !== null) cancelAnimationFrame(cuadro);
    cuadro = null;
    velocidad = 0;
    instanteAnterior = null;
  }

  function avanzar(instante) {
    cuadro = null;
    if (movimientoReducido.matches || !fila.isConnected || !velocidad) {
      detener();
      return;
    }
    // Tiempo real: la velocidad es igual a 60 Hz y a 144 Hz.
    const segundos = instanteAnterior === null ? 0 : Math.min(instante - instanteAnterior, 32) / 1000;
    instanteAnterior = instante;
    posicion = Math.max(0, Math.min(limite, posicion + velocidad * segundos));
    fila.scrollLeft = posicion;
    if ((velocidad < 0 && posicion <= 0) || (velocidad > 0 && posicion >= limite)) {
      detener();
      return;
    }
    cuadro = requestAnimationFrame(avanzar);
  }

  fila.addEventListener('mousemove', evento => {
    if (movimientoReducido.matches || evento.buttons || document.hidden) {
      detener();
      return;
    }
    const rectangulo = fila.getBoundingClientRect();
    const ancho = fila.clientWidth;
    const x = evento.clientX - rectangulo.left - fila.clientLeft;
    const zona = ancho * 0.15;
    limite = Math.max(0, fila.scrollWidth - ancho);
    if (!zona || !limite || x < 0 || x > ancho) {
      detener();
      return;
    }
    // Cero en el límite del 15%; máximo de 360 px/s junto al borde.
    velocidad = x < zona ? -360 * (1 - x / zona)
      : x > ancho - zona ? 360 * (1 - (ancho - x) / zona) : 0;
    if (!velocidad || (velocidad < 0 && fila.scrollLeft <= 0)
      || (velocidad > 0 && fila.scrollLeft >= limite)) {
      detener();
      return;
    }
    if (cuadro === null) {
      posicion = fila.scrollLeft;
      instanteAnterior = null;
      cuadro = requestAnimationFrame(avanzar);
    }
  }, opciones);
  // No se cancela ningún evento nativo: rueda, touch y teclado conservan su comportamiento.
  ['mouseleave', 'mousedown', 'wheel', 'touchstart', 'keydown'].forEach(nombre => {
    fila.addEventListener(nombre, detener, opciones);
  });
  window.addEventListener('blur', detener, opciones);
  window.addEventListener('resize', detener, opciones);
  document.addEventListener('visibilitychange', detener, opciones);
  movimientoReducido.addEventListener('change', detener, opciones);
  limpiezasCarruseles.push(() => {
    detener();
    controlador.abort();
  });
}

function elemento(etiqueta, clase, texto) {
  const nodo = document.createElement(etiqueta);
  if (clase) nodo.className = clase;
  if (texto !== undefined) nodo.textContent = texto;
  return nodo;
}
function icono(nombre) {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('aria-hidden', 'true');
  const uso = document.createElementNS('http://www.w3.org/2000/svg', 'use');
  uso.setAttribute('href', '#icono-' + nombre);
  svg.append(uso);
  return svg;
}
function enlace(texto, destino, clase = 'boton', nombreIcono) {
  const nodo = elemento('a', clase, texto);
  nodo.href = destino;
  if (nombreIcono) nodo.append(icono(nombreIcono));
  return nodo;
}
function tapa(libro, clase, carga = 'lazy') {
  const imagen = elemento('img', clase);
  imagen.src = 'img/' + libro.imagen;
  imagen.alt = 'Tapa de ' + libro.titulo + ', de ' + libro.autor;
  imagen.loading = carga;
  imagen.decoding = 'async';
  return imagen;
}
function titulo(texto, clase = 'vista__titulo') {
  const nodo = elemento('h1', clase, texto);
  nodo.tabIndex = -1;
  return nodo;
}
function encabezado(texto, introduccion, etiqueta) {
  const cabecera = elemento('header', 'catalogo__cabecera');
  cabecera.append(elemento('p', 'vista__etiqueta', etiqueta), titulo(texto), elemento('p', 'vista__introduccion', introduccion));
  return cabecera;
}
function leerPreferencia(clave, defecto) {
  try { return localStorage.getItem('codex-' + clave) || defecto; } catch { return defecto; }
}
function guardarPreferencia(clave, valor) {
  try { localStorage.setItem('codex-' + clave, valor); } catch { /* El prototipo funciona también sin almacenamiento. */ }
}
function notificar(texto, tipo = 'exito') {
  clearTimeout(temporizadorToast);
  const region = $('#notificaciones');
  region.replaceChildren();
  const toast = elemento('div', 'toast' + (tipo === 'error' ? ' toast--error' : ''));
  toast.append(elemento('strong', '', tipo === 'error' ? 'Revisá los datos' : '¡Listo!'), elemento('p', '', texto));
  region.append(toast);
  temporizadorToast = window.setTimeout(() => region.replaceChildren(), 6500);
}
function tarjeta(libro, recomendado = false) {
  const tarjeta = elemento('a', 'libro' + (recomendado ? ' libro--recomendado' : ''));
  tarjeta.href = '#libro-' + libro.id;
  tarjeta.setAttribute('aria-label', 'Ver ' + libro.titulo + ', de ' + libro.autor + ', ' + precio(libro.precio));
  tarjeta.append(tapa(libro, 'libro__tapa'));
  if (!recomendado) tarjeta.append(elemento('p', 'libro__genero', libro.genero));
  tarjeta.append(elemento('h3', 'libro__titulo', libro.titulo), elemento('p', 'libro__autor', libro.autor));
  const pie = elemento('div', 'libro__pie');
  const flecha = elemento('span', 'libro__flecha');
  flecha.append(icono('flecha'));
  pie.append(elemento('span', 'libro__precio', precio(libro.precio)), flecha);
  tarjeta.append(pie);
  return tarjeta;
}
function tarjetaEscritor(escritor, detalle = false) {
  const tarjeta = elemento('a', 'escritor');
  tarjeta.href = (detalle ? '#escritor?autor=' : '#catalogo?autor=') + encodeURIComponent(escritor.nombre);
  tarjeta.setAttribute('aria-label', (detalle ? 'Ver escritor: ' : 'Ver libros de ') + escritor.nombre);
  tarjeta.addEventListener('click', evento => {
    if (evento.ctrlKey || evento.metaKey || evento.shiftKey || evento.altKey || evento.button !== 0) return;
    generoSeleccionado = 'Todos';
    $('#busqueda').value = '';
  });
  const avatar = elemento('span', 'escritor__avatar', escritor.iniciales);
  avatar.setAttribute('aria-hidden', 'true');
  tarjeta.append(avatar, elemento('h3', 'escritor__nombre', escritor.nombre),
    elemento('p', 'escritor__cantidad', escritor.cantidad + (escritor.cantidad === 1 ? ' libro en el catálogo' : ' libros en el catálogo')),
    elemento('p', 'escritor__generos', escritor.generos.join(' · ')),
    elemento('p', 'escritor__frase', escritor.frase));
  const pie = elemento('span', 'escritor__enlace', detalle ? 'Conocer su selección' : 'Explorar sus libros');
  pie.append(icono('flecha'));
  tarjeta.append(pie);
  return tarjeta;
}
function vistaEscritores() {
  const vista = elemento('section', 'vista escritores');
  vista.append(encabezado('Voces para tu próxima lectura', 'Conocé los libros de cada escritor en nuestra selección.', 'Escritores'));
  const grilla = elemento('div', 'escritores__grilla');
  escritores.forEach(escritor => grilla.append(tarjetaEscritor(escritor, true)));
  vista.append(grilla);
  contenido.append(vista);
}
function vistaDetalleEscritor(escritor) {
  const vista = elemento('section', 'vista escritores');
  vista.append(botonVolver(), encabezado(escritor.nombre, escritor.frase, 'Su selección en Editorial Codex'));
  const resumen = elemento('div', 'escritores__detalle');
  const avatar = elemento('span', 'escritor__avatar', escritor.iniciales);
  avatar.setAttribute('aria-hidden', 'true');
  const datos = elemento('div', 'escritores__datos');
  const catalogo = enlace('Ver todos sus libros', '#catalogo?autor=' + encodeURIComponent(escritor.nombre), 'boton', 'flecha');
  catalogo.addEventListener('click', () => { generoSeleccionado = 'Todos'; $('#busqueda').value = ''; });
  datos.append(elemento('p', 'escritor__cantidad', escritor.cantidad + (escritor.cantidad === 1 ? ' libro en el catálogo' : ' libros en el catálogo')),
    elemento('p', 'escritor__generos', escritor.generos.join(' · ')), catalogo);
  resumen.append(avatar, datos);
  const grilla = elemento('div', 'catalogo__grilla');
  libros.filter(libro => libro.autor === escritor.nombre).forEach(libro => grilla.append(tarjeta(libro)));
  vista.append(resumen, elemento('h2', 'seccion__titulo escritores__subtitulo', 'Libros en esta selección'), grilla);
  contenido.append(vista);
}
function vistaInicio() {
  const vista = elemento('section', 'vista inicio');
  const bienvenida = elemento('div', 'bienvenida');
  const banner = elemento('section', 'banner');
  const nombre = usuario ? usuario.nombre.split(' ')[0] : 'lector';
  const h1 = titulo('Hola, ' + nombre + '.', 'banner__titulo');
  h1.append(elemento('span', '', ' Tu próxima historia te espera.'));
  banner.append(elemento('p', 'banner__etiqueta', 'Un refugio entre páginas'), h1, elemento('p', 'banner__texto', 'Desconectá un rato. Encontrá un libro. Dejá que empiece el viaje.'), enlace('Encontrá tu lectura', '#catalogo', 'boton', 'flecha'));
  const resumen = elemento('section', 'resumen');
  const resumenCabecera = elemento('div', 'resumen__cabecera');
  resumenCabecera.append(elemento('h2', 'seccion__titulo', 'Historias por descubrir'), icono('destello'));
  const numero = elemento('p', 'resumen__numero', String(libros.length));
  numero.append(elemento('span', '', 'libros, infinitos mundos'));
  const resumenPie = elemento('div', 'resumen__pie');
  const resumenTexto = elemento('p', '', 'Nuestra recomendación de hoy');
  resumenTexto.append(elemento('strong', '', libros[1].titulo));
  resumenPie.append(tapa(libros[1], '', 'eager'), resumenTexto);
  resumen.append(resumenCabecera, numero, elemento('div', 'resumen__barra'), resumenPie);
  bienvenida.append(banner, resumen);
  const medio = elemento('div', 'inicio__medio');
  const seleccionado = libros[1];
  const seccionDestacado = elemento('section');
  seccionDestacado.append(elemento('h2', 'seccion__titulo', 'Una lectura para perderse'));
  const destacado = elemento('div', 'destacado');
  const datos = elemento('div', 'destacado__datos');
  datos.append(elemento('h3', '', seleccionado.titulo), elemento('p', 'destacado__autor', seleccionado.autor), elemento('p', 'destacado__descripcion', seleccionado.descripcion), enlace('Descubrir el libro', '#libro-' + seleccionado.id, 'boton', 'flecha'));
  destacado.append(tapa(seleccionado, 'destacado__tapa', 'eager'), datos);
  seccionDestacado.append(destacado);
  const estadisticas = elemento('section', 'estadisticas');
  estadisticas.append(elemento('h2', 'seccion__titulo', 'Tu universo lector'));
  const lista = elemento('div', 'estadisticas__lista');
  [[libros.length, 'Libros disponibles', 'libro'], [generos.length, 'Géneros para explorar', 'generos'], [new Set(libros.map(l => l.autor)).size, 'Voces diferentes', 'corazon']].forEach(([valor, texto, nombreIcono]) => {
    const item = elemento('div', 'estadisticas__item');
    item.append(icono(nombreIcono), elemento('strong', '', String(valor)), elemento('span', '', texto));
    lista.append(item);
  });
  const cita = elemento('p', 'estadisticas__cita');
  cita.append(elemento('span', '', '“'), document.createTextNode('Siempre hay un mundo nuevo esperando en la próxima página.'));
  estadisticas.append(lista, cita);
  medio.append(seccionDestacado, estadisticas);
  const recomendaciones = elemento('section');
  const cabecera = elemento('div', 'seccion__cabecera');
  cabecera.append(elemento('h2', 'seccion__titulo', 'Recomendados para vos'), enlace('Ver todos →', '#catalogo', 'enlace'));
  const fila = elemento('div', 'recomendados');
  fila.setAttribute('aria-label', 'Libros recomendados, fila desplazable');
  fila.tabIndex = 0;
  [libros[8], libros[3], libros[10], libros[0], libros[6], libros[9], libros[7]].forEach(libro => fila.append(tarjeta(libro, true)));
  const carrusel = elemento('div', 'recomendados__marco');
  carrusel.append(fila);
  recomendaciones.append(cabecera, carrusel);
  const destacados = elemento('section', 'escritores escritores--destacados');
  const cabeceraEscritores = elemento('div', 'seccion__cabecera');
  cabeceraEscritores.append(elemento('h2', 'seccion__titulo', 'Escritores destacados'), enlace('Ver todos →', '#escritores', 'enlace'));
  const filaEscritores = elemento('div', 'recomendados escritores__carrusel');
  filaEscritores.tabIndex = 0;
  filaEscritores.setAttribute('aria-label', 'Escritores destacados, fila desplazable');
  [...escritores].sort((a, b) => b.cantidad - a.cantidad).slice(0, 6).forEach(escritor => filaEscritores.append(tarjetaEscritor(escritor)));
  const marcoEscritores = elemento('div', 'recomendados__marco');
  marcoEscritores.append(filaEscritores);
  destacados.append(cabeceraEscritores, marcoEscritores);
  const descubrir = elemento('section', 'descubrir');
  const emblema = elemento('div', 'descubrir__icono');
  emblema.append(icono('libro'));
  const mensaje = elemento('div', 'descubrir__datos');
  mensaje.append(elemento('h2', '', 'Descubrí nuevos mundos'), elemento('p', '', 'Un romance, un misterio, una aventura. Tu próxima historia empieza acá.'));
  descubrir.append(emblema, mensaje, enlace('Explorar catálogo', '#catalogo', 'boton', 'flecha'));
  vista.append(bienvenida, medio, recomendaciones, destacados, descubrir);
  contenido.append(vista);
  activarDesplazamientoPorBordes(fila);
  activarDesplazamientoPorBordes(filaEscritores);
}
function vistaCatalogo() {
  const vista = elemento('section', 'vista catalogo');
  if (autorSeleccionado) vista.append(botonVolver());
  vista.append(encabezado('Cada libro, un nuevo mundo', 'Explorá nuestra selección y encontrá esa historia que es para vos.', 'El catálogo'));
  const filtros = elemento('div', 'filtros');
  filtros.setAttribute('role', 'group');
  filtros.setAttribute('aria-label', 'Filtrar por género');
  ['Todos', ...generos].forEach(genero => {
    const activo = generoSeleccionado === genero;
    const chip = elemento('button', 'filtros__chip' + (activo ? ' filtros__chip--activo' : ''), genero);
    chip.type = 'button';
    chip.setAttribute('aria-pressed', String(activo));
    chip.addEventListener('click', () => {
      generoSeleccionado = genero;
      filtros.querySelectorAll('button').forEach(boton => {
        const seleccionado = boton === chip;
        boton.classList.toggle('filtros__chip--activo', seleccionado);
        boton.setAttribute('aria-pressed', String(seleccionado));
      });
      actualizarCatalogo();
    });
    filtros.append(chip);
  });
  if (autorSeleccionado) {
    const quitarAutor = enlace('Autor: ' + autorSeleccionado + ' ✕', '#catalogo', 'filtros__chip filtros__chip--autor');
    quitarAutor.setAttribute('aria-label', 'Quitar filtro de autor: ' + autorSeleccionado);
    filtros.append(quitarAutor);
  }
  const cantidad = elemento('p', 'catalogo__cantidad');
  cantidad.id = 'cantidad-resultados';
  cantidad.setAttribute('role', 'status');
  cantidad.setAttribute('aria-live', 'polite');
  const grilla = elemento('div', 'catalogo__grilla');
  grilla.id = 'grilla-libros';
  vista.append(filtros, cantidad, grilla);
  contenido.append(vista);
  actualizarCatalogo();
}
function actualizarCatalogo() {
  const grilla = $('#grilla-libros');
  if (!grilla) return;
  const consulta = normalizar($('#busqueda').value);
  const resultados = libros.filter(libro => (generoSeleccionado === 'Todos' || libro.genero === generoSeleccionado) && (!autorSeleccionado || libro.autor === autorSeleccionado) && normalizar(libro.titulo).includes(consulta));
  $('#cantidad-resultados').textContent = resultados.length + (resultados.length === 1 ? ' libro encontrado' : ' libros encontrados') + (consulta ? ' para “' + $('#busqueda').value.trim() + '”' : '') + (generoSeleccionado !== 'Todos' ? ' · ' + generoSeleccionado : ' · Elegí tu próxima lectura');
  if (autorSeleccionado) $('#cantidad-resultados').textContent += ' · ' + autorSeleccionado;
  grilla.replaceChildren();
  grilla.className = resultados.length ? 'catalogo__grilla' : 'catalogo__vacio';
  if (resultados.length) resultados.forEach(libro => grilla.append(tarjeta(libro)));
  else {
    const limpiar = elemento('button', 'boton boton--secundario', 'Ver todos los libros');
    limpiar.addEventListener('click', () => {
      $('#busqueda').value = '';
      generoSeleccionado = 'Todos';
      if (autorSeleccionado) navegar('#catalogo');
      else renderizar();
    });
    grilla.append(elemento('h2', 'seccion__titulo', 'No encontramos esa historia'), elemento('p', '', 'Probá con otro título o quitá alguno de los filtros.'), limpiar);
  }
}
function vistaGeneros() {
  const vista = elemento('section', 'vista generos');
  vista.append(encabezado('¿A dónde querés viajar?', 'Elegí un género y dejate llevar por sus historias.', 'Explorá por género'));
  const grilla = elemento('div', 'generos__grilla');
  generos.forEach(genero => {
    const boton = elemento('button', 'genero');
    const cantidad = libros.filter(libro => libro.genero === genero).length;
    boton.append(icono(genero === 'Romance' ? 'corazon' : genero === 'Fantasía' ? 'destello' : 'libro'), elemento('strong', '', genero), elemento('span', '', cantidad + (cantidad === 1 ? ' historia por descubrir →' : ' historias por descubrir →')));
    boton.addEventListener('click', () => { generoSeleccionado = genero; $('#busqueda').value = ''; navegar('#catalogo'); });
    grilla.append(boton);
  });
  vista.append(grilla);
  contenido.append(vista);
}
function vistaDetalle(libro) {
  const vista = elemento('section', 'vista detalle');
  vista.append(botonVolver());
  const cuerpo = elemento('div', 'detalle__cuerpo');
  const datos = elemento('div', 'detalle__datos');
  const agregar = elemento('button', 'boton', 'Agregar al carrito');
  agregar.append(icono('bolsa'));
  agregar.addEventListener('click', () => notificar('“' + libro.titulo + '” agregado al carrito de demostración.'));
  datos.append(elemento('p', 'vista__etiqueta', 'Tu próxima lectura'), titulo(libro.titulo), elemento('p', 'detalle__autor', 'Por ' + libro.autor), elemento('span', 'detalle__genero', libro.genero), elemento('p', 'detalle__precio', precio(libro.precio)), elemento('p', 'detalle__descripcion', libro.descripcion), agregar, elemento('p', 'detalle__nota', 'Compra simulada · No se realizará ningún cobro'));
  cuerpo.append(tapa(libro, 'detalle__tapa', 'eager'), datos);
  vista.append(cuerpo);
  contenido.append(vista);
}
function campo(formulario, id, etiqueta, tipo, autocompletar) {
  const grupo = elemento('div', 'formulario__campo');
  const label = elemento('label', '', etiqueta);
  label.htmlFor = id;
  const input = elemento('input');
  input.id = id;
  input.name = id;
  input.type = tipo;
  input.required = true;
  input.autocomplete = autocompletar;
  input.maxLength = tipo === 'password' ? 128 : 120;
  input.setAttribute('aria-describedby', id + '-error');
  const error = elemento('p', 'formulario__error');
  error.id = id + '-error';
  grupo.append(label, input, error);
  formulario.append(grupo);
  input.addEventListener('input', () => {
    input.removeAttribute('aria-invalid');
    error.textContent = '';
  });
  return input;
}
function vistaAcceso() {
  const vista = elemento('section', 'vista acceso');
  const historia = elemento('div', 'acceso__historia');
  historia.append(icono('libro'), elemento('h2', '', 'Las mejores historias empiezan con un encuentro.'), elemento('p', '', 'Este es tu rincón para descubrir, imaginar y encontrar tu próxima lectura. Bienvenido a Editorial Codex.'));
  if (usuario && !modoRegistro) {
    const perfil = elemento('section', 'formulario');
    const cerrar = elemento('button', 'boton boton--secundario', 'Cerrar sesión');
    cerrar.addEventListener('click', cerrarSesion);
    perfil.append(titulo('Hola, ' + usuario.nombre), elemento('p', 'formulario__intro', usuario.email), elemento('p', 'formulario__nota', 'Tu sesión es una demostración y termina al recargar la página.'), enlace('Seguir explorando', '#catalogo', 'boton', 'flecha'), cerrar);
    vista.append(historia, perfil);
    contenido.append(vista);
    return;
  }
  const formulario = elemento('form', 'formulario');
  formulario.noValidate = true;
  formulario.append(titulo(modoRegistro ? 'Creá tu cuenta' : 'Qué bueno verte'), elemento('p', 'formulario__intro', modoRegistro ? 'Un nuevo capítulo empieza acá.' : 'Ingresá a tu espacio de lectura.'));
  if (modoRegistro) campo(formulario, 'nombre', 'Nombre completo', 'text', 'name');
  campo(formulario, 'email', 'Correo electrónico', 'email', 'email');
  const clave = campo(formulario, 'clave', 'Contraseña', 'password', modoRegistro ? 'new-password' : 'current-password');
  clave.minLength = 8;
  if (modoRegistro) campo(formulario, 'repetir', 'Repetir contraseña', 'password', 'new-password');
  const nota = elemento('p', 'formulario__nota', 'Demo: usá un email válido y una contraseña ficticia de al menos 8 caracteres. No se guarda ni se envía.');
  nota.id = 'ayuda-clave';
  clave.setAttribute('aria-describedby', 'clave-error ayuda-clave');
  formulario.append(nota);
  const enviar = elemento('button', 'boton', modoRegistro ? 'Crear cuenta' : 'Ingresar');
  enviar.type = 'submit';
  enviar.append(icono('flecha'));
  const alternar = elemento('p', 'formulario__alternar', modoRegistro ? '¿Ya tenés cuenta? ' : '¿Nuevo por acá? ');
  alternar.append(enlace(modoRegistro ? 'Ingresá' : 'Creá tu cuenta', modoRegistro ? '#ingresar' : '#registro', 'enlace'));
  formulario.append(enviar, alternar);
  formulario.addEventListener('submit', validarAcceso);
  vista.append(historia, formulario);
  contenido.append(vista);
}
function validarAcceso(evento) {
  evento.preventDefault();
  const formulario = evento.currentTarget;
  const email = formulario.elements.email;
  const clave = formulario.elements.clave;
  let primero = null;
  function error(input, mensaje) {
    input.setAttribute('aria-invalid', mensaje ? 'true' : 'false');
    $('#' + input.id + '-error').textContent = mensaje;
    if (mensaje && !primero) primero = input;
  }
  if (modoRegistro) {
    const nombre = formulario.elements.nombre;
    error(nombre, nombre.value.trim().split(/\s+/).length < 2 || nombre.value.trim().length < 3 ? 'Ingresá tu nombre y apellido.' : '');
  }
  email.value = email.value.trim();
  error(email, !email.value || !email.validity.valid || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value) ? 'Ingresá un correo válido, por ejemplo lector@correo.com.' : '');
  error(clave, clave.value.length < 8 || !clave.value.trim() ? 'Usá una contraseña ficticia de al menos 8 caracteres.' : '');
  if (modoRegistro) error(formulario.elements.repetir, !formulario.elements.repetir.value || formulario.elements.repetir.value !== clave.value ? 'Las contraseñas deben coincidir.' : '');
  if (primero) {
    primero.focus();
    notificar('Hay campos por corregir. Revisá los mensajes del formulario.', 'error');
    return;
  }
  const nombre = modoRegistro ? formulario.elements.nombre.value.trim().replace(/\s+/g, ' ') : email.value.split('@')[0].replace(/[._-]+/g, ' ');
  usuario = { nombre: nombre.charAt(0).toLocaleUpperCase('es-AR') + nombre.slice(1), email: email.value };
  // No se conserva la contraseña ni se simula una base de cuentas.
  formulario.reset();
  actualizarUsuario();
  notificar(modoRegistro ? 'Cuenta de demostración creada. ¡Bienvenido, ' + usuario.nombre + '!' : 'Ingresaste a la demo. ¡Bienvenido, ' + usuario.nombre + '!');
  navegar('#inicio');
}
function actualizarUsuario() {
  $('#nombre-usuario').textContent = usuario ? usuario.nombre : 'Lector invitado';
  $('#estado-usuario').textContent = usuario ? 'Sesión de demostración' : 'Tu próxima lectura está acá';
  $('#avatar').textContent = usuario ? usuario.nombre[0].toUpperCase() : 'L';
  $('#boton-usuario').setAttribute('aria-label', 'Abrir menú de ' + (usuario ? usuario.nombre : 'lector invitado'));
}
function cerrarSesion() {
  usuario = null;
  modoRegistro = false;
  actualizarUsuario();
  cerrarMenuUsuario();
  notificar('Sesión de demostración cerrada. ¡Hasta tu próxima lectura!');
  if (location.hash === '#ingresar') renderizar();
  else navegar('#ingresar');
}
function cerrarMenuUsuario(devolverFoco = false) {
  $('#menu-usuario').hidden = true;
  $('#boton-usuario').setAttribute('aria-expanded', 'false');
  if (devolverFoco) $('#boton-usuario').focus();
}
function cambiarMenu(abrir, devolverFoco = true) {
  menuAbierto = abrir && movil.matches;
  aplicacion.classList.toggle('aplicacion--menu-abierto', menuAbierto);
  document.body.classList.toggle('pagina--menu-abierto', menuAbierto);
  $('#velo').hidden = !menuAbierto;
  $('#abrir-menu').setAttribute('aria-expanded', String(menuAbierto));
  $('#principal').inert = menuAbierto;
  $('.marca').inert = menuAbierto;
  $('.salto').inert = menuAbierto;
  lateral.inert = movil.matches && !menuAbierto;
  if (menuAbierto) {
    lateral.setAttribute('role', 'dialog');
    lateral.setAttribute('aria-modal', 'true');
    $('#cerrar-menu').focus();
  } else {
    lateral.removeAttribute('role');
    lateral.removeAttribute('aria-modal');
    cerrarMenuUsuario();
    if (devolverFoco && movil.matches) $('#abrir-menu').focus();
  }
}
function renderizar(opciones = {}) {
  const hashActual = location.hash || '#inicio';
  const [ruta, consultaRuta = ''] = hashActual.split('?');
  if (ruta === '#contenido') { contenido.focus(); return; }
  if (!estadoInterno()) marcarEntrada(0);
  if (ruta === '#catalogo') {
    const autorRuta = new URLSearchParams(consultaRuta).get('autor');
    autorSeleccionado = escritores.some(escritor => escritor.nombre === autorRuta) ? autorRuta : '';
  }
  cambiarMenu(false, false);
  cerrarMenuUsuario();
  limpiezasCarruseles.splice(0).forEach(limpiar => limpiar());
  contenido.replaceChildren();
  let activa = ruta.slice(1);
  if (ruta === '#inicio' || ruta === '') vistaInicio();
  else if (ruta === '#catalogo') vistaCatalogo();
  else if (ruta === '#generos') vistaGeneros();
  else if (ruta === '#escritores') vistaEscritores();
  else if (ruta === '#escritor') {
    activa = 'escritores';
    const nombre = new URLSearchParams(consultaRuta).get('autor');
    const escritor = escritores.find(item => item.nombre === nombre);
    if (escritor) vistaDetalleEscritor(escritor);
    else {
      const vista = elemento('section', 'vista');
      vista.append(botonVolver(), encabezado('Escritor no encontrado', 'Explorá los escritores de nuestro catálogo.', 'Escritores'), enlace('Ver escritores', '#escritores'));
      contenido.append(vista);
    }
  }
  else if (ruta === '#ingresar' || ruta === '#registro') { modoRegistro = ruta === '#registro'; activa = 'ingresar'; vistaAcceso(); }
  else if (ruta.startsWith('#libro-')) {
    activa = 'catalogo';
    const libro = libros.find(item => '#libro-' + item.id === ruta);
    if (libro) vistaDetalle(libro);
    else {
      const vista = elemento('section', 'vista');
      vista.append(encabezado('Este libro no está disponible', 'Podés encontrar otras historias en nuestro catálogo.', 'Libro no encontrado'), enlace('Volver al catálogo', '#catalogo'));
      contenido.append(vista);
    }
  } else { activa = 'inicio'; vistaInicio(); }
  if (activa === 'ingresar') {
    const inicio = elemento('a', 'regreso-inicio');
    inicio.href = '#inicio';
    inicio.append(icono('flecha'), document.createTextNode('Inicio'));
    contenido.querySelector('.formulario').prepend(inicio);
  } else if (activa !== 'inicio') {
    let pasos = [['Inicio', '#inicio']];
    if (ruta === '#catalogo' && autorSeleccionado) pasos.push(['Escritores', '#escritores'], [autorSeleccionado, '#escritor?autor=' + encodeURIComponent(autorSeleccionado)], ['Libros']);
    else if (ruta.startsWith('#libro-')) pasos.push(['Catálogo', '#catalogo'], [libros.find(libro => '#libro-' + libro.id === ruta)?.titulo || 'Libro no encontrado']);
    else if (ruta === '#escritor') pasos.push(['Escritores', '#escritores'], [escritores.find(escritor => escritor.nombre === new URLSearchParams(consultaRuta).get('autor'))?.nombre || 'Escritor no encontrado']);
    else pasos.push([{ catalogo: 'Catálogo', escritores: 'Escritores', generos: 'Géneros', ingresar: modoRegistro ? 'Registro' : (usuario ? 'Mi cuenta' : 'Iniciar sesión') }[activa]]);
    const nav = rutaNavegacion(pasos);
    contenido.querySelector('.vista').prepend(nav);
  }
  document.querySelectorAll('.navegacion__enlace').forEach(link => {
    const seleccionado = link.dataset.vista === activa;
    link.classList.toggle('navegacion__enlace--activo', seleccionado);
    if (seleccionado) link.setAttribute('aria-current', 'page'); else link.removeAttribute('aria-current');
  });
  $('#ruta').textContent = { inicio: 'Tu espacio de lectura', catalogo: 'Biblioteca / Catálogo', generos: 'Biblioteca / Géneros', escritores: 'Biblioteca / Escritores', ingresar: 'Tu espacio / Mi cuenta' }[activa] || 'Tu espacio de lectura';
  const h1 = contenido.querySelector('h1');
  document.title = (h1 ? h1.textContent : 'Inicio') + ' · Editorial Codex';
  if (opciones.foco !== false && h1) h1.focus({ preventScroll: true });
  if (opciones.desplazar !== false) window.scrollTo({ top: 0, behavior: 'instant' });
  rutaAnterior = hashActual;
  entradaRenderizada = estadoInterno().id;
}
function aplicarTema(tema) {
  document.documentElement.dataset.tema = tema;
  $('#tema').setAttribute('aria-label', tema === 'claro' ? 'Activar tema oscuro' : 'Activar tema claro');
  $('#tema').setAttribute('aria-pressed', String(tema === 'claro'));
}
function aplicarColapso(colapsada) {
  aplicacion.classList.toggle('aplicacion--colapsada', colapsada);
  $('#colapsar').setAttribute('aria-expanded', String(!colapsada));
  $('#colapsar').setAttribute('aria-label', colapsada ? 'Expandir menú lateral' : 'Colapsar menú lateral');
}
$('#tema').addEventListener('click', () => {
  const tema = document.documentElement.dataset.tema === 'claro' ? 'oscuro' : 'claro';
  aplicarTema(tema);
  guardarPreferencia('tema', tema);
});
$('#colapsar').addEventListener('click', () => {
  const colapsada = !aplicacion.classList.contains('aplicacion--colapsada');
  aplicarColapso(colapsada);
  guardarPreferencia('menu', colapsada ? 'colapsado' : 'expandido');
});
$('#abrir-menu').addEventListener('click', () => cambiarMenu(true));
$('#cerrar-menu').addEventListener('click', () => cambiarMenu(false));
$('#velo').addEventListener('click', () => cambiarMenu(false));
movil.addEventListener('change', () => cambiarMenu(false, false));
lateral.addEventListener('click', evento => {
  const link = evento.target.closest('a');
  if (link && menuAbierto) {
    cambiarMenu(false, false);
    if (link.hash === location.hash || (!location.hash && link.hash === '#inicio')) contenido.querySelector('h1')?.focus();
  }
});
$('#boton-usuario').addEventListener('click', () => {
  const menu = $('#menu-usuario');
  menu.hidden = !menu.hidden;
  $('#boton-usuario').setAttribute('aria-expanded', String(!menu.hidden));
  if (!menu.hidden) $('#perfil').focus();
});
$('#perfil').addEventListener('click', () => {
  cerrarMenuUsuario();
  cambiarMenu(false, false);
  if (location.hash === '#ingresar') renderizar(); else navegar('#ingresar');
});
$('#salir').addEventListener('click', () => {
  if (usuario) cerrarSesion();
  else { cerrarMenuUsuario(true); notificar('Todavía no hay una sesión iniciada.', 'error'); }
});
document.addEventListener('click', evento => {
  if (!evento.target.closest('.usuario')) cerrarMenuUsuario();
});
document.addEventListener('focusin', evento => {
  if (!evento.target.closest('.usuario')) cerrarMenuUsuario();
});
document.addEventListener('keydown', evento => {
  if (evento.key === 'Escape') {
    if (!$('#menu-usuario').hidden) cerrarMenuUsuario(true);
    else if (menuAbierto) cambiarMenu(false);
  }
  if (evento.key === 'Tab' && menuAbierto) {
    const enfocados = [...lateral.querySelectorAll('a, button')].filter(nodo => !nodo.closest('[hidden]') && nodo.getClientRects().length);
    const primero = enfocados[0];
    const ultimo = enfocados[enfocados.length - 1];
    if (evento.shiftKey && document.activeElement === primero) { evento.preventDefault(); ultimo.focus(); }
    else if (!evento.shiftKey && document.activeElement === ultimo) { evento.preventDefault(); primero.focus(); }
  }
});
$('#busqueda').addEventListener('input', () => {
  if (location.hash.split('?')[0] === '#catalogo') actualizarCatalogo();
  else {
    // Render inmediato sin robar el foco del buscador; hashchange evita duplicarlo.
    navegar('#catalogo', { foco: false, desplazar: false });
  }
});
$('#form-buscar').addEventListener('submit', evento => {
  evento.preventDefault();
  if (location.hash.split('?')[0] !== '#catalogo') navegar('#catalogo');
  else { actualizarCatalogo(); contenido.querySelector('h1').focus(); }
});
$('.salto').addEventListener('click', evento => { evento.preventDefault(); contenido.focus(); });
// Todos los enlaces internos comparten entradas identificadas del mismo documento.
document.addEventListener('click', evento => {
  if (evento.defaultPrevented || evento.button !== 0 || evento.ctrlKey || evento.metaKey || evento.shiftKey || evento.altKey) return;
  const link = evento.target.closest('a[href]');
  const destino = link?.getAttribute('href');
  if (!destino?.startsWith('#') || destino === '#contenido' || (link.target && link.target !== '_self') || link.hasAttribute('download')) return;
  evento.preventDefault();
  navegar(destino);
});
function sincronizarRuta() {
  const hash = location.hash || '#inicio';
  let entrada = estadoInterno();
  if (!entrada) entrada = marcarEntrada(0);
  // Una navegación hash nativa puede copiar el estado de la entrada anterior.
  else if (entrada.id === entradaRenderizada && hash !== rutaAnterior) entrada = marcarEntrada(entrada.indice + 1);
  if (entrada.id === entradaRenderizada && hash === rutaAnterior) return;
  renderizar();
}
window.addEventListener('popstate', sincronizarRuta);
window.addEventListener('hashchange', sincronizarRuta);
aplicarTema(leerPreferencia('tema', 'oscuro') === 'claro' ? 'claro' : 'oscuro');
aplicarColapso(leerPreferencia('menu', 'expandido') === 'colapsado');
actualizarUsuario();
renderizar();

