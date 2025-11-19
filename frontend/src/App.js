import React, { useState, useEffect } from 'react';
import './App.css';
import { hayToken, cerrarSesion, obtenerUserId } from './api';

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
  const [userId, setUserId] = useState(null);
  const [mostrarId, setMostrarId] = useState(false);

  // Verificar si hay token al cargar
  useEffect(() => {
    if (hayToken()) {
      setAutenticado(true);
      const id = obtenerUserId();
      const name = localStorage.getItem('userName');
      const email = localStorage.getItem('userEmail');
      setUserId(id);
      setUsuario({ name, email });
    }
  }, []);

  const handleLogin = (datos) => {
    setAutenticado(true);
    setUsuario(datos.user || { email: 'Usuario' });
    setUserId(datos.user?.id || obtenerUserId());
  };

  const handleLogout = () => {
    cerrarSesion();
    setAutenticado(false);
    setUsuario(null);
    setUserId(null);
    setVistaActual('lista');
    setViajeSeleccionado(null);
    setMostrarId(false);
  };

  const navegarA = (vista, viaje = null) => {
    setVistaActual(vista);
    if (viaje) {
      setViajeSeleccionado(viaje);
    }
  };

  const copiarIdUsuario = () => {
    if (userId) {
      navigator.clipboard.writeText(userId);
      alert('ID copiado al portapapeles');
    }
  };

  // Si no esta autenticado, mostrar login
  if (!autenticado) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="App">
      {/* Header */}
      <header style={{
        background: 'linear-gradient(135deg, #1e40af 0%, #0369a1 100%)',
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
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '15px'
        }}>
          <h1 style={{ margin: 0, fontSize: '24px' }}>
            Gestor de Gastos Compartidos
          </h1>
          
          <div style={{ display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap' }}>
            {/* Info del usuario */}
            <div style={{ 
              background: 'rgba(255,255,255,0.15)', 
              padding: '10px 15px', 
              borderRadius: '8px',
              border: '1px solid rgba(255,255,255,0.3)'
            }}>
              <div style={{ fontSize: '12px', opacity: 0.9, marginBottom: '3px' }}>
                Usuario
              </div>
              <div style={{ fontSize: '14px', fontWeight: '600' }}>
                {usuario?.name || usuario?.email || 'Usuario'}
              </div>
            </div>

            {/* Boton para ver ID */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setMostrarId(!mostrarId)}
                style={{
                  background: 'rgba(255,255,255,0.15)',
                  border: '1px solid rgba(255,255,255,0.3)',
                  color: 'white',
                  padding: '10px 15px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                {mostrarId ? 'Ocultar' : 'Ver'} Mi ID
              </button>

              {/* Dropdown con el ID */}
              {mostrarId && userId && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  marginTop: '10px',
                  background: 'white',
                  color: '#1f2937',
                  padding: '20px',
                  borderRadius: '12px',
                  boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
                  zIndex: 1000,
                  minWidth: '350px',
                  maxWidth: '400px'
                }}>
                  <div style={{ marginBottom: '12px' }}>
                    <p style={{ 
                      margin: '0 0 8px 0', 
                      fontSize: '14px', 
                      fontWeight: '700',
                      color: '#1e40af'
                    }}>
                      Tu ID de Usuario:
                    </p>
                    <div style={{
                      background: '#f3f4f6',
                      padding: '12px',
                      borderRadius: '6px',
                      fontFamily: 'monospace',
                      fontSize: '12px',
                      wordBreak: 'break-all',
                      border: '2px solid #e5e7eb',
                      lineHeight: '1.6'
                    }}>
                      {userId}
                    </div>
                  </div>
                  <button
                    onClick={copiarIdUsuario}
                    style={{
                      width: '100%',
                      padding: '10px',
                      background: '#2563eb',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '13px',
                      fontWeight: '600',
                      marginBottom: '10px'
                    }}
                  >
                    Copiar ID
                  </button>
                  <p style={{ 
                    margin: 0, 
                    fontSize: '11px', 
                    color: '#6b7280',
                    textAlign: 'center'
                  }}>
                    Comparte este ID con otros usuarios
                  </p>
                </div>
              )}
            </div>

            {/* Boton cerrar sesion */}
            <button
              onClick={handleLogout}
              style={{
                background: 'rgba(239, 68, 68, 0.9)',
                border: '1px solid rgba(255,255,255,0.3)',
                color: 'white',
                padding: '10px 15px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600',
                transition: 'all 0.3s'
              }}
            >
              Cerrar Sesion
            </button>
          </div>
        </div>
      </header>

      {/* Navegacion */}
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
            Mis Viajes
          </button>
          <button
            onClick={() => navegarA('crear')}
            className={vistaActual === 'crear' ? 'active' : ''}
          >
            Crear Viaje
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