import React, { useState, useEffect } from 'react';
import { obtenerBalances, liquidarBalances } from '../api';

function VerBalances({ viaje, navegarA }) {
  const [balances, setBalances] = useState([]);
  const [transacciones, setTransacciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingLiquidar, setLoadingLiquidar] = useState(false);
  const [error, setError] = useState(null);
  const [mostrarTransacciones, setMostrarTransacciones] = useState(false);

  useEffect(() => {
    if (viaje && viaje.id) {
      cargarBalances();
    }
  }, [viaje]);

  const cargarBalances = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await obtenerBalances(viaje.id);
      setBalances(response.data);
    } catch (err) {
      console.error('Error al cargar balances:', err);
      setError('No se pudieron cargar los balances del viaje.');
    } finally {
      setLoading(false);
    }
  };

  const handleLiquidar = async () => {
    try {
      setLoadingLiquidar(true);
      setError(null);
      const response = await liquidarBalances(viaje.id);
      setTransacciones(response.data.transactions);
      setMostrarTransacciones(true);
    } catch (err) {
      console.error('Error al liquidar balances:', err);
      setError('No se pudo calcular la liquidación.');
    } finally {
      setLoadingLiquidar(false);
    }
  };

  const getBalanceClass = (balance) => {
    if (balance > 0) return 'balance-positivo';
    if (balance < 0) return 'balance-negativo';
    return 'balance-cero';
  };

  const getMontoClass = (balance) => {
    if (balance > 0) return 'monto-positivo';
    if (balance < 0) return 'monto-negativo';
    return 'monto-cero';
  };

  const getBalanceTexto = (balance) => {
    if (balance > 0) return `Le deben: ${viaje.currency} ${balance.toFixed(2)}`;
    if (balance < 0) return `Debe: ${viaje.currency} ${Math.abs(balance).toFixed(2)}`;
    return 'Sin deudas';
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
        <div className="loading">Cargando balances...</div>
      </div>
    );
  }

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Balances: {viaje.name}</h2>
        <button onClick={() => navegarA('detalle', viaje)}>← Volver</button>
      </div>

      {error && <div className="error">{error}</div>}

      <div style={{ marginBottom: '30px' }}>
        <h3 style={{ marginBottom: '15px' }}>Estado de Cuentas</h3>
        
        {balances.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#718096', padding: '20px' }}>
            No hay balances para mostrar
          </p>
        ) : (
          balances.map((balance) => (
            <div 
              key={balance.userId} 
              className={`balance-item ${getBalanceClass(balance.balance)}`}
            >
              <div>
                <h4 style={{ marginBottom: '5px' }}>{balance.name}</h4>
                <p style={{ fontSize: '14px', color: '#718096' }}>
                  {getBalanceTexto(balance.balance)}
                </p>
              </div>
              <div className={`balance-monto ${getMontoClass(balance.balance)}`}>
                {balance.balance > 0 ? '+' : ''}{balance.balance.toFixed(2)}
              </div>
            </div>
          ))
        )}
      </div>

      <div style={{ marginBottom: '30px' }}>
        <button 
          onClick={handleLiquidar}
          disabled={loadingLiquidar || balances.length === 0}
          style={{ width: '100%' }}
        >
          {loadingLiquidar ? 'Calculando...' : 'Calcular Liquidación'}
        </button>
      </div>

      {mostrarTransacciones && (
        <div style={{ 
          background: '#f7fafc', 
          padding: '20px', 
          borderRadius: '8px',
          borderLeft: '4px solid #667eea'
        }}>
          <h3 style={{ marginBottom: '15px' }}>📋 Transacciones Sugeridas</h3>
          
          {transacciones.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#48bb78', fontSize: '16px' }}>
              ¡Todas las cuentas están saldadas!
            </p>
          ) : (
            <div>
              <p style={{ marginBottom: '15px', color: '#4a5568' }}>
                Para equilibrar las cuentas, realiza las siguientes transferencias:
              </p>
              {transacciones.map((trans, index) => (
                <div key={index} className="transaccion-item">
                  <div>
                    <p style={{ marginBottom: '5px' }}>
                      <strong>{trans.from}</strong> → <strong>{trans.to}</strong>
                    </p>
                    <p style={{ fontSize: '14px', color: '#718096' }}>
                      Transacción #{index + 1}
                    </p>
                  </div>
                  <div style={{ 
                    fontSize: '20px', 
                    fontWeight: 'bold', 
                    color: '#667eea' 
                  }}>
                    {viaje.currency} {trans.amount.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="btn-group" style={{ marginTop: '20px' }}>
        <button 
          className="btn-secondary"
          onClick={cargarBalances}
        >
          Actualizar Balances
        </button>
        <button 
          onClick={() => navegarA('detalle', viaje)}
        >
          Ver Detalles del Viaje
        </button>
      </div>

      <div style={{ 
        marginTop: '30px', 
        padding: '20px', 
        background: '#edf2f7', 
        borderRadius: '8px' 
      }}>
        <h3 style={{ fontSize: '16px', marginBottom: '10px' }}> ¿Cómo funciona?</h3>
        <ul style={{ 
          fontSize: '14px', 
          color: '#4a5568', 
          lineHeight: '1.8',
          paddingLeft: '20px'
        }}>
          <li><strong>Positivo (+):</strong> Te deben dinero</li>
          <li><strong>Negativo (-):</strong> Debes dinero</li>
          <li><strong>Cero (0):</strong> Estás al día</li>
        </ul>
      </div>
    </div>
  );
}

export default VerBalances;