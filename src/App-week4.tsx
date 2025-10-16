import { useState, useEffect } from 'react'
import './debug-fullwidth.css'
import './App.css'
import { ConnectionStatus } from './components/ConnectionStatus'
import { ActivityForm } from './components/ActivityForm'
import { ActivityList } from './components/ActivityList'
import { PushNotificationManager } from './utils/pushNotifications'
import { initDB } from './utils/database'

function App() {
  const [currentView, setCurrentView] = useState<'home' | 'form' | 'list'>('home')
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [installPrompt, setInstallPrompt] = useState<any>(null)
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [pushSupported, setPushSupported] = useState(false)
  const [pushSubscribed, setPushSubscribed] = useState(false)

  // Inicializar base de datos
  useEffect(() => {
    initDB().then(() => {
      console.log('IndexedDB inicializada correctamente');
    }).catch(error => {
      console.error('Error inicializando IndexedDB:', error);
    });
  }, []);

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

  // Verificar soporte para notificaciones push
  useEffect(() => {
    PushNotificationManager.checkSupport().then(supported => {
      setPushSupported(supported);
      if (supported) {
        PushNotificationManager.getSubscription().then(subscription => {
          setPushSubscribed(!!subscription);
        });
      }
    });
  }, []);

  const handleInstallClick = async () => {
    if (!installPrompt) return

    const result = await installPrompt.prompt()
    console.log('Install prompt result:', result)
    setInstallPrompt(null)
  }

  const handleActivityAdded = () => {
    setRefreshTrigger(prev => prev + 1);
    setCurrentView('list');
  }

  const handlePushSubscribe = async () => {
    try {
      const subscription = await PushNotificationManager.subscribe();
      setPushSubscribed(!!subscription);
      if (subscription) {
        // Enviar notificación de prueba después de suscribirse
        setTimeout(() => {
          PushNotificationManager.sendTestNotification();
        }, 2000);
      }
    } catch (error) {
      console.error('Error al suscribirse a notificaciones:', error);
    }
  }

  const handlePushUnsubscribe = async () => {
    try {
      const result = await PushNotificationManager.unsubscribe();
      if (result) {
        setPushSubscribed(false);
      }
    } catch (error) {
      console.error('Error al desuscribirse:', error);
    }
  }

  const renderCurrentView = () => {
    switch (currentView) {
      case 'form':
        return <ActivityForm onActivityAdded={handleActivityAdded} />;
      case 'list':
        return <ActivityList refreshTrigger={refreshTrigger} />;
      default:
        return (
          <div className="welcome-section">
            <h1>📱 Mi PWA Avanzada</h1>
            <p>
              Aplicación Web Progresiva con IndexedDB, Background Sync y Push Notifications
            </p>
            
            <div className="features-grid">
              <div className="feature-card" onClick={() => setCurrentView('form')}>
                <h3>📝 Nueva Actividad</h3>
                <p>Crea actividades que se guardan localmente y se sincronizan automáticamente</p>
                <button className="feature-button">Crear Actividad</button>
              </div>
              
              <div className="feature-card" onClick={() => setCurrentView('list')}>
                <h3>📋 Mis Actividades</h3>
                <p>Ve todas tus actividades guardadas, incluso sin conexión</p>
                <button className="feature-button">Ver Lista</button>
              </div>
              
              {pushSupported && (
                <div className="feature-card">
                  <h3>🔔 Notificaciones</h3>
                  <p>
                    {pushSubscribed ? 
                      'Recibirás notificaciones de la aplicación' : 
                      'Habilita las notificaciones para estar al día'
                    }
                  </p>
                  {pushSubscribed ? (
                    <button className="feature-button secondary" onClick={handlePushUnsubscribe}>
                      Desactivar Notificaciones
                    </button>
                  ) : (
                    <button className="feature-button" onClick={handlePushSubscribe}>
                      Activar Notificaciones
                    </button>
                  )}
                </div>
              )}
              
              {installPrompt && (
                <div className="feature-card">
                  <h3>📲 Instalar App</h3>
                  <p>Instala la aplicación en tu dispositivo para mejor experiencia</p>
                  <button className="feature-button" onClick={handleInstallClick}>
                    Instalar PWA
                  </button>
                </div>
              )}
              
              <div className="feature-card">
                <h3>🔄 Estado de Sync</h3>
                <p>
                  {isOnline ? 
                    '✅ Conectado - Los datos se sincronizan automáticamente' : 
                    '⏳ Offline - Los cambios se sincronizarán cuando vuelva la conexión'
                  }
                </p>
                <div className={`sync-indicator ${isOnline ? 'online' : 'offline'}`}>
                  {isOnline ? 'Sincronizado' : 'Pendiente'}
                </div>
              </div>
            </div>
          </div>
        );
    }
  }

  return (
    <div className="App debug-container">
      <ConnectionStatus />
      
      <header className="app-header">
        <nav className="app-nav">
          <button 
            className={`nav-button ${currentView === 'home' ? 'active' : ''}`}
            onClick={() => setCurrentView('home')}
          >
            🏠 Inicio
          </button>
          <button 
            className={`nav-button ${currentView === 'form' ? 'active' : ''}`}
            onClick={() => setCurrentView('form')}
          >
            ➕ Nueva
          </button>
          <button 
            className={`nav-button ${currentView === 'list' ? 'active' : ''}`}
            onClick={() => setCurrentView('list')}
          >
            📋 Lista
          </button>
        </nav>
      </header>

      <main className="app-main">
        {renderCurrentView()}
      </main>

      <footer className="app-footer">
        <p>PWA con IndexedDB, Background Sync y Push Notifications</p>
        <p>Estado: {isOnline ? '🟢 Online' : '🔴 Offline'}</p>
      </footer>
    </div>
  )
}

export default App