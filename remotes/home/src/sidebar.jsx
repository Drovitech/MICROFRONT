import{ useEffect } from 'react'

/*
Sidebar.jsx (versión completa)
- Drawer móvil + sidebar desktop
- Incluye iconos inline (sin dependencias)
- Fallback seguro para iconos ausentes (no rompe el render)
Props:
- active (string)
- collapsed (bool)
- onNavigate(key)
- mobileOpen (bool)
- onClose()
 */

const items = [
  { key: 'dashboard', label: 'Dashboard', icon: ChartIcon },
  { key: 'patients', label: 'Pacientes', icon: UsersIcon },
  { key: 'appointments', label: 'Citas', icon: CalendarIcon },
  { key: 'register', label: 'Registrar paciente', icon: PlusIcon },
  { key: 'settings', label: 'Configuración', icon: CogIcon }
]

export default function Sidebar({ active = 'dashboard', collapsed = false, onNavigate = () => {}, mobileOpen = false, onClose = () => {} }) {
  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape' && mobileOpen) onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [mobileOpen, onClose])

  return (
    <>
      {/* Desktop */}
      <aside className={`hidden md:flex md:flex-col bg-white border-r border-gray-200 p-4 ${collapsed ? 'w-20' : 'w-64'}`} aria-hidden={false}>
        <div className="mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold">R</div>
            {!collapsed && <div className="text-lg font-semibold">Recepción</div>}
          </div>
        </div>

        <nav className="flex-1 space-y-1" aria-label="Main navigation">
          {items.map((it) => (
            <SidebarItem key={it.key} item={it} active={active === it.key} collapsed={collapsed} onClick={() => onNavigate(it.key)} />
          ))}
        </nav>

        <div className="mt-auto">
          <button onClick={() => onNavigate('help')} className="w-full text-left px-3 py-2 rounded hover:bg-gray-50 text-sm text-gray-600">Ayuda</button>
        </div>
      </aside>

      {/* Mobile drawer */}
      <div className={`fixed inset-0 z-40 md:hidden ${mobileOpen ? '' : 'pointer-events-none'}`} aria-hidden={!mobileOpen}>
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-black/40 transition-opacity ${mobileOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={onClose}
          data-testid="sidebar-backdrop"
        />

        {/* Drawer panel */}
        <aside
          data-sidebar="mobile"
          className={`absolute left-0 top-0 bottom-0 z-50 w-72 bg-white shadow-lg transform transition-transform ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}
          role="dialog"
          aria-modal="true"
          aria-label="Menú de navegación"
        >
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold">R</div>
              <div className="text-lg font-semibold">Recepción</div>
            </div>
            <button onClick={onClose} aria-label="Cerrar menú" className="p-2 rounded hover:bg-gray-100">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <nav className="p-4 space-y-1" aria-label="Mobile navigation">
            {items.map((it) => (
              <button
                key={it.key}
                onClick={() => {
                  try {
                    onNavigate(it.key)
                  } catch (err) {
                    console.error('onNavigate error', err)
                  }
                  onClose()
                }}
                className={`flex items-center gap-3 w-full px-3 py-2 rounded text-left ${active === it.key ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700 hover:bg-gray-50'}`}
                data-testid={`sidebar-item-${it.key}`}
              >
                <div className="w-6 h-6 flex items-center justify-center text-lg">
                  {/* seguro: intenta renderizar el icono; si falla, muestra un circulito */}
                  {renderIconSafe(it.icon)}
                </div>
                <div className="text-sm font-medium">{it.label}</div>
              </button>
            ))}
          </nav>

          <div className="p-4 border-t">
            <button onClick={() => { onNavigate('help'); onClose(); }} className="w-full text-left px-3 py-2 rounded hover:bg-gray-50 text-sm text-gray-600">Ayuda</button>
          </div>
        </aside>
      </div>
    </>
  )
}

/* Pequeño ayudante para renderizar íconos de forma segura (respaldo si no está definido o se lanzan errores) */
function renderIconSafe(IconComp) {
  try {
    if (!IconComp) return <FallbackIcon />
    return <IconComp />
  } catch (err) {
    console.error('Icon render error', err)
    return <FallbackIcon />
  }
}

/* Sidebar para escritorio */
function SidebarItem({ item, active, collapsed, onClick }) {
  return (
    <button onClick={onClick} className={`flex items-center gap-3 w-full px-3 py-2 mb-1 rounded ${active ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700 hover:bg-gray-50'}`} data-testid={`sidebar-desktop-${item.key}`}>
      <div className="w-6 h-6 flex items-center justify-center text-lg">
        {renderIconSafe(item.icon)}
      </div>
      {!collapsed && <div className="text-sm font-medium">{item.label}</div>}
    </button>
  )
}

/* Iconos*/
function ChartIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3v18h18" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V9m6 8V5" />
    </svg>
  )
}
function UsersIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87M16 11a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  )
}
function CalendarIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3M3 11h18M5 21h14a2 2 0 002-2V7H3v12a2 2 0 002 2z" />
    </svg>
  )
}
function PlusIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
  )
}
function CogIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0 .3.921 1.602.921 1.902 0 .3-.921 1.602-.921 1.902 0 .3.921 1.602.921 1.902 0" />
    </svg>
  )
}

/* Icono de respaldo cuando falta el icono o hay errores */
function FallbackIcon() {
  return (
    <div className="w-4 h-4 rounded-full bg-gray-300" aria-hidden="true" />
  )
}
