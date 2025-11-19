import React, { useState } from 'react';
import { iniciarSesion, registrarUsuario } from '../api';

function Login({ onLogin }) {
  const [modoRegistro, setModoRegistro] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nombre, setNombre] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (modoRegistro) {
        // Registro
        await registrarUsuario({ name: nombre, email, password });
        setError(null);
        // Después de registrar, hacer login automático
        const response = await iniciarSesion({ email, password });
        onLogin(response.data);
      } else {
        // Login
        const response = await iniciarSesion({ email, password });
        onLogin(response.data);
      }
    } catch (err) {
      console.error('Error de autenticación:', err);
      setError(
        modoRegistro 
          ? 'Error al registrar. Verifica que el email no esté en uso.'
          : 'Credenciales incorrectas. Verifica tu email y contraseña.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px'
    }}>
      <div className="card" style={{ maxWidth: '400px', width: '100%' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>
          💰 Gestor de Gastos
        </h1>

        {error && <div className="error">{error}</div>}

        <form onSubmit={handleSubmit}>
          {modoRegistro && (
            <div className="form-group">
              <label htmlFor="nombre">Nombre Completo</label>
              <input
                type="text"
                id="nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Tu nombre"
                required
                disabled={loading}
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              disabled={loading}
              minLength={6}
            />
          </div>

          <button type="submit" disabled={loading} style={{ width: '100%' }}>
            {loading 
              ? 'Procesando...' 
              : modoRegistro 
                ? '✅ Registrarse' 
                : '🔓 Iniciar Sesión'
            }
          </button>
        </form>

        <div style={{ 
          textAlign: 'center', 
          marginTop: '20px',
          padding: '15px',
          background: '#f7fafc',
          borderRadius: '8px'
        }}>
          <p style={{ fontSize: '14px', color: '#4a5568', marginBottom: '10px' }}>
            {modoRegistro 
              ? '¿Ya tienes cuenta?' 
              : '¿No tienes cuenta?'
            }
          </p>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => {
              setModoRegistro(!modoRegistro);
              setError(null);
            }}
            disabled={loading}
            style={{ width: '100%' }}
          >
            {modoRegistro 
              ? 'Iniciar Sesión' 
              : 'Crear Cuenta Nueva'
            }
          </button>
        </div>

        {!modoRegistro && (
          <div style={{ 
            marginTop: '20px',
            padding: '15px',
            background: '#edf2f7',
            borderRadius: '8px',
            fontSize: '13px',
            color: '#4a5568'
          }}>
            💡 <strong>Tip:</strong> Si no tienes cuenta, haz clic en "Crear Cuenta Nueva"
          </div>
        )}
      </div>
    </div>
  );
}

export default Login;