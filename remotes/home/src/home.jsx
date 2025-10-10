// Home.jsx
import { useState, useEffect, useMemo } from 'react'
import Sidebar from './Sidebar'
import Navbar from './navbar'
import {
  ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid,
  BarChart, Bar, Legend,
  PieChart, Pie, Cell
} from 'recharts'

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [active, setActive] = useState('dashboard') // <- cambiar inicial a 'dashboard' o la vista que prefieras

  // Bloquear scroll cuando drawer móvil está abierto
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [sidebarOpen])

  const handleNavigate = (key) => {
    setActive(key)
    // cerrar drawer en mobile
    setSidebarOpen(false)
    // si se desea abrir la micro-app de registro desde el sidebar:
    // if (key === 'register') window.parent.postMessage({ type: 'OPEN_REGISTER' }, '*')
  }

  const handleLogout = () => {
    // limpieza adicional si hace falta
    localStorage.removeItem('mf_token')
    localStorage.removeItem('mf_user')
    window.parent.postMessage({ type: 'LOGOUT' }, '*')
  }

  /* ---------------------------
     Datos de ejemplo para las gráficas
     Se puede remplazar por useMemo que derive de localStorage (mf_patients / mf_appointments)
  --------------------------- */
  const lineData = useMemo(() => [
    { name: 'Ene', users: 30 },
    { name: 'Feb', users: 45 },
    { name: 'Mar', users: 60 },
    { name: 'Abr', users: 75 },
    { name: 'May', users: 90 },
    { name: 'Jun', users: 120 },
  ], [])

  const barData = useMemo(() => [
    { name: 'Pacientes', value: 120 },
    { name: 'Citas', value: 80 },
    { name: 'Confirmadas', value: 55 },
    { name: 'Pendientes', value: 25 }
  ], [])

  const pieData = useMemo(() => [
    { name: 'Confirmadas', value: 55 },
    { name: 'Canceladas', value: 20 },
    { name: 'Pendientes', value: 25 }
  ], [])

  const COLORS = ['#6366F1', '#06B6D4', '#F97316']

  /* ---------------------------
     Render
  --------------------------- */
  return (
    <div className="flex min-h-screen">
      <Sidebar
        active={active}
        collapsed={false}
        onNavigate={handleNavigate}
        mobileOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col">
        <Navbar
          title="Recepción"
          onSearch={(q) => console.log('buscar', q)}
          onToggleSidebar={() => setSidebarOpen(true)}
          onLogout={handleLogout}
        />

        <main className="p-6">
          {/* Vista: DASHBOARD -> mostrar gráficos */}
          {active === 'dashboard' && (
            <>
              <div className="mb-4">
                <h2 className="text-2xl font-semibold">Dashboard</h2>
                <p className="text-sm text-gray-500 mt-1">Resumen y métricas principales</p>
              </div>

              <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                <div className="p-4 bg-white rounded-xl shadow">
                  <h4 className="text-md font-semibold mb-2">Usuarios por mes</h4>
                  <div style={{ width: '100%', height: 280 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={lineData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="users" stroke="#6366F1" strokeWidth={3} dot={{ r: 3 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="p-4 bg-white rounded-xl shadow">
                  <h4 className="text-md font-semibold mb-2">Resumen - Pacientes / Citas</h4>
                  <div style={{ width: '100%', height: 280 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={barData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="value" fill="#06B6D4" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </section>

              <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2 p-4 bg-white rounded-xl shadow">
                  <h4 className="text-md font-semibold mb-2">Actividad reciente</h4>
                  <ul className="space-y-2">
                    <li className="p-3 border rounded-md bg-gray-50">Paciente <strong>juan@hotmail.com</strong> registrado (hace 1h)</li>
                    <li className="p-3 border rounded-md bg-gray-50">Cita confirmada para <strong>María Pérez</strong> (hace 3h)</li>
                    <li className="p-3 border rounded-md bg-gray-50">Paciente <strong>ana@gmail.com</strong> editado (hace 1d)</li>
                  </ul>
                </div>

                <div className="p-4 bg-white rounded-xl shadow">
                  <h4 className="text-md font-semibold mb-2">Distribución de citas</h4>
                  <div style={{ width: '100%', height: 220 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius="80%" label>
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </section>
            </>
          )}

          {/* Vista: PACIENTES */}
          {active === 'patients' && (
            <>
              <h2 className="text-2xl font-semibold mb-2">Pacientes</h2>
              <div className="bg-white rounded-xl shadow p-4">
                <p className="text-sm text-gray-500">Visualización de la lista de pacientes.</p>
              </div>
            </>
          )}

          {/* Vista: CITAS */}
          {active === 'appointments' && (
            <>
              <h2 className="text-2xl font-semibold mb-2">Citas</h2>
              <div className="bg-white rounded-xl shadow p-4">
                <p className="text-sm text-gray-500">Gestión de citas: confirmar / cancelar / filtrar.</p>
              </div>
            </>
          )}

          {/* Vista: REGISTRAR */}
          {active === 'register' && (
            <>
              <h2 className="text-2xl font-semibold mb-2">Registrar paciente</h2>
              <div className="bg-white rounded-xl shadow p-4">
                <p className="text-sm text-gray-500">Aquí se puede abrir el formulario de registro (o la micro-app register).</p>
              </div>
            </>
          )}

          {/* Vista: SETTINGS */}
          {active === 'settings' && (
            <>
              <h2 className="text-2xl font-semibold mb-2">Configuración</h2>
              <div className="bg-white rounded-xl shadow p-4">
                <p className="text-sm text-gray-500">Opciones de configuración.</p>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  )
}
