/* ═══════════════════════════════════════════════════════════════
   POKÉMON CHAMPIONS PROJECT — app.js
   Desarrollado por Dakson Gutiérrez
═══════════════════════════════════════════════════════════════ */
'use strict';

const API = 'https://pokeapi.co/api/v2';

const GENERACIONES = [
  { gen:1, inicio:1,   fin:151  },
  { gen:2, inicio:152, fin:251  },
  { gen:3, inicio:252, fin:386  },
  { gen:4, inicio:387, fin:493  },
  { gen:5, inicio:494, fin:649  },
  { gen:6, inicio:650, fin:721  },
  { gen:7, inicio:722, fin:809  },
  { gen:8, inicio:810, fin:905  },
  { gen:9, inicio:906, fin:1025 }
];

const TIPOS_ES = {
  normal:'Normal', fire:'Fuego', water:'Agua', electric:'Eléctrico',
  grass:'Planta', ice:'Hielo', fighting:'Lucha', poison:'Veneno',
  ground:'Tierra', flying:'Volador', psychic:'Psíquico', bug:'Bicho',
  rock:'Roca', ghost:'Fantasma', dragon:'Dragón', dark:'Siniestro',
  steel:'Acero', fairy:'Hada'
};

const STATS_ES = {
  hp:'PS', attack:'Ataque', defense:'Defensa',
  'special-attack':'At. Esp.', 'special-defense':'Def. Esp.', speed:'Velocidad'
};

const STAT_COLOR = {
  hp:'#ef4444', attack:'#f97316', defense:'#eab308',
  'special-attack':'#3b82f6', 'special-defense':'#22c55e', speed:'#a855f7'
};

const MULT = {
  normal:   {rock:0.5,ghost:0,steel:0.5},
  fire:     {fire:0.5,water:0.5,grass:2,ice:2,bug:2,rock:0.5,dragon:0.5,steel:2},
  water:    {fire:2,water:0.5,grass:0.5,ground:2,rock:2,dragon:0.5},
  electric: {water:2,electric:0.5,grass:0.5,ground:0,flying:2,dragon:0.5},
  grass:    {fire:0.5,water:2,grass:0.5,poison:0.5,ground:2,flying:0.5,bug:0.5,rock:2,dragon:0.5,steel:0.5},
  ice:      {water:0.5,grass:2,ice:0.5,ground:2,flying:2,dragon:2,steel:0.5},
  fighting: {normal:2,ice:2,poison:0.5,flying:0.5,psychic:0.5,bug:0.5,rock:2,ghost:0,dark:2,steel:2,fairy:0.5},
  poison:   {grass:2,poison:0.5,ground:0.5,rock:0.5,ghost:0.5,steel:0,fairy:2},
  ground:   {fire:2,electric:2,grass:0.5,poison:2,flying:0,bug:0.5,rock:2,steel:2},
  flying:   {electric:0.5,grass:2,fighting:2,bug:2,rock:0.5,steel:0.5},
  psychic:  {fighting:2,poison:2,psychic:0.5,dark:0,steel:0.5},
  bug:      {fire:0.5,grass:2,fighting:0.5,poison:0.5,flying:0.5,psychic:2,ghost:0.5,dark:2,steel:0.5,fairy:0.5},
  rock:     {fire:2,ice:2,fighting:0.5,ground:0.5,flying:2,bug:2,steel:0.5},
  ghost:    {normal:0,psychic:2,ghost:2,dark:0.5},
  dragon:   {dragon:2,steel:0.5,fairy:0},
  dark:     {fighting:0.5,psychic:2,ghost:2,dark:0.5,fairy:0.5},
  steel:    {fire:0.5,water:0.5,electric:0.5,ice:2,rock:2,steel:0.5,fairy:2},
  fairy:    {fire:0.5,fighting:2,poison:0.5,dragon:2,dark:2,steel:0.5}
};

const TODOS_TIPOS = Object.keys(TIPOS_ES);

// ── ICONOS SVG POR TIPO (estilo oficial, sin texto) ────────────
// Cada icono es un SVG minimalista trazado a mano, currentColor
// para heredar el color del badge. viewBox 0 0 24 24.
const TIPO_ICONOS = {
  normal:   '<circle cx="12" cy="12" r="6" fill="none" stroke="currentColor" stroke-width="2.4"/>',
  fire:     '<path d="M12 2c1 3-2 4-2 7a3 3 0 1 0 6 0c0-1-.5-2-1-2 1.5 2 1 4-.5 5.5C16 14 17 12 17 10c2 2 3 5 1.5 8C17 21 14.5 22 12 22 8 22 5 19 5 15c0-3 2-5 3-7 1-2 1.5-4 4-6z" fill="currentColor"/>',
  water:    '<path d="M12 2c3 5 7 9 7 13.5A7 7 0 0 1 5 15.5C5 11 9 7 12 2z" fill="currentColor"/>',
  electric: '<path d="M13 2 4 14h6l-1 8 9-12h-6l1-8z" fill="currentColor"/>',
  grass:    '<path d="M12 22V11M12 11C12 6 8 4 4 4c0 5 2.5 8.5 8 7zM12 11c0-4 3-7 8-8 0 4.5-2 8.5-8 8z" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
  ice:      '<path d="M12 2v20M4.5 6.5l15 11M19.5 6.5l-15 11M12 2l-2.5 2.5M12 2l2.5 2.5M12 22l-2.5-2.5M12 22l2.5-2.5M4.5 6.5l3 .5M4.5 6.5l.5-3M19.5 6.5l-3 .5M19.5 6.5l-.5-3M4.5 17.5l3-.5M4.5 17.5l.5 3M19.5 17.5l-3-.5M19.5 17.5l-.5 3" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>',
  fighting: '<path d="M7 4v7a5 5 0 0 0 10 0V4M5 8h2M17 8h2M9 20l3-5 3 5" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>',
  poison:   '<path d="M12 2c4 3 7 6.5 7 11a7 7 0 1 1-14 0c0-4.5 3-8 7-11z" fill="currentColor"/><circle cx="12" cy="15" r="2.2" fill="var(--bg-tarjeta,#0a1929)"/>',
  ground:   '<path d="M3 14h18M3 18h18M7 14V9l5-5 5 5v5" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>',
  flying:   '<path d="M2 13c4-6 9-8 12-2 2-5 6-7 8-4-1 6-6 8-9 7 2 2 2 5-1 6-1-3-3-4-5-3 1-2 0-4-2-4-1 1-2 1-3 0z" fill="currentColor"/>',
  psychic:  '<circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="3" fill="currentColor"/>',
  bug:      '<path d="M12 8a4 4 0 0 1 4 4v5a4 4 0 0 1-8 0v-5a4 4 0 0 1 4-4zM12 8V5M9 6 7 4M15 6l2-2M8 13H4M20 13h-4M8 17l-3 2M16 17l3 2" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>',
  rock:     '<path d="M5 16 9 6h6l4 10-3 4H8z" fill="currentColor"/>',
  ghost:    '<path d="M5 21V11a7 7 0 0 1 14 0v10l-2.5-2-2 2-2.5-2-2 2-2.5-2z" fill="currentColor"/><circle cx="9.5" cy="11" r="1.3" fill="var(--bg-tarjeta,#0a1929)"/><circle cx="14.5" cy="11" r="1.3" fill="var(--bg-tarjeta,#0a1929)"/>',
  dragon:   '<path d="M3 11c4-2 6 1 6 3 2-5 6-7 12-6-2 2-3 4-2 6-3-1-5 0-6 2 3 0 5 1 6 4-5 1-9-1-10-5-2 1-3 3-2 6-4-2-5-6-4-10z" fill="currentColor"/>',
  dark:     '<path d="M19 13a7 7 0 1 1-8-9 6 6 0 1 0 8 9z" fill="currentColor"/>',
  steel:    '<path d="m12 2 8 4.5v9L12 20l-8-4.5v-9z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><circle cx="12" cy="11" r="2.6" fill="currentColor"/>',
  fairy:    '<path d="M12 2c1 3 0 5-2 6 2-1 4-1 6 0-2 1-3 3-2 6-1-3-3-4-6-3 2-1 3-3 2-6 1 3 3 4 6 3-2 1-3 3-2 6" fill="currentColor"/>'
};

// ── Helper: devuelve el SVG completo de un tipo con tamaño dado
function iconoTipo(tipo, size = 14) {
  const path = TIPO_ICONOS[tipo] || TIPO_ICONOS.normal;
  return `<svg class="tipo-icono" width="${size}" height="${size}" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">${path}</svg>`;
}

// ── Helper: badge completo de tipo (icono + nombre), reemplaza
//    al patrón repetido `<span class="tipo-badge tipo-X">Nombre</span>`
//    extraClass: clases CSS adicionales | extraAttrs: atributos HTML extra (style, title)
function badgeTipo(tipo, extraClass = '', extraAttrs = '', extraText = '') {
  const size = extraAttrs.includes('font-size:7') ? 9 : extraAttrs.includes('font-size:8') ? 10 : 12;
  return `<span class="tipo-badge tipo-${tipo} ${extraClass}" ${extraAttrs}>${iconoTipo(tipo, size)}<span>${TIPOS_ES[tipo] || tipo}${extraText}</span></span>`;
}
const estado = {
  pokemonCache: [],
  pokemonFiltrado: [],
  cargando: false,
  cargadoCompleto: false,
  filtroTipo: '',
  filtroGen: '',
  filtroBusqueda: ''
};

// ── NAVEGACIÓN ────────────────────────────────────────────────
// (función navegarA completa y consolidada definida más abajo,
//  junto al módulo de Constructor de Equipo, donde incluye
//  todos los casos: pokedex, equipo y cobertura)

// ── MODO OSCURO ───────────────────────────────────────────────
function toggleModo() {
  document.body.classList.toggle('modo-claro');
  const ico = document.querySelector('#btnModoOscuro i');
  ico.className = document.body.classList.contains('modo-claro') ? 'ti ti-sun' : 'ti ti-moon';
}
document.getElementById('btnModoOscuro').addEventListener('click', toggleModo);

// ── POKÉDEX: CARGA TODOS LOS POKÉMON ─────────────────────────
async function cargarTodosLosPokemon() {
  if (estado.cargando) return;
  estado.cargando = true;

  const grid = document.getElementById('pokemonGrid');
  grid.innerHTML = `<div class="cargando"><div class="pokeball-spin"></div><p>Cargando Pokédex completa...</p></div>`;

  try {
    // Obtener lista completa de 1025 Pokémon
    const res  = await fetch(`${API}/pokemon?limit=1025&offset=0`);
    const data = await res.json();

    // Carga en lotes de 30 para mostrar progreso
    const LOTE = 30;
    const todos = [];

    for (let i = 0; i < data.results.length; i += LOTE) {
      const lote = data.results.slice(i, i + LOTE);
      const resultados = await Promise.all(
        lote.map(p => fetch(p.url).then(r => r.json()).catch(() => null))
      );
      const validos = resultados.filter(Boolean);
      todos.push(...validos);
      estado.pokemonCache = [...todos];
      estado.pokemonFiltrado = [...todos];

      // Actualizar progreso en pantalla
      const pct = Math.round((todos.length / 1025) * 100);
      grid.innerHTML = `<div class="cargando">
        <div class="pokeball-spin"></div>
        <p>Cargando Pokédex... ${todos.length}/1025 (${pct}%)</p>
      </div>`;
    }

    estado.cargadoCompleto = true;
    estado.cargando = false;
    renderizarGrid(estado.pokemonCache);

  } catch (err) {
    estado.cargando = false;
    grid.innerHTML = `<div class="cargando"><p>⚠️ Error al cargar. Verifica tu conexión.</p></div>`;
    console.error('Error:', err);
  }
}

// ── POKÉDEX: RENDERIZAR GRID ──────────────────────────────────
function renderizarGrid(lista) {
  const grid = document.getElementById('pokemonGrid');
  if (!lista.length) {
    grid.innerHTML = `<div class="cargando"><p>No se encontraron Pokémon.</p></div>`;
    return;
  }
  grid.innerHTML = lista.map(p => crearTarjetaHTML(p)).join('');
}

function crearTarjetaHTML(p) {
  const num    = String(p.id).padStart(3, '0');
  const nombre = p.name.charAt(0).toUpperCase() + p.name.slice(1);
  const tipos  = p.types.map(t =>
    `${badgeTipo(t.type.name)}`
  ).join('');
  return `
    <div class="pokemon-tarjeta" onclick="seleccionarPokemon(${p.id})" id="tarjeta-${p.id}">
      <span class="pokemon-tarjeta__numero">#${num}</span>
      <span class="pokemon-tarjeta__nombre">${nombre}</span>
      <div class="pokemon-tarjeta__tipos">${tipos}</div>
    </div>`;
}

// ── FILTROS ───────────────────────────────────────────────────
function buscarPokemon(termino) {
  estado.filtroBusqueda = termino.toLowerCase().trim();
  aplicarFiltros();
}

function filtrarPorTipo(tipo) {
  estado.filtroTipo = tipo;
  aplicarFiltros();
}

function filtrarPorGeneracion(gen) {
  estado.filtroGen = gen;
  aplicarFiltros();
}

function aplicarFiltros() {
  let lista = [...estado.pokemonCache];

  if (estado.filtroGen) {
    const g = GENERACIONES.find(g => g.gen === parseInt(estado.filtroGen));
    if (g) lista = lista.filter(p => p.id >= g.inicio && p.id <= g.fin);
  }

  if (estado.filtroTipo) {
    lista = lista.filter(p => p.types.some(t => t.type.name === estado.filtroTipo));
  }

  if (estado.filtroBusqueda) {
    lista = lista.filter(p =>
      p.name.toLowerCase().includes(estado.filtroBusqueda) ||
      String(p.id).includes(estado.filtroBusqueda)
    );
  }

  estado.pokemonFiltrado = lista;
  renderizarGrid(lista);
}

// ── DETALLE DE POKÉMON ────────────────────────────────────────
async function seleccionarPokemon(id) {
  document.querySelectorAll('.pokemon-tarjeta').forEach(t => t.classList.remove('seleccionado'));
  const tarjeta = document.getElementById(`tarjeta-${id}`);
  if (tarjeta) {
    tarjeta.classList.add('seleccionado');
    tarjeta.scrollIntoView({ block: 'nearest' });
  }

  const panel = document.getElementById('pokemonDetalle');
  panel.innerHTML = `<div class="detalle-vacio"><div class="pokeball-spin"></div><p>Cargando...</p></div>`;

  try {
    let pokemon = estado.pokemonCache.find(p => p.id === id);
    if (!pokemon) {
      pokemon = await fetch(`${API}/pokemon/${id}`).then(r => r.json());
    }
    const species = await fetch(`${API}/pokemon-species/${id}`).then(r => r.json());
    renderizarDetalle(pokemon, species);
  } catch (err) {
    panel.innerHTML = `<div class="detalle-vacio"><p>⚠️ Error al cargar detalles.</p></div>`;
  }
}

function renderizarDetalle(p, species) {
  const panel  = document.getElementById('pokemonDetalle');
  const num    = String(p.id).padStart(3, '0');
  const nombre = p.name.charAt(0).toUpperCase() + p.name.slice(1);
  const tipos  = p.types.map(t => t.type.name);

  // Descripción en español
  const entrada = species.flavor_text_entries?.find(e => e.language.name === 'es')
    || species.flavor_text_entries?.find(e => e.language.name === 'en')
    || { flavor_text: '' };
  const desc = entrada.flavor_text.replace(/\f|\n|\r/g, ' ');

  // Género
  const gr = species.gender_rate;
  const genero = gr === -1 ? 'Sin género'
    : gr === 0 ? '100% ♂'
    : gr === 8 ? '100% ♀'
    : `${(8-gr)*12.5}% ♂ / ${gr*12.5}% ♀`;

  const gen = species.generation?.name?.replace('generation-','Gen ').toUpperCase() || '?';

  // Sprites
  const imgArt   = p.sprites?.other?.['official-artwork']?.front_default || p.sprites?.front_default || '';
  const imgShiny = p.sprites?.other?.['official-artwork']?.front_shiny   || p.sprites?.front_shiny   || '';
  const sp1      = p.sprites?.front_default  || '';
  const sp2      = p.sprites?.front_shiny    || '';

  // Tipos badges
  const tiposBadge = tipos.map(t =>
    `${badgeTipo(t)}`
  ).join('');

  // Stats
  const totalStats = p.stats.reduce((a,s) => a+s.base_stat, 0);
  const statsHTML = p.stats.map(s => {
    const pct   = Math.min(100, Math.round(s.base_stat / 255 * 100));
    const color = STAT_COLOR[s.stat.name] || '#60a5fa';
    return `<div class="stat-barra">
      <span class="stat-barra__nombre">${STATS_ES[s.stat.name]||s.stat.name}</span>
      <span class="stat-barra__valor">${s.base_stat}</span>
      <div class="stat-barra__barra">
        <div class="stat-barra__fill" style="width:${pct}%;background:${color}"></div>
      </div>
    </div>`;
  }).join('');

  // Habilidades
  const habilHTML = p.abilities.map(a => {
    const nom = a.ability.name.replace(/-/g,' ');
    nom.charAt(0).toUpperCase() + nom.slice(1);
    return `<div class="habilidad-item">
      <span class="habilidad-item__nombre">${nom.charAt(0).toUpperCase()+nom.slice(1)}</span>
      ${a.is_hidden ? '<span class="habilidad-item__oculta">★ Oculta</span>' : ''}
    </div>`;
  }).join('');

  // Efectividades
  const efect  = calcularEfectividad(tipos);
  const efHTML = renderizarEfectividad(efect);

  // Categoría en español
  const categoria = species.genera?.find(g=>g.language.name==='es')?.genus || '';

  panel.innerHTML = `
    <div class="detalle-contenido">
      <div class="detalle-header">
        <img class="detalle-imagen-oficial" src="${imgArt}" alt="${nombre}" onerror="this.src='${sp1}'">
        <div class="detalle-numero">#${num} · ${gen}</div>
        <div class="detalle-nombre">${nombre}</div>
        <div class="detalle-tipos">${tiposBadge}</div>
        ${categoria ? `<div class="detalle-categoria">${categoria}</div>` : ''}
      </div>

      ${desc ? `<div class="detalle-seccion">
        <div class="detalle-seccion__titulo">Descripción</div>
        <p style="font-size:11px;color:var(--texto-secundario);line-height:1.7">${desc}</p>
      </div>` : ''}

      <div class="detalle-seccion">
        <div class="detalle-seccion__titulo">Información</div>
        <table class="info-tabla">
          <tr><td>Altura</td><td>${(p.height/10).toFixed(1)} m</td></tr>
          <tr><td>Peso</td><td>${(p.weight/10).toFixed(1)} kg</td></tr>
          <tr><td>Exp. base</td><td>${p.base_experience||'?'}</td></tr>
          <tr><td>Tasa captura</td><td>${species.capture_rate}</td></tr>
          <tr><td>Felicidad</td><td>${species.base_happiness??'?'}</td></tr>
          <tr><td>Género</td><td>${genero}</td></tr>
          <tr><td>Legendario</td><td>${species.is_legendary?'Sí ⭐':'No'}</td></tr>
          <tr><td>Mítico</td><td>${species.is_mythical?'Sí ✨':'No'}</td></tr>
          <tr><td>Grupos huevo</td><td>${species.egg_groups?.map(e=>e.name).join(', ')||'?'}</td></tr>
        </table>
      </div>

      <div class="detalle-seccion">
        <div class="detalle-seccion__titulo">Estadísticas base · Total: <strong style="color:#fff">${totalStats}</strong></div>
        ${statsHTML}
      </div>

      <div class="detalle-seccion">
        <div class="detalle-seccion__titulo">Sprites</div>
        <div class="sprites-row">
          ${sp1?`<div class="sprite-item"><img src="${sp1}" alt="Normal"><span>Normal</span></div>`:''}
          ${sp2?`<div class="sprite-item"><img src="${sp2}" alt="Shiny"><span>✨ Shiny</span></div>`:''}
          ${imgShiny&&imgShiny!==sp2?`<div class="sprite-item"><img src="${imgShiny}" alt="Art Shiny" style="width:60px;height:60px"><span>Arte Shiny</span></div>`:''}
        </div>
      </div>

      <div class="detalle-seccion">
        <div class="detalle-seccion__titulo">Habilidades</div>
        ${habilHTML}
      </div>

      <div class="detalle-seccion">
        <div class="detalle-seccion__titulo">Efectividad de tipos</div>
        ${efHTML}
      </div>
    </div>`;
}

// ── EFECTIVIDADES ─────────────────────────────────────────────
function calcularEfectividad(tiposDefensor) {
  const res = {};
  Object.keys(TIPOS_ES).forEach(atk => {
    let m = 1;
    tiposDefensor.forEach(def => {
      if (MULT[atk]?.[def] !== undefined) m *= MULT[atk][def];
    });
    res[atk] = m;
  });
  return res;
}

function renderizarEfectividad(efect) {
  const grupo = (lista, cls, etiqueta) => !lista.length ? '' : `
    <div style="margin-bottom:8px">
      <div style="font-size:9px;color:var(--texto-muted);letter-spacing:1px;text-transform:uppercase;margin-bottom:5px">${etiqueta}</div>
      <div style="display:flex;flex-wrap:wrap;gap:4px">
        ${lista.map(([t])=>badgeTipo(t, cls)).join('')}
      </div>
    </div>`;

  const x4  = Object.entries(efect).filter(([,m])=>m===4);
  const x2  = Object.entries(efect).filter(([,m])=>m===2);
  const x05 = Object.entries(efect).filter(([,m])=>m===0.5);
  const x025= Object.entries(efect).filter(([,m])=>m===0.25);
  const x0  = Object.entries(efect).filter(([,m])=>m===0);

  return grupo(x4, 'efect-badge--x4', '☠ Súper efectivo ×4')
       + grupo(x2, 'efect-badge--x2', '⚠ Súper efectivo ×2')
       + grupo(x05,'efect-badge--x05','🛡 Resistencia ×½')
       + grupo(x025,'efect-badge--x025','🛡 Resistencia ×¼')
       + grupo(x0, 'efect-badge--x0', '✋ Inmune ×0')
       || '<p style="font-size:11px;color:var(--texto-muted)">Efectividades normales para todos los tipos.</p>';
}

// ── INIT ──────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  navegarA('inicio');
  console.log('🎮 Pokémon Champions Project v1.0 — Dakson Gutiérrez');
});

/* ═══════════════════════════════════════════════════════════════
   CONSTRUCTOR DE EQUIPO
═══════════════════════════════════════════════════════════════ */

// Estado del equipo
const miEquipo = Array(6).fill(null);
let equipoFiltroGen = '';
let equipoBusqTermino = '';

// ── Inicializar el Constructor cuando se navega a él ─────────
// (la función navegarA central ya vive arriba; aquí solo se
//  documenta que esta sección depende de ella)

function navegarA(vista) {
  document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('activo'));
  const nav = document.querySelector(`[data-vista="${vista}"]`);
  if (nav) nav.classList.add('activo');
  document.querySelectorAll('.vista').forEach(v => v.classList.remove('activa'));
  const el = document.getElementById(`vista-${vista}`);
  if (el) el.classList.add('activa');

  if (vista === 'pokedex' && !estado.cargadoCompleto && !estado.cargando) {
    cargarTodosLosPokemon();
  }
  if (vista === 'equipo') {
    renderizarSlots();
    renderizarSelector();
  }
  if (vista === 'cobertura') {
    setTimeout(() => {
      if (cobRivalEstado.modoActivo === 'rival') {
        cobInicializarModoRival();
      } else {
        renderizarCobertura();
      }
    }, 50);
  }
}

// ── Renderizar los 6 slots del equipo ─────────────────────────
function renderizarSlots() {
  const grid    = document.getElementById('equipoSlotsGrid');
  const contador = document.getElementById('equipoContador');
  const ocupados = miEquipo.filter(Boolean).length;
  contador.textContent = `${ocupados} / 6`;

  grid.innerHTML = miEquipo.map((p, i) => {
    if (!p) return `
      <div class="equipo-slot-card vacio">
        <span class="equipo-slot__numero">${i + 1}</span>
        <i class="ti ti-plus"></i>
        <span style="font-size:10px;color:var(--texto-muted)">Vacío</span>
      </div>`;

    const tipos = p.types.map(t =>
      `${badgeTipo(t.type.name)}`
    ).join('');
    const sprite = p.sprites?.other?.['official-artwork']?.front_default
      || p.sprites?.front_default || '';

    return `
      <div class="equipo-slot-card ocupado">
        <span class="equipo-slot__numero">${i + 1}</span>
        <button class="equipo-slot__btn-quitar" onclick="quitarDelEquipo(${i})" title="Quitar">
          <i class="ti ti-x"></i>
        </button>
        ${sprite ? `<img class="equipo-slot__sprite" src="${sprite}" alt="${p.name}">` : ''}
        <span class="equipo-slot__nombre">${p.name.charAt(0).toUpperCase()+p.name.slice(1)}</span>
        <div class="equipo-slot__tipos">${tipos}</div>
      </div>`;
  }).join('');

  actualizarResumen();
  actualizarAlertas();
  actualizarUltimoEquipoInicio();
}

// ── Renderizar selector de Pokémon ────────────────────────────
function renderizarSelector() {
  const grid = document.getElementById('equipoSelectorGrid');
  if (!estado.cargadoCompleto) {
    grid.innerHTML = `<div class="cargando">
      <div class="pokeball-spin"></div>
      <p>Primero abre la <strong>Pokédex</strong> para cargar los Pokémon</p>
    </div>`;
    return;
  }

  let lista = [...estado.pokemonCache];

  if (equipoFiltroGen) {
    const g = GENERACIONES.find(g => g.gen === parseInt(equipoFiltroGen));
    if (g) lista = lista.filter(p => p.id >= g.inicio && p.id <= g.fin);
  }
  if (equipoBusqTermino) {
    lista = lista.filter(p =>
      p.name.toLowerCase().includes(equipoBusqTermino) ||
      String(p.id).includes(equipoBusqTermino)
    );
  }

  if (!lista.length) {
    grid.innerHTML = `<div class="cargando"><p>No se encontraron Pokémon.</p></div>`;
    return;
  }

  const enEquipo = miEquipo.filter(Boolean).map(p => p.id);

  grid.innerHTML = lista.map(p => {
    const num    = String(p.id).padStart(3,'0');
    const nombre = p.name.charAt(0).toUpperCase() + p.name.slice(1);
    const tipos  = p.types.map(t =>
      `${badgeTipo(t.type.name)}`
    ).join('');
    const yaEsta = enEquipo.includes(p.id);
    return `
      <div class="selector-tarjeta ${yaEsta ? 'en-equipo' : ''}"
           onclick="${yaEsta ? '' : `agregarAlEquipo(${p.id})`}"
           title="${yaEsta ? 'Ya está en tu equipo' : 'Agregar al equipo'}">
        <span class="selector-tarjeta__num">#${num}</span>
        <span class="selector-tarjeta__nombre">${nombre}</span>
        <div class="selector-tarjeta__tipos">${tipos}</div>
        ${yaEsta ? '<span style="font-size:8px;color:var(--amarillo)">✓ En equipo</span>' : ''}
      </div>`;
  }).join('');
}

// ── Agregar Pokémon al equipo ─────────────────────────────────
function agregarAlEquipo(id) {
  const pokemon = estado.pokemonCache.find(p => p.id === id);
  if (!pokemon) return;

  // Verificar si ya está
  if (miEquipo.some(p => p?.id === id)) {
    mostrarToast('⚠️ Este Pokémon ya está en tu equipo', 'err');
    return;
  }

  // Buscar slot vacío
  const slot = miEquipo.findIndex(p => p === null);
  if (slot === -1) {
    mostrarToast('🚫 El equipo está completo (máximo 6)', 'err');
    return;
  }

  miEquipo[slot] = pokemon;
  renderizarSlots();
  renderizarSelector();
  mostrarToast(`✅ ${pokemon.name.charAt(0).toUpperCase()+pokemon.name.slice(1)} agregado al equipo`,'ok');
}

// ── Quitar Pokémon del equipo ─────────────────────────────────
function quitarDelEquipo(slot) {
  const p = miEquipo[slot];
  if (!p) return;
  const nombre = p.name.charAt(0).toUpperCase() + p.name.slice(1);
  miEquipo[slot] = null;
  renderizarSlots();
  renderizarSelector();
  mostrarToast(`🗑 ${nombre} eliminado del equipo`, 'err');
}

// ── Limpiar todo el equipo ────────────────────────────────────
function limpiarEquipo() {
  miEquipo.fill(null);
  renderizarSlots();
  renderizarSelector();
  mostrarToast('🗑 Equipo limpiado', 'err');
}

// ── Guardar equipo en localStorage ───────────────────────────
function guardarEquipo() {
  const ocupados = miEquipo.filter(Boolean);
  if (!ocupados.length) {
    mostrarToast('⚠️ No hay Pokémon en tu equipo', 'err');
    return;
  }
  // Guardamos solo los IDs y nombres para no saturar localStorage
  const guardado = miEquipo.map(p => p ? { id: p.id, name: p.name, types: p.types, sprites: { front_default: p.sprites?.front_default, other: { 'official-artwork': { front_default: p.sprites?.other?.['official-artwork']?.front_default } } } } : null);
  localStorage.setItem('pcp_equipo', JSON.stringify(guardado));
  mostrarToast(`💾 Equipo guardado (${ocupados.length} Pokémon)`, 'ok');
}

// ── Cargar equipo desde localStorage ─────────────────────────
function cargarEquipoGuardado() {
  try {
    const guardado = JSON.parse(localStorage.getItem('pcp_equipo') || 'null');
    if (guardado && Array.isArray(guardado)) {
      guardado.forEach((p, i) => { miEquipo[i] = p; });
    }
  } catch (e) { /* ignorar */ }
}

// ── Actualizar resumen de tipos ───────────────────────────────
function actualizarResumen() {
  const contenedor = document.getElementById('equipoTiposResumen');
  const ocupados = miEquipo.filter(Boolean);
  if (!ocupados.length) {
    contenedor.innerHTML = '<span class="resumen-vacio">Sin Pokémon seleccionados</span>';
    return;
  }
  // Contar tipos
  const conteo = {};
  ocupados.forEach(p => {
    p.types.forEach(t => {
      conteo[t.type.name] = (conteo[t.type.name] || 0) + 1;
    });
  });
  contenedor.innerHTML = Object.entries(conteo)
    .sort((a,b) => b[1]-a[1])
    .map(([t, n]) =>
      `<span class="tipo-badge tipo-${t}" title="${n} Pokémon">${iconoTipo(t,12)}<span>${TIPOS_ES[t]||t} ${n>1?`×${n}`:''}</span></span>`
    ).join('');
}

// ── Alertas de cobertura ──────────────────────────────────────
function actualizarAlertas() {
  const contenedor = document.getElementById('equipoAlertas');
  const ocupados = miEquipo.filter(Boolean);
  contenedor.innerHTML = '';
  if (!ocupados.length) return;

  const alertas = [];

  // Pokémon duplicados por tipo
  const tipos = {};
  ocupados.forEach(p => {
    p.types.forEach(t => { tipos[t.type.name] = (tipos[t.type.name]||0)+1; });
  });
  const duplicados = Object.entries(tipos).filter(([,n])=>n>=3);
  if (duplicados.length) {
    duplicados.forEach(([t]) => {
      alertas.push({ tipo:'warn', icono:'ti-alert-triangle',
        msg:`Tienes 3+ Pokémon de tipo ${TIPOS_ES[t]||t}. Considera diversificar.` });
    });
  }

  // Equipo completo
  if (ocupados.length === 6) {
    alertas.push({ tipo:'ok', icono:'ti-circle-check',
      msg:'¡Equipo completo! Listo para el combate.' });
  } else {
    alertas.push({ tipo:'info', icono:'ti-info-circle',
      msg:`${6-ocupados.length} ranura${6-ocupados.length!==1?'s':''} disponible${6-ocupados.length!==1?'s':''}` });
  }

  contenedor.innerHTML = alertas.map(a => `
    <div class="alerta alerta--${a.tipo}">
      <i class="ti ${a.icono}"></i>
      <span>${a.msg}</span>
    </div>`).join('');
}

// ── Actualizar slots en inicio ────────────────────────────────
function actualizarUltimoEquipoInicio() {
  const container = document.getElementById('ultimoEquipo');
  if (!container) return;
  container.innerHTML = miEquipo.map((p, i) => {
    if (!p) return `<div class="equipo-slot vacio"><i class="ti ti-plus"></i></div>`;
    const sprite = p.sprites?.front_default || '';
    return `<div class="equipo-slot" title="${p.name}" onclick="navegarA('equipo')">
      ${sprite ? `<img src="${sprite}" alt="${p.name}" style="width:100%;height:100%;object-fit:contain">` : '❓'}
    </div>`;
  }).join('');
}

// ── Búsqueda y filtros del selector ──────────────────────────
function buscarParaEquipo(termino) {
  equipoBusqTermino = termino.toLowerCase().trim();
  renderizarSelector();
}

function filtrarEquipoPorGen(gen) {
  equipoFiltroGen = gen;
  renderizarSelector();
}

// ── Toast de notificación ─────────────────────────────────────
function mostrarToast(mensaje, tipo = 'ok') {
  const t = document.createElement('div');
  t.className = `toast toast--${tipo}`;
  t.innerHTML = mensaje;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 2600);
}

// ── Init: cargar equipo guardado al arrancar ──────────────────
document.addEventListener('DOMContentLoaded', () => {
  cargarEquipoGuardado();
  actualizarUltimoEquipoInicio();
});

/* ═══════════════════════════════════════════════════════════════
   MATRIZ DE DEBILIDADES
═══════════════════════════════════════════════════════════════ */
// (TODOS_TIPOS ya está definido al inicio del archivo)

function renderizarMatriz() {
  const ocupados = miEquipo.filter(Boolean);
  const sinEquipo  = document.getElementById('matrizSinEquipo');
  const conEquipo  = document.getElementById('matrizContenido');

  if (!ocupados.length) {
    sinEquipo.style.display  = 'flex';
    conEquipo.style.display  = 'none';
    return;
  }
  sinEquipo.style.display = 'none';
  conEquipo.style.display = 'flex';

  renderizarCabeceraEquipo(ocupados);
  renderizarTablaMatriz(ocupados);
  renderizarResumenMatriz(ocupados);
}

/* Cabecera con los Pokémon del equipo */
function renderizarCabeceraEquipo(ocupados) {
  const header = document.getElementById('matrizEquipoHeader');
  header.innerHTML = '<span style="font-size:10px;color:var(--texto-muted);letter-spacing:1px;text-transform:uppercase;margin-right:4px">Equipo:</span>'
    + ocupados.map(p => {
      const sprite = p.sprites?.front_default || '';
      const nombre = p.name.charAt(0).toUpperCase() + p.name.slice(1);
      const tipos  = p.types.map(t =>
        `${badgeTipo(t.type.name)}`
      ).join('');
      return `<div class="matriz-equipo-pokemon">
        ${sprite ? `<img src="${sprite}" alt="${nombre}">` : ''}
        <span>${nombre}</span>
        <div class="tipos-mini">${tipos}</div>
      </div>`;
    }).join('');
}

/* Tabla principal: filas=tipos atacantes, columnas=Pokémon del equipo */
function renderizarTablaMatriz(ocupados) {
  const tabla = document.getElementById('matrizTabla');

  // Encabezado: nombres de los Pokémon
  const encabezado = `<thead><tr>
    <th class="th-tipo">Tipo atacante</th>
    ${ocupados.map(p => {
      const nombre = p.name.charAt(0).toUpperCase() + p.name.slice(1);
      return `<th class="th-pokemon">${nombre}</th>`;
    }).join('')}
    <th class="th-tipo" style="text-align:center;color:var(--amarillo)">Promedio</th>
  </tr></thead>`;

  // Filas: un tipo atacante por fila
  const filas = TODOS_TIPOS.map(atkTipo => {
    const celdas = ocupados.map(p => {
      const tiposDefensor = p.types.map(t => t.type.name);
      const mult = calcularMultiplicador(atkTipo, tiposDefensor);
      return { mult, html: celdaHTML(mult) };
    });

    // Promedio del tipo contra el equipo
    const promedio = celdas.reduce((s, c) => s + c.mult, 0) / celdas.length;
    const promedioRedondeado = Math.round(promedio * 100) / 100;
    const promedioClass = promedio >= 2 ? 'celda-x2' : promedio >= 1.5 ? 'celda-x1'
      : promedio <= 0.25 ? 'celda-x025' : promedio < 1 ? 'celda-x05' : 'celda-x1';

    return `<tr>
      <td class="td-tipo">
        ${badgeTipo(atkTipo, "td-tipo-badge")}
      </td>
      ${celdas.map(c => c.html).join('')}
      <td class="${promedioClass}" style="font-size:10px;opacity:0.8">
        ${promedioRedondeado === 0 ? '✕' : promedioRedondeado + '×'}
      </td>
    </tr>`;
  }).join('');

  tabla.innerHTML = `${encabezado}<tbody>${filas}</tbody>`;
}

/* Celda con color y valor */
function celdaHTML(mult) {
  let cls = 'celda-x1', txt = '1×';
  if      (mult === 0)    { cls = 'celda-x0';   txt = '✕'; }
  else if (mult === 0.25) { cls = 'celda-x025'; txt = '¼×'; }
  else if (mult === 0.5)  { cls = 'celda-x05';  txt = '½×'; }
  else if (mult === 1)    { cls = 'celda-x1';   txt = ''; }
  else if (mult === 2)    { cls = 'celda-x2';   txt = '2×'; }
  else if (mult === 4)    { cls = 'celda-x4';   txt = '4×'; }
  return `<td class="${cls}" title="${mult}×">${txt}</td>`;
}

/* Calcular multiplicador de un tipo atacante vs tipos del defensor */
function calcularMultiplicador(atk, tiposDefensor) {
  let mult = 1;
  tiposDefensor.forEach(def => {
    if (MULT[atk]?.[def] !== undefined) mult *= MULT[atk][def];
  });
  return mult;
}

/* Resumen: debilidades comunes, inmunidades, resistencias */
function renderizarResumenMatriz(ocupados) {
  const container = document.getElementById('matrizResumenGrid');

  // Para cada tipo atacante, calcular cuántos Pokémon son débiles
  const debilidadesX4 = [], debilidadesX2 = [];
  const inmunidades = [], resistencias = [];

  TODOS_TIPOS.forEach(atk => {
    const mults = ocupados.map(p => calcularMultiplicador(atk, p.types.map(t=>t.type.name)));
    const debilesX4 = mults.filter(m => m >= 4).length;
    const debilesX2 = mults.filter(m => m === 2).length;
    const inmunesN  = mults.filter(m => m === 0).length;
    const resN      = mults.filter(m => m < 1 && m > 0).length;

    if (debilesX4 > 0) debilidadesX4.push({ tipo: atk, count: debilesX4 });
    else if (debilesX2 >= 2) debilidadesX2.push({ tipo: atk, count: debilesX2 });
    if (inmunesN > 0)  inmunidades.push({ tipo: atk, count: inmunesN });
    if (resN >= Math.ceil(ocupados.length / 2)) resistencias.push({ tipo: atk, count: resN });
  });

  const bloque = (titulo, icono, color, items, clsBadge, vacio) => `
    <div class="resumen-bloque">
      <div class="resumen-bloque__titulo">
        <i class="ti ${icono}" style="color:${color}"></i> ${titulo}
      </div>
      <div class="resumen-bloque__items">
        ${items.length
          ? items.sort((a,b)=>b.count-a.count).map(it => `
              <span class="resumen-badge ${clsBadge}">
                ${badgeTipo(it.tipo, "", 'style="font-size:8px;padding:1px 5px"')}
                <span>${it.count}/${ocupados.length}</span>
              </span>`).join('')
          : `<span class="resumen-vacio-txt">${vacio}</span>`
        }
      </div>
    </div>`;

  container.innerHTML =
    bloque('Puntos críticos', 'ti-alert-triangle', '#ef4444',
      [...debilidadesX4, ...debilidadesX2].slice(0,8),
      'rb-x2', '¡Sin debilidades graves!') +
    bloque('Inmunidades del equipo', 'ti-ban', '#6b7280',
      inmunidades, 'rb-x0', 'Sin inmunidades en el equipo') +
    bloque('Resistencias del equipo', 'ti-shield-check', '#3b82f6',
      resistencias, 'rb-res', 'Sin resistencias destacadas');
}

/* Override navegarA para activar matriz al entrar */
const _navegarABase = navegarA;
navegarA = function(vista) {
  _navegarABase(vista);
  if (vista === 'matriz') renderizarMatriz();
};

/* ═══════════════════════════════════════════════════════════════
   CALCULADORA DE DAÑO
   Fórmula Gen 9: ((2×Nivel/5+2) × Potencia × Atk/Def / 50 + 2)
   × Modificadores
═══════════════════════════════════════════════════════════════ */

// ── Estado de la calculadora ──────────────────────────────────
const calcEstado = {
  atacante: null,
  defensor: null
};

// ── Búsqueda de Pokémon para la calculadora ───────────────────
function calcBuscarPokemon(termino, lado) {
  const idSug = lado === 'atacante' ? 'calcAtacanteSugerencias' : 'calcDefensorSugerencias';
  const contSug = document.getElementById(idSug);

  if (!termino || termino.length < 2) {
    contSug.innerHTML = '';
    contSug.style.display = 'none';
    return;
  }

  if (!estado.cargadoCompleto) {
    contSug.innerHTML = '<div class="calc-sug-item calc-sug-item--info">Carga la Pokédex primero</div>';
    contSug.style.display = 'block';
    return;
  }

  const term = termino.toLowerCase().trim();
  const resultados = estado.pokemonCache
    .filter(p => p.name.toLowerCase().includes(term) || String(p.id).includes(term))
    .slice(0, 8);

  if (!resultados.length) {
    contSug.innerHTML = '<div class="calc-sug-item calc-sug-item--info">Sin resultados</div>';
    contSug.style.display = 'block';
    return;
  }

  contSug.innerHTML = resultados.map(p => {
    const nombre = p.name.charAt(0).toUpperCase() + p.name.slice(1);
    const sprite = p.sprites?.front_default || '';
    const num = String(p.id).padStart(3, '0');
    return `<div class="calc-sug-item" onclick="calcSeleccionarPokemon(${p.id},'${lado}')">
      ${sprite ? `<img src="${sprite}" alt="${nombre}">` : ''}
      <span class="calc-sug-num">#${num}</span>
      <span>${nombre}</span>
    </div>`;
  }).join('');
  contSug.style.display = 'block';
}

// ── Seleccionar Pokémon en la calculadora ─────────────────────
function calcSeleccionarPokemon(id, lado) {
  const pokemon = estado.pokemonCache.find(p => p.id === id);
  if (!pokemon) return;

  calcEstado[lado] = pokemon;

  // Cerrar sugerencias
  const idSug = lado === 'atacante' ? 'calcAtacanteSugerencias' : 'calcDefensorSugerencias';
  const idInput = lado === 'atacante' ? 'calcAtacanteInput' : 'calcDefensorInput';
  const idInfo = lado === 'atacante' ? 'calcAtacanteInfo' : 'calcDefensorInfo';
  document.getElementById(idSug).style.display = 'none';
  document.getElementById(idInput).value = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);

  // Renderizar info del Pokémon
  const panel = document.getElementById(idInfo);
  const imgArt = pokemon.sprites?.other?.['official-artwork']?.front_default || pokemon.sprites?.front_default || '';
  const tipos = pokemon.types.map(t =>
    `${badgeTipo(t.type.name)}`
  ).join('');
  const statsRelevantes = pokemon.stats.map(s => {
    const pct = Math.min(100, Math.round(s.base_stat / 255 * 100));
    const color = STAT_COLOR[s.stat.name] || '#60a5fa';
    return `<div class="calc-stat-mini">
      <span>${STATS_ES[s.stat.name] || s.stat.name}</span>
      <div class="calc-stat-barra"><div style="width:${pct}%;background:${color}"></div></div>
      <span>${s.base_stat}</span>
    </div>`;
  }).join('');

  panel.innerHTML = `
    <div class="calc-pokemon-card">
      <img src="${imgArt}" alt="${pokemon.name}" class="calc-pokemon-img">
      <div class="calc-pokemon-datos">
        <div class="calc-pokemon-nombre">${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</div>
        <div class="calc-pokemon-tipos">${tipos}</div>
        <div class="calc-stats-mini">${statsRelevantes}</div>
      </div>
    </div>`;
}

// ── Calcular stat efectivo (fórmula Gen 9) ────────────────────
function calcularStatEfectivo(statBase, ev, nivel, natMult) {
  // Fórmula: floor((2*base + 31 + floor(ev/4)) * nivel / 100 + 5) * nat
  // Usamos IV=31 siempre (máximo competitivo estándar)
  const iv = 31;
  const raw = Math.floor((2 * statBase + iv + Math.floor(ev / 4)) * nivel / 100 + 5);
  return Math.floor(raw * natMult);
}

function calcularPS(statBase, ev, nivel) {
  const iv = 31;
  return Math.floor((2 * statBase + iv + Math.floor(ev / 4)) * nivel / 100 + nivel + 10);
}

// ── Obtener multiplicador de naturaleza ───────────────────────
function natMultAtk(nat) {
  if (nat === 'atk+') return 1.1;
  if (nat === 'atk-') return 0.9;
  return 1.0;
}
function natMultSpa(nat) {
  if (nat === 'spa+') return 1.1;
  if (nat === 'spa-') return 0.9;
  return 1.0;
}
function natMultDef(nat) {
  if (nat === 'def+') return 1.1;
  if (nat === 'def-') return 0.9;
  return 1.0;
}
function natMultSpd(nat) {
  if (nat === 'spd+') return 1.1;
  if (nat === 'spd-') return 0.9;
  return 1.0;
}

// ── Calcular modificador de objeto del atacante ───────────────
function modObjetoAtacante(objeto, categoria) {
  if (objeto === 'banda-elegida' && categoria === 'fisico')    return 1.5;
  if (objeto === 'gafas-elegidas' && categoria === 'especial') return 1.5;
  if (objeto === 'vida-orbe')  return 1.3;
  if (objeto === 'faja-experto') return 1.0; // se aplica solo si es efectivo (lo manejamos aparte)
  return 1.0;
}

// ── Calcular modificador de clima ─────────────────────────────
function modClima(clima, tipoMov) {
  if (clima === 'sol')   { if (tipoMov === 'fire') return 1.5; if (tipoMov === 'water') return 0.5; }
  if (clima === 'lluvia'){ if (tipoMov === 'water') return 1.5; if (tipoMov === 'fire') return 0.5; }
  return 1.0;
}

// ── Calcular modificador de campo ─────────────────────────────
function modCampo(campo, tipoMov) {
  const mapa = { electrico:'electric', herboso:'grass', brumoso:'fairy', psiquico:'psychic' };
  if (mapa[campo] === tipoMov) return 1.3;
  return 1.0;
}

// ── Calcular STAB + Tera ──────────────────────────────────────
function calcStab(pokemon, tipoMov, teraActivo, teraTipo) {
  const tiposPokemon = pokemon.types.map(t => t.type.name);

  if (teraActivo !== 'ninguno') {
    // Si el movimiento coincide con el Tera tipo
    if (tipoMov === teraActivo) {
      // Si originalmente ya tenía STAB → ×2.0 (Tera STAB)
      if (tiposPokemon.includes(tipoMov)) return 2.0;
      // Solo Tera → ×1.5
      return 1.5;
    }
    // Si el movimiento es de tipo del Pokémon pero no del Tera → ×1.5 normal
    if (tiposPokemon.includes(tipoMov)) return 1.5;
    return 1.0;
  }

  if (tiposPokemon.includes(tipoMov)) return 1.5;
  return 1.0;
}

// ── Función principal de cálculo ──────────────────────────────
function calcularDanio() {
  const atk = calcEstado.atacante;
  const def = calcEstado.defensor;

  if (!atk || !def) {
    mostrarToast('⚠️ Selecciona Atacante y Defensor primero', 'err');
    return;
  }

  // Datos del movimiento
  const potencia    = parseInt(document.getElementById('calcMovPotencia').value) || 80;
  const categoria   = document.getElementById('calcMovCategoria').value;
  const tipoMov     = document.getElementById('calcMovTipo').value;
  const movNombre   = document.getElementById('calcMovNombre').value || 'Movimiento';

  // Datos del atacante
  const nivelAtk    = parseInt(document.getElementById('calcAtacanteNivel').value) || 50;
  const natAtk      = document.getElementById('calcAtacanteNaturaleza').value;
  const evAtkFis    = parseInt(document.getElementById('calcAtacanteEvAtk').value) || 0;
  const evAtkEsp    = parseInt(document.getElementById('calcAtacanteEvSpa').value) || 0;
  const objetoAtk   = document.getElementById('calcAtacanteObjeto').value;

  // Datos del defensor
  const nivelDef    = parseInt(document.getElementById('calcDefensorNivel').value) || 50;
  const natDef      = document.getElementById('calcDefensorNaturaleza').value;
  const evDefFis    = parseInt(document.getElementById('calcDefensorEvDef').value) || 0;
  const evDefEsp    = parseInt(document.getElementById('calcDefensorEvSpd').value) || 0;
  const objetoDef   = document.getElementById('calcDefensorObjeto').value;
  const psActPct    = parseInt(document.getElementById('calcDefensorPsAct').value) || 100;

  // Modificadores
  const tieneStab   = document.getElementById('calcStab').checked;
  const critico     = document.getElementById('calcCritico').checked;
  const pantalla    = document.getElementById('calcPantalla').checked;
  const burn        = document.getElementById('calcDoblesBurn').checked;
  const clima       = document.getElementById('calcClima').value;
  const campo       = document.getElementById('calcCampo').value;
  const teraTipo    = document.getElementById('calcTeraTipo').value;

  // ── Stats base del atacante
  const atkStatBase = atk.stats.find(s => s.stat.name === 'attack')?.base_stat || 80;
  const spaStatBase = atk.stats.find(s => s.stat.name === 'special-attack')?.base_stat || 80;

  // ── Stats base del defensor
  const defStatBase = def.stats.find(s => s.stat.name === 'defense')?.base_stat || 80;
  const spdStatBase = def.stats.find(s => s.stat.name === 'special-defense')?.base_stat || 80;
  const psStatBase  = def.stats.find(s => s.stat.name === 'hp')?.base_stat || 80;

  // ── Stats efectivos
  const atkEfec = categoria === 'fisico'
    ? calcularStatEfectivo(atkStatBase, evAtkFis, nivelAtk, natMultAtk(natAtk))
    : calcularStatEfectivo(spaStatBase, evAtkEsp, nivelAtk, natMultSpa(natAtk));

  const defEfec = categoria === 'fisico'
    ? calcularStatEfectivo(defStatBase, evDefFis, nivelDef, natMultDef(natDef))
    : calcularStatEfectivo(spdStatBase, evDefEsp, nivelDef, natMultSpd(natDef));

  // Modificador de objeto defensor (Chaleco Asalto)
  const defEfecFinal = (objetoDef === 'chaleco-asalto' && categoria === 'especial')
    ? Math.floor(defEfec * 1.5) : defEfec;

  // Roca Eviolita
  const defEfecFinalR = (objetoDef === 'roca-eviolita')
    ? Math.floor(defEfecFinal * 1.5) : defEfecFinal;

  // ── PS máximos del defensor
  const psMax = calcularPS(psStatBase, 0, nivelDef); // sin EVs de PS para simplificar

  // ── Fórmula base Gen 9
  // Daño = floor(floor(floor(2×Nivel/5+2) × Potencia × Atk/Def / 50) + 2) × Mods
  const baseDanio = Math.floor(
    Math.floor(
      Math.floor(2 * nivelAtk / 5 + 2) * potencia * atkEfec / defEfecFinalR / 50
    ) + 2
  );

  // ── Multiplicadores
  let mult = 1.0;

  // Objeto atacante
  mult *= modObjetoAtacante(objetoAtk, categoria);

  // Faja Experto: ×1.2 si el movimiento es efectivo contra el defensor
  if (objetoAtk === 'faja-experto') {
    const efect = calcularMultiplicador(tipoMov, def.types.map(t => t.type.name));
    if (efect > 1) mult *= 1.2;
  }

  // STAB
  const multStab = tieneStab
    ? calcStab(atk, tipoMov, teraTipo, teraTipo)
    : calcStab(atk, tipoMov, teraTipo, teraTipo); // siempre calcular automáticamente
  mult *= multStab;

  // Efectividad de tipo
  const tiposDefensor = def.types.map(t => t.type.name);
  const efect = calcularMultiplicador(tipoMov, tiposDefensor);
  mult *= efect;

  // Clima
  mult *= modClima(clima, tipoMov);

  // Campo
  mult *= modCampo(campo, tipoMov);

  // Crítico
  if (critico) mult *= 1.5;

  // Pantalla (se reduce a la mitad)
  if (pantalla && !critico) mult *= 0.5;

  // Burn (quema reduce físico a la mitad)
  if (burn && categoria === 'fisico') mult *= 0.5;

  // ── Rango de daño (el juego aplica un roll de 0.85–1.0, 16 valores)
  const rolls = [];
  for (let i = 85; i <= 100; i++) {
    rolls.push(Math.floor(Math.floor(baseDanio * mult) * i / 100));
  }
  const danioMin = rolls[0];
  const danioMax = rolls[rolls.length - 1];

  // ── Porcentajes vs PS máximos del defensor
  const pctMin = (danioMin / psMax * 100).toFixed(1);
  const pctMax = (danioMax / psMax * 100).toFixed(1);

  // ── PS actuales del defensor
  const psActuales = Math.floor(psMax * psActPct / 100);
  const mataMin = danioMin >= psActuales;
  const mataMax = danioMax >= psActuales;
  const probabilidadKO = mataMax
    ? (mataMin ? 100 : Math.round(rolls.filter(r => r >= psActuales).length / rolls.length * 100))
    : 0;

  // ── Etiqueta de efectividad
  let etqEfect = '', colorEfect = '#6b7280';
  if (efect === 0)    { etqEfect = '✕ No afecta';       colorEfect = '#374151'; }
  else if (efect < 1) { etqEfect = '🛡 Poco efectivo';  colorEfect = '#3b82f6'; }
  else if (efect === 1){ etqEfect = '— Neutral';         colorEfect = '#6b7280'; }
  else if (efect === 2){ etqEfect = '⚡ Súper efectivo'; colorEfect = '#f97316'; }
  else if (efect >= 4) { etqEfect = '☠ Extremadamente efectivo'; colorEfect = '#ef4444'; }

  // ── Etiqueta de STAB aplicado
  const stabLabel = multStab > 1
    ? `<span class="calc-tag" style="background:rgba(250,204,21,.15);color:#facc15">STAB ×${multStab}</span>`
    : '';

  // ── Barra de daño visual
  const barraAncho = Math.min(100, parseFloat(pctMax));
  const barraColor = efect >= 2 ? '#ef4444' : efect === 0 ? '#374151' : efect < 1 ? '#3b82f6' : '#22c55e';

  // ── Construir HTML del resultado
  const atkNombre = atk.name.charAt(0).toUpperCase() + atk.name.slice(1);
  const defNombre = def.name.charAt(0).toUpperCase() + def.name.slice(1);
  const atkSprite = atk.sprites?.front_default || '';
  const defSprite = def.sprites?.front_default || '';

  document.getElementById('calcResultadoArea').innerHTML = `
    <div class="calc-resultado">

      <!-- Cabecera matchup -->
      <div class="calc-matchup">
        <div class="calc-matchup__lado">
          ${atkSprite ? `<img src="${atkSprite}" alt="${atkNombre}">` : ''}
          <span>${atkNombre}</span>
        </div>
        <div class="calc-matchup__vs">VS</div>
        <div class="calc-matchup__lado">
          ${defSprite ? `<img src="${defSprite}" alt="${defNombre}">` : ''}
          <span>${defNombre}</span>
        </div>
      </div>

      <!-- Movimiento -->
      <div class="calc-resultado__mov">
        ${badgeTipo(tipoMov)}
        <strong>${movNombre}</strong>
        <span class="calc-tag">${categoria === 'fisico' ? '⚔ Físico' : '✨ Especial'}</span>
        <span class="calc-tag">Pot. ${potencia}</span>
        <span class="calc-tag" style="color:${colorEfect}">${etqEfect}</span>
        ${stabLabel}
      </div>

      <!-- Resultado principal -->
      <div class="calc-resultado__principal">
        <div class="calc-resultado__danio">
          <span class="calc-danio-min">${danioMin}</span>
          <span class="calc-danio-sep">—</span>
          <span class="calc-danio-max">${danioMax}</span>
          <span class="calc-danio-hp">HP</span>
        </div>
        <div class="calc-resultado__pct">
          (${pctMin}% — ${pctMax}%)
        </div>
      </div>

      <!-- Barra visual -->
      <div class="calc-barra-danio">
        <div class="calc-barra-danio__fill" style="width:${barraAncho}%;background:${barraColor}">
          <div class="calc-barra-danio__fill-min" style="width:${Math.min(100,parseFloat(pctMin)) / barraAncho * 100}%"></div>
        </div>
        <span class="calc-barra-danio__ps">${psMax} PS máx.</span>
      </div>

      <!-- KO? -->
      <div class="calc-resultado__ko ${probabilidadKO === 100 ? 'ko--seguro' : probabilidadKO > 0 ? 'ko--posible' : 'ko--no'}">
        ${probabilidadKO === 100
          ? `<i class="ti ti-skull"></i> KO garantizado`
          : probabilidadKO > 0
          ? `<i class="ti ti-alert-triangle"></i> KO posible (${probabilidadKO}% de los rolls)`
          : `<i class="ti ti-shield-check"></i> El defensor sobrevive (PS al ${psActPct}%)`}
      </div>

      <!-- Rolls detallados -->
      <details class="calc-rolls">
        <summary>Ver todos los rolls (16 valores)</summary>
        <div class="calc-rolls__grid">
          ${rolls.map((r, i) => `
            <span class="calc-roll ${r >= psActuales ? 'calc-roll--ko' : ''}">
              ${r}
            </span>`).join('')}
        </div>
        <div class="calc-rolls__formula">
          <code>
            ${atkNombre} Nv.${nivelAtk} — ${categoria === 'fisico' ? 'Atk' : 'At.Esp'}: ${atkEfec} /
            ${defNombre} Nv.${nivelDef} — ${categoria === 'fisico' ? 'Def' : 'Def.Esp'}: ${defEfecFinalR}
          </code>
        </div>
      </details>

    </div>`;
}

// ── Limpiar calculadora ───────────────────────────────────────
function limpiarCalculadora() {
  calcEstado.atacante = null;
  calcEstado.defensor = null;
  ['calcAtacanteInput','calcDefensorInput'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
  ['calcAtacanteSugerencias','calcDefensorSugerencias'].forEach(id => {
    const el = document.getElementById(id);
    if (el) { el.innerHTML = ''; el.style.display = 'none'; }
  });
  document.getElementById('calcAtacanteInfo').innerHTML =
    '<div class="calc-pokemon-vacio"><i class="ti ti-pokeball"></i><span>Selecciona un Pokémon</span></div>';
  document.getElementById('calcDefensorInfo').innerHTML =
    '<div class="calc-pokemon-vacio"><i class="ti ti-pokeball"></i><span>Selecciona un Pokémon</span></div>';
  document.getElementById('calcResultadoArea').innerHTML =
    '<div class="calc-resultado-vacio"><div class="pokeball-grande pokeball-grande--dim"></div><p>Completa los datos y<br>pulsa <strong>Calcular</strong></p></div>';
  mostrarToast('🔄 Calculadora limpiada', 'ok');
}

// ── Cerrar sugerencias al hacer clic fuera ────────────────────
document.addEventListener('click', e => {
  if (!e.target.closest('.calc-buscador-wrap')) {
    document.querySelectorAll('.calc-sugerencias').forEach(s => {
      s.style.display = 'none';
    });
  }
});

/* ═══════════════════════════════════════════════════════════════
   ANALIZADOR DE BATALLA
   Comparación táctica completa: stats, velocidad, cobertura,
   ventajas/desventajas de tipo, matchup 1v1 estimado.
═══════════════════════════════════════════════════════════════ */

const anlEstado = { a: null, b: null };

// ── Búsqueda para el analizador ───────────────────────────────
function anlBuscar(termino, lado) {
  const idSug = lado === 'a' ? 'anlASugerencias' : 'anlBSugerencias';
  const cont  = document.getElementById(idSug);

  if (!termino || termino.length < 2) {
    cont.innerHTML = ''; cont.style.display = 'none'; return;
  }
  if (!estado.cargadoCompleto) {
    cont.innerHTML = '<div class="calc-sug-item calc-sug-item--info">Carga la Pokédex primero</div>';
    cont.style.display = 'block'; return;
  }

  const term = termino.toLowerCase().trim();
  const res  = estado.pokemonCache
    .filter(p => p.name.toLowerCase().includes(term) || String(p.id).includes(term))
    .slice(0, 8);

  if (!res.length) {
    cont.innerHTML = '<div class="calc-sug-item calc-sug-item--info">Sin resultados</div>';
    cont.style.display = 'block'; return;
  }

  cont.innerHTML = res.map(p => {
    const nom = p.name.charAt(0).toUpperCase() + p.name.slice(1);
    const spr = p.sprites?.front_default || '';
    return `<div class="calc-sug-item" onclick="anlSeleccionar(${p.id},'${lado}')">
      ${spr ? `<img src="${spr}" alt="${nom}">` : ''}
      <span class="calc-sug-num">#${String(p.id).padStart(3,'0')}</span>
      <span>${nom}</span>
    </div>`;
  }).join('');
  cont.style.display = 'block';
}

// ── Seleccionar Pokémon en el analizador ──────────────────────
function anlSeleccionar(id, lado) {
  const pk = estado.pokemonCache.find(p => p.id === id);
  if (!pk) return;

  anlEstado[lado] = pk;

  const idSug    = lado === 'a' ? 'anlASugerencias' : 'anlBSugerencias';
  const idInput  = lado === 'a' ? 'anlAInput'       : 'anlBInput';
  const idPreview= lado === 'a' ? 'anlAPreview'     : 'anlBPreview';
  const idConf   = lado === 'a' ? 'anlAConfig'      : 'anlBConfig';

  document.getElementById(idSug).style.display = 'none';
  document.getElementById(idInput).value = pk.name.charAt(0).toUpperCase() + pk.name.slice(1);
  document.getElementById(idConf).style.display = 'flex';

  // Preview del Pokémon
  const art   = pk.sprites?.other?.['official-artwork']?.front_default || pk.sprites?.front_default || '';
  const tipos = pk.types.map(t =>
    `${badgeTipo(t.type.name)}`
  ).join('');
  const statsHTML = pk.stats.map(s => {
    const pct   = Math.min(100, Math.round(s.base_stat / 255 * 100));
    const color = STAT_COLOR[s.stat.name] || '#60a5fa';
    return `<div class="calc-stat-mini">
      <span>${STATS_ES[s.stat.name]||s.stat.name}</span>
      <div class="calc-stat-barra"><div style="width:${pct}%;background:${color}"></div></div>
      <span>${s.base_stat}</span>
    </div>`;
  }).join('');
  const total = pk.stats.reduce((a,s) => a + s.base_stat, 0);

  document.getElementById(idPreview).innerHTML = `
    <div class="anl-preview-card">
      <img src="${art}" alt="${pk.name}" class="anl-preview-img">
      <div class="anl-preview-datos">
        <div class="calc-pokemon-nombre">${pk.name.charAt(0).toUpperCase()+pk.name.slice(1)}</div>
        <div class="calc-pokemon-tipos">${tipos}</div>
        <div style="font-size:9px;color:var(--texto-muted);margin:3px 0">BST: <strong style="color:var(--amarillo)">${total}</strong></div>
        <div class="calc-stats-mini">${statsHTML}</div>
      </div>
    </div>`;
}

// ── Naturaleza → multiplicador de velocidad ───────────────────
function natVel(nat) {
  return nat === 'spd_vel+' ? 1.1 : 1.0;
}

// ── Stat de velocidad efectivo ────────────────────────────────
function velEfectiva(pk, evVel, nivel, nat) {
  const base = pk.stats.find(s => s.stat.name === 'speed')?.base_stat || 50;
  return calcularStatEfectivo(base, evVel, nivel, natVel(nat));
}

// ── Análisis de cobertura ofensiva (qué tipos puede golpear bien) ─
function coberturaOfensiva(pk) {
  const tipos = pk.types.map(t => t.type.name);
  const excelente = [], buena = [], mala = [];

  Object.keys(TIPOS_ES).forEach(defTipo => {
    let mejorMult = 0;
    tipos.forEach(atkTipo => {
      const m = MULT[atkTipo]?.[defTipo] ?? 1;
      if (m > mejorMult) mejorMult = m;
    });
    if (mejorMult >= 2) excelente.push({ tipo: defTipo, mult: mejorMult });
    else if (mejorMult === 1) buena.push({ tipo: defTipo, mult: 1 });
    else mala.push({ tipo: defTipo, mult: mejorMult });
  });
  return { excelente, buena, mala };
}

// ── Ventaja de tipo directa A→B y B→A ────────────────────────
function ventajaTipo(atacante, defensor) {
  const tiposAtk = atacante.types.map(t => t.type.name);
  const tiposDef = defensor.types.map(t => t.type.name);

  // Mejor multiplicador de los tipos del atacante contra el defensor
  let mejor = 0;
  tiposAtk.forEach(atk => {
    const m = calcularMultiplicador(atk, tiposDef);
    if (m > mejor) mejor = m;
  });
  return mejor;
}

// ── Stat comparativo ──────────────────────────────────────────
function compararStat(a, b, statName, evA, evB, nivelA, nivelB, natA, natB) {
  const baseA = a.stats.find(s => s.stat.name === statName)?.base_stat ?? 50;
  const baseB = b.stats.find(s => s.stat.name === statName)?.base_stat ?? 50;

  let multA = 1, multB = 1;
  if (statName === 'attack')          { multA = natMultAtk(natA); multB = natMultAtk(natB); }
  if (statName === 'special-attack')  { multA = natMultSpa(natA); multB = natMultSpa(natB); }
  if (statName === 'defense')         { multA = natMultDef(natA); multB = natMultDef(natB); }
  if (statName === 'special-defense') { multA = natMultSpd(natA); multB = natMultSpd(natB); }
  if (statName === 'speed')           { multA = natVel(natA);     multB = natVel(natB); }

  const statA = statName === 'hp'
    ? calcularPS(baseA, evA, nivelA)
    : calcularStatEfectivo(baseA, evA, nivelA, multA);
  const statB = statName === 'hp'
    ? calcularPS(baseB, evB, nivelB)
    : calcularStatEfectivo(baseB, evB, nivelB, multB);

  return { baseA, baseB, statA, statB };
}

// ── Función principal: analizar ───────────────────────────────
function analizarBatalla() {
  const a = anlEstado.a;
  const b = anlEstado.b;
  if (!a || !b) { mostrarToast('⚠️ Selecciona los dos Pokémon primero', 'err'); return; }

  // Leer configuración
  const nivelA = parseInt(document.getElementById('anlANivel').value) || 50;
  const nivelB = parseInt(document.getElementById('anlBNivel').value) || 50;
  const evAtkA = parseInt(document.getElementById('anlAEvAtk').value) || 0;
  const evSpaA = parseInt(document.getElementById('anlAEvSpa').value) || 0;
  const evVelA = parseInt(document.getElementById('anlAEvSpd').value) || 0;
  const evAtkB = parseInt(document.getElementById('anlBEvAtk').value) || 0;
  const evSpaB = parseInt(document.getElementById('anlBEvSpa').value) || 0;
  const evVelB = parseInt(document.getElementById('anlBEvSpd').value) || 0;
  const natA   = document.getElementById('anlANat').value;
  const natB   = document.getElementById('anlBNat').value;

  const nomA = a.name.charAt(0).toUpperCase() + a.name.slice(1);
  const nomB = b.name.charAt(0).toUpperCase() + b.name.slice(1);
  const sprA = a.sprites?.other?.['official-artwork']?.front_default || a.sprites?.front_default || '';
  const sprB = b.sprites?.other?.['official-artwork']?.front_default || b.sprites?.front_default || '';

  // ── 1. Velocidad ─────────────────────────────────────────────
  const velA = velEfectiva(a, evVelA, nivelA, natA);
  const velB = velEfectiva(b, evVelB, nivelB, natB);
  const velBaseA = a.stats.find(s => s.stat.name === 'speed')?.base_stat ?? 50;
  const velBaseB = b.stats.find(s => s.stat.name === 'speed')?.base_stat ?? 50;
  const primerA  = velA > velB;
  const empateVel= velA === velB;

  // ── 2. Ventaja de tipo ────────────────────────────────────────
  const multAvsB = ventajaTipo(a, b);
  const multBvsA = ventajaTipo(b, a);

  // ── 3. Stats comparativos (base) ──────────────────────────────
  const STATS_ORDEN = ['hp','attack','defense','special-attack','special-defense','speed'];
  const evMapA = { hp:0, attack:evAtkA, defense:4, 'special-attack':evSpaA, 'special-defense':4, speed:evVelA };
  const evMapB = { hp:0, attack:evAtkB, defense:4, 'special-attack':evSpaB, 'special-defense':4, speed:evVelB };

  const statsComp = STATS_ORDEN.map(st => compararStat(a, b, st, evMapA[st], evMapB[st], nivelA, nivelB, natA, natB));
  const ventajasA = statsComp.filter(s => s.statA > s.statB).length;
  const ventajasB = statsComp.filter(s => s.statB > s.statA).length;

  // ── 4. Veredicto global ───────────────────────────────────────
  let veredicto = '', colorVeredicto = '#6b7280', iconoVeredicto = 'ti-minus';
  const puntosA = (multAvsB >= 2 ? 2 : multAvsB >= 1 ? 0 : -2)
    + (primerA ? 1 : empateVel ? 0 : -1)
    + (ventajasA - ventajasB);

  if (puntosA > 2)       { veredicto = `${nomA} tiene ventaja táctica`; colorVeredicto = '#f97316'; iconoVeredicto = 'ti-trophy'; }
  else if (puntosA < -2) { veredicto = `${nomB} tiene ventaja táctica`; colorVeredicto = '#22c55e'; iconoVeredicto = 'ti-trophy'; }
  else                    { veredicto = 'Combate equilibrado — depende de los movimientos'; colorVeredicto = '#facc15'; iconoVeredicto = 'ti-scale'; }

  // ── 5. Efectividades de tipo ──────────────────────────────────
  const efAvsB = calcularEfectividad(b.types.map(t => t.type.name));
  const efBvsA = calcularEfectividad(a.types.map(t => t.type.name));

  // Tipos del atacante A que son super efectivos contra B
  const atkABuenos = a.types.map(t => t.type.name)
    .filter(t => (MULT[t] ? calcularMultiplicador(t, b.types.map(tt=>tt.type.name)) : 1) >= 2);
  const atkBBuenos = b.types.map(t => t.type.name)
    .filter(t => (MULT[t] ? calcularMultiplicador(t, a.types.map(tt=>tt.type.name)) : 1) >= 2);

  // ── Construir HTML del resultado ──────────────────────────────
  const bstA = a.stats.reduce((s,st) => s + st.base_stat, 0);
  const bstB = b.stats.reduce((s,st) => s + st.base_stat, 0);

  // Barra de stats
  const maxStat = 255;
  const barrasStats = STATS_ORDEN.map((st, i) => {
    const { baseA, baseB, statA, statB } = statsComp[i];
    const pctA = Math.round(baseA / maxStat * 100);
    const pctB = Math.round(baseB / maxStat * 100);
    const color = STAT_COLOR[st] || '#60a5fa';
    const ganadorA = statA > statB;
    const ganadorB = statB > statA;
    return `
      <div class="anl-stat-fila">
        <span class="anl-stat-val ${ganadorA?'anl-stat-val--win':''}">${statA}</span>
        <div class="anl-stat-barra-wrap">
          <div class="anl-stat-barra anl-stat-barra--a">
            <div style="width:${pctA}%;background:${color};opacity:${ganadorA?1:0.45}"></div>
          </div>
          <span class="anl-stat-nombre">${STATS_ES[st]||st}</span>
          <div class="anl-stat-barra anl-stat-barra--b">
            <div style="width:${pctB}%;background:${color};opacity:${ganadorB?1:0.45}"></div>
          </div>
        </div>
        <span class="anl-stat-val ${ganadorB?'anl-stat-val--win':''}">${statB}</span>
      </div>`;
  }).join('');

  // Etiqueta efectividad
  function etqMult(m) {
    if (m === 0)   return { txt: '✕ Inmune',          col: '#374151' };
    if (m < 1)     return { txt: `×${m} Resistente`,  col: '#3b82f6' };
    if (m === 1)   return { txt: '×1 Neutral',         col: '#6b7280' };
    if (m === 2)   return { txt: '×2 Súper efectivo',  col: '#f97316' };
    if (m >= 4)    return { txt: '×4 Extremo',         col: '#ef4444' };
    return { txt: `×${m}`, col: '#6b7280' };
  }

  const etqAvB = etqMult(multAvsB);
  const etqBvA = etqMult(multBvsA);

  document.getElementById('anlResultado').innerHTML = `
    <div class="anl-res-scroll">

      <!-- Veredicto -->
      <div class="anl-veredicto" style="border-color:${colorVeredicto}20;background:${colorVeredicto}10">
        <i class="ti ${iconoVeredicto}" style="color:${colorVeredicto};font-size:18px"></i>
        <span style="color:${colorVeredicto};font-weight:700;font-size:13px">${veredicto}</span>
      </div>

      <!-- Cabecera de combate -->
      <div class="anl-combate-header">
        <div class="anl-combate-lado">
          ${sprA?`<img src="${sprA}" alt="${nomA}" class="anl-combate-img">`:'' }
          <span class="anl-combate-nombre">${nomA}</span>
          <div style="display:flex;gap:3px;flex-wrap:wrap;justify-content:center">
            ${a.types.map(t=>`${badgeTipo(t.type.name)}`).join('')}
          </div>
          <span class="anl-bst">BST ${bstA}</span>
        </div>
        <div class="anl-combate-centro">
          <div class="anl-score-box" style="color:#f97316">${ventajasA}<span>stats</span></div>
          <div class="anl-vs-central">VS</div>
          <div class="anl-score-box" style="color:#22c55e">${ventajasB}<span>stats</span></div>
        </div>
        <div class="anl-combate-lado">
          ${sprB?`<img src="${sprB}" alt="${nomB}" class="anl-combate-img">`:'' }
          <span class="anl-combate-nombre">${nomB}</span>
          <div style="display:flex;gap:3px;flex-wrap:wrap;justify-content:center">
            ${b.types.map(t=>`${badgeTipo(t.type.name)}`).join('')}
          </div>
          <span class="anl-bst">BST ${bstB}</span>
        </div>
      </div>

      <!-- Velocidad -->
      <div class="anl-seccion">
        <div class="anl-seccion__titulo"><i class="ti ti-bolt" style="color:#facc15"></i> VELOCIDAD</div>
        <div class="anl-velocidad">
          <div class="anl-vel-bloque ${primerA?'anl-vel-bloque--win':''}">
            <span class="anl-vel-num">${velA}</span>
            <span class="anl-vel-base">(base ${velBaseA})</span>
            <span class="anl-vel-label">${nomA}</span>
          </div>
          <div class="anl-vel-icon">
            ${empateVel ? '<i class="ti ti-equal" style="color:#facc15"></i>'
              : primerA  ? '<i class="ti ti-chevron-right" style="color:#f97316"></i>'
                         : '<i class="ti ti-chevron-left"  style="color:#22c55e"></i>'}
            <span style="font-size:9px;color:var(--texto-muted)">
              ${empateVel ? 'Empate' : primerA ? `${nomA} va primero` : `${nomB} va primero`}
            </span>
          </div>
          <div class="anl-vel-bloque ${!primerA&&!empateVel?'anl-vel-bloque--win':''}">
            <span class="anl-vel-num">${velB}</span>
            <span class="anl-vel-base">(base ${velBaseB})</span>
            <span class="anl-vel-label">${nomB}</span>
          </div>
        </div>
      </div>

      <!-- Ventaja de tipo -->
      <div class="anl-seccion">
        <div class="anl-seccion__titulo"><i class="ti ti-shield-half" style="color:#a78bfa"></i> VENTAJA DE TIPO</div>
        <div class="anl-tipo-matchup">
          <div class="anl-tipo-bloque">
            <span style="font-size:10px;color:var(--texto-muted)">${nomA} → ${nomB}</span>
            <span class="anl-tipo-mult" style="color:${etqAvB.col}">${etqAvB.txt}</span>
            ${atkABuenos.length ? `<div style="display:flex;gap:3px;margin-top:3px">
              ${atkABuenos.map(t=>badgeTipo(t, "", 'style="font-size:8px"')).join('')}
            </div>` : ''}
          </div>
          <div class="anl-tipo-sep">↔</div>
          <div class="anl-tipo-bloque">
            <span style="font-size:10px;color:var(--texto-muted)">${nomB} → ${nomA}</span>
            <span class="anl-tipo-mult" style="color:${etqBvA.col}">${etqBvA.txt}</span>
            ${atkBBuenos.length ? `<div style="display:flex;gap:3px;margin-top:3px">
              ${atkBBuenos.map(t=>badgeTipo(t, "", 'style="font-size:8px"')).join('')}
            </div>` : ''}
          </div>
        </div>
      </div>

      <!-- Comparativa de stats -->
      <div class="anl-seccion">
        <div class="anl-seccion__titulo"><i class="ti ti-chart-bar" style="color:#22d3ee"></i> ESTADÍSTICAS (Nv.${nivelA} vs Nv.${nivelB}, EVs configurados)</div>
        <div class="anl-stats-header">
          <span style="color:#f97316;font-size:10px;font-weight:700">${nomA}</span>
          <span></span>
          <span style="color:#22c55e;font-size:10px;font-weight:700;text-align:right">${nomB}</span>
        </div>
        <div class="anl-stats-comp">${barrasStats}</div>
      </div>

      <!-- Debilidades y fortalezas del matchup -->
      <div class="anl-seccion anl-seccion--2col">
        <div>
          <div class="anl-seccion__titulo"><i class="ti ti-alert-triangle" style="color:#ef4444"></i> DEBILIDADES DE ${nomA}</div>
          <div style="display:flex;flex-wrap:wrap;gap:4px;margin-top:4px">
            ${Object.entries(efBvsA).filter(([,m])=>m>=2).map(([t,m])=>
              badgeTipo(t, "", 'style="font-size:9px"', ` ×${m}`)
            ).join('') || '<span style="font-size:11px;color:var(--texto-muted)">Sin debilidades notables</span>'}
          </div>
        </div>
        <div>
          <div class="anl-seccion__titulo"><i class="ti ti-alert-triangle" style="color:#ef4444"></i> DEBILIDADES DE ${nomB}</div>
          <div style="display:flex;flex-wrap:wrap;gap:4px;margin-top:4px">
            ${Object.entries(efAvsB).filter(([,m])=>m>=2).map(([t,m])=>
              badgeTipo(t, "", 'style="font-size:9px"', ` ×${m}`)
            ).join('') || '<span style="font-size:11px;color:var(--texto-muted)">Sin debilidades notables</span>'}
          </div>
        </div>
      </div>

      <!-- Inmunidades -->
      <div class="anl-seccion anl-seccion--2col">
        <div>
          <div class="anl-seccion__titulo"><i class="ti ti-ban" style="color:#6b7280"></i> INMUNIDADES DE ${nomA}</div>
          <div style="display:flex;flex-wrap:wrap;gap:4px;margin-top:4px">
            ${Object.entries(efBvsA).filter(([,m])=>m===0).map(([t])=>
              badgeTipo(t, "", 'style="font-size:9px"')
            ).join('') || '<span style="font-size:11px;color:var(--texto-muted)">Sin inmunidades</span>'}
          </div>
        </div>
        <div>
          <div class="anl-seccion__titulo"><i class="ti ti-ban" style="color:#6b7280"></i> INMUNIDADES DE ${nomB}</div>
          <div style="display:flex;flex-wrap:wrap;gap:4px;margin-top:4px">
            ${Object.entries(efAvsB).filter(([,m])=>m===0).map(([t])=>
              badgeTipo(t, "", 'style="font-size:9px"')
            ).join('') || '<span style="font-size:11px;color:var(--texto-muted)">Sin inmunidades</span>'}
          </div>
        </div>
      </div>

    </div>`;
}

// ── Limpiar analizador ────────────────────────────────────────
function limpiarAnalizador() {
  anlEstado.a = null; anlEstado.b = null;
  ['anlAInput','anlBInput'].forEach(id => { const e = document.getElementById(id); if(e) e.value=''; });
  ['anlASugerencias','anlBSugerencias'].forEach(id => { const e = document.getElementById(id); if(e){e.innerHTML='';e.style.display='none';} });
  ['anlAPreview','anlBPreview'].forEach(id => {
    document.getElementById(id).innerHTML = '<div class="calc-pokemon-vacio"><i class="ti ti-pokeball"></i><span>Selecciona un Pokémon</span></div>';
  });
  ['anlAConfig','anlBConfig'].forEach(id => { document.getElementById(id).style.display='none'; });
  document.getElementById('anlResultado').innerHTML = `
    <div class="calc-resultado-vacio" style="flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px">
      <div class="pokeball-grande pokeball-grande--dim"></div>
      <p style="font-size:12px;color:var(--texto-muted);text-align:center">Selecciona dos Pokémon<br>y pulsa <strong>Analizar</strong></p>
    </div>`;
  mostrarToast('🔄 Analizador limpiado','ok');
}

/* ═══════════════════════════════════════════════════════════════
   ANALIZADOR DE COBERTURA
   Analiza cobertura ofensiva STAB, huecos, resistencias del
   equipo, vulnerabilidades comunes, mapa 18 tipos y sinergia.
═══════════════════════════════════════════════════════════════ */

// ── Calcular mejor multiplicador ofensivo de un Pokémon
//    contra un tipo defensor, considerando STAB ─────────────────
function cobMultOfensivo(pokemon, tipoDefensor) {
  const tiposPk = pokemon.types.map(t => t.type.name);
  let mejor = 0;
  tiposPk.forEach(tipoAtk => {
    // Multiplicador STAB del movimiento de ese tipo contra el defensor
    // (tipo defensor simple, no dual — se llama tipo por tipo)
    const m = MULT[tipoAtk]?.[tipoDefensor] ?? 1;
    const mStab = m * 1.5; // STAB
    if (mStab > mejor) mejor = mStab;
  });
  return mejor;
}

// ── Mejor multiplicador ofensivo de TODO el equipo contra un tipo
function cobEquipoVsTipo(ocupados, tipoDefensor) {
  let mejor = 0;
  ocupados.forEach(pk => {
    const m = cobMultOfensivo(pk, tipoDefensor);
    if (m > mejor) mejor = m;
  });
  return mejor;
}

// ── Renderizado principal ─────────────────────────────────────
function renderizarCobertura() {
  const ocupados = miEquipo.filter(Boolean);
  const sinEquipo = document.getElementById('cobSinEquipo');
  const conEquipo = document.getElementById('cobContenido');

  if (!ocupados.length) {
    sinEquipo.style.display = 'flex';
    conEquipo.style.display = 'none';
    return;
  }
  sinEquipo.style.display = 'none';
  conEquipo.style.display = 'flex';

  // Renderizar todos los bloques en orden
  cobRenderizarStrip(ocupados);
  const datosOfensiva  = cobRenderizarOfensiva(ocupados);
  const datosDefensiva = cobRenderizarDefensiva(ocupados);
  cobRenderizarMapa(ocupados);
  cobRenderizarSinergia(ocupados);
  cobRenderizarPuntuacion(ocupados, datosOfensiva, datosDefensiva);
  cobRenderizarRecomendaciones(ocupados, datosOfensiva, datosDefensiva);
}

// ── Puntuación global del equipo ──────────────────────────────
function cobRenderizarPuntuacion(ocupados, of, df) {
  const scoreOfensivo  = Math.round(of.cubiertos.length / 18 * 100);
  const scoreDefensivo = Math.round((18 - df.vulnerabilidades.length) / 18 * 100);
  const scoreSinergia  = ocupados.length >= 2
    ? Math.min(100, Math.round((df.resistencias.length / 10) * 100))
    : 0;
  const scoreGlobal = Math.round((scoreOfensivo + scoreDefensivo + scoreSinergia) / 3);

  const colorScore = s => s >= 75 ? '#22c55e' : s >= 50 ? '#facc15' : '#ef4444';

  const el = document.getElementById('cobPuntuacion');
  if (!el) return;
  el.innerHTML = `
    <div class="cob-score-item">
      <div class="cob-score-anillo" style="--pct:${scoreOfensivo};--color:${colorScore(scoreOfensivo)}">
        <span>${scoreOfensivo}</span>
      </div>
      <span class="cob-score-label">Cobertura<br>Ofensiva</span>
    </div>
    <div class="cob-score-item">
      <div class="cob-score-anillo" style="--pct:${scoreDefensivo};--color:${colorScore(scoreDefensivo)}">
        <span>${scoreDefensivo}</span>
      </div>
      <span class="cob-score-label">Cobertura<br>Defensiva</span>
    </div>
    <div class="cob-score-item">
      <div class="cob-score-anillo" style="--pct:${scoreSinergia};--color:${colorScore(scoreSinergia)}">
        <span>${scoreSinergia}</span>
      </div>
      <span class="cob-score-label">Sinergia<br>del Equipo</span>
    </div>
    <div class="cob-score-item cob-score-item--global">
      <div class="cob-score-anillo cob-score-anillo--grande" style="--pct:${scoreGlobal};--color:${colorScore(scoreGlobal)}">
        <span>${scoreGlobal}</span>
      </div>
      <span class="cob-score-label">Puntuación<br>Global</span>
    </div>`;
}

// ── Recomendaciones automáticas ───────────────────────────────
function cobRenderizarRecomendaciones(ocupados, of, df) {
  const el = document.getElementById('cobRecomendaciones');
  if (!el) return;

  const sugerencias = [];

  // Huecos ofensivos críticos
  if (of.huecos.length > 0) {
    const tiposHueco = of.huecos.map(h => TIPOS_ES[h.tipo] || h.tipo).slice(0, 4).join(', ');
    sugerencias.push({
      tipo: 'ofensivo',
      icon: 'ti-sword',
      color: '#f97316',
      titulo: 'Huecos ofensivos detectados',
      texto: `Tu equipo no cubre con STAB: ${tiposHueco}${of.huecos.length > 4 ? ` y ${of.huecos.length - 4} más` : ''}. Considera Pokémon que tengan esos tipos.`
    });
  }

  // Vulnerabilidades comunes
  if (df.vulnerabilidades.length > 0) {
    const tiposVuln = df.vulnerabilidades
      .sort((a,b) => b.count - a.count)
      .slice(0, 3)
      .map(v => `${TIPOS_ES[v.tipo]} (${v.count}/${ocupados.length})`)
      .join(', ');
    sugerencias.push({
      tipo: 'defensivo',
      icon: 'ti-shield-exclamation',
      color: '#ef4444',
      titulo: 'Vulnerabilidades comunes en el equipo',
      texto: `Los tipos ${tiposVuln} golpean super efectivo a la mayoría. Añade Pokémon resistentes o inmunes.`
    });
  }

  // Tipos repetidos en el equipo
  const cuentaTipos = {};
  ocupados.forEach(pk => {
    pk.types.forEach(t => {
      cuentaTipos[t.type.name] = (cuentaTipos[t.type.name] || 0) + 1;
    });
  });
  const repetidos = Object.entries(cuentaTipos).filter(([,n]) => n >= 3);
  if (repetidos.length) {
    const nombres = repetidos.map(([t]) => TIPOS_ES[t] || t).join(', ');
    sugerencias.push({
      tipo: 'diversidad',
      icon: 'ti-copy',
      color: '#a78bfa',
      titulo: 'Tipos repetidos en el equipo',
      texto: `Tienes demasiados Pokémon del tipo ${nombres}. Diversifica para evitar debilidades concentradas.`
    });
  }

  // Resistencias cubiertas: punto positivo
  if (df.resistencias.length >= 8) {
    sugerencias.push({
      tipo: 'positivo',
      icon: 'ti-check',
      color: '#22c55e',
      titulo: 'Buena cobertura defensiva',
      texto: `El equipo resiste colectivamente ${df.resistencias.length} tipos. ¡Sólida base defensiva!`
    });
  }

  // Equipo completo de 6
  if (ocupados.length < 6) {
    sugerencias.push({
      tipo: 'info',
      icon: 'ti-info-circle',
      color: '#22d3ee',
      titulo: 'Equipo incompleto',
      texto: `Tienes ${ocupados.length}/6 Pokémon. Completa el equipo para un análisis más preciso.`
    });
  }

  if (!sugerencias.length) {
    sugerencias.push({
      tipo: 'positivo',
      icon: 'ti-trophy',
      color: '#facc15',
      titulo: '¡Equipo bien balanceado!',
      texto: 'No se detectaron problemas graves de cobertura. Revisa los detalles del mapa para afinar.'
    });
  }

  el.innerHTML = sugerencias.map(s => `
    <div class="cob-recom" style="border-left-color:${s.color};background:${s.color}08">
      <i class="ti ${s.icon}" style="color:${s.color};font-size:16px;flex-shrink:0;margin-top:1px"></i>
      <div>
        <div class="cob-recom__titulo" style="color:${s.color}">${s.titulo}</div>
        <div class="cob-recom__texto">${s.texto}</div>
      </div>
    </div>`).join('');
}

// ── Strip superior: sprites del equipo ───────────────────────
function cobRenderizarStrip(ocupados) {
  const strip = document.getElementById('cobEquipoStrip');
  strip.innerHTML = `
    <span class="cob-strip__label">EQUIPO ANALIZADO</span>
    ${ocupados.map(p => {
      const spr = p.sprites?.front_default || '';
      const nom = p.name.charAt(0).toUpperCase() + p.name.slice(1);
      const tipos = p.types.map(t =>
        badgeTipo(t.type.name, "", 'style="font-size:7px;padding:1px 5px"')
      ).join('');
      return `<div class="cob-strip__pk">
        ${spr ? `<img src="${spr}" alt="${nom}">` : ''}
        <span>${nom}</span>
        <div style="display:flex;gap:2px;flex-wrap:wrap;justify-content:center">${tipos}</div>
      </div>`;
    }).join('')}`;
}

// ── Panel ofensivo: STAB cubiertos y huecos ───────────────────
function cobRenderizarOfensiva(ocupados) {
  const cubiertos = [], huecos = [];

  TODOS_TIPOS.forEach(tipoDefensor => {
    const mejor = cobEquipoVsTipo(ocupados, tipoDefensor);
    // STAB super efectivo = tipo atacante STAB (1.5) × efectividad ≥2 → ≥3
    if (mejor >= 3) {
      // Quién lo cubre
      const cubridores = ocupados
        .filter(pk => cobMultOfensivo(pk, tipoDefensor) >= 3)
        .map(pk => pk.name.charAt(0).toUpperCase() + pk.name.slice(1));
      cubiertos.push({ tipo: tipoDefensor, mult: mejor, cubridores });
    } else {
      huecos.push({ tipo: tipoDefensor, mult: mejor });
    }
  });

  // Score
  const pct = Math.round(cubiertos.length / 18 * 100);
  document.getElementById('cobStabScore').textContent = `${cubiertos.length}/18`;
  document.getElementById('cobStabScore').style.background =
    pct >= 75 ? 'rgba(34,197,94,0.2)' : pct >= 50 ? 'rgba(250,204,21,0.2)' : 'rgba(239,68,68,0.2)';

  document.getElementById('cobHuecosScore').textContent = `${huecos.length}/18`;

  // Renderizar cubiertos
  document.getElementById('cobStabGrid').innerHTML = cubiertos.length
    ? cubiertos.map(c => `
        <div class="cob-tipo-item cob-tipo-item--ok" title="${c.cubridores.join(', ')}">
          ${badgeTipo(c.tipo)}
          <span class="cob-tipo-mult">×${(c.mult).toFixed(1)}</span>
          <span class="cob-tipo-quien">${c.cubridores.slice(0,2).join(' · ')}${c.cubridores.length>2?` +${c.cubridores.length-2}`:''}</span>
        </div>`).join('')
    : '<span class="cob-vacio">Sin cobertura STAB</span>';

  // Renderizar huecos
  document.getElementById('cobHuecosGrid').innerHTML = huecos.length
    ? huecos.map(h => `
        <div class="cob-tipo-item cob-tipo-item--mal">
          ${badgeTipo(h.tipo)}
          <span class="cob-tipo-mult" style="color:#ef4444">${h.mult > 0 ? '×'+h.mult.toFixed(1) : '✕'}</span>
        </div>`).join('')
    : '<span class="cob-vacio cob-vacio--ok">¡Sin huecos! Cobertura perfecta</span>';

  return { cubiertos, huecos };
}

// ── Panel defensivo: resistencias y vulnerabilidades ─────────
function cobRenderizarDefensiva(ocupados) {
  const resistencias = [], vulnerabilidades = [];
  const umbralRes  = Math.ceil(ocupados.length / 2); // mitad resiste
  const umbralVuln = Math.ceil(ocupados.length / 2); // mitad es débil

  TODOS_TIPOS.forEach(tipoAtk => {
    const mults = ocupados.map(pk => calcularMultiplicador(tipoAtk, pk.types.map(t => t.type.name)));
    const resN  = mults.filter(m => m < 1).length;
    const vulnN = mults.filter(m => m >= 2).length;

    if (resN >= umbralRes) {
      resistencias.push({ tipo: tipoAtk, count: resN, total: ocupados.length });
    }
    if (vulnN >= umbralVuln) {
      vulnerabilidades.push({ tipo: tipoAtk, count: vulnN, total: ocupados.length });
    }
  });

  document.getElementById('cobResScore').textContent = `${resistencias.length}`;
  document.getElementById('cobVulnScore').textContent = `${vulnerabilidades.length}`;

  document.getElementById('cobResGrid').innerHTML = resistencias.length
    ? resistencias.sort((a,b) => b.count-a.count).map(r => `
        <div class="cob-tipo-item cob-tipo-item--res">
          ${badgeTipo(r.tipo)}
          <span class="cob-tipo-mult" style="color:#22c55e">${r.count}/${r.total}</span>
        </div>`).join('')
    : '<span class="cob-vacio">Sin resistencias compartidas</span>';

  document.getElementById('cobVulnGrid').innerHTML = vulnerabilidades.length
    ? vulnerabilidades.sort((a,b) => b.count-a.count).map(v => `
        <div class="cob-tipo-item cob-tipo-item--mal">
          ${badgeTipo(v.tipo)}
          <span class="cob-tipo-mult" style="color:#ef4444">${v.count}/${v.total}</span>
        </div>`).join('')
    : '<span class="cob-vacio cob-vacio--ok">¡Sin vulnerabilidades comunes!</span>';

  return { resistencias, vulnerabilidades };
}

// ── Mapa completo: tabla Pokémon × 18 tipos ───────────────────
function cobRenderizarMapa(ocupados) {
  const tabla = document.getElementById('cobMapaTabla');

  // Encabezado: nombres del equipo
  const thead = `<thead><tr>
    <th class="cob-mapa-th cob-mapa-th--tipo">Tipo</th>
    ${ocupados.map(p => {
      const nom = p.name.charAt(0).toUpperCase() + p.name.slice(1);
      return `<th class="cob-mapa-th">${nom}</th>`;
    }).join('')}
    <th class="cob-mapa-th" style="color:var(--amarillo)">Mejor</th>
  </tr></thead>`;

  // Filas: un tipo defensor por fila
  const filas = TODOS_TIPOS.map(tipoDefensor => {
    const celdas = ocupados.map(pk => {
      const m = cobMultOfensivo(pk, tipoDefensor);
      let cls = 'cob-celda--neutro', txt = '—';
      if (m >= 4.5)      { cls = 'cob-celda--x4';  txt = '×4'; }   // STAB + x4 efectividad
      else if (m >= 3)   { cls = 'cob-celda--x2';  txt = '×2'; }   // STAB + x2
      else if (m >= 2.25){ cls = 'cob-celda--x15'; txt = '×1.5'; } // STAB neutral
      else if (m > 0 && m < 1.5) { cls = 'cob-celda--x05'; txt = '½'; }
      else if (m === 0)  { cls = 'cob-celda--x0';  txt = '✕'; }
      return { cls, txt, m };
    });

    const mejor = Math.max(...celdas.map(c => c.m));
    let mejorCls = 'cob-celda--neutro', mejorTxt = '—';
    if (mejor >= 4.5)      { mejorCls = 'cob-celda--x4';  mejorTxt = '×4'; }
    else if (mejor >= 3)   { mejorCls = 'cob-celda--x2';  mejorTxt = '×2'; }
    else if (mejor >= 2.25){ mejorCls = 'cob-celda--x15'; mejorTxt = '×1.5'; }
    else if (mejor < 1.5 && mejor > 0) { mejorCls = 'cob-celda--x05'; mejorTxt = '½'; }
    else if (mejor === 0)  { mejorCls = 'cob-celda--x0';  mejorTxt = '✕'; }

    return `<tr>
      <td class="cob-mapa-td-tipo">
        ${badgeTipo(tipoDefensor, "", 'style="font-size:8px;padding:1px 6px"')}
      </td>
      ${celdas.map(c => `<td class="cob-celda ${c.cls}">${c.txt}</td>`).join('')}
      <td class="cob-celda ${mejorCls}" style="font-weight:700">${mejorTxt}</td>
    </tr>`;
  }).join('');

  tabla.innerHTML = `${thead}<tbody>${filas}</tbody>`;
}

// ── Sinergia: pares de Pokémon que se complementan ────────────
function cobRenderizarSinergia(ocupados) {
  const cont = document.getElementById('cobSinergiaGrid');

  if (ocupados.length < 2) {
    cont.innerHTML = '<span class="cob-vacio">Necesitas al menos 2 Pokémon para analizar sinergia.</span>';
    return;
  }

  // Para cada Pokémon: qué tipos son su punto débil
  // Sinergia = otro Pokémon es inmune/resistente a esas debilidades
  const fichas = ocupados.map(pk => {
    const debilidadesPk = TODOS_TIPOS.filter(atk =>
      calcularMultiplicador(atk, pk.types.map(t => t.type.name)) >= 2
    );
    return { pk, debilidadesPk };
  });

  const pares = [];
  for (let i = 0; i < fichas.length; i++) {
    for (let j = i + 1; j < fichas.length; j++) {
      const a = fichas[i], b = fichas[j];
      // Cuántas debilidades de A cubre B (resiste o es inmune)
      const aCubreB = a.debilidadesPk.filter(deb => {
        const m = calcularMultiplicador(deb, b.pk.types.map(t => t.type.name));
        return m < 1; // resistente o inmune
      });
      const bCubreA = b.debilidadesPk.filter(deb => {
        const m = calcularMultiplicador(deb, a.pk.types.map(t => t.type.name));
        return m < 1;
      });
      const score = aCubreB.length + bCubreA.length;
      pares.push({ a: a.pk, b: b.pk, aCubreB, bCubreA, score });
    }
  }

  // Ordenar de mayor a menor sinergia
  pares.sort((x, y) => y.score - x.score);

  cont.innerHTML = pares.map(par => {
    const sprA = par.a.sprites?.front_default || '';
    const sprB = par.b.sprites?.front_default || '';
    const nomA = par.a.name.charAt(0).toUpperCase() + par.a.name.slice(1);
    const nomB = par.b.name.charAt(0).toUpperCase() + par.b.name.slice(1);
    const nivel = par.score >= 6 ? 'alta' : par.score >= 3 ? 'media' : 'baja';
    const colorNivel = nivel === 'alta' ? '#22c55e' : nivel === 'media' ? '#facc15' : '#6b7280';

    const listaCubreAB = par.aCubreB.map(t =>
      `${badgeTipo(t, "", 'style="font-size:7px;padding:1px 4px"')}`
    ).join('');
    const listasCubreBA = par.bCubreA.map(t =>
      `${badgeTipo(t, "", 'style="font-size:7px;padding:1px 4px"')}`
    ).join('');

    return `<div class="cob-par">
      <div class="cob-par__header">
        <div class="cob-par__pk">
          ${sprA?`<img src="${sprA}" alt="${nomA}">`:''}<span>${nomA}</span>
        </div>
        <div class="cob-par__sinergia" style="border-color:${colorNivel}40;background:${colorNivel}10">
          <span style="color:${colorNivel};font-size:16px;font-weight:800">${par.score}</span>
          <span style="font-size:9px;color:${colorNivel}">Sinergia ${nivel}</span>
        </div>
        <div class="cob-par__pk">
          ${sprB?`<img src="${sprB}" alt="${nomB}">`:''}<span>${nomB}</span>
        </div>
      </div>
      ${par.aCubreB.length ? `<div class="cob-par__detalle">
        <span style="font-size:9px;color:var(--texto-muted)">${nomB} cubre debilidades de ${nomA}:</span>
        <div style="display:flex;gap:3px;flex-wrap:wrap;margin-top:2px">${listaCubreAB}</div>
      </div>` : ''}
      ${par.bCubreA.length ? `<div class="cob-par__detalle">
        <span style="font-size:9px;color:var(--texto-muted)">${nomA} cubre debilidades de ${nomB}:</span>
        <div style="display:flex;gap:3px;flex-wrap:wrap;margin-top:2px">${listasCubreBA}</div>
      </div>` : ''}
      ${!par.aCubreB.length && !par.bCubreA.length
        ? `<div class="cob-par__detalle"><span style="font-size:9px;color:var(--texto-muted)">Sin sinergia defensiva entre este par</span></div>`
        : ''}
    </div>`;
  }).join('');
}

// navegarA ya incluye renderizarCobertura() directamente

/* ═══════════════════════════════════════════════════════════════
   COBERTURA — MODO "VS RIVAL"
   Comparación de combate: mi equipo (auto) vs equipo rival
   (manual), con recomendación de selección 3 de 6.
═══════════════════════════════════════════════════════════════ */

const cobRivalEstado = {
  equipo: [null, null, null, null, null, null],
  modoActivo: 'mio' // 'mio' | 'rival'
};

// ── Cambiar entre modo "Mi Equipo" y "Vs Rival" ───────────────
function cobCambiarModo(modo) {
  cobRivalEstado.modoActivo = modo;

  document.getElementById('cobToggleMio').classList.toggle('cob-toggle--activo', modo === 'mio');
  document.getElementById('cobToggleRival').classList.toggle('cob-toggle--activo', modo === 'rival');
  document.getElementById('cobModoMio').style.display   = modo === 'mio'   ? 'block' : 'none';
  document.getElementById('cobModoRival').style.display = modo === 'rival' ? 'block' : 'none';

  const sub = document.getElementById('cobSubtitulo');
  const btn = document.getElementById('cobBtnActualizar');
  if (modo === 'mio') {
    sub.textContent = 'Cobertura ofensiva, defensiva y huecos del equipo actual';
    btn.innerHTML = '<i class="ti ti-refresh"></i> Actualizar';
    btn.setAttribute('onclick', 'renderizarCobertura()');
    renderizarCobertura();
  } else {
    sub.textContent = 'Compara tu equipo contra el rival antes del combate clasificatorio';
    btn.innerHTML = '<i class="ti ti-refresh"></i> Actualizar comparación';
    btn.setAttribute('onclick', 'cobRenderizarVsRival()');
    cobInicializarModoRival();
  }
}

// ── Inicializar el modo rival al entrar ───────────────────────
function cobInicializarModoRival() {
  const misPokemon = miEquipo.filter(Boolean);
  const sinEquipo = document.getElementById('cobRivalSinMiEquipo');
  const contenido = document.getElementById('cobRivalContenido');

  if (!misPokemon.length) {
    sinEquipo.style.display = 'flex';
    contenido.style.display = 'none';
    return;
  }
  sinEquipo.style.display = 'none';
  contenido.style.display = 'block';

  cobRenderizarSlotsRival();
  cobRenderizarVsRival();
}

// ── Búsqueda de Pokémon rival ──────────────────────────────────
function cobRivalBuscar(termino) {
  const cont = document.getElementById('cobRivalSugerencias');

  if (!termino || termino.length < 2) {
    cont.innerHTML = ''; cont.style.display = 'none'; return;
  }
  if (!estado.cargadoCompleto) {
    cont.innerHTML = '<div class="calc-sug-item calc-sug-item--info">Carga la Pokédex primero</div>';
    cont.style.display = 'block'; return;
  }
  // No mostrar slots llenos
  const llenos = cobRivalEstado.equipo.filter(Boolean).length;
  if (llenos >= 6) {
    cont.innerHTML = '<div class="calc-sug-item calc-sug-item--info">Equipo rival completo (6/6)</div>';
    cont.style.display = 'block'; return;
  }

  const term = termino.toLowerCase().trim();
  const res = estado.pokemonCache
    .filter(p => p.name.toLowerCase().includes(term) || String(p.id).includes(term))
    .slice(0, 8);

  if (!res.length) {
    cont.innerHTML = '<div class="calc-sug-item calc-sug-item--info">Sin resultados</div>';
    cont.style.display = 'block'; return;
  }

  cont.innerHTML = res.map(p => {
    const nom = p.name.charAt(0).toUpperCase() + p.name.slice(1);
    const spr = p.sprites?.front_default || '';
    return `<div class="calc-sug-item" onclick="cobRivalAgregar(${p.id})">
      ${spr ? `<img src="${spr}" alt="${nom}">` : ''}
      <span class="calc-sug-num">#${String(p.id).padStart(3,'0')}</span>
      <span>${nom}</span>
    </div>`;
  }).join('');
  cont.style.display = 'block';
}

// ── Agregar Pokémon rival al primer slot libre ────────────────
function cobRivalAgregar(id) {
  const pk = estado.pokemonCache.find(p => p.id === id);
  if (!pk) return;

  const slotLibre = cobRivalEstado.equipo.findIndex(s => s === null);
  if (slotLibre === -1) {
    mostrarToast('⚠️ El equipo rival ya tiene 6 Pokémon', 'err');
    return;
  }

  cobRivalEstado.equipo[slotLibre] = pk;

  document.getElementById('cobRivalInput').value = '';
  document.getElementById('cobRivalSugerencias').style.display = 'none';

  cobRenderizarSlotsRival();
  cobRenderizarVsRival();
  mostrarToast(`✅ ${pk.name.charAt(0).toUpperCase()+pk.name.slice(1)} añadido al rival`, 'ok');
}

// ── Quitar Pokémon rival de un slot ───────────────────────────
function cobRivalQuitar(idx) {
  cobRivalEstado.equipo[idx] = null;
  cobRenderizarSlotsRival();
  cobRenderizarVsRival();
}

// ── Limpiar todo el equipo rival ──────────────────────────────
function cobLimpiarRival() {
  cobRivalEstado.equipo = [null, null, null, null, null, null];
  cobRenderizarSlotsRival();
  cobRenderizarVsRival();
  mostrarToast('🔄 Equipo rival limpiado', 'ok');
}

// ── Renderizar los 6 slots del rival ───────────────────────────
function cobRenderizarSlotsRival() {
  const cont = document.getElementById('cobRivalSlots');
  const ocupados = cobRivalEstado.equipo.filter(Boolean).length;
  document.getElementById('cobRivalContador').textContent = `${ocupados}/6`;

  cont.innerHTML = cobRivalEstado.equipo.map((pk, idx) => {
    if (!pk) {
      return `<div class="cob-rival-slot cob-rival-slot--vacio">
        <i class="ti ti-plus"></i>
      </div>`;
    }
    const nom = pk.name.charAt(0).toUpperCase() + pk.name.slice(1);
    const spr = pk.sprites?.front_default || '';
    const tipos = pk.types.map(t => badgeTipo(t.type.name, '', 'style="font-size:7px;padding:1px 4px"')).join('');
    return `<div class="cob-rival-slot cob-rival-slot--lleno">
      <button class="cob-rival-slot__quitar" onclick="cobRivalQuitar(${idx})" title="Quitar">
        <i class="ti ti-x"></i>
      </button>
      ${spr ? `<img src="${spr}" alt="${nom}">` : ''}
      <span>${nom}</span>
      <div class="cob-rival-slot__tipos">${tipos}</div>
    </div>`;
  }).join('');
}

// ── Velocidad base de un Pokémon ──────────────────────────────
function cobVelBase(pk) {
  return pk.stats.find(s => s.stat.name === 'speed')?.base_stat ?? 50;
}

// ── Calcular puntaje de matchup de UN Pokémon mío contra
//    TODO el equipo rival (para la recomendación 3v3) ──────────
function cobPuntajeMatchup(miPk, rivales) {
  let puntos = 0;
  const miVel = cobVelBase(miPk);

  rivales.forEach(riv => {
    // Cuánto daño puedo hacerle yo (con STAB)
    const miAtaque = cobMultOfensivo(miPk, null, riv); // ver función abajo, soporta dual type
    // Cuánto daño me puede hacer él
    const suAtaque = cobMultOfensivo(riv, null, miPk);

    if (miAtaque >= 3)      puntos += 2;   // súper efectivo con STAB
    else if (miAtaque >= 2.25) puntos += 1; // STAB neutral fuerte
    if (suAtaque >= 3)      puntos -= 2;   // me golpea fuerte
    else if (suAtaque === 0) puntos += 1;  // soy inmune a su STAB

    // Velocidad: pequeño bonus si soy más rápido
    if (miVel > cobVelBase(riv)) puntos += 0.5;
  });

  return puntos;
}

// ── Multiplicador ofensivo de un Pokémon completo (con sus 1-2
//    tipos y STAB) contra OTRO Pokémon completo (con sus 1-2
//    tipos de defensa). Devuelve el mejor multiplicador posible. ─
function cobMultOfensivoVs(atacante, defensor) {
  const tiposAtk = atacante.types.map(t => t.type.name);
  const tiposDef = defensor.types.map(t => t.type.name);
  let mejor = 0;
  tiposAtk.forEach(tAtk => {
    let mult = 1;
    tiposDef.forEach(tDef => {
      mult *= (MULT[tAtk]?.[tDef] ?? 1);
    });
    const conStab = mult * 1.5;
    if (conStab > mejor) mejor = conStab;
  });
  return mejor;
}

// Sobrescribimos cobMultOfensivo para aceptar firma flexible
// (mantiene compatibilidad con el modo "Mi Equipo" que la llama
//  con un tipo simple, y añade soporte para Pokémon completo)
function cobMultOfensivo(atacanteOTipo, tipoDefensorSimple, defensorPokemon) {
  // Uso original: cobMultOfensivo(pokemon, tipoDefensorString)
  if (typeof tipoDefensorSimple === 'string') {
    const tiposPk = atacanteOTipo.types.map(t => t.type.name);
    let mejor = 0;
    tiposPk.forEach(tipoAtk => {
      const m = (MULT[tipoAtk]?.[tipoDefensorSimple] ?? 1) * 1.5;
      if (m > mejor) mejor = m;
    });
    return mejor;
  }
  // Uso nuevo: cobMultOfensivo(pokemonAtacante, null, pokemonDefensor)
  return cobMultOfensivoVs(atacanteOTipo, defensorPokemon);
}

// ── Renderizado principal del modo Vs Rival ────────────────────
function cobRenderizarVsRival() {
  const mios   = miEquipo.filter(Boolean);
  const rivales = cobRivalEstado.equipo.filter(Boolean);

  const resultadoEl = document.getElementById('cobRivalResultado');
  if (!rivales.length) {
    resultadoEl.style.display = 'none';
    return;
  }
  resultadoEl.style.display = 'block';

  cobVsRenderizarComparacion(mios, rivales);
  cobVsRenderizarVentajas(mios, rivales);
  cobVsRenderizarVelocidad(mios, rivales);
  cobVsRenderizarMatriz(mios, rivales);
  cobVsRenderizarRecomendados(mios, rivales);
}

// ── Comparación visual de equipos (sprites lado a lado) ───────
function cobVsRenderizarComparacion(mios, rivales) {
  const cont = document.getElementById('cobVsEquipos');
  const renderLado = (lista, esRival) => lista.map(pk => {
    const nom = pk.name.charAt(0).toUpperCase() + pk.name.slice(1);
    const spr = pk.sprites?.front_default || '';
    const tipos = pk.types.map(t => badgeTipo(t.type.name, '', 'style="font-size:7px;padding:1px 4px"')).join('');
    return `<div class="cob-vs-pk ${esRival ? 'cob-vs-pk--rival' : 'cob-vs-pk--mio'}">
      ${spr ? `<img src="${spr}" alt="${nom}">` : ''}
      <span>${nom}</span>
      <div class="cob-vs-pk__tipos">${tipos}</div>
    </div>`;
  }).join('');

  cont.innerHTML = `
    <div class="cob-vs-lado">
      <div class="cob-vs-lado__titulo" style="color:#22c55e"><i class="ti ti-shield"></i> TU EQUIPO (${mios.length})</div>
      <div class="cob-vs-lado__grid">${renderLado(mios, false)}</div>
    </div>
    <div class="cob-vs-divisor"><i class="ti ti-swords"></i></div>
    <div class="cob-vs-lado">
      <div class="cob-vs-lado__titulo" style="color:#ef4444"><i class="ti ti-swords"></i> EQUIPO RIVAL (${rivales.length})</div>
      <div class="cob-vs-lado__grid">${renderLado(rivales, true)}</div>
    </div>`;
}

// ── Ventajas mías vs rival, y del rival vs mí ──────────────────
function cobVsRenderizarVentajas(mios, rivales) {
  // Mis ventajas: tipos rivales que algún Pokémon mío golpea ×2+ con STAB
  const misVentajas = [];
  TODOS_TIPOS.forEach(tipoRival => {
    const rivalesDeEseTipo = rivales.filter(r => r.types.some(t => t.type.name === tipoRival));
    if (!rivalesDeEseTipo.length) return;
    let mejor = 0, quien = null;
    mios.forEach(miPk => {
      const m = cobMultOfensivo(miPk, tipoRival);
      if (m > mejor) { mejor = m; quien = miPk; }
    });
    if (mejor >= 3) {
      misVentajas.push({ tipo: tipoRival, mult: mejor, quien: quien.name, afecta: rivalesDeEseTipo.map(r=>r.name) });
    }
  });

  // Ventajas del rival: tipos míos que algún rival golpea ×2+ con STAB
  const ventajasRival = [];
  TODOS_TIPOS.forEach(tipoMio => {
    const miosDeEseTipo = mios.filter(m => m.types.some(t => t.type.name === tipoMio));
    if (!miosDeEseTipo.length) return;
    let mejor = 0, quien = null;
    rivales.forEach(rivPk => {
      const m = cobMultOfensivo(rivPk, tipoMio);
      if (m > mejor) { mejor = m; quien = rivPk; }
    });
    if (mejor >= 3) {
      ventajasRival.push({ tipo: tipoMio, mult: mejor, quien: quien.name, afecta: miosDeEseTipo.map(m=>m.name) });
    }
  });

  // Mis resistencias clave: tipos rivales que mi equipo resiste/inmune
  const misResistencias = [];
  const tiposRivalesUnicos = [...new Set(rivales.flatMap(r => r.types.map(t => t.type.name)))];
  tiposRivalesUnicos.forEach(tipoRival => {
    const queLoResisten = mios.filter(m => calcularMultiplicador(tipoRival, m.types.map(t=>t.type.name)) < 1);
    if (queLoResisten.length) {
      misResistencias.push({ tipo: tipoRival, count: queLoResisten.length, quienes: queLoResisten.map(m=>m.name) });
    }
  });

  const nombreCap = n => n.charAt(0).toUpperCase() + n.slice(1);

  document.getElementById('cobMisVentajas').innerHTML = misVentajas.length
    ? misVentajas.map(v => `
      <div class="cob-tipo-item cob-tipo-item--ok" title="${v.afecta.map(nombreCap).join(', ')}">
        ${badgeTipo(v.tipo)}
        <span class="cob-tipo-quien">${nombreCap(v.quien)} ×${v.mult.toFixed(1)}</span>
      </div>`).join('')
    : '<span class="cob-vacio">Sin ventajas claras detectadas todavía</span>';

  document.getElementById('cobVentajasRival').innerHTML = ventajasRival.length
    ? ventajasRival.map(v => `
      <div class="cob-tipo-item cob-tipo-item--mal" title="Afecta a: ${v.afecta.map(nombreCap).join(', ')}">
        ${badgeTipo(v.tipo)}
        <span class="cob-tipo-quien" style="color:#fca5a5">${nombreCap(v.quien)} ×${v.mult.toFixed(1)}</span>
      </div>`).join('')
    : '<span class="cob-vacio cob-vacio--ok">El rival no tiene ventajas claras sobre ti</span>';

  document.getElementById('cobMisResistencias').innerHTML = misResistencias.length
    ? misResistencias.map(r => `
      <div class="cob-tipo-item cob-tipo-item--res" title="${r.quienes.map(nombreCap).join(', ')}">
        ${badgeTipo(r.tipo)}
        <span class="cob-tipo-quien">${r.count} Pokémon</span>
      </div>`).join('')
    : '<span class="cob-vacio">Sin resistencias clave detectadas</span>';
}

// ── Comparación de velocidad entre ambos equipos ──────────────
function cobVsRenderizarVelocidad(mios, rivales) {
  const cont = document.getElementById('cobVelComparacion');
  const nombreCap = n => n.charAt(0).toUpperCase() + n.slice(1);

  const miosOrdenados = [...mios].sort((a,b) => cobVelBase(b) - cobVelBase(a));
  const rivalesOrdenados = [...rivales].sort((a,b) => cobVelBase(b) - cobVelBase(a));

  const miMasRapido = miosOrdenados[0];
  const rivalMasRapido = rivalesOrdenados[0];
  const yoGanoVelocidad = cobVelBase(miMasRapido) > cobVelBase(rivalMasRapido);

  cont.innerHTML = `
    <div class="cob-vel-resumen">
      <div class="cob-vel-resumen__lado">
        <span style="font-size:9px;color:var(--texto-muted)">Tu más rápido</span>
        <strong style="color:${yoGanoVelocidad?'#22c55e':'#fff'}">${nombreCap(miMasRapido.name)}</strong>
        <span class="cob-vel-num">${cobVelBase(miMasRapido)}</span>
      </div>
      <i class="ti ${yoGanoVelocidad ? 'ti-chevron-left' : 'ti-chevron-right'}" style="color:${yoGanoVelocidad?'#22c55e':'#ef4444'};font-size:18px"></i>
      <div class="cob-vel-resumen__lado">
        <span style="font-size:9px;color:var(--texto-muted)">Rival más rápido</span>
        <strong style="color:${!yoGanoVelocidad?'#ef4444':'#fff'}">${nombreCap(rivalMasRapido.name)}</strong>
        <span class="cob-vel-num">${cobVelBase(rivalMasRapido)}</span>
      </div>
    </div>
    <div class="cob-vel-lista">
      ${miosOrdenados.map(p => `<div class="cob-vel-item"><span>${nombreCap(p.name)}</span><div class="cob-vel-barra"><div style="width:${Math.min(100, cobVelBase(p)/200*100)}%;background:#22c55e"></div></div><span>${cobVelBase(p)}</span></div>`).join('')}
      <div class="cob-vel-sep"></div>
      ${rivalesOrdenados.map(p => `<div class="cob-vel-item"><span>${nombreCap(p.name)}</span><div class="cob-vel-barra"><div style="width:${Math.min(100, cobVelBase(p)/200*100)}%;background:#ef4444"></div></div><span>${cobVelBase(p)}</span></div>`).join('')}
    </div>`;
}

// ── Matriz Pokémon vs Pokémon (mejor multiplicador con STAB) ──
function cobVsRenderizarMatriz(mios, rivales) {
  const tabla = document.getElementById('cobMatrizVs');
  const nombreCap = n => n.charAt(0).toUpperCase() + n.slice(1);

  const thead = `<thead><tr>
    <th class="cob-mapa-th cob-mapa-th--tipo">Tú \\ Rival</th>
    ${rivales.map(r => `<th class="cob-mapa-th">${nombreCap(r.name)}</th>`).join('')}
  </tr></thead>`;

  const filas = mios.map(miPk => {
    const celdas = rivales.map(rivPk => {
      const m = cobMultOfensivo(miPk, null, rivPk);
      let cls = 'cob-celda--neutro', txt = '—';
      if (m >= 4.5)       { cls = 'cob-celda--x4';  txt = '×4'; }
      else if (m >= 3)    { cls = 'cob-celda--x2';  txt = '×2'; }
      else if (m >= 2.25) { cls = 'cob-celda--x15'; txt = '×1.5'; }
      else if (m > 0 && m < 1.5) { cls = 'cob-celda--x05'; txt = '½'; }
      else if (m === 0)   { cls = 'cob-celda--x0';  txt = '✕'; }
      return `<td class="cob-celda ${cls}">${txt}</td>`;
    }).join('');
    return `<tr>
      <td class="cob-mapa-td-tipo">${nombreCap(miPk.name)}</td>
      ${celdas}
    </tr>`;
  }).join('');

  tabla.innerHTML = `${thead}<tbody>${filas}</tbody>`;
}

// ── Selección recomendada de 3 Pokémon para el combate ────────
function cobVsRenderizarRecomendados(mios, rivales) {
  const cont = document.getElementById('cobRecomendadosGrid');
  const nombreCap = n => n.charAt(0).toUpperCase() + n.slice(1);

  // Calcular puntaje de cada Pokémon mío contra el equipo rival completo
  const puntuados = mios.map(pk => ({
    pk,
    puntaje: cobPuntajeMatchup(pk, rivales)
  })).sort((a,b) => b.puntaje - a.puntaje);

  const top3 = puntuados.slice(0, 3);
  const resto = puntuados.slice(3);

  const renderTarjeta = (item, posicion) => {
    const { pk, puntaje } = item;
    const spr = pk.sprites?.other?.['official-artwork']?.front_default || pk.sprites?.front_default || '';
    const tipos = pk.types.map(t => badgeTipo(t.type.name, '', 'style="font-size:8px"')).join('');
    const color = puntaje >= 3 ? '#22c55e' : puntaje >= 0 ? '#facc15' : '#ef4444';

    // Razón principal: mejor matchup individual contra el rival
    let mejorVictima = null, mejorMult = 0;
    rivales.forEach(riv => {
      const m = cobMultOfensivo(pk, null, riv);
      if (m > mejorMult) { mejorMult = m; mejorVictima = riv; }
    });
    const razon = mejorMult >= 3
      ? `Golpea súper efectivo a ${nombreCap(mejorVictima.name)} (×${mejorMult.toFixed(1)})`
      : 'Buen balance defensivo frente al equipo rival';

    return `<div class="cob-recom-card" style="border-color:${color}40">
      ${posicion ? `<div class="cob-recom-card__rank" style="background:${color}">${posicion}</div>` : ''}
      ${spr ? `<img src="${spr}" alt="${pk.name}">` : ''}
      <div class="cob-recom-card__nombre">${nombreCap(pk.name)}</div>
      <div class="cob-recom-card__tipos">${tipos}</div>
      <div class="cob-recom-card__puntaje" style="color:${color}">Puntaje: ${puntaje.toFixed(1)}</div>
      <div class="cob-recom-card__razon">${razon}</div>
    </div>`;
  };

  cont.innerHTML = `
    <div class="cob-recom-titulares">
      ${top3.map((item, i) => renderTarjeta(item, i+1)).join('')}
    </div>
    ${resto.length ? `
      <div class="cob-recom-suplentes-label">Suplentes (no recomendados como primera opción)</div>
      <div class="cob-recom-suplentes">
        ${resto.map(item => renderTarjeta(item, null)).join('')}
      </div>` : ''}
  `;
}
