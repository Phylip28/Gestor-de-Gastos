import React, { useState, useEffect } from 'react';
import './App.css';
import { hayToken, cerrarSesion } from './api';

// Componentes
import Login from './components/login';
import ListaViajes from './components/listaViaje';
import CrearViaje from './components/crearViaje';
import DetalleViaje from './components/detalleViaje';
import AgregarGasto from './components/agregarGasto';
import VerBalances from './components/verBalances';

function App() {
  const [autenticado, setAutenticado] = useState(false);
  const [vistaActual, setVistaActual] = useState('lista');
  const [viajeSeleccionado, setViajeSeleccionado] = useState(null);
  const [usuario, setUsuario] = useState(null);

  // Verificar si hay token al cargar
  useEffect(() => {
    if (hayToken()) {
      setAutenticado(true);
    }
  }, []);

  const handleLogin = (datos) => {
    setAutenticado(true);
    setUsuario(datos.user || { email: 'Usuario' });
  };

  const handleLogout = () => {
    cerrarSesion();
    setAutenticado(false);
    setUsuario(null);
    setVistaActual('lista');
    setViajeSeleccionado(null);
  };

  const navegarA = (vista, viaje = null) => {
    setVistaActual(vista);
    if (viaje) {
      setViajeSeleccionado(viaje);
    }
  };

  // Si no está autenticado, mostrar login
  if (!autenticado) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="App">
      {/* Header */}
      <header style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '20px',
        marginBottom: '30px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h1 style={{ margin: 0, fontSize: '24px' }}>
            💰 Gestor de Gastos Compartidos
          </h1>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <span style={{ fontSize: '14px' }}>
              👤 {usuario?.name || usuario?.email || 'Usuario'}
            </span>
            <button
              onClick={handleLogout}
              style={{
                background: 'rgba(255,255,255,0.2)',
                border: '1px solid rgba(255,255,255,0.3)',
                color: 'white',
                padding: '8px 16px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              🚪 Cerrar Sesión
            </button>
          </div>
        </div>
      </header>

      {/* Navegación */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto 30px',
        padding: '0 20px'
      }}>
        <div className="nav-buttons">
          <button
            onClick={() => navegarA('lista')}
            className={vistaActual === 'lista' ? 'active' : ''}
          >
            📋 Mis Viajes
          </button>
          <button
            onClick={() => navegarA('crear')}
            className={vistaActual === 'crear' ? 'active' : ''}
          >
            ➕ Crear Viaje
          </button>
        </div>
      </div>

      {/* Contenido Principal */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 20px'
      }}>
        {vistaActual === 'lista' && <ListaViajes navegarA={navegarA} />}
        {vistaActual === 'crear' && <CrearViaje navegarA={navegarA} />}
        {vistaActual === 'detalle' && (
          <DetalleViaje viaje={viajeSeleccionado} navegarA={navegarA} />
        )}
        {vistaActual === 'gasto' && (
          <AgregarGasto viaje={viajeSeleccionado} navegarA={navegarA} />
        )}
        {vistaActual === 'balances' && (
          <VerBalances viaje={viajeSeleccionado} navegarA={navegarA} />
        )}
      </div>
    </div>
  );
}

export default App;