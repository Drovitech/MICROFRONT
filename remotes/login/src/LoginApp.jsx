import React, { useState } from 'react'

export default function LoginApp() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [err, setErr] = useState('')

  const mock = { email: 'user@example.com', password: 'password123' }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (email === mock.email && password === mock.password) {
      const token = 'token-mock'
      const user = { email }
      // mensaje al  (host)
      window.parent.postMessage({ type: 'LOGIN_SUCCESS', token, user }, '*')
      // Sino ingresa los datos correctos
    } else {
      setErr('Credenciales incorrectas')
      setTimeout(() => setErr(''), 3000)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-50 to-indigo-50">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-xl w-96 transform transition duration-300 hover:scale-[1.01]">
        <h2 className="text-2xl font-bold mb-6 text-center">Iniciar sesión</h2>
        {err && <div className="mb-4 text-red-600 text-sm">{err}</div>}
        <label className="block mb-2 text-sm text-gray-600">Email</label>
        <input value={email} onChange={e=>setEmail(e.target.value)} type="email" required className="w-full mb-4 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300" />
        <label className="block mb-2 text-sm text-gray-600">Contraseña</label>
        <input value={password} onChange={e=>setPassword(e.target.value)} type="password" required className="w-full mb-6 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300" />
        <button type="submit" className="w-full py-3 rounded-2xl bg-indigo-600 text-white font-semibold hover:scale-105 transition">Entrar</button>
        <p className="mt-4 text-xs text-gray-500">Usa <strong>user@example.com</strong> / <strong>password123</strong></p>
      </form>
    </div>
  )
}
