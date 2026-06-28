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

// ── ESTADO ────────────────────────────────────────────────────
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
}

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
    `<span class="tipo-badge tipo-${t.type.name}">${TIPOS_ES[t.type.name] || t.type.name}</span>`
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
    `<span class="tipo-badge tipo-${t}">${TIPOS_ES[t]||t}</span>`
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
        ${lista.map(([t])=>`<span class="tipo-badge tipo-${t} ${cls}">${TIPOS_ES[t]}</span>`).join('')}
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
const _navegarAOriginal = navegarA;
// Override: cuando se abre equipo, sincronizar selector
const _navOriginal = navegarA;

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
      `<span class="tipo-badge tipo-${t.type.name}">${TIPOS_ES[t.type.name]||t.type.name}</span>`
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
      `<span class="tipo-badge tipo-${t.type.name}">${TIPOS_ES[t.type.name]||t.type.name}</span>`
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
      `<span class="tipo-badge tipo-${t}" title="${n} Pokémon">
        ${TIPOS_ES[t]||t} ${n>1?`×${n}`:''}
      </span>`
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

const TODOS_TIPOS = [
  'normal','fire','water','electric','grass','ice',
  'fighting','poison','ground','flying','psychic','bug',
  'rock','ghost','dragon','dark','steel','fairy'
];

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
        `<span class="tipo-badge tipo-${t.type.name}">${TIPOS_ES[t.type.name]||t.type.name}</span>`
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
        <span class="tipo-badge tipo-${atkTipo} td-tipo-badge">${TIPOS_ES[atkTipo]||atkTipo}</span>
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
                <span class="tipo-badge tipo-${it.tipo}" style="font-size:8px;padding:1px 5px">${TIPOS_ES[it.tipo]||it.tipo}</span>
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
    `<span class="tipo-badge tipo-${t.type.name}">${TIPOS_ES[t.type.name] || t.type.name}</span>`
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
        <span class="tipo-badge tipo-${tipoMov}">${TIPOS_ES[tipoMov] || tipoMov}</span>
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
    `<span class="tipo-badge tipo-${t.type.name}">${TIPOS_ES[t.type.name]||t.type.name}</span>`
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
            ${a.types.map(t=>`<span class="tipo-badge tipo-${t.type.name}">${TIPOS_ES[t.type.name]||t.type.name}</span>`).join('')}
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
            ${b.types.map(t=>`<span class="tipo-badge tipo-${t.type.name}">${TIPOS_ES[t.type.name]||t.type.name}</span>`).join('')}
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
              ${atkABuenos.map(t=>`<span class="tipo-badge tipo-${t}" style="font-size:8px">${TIPOS_ES[t]||t}</span>`).join('')}
            </div>` : ''}
          </div>
          <div class="anl-tipo-sep">↔</div>
          <div class="anl-tipo-bloque">
            <span style="font-size:10px;color:var(--texto-muted)">${nomB} → ${nomA}</span>
            <span class="anl-tipo-mult" style="color:${etqBvA.col}">${etqBvA.txt}</span>
            ${atkBBuenos.length ? `<div style="display:flex;gap:3px;margin-top:3px">
              ${atkBBuenos.map(t=>`<span class="tipo-badge tipo-${t}" style="font-size:8px">${TIPOS_ES[t]||t}</span>`).join('')}
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
              `<span class="tipo-badge tipo-${t}" style="font-size:9px">${TIPOS_ES[t]} ×${m}</span>`
            ).join('') || '<span style="font-size:11px;color:var(--texto-muted)">Sin debilidades notables</span>'}
          </div>
        </div>
        <div>
          <div class="anl-seccion__titulo"><i class="ti ti-alert-triangle" style="color:#ef4444"></i> DEBILIDADES DE ${nomB}</div>
          <div style="display:flex;flex-wrap:wrap;gap:4px;margin-top:4px">
            ${Object.entries(efAvsB).filter(([,m])=>m>=2).map(([t,m])=>
              `<span class="tipo-badge tipo-${t}" style="font-size:9px">${TIPOS_ES[t]} ×${m}</span>`
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
              `<span class="tipo-badge tipo-${t}" style="font-size:9px">${TIPOS_ES[t]}</span>`
            ).join('') || '<span style="font-size:11px;color:var(--texto-muted)">Sin inmunidades</span>'}
          </div>
        </div>
        <div>
          <div class="anl-seccion__titulo"><i class="ti ti-ban" style="color:#6b7280"></i> INMUNIDADES DE ${nomB}</div>
          <div style="display:flex;flex-wrap:wrap;gap:4px;margin-top:4px">
            ${Object.entries(efAvsB).filter(([,m])=>m===0).map(([t])=>
              `<span class="tipo-badge tipo-${t}" style="font-size:9px">${TIPOS_ES[t]}</span>`
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