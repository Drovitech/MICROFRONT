import { useEffect, useState } from 'react'
import {
  ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid,
  BarChart, Bar, Legend,
  PieChart, Pie, Cell
} from 'recharts'

const lineData = [
  { name: 'Ene', users: 30 },
  { name: 'Feb', users: 45 },
  { name: 'Mar', users: 60 },
  { name: 'Abr', users: 75 },
  { name: 'May', users: 90 },
  { name: 'Jun', users: 120 },
]

const barData = [
  { name: 'Feature A', value: 400 },
  { name: 'Feature B', value: 300 },
  { name: 'Feature C', value: 300 },
  { name: 'Feature D', value: 200 },
]

const pieData = [
  { name: 'Suscriptores', value: 400 },
  { name: 'Visitantes', value: 300 },
  { name: 'Prueba', value: 300 }
]

const COLORS = ['#6366F1', '#06B6D4', '#F97316']

export default function DashboardApp() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    try {
      const u = JSON.parse(localStorage.getItem('mf_user') || 'null')
      if (u) setUser(u)
    } catch {}
  }, [])

  const handleLogout = () => {
    window.parent.postMessage({ type: 'LOGOUT' }, '*')
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-10">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Resumen y métricas</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-gray-600 hidden sm:inline">{user?.email ?? 'Usuario'}</span>
          <button onClick={handleLogout} className="px-3 py-2 bg-red-500 text-white rounded-lg shadow">Cerrar sesión</button>
        </div>
      </header>

      <main className="space-y-6">
        {/* KPIs */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 sm:p-6 bg-white rounded-xl shadow">
            <h3 className="text-xs text-gray-400">Usuarios activos</h3>
            <p className="text-xl sm:text-2xl font-semibold mt-2">1,234</p>
            <p className="text-xs text-green-600 mt-1">+12% vs semana</p>
          </div>
          <div className="p-4 sm:p-6 bg-white rounded-xl shadow">
            <h3 className="text-xs text-gray-400">Nuevas suscripciones</h3>
            <p className="text-xl sm:text-2xl font-semibold mt-2">312</p>
            <p className="text-xs text-red-500 mt-1">-3% vs semana</p>
          </div>
          <div className="p-4 sm:p-6 bg-white rounded-xl shadow">
            <h3 className="text-xs text-gray-400">Ingresos (mensual)</h3>
            <p className="text-xl sm:text-2xl font-semibold mt-2">$8,450</p>
            <p className="text-xs text-green-600 mt-1">+5% vs mes</p>
          </div>
        </section>

        {/* Charts: responsive */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="p-4 sm:p-6 bg-white rounded-xl shadow">
            <h4 className="text-md sm:text-lg font-semibold mb-2">Usuarios por mes</h4>
            <div style={{ width: '100%', height: 240 }}>
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

          <div className="p-4 sm:p-6 bg-white rounded-xl shadow">
            <h4 className="text-md sm:text-lg font-semibold mb-2">Uso por feature</h4>
            <div style={{ width: '100%', height: 240 }}>
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
          <div className="md:col-span-2 p-4 sm:p-6 bg-white rounded-xl shadow">
            <h4 className="text-md sm:text-lg font-semibold mb-2">Actividad reciente</h4>
            <ul className="space-y-2">
              <li className="p-3 border rounded-md bg-gray-50">Usuario <strong>ana@gmail.com</strong> se suscribió (hace 2h)</li>
              <li className="p-3 border rounded-md bg-gray-50">Reporte de error #54 cerrado (hace 6h)</li>
              <li className="p-3 border rounded-md bg-gray-50">Nuevo comentario en la entrada «Novedades» (hace 1d)</li>
            </ul>
          </div>

          <div className="p-4 sm:p-6 bg-white rounded-xl shadow">
            <h4 className="text-md sm:text-lg font-semibold mb-2">Distribución de usuarios</h4>
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
      </main>
    </div>
  )
}
