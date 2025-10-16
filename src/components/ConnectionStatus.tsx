import { useState, useEffect } from 'react';
import './ConnectionStatus.css';

interface ConnectionStatusProps {
  className?: string;
}

export function ConnectionStatus({ className = '' }: ConnectionStatusProps) {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showStatus, setShowStatus] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowStatus(true);
      // Ocultar el mensaje después de 3 segundos
      setTimeout(() => setShowStatus(false), 3000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowStatus(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!showStatus) return null;

  return (
    <div className={`connection-status ${isOnline ? 'online' : 'offline'} ${className}`}>
      <div className="connection-status-content">
        <div className="connection-icon">
          {isOnline ? '🟢' : '🔴'}
        </div>
        <div className="connection-text">
          {isOnline ? 'Conexión restaurada' : 'Sin conexión - Trabajando offline'}
        </div>
      </div>
    </div>
  );
}