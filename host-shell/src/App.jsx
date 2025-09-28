import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom'

function HostWrapper() {
  const [token, setToken] = useState(localStorage.getItem('mf_token'))
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('mf_user') || 'null'))
  const navigate = useNavigate()

  useEffect(() => {
    function onMessage(e) {
      const msg = e.data
      if (!msg || !msg.type) return
      if (msg.type === 'LOGIN_SUCCESS') {
        localStorage.setItem('mf_token', msg.token)
        localStorage.setItem('mf_user', JSON.stringify(msg.user))
        setToken(msg.token)
        setUser(msg.user)
        navigate('/dashboard')
      } else if (msg.type === 'LOGOUT') {
        localStorage.removeItem('mf_token')
        localStorage.removeItem('mf_user')
        setToken(null)
        setUser(null)
        navigate('/')
      }
    }
    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  }, [navigate])

  return (
      <Routes>
        <Route path="/" element={<LoginFrame />} />
        <Route path="/dashboard" element={<ProtectedDashboard token={token} user={user} />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
  )
}

function LoginFrame() {
  if (localStorage.getItem('mf_token')) return <Navigate to="/dashboard" replace />
  return (
    <div className="min-h-screen">
      <iframe title="login" src="http://localhost:3001" className="w-full h-screen border-0" />
    </div>
  )
}

function ProtectedDashboard({ token }) {
  if (!token) return <Navigate to="/" replace />
  return (
    <div className="min-h-screen">
      <iframe title="dashboard" src="http://localhost:3002" className="w-full h-screen border-0" />
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <HostWrapper />
    </BrowserRouter>
  )
}
