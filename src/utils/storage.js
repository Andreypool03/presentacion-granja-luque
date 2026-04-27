const KEYS = {
  clientes: 'erika_clientes',
  consultas: 'erika_consultas',
  circulos: 'erika_circulos',
}

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
}

function load(key) {
  try {
    return JSON.parse(localStorage.getItem(KEYS[key]) || '[]')
  } catch {
    return []
  }
}

function persist(key, items) {
  localStorage.setItem(KEYS[key], JSON.stringify(items))
}

// ── Clientes ──────────────────────────────────────────────────────────────────

export const clientesDB = {
  getAll() {
    return load('clientes')
  },
  get(id) {
    return load('clientes').find((c) => c.id === id) || null
  },
  create(data) {
    const items = load('clientes')
    const item = { ...data, id: uid(), fechaAlta: new Date().toISOString() }
    persist('clientes', [...items, item])
    return item
  },
  update(id, data) {
    const items = load('clientes').map((c) =>
      c.id === id ? { ...c, ...data, id } : c
    )
    persist('clientes', items)
    return items.find((c) => c.id === id)
  },
  delete(id) {
    persist('clientes', load('clientes').filter((c) => c.id !== id))
  },
}

// ── Consultas ─────────────────────────────────────────────────────────────────

export const consultasDB = {
  getAll() {
    return load('consultas')
  },
  getByCliente(clienteId) {
    return load('consultas').filter((c) => c.clienteId === clienteId)
  },
  get(id) {
    return load('consultas').find((c) => c.id === id) || null
  },
  create(data) {
    const items = load('consultas')
    const item = { ...data, id: uid(), creadoEn: new Date().toISOString() }
    persist('consultas', [...items, item])
    return item
  },
  update(id, data) {
    const items = load('consultas').map((c) =>
      c.id === id ? { ...c, ...data, id } : c
    )
    persist('consultas', items)
    return items.find((c) => c.id === id)
  },
  delete(id) {
    persist('consultas', load('consultas').filter((c) => c.id !== id))
  },
}

// ── Círculos Terapéuticos ──────────────────────────────────────────────────────

export const circulosDB = {
  getAll() {
    return load('circulos')
  },
  get(id) {
    return load('circulos').find((c) => c.id === id) || null
  },
  create(data) {
    const items = load('circulos')
    const item = { ...data, id: uid(), creadoEn: new Date().toISOString() }
    persist('circulos', [...items, item])
    return item
  },
  update(id, data) {
    const items = load('circulos').map((c) =>
      c.id === id ? { ...c, ...data, id } : c
    )
    persist('circulos', items)
    return items.find((c) => c.id === id)
  },
  delete(id) {
    persist('circulos', load('circulos').filter((c) => c.id !== id))
  },
}

// ── Seed demo data ────────────────────────────────────────────────────────────

export function seedDemoData() {
  if (load('clientes').length > 0) return

  const clientes = [
    {
      id: 'demo1',
      nombre: 'Laura Martínez',
      email: 'laura@ejemplo.com',
      telefono: '5512345678',
      fechaNacimiento: '1988-03-15',
      origen: 'recomendacion_paciente',
      origenDetalle: 'María García',
      razonSocial: '',
      rfc: '',
      usoCfdi: '',
      domicilioFiscal: '',
      eneagrama: 4,
      frasesSanadoras: ['Pertenezco y soy bienvenida', 'Mi singularidad es un regalo'],
      notas: 'Primera sesión muy productiva. Trabaja temas de identidad y autoestima.',
      fechaAlta: '2025-01-10T10:00:00.000Z',
      activo: true,
    },
    {
      id: 'demo2',
      nombre: 'Carlos Reyes',
      email: 'carlos@ejemplo.com',
      telefono: '5598765432',
      fechaNacimiento: '1975-07-22',
      origen: 'redes_sociales',
      origenDetalle: '',
      razonSocial: 'Reyes Construcciones S.A. de C.V.',
      rfc: 'REC750722AB1',
      usoCfdi: 'G03',
      domicilioFiscal: 'Av. Insurgentes 120, CDMX',
      eneagrama: 8,
      frasesSanadoras: ['Confiar en otros es una fortaleza', 'Puedo ser fuerte y vulnerable'],
      notas: 'Trabaja presión laboral y relaciones de poder.',
      fechaAlta: '2025-02-03T11:30:00.000Z',
      activo: true,
    },
    {
      id: 'demo3',
      nombre: 'Sofía Herrera',
      email: 'sofia@ejemplo.com',
      telefono: '5567891234',
      fechaNacimiento: '1995-11-08',
      origen: 'busqueda_web',
      origenDetalle: '',
      razonSocial: '',
      rfc: '',
      usoCfdi: '',
      domicilioFiscal: '',
      eneagrama: 2,
      frasesSanadoras: ['Merezco recibir tanto como doy', 'Mis necesidades también importan'],
      notas: 'Proceso de duelo y límites con familia de origen.',
      fechaAlta: '2025-03-18T09:00:00.000Z',
      activo: true,
    },
  ]

  const hoy = new Date()
  const proxima = new Date(hoy)
  proxima.setDate(hoy.getDate() + 2)
  const pasada = new Date(hoy)
  pasada.setDate(hoy.getDate() - 7)

  const consultas = [
    {
      id: 'c1',
      clienteId: 'demo1',
      fecha: pasada.toISOString().slice(0, 10),
      hora: '10:00',
      duracion: 60,
      tipo: 'individual',
      estado: 'realizada',
      monto: 800,
      facturado: false,
      notas: 'Se exploró el patrón de vergüenza.',
      creadoEn: pasada.toISOString(),
    },
    {
      id: 'c2',
      clienteId: 'demo2',
      fecha: pasada.toISOString().slice(0, 10),
      hora: '12:00',
      duracion: 60,
      tipo: 'individual',
      estado: 'realizada',
      monto: 800,
      facturado: true,
      notas: 'Trabajamos el miedo a perder el control.',
      creadoEn: pasada.toISOString(),
    },
    {
      id: 'c3',
      clienteId: 'demo1',
      fecha: proxima.toISOString().slice(0, 10),
      hora: '10:00',
      duracion: 60,
      tipo: 'individual',
      estado: 'programada',
      monto: 800,
      facturado: false,
      notas: '',
      creadoEn: new Date().toISOString(),
    },
    {
      id: 'c4',
      clienteId: 'demo3',
      fecha: proxima.toISOString().slice(0, 10),
      hora: '16:00',
      duracion: 60,
      tipo: 'individual',
      estado: 'programada',
      monto: 800,
      facturado: false,
      notas: '',
      creadoEn: new Date().toISOString(),
    },
  ]

  persist('clientes', clientes)
  persist('consultas', consultas)
  persist('circulos', [])
}
