import { useState, useEffect } from 'react'
import './debug-fullwidth.css'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [installPrompt, setInstallPrompt] = useState<any>(null)

  // Detectar estado de conexión
  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  // Detectar prompt de instalación PWA
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setInstallPrompt(e)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [])

  const handleInstallClick = async () => {
    if (!installPrompt) return

    const result = await installPrompt.prompt()
    console.log('Install prompt result:', result)
    setInstallPrompt(null)
  }

  return (
    <div className="app debug-container">
      <header className="app-header">
        <div className="header-content debug-container">
          <div className="logo-container">
            <div className="pwa-logo">P</div>
          </div>
          <h1>Mi Aplicación Progresiva</h1>
          <div className="status-indicators">
            <div className={`connection-status ${isOnline ? 'online' : 'offline'}`}>
              {isOnline ? '🟢 En línea' : '🔴 Offline'}
            </div>
          </div>
        </div>
      </header>

      <main className="app-main">
        <section className="welcome-section">
          <h2>¡Bienvenido a tu PWA!</h2>
          <p>Esta es una Progressive Web App construida con React, TypeScript y Vite.</p>
        </section>

        <section className="features-section">
          <div className="feature-card">
            <h3>📱 Instalable</h3>
            <p>Instala esta aplicación en tu dispositivo para una experiencia nativa.</p>
            {installPrompt && (
              <button 
                className="install-button"
                onClick={handleInstallClick}
              >
                📲 Instalar App
              </button>
            )}
          </div>

          <div className="feature-card">
            <h3>⚡ Offline Ready</h3>
            <p>Funciona sin conexión gracias al Service Worker.</p>
            <div className="offline-indicator">
              Estado: {isOnline ? 'Conectado' : 'Trabajando offline'}
            </div>
          </div>

          <div className="feature-card">
            <h3>🎯 Contador Demo</h3>
            <p>Un simple contador para probar la funcionalidad.</p>
            <div className="counter-container">
              <button 
                className="counter-button"
                onClick={() => setCount((count) => count + 1)}
              >
                Contador: {count}
              </button>
            </div>
          </div>
        </section>

        <section className="info-section">
          <h3>🔧 Características PWA Implementadas:</h3>
          <ul className="features-list">
            <li>✅ Web App Manifest configurado</li>
            <li>✅ Service Worker con cacheo offline</li>
            <li>✅ App Shell Architecture</li>
            <li>✅ Splash Screen personalizado</li>
            <li>✅ Iconos para múltiples dispositivos</li>
            <li>✅ Detección de estado de red</li>
            <li>✅ Prompt de instalación</li>
          </ul>
        </section>
      </main>

      <footer className="app-footer">
        <p>PWA desarrollada con ❤️ usando React + Vite</p>
      </footer>
    </div>
  )
}

export default App
