import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Check, X } from 'lucide-react'
import { consultasDB, clientesDB } from '../utils/storage'
import { ESTADOS_CONSULTA, TIPOS_CONSULTA } from '../utils/constants'

const ESTADOS_FILTER = [
  { value: '', label: 'Todas' },
  ...ESTADOS_CONSULTA,
]

function estadoColor(estado) {
  const map = {
    programada: 'bg-amber-100 text-amber-700',
    realizada: 'bg-teal-100 text-teal-700',
    cancelada: 'bg-stone-100 text-stone-400',
  }
  return map[estado] || 'bg-stone-100 text-stone-500'
}

const FORM_EMPTY = {
  clienteId: '',
  fecha: '',
  hora: '',
  duracion: 60,
  tipo: 'individual',
  estado: 'programada',
  monto: '',
  notas: '',
  facturado: false,
}

export default function Agenda() {
  const [consultas, setConsultas] = useState([])
  const [clientes, setClientes] = useState([])
  const [filtroEstado, setFiltroEstado] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(FORM_EMPTY)

  function reload() {
    setConsultas(consultasDB.getAll().sort((a, b) => (b.fecha + b.hora).localeCompare(a.fecha + a.hora)))
    setClientes(clientesDB.getAll())
  }

  useEffect(() => {
    reload()
  }, [])

  function set(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  function guardar(e) {
    e.preventDefault()
    consultasDB.create({ ...form, monto: Number(form.monto) || 0 })
    setForm(FORM_EMPTY)
    setShowForm(false)
    reload()
  }

  function cambiarEstado(id, estado) {
    consultasDB.update(id, { estado })
    reload()
  }

  function eliminar(id) {
    if (!confirm('¿Eliminar esta consulta?')) return
    consultasDB.delete(id)
    reload()
  }

  function nombreCliente(id) {
    return clientes.find((c) => c.id === id)?.nombre || 'Desconocido'
  }

  const filtradas = consultas.filter((c) => !filtroEstado || c.estado === filtroEstado)

  const hoy = new Date().toISOString().slice(0, 10)
  const proximas = filtradas.filter((c) => c.fecha >= hoy)
  const pasadas = filtradas.filter((c) => c.fecha < hoy)

  function formatFecha(fecha) {
    return new Date(fecha + 'T12:00:00').toLocaleDateString('es-MX', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
    })
  }

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-stone-800">Agenda</h2>
          <p className="text-stone-500 text-sm mt-0.5">{consultas.length} consultas en total</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          <Plus size={16} /> Nueva consulta
        </button>
      </div>

      {/* Filtros */}
      <div className="flex gap-2 mb-6">
        {ESTADOS_FILTER.map((e) => (
          <button
            key={e.value}
            onClick={() => setFiltroEstado(e.value)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              filtroEstado === e.value
                ? 'bg-teal-600 text-white'
                : 'bg-white border border-stone-200 text-stone-500 hover:bg-stone-50'
            }`}
          >
            {e.label}
          </button>
        ))}
      </div>

      {/* Form nueva consulta */}
      {showForm && (
        <form
          onSubmit={guardar}
          className="bg-white border border-stone-200 rounded-xl p-5 mb-6 space-y-3"
        >
          <h4 className="font-medium text-stone-700 text-sm mb-2">Nueva consulta</h4>
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className="text-xs text-stone-500 mb-1 block">Cliente *</label>
              <select
                required
                value={form.clienteId}
                onChange={(e) => set('clienteId', e.target.value)}
                className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="">Seleccionar cliente...</option>
                {clientes.map((c) => (
                  <option key={c.id} value={c.id}>{c.nombre}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-stone-500 mb-1 block">Fecha *</label>
              <input
                type="date"
                required
                value={form.fecha}
                onChange={(e) => set('fecha', e.target.value)}
                className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div>
              <label className="text-xs text-stone-500 mb-1 block">Hora</label>
              <input
                type="time"
                value={form.hora}
                onChange={(e) => set('hora', e.target.value)}
                className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div>
              <label className="text-xs text-stone-500 mb-1 block">Duración (min)</label>
              <input
                type="number"
                value={form.duracion}
                onChange={(e) => set('duracion', Number(e.target.value))}
                className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div>
              <label className="text-xs text-stone-500 mb-1 block">Monto ($)</label>
              <input
                type="number"
                value={form.monto}
                onChange={(e) => set('monto', e.target.value)}
                className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div>
              <label className="text-xs text-stone-500 mb-1 block">Tipo</label>
              <select
                value={form.tipo}
                onChange={(e) => set('tipo', e.target.value)}
                className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                {TIPOS_CONSULTA.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-stone-500 mb-1 block">Estado</label>
              <select
                value={form.estado}
                onChange={(e) => set('estado', e.target.value)}
                className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                {ESTADOS_CONSULTA.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="text-xs text-stone-500 mb-1 block">Notas</label>
            <textarea
              value={form.notas}
              onChange={(e) => set('notas', e.target.value)}
              rows={2}
              className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
            />
          </div>
          <div className="flex gap-2 pt-1">
            <button type="submit" className="flex items-center gap-1 bg-teal-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-teal-700">
              <Check size={14} /> Guardar
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="flex items-center gap-1 text-stone-500 px-3 py-2 rounded-lg text-sm hover:bg-stone-100">
              <X size={14} /> Cancelar
            </button>
          </div>
        </form>
      )}

      {filtradas.length === 0 && (
        <div className="text-center py-16 text-stone-400 text-sm">
          No hay consultas registradas aún.
        </div>
      )}

      {/* Próximas */}
      {proximas.length > 0 && (
        <section className="mb-8">
          <h3 className="text-xs font-semibold text-stone-400 uppercase tracking-wide mb-3">
            Próximas · {proximas.length}
          </h3>
          <div className="space-y-2">
            {proximas.map((c) => (
              <ConsultaCard
                key={c.id}
                c={c}
                nombreCliente={nombreCliente}
                formatFecha={formatFecha}
                onCambiarEstado={cambiarEstado}
                onEliminar={eliminar}
              />
            ))}
          </div>
        </section>
      )}

      {/* Pasadas */}
      {pasadas.length > 0 && (
        <section>
          <h3 className="text-xs font-semibold text-stone-400 uppercase tracking-wide mb-3">
            Historial · {pasadas.length}
          </h3>
          <div className="space-y-2">
            {pasadas.map((c) => (
              <ConsultaCard
                key={c.id}
                c={c}
                nombreCliente={nombreCliente}
                formatFecha={formatFecha}
                onCambiarEstado={cambiarEstado}
                onEliminar={eliminar}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

function ConsultaCard({ c, nombreCliente, formatFecha, onCambiarEstado, onEliminar }) {
  return (
    <div className="bg-white rounded-xl border border-stone-100 px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="text-center min-w-[48px]">
          <p className="text-xs text-stone-400">{formatFecha(c.fecha).split(' ')[0]}</p>
          <p className="text-lg font-semibold text-stone-700">{formatFecha(c.fecha).split(' ')[1]}</p>
          <p className="text-xs text-stone-400">{formatFecha(c.fecha).split(' ')[2]}</p>
        </div>
        <div className="w-px h-10 bg-stone-100" />
        <div>
          <Link to={`/clientes/${c.clienteId}`} className="font-medium text-stone-700 text-sm hover:text-teal-600">
            {nombreCliente(c.clienteId)}
          </Link>
          <div className="flex gap-2 text-xs text-stone-400 mt-0.5">
            {c.hora && <span>{c.hora}</span>}
            <span>{c.duracion} min</span>
            {c.monto > 0 && <span>${c.monto.toLocaleString()}</span>}
            <span className="capitalize">{c.tipo}</span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className={`text-xs px-2 py-0.5 rounded-full ${estadoColor(c.estado)}`}>
          {ESTADOS_CONSULTA.find((e) => e.value === c.estado)?.label}
        </span>
        {c.estado === 'programada' && (
          <button
            onClick={() => onCambiarEstado(c.id, 'realizada')}
            className="text-xs text-stone-400 hover:text-teal-600"
            title="Marcar realizada"
          >
            <Check size={14} />
          </button>
        )}
        <button
          onClick={() => onEliminar(c.id)}
          className="text-stone-300 hover:text-rose-500 text-xs"
          title="Eliminar"
        >
          <X size={13} />
        </button>
      </div>
    </div>
  )
}

function estadoColor(estado) {
  const map = {
    programada: 'bg-amber-50 text-amber-700',
    realizada: 'bg-teal-50 text-teal-700',
    cancelada: 'bg-stone-100 text-stone-400',
  }
  return map[estado] || 'bg-stone-100 text-stone-500'
}
