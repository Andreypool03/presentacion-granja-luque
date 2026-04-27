export const ENEAGRAMAS = [
  { num: 1, nombre: 'El Perfeccionista', descripcion: 'Busca mejorar el mundo con principios' },
  { num: 2, nombre: 'El Ayudador', descripcion: 'Quiere ser necesitado y amado' },
  { num: 3, nombre: 'El Triunfador', descripcion: 'Busca el éxito y el reconocimiento' },
  { num: 4, nombre: 'El Individualista', descripcion: 'Busca autenticidad e identidad única' },
  { num: 5, nombre: 'El Investigador', descripcion: 'Busca conocimiento y autonomía' },
  { num: 6, nombre: 'El Leal', descripcion: 'Busca seguridad y apoyo' },
  { num: 7, nombre: 'El Entusiasta', descripcion: 'Busca experiencias y posibilidades' },
  { num: 8, nombre: 'El Desafiador', descripcion: 'Busca control e independencia' },
  { num: 9, nombre: 'El Pacificador', descripcion: 'Busca paz y armonía interior' },
]

export const FRASES_POR_ENEAGRAMA = {
  1: ['Me permito ser imperfecto/a y aún así valioso/a', 'Hago lo mejor que puedo y eso es suficiente'],
  2: ['Merezco recibir tanto como doy', 'Mis necesidades también importan'],
  3: ['Mi valor no depende de mis logros', 'Soy suficiente sin hacer nada'],
  4: ['Pertenezco y soy bienvenido/a', 'Mi singularidad es un regalo, no una carga'],
  5: ['Puedo confiar en el mundo y en mi propio saber', 'Tengo suficiente energía para participar plenamente'],
  6: ['Confío en mí mismo/a y en el proceso', 'Soy seguro/a y capaz de enfrentar lo que viene'],
  7: ['El presente contiene todo lo que necesito', 'Puedo quedarme con lo que es y encontrar plenitud'],
  8: ['Puedo ser fuerte y vulnerable al mismo tiempo', 'Confiar en otros es una fortaleza, no una debilidad'],
  9: ['Mi presencia y mis opiniones importan', 'Tomar acción me conecta conmigo mismo/a'],
}

export const ORIGENES = [
  { value: 'redes_sociales', label: 'Redes Sociales / Publicidad' },
  { value: 'recomendacion_paciente', label: 'Recomendación de paciente' },
  { value: 'recomendacion_colega', label: 'Recomendación de colega' },
  { value: 'busqueda_web', label: 'Búsqueda en internet' },
  { value: 'otro', label: 'Otro' },
]

export const USOS_CFDI = [
  { value: 'G03', label: 'G03 — Gastos en general' },
  { value: 'D01', label: 'D01 — Honorarios médicos' },
  { value: 'D02', label: 'D02 — Gastos médicos por incapacidad o discapacidad' },
  { value: 'S01', label: 'S01 — Sin efectos fiscales' },
  { value: 'P01', label: 'P01 — Por definir' },
]

export const ESTADOS_CONSULTA = [
  { value: 'programada', label: 'Programada' },
  { value: 'realizada', label: 'Realizada' },
  { value: 'cancelada', label: 'Cancelada' },
]

export const TIPOS_CONSULTA = [
  { value: 'individual', label: 'Individual' },
  { value: 'circulo', label: 'Círculo Terapéutico' },
]
