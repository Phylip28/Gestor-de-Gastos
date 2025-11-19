import React, { useState } from 'react';
import { crearViaje } from '../api';

function CrearViaje({ navegarA }) {
  const [nombre, setNombre] = useState('');
  const [moneda, setMoneda] = useState('COP');
  const [emails, setEmails] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!nombre.trim()) {
      setError('El nombre del viaje es obligatorio');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const emailsArray = emails
        .split(',')
        .map(email => email.trim())
        .filter(email => email.length > 0);

      const datos = {
        name: nombre,
        currency: moneda,
        participantEmails: emailsArray
      };

      const response = await crearViaje(datos);
      
      setSuccess(`¡Viaje creado exitosamente! Código: ${response.data.trip.code}`);
      
      setNombre('');
      setMoneda('COP');
      setEmails('');

      setTimeout(() => {
        navegarA('lista');
      }, 2000);

    } catch (err) {
      console.error('Error al crear viaje:', err);
      if (err.response && err.response.data) {
        setError(err.response.data.message || 'Error al crear el viaje');
      } else {
        setError('Error al crear el viaje. Verifica que el backend esté corriendo.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2>✈️ Crear Nuevo Viaje</h2>

      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="nombre">Nombre del Viaje *</label>
          <input
            type="text"
            id="nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Ej: Viaje a Cartagena 2025"
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="moneda">Moneda *</label>
          <select
            id="moneda"
            value={moneda}
            onChange={(e) => setMoneda(e.target.value)}
            disabled={loading}
          >
            <option value="COP">COP - Peso Colombiano</option>
            <option value="USD">USD - Dólar Estadounidense</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="emails">
            Emails de Participantes (opcional)
          </label>
          <input
            type="text"
            id="emails"
            value={emails}
            onChange={(e) => setEmails(e.target.value)}
            placeholder="usuario1@email.com, usuario2@email.com"
            disabled={loading}
          />
          <small style={{ color: '#718096', fontSize: '12px', marginTop: '5px' }}>
            Separa los emails con comas.
          </small>
        </div>

        <div className="btn-group">
          <button type="submit" disabled={loading}>
            {loading ? 'Creando...' : 'Crear Viaje'}
          </button>
          <button 
            type="button" 
            className="btn-secondary"
            onClick={() => navegarA('lista')}
            disabled={loading}
          >
            Cancelar
          </button>
        </div>
      </form>

      <div style={{ 
        marginTop: '30px', 
        padding: '20px', 
        background: '#edf2f7', 
        borderRadius: '8px' 
      }}>
        <h3 style={{ fontSize: '16px', marginBottom: '10px' }}>💡 Consejo</h3>
        <p style={{ fontSize: '14px', color: '#4a5568', lineHeight: '1.6' }}>
          Una vez creado el viaje, recibirás un código único que podrás compartir.
        </p>
      </div>
    </div>
  );
}

export default CrearViaje;