import { useEffect, useMemo, useState } from 'react'

/*
DashboardApp.jsx
- Tabla de usuarios ingresados
- Tabla de citas (filtro: All / Confirmed / Cancelled / Pending)
- Acciones para confirmar / cancelar citas
- Lectura/escritura en localStorage: mf_patients, mf_appointments
*/

const sampleAppointments = (patients = []) => {
  // Genera citas mock vinculadas a algunos pacientes (si existen)
  const statuses = ['pending', 'confirmed', 'cancelled']
  const pats = patients.length ? patients : [{ id: 1, nombres: 'Juan', apellidos: 'Pérez', numeroDocumento: '123' }]
  const base = pats.slice(0, 6)
  return base.map((p, i) => ({
    id: Date.now() + i,
    patientId: p.id || (p.numeroDocumento ?? `p-${i}`),
    patientName: `${p.nombres ?? 'N/A'} ${p.apellidos ?? ''}`.trim(),
    date: new Date(Date.now() + (i - 2) * 86400000).toISOString().slice(0, 10), // fechas cercanas
    time: `${9 + (i % 8)}:00`,
    status: statuses[i % statuses.length],
    notes: `Consulta ${i + 1}`
  }))
}

function SummaryCard({ title, value, className = '' }) {
  return (
    <div className={`p-4 bg-white rounded-xl shadow ${className}`}>
      <div className="text-sm text-gray-500">{title}</div>
      <div className="text-2xl font-semibold mt-2">{value}</div>
    </div>
  )
}

export default function DashboardApp() {
  const [patients, setPatients] = useState([])
  const [appointments, setAppointments] = useState([])
  const [filter, setFilter] = useState('all') // all | confirmed | cancelled | pending
  const [searchPatient, setSearchPatient] = useState('')
  const [searchAppointment, setSearchAppointment] = useState('')

  // Cargar datos desde localstorage
  useEffect(() => {
    try {
      const p = JSON.parse(localStorage.getItem('mf_patients') || '[]')
      setPatients(p)

      let a = JSON.parse(localStorage.getItem('mf_appointments') || 'null')
      if (!a) {
        // crear mocks si no existen
        a = sampleAppointments(p)
        localStorage.setItem('mf_appointments', JSON.stringify(a))
      }
      setAppointments(a)
    } catch (err) {
      console.error('Error leyendo storage', err)
      setPatients([])
      setAppointments([])
    }
  }, [])

  // Persistir citas
  const saveAppointments = (next) => {
    setAppointments(next)
    localStorage.setItem('mf_appointments', JSON.stringify(next))
  }

  // Contadores
  const counts = useMemo(() => {
    const totalUsers = patients.length
    const totalAppointments = appointments.length
    const confirmed = appointments.filter((a) => a.status === 'confirmed').length
    const cancelled = appointments.filter((a) => a.status === 'cancelled').length
    const pending = appointments.filter((a) => a.status === 'pending').length
    return { totalUsers, totalAppointments, confirmed, cancelled, pending }
  }, [patients, appointments])

  // Filtrado de citas según filtro y búsqueda
  const filteredAppointments = useMemo(() => {
    return appointments
      .filter((a) => (filter === 'all' ? true : a.status === filter))
      .filter((a) => {
        if (!searchAppointment) return true
        const q = searchAppointment.toLowerCase()
        return `${a.patientName} ${a.date} ${a.time} ${a.notes}`.toLowerCase().includes(q)
      })
  }, [appointments, filter, searchAppointment])

  // Filtrado de pacientes por búsqueda
  const filteredPatients = useMemo(() => {
    if (!searchPatient) return patients
    const q = searchPatient.toLowerCase()
    return patients.filter((p) => {
      return (
        (p.nombres ?? '').toLowerCase().includes(q) ||
        (p.apellidos ?? '').toLowerCase().includes(q) ||
        (p.numeroDocumento ?? '').toString().toLowerCase().includes(q) ||
        (p.email ?? '').toLowerCase().includes(q)
      )
    })
  }, [patients, searchPatient])

  // Acciones sobre cita
  const updateAppointmentStatus = (id, newStatus) => {
    const next = appointments.map((a) => (a.id === id ? { ...a, status: newStatus } : a))
    saveAppointments(next)
  }

  // Opcional: crear nueva cita para un paciente (demo)
  const createAppointmentForPatient = (patient) => {
    const newA = {
      id: Date.now(),
      patientId: patient.id || patient.numeroDocumento || `p-${Math.random().toString(36).slice(2, 6)}`,
      patientName: `${patient.nombres ?? ''} ${patient.apellidos ?? ''}`.trim(),
      date: new Date().toISOString().slice(0, 10),
      time: '10:00',
      status: 'pending',
      notes: 'Cita creada desde dashboard'
    }
    const next = [newA, ...appointments]
    saveAppointments(next)
  }

  // Render
  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
    <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Usuarios y gestión de citas</p>
      </div>

      {/* Botón de cerrar sesión con icono y tooltip */}
      <div className="relative group">
        <button
          onClick={() => {
            // limpiar storage
            localStorage.removeItem('mf_token')
            localStorage.removeItem('mf_user')

            // avisar al host que cierre sesión
            window.parent.postMessage({ type: 'LOGOUT' }, '*')
          }}
          className="flex items-center gap-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
        >
          {/* Icono de salida */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1" />
          </svg>
          <span className="hidden sm:inline">Cerrar sesión</span>
        </button>

        {/* Tooltip */}
        <span className="absolute -bottom-10 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition pointer-events-none">
          Cerrar sesión
        </span>
      </div>
    </header>

      <main className="space-y-6">
        {/* Summary cards */}
        <section className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <SummaryCard title="Usuarios ingresados" value={counts.totalUsers} />
          <SummaryCard title="Total de citas" value={counts.totalAppointments} />
          <SummaryCard title="Citas confirmadas" value={counts.confirmed} />
          <SummaryCard title="Citas canceladas" value={counts.cancelled} />
        </section>

        {/* Tabla de usuarios */}
        <section className="bg-white p-4 rounded-xl shadow">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
            <h2 className="text-lg font-semibold">Usuarios ingresados</h2>
            <div className="flex gap-2 items-center">
              <input
                placeholder="Buscar usuario por nombre, doc o email..."
                value={searchPatient}
                onChange={(e) => setSearchPatient(e.target.value)}
                className="p-2 border rounded w-full md:w-80"
              />
              <button
                onClick={() => {
                  // Crear cita para el primer usuario seleccionado (solo demo)
                  if (filteredPatients.length > 0) createAppointmentForPatient(filteredPatients[0])
                }}
                className="px-3 py-2 bg-indigo-600 text-white rounded"
                title="Crear cita demo para el primer usuario filtrado"
              >
                Crear cita demo
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead className="text-left text-sm text-gray-600 border-b">
                <tr>
                  <th className="py-2 px-3">#</th>
                  <th className="py-2 px-3">Documento</th>
                  <th className="py-2 px-3">Nombres</th>
                  <th className="py-2 px-3">Email</th>
                  <th className="py-2 px-3">Teléfono</th>
                  <th className="py-2 px-3">Ciudad</th>
                </tr>
              </thead>
              <tbody>
                {filteredPatients.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="p-4 text-center text-sm text-gray-500">
                      No hay usuarios registrados.
                    </td>
                  </tr>
                ) : (
                  filteredPatients.map((p, idx) => (
                    <tr key={p.id ?? p.numeroDocumento ?? idx} className="border-b">
                      <td className="py-2 px-3">{idx + 1}</td>
                      <td className="py-2 px-3">{p.numeroDocumento}</td>
                      <td className="py-2 px-3">{`${p.nombres ?? ''} ${p.apellidos ?? ''}`}</td>
                      <td className="py-2 px-3">{p.email}</td>
                      <td className="py-2 px-3">{p.telefono}</td>
                      <td className="py-2 px-3">{p.ciudad}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Appointments with filters */}
        <section className="bg-white p-4 rounded-xl shadow">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
            <h2 className="text-lg font-semibold">Citas</h2>

            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600">Filtrar:</label>
              <select value={filter} onChange={(e) => setFilter(e.target.value)} className="p-2 border rounded">
                <option value="all">Todas</option>
                <option value="pending">Pendientes</option>
                <option value="confirmed">Confirmadas</option>
                <option value="cancelled">Canceladas</option>
              </select>

              <input
                placeholder="Buscar cita (nombre, notas, fecha)..."
                value={searchAppointment}
                onChange={(e) => setSearchAppointment(e.target.value)}
                className="p-2 border rounded w-full md:w-80"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead className="text-left text-sm text-gray-600 border-b">
                <tr>
                  <th className="py-2 px-3">#</th>
                  <th className="py-2 px-3">Paciente</th>
                  <th className="py-2 px-3">Fecha</th>
                  <th className="py-2 px-3">Hora</th>
                  <th className="py-2 px-3">Estado</th>
                  <th className="py-2 px-3">Notas</th>
                  <th className="py-2 px-3">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredAppointments.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="p-4 text-center text-sm text-gray-500">
                      No hay citas para mostrar.
                    </td>
                  </tr>
                ) : (
                  filteredAppointments.map((a, idx) => (
                    <tr key={a.id} className="border-b">
                      <td className="py-2 px-3">{idx + 1}</td>
                      <td className="py-2 px-3">{a.patientName}</td>
                      <td className="py-2 px-3">{a.date}</td>
                      <td className="py-2 px-3">{a.time}</td>
                      <td className="py-2 px-3">
                        <StatusBadge status={a.status} />
                      </td>
                      <td className="py-2 px-3">{a.notes}</td>
                      <td className="py-2 px-3">
                        <div className="flex gap-2">
                          <button
                            onClick={() => updateAppointmentStatus(a.id, 'confirmed')}
                            disabled={a.status === 'confirmed'}
                            className={`px-2 py-1 rounded text-sm ${a.status === 'confirmed' ? 'bg-gray-200 text-gray-500' : 'bg-green-600 text-white'}`}
                          >
                            Confirmar
                          </button>
                          <button
                            onClick={() => updateAppointmentStatus(a.id, 'cancelled')}
                            disabled={a.status === 'cancelled'}
                            className={`px-2 py-1 rounded text-sm ${a.status === 'cancelled' ? 'bg-gray-200 text-gray-500' : 'bg-red-500 text-white'}`}
                          >
                            Cancelar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  )
}

// Componente badge
function StatusBadge({ status = 'pending' }) {
  const map = {
    confirmed: { text: 'Confirmada', cls: 'bg-green-100 text-green-800' },
    cancelled: { text: 'Cancelada', cls: 'bg-red-100 text-red-800' },
    pending: { text: 'Pendiente', cls: 'bg-yellow-100 text-yellow-800' }
  }
  const s = map[status] || map.pending
  return <span className={`px-2 py-1 rounded text-xs font-medium ${s.cls}`}>{s.text}</span>
}
