import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Users, CalendarDays, CircleDot, TrendingUp, ArrowRight } from 'lucide-react'
import { clientesDB, consultasDB, circulosDB, seedDemoData } from '../utils/storage'
import { ORIGENES } from '../utils/constants'

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-stone-100">
      <div className={`inline-flex p-2 rounded-lg mb-3 ${color}`}>
        <Icon size={20} className="text-white" />
      </div>
      <p className="text-2xl font-semibold text-stone-800">{value}</p>
      <p className="text-sm text-stone-500 mt-0.5">{label}</p>
    </div>
  )
}

function origenLabel(val) {
  return ORIGENES.find((o) => o.value === val)?.label || 'Desconocido'
}

export default function Dashboard() {
  const [clientes, setClientes] = useState([])
  const [consultas, setConsultas] = useState([])
  const [circulos, setCirculos] = useState([])

  useEffect(() => {
    seedDemoData()
    setClientes(clientesDB.getAll())
    setConsultas(consultasDB.getAll())
    setCirculos(circulosDB.getAll())
  }, [])

  const hoy = new Date().toISOString().slice(0, 10)
  const mesActual = new Date().toISOString().slice(0, 7)

  const proximas = consultas
    .filter((c) => c.fecha >= hoy && c.estado === 'programada')
    .sort((a, b) => (a.fecha + a.hora).localeCompare(b.fecha + b.hora))
    .slice(0, 5)

  const consultasMes = consultas.filter(
    (c) => c.fecha.startsWith(mesActual) && c.estado === 'realizada'
  ).length

  const circulosActivos = circulos.filter((c) => c.estado === 'activo').length

  const origenCount = clientes.reduce((acc, c) => {
    acc[c.origen] = (acc[c.origen] || 0) + 1
    return acc
  }, {})

  function nombreCliente(id) {
    return clientesDB.get(id)?.nombre || 'Cliente'
  }

  function formatFecha(fecha) {
    const [y, m, d] = fecha.split('-')
    return `${d}/${m}/${y}`
  }

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-stone-800">Bienvenida, Erika</h2>
        <p className="text-stone-500 text-sm mt-1">
          {new Date().toLocaleDateString('es-MX', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={Users} label="Clientes activos" value={clientes.filter((c) => c.activo).length} color="bg-teal-600" />
        <StatCard icon={CalendarDays} label="Consultas este mes" value={consultasMes} color="bg-violet-500" />
        <StatCard icon={TrendingUp} label="Citas próximas" value={proximas.length} color="bg-amber-500" />
        <StatCard icon={CircleDot} label="Círculos activos" value={circulosActivos} color="bg-rose-500" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Próximas citas */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-stone-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-stone-800">Próximas citas</h3>
            <Link to="/agenda" className="text-teal-600 text-sm flex items-center gap-1 hover:underline">
              Ver agenda <ArrowRight size={14} />
            </Link>
          </div>
          {proximas.length === 0 ? (
            <p className="text-stone-400 text-sm py-6 text-center">No hay citas programadas</p>
          ) : (
            <div className="space-y-2">
              {proximas.map((c) => (
                <Link
                  key={c.id}
                  to={`/clientes/${c.clienteId}`}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-stone-50 transition-colors"
                >
                  <div>
                    <p className="text-sm font-medium text-stone-700">{nombreCliente(c.clienteId)}</p>
                    <p className="text-xs text-stone-400">
                      {formatFecha(c.fecha)} · {c.hora} · {c.duracion} min
                    </p>
                  </div>
                  <span className="text-xs bg-teal-50 text-teal-700 px-2 py-1 rounded-full capitalize">
                    {c.tipo}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Origen de clientes */}
        <div className="bg-white rounded-xl shadow-sm border border-stone-100 p-5">
          <h3 className="font-medium text-stone-800 mb-4">¿De dónde vienen?</h3>
          {clientes.length === 0 ? (
            <p className="text-stone-400 text-sm py-6 text-center">Sin datos aún</p>
          ) : (
            <div className="space-y-3">
              {Object.entries(origenCount).map(([origen, count]) => {
                const pct = Math.round((count / clientes.length) * 100)
                return (
                  <div key={origen}>
                    <div className="flex justify-between text-xs text-stone-600 mb-1">
                      <span>{origenLabel(origen)}</span>
                      <span className="font-medium">{count}</span>
                    </div>
                    <div className="h-1.5 bg-stone-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-teal-500 rounded-full"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          <div className="mt-5 pt-4 border-t border-stone-100">
            <Link to="/clientes/nuevo" className="text-sm text-teal-600 hover:underline flex items-center gap-1">
              + Agregar cliente
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
