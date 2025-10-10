import { useState, useEffect } from 'react'
import Sidebar from './Sidebar'
import Navbar from './navbar'

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [active, setActive] = useState('Home - inicio')

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
    // aquí podrías cambiar vistas o rutas internas
  }

  const handleLogout = () => {
    // limpieza adicional si hace falta
    localStorage.removeItem('mf_token')
    localStorage.removeItem('mf_user')
    window.parent.postMessage({ type: 'LOGOUT' }, '*')
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar active={active} collapsed={false} onNavigate={handleNavigate} mobileOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col">
        <Navbar title="Recepción" onSearch={(q) => console.log('buscar', q)} onToggleSidebar={() => setSidebarOpen(true)} onLogout={handleLogout} />
        <main className="p-6">
          {/* Renderiza según active */}
          {active === 'dashboard' && <div>Panel principal</div>}
          {active === 'patients' && <div>Lista de pacientes</div>}
          {active === 'appointments' && <div>Gestión de citas</div>}
          {active === 'register' && <div>Registrar paciente</div>}
          {active === 'settings' && <div>Configuración</div>}
        </main>
      </div>
    </div>
  )
}
