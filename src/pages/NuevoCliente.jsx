import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ChevronLeft, Save } from 'lucide-react'
import { clientesDB } from '../utils/storage'
import { ORIGENES, USOS_CFDI, ENEAGRAMAS, FRASES_POR_ENEAGRAMA } from '../utils/constants'

const EMPTY = {
  nombre: '',
  email: '',
  telefono: '',
  fechaNacimiento: '',
  origen: '',
  origenDetalle: '',
  razonSocial: '',
  rfc: '',
  usoCfdi: '',
  domicilioFiscal: '',
  eneagrama: '',
  frasesSanadoras: [],
  notas: '',
  activo: true,
}

function Field({ label, children, hint }) {
  return (
    <div>
      <label className="block text-sm font-medium text-stone-700 mb-1">{label}</label>
      {children}
      {hint && <p className="text-xs text-stone-400 mt-1">{hint}</p>}
    </div>
  )
}

function Input({ className = '', ...props }) {
  return (
    <input
      className={`w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent ${className}`}
      {...props}
    />
  )
}

function Select({ children, ...props }) {
  return (
    <select
      className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
      {...props}
    >
      {children}
    </select>
  )
}

export default function NuevoCliente() {
  const { id } = useParams()
  const navigate = useNavigate()
  const editando = Boolean(id)
  const [form, setForm] = useState(EMPTY)
  const [nuevaFrase, setNuevaFrase] = useState('')
  const [errores, setErrores] = useState({})

  useEffect(() => {
    if (editando) {
      const cliente = clientesDB.get(id)
      if (cliente) setForm({ ...EMPTY, ...cliente })
    }
  }, [id, editando])

  function set(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (errores[field]) setErrores((e) => ({ ...e, [field]: '' }))
  }

  function agregarFrase() {
    const frase = nuevaFrase.trim()
    if (!frase) return
    set('frasesSanadoras', [...(form.frasesSanadoras || []), frase])
    setNuevaFrase('')
  }

  function agregarFraseSugerida(frase) {
    if (form.frasesSanadoras?.includes(frase)) return
    set('frasesSanadoras', [...(form.frasesSanadoras || []), frase])
  }

  function quitarFrase(idx) {
    set('frasesSanadoras', form.frasesSanadoras.filter((_, i) => i !== idx))
  }

  function validar() {
    const e = {}
    if (!form.nombre.trim()) e.nombre = 'El nombre es obligatorio'
    setErrores(e)
    return Object.keys(e).length === 0
  }

  function guardar(e) {
    e.preventDefault()
    if (!validar()) return
    const data = { ...form, eneagrama: form.eneagrama ? Number(form.eneagrama) : null }
    if (editando) {
      clientesDB.update(id, data)
      navigate(`/clientes/${id}`)
    } else {
      const nuevo = clientesDB.create(data)
      navigate(`/clientes/${nuevo.id}`)
    }
  }

  const sugeridas = form.eneagrama ? FRASES_POR_ENEAGRAMA[Number(form.eneagrama)] || [] : []

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <button
        onClick={() => navigate(editando ? `/clientes/${id}` : '/clientes')}
        className="flex items-center gap-1 text-stone-500 hover:text-stone-700 text-sm mb-6"
      >
        <ChevronLeft size={16} /> Volver
      </button>

      <h2 className="text-2xl font-semibold text-stone-800 mb-8">
        {editando ? 'Editar cliente' : 'Nuevo cliente'}
      </h2>

      <form onSubmit={guardar} className="space-y-8">

        {/* Información básica */}
        <section>
          <h3 className="text-sm font-semibold text-stone-500 uppercase tracking-wide mb-4">
            Información básica
          </h3>
          <div className="space-y-4">
            <Field label="Nombre completo *">
              <Input
                value={form.nombre}
                onChange={(e) => set('nombre', e.target.value)}
                placeholder="Nombre Apellido"
              />
              {errores.nombre && <p className="text-xs text-rose-500 mt-1">{errores.nombre}</p>}
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Email">
                <Input
                  type="email"
                  value={form.email}
                  onChange={(e) => set('email', e.target.value)}
                  placeholder="correo@ejemplo.com"
                />
              </Field>
              <Field label="Teléfono">
                <Input
                  value={form.telefono}
                  onChange={(e) => set('telefono', e.target.value)}
                  placeholder="55 1234 5678"
                />
              </Field>
            </div>
            <Field label="Fecha de nacimiento">
              <Input
                type="date"
                value={form.fechaNacimiento}
                onChange={(e) => set('fechaNacimiento', e.target.value)}
              />
            </Field>
          </div>
        </section>

        {/* Origen */}
        <section>
          <h3 className="text-sm font-semibold text-stone-500 uppercase tracking-wide mb-4">
            ¿Cómo nos conoció?
          </h3>
          <div className="space-y-4">
            <Field label="Origen">
              <Select value={form.origen} onChange={(e) => set('origen', e.target.value)}>
                <option value="">Seleccionar...</option>
                {ORIGENES.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </Select>
            </Field>
            {(form.origen === 'recomendacion_paciente' || form.origen === 'recomendacion_colega') && (
              <Field label="¿Quién recomendó?">
                <Input
                  value={form.origenDetalle}
                  onChange={(e) => set('origenDetalle', e.target.value)}
                  placeholder="Nombre de quien recomendó"
                />
              </Field>
            )}
            {form.origen === 'otro' && (
              <Field label="Especificar">
                <Input
                  value={form.origenDetalle}
                  onChange={(e) => set('origenDetalle', e.target.value)}
                  placeholder="Cómo nos conoció..."
                />
              </Field>
            )}
          </div>
        </section>

        {/* Datos de factura */}
        <section>
          <h3 className="text-sm font-semibold text-stone-500 uppercase tracking-wide mb-1">
            Datos para factura
          </h3>
          <p className="text-xs text-stone-400 mb-4">Opcional — solo si requiere factura</p>
          <div className="space-y-4">
            <Field label="Razón social">
              <Input
                value={form.razonSocial}
                onChange={(e) => set('razonSocial', e.target.value)}
                placeholder="Nombre o razón social fiscal"
              />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="RFC">
                <Input
                  value={form.rfc}
                  onChange={(e) => set('rfc', e.target.value.toUpperCase())}
                  placeholder="XAXX010101000"
                />
              </Field>
              <Field label="Uso de CFDI">
                <Select value={form.usoCfdi} onChange={(e) => set('usoCfdi', e.target.value)}>
                  <option value="">Seleccionar...</option>
                  {USOS_CFDI.map((u) => (
                    <option key={u.value} value={u.value}>{u.label}</option>
                  ))}
                </Select>
              </Field>
            </div>
            <Field label="Domicilio fiscal">
              <Input
                value={form.domicilioFiscal}
                onChange={(e) => set('domicilioFiscal', e.target.value)}
                placeholder="Calle, número, colonia, ciudad, CP"
              />
            </Field>
          </div>
        </section>

        {/* Ficha terapéutica */}
        <section>
          <h3 className="text-sm font-semibold text-stone-500 uppercase tracking-wide mb-4">
            Ficha terapéutica
          </h3>
          <div className="space-y-4">
            <Field label="Tipo de Eneagrama">
              <Select value={form.eneagrama} onChange={(e) => set('eneagrama', e.target.value)}>
                <option value="">Sin determinar</option>
                {ENEAGRAMAS.map((e) => (
                  <option key={e.num} value={e.num}>
                    {e.num} — {e.nombre}
                  </option>
                ))}
              </Select>
              {form.eneagrama && (
                <p className="text-xs text-stone-400 mt-1">
                  {ENEAGRAMAS.find((e) => e.num === Number(form.eneagrama))?.descripcion}
                </p>
              )}
            </Field>

            {/* Frases sanadoras */}
            <Field label="Frases sanadoras">
              {sugeridas.length > 0 && (
                <div className="mb-2 flex flex-wrap gap-1">
                  {sugeridas.map((f) => (
                    <button
                      key={f}
                      type="button"
                      onClick={() => agregarFraseSugerida(f)}
                      className={`text-xs px-2 py-1 rounded-full border transition-colors ${
                        form.frasesSanadoras?.includes(f)
                          ? 'bg-teal-100 border-teal-300 text-teal-700'
                          : 'bg-stone-50 border-stone-200 text-stone-500 hover:bg-teal-50 hover:border-teal-200'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              )}
              <div className="flex gap-2 mb-2">
                <Input
                  value={nuevaFrase}
                  onChange={(e) => setNuevaFrase(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), agregarFrase())}
                  placeholder="Escribir frase personalizada y presionar Enter"
                />
                <button
                  type="button"
                  onClick={agregarFrase}
                  className="px-3 py-2 bg-teal-600 text-white rounded-lg text-sm hover:bg-teal-700"
                >
                  +
                </button>
              </div>
              {form.frasesSanadoras?.length > 0 && (
                <ul className="space-y-1">
                  {form.frasesSanadoras.map((f, i) => (
                    <li key={i} className="flex items-center justify-between text-sm text-stone-600 bg-stone-50 px-3 py-1.5 rounded-lg">
                      <span>{f}</span>
                      <button
                        type="button"
                        onClick={() => quitarFrase(i)}
                        className="text-stone-400 hover:text-rose-500 ml-2"
                      >
                        ×
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </Field>

            <Field label="Notas generales">
              <textarea
                value={form.notas}
                onChange={(e) => set('notas', e.target.value)}
                rows={4}
                placeholder="Observaciones, motivo de consulta, contexto..."
                className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
              />
            </Field>
          </div>
        </section>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors"
          >
            <Save size={15} />
            {editando ? 'Guardar cambios' : 'Crear cliente'}
          </button>
          <button
            type="button"
            onClick={() => navigate(editando ? `/clientes/${id}` : '/clientes')}
            className="px-5 py-2.5 rounded-lg text-sm text-stone-500 hover:bg-stone-100 transition-colors"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  )
}
