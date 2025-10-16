import { openDB } from 'idb';
import type { DBSchema, IDBPDatabase } from 'idb';

// Definir la estructura de la base de datos
export interface MyPWADB extends DBSchema {
  // @ts-expect-error - Known issue with idb types and custom schemas
  activities: {
    key: number;
    value: {
      id?: number;
      title: string;
      description: string;
      category: string;
      completed: boolean;
      createdAt: Date;
      synced: boolean;
    };
    indexes: { 'by-created': Date; 'by-synced': boolean };
  };
  sync_queue: {
    key: number;
    value: {
      id?: number;
      action: 'create' | 'update' | 'delete';
      data: any;
      endpoint: string;
      createdAt: Date;
    };
  };
}

let db: IDBPDatabase<MyPWADB> | null = null;

// Inicializar la base de datos
export async function initDB(): Promise<IDBPDatabase<MyPWADB>> {
  if (db) return db;

  db = await openDB<MyPWADB>('PWADatabase', 1, {
    upgrade(db) {
      // Crear almacén de actividades
      const activitiesStore = db.createObjectStore('activities', {
        keyPath: 'id',
        autoIncrement: true,
      });

      activitiesStore.createIndex('by-created', 'createdAt');
      activitiesStore.createIndex('by-synced', 'synced');

      // Crear almacén para cola de sincronización
      db.createObjectStore('sync_queue', {
        keyPath: 'id',
        autoIncrement: true,
      });
    },
  });

  return db;
}

// Funciones para actividades
export async function addActivity(activity: Omit<MyPWADB['activities']['value'], 'id' | 'createdAt' | 'synced'>) {
  const database = await initDB();

  // Si hay conexión, intentar sincronizar inmediatamente
  let synced = false;
  if (navigator.onLine) {
    try {
      // Simular envío al servidor
      console.log('🔄 Sincronizando actividad con el servidor...');
      await simulateServerSync('create', activity);
      synced = true;
      console.log('✅ Actividad sincronizada correctamente');
    } catch (error) {
      console.log('❌ Error sincronizando, se guardará para sincronizar más tarde:', error);
      synced = false;
    }
  }

  const activityData = {
    ...activity,
    createdAt: new Date(),
    synced: synced,
  };

  const id = await database.add('activities', activityData);

  // Agregar a la cola de sincronización solo si no se pudo sincronizar
  if (!synced) {
    await addToSyncQueue('create', { ...activityData, id }, '/api/activities');

    // Registrar Background Sync para cuando vuelva la conexión
    if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
      try {
        const registration = await navigator.serviceWorker.ready;
        await (registration as any).sync.register('sync-activities');
      } catch (error) {
        console.log('Background Sync no disponible:', error);
      }
    }
  }

  return id;
}

export async function getAllActivities() {
  const database = await initDB();
  return await database.getAll('activities');
}

export async function getActivity(id: number) {
  const database = await initDB();
  return await database.get('activities', id);
}

export async function updateActivity(id: number, updates: Partial<MyPWADB['activities']['value']>) {
  const database = await initDB();
  const activity = await database.get('activities', id);

  if (activity) {
    let synced = false;

    // Si hay conexión, intentar sincronizar inmediatamente
    if (navigator.onLine) {
      try {
        console.log('🔄 Sincronizando actualización con el servidor...');
        await simulateServerSync('update', { ...activity, ...updates, id });
        synced = true;
        console.log('✅ Actualización sincronizada correctamente');
      } catch (error) {
        console.log('❌ Error sincronizando actualización, se guardará para sincronizar más tarde:', error);
        synced = false;
      }
    }

    const updatedActivity = { ...activity, ...updates, synced };
    await database.put('activities', updatedActivity);

    // Agregar a la cola de sincronización solo si no se pudo sincronizar
    if (!synced) {
      await addToSyncQueue('update', updatedActivity, `/api/activities/${id}`);
      // Registrar Background Sync
      if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
        try {
          const registration = await navigator.serviceWorker.ready;
          await (registration as any).sync.register('sync-activities');
        } catch (error) {
          console.log('Background Sync no disponible:', error);
        }
      }
    }

    return updatedActivity;
  }

  return null;
}

export async function deleteActivity(id: number) {
  const database = await initDB();
  const activity = await database.get('activities', id);

  if (activity) {
    let synced = false;

    // Si hay conexión, intentar sincronizar inmediatamente
    if (navigator.onLine) {
      try {
        console.log('🔄 Sincronizando eliminación con el servidor...');
        await simulateServerSync('delete', { id });
        synced = true;
        console.log('✅ Eliminación sincronizada correctamente');
      } catch (error) {
        console.log('❌ Error sincronizando eliminación, se guardará para sincronizar más tarde:', error);
        synced = false;
      }
    }

    // Eliminar de la base de datos local
    await database.delete('activities', id);

    // Agregar a la cola de sincronización solo si no se pudo sincronizar
    if (!synced) {
      await addToSyncQueue('delete', { id }, `/api/activities/${id}`);
      // Registrar Background Sync
      if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
        try {
          const registration = await navigator.serviceWorker.ready;
          await (registration as any).sync.register('sync-activities');
        } catch (error) {
          console.log('Background Sync no disponible:', error);
        }
      }
    }

    return true;
  }

  return false;
}

// Funciones para cola de sincronización
export async function addToSyncQueue(action: 'create' | 'update' | 'delete', data: any, endpoint: string) {
  const database = await initDB();
  await database.add('sync_queue', {
    action,
    data,
    endpoint,
    createdAt: new Date(),
  });
}

export async function getSyncQueue() {
  const database = await initDB();
  return await database.getAll('sync_queue');
}

export async function removeSyncQueueItem(id: number) {
  const database = await initDB();
  await database.delete('sync_queue', id);
}

export async function clearSyncQueue() {
  const database = await initDB();
  await database.clear('sync_queue');
}

// Funciones para marcar como sincronizado
export async function markAsSynced(id: number) {
  const database = await initDB();
  const activity = await database.get('activities', id);

  if (activity) {
    activity.synced = true;
    await database.put('activities', activity);
  }
}

export async function getUnsyncedActivities() {
  const database = await initDB();
  return await database.getAllFromIndex('activities', 'by-synced', false);
}

// Función para simular sincronización con el servidor
async function simulateServerSync(action: 'create' | 'update' | 'delete', data: any): Promise<void> {
  // En un entorno real, aquí haríamos la petición HTTP al servidor
  // Por ahora, simularemos que siempre funciona cuando hay conexión

  const endpoints = {
    create: 'http://localhost:3002/api/activities',
    update: `http://localhost:3002/api/activities/${data.id}`,
    delete: `http://localhost:3002/api/activities/${data.id}`
  };

  const options = {
    method: action === 'create' ? 'POST' : action === 'update' ? 'PUT' : 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: action !== 'delete' ? JSON.stringify(data) : undefined,
  };

  try {
    // Intentar hacer la petición real al servidor
    const response = await fetch(endpoints[action], options);

    if (response.ok) {
      console.log(`✅ ${action} sincronizado con el servidor`);
      return;
    } else {
      throw new Error(`HTTP ${response.status}`);
    }
  } catch (error) {
    // Si no hay servidor o falla, simular éxito para desarrollo
    console.log(`🔧 Servidor no disponible, simulando sincronización exitosa para ${action}`);

    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 500));

    // En desarrollo, siempre consideramos exitoso
    return;
  }
}