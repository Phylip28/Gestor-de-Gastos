import React, { useState, useEffect } from 'react';
import { obtenerViajes } from '../api';

function ListaViajes({ navegarA }) {
  const [viajes, setViajes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    cargarViajes();
  }, []);

  const cargarViajes = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await obtenerViajes();
      setViajes(response.data);
    } catch (err) {
      console.error('Error al cargar viajes:', err);
      setError('No se pudieron cargar los viajes.');
    } finally {
      setLoading(false);
    }
  };

  const irADetalle = (viaje) => {
    navegarA('detalle', viaje);
  };

  if (loading) {
    return (
      <div className="card">
        <div className="loading">Cargando viajes...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card">
        <div className="error">{error}</div>
        <button onClick={cargarViajes}>Reintentar</button>
      </div>
    );
  }

  return (
    <div className="card">
      <h2>Mis Viajes</h2>
      
      {viajes.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#718096' }}>
          <p style={{ fontSize: '18px', marginBottom: '20px' }}>
            No tienes viajes aún
          </p>
          <button onClick={() => navegarA('crear')}>
            Crear mi primer viaje
          </button>
        </div>
      ) : (
        <div className="viajes-grid">
          {viajes.map((viaje) => (
            <div 
              key={viaje.id} 
              className="viaje-card"
              onClick={() => irADetalle(viaje)}
            >
              <h3>{viaje.name}</h3>
              <p><strong>Moneda:</strong> {viaje.currency}</p>
              <p><strong>Código:</strong> {viaje.code}</p>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  irADetalle(viaje);
                }}
                style={{ marginTop: '10px', width: '100%' }}
              >
                Ver detalles
              </button>
            </div>
          ))}
        </div>
      )}

      <div style={{ marginTop: '30px', textAlign: 'center' }}>
        <button onClick={cargarViajes}>Actualizar lista</button>
      </div>
    </div>
  );
}

export default ListaViajes;