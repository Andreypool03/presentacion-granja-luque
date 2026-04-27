import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Clientes from './pages/Clientes'
import ClienteDetalle from './pages/ClienteDetalle'
import NuevoCliente from './pages/NuevoCliente'
import Agenda from './pages/Agenda'
import CirculoTerapeutico from './pages/CirculoTerapeutico'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="clientes" element={<Clientes />} />
          <Route path="clientes/nuevo" element={<NuevoCliente />} />
          <Route path="clientes/:id" element={<ClienteDetalle />} />
          <Route path="clientes/:id/editar" element={<NuevoCliente />} />
          <Route path="agenda" element={<Agenda />} />
          <Route path="circulo" element={<CirculoTerapeutico />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
