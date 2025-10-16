import { useState } from 'react';
import { addActivity } from '../utils/database';
import './ActivityForm.css';

interface ActivityFormProps {
  onActivityAdded?: () => void;
}

export function ActivityForm({ onActivityAdded }: ActivityFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'personal',
    completed: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const categories = [
    { value: 'personal', label: 'Personal' },
    { value: 'trabajo', label: 'Trabajo' },
    { value: 'estudio', label: 'Estudio' },
    { value: 'salud', label: 'Salud' },
    { value: 'hogar', label: 'Hogar' },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      setMessage('El título es obligatorio');
      return;
    }

    setIsSubmitting(true);
    setMessage('');

    try {
      await addActivity({
        title: formData.title.trim(),
        description: formData.description.trim(),
        category: formData.category,
        completed: formData.completed,
      });

      setMessage(navigator.onLine ? 
        'Actividad guardada y sincronizada correctamente' : 
        'Actividad guardada offline - Se sincronizará cuando haya conexión'
      );
      
      // Limpiar formulario
      setFormData({
        title: '',
        description: '',
        category: 'personal',
        completed: false,
      });

      // Notificar al componente padre
      if (onActivityAdded) {
        onActivityAdded();
      }

    } catch (error) {
      console.error('Error al guardar la actividad:', error);
      setMessage('Error al guardar la actividad');
    } finally {
      setIsSubmitting(false);
      // Limpiar mensaje después de 3 segundos
      setTimeout(() => setMessage(''), 3000);
    }
  };

  return (
    <div className="activity-form-container">
      <h2>📝 Nueva Actividad</h2>
      
      <form className="activity-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Título *</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Ej: Completar proyecto React"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Descripción</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Describe los detalles de la actividad..."
            rows={3}
          />
        </div>

        <div className="form-group">
          <label htmlFor="category">Categoría</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleInputChange}
          >
            {categories.map(cat => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group checkbox-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              name="completed"
              checked={formData.completed}
              onChange={handleInputChange}
            />
            <span className="checkmark"></span>
            Marcar como completada
          </label>
        </div>

        <button 
          type="submit" 
          className="submit-button"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Guardando...' : '💾 Guardar Actividad'}
        </button>

        {message && (
          <div className={`form-message ${message.includes('Error') ? 'error' : 'success'}`}>
            {message}
          </div>
        )}
      </form>
    </div>
  );
}