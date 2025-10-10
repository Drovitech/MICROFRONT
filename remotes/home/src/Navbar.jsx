import { useState } from 'react'

/*
Navbar.jsx
Props:
- title (string) - titulo que aparece
- onSearch(query) - callback al escribir en el search (debounce externo si quieres)
- onToggleSidebar() - para alternar sidebar (mobile)
- onLogout() - callback para cerrar sesión
 */

export default function Navbar({ title = 'Recepción', onSearch = () => {}, onToggleSidebar = () => {}, onLogout = () => {} }) {
  const [query, setQuery] = useState('')
  const [openNotif, setOpenNotif] = useState(false)

  function handleSearchChange(e) {
    const q = e.target.value
    setQuery(q)
    onSearch(q)
  }

  function handleLogout() {
    // limpia localstorage localmente
    localStorage.removeItem('mf_token')
    localStorage.removeItem('mf_user')
    // callback externo
    onLogout?.()
    // avisar al host
    window.parent?.postMessage?.({ type: 'LOGOUT' }, '*')
  }

  return (
    <div className="w-full bg-white border-b border-gray-200">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: hamburger (mobile) + logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={onToggleSidebar}
              className="md:hidden p-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-300"
              aria-label="Abrir menú"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold">R</div>
              <div className="hidden sm:block">
                <div className="text-sm font-semibold">{title}</div>
                <div className="text-xs text-gray-500">Área de recepción médica</div>
              </div>
            </div>
          </div>

          {/* Center: Search (hidden on very small screens) */}
          <div className="flex-1 flex justify-center px-4">
            <div className="w-full max-w-xl">
              <label htmlFor="search" className="sr-only">Buscar pacientes</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15z" />
                  </svg>
                </div>
                <input
                  id="search"
                  value={query}
                  onChange={handleSearchChange}
                  placeholder="Buscar paciente por nombre, documento o teléfono..."
                  className="block w-full pl-10 pr-4 py-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300"
                />
              </div>
            </div>
          </div>

          {/* Right: actions */}
          <div className="flex items-center gap-3">
            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setOpenNotif(!openNotif)}
                className="p-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                aria-label="Notificaciones"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </button>

              {openNotif && (
                <div className="absolute right-0 mt-2 w-64 bg-white border rounded shadow-lg z-50 p-2">
                  <div className="text-sm text-gray-700 font-medium mb-2">Notificaciones</div>
                  <div className="text-xs text-gray-500">No hay notificaciones nuevas</div>
                </div>
              )}
            </div>

            {/* Avatar + logout */}
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-sm font-medium text-gray-700">{(JSON.parse(localStorage.getItem('mf_user') || 'null')?.email) ?? 'Recepcionista'}</span>
                <span className="text-xs text-gray-500">Recepción</span>
              </div>

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                title="Cerrar sesión"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1" />
                </svg>
                <span className="hidden md:inline">Salir</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
