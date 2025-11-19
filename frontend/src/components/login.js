import React, { useState } from 'react';
import { iniciarSesion, registrarUsuario } from '../api';

function Login({ onLogin }) {
  const [modoRegistro, setModoRegistro] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nombre, setNombre] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [registroExitoso, setRegistroExitoso] = useState(false);
  const [userIdRegistro, setUserIdRegistro] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (modoRegistro) {
        // Registro
        const responseRegistro = await registrarUsuario({ name: nombre, email, password });
        setRegistroExitoso(true);
        
        // Guardar el ID para mostrarlo
        if (responseRegistro.data.user && responseRegistro.data.user.id) {
          setUserIdRegistro(responseRegistro.data.user.id);
        }
        
        // Hacer login automatico despues de 5 segundos
        setTimeout(async () => {
          try {
            const response = await iniciarSesion({ email, password });
            onLogin(response.data);
          } catch (err) {
            console.error('Error en login automatico:', err);
          }
        }, 5000);
      } else {
        // Login
        const response = await iniciarSesion({ email, password });
        onLogin(response.data);
      }
    } catch (err) {
      console.error('Error de autenticacion:', err);
      setError(
        modoRegistro 
          ? 'Error al registrar. Verifica que el email no este en uso.'
          : 'Credenciales incorrectas. Verifica tu email y contrasena.'
      );
      setRegistroExitoso(false);
    } finally {
      setLoading(false);
    }
  };

  const copiarAlPortapapeles = () => {
    if (userIdRegistro) {
      navigator.clipboard.writeText(userIdRegistro);
      alert('ID copiado al portapapeles');
    }
  };

  // Pantalla de confirmacion despues del registro exitoso
  if (registroExitoso && userIdRegistro) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #1e40af 0%, #0369a1 100%)',
        padding: '20px'
      }}>
        <div className="card" style={{ maxWidth: '600px', width: '100%' }}>
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <div style={{ fontSize: '60px', marginBottom: '20px' }}>&#10003;</div>
            <h1 style={{ color: '#10b981', fontSize: '32px', marginBottom: '10px' }}>
              Registro Exitoso
            </h1>
            <p style={{ color: '#6b7280', fontSize: '16px' }}>
              Tu cuenta ha sido creada correctamente
            </p>
          </div>

          <div style={{
            background: '#dbeafe',
            border: '3px solid #2563eb',
            borderRadius: '12px',
            padding: '25px',
            marginBottom: '25px'
          }}>
            <p style={{ 
              margin: '0 0 15px 0',
              fontSize: '16px',
              color: '#1e3a8a',
              fontWeight: '700',
              textAlign: 'center'
            }}>
              TU ID DE USUARIO
            </p>
            <div style={{
              background: 'white',
              padding: '20px',
              borderRadius: '8px',
              fontFamily: 'monospace',
              fontSize: '14px',
              color: '#1f2937',
              wordBreak: 'break-all',
              border: '2px solid #2563eb',
              lineHeight: '1.8',
              textAlign: 'center',
              fontWeight: 'bold'
            }}>
              {userIdRegistro}
            </div>
            <button
              onClick={copiarAlPortapapeles}
              style={{
                width: '100%',
                marginTop: '15px',
                padding: '12px',
                background: '#2563eb',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Copiar ID al Portapapeles
            </button>
          </div>

          <div style={{
            background: '#fef3c7',
            border: '3px solid #f59e0b',
            borderRadius: '12px',
            padding: '20px',
            marginBottom: '25px'
          }}>
            <p style={{ fontSize: '18px', marginBottom: '10px', fontWeight: 'bold' }}>
              MUY IMPORTANTE
            </p>
            <ul style={{
              margin: 0,
              paddingLeft: '20px',
              fontSize: '14px',
              color: '#92400e',
              lineHeight: '1.8'
            }}>
              <li><strong>Anota o copia este ID ahora</strong></li>
              <li>Lo necesitaras para que otros te agreguen a gastos compartidos</li>
              <li>Tambien aparecera en tu perfil cuando inicies sesion</li>
              <li>Comparte este ID con las personas de tus viajes</li>
            </ul>
          </div>

          <div style={{
            background: '#f3f4f6',
            borderRadius: '8px',
            padding: '15px',
            textAlign: 'center'
          }}>
            <p style={{ margin: 0, fontSize: '14px', color: '#4b5563' }}>
              Redirigiendo a la aplicacion en 5 segundos...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #1e40af 0%, #0369a1 100%)',
      padding: '20px'
    }}>
      <div className="card" style={{ maxWidth: '400px', width: '100%' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '30px', color: '#1e40af' }}>
          Gestor de Gastos
        </h1>

        {error && <div className="error">{error}</div>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
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
            <label htmlFor="password">Contrasena</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="........"
              required
              disabled={loading}
              minLength={6}
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            style={{ 
              width: '100%',
              padding: '12px 24px',
              backgroundColor: '#f97316',
              fontSize: '16px'
            }}
          >
            {loading 
              ? 'Procesando...' 
              : modoRegistro 
                ? 'Registrarse' 
                : 'Iniciar Sesion'
            }
          </button>
        </form>

        <div style={{ 
          textAlign: 'center', 
          marginTop: '20px',
          padding: '15px',
          background: '#f0f4f8',
          borderRadius: '8px'
        }}>
          <p style={{ fontSize: '14px', color: '#4b5563', marginBottom: '10px' }}>
            {modoRegistro 
              ? 'Ya tienes cuenta?' 
              : 'No tienes cuenta?'
            }
          </p>
          <button
            type="button"
            onClick={() => {
              setModoRegistro(!modoRegistro);
              setError(null);
            }}
            disabled={loading}
            style={{ 
              width: '100%',
              padding: '12px 24px',
              backgroundColor: '#64748b',
              fontSize: '16px'
            }}
          >
            {modoRegistro 
              ? 'Iniciar Sesion' 
              : 'Crear Cuenta Nueva'
            }
          </button>
        </div>

        {!modoRegistro && (
          <div style={{ 
            marginTop: '20px',
            padding: '15px',
            background: '#e0f2fe',
            borderRadius: '8px',
            fontSize: '13px',
            color: '#0c4a6e',
            borderLeft: '4px solid #0369a1'
          }}>
            <strong>Consejo:</strong> Si no tienes cuenta, haz clic en "Crear Cuenta Nueva"
          </div>
        )}
      </div>
    </div>
  );
}

export default Login;