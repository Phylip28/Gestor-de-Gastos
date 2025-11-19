import React, { useState, useEffect } from 'react';
import { obtenerViajeDetalle } from '../api';

function DetalleViaje({ viaje, navegarA }) {
  const [detalles, setDetalles] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (viaje && viaje.id) {
      cargarDetalles();
    }
  }, [viaje]);

  const cargarDetalles = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await obtenerViajeDetalle(viaje.id);
      setDetalles(response.data);
    } catch (err) {
      console.error('Error al cargar detalles:', err);
      setError('No se pudieron cargar los detalles del viaje.');
    } finally {
      setLoading(false);
    }
  };

  if (!viaje) {
    return (
      <div className="card">
        <p>No se ha seleccionado ningún viaje</p>
        <button onClick={() => navegarA('lista')}>Volver a la lista</button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="card">
        <div className="loading">Cargando detalles del viaje...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card">
        <div className="error">{error}</div>
        <button onClick={cargarDetalles}>Reintentar</button>
        <button onClick={() => navegarA('lista')} style={{ marginLeft: '10px' }}>
          Volver
        </button>
      </div>
    );
  }

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>{detalles.name}</h2>
        <button onClick={() => navegarA('lista')}>← Volver</button>
      </div>

      <div style={{ 
        background: '#f7fafc', 
        padding: '20px', 
        borderRadius: '8px', 
        marginBottom: '30px',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '20px'
      }}>
        <div style={{ flex: '1', minWidth: '200px' }}>
          <h3 style={{ color: '#667eea', marginBottom: '10px' }}>Información General</h3>
          <p><strong>Moneda:</strong> {detalles.currency}</p>
          <p><strong>Total gastado:</strong> {detalles.currency} {detalles.totalExpenses.toFixed(2)}</p>
          <p><strong>Tus gastos:</strong> {detalles.currency} {detalles.userExpenses.toFixed(2)}</p>
        </div>
      </div>

      <h3 style={{ marginBottom: '15px' }}>💸 Gastos del viaje</h3>
      
      {detalles.expenses && detalles.expenses.length > 0 ? (
        <div className="gastos-list">
          {detalles.expenses.map((gasto) => (
            <div key={gasto.id} className="gasto-item">
              <div className="gasto-info">
                <h4>{gasto.title}</h4>
                <p>Pagado por: {gasto.payer}</p>
                <p style={{ fontSize: '12px', color: '#a0aec0' }}>
                  {new Date(gasto.date).toLocaleDateString('es-ES')}
                </p>
              </div>
              <div className="gasto-monto">
                {detalles.currency} {Number(gasto.amount).toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p style={{ textAlign: 'center', color: '#718096', padding: '20px' }}>
          No hay gastos registrados aún
        </p>
      )}

      <div className="btn-group">
        <button 
          className="btn-success"
          onClick={() => navegarA('gasto', viaje)}
        >
          Agregar Gasto
        </button>
        <button 
          onClick={() => navegarA('balances', viaje)}
        >
          Ver Balances
        </button>
        <button 
          className="btn-secondary"
          onClick={cargarDetalles}
        >
          Actualizar
        </button>
      </div>
    </div>
  );
}

export default DetalleViaje;