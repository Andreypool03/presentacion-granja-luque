import { useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { ChevronLeft, Edit2, Trash2, Plus, Check, X } from 'lucide-react'
import { clientesDB, consultasDB } from '../utils/storage'
import { ORIGENES, USOS_CFDI, ENEAGRAMAS, ESTADOS_CONSULTA, TIPOS_CONSULTA } from '../utils/constants'

const TABS = ['Datos', 'Ficha terapéutica', 'Historial de consultas']

function origenLabel(val) {
  return ORIGENES.find((o) => o.value === val)?.label || '—'
}

function cfdiLabel(val) {
  return USOS_CFDI.find((u) => u.value === val)?.label || val || '—'
}

function estadoBadge(estado) {
  const map = {
    programada: 'bg-amber-50 text-amber-700',
    realizada: 'bg-teal-50 text-teal-700',
    cancelada: 'bg-stone-100 text-stone-400 line-through',
  }
  return map[estado] || 'bg-stone-100 text-stone-500'
}

function Row({ label, value }) {
  if (!value) return null
  return (
    <div className="flex gap-4 py-2 border-b border-stone-50">
      <span className="text-sm text-stone-400 w-40 flex-shrink-0">{label}</span>
      <span className="text-sm text-stone-700">{value}</span>
    </div>
  )
}

const CONSULTA_EMPTY = {
  fecha: '',
  hora: '',
  duracion: 60,
  tipo: 'individual',
  estado: 'programada',
  monto: '',
  notas: '',
  facturado: false,
}

export default function ClienteDetalle() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [cliente, setCliente] = useState(null)
  const [consultas, setConsultas] = useState([])
  const [tab, setTab] = useState(0)
  const [showForm, setShowForm] = useState(false)
  const [consultaForm, setConsultaForm] = useState(CONSULTA_EMPTY)

  function reload() {
    setCliente(clientesDB.get(id))
    setConsultas(consultasDB.getByCliente(id).sort((a, b) => b.fecha.localeCompare(a.fecha)))
  }

  useEffect(() => {
    reload()
  }, [id])

  function eliminarCliente() {
    if (!confirm(`¿Eliminar a ${cliente.nombre}? Esta acción no se puede deshacer.`)) return
    clientesDB.delete(id)
    navigate('/clientes')
  }

  function setConsultaField(field, value) {
    setConsultaForm((prev) => ({ ...prev, [field]: value }))
  }

  function guardarConsulta(e) {
    e.preventDefault()
    consultasDB.create({ ...consultaForm, clienteId: id, monto: Number(consultaForm.monto) || 0 })
    setConsultaForm(CONSULTA_EMPTY)
    setShowForm(false)
    reload()
  }

  function cambiarEstado(cId, estado) {
    consultasDB.update(cId, { estado })
    reload()
  }

  function eliminarConsulta(cId) {
    if (!confirm('¿Eliminar esta consulta?')) return
    consultasDB.delete(cId)
    reload()
  }

  if (!cliente) {
    return (
      <div className="p-8 text-stone-400">
        Cliente no encontrado.{' '}
        <Link to="/clientes" className="text-teal-600 hover:underline">
          Volver
        </Link>
      </div>
    )
  }

  const eneagrama = cliente.eneagrama
    ? ENEAGRAMAS.find((e) => e.num === cliente.eneagrama)
    : null

  return (
    <div className="p-8 max-w-3xl mx-auto">
      {/* Header */}
      <button
        onClick={() => navigate('/clientes')}
        className="flex items-center gap-1 text-stone-500 hover:text-stone-700 text-sm mb-6"
      >
        <ChevronLeft size={16} /> Clientes
      </button>

      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-semibold text-lg">
            {cliente.nombre.charAt(0)}
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-stone-800">{cliente.nombre}</h2>
            <p className="text-stone-400 text-sm">{cliente.email || cliente.telefono || 'Sin contacto'}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link
            to={`/clientes/${id}/editar`}
            className="flex items-center gap-1.5 text-sm text-stone-500 hover:text-stone-700 border border-stone-200 px-3 py-1.5 rounded-lg hover:bg-stone-50"
          >
            <Edit2 size={14} /> Editar
          </Link>
          <button
            onClick={eliminarCliente}
            className="flex items-center gap-1.5 text-sm text-rose-500 hover:text-rose-700 border border-rose-100 px-3 py-1.5 rounded-lg hover:bg-rose-50"
          >
            <Trash2 size={14} /> Eliminar
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-stone-200 mb-6">
        {TABS.map((t, i) => (
          <button
            key={i}
            onClick={() => setTab(i)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px ${
              tab === i
                ? 'border-teal-600 text-teal-700'
                : 'border-transparent text-stone-500 hover:text-stone-700'
            }`}
          >
            {t}
            {i === 2 && consultas.length > 0 && (
              <span className="ml-1.5 text-xs bg-stone-100 text-stone-500 px-1.5 py-0.5 rounded-full">
                {consultas.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab: Datos */}
      {tab === 0 && (
        <div className="space-y-6">
          <section>
            <h4 className="text-xs font-semibold text-stone-400 uppercase tracking-wide mb-3">Información personal</h4>
            <div className="bg-white rounded-xl border border-stone-100 p-4">
              <Row label="Nombre" value={cliente.nombre} />
              <Row label="Email" value={cliente.email} />
              <Row label="Teléfono" value={cliente.telefono} />
              <Row
                label="Fecha de nacimiento"
                value={cliente.fechaNacimiento ? new Date(cliente.fechaNacimiento + 'T12:00:00').toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' }) : null}
              />
              <Row label="Alta en sistema" value={new Date(cliente.fechaAlta).toLocaleDateString('es-MX')} />
            </div>
          </section>

          <section>
            <h4 className="text-xs font-semibold text-stone-400 uppercase tracking-wide mb-3">¿Cómo llegó?</h4>
            <div className="bg-white rounded-xl border border-stone-100 p-4">
              <Row label="Origen" value={origenLabel(cliente.origen)} />
              {cliente.origenDetalle && <Row label="Detalle" value={cliente.origenDetalle} />}
            </div>
          </section>

          {(cliente.razonSocial || cliente.rfc) && (
            <section>
              <h4 className="text-xs font-semibold text-stone-400 uppercase tracking-wide mb-3">Datos de factura</h4>
              <div className="bg-white rounded-xl border border-stone-100 p-4">
                <Row label="Razón social" value={cliente.razonSocial} />
                <Row label="RFC" value={cliente.rfc} />
                <Row label="Uso de CFDI" value={cfdiLabel(cliente.usoCfdi)} />
                <Row label="Domicilio fiscal" value={cliente.domicilioFiscal} />
              </div>
            </section>
          )}
        </div>
      )}

      {/* Tab: Ficha terapéutica */}
      {tab === 1 && (
        <div className="space-y-6">
          <section>
            <h4 className="text-xs font-semibold text-stone-400 uppercase tracking-wide mb-3">Eneagrama</h4>
            {eneagrama ? (
              <div className="bg-white rounded-xl border border-stone-100 p-5">
                <div className="flex items-center gap-3 mb-2">
                  <span className="w-10 h-10 rounded-full bg-teal-100 text-teal-700 font-bold text-lg flex items-center justify-center">
                    {eneagrama.num}
                  </span>
                  <div>
                    <p className="font-semibold text-stone-800">{eneagrama.nombre}</p>
                    <p className="text-sm text-stone-400">{eneagrama.descripcion}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-stone-50 rounded-xl border border-dashed border-stone-200 p-5 text-stone-400 text-sm text-center">
                Sin tipo de eneagrama asignado.{' '}
                <Link to={`/clientes/${id}/editar`} className="text-teal-600 hover:underline">
                  Editar ficha
                </Link>
              </div>
            )}
          </section>

          <section>
            <h4 className="text-xs font-semibold text-stone-400 uppercase tracking-wide mb-3">Frases sanadoras</h4>
            {cliente.frasesSanadoras?.length > 0 ? (
              <ul className="space-y-2">
                {cliente.frasesSanadoras.map((f, i) => (
                  <li key={i} className="bg-teal-50 border border-teal-100 rounded-lg px-4 py-3 text-sm text-teal-800 italic">
                    "{f}"
                  </li>
                ))}
              </ul>
            ) : (
              <div className="bg-stone-50 rounded-xl border border-dashed border-stone-200 p-5 text-stone-400 text-sm text-center">
                Sin frases asignadas.{' '}
                <Link to={`/clientes/${id}/editar`} className="text-teal-600 hover:underline">
                  Editar ficha
                </Link>
              </div>
            )}
          </section>

          {cliente.notas && (
            <section>
              <h4 className="text-xs font-semibold text-stone-400 uppercase tracking-wide mb-3">Notas generales</h4>
              <div className="bg-white rounded-xl border border-stone-100 p-4 text-sm text-stone-600 whitespace-pre-wrap">
                {cliente.notas}
              </div>
            </section>
          )}
        </div>
      )}

      {/* Tab: Historial */}
      {tab === 2 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-stone-500">
              {consultas.length} consulta{consultas.length !== 1 ? 's' : ''} registrada{consultas.length !== 1 ? 's' : ''}
            </p>
            <button
              onClick={() => setShowForm(!showForm)}
              className="flex items-center gap-1.5 text-sm bg-teal-600 hover:bg-teal-700 text-white px-3 py-1.5 rounded-lg transition-colors"
            >
              <Plus size={14} /> Nueva consulta
            </button>
          </div>

          {/* Form nueva consulta */}
          {showForm && (
            <form
              onSubmit={guardarConsulta}
              className="bg-white border border-stone-200 rounded-xl p-5 mb-4 space-y-3"
            >
              <h4 className="font-medium text-stone-700 text-sm mb-2">Nueva consulta</h4>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-stone-500 mb-1 block">Fecha</label>
                  <input
                    type="date"
                    required
                    value={consultaForm.fecha}
                    onChange={(e) => setConsultaField('fecha', e.target.value)}
                    className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-stone-500 mb-1 block">Hora</label>
                  <input
                    type="time"
                    value={consultaForm.hora}
                    onChange={(e) => setConsultaField('hora', e.target.value)}
                    className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-stone-500 mb-1 block">Duración (min)</label>
                  <input
                    type="number"
                    value={consultaForm.duracion}
                    onChange={(e) => setConsultaField('duracion', e.target.value)}
                    className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-stone-500 mb-1 block">Monto ($)</label>
                  <input
                    type="number"
                    value={consultaForm.monto}
                    onChange={(e) => setConsultaField('monto', e.target.value)}
                    className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-stone-500 mb-1 block">Tipo</label>
                  <select
                    value={consultaForm.tipo}
                    onChange={(e) => setConsultaField('tipo', e.target.value)}
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
                    value={consultaForm.estado}
                    onChange={(e) => setConsultaField('estado', e.target.value)}
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
                  value={consultaForm.notas}
                  onChange={(e) => setConsultaField('notas', e.target.value)}
                  rows={2}
                  placeholder="Notas de la sesión..."
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

          {consultas.length === 0 ? (
            <div className="text-center py-12 text-stone-400 text-sm">
              No hay consultas registradas para este cliente.
            </div>
          ) : (
            <div className="space-y-2">
              {consultas.map((c) => (
                <div key={c.id} className="bg-white rounded-xl border border-stone-100 p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-stone-700 text-sm">
                          {new Date(c.fecha + 'T12:00:00').toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long' })}
                          {c.hora && ` · ${c.hora}`}
                        </span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${estadoBadge(c.estado)}`}>
                          {ESTADOS_CONSULTA.find((e) => e.value === c.estado)?.label || c.estado}
                        </span>
                      </div>
                      <div className="flex gap-3 text-xs text-stone-400">
                        <span>{c.duracion} min</span>
                        {c.monto > 0 && <span>${c.monto.toLocaleString()}</span>}
                        {c.facturado && <span className="text-teal-600">Facturado</span>}
                        <span className="capitalize">{c.tipo}</span>
                      </div>
                      {c.notas && <p className="text-xs text-stone-500 mt-2">{c.notas}</p>}
                    </div>
                    <div className="flex gap-1">
                      {c.estado === 'programada' && (
                        <button
                          onClick={() => cambiarEstado(c.id, 'realizada')}
                          className="text-xs text-teal-600 hover:underline"
                        >
                          Marcar realizada
                        </button>
                      )}
                      <button
                        onClick={() => eliminarConsulta(c.id)}
                        className="text-xs text-stone-300 hover:text-rose-500 ml-2"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
