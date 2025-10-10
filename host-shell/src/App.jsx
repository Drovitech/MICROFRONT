import { useEffect, useState, useRef } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom'

function HostWrapper() {
  const [token, setToken] = useState(localStorage.getItem('mf_token'))
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('mf_user') || 'null'))
  const loginIframeRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    function onMessage(e) {
      // En desarrollo aceptamos cualquier origen
      const msg = e.data
      if (!msg || !msg.type) return

      if (msg.type === 'LOGIN_SUCCESS') {
        localStorage.setItem('mf_token', msg.token)
        localStorage.setItem('mf_user', JSON.stringify(msg.user))
        setToken(msg.token)
        setUser(msg.user)
        // redirigir a /home (en host)
        navigate('/home')
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
    <>
      <Routes>
        <Route path="/" element={<LoginFrame />} />
        <Route path="/home" element={<ProtectedHome token={token} user={user} />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  )
}

function LoginFrame() {
  // Si ya hay token, redirige al home
  if (localStorage.getItem('mf_token')) return <Navigate to="/home" replace />
  return (
    <div className="min-h-screen">
      <iframe title="login" src="http://localhost:3001" className="w-full h-screen border-0" />
    </div>
  )
}

function ProtectedHome({ token, user }) {
  if (!token) return <Navigate to="/" replace />
  // Renderizamos el iframe del home
  return (
    <div className="min-h-screen">
      <iframe title="home" src="http://localhost:3002" className="w-full h-screen border-0" />
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
