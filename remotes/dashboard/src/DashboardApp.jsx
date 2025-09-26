import { useEffect, useState } from 'react'

export default function DashboardApp() {
  const [user, setUser] = useState(null)

  // leer user desde localStorage 
  useEffect(() => {
    try {
      const u = JSON.parse(localStorage.getItem('mf_user') || 'null')
      if (u) setUser(u)
    } catch {}
  }, [])

  const handleLogout = () => {
    // Notificación al host (cerrar sesión)
    window.parent.postMessage({ type: 'LOGOUT' }, '*')
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div>
          <span className="mr-4 text-gray-600">{user?.email ?? 'Usuario'}</span>
          <button onClick={handleLogout} className="px-4 py-2 bg-red-500 text-white rounded-lg">Cerrar sesión</button>
        </div>
      </header>
      <main>
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-white rounded-xl shadow">Tarjeta 1</div>
          <div className="p-6 bg-white rounded-xl shadow">Tarjeta 2</div>
          <div className="p-6 bg-white rounded-xl shadow">Tarjeta 3</div>
        </section>
      </main>
    </div>
  )
}
