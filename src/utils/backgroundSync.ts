// Extensión de tipos para Background Sync
declare global {
  interface ServiceWorkerRegistration {
    sync: SyncManager;
  }
  
  interface SyncManager {
    register(tag: string): Promise<void>;
    getTags(): Promise<string[]>;
  }
  
  interface WindowEventMap {
    'sync': Event;
  }
}

// Utilidades para Background Sync
export class BackgroundSyncManager {
  static async register() {
    if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
      try {
        const registration = await navigator.serviceWorker.ready;
        console.log('Background Sync disponible');
        return registration;
      } catch (error) {
        console.error('Error registrando Background Sync:', error);
        return null;
      }
    } else {
      console.log('Background Sync no está disponible');
      return null;
    }
  }

  static async requestSync(tag = 'sync-activities') {
    try {
      const registration = await this.register();
      if (registration) {
        await registration.sync.register(tag);
        console.log('Background sync registrado:', tag);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error solicitando sync:', error);
      return false;
    }
  }

  static async syncWhenOnline() {
    // Si está online, intentar sync inmediatamente
    if (navigator.onLine) {
      return await this.requestSync();
    }

    // Si está offline, registrar para cuando vuelva la conexión
    const handleOnline = async () => {
      await this.requestSync();
      window.removeEventListener('online', handleOnline);
    };

    window.addEventListener('online', handleOnline);
    return true;
  }
}

// Hook personalizado para React (opcional)
export function useBackgroundSync() {
  const requestSync = async (tag?: string) => {
    return await BackgroundSyncManager.requestSync(tag);
  };

  const syncWhenOnline = async () => {
    return await BackgroundSyncManager.syncWhenOnline();
  };

  return {
    requestSync,
    syncWhenOnline,
    isSupported: 'serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype
  };
}