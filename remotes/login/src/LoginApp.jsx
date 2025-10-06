import { useEffect, useState } from 'react'

/**
 * LoginApp.jsx
 * - Login + Registro
 * - Confirmación por modal antes de guardar (pedir la contraseña)
 * - Toasts para feedback (exito/ error)
 *
 * Nota: simula persistencia guardando pacientes en localStorage bajo la key 'mf_patients'
 */

function Toast({ id, type = 'info', message, onClose }) {
  // type: success | error | info
  const bg =
    type === 'success' ? 'bg-green-600' : type === 'error' ? 'bg-red-600' : 'bg-sky-600'
  return (
    <div
      className={`max-w-sm w-full ${bg} text-white px-4 py-3 rounded shadow-lg flex items-start gap-3`}
      role="status"
      aria-live="polite"
    >
      <div className="flex-shrink-0">
        {type === 'success' ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        ) : type === 'error' ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01" />
          </svg>
        )}
      </div>
      <div className="flex-1 text-sm leading-tight">{message}</div>
      <button onClick={() => onClose(id)} className="opacity-90 hover:opacity-100">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  )
}

function ToastContainer({ toasts, removeToast }) {
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-3">
      {toasts.map((t) => (
        <Toast key={t.id} {...t} onClose={removeToast} />
      ))}
    </div>
  )
}

function ModalConfirm({ open, onClose, onConfirm }) {
  const [confirmPass, setConfirmPass] = useState('')

  useEffect(() => {
    if (!open) setConfirmPass('')
  }, [open])

  if (!open) return null
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="fixed inset-0 bg-black/40" onClick={onClose} />

      <div className="relative max-w-md w-full bg-white rounded-2xl shadow-lg p-6 z-10">
        <h2 id="modal-title" className="text-lg font-semibold mb-3">
          Confirma tu contraseña
        </h2>
        <p className="text-sm text-gray-600 mb-4">
          Para guardar los cambios, por favor ingresa tu contraseña nuevamente y confirma.
        </p>

        <label className="block text-sm mb-1">Contraseña</label>
        <input
          type="password"
          value={confirmPass}
          onChange={(e) => setConfirmPass(e.target.value)}
          className="w-full p-2 border rounded mb-4"
          autoFocus
          aria-label="Confirma tu contraseña"
        />

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => {
              setConfirmPass('')
              onClose()
            }}
            className="px-3 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={() => onConfirm(confirmPass)}
            className="px-3 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  )
}

export default function LoginApp() {
  // Login
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPass, setLoginPass] = useState('')
  const [loginErr, setLoginErr] = useState('')

  // View: 'login' | 'register'
  const [view, setView] = useState('login')

  // Register form state
  const initialForm = {
    tipoDocumento: '',
    numeroDocumento: '',
    nombres: '',
    apellidos: '',
    fechaNacimiento: '',
    sexo: '',
    estadoCivil: '',
    direccion: '',
    telefono: '',
    email: '',
    departamento: '',
    ciudad: '',
    password: '',
    confirmPassword: ''
  }
  const [form, setForm] = useState(initialForm)

  // Modal open state
  const [modalOpen, setModalOpen] = useState(false)
  // We'll store the "submit attempt" in caso de querer confirmar luego
  const [pendingSave, setPendingSave] = useState(false)

  // Toasts
  const [toasts, setToasts] = useState([]) // {id, type, message}
  const addToast = (type, message, ttl = 4000) => {
    const id = Date.now() + Math.random().toString(36).slice(2, 7)
    setToasts((s) => [...s, { id, type, message }])
    if (ttl > 0) {
      setTimeout(() => removeToast(id), ttl)
    }
  }
  const removeToast = (id) => setToasts((s) => s.filter((t) => t.id !== id))

  // mock login credentials (solo para demo)
  const mock = { email: 'user@example.com', password: 'password123' }

  // --- login handler ---
  const handleLogin = (e) => {
    e.preventDefault()
    if (loginEmail === mock.email && loginPass === mock.password) {
      const token = 'token-mock'
      const user = { email: loginEmail }
      localStorage.setItem('mf_token', token)
      localStorage.setItem('mf_user', JSON.stringify(user))
      window.parent.postMessage({ type: 'LOGIN_SUCCESS', token, user }, '*')
    } else {
      setLoginErr('Credenciales incorrectas')
      addToast('error', 'Credenciales incorrectas')
      setTimeout(() => setLoginErr(''), 3000)
    }
  }

  // --- register handlers ---
  const handleInput = (e) => {
    const { name, value } = e.target
    setForm((s) => ({ ...s, [name]: value }))
  }

  // Open modal to confirm password before saving
  const trySave = (e) => {
    e.preventDefault()
    // Basic validation: check required fields quickly
    const required = [
      'tipoDocumento',
      'numeroDocumento',
      'nombres',
      'apellidos',
      'fechaNacimiento',
      'sexo',
      'estadoCivil',
      'direccion',
      'telefono',
      'email',
      'departamento',
      'ciudad',
      'password',
      'confirmPassword'
    ]
    for (const key of required) {
      if (!form[key] || form[key].toString().trim() === '') {
        addToast('error', 'Por favor completa todos los campos obligatorios.')
        return
      }
    }
    if (form.password !== form.confirmPassword) {
      addToast('error', 'La contraseña y su confirmación no coinciden.')
      return
    }
    // todo ok, abrir modal confirm
    setPendingSave(true)
    setModalOpen(true)
  }

  // Called when modal confirm submits the typed password
  const handleConfirmPassword = (typedPassword) => {
    setModalOpen(false)
    setPendingSave(false)
    // Verify typedPassword matches the password provided in the form
    if (typedPassword === form.password) {
      // Save patient to localStorage (simulación)
      try {
        const storageKey = 'mf_patients'
        const existing = JSON.parse(localStorage.getItem(storageKey) || '[]')
        const paciente = { id: Date.now(), ...form }
        existing.push(paciente)
        localStorage.setItem(storageKey, JSON.stringify(existing))

        // Success toast
        addToast('success', 'Paciente ingresado con éxito')
        // Reset form and switch to login
        setForm(initialForm)
        setView('login')
      } catch (err) {
        addToast('error', 'Error guardando paciente (revisa el storage).')
        console.error(err)
      }
    } else {
      addToast('error', 'Contraseña de confirmación incorrecta. No se guardaron los cambios.')
    }
  }

  // Cancel registration: clear form and back to login
  const handleCancelRegister = () => {
    setForm(initialForm)
    setView('login')
    addToast('info', 'Registro cancelado')
  }

  // Small helper to render select options (document types)
  const docTypes = [
    'Tarjeta de identidad',
    'Cédula de ciudadanía',
    'Cédula de extranjería',
    'Contraseña registraduría',
    'Pasaporte colombiano',
    'Pasaporte extranjero',
    'Permiso especial de permanencia',
    'Número establecido por la secretaria de educación',
    'Certificado de cabildo',
    'Número único de identificación personal',
    'Número de identificación personal',
    'Documento nacional de identificación venezolana',
    'Permiso por protección temporal',
    'Permiso temporal de permanencia'
  ]

  const departamentos = [
    'Amazonas',
    'Antioquía',
    'Arauca',
    'Atlántico',
    'Bolívar',
    'Boyacá',
    'Caldas',
    'Caquetá',
    'Casanare',
    'Cauca',
    'Cesar',
    'Chocó',
    'Córdoba',
    'Cundinamarca',
    'Guainía',
    'Guaviare',
    'Huila',
    'La Guajira',
    'Magdalena',
    'Meta',
    'Nariño',
    'Norte de Santander',
    'Putumayo',
    'Quindío',
    'Risaralda',
    'San Andrés y Providencia',
    'Santander',
    'Sucre',
    'Tolima',
    'Valle del Cauca',
    'Vaupés',
    'Vichada'
  ]

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-50 to-indigo-50 p-4">
      <ToastContainer toasts={toasts} removeToast={removeToast} />

      <ModalConfirm
        open={modalOpen}
        onClose={() => {
          setModalOpen(false)
          setPendingSave(false)
        }}
        onConfirm={handleConfirmPassword}
      />

      {view === 'login' ? (
        <form onSubmit={handleLogin} className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
          <h2 className="text-2xl font-bold mb-6 text-center">Iniciar sesión</h2>
          {loginErr && <div className="mb-4 text-red-600 text-sm">{loginErr}</div>}
          <label className="block mb-2 text-sm text-gray-600">Email</label>
          <input
            value={loginEmail}
            onChange={(e) => setLoginEmail(e.target.value)}
            type="email"
            required
            className="w-full mb-4 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
          />
          <label className="block mb-2 text-sm text-gray-600">Contraseña</label>
          <input
            value={loginPass}
            onChange={(e) => setLoginPass(e.target.value)}
            type="password"
            required
            className="w-full mb-6 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
          />
          <button type="submit" className="w-full py-3 rounded-2xl bg-indigo-600 text-white font-semibold hover:scale-105 transition">
            Entrar
          </button>
          <p className="mt-4 text-sm text-gray-500 text-center">
            ¿No tienes cuenta?{' '}
            <button type="button" onClick={() => setView('register')} className="text-indigo-600 underline">
              Regístrate aquí
            </button>
          </p>
        </form>
      ) : (
        <form onSubmit={trySave} className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-2xl overflow-y-auto max-h-[90vh]">
          <h2 className="text-xl font-bold mb-4 text-center">Registro de Paciente</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Tipo de documento */}
            <div>
              <label className="block mb-1 text-sm">Tipo de documento</label>
              <select name="tipoDocumento" value={form.tipoDocumento} onChange={handleInput} required className="w-full p-2 border rounded">
                <option value="">Seleccione...</option>
                {docTypes.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            {/* Número documento */}
            <div>
              <label className="block mb-1 text-sm">Número de documento</label>
              <input name="numeroDocumento" value={form.numeroDocumento} onChange={handleInput} required className="w-full p-2 border rounded" />
            </div>

            {/* Nombres */}
            <div>
              <label className="block mb-1 text-sm">Nombres</label>
              <input name="nombres" value={form.nombres} onChange={handleInput} required className="w-full p-2 border rounded" />
            </div>

            {/* Apellidos */}
            <div>
              <label className="block mb-1 text-sm">Apellidos</label>
              <input name="apellidos" value={form.apellidos} onChange={handleInput} required className="w-full p-2 border rounded" />
            </div>

            {/* Fecha de nacimiento */}
            <div>
              <label className="block mb-1 text-sm">Fecha de nacimiento</label>
              <input type="date" name="fechaNacimiento" value={form.fechaNacimiento} onChange={handleInput} required className="w-full p-2 border rounded" />
            </div>

            {/* Sexo */}
            <div>
              <label className="block mb-1 text-sm">Sexo</label>
              <select name="sexo" value={form.sexo} onChange={handleInput} required className="w-full p-2 border rounded">
                <option value="">Seleccione...</option>
                <option value="F">F</option>
                <option value="M">M</option>
              </select>
            </div>

            {/* Estado civil */}
            <div>
              <label className="block mb-1 text-sm">Estado civil</label>
              <select name="estadoCivil" value={form.estadoCivil} onChange={handleInput} required className="w-full p-2 border rounded">
                <option value="">Seleccione...</option>
                <option>Soltero</option>
                <option>Casado</option>
                <option>Viudo</option>
                <option>Divorciado</option>
              </select>
            </div>

            {/* Dirección */}
            <div className="md:col-span-2">
              <label className="block mb-1 text-sm">Dirección</label>
              <input name="direccion" value={form.direccion} onChange={handleInput} required className="w-full p-2 border rounded" />
            </div>

            {/* Teléfono */}
            <div>
              <label className="block mb-1 text-sm">Teléfono</label>
              <input name="telefono" value={form.telefono} onChange={handleInput} required className="w-full p-2 border rounded" />
            </div>

            {/* Email */}
            <div>
              <label className="block mb-1 text-sm">Email</label>
              <input type="email" name="email" value={form.email} onChange={handleInput} required className="w-full p-2 border rounded" />
            </div>

            {/* Departamento */}
            <div>
              <label className="block mb-1 text-sm">Departamento</label>
              <select name="departamento" value={form.departamento} onChange={handleInput} required className="w-full p-2 border rounded">
                <option value="">Seleccione...</option>
                {departamentos.map((dep) => (
                  <option key={dep} value={dep}>
                    {dep}
                  </option>
                ))}
              </select>
            </div>

            {/* Ciudad */}
            <div>
              <label className="block mb-1 text-sm">Ciudad / Municipio</label>
              <input name="ciudad" value={form.ciudad} onChange={handleInput} required className="w-full p-2 border rounded" />
            </div>

            {/* Contraseña */}
            <div>
              <label className="block mb-1 text-sm">Crear contraseña</label>
              <input type="password" name="password" value={form.password} onChange={handleInput} required className="w-full p-2 border rounded" />
            </div>

            {/* Confirmar contraseña */}
            <div>
              <label className="block mb-1 text-sm">Confirmar contraseña</label>
              <input type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleInput} required className="w-full p-2 border rounded" />
            </div>
          </div>

          {/* Botones */}
          <div className="flex gap-3 mt-4 justify-end">
            <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
              Guardar cambios
            </button>
            <button type="button" onClick={handleCancelRegister} className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500">
              Cancelar
            </button>
          </div>
        </form>
      )}

      {/* footer hint pequeño para versión mobile */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs text-gray-500">
        {view === 'login' ? '¿No tienes cuenta? Regístrate' : ''}
      </div>
    </div>
  )
}
