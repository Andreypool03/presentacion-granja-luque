import { NavLink, Outlet } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  CalendarDays,
  CircleDot,
} from 'lucide-react'

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/clientes', label: 'Clientes', icon: Users },
  { to: '/agenda', label: 'Agenda', icon: CalendarDays },
  { to: '/circulo', label: 'Círculo Terapéutico', icon: CircleDot },
]

export default function Layout() {
  return (
    <div className="flex h-screen overflow-hidden bg-stone-50">
      <aside className="w-60 bg-teal-900 text-white flex flex-col flex-shrink-0">
        <div className="px-6 py-5 border-b border-teal-700">
          <h1 className="text-lg font-semibold tracking-wide">Plataforma Erika</h1>
          <p className="text-teal-400 text-xs mt-0.5">Centro Terapéutico</p>
        </div>

        <nav className="flex-1 p-3 space-y-0.5">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-colors ${
                  isActive
                    ? 'bg-teal-700 text-white font-medium'
                    : 'text-teal-200 hover:bg-teal-800 hover:text-white'
                }`
              }
            >
              <Icon size={17} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="px-6 py-4 border-t border-teal-800">
          <p className="text-teal-500 text-xs">v1.0.0</p>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  )
}
