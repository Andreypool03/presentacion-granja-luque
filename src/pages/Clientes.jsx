import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, Plus, UserCircle } from 'lucide-react'
import { clientesDB } from '../utils/storage'
import { ORIGENES, ENEAGRAMAS } from '../utils/constants'

function origenLabel(val) {
  return ORIGENES.find((o) => o.value === val)?.label || '—'
}

function eneagramaLabel(num) {
  if (!num) return '—'
  const e = ENEAGRAMAS.find((e) => e.num === num)
  return e ? `${e.num} · ${e.nombre}` : '—'
}

function Badge({ children, color = 'stone' }) {
  const colors = {
    stone: 'bg-stone-100 text-stone-600',
    teal: 'bg-teal-50 text-teal-700',
    violet: 'bg-violet-50 text-violet-700',
    amber: 'bg-amber-50 text-amber-700',
  }
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full ${colors[color] || colors.stone}`}>
      {children}
    </span>
  )
}

export default function Clientes() {
  const [clientes, setClientes] = useState([])
  const [busqueda, setBusqueda] = useState('')

  useEffect(() => {
    setClientes(clientesDB.getAll())
  }, [])

  const filtrados = clientes.filter(
    (c) =>
      c.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      (c.email || '').toLowerCase().includes(busqueda.toLowerCase()) ||
      (c.telefono || '').includes(busqueda)
  )

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-stone-800">Clientes</h2>
          <p className="text-stone-500 text-sm mt-0.5">{clientes.length} registrados</p>
        </div>
        <Link
          to="/clientes/nuevo"
          className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          <Plus size={16} />
          Nuevo cliente
        </Link>
      </div>

      {/* Búsqueda */}
      <div className="relative mb-6">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
        <input
          type="text"
          placeholder="Buscar por nombre, email o teléfono..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 text-sm border border-stone-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
        />
      </div>

      {/* Lista */}
      {filtrados.length === 0 ? (
        <div className="text-center py-16 text-stone-400">
          {busqueda ? 'Sin resultados para esa búsqueda' : 'No hay clientes registrados aún'}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-stone-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-stone-100 bg-stone-50 text-stone-500 text-xs uppercase tracking-wide">
                <th className="px-5 py-3 text-left">Nombre</th>
                <th className="px-5 py-3 text-left">Contacto</th>
                <th className="px-5 py-3 text-left">Origen</th>
                <th className="px-5 py-3 text-left">Eneagrama</th>
                <th className="px-5 py-3 text-left">Alta</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-50">
              {filtrados.map((c) => (
                <tr
                  key={c.id}
                  className="hover:bg-stone-50 transition-colors cursor-pointer"
                  onClick={() => (window.location.href = `/clientes/${c.id}`)}
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-medium text-sm flex-shrink-0">
                        {c.nombre.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-stone-800">{c.nombre}</p>
                        {!c.activo && (
                          <span className="text-xs text-stone-400">Inactivo</span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-stone-500">
                    <p>{c.email || '—'}</p>
                    <p className="text-xs text-stone-400">{c.telefono || ''}</p>
                  </td>
                  <td className="px-5 py-4">
                    <Badge color={c.origen === 'redes_sociales' ? 'violet' : c.origen === 'recomendacion_paciente' ? 'teal' : 'stone'}>
                      {origenLabel(c.origen)}
                    </Badge>
                  </td>
                  <td className="px-5 py-4 text-stone-500">
                    {eneagramaLabel(c.eneagrama)}
                  </td>
                  <td className="px-5 py-4 text-stone-400 text-xs">
                    {c.fechaAlta ? new Date(c.fechaAlta).toLocaleDateString('es-MX') : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
