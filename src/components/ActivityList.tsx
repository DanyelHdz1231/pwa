import { useState, useEffect } from 'react';
import { getAllActivities, updateActivity, deleteActivity } from '../utils/database';
import type { MyPWADB } from '../utils/database';
import './ActivityList.css';

type Activity = MyPWADB['activities']['value'] & { id: number };

interface ActivityListProps {
  refreshTrigger?: number;
}

export function ActivityList({ refreshTrigger }: ActivityListProps) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'completed' | 'pending'>('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const loadActivities = async () => {
    try {
      setLoading(true);
      const data = await getAllActivities();
      setActivities(data as Activity[]);
    } catch (error) {
      console.error('Error al cargar actividades:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadActivities();
  }, [refreshTrigger]);

  const handleToggleComplete = async (id: number, completed: boolean) => {
    try {
      await updateActivity(id, { completed: !completed });
      await loadActivities();
    } catch (error) {
      console.error('Error al actualizar actividad:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('¿Estás seguro de que quieres eliminar esta actividad?')) {
      try {
        await deleteActivity(id);
        await loadActivities();
      } catch (error) {
        console.error('Error al eliminar actividad:', error);
      }
    }
  };

  const filteredActivities = activities.filter(activity => {
    const statusMatch = filter === 'all' || 
                       (filter === 'completed' && activity.completed) ||
                       (filter === 'pending' && !activity.completed);
    
    const categoryMatch = categoryFilter === 'all' || activity.category === categoryFilter;
    
    return statusMatch && categoryMatch;
  });

  const categories = [...new Set(activities.map(a => a.category))];

  if (loading) {
    return (
      <div className="activity-list-container">
        <div className="loading">Cargando actividades...</div>
      </div>
    );
  }

  return (
    <div className="activity-list-container">
      <div className="list-header">
        <h2>📋 Mis Actividades ({activities.length})</h2>
        
        <div className="filters">
          <div className="filter-group">
            <label>Estado:</label>
            <select value={filter} onChange={(e) => setFilter(e.target.value as any)}>
              <option value="all">Todas</option>
              <option value="pending">Pendientes</option>
              <option value="completed">Completadas</option>
            </select>
          </div>
          
          <div className="filter-group">
            <label>Categoría:</label>
            <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
              <option value="all">Todas</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {filteredActivities.length === 0 ? (
        <div className="empty-state">
          <p>No hay actividades {filter !== 'all' ? `${filter === 'completed' ? 'completadas' : 'pendientes'}` : ''}</p>
          <p>¡Agrega una nueva actividad para comenzar!</p>
        </div>
      ) : (
        <div className="activities-grid">
          {filteredActivities.map(activity => (
            <div key={activity.id} className={`activity-card ${activity.completed ? 'completed' : ''}`}>
              <div className="activity-header">
                <h3 className={activity.completed ? 'line-through' : ''}>{activity.title}</h3>
                <div className="activity-actions">
                  <button
                    className="toggle-button"
                    onClick={() => handleToggleComplete(activity.id!, activity.completed)}
                    title={activity.completed ? 'Marcar como pendiente' : 'Marcar como completada'}
                  >
                    {activity.completed ? '↩️' : '✅'}
                  </button>
                  <button
                    className="delete-button"
                    onClick={() => handleDelete(activity.id!)}
                    title="Eliminar actividad"
                  >
                    🗑️
                  </button>
                </div>
              </div>
              
              {activity.description && (
                <p className="activity-description">
                  {activity.description}
                </p>
              )}
              
              <div className="activity-footer">
                <span className={`category-tag category-${activity.category}`}>
                  {activity.category.charAt(0).toUpperCase() + activity.category.slice(1)}
                </span>
                <span className="activity-date">
                  {new Date(activity.createdAt).toLocaleDateString('es-ES')}
                </span>
                {!activity.synced && (
                  <span className="sync-status" title="Pendiente de sincronización">
                    🔄
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}