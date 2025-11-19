import React, { useState, useEffect } from 'react';
import { crearGasto, obtenerViajeDetalle } from '../api';

function AgregarGasto({ viaje, navegarA }) {
  const [titulo, setTitulo] = useState('');
  const [monto, setMonto] = useState('');
  const [pagadorId, setPagadorId] = useState('');
  const [participantesSeleccionados, setParticipantesSeleccionados] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!titulo.trim()) {
      setError('El titulo del gasto es obligatorio');
      return;
    }

    if (!monto || parseFloat(monto) <= 0) {
      setError('El monto debe ser mayor a 0');
      return;
    }

    if (!pagadorId.trim()) {
      setError('Debes ingresar el ID del pagador');
      return;
    }

    if (participantesSeleccionados.length === 0) {
      setError('Debes agregar al menos un participante');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const datos = {
        title: titulo,
        amount: parseFloat(monto),
        payerId: pagadorId,
        sharedWithIds: participantesSeleccionados
      };

      await crearGasto(viaje.id, datos);

      setSuccess('Gasto agregado exitosamente');

      setTitulo('');
      setMonto('');
      setPagadorId('');
      setParticipantesSeleccionados([]);

      setTimeout(() => {
        navegarA('detalle', viaje);
      }, 2000);

    } catch (err) {
      console.error('Error al crear gasto:', err);
      if (err.response && err.response.data) {
        setError(err.response.data.message || 'Error al crear el gasto');
      } else {
        setError('Error al crear el gasto. Verifica los datos ingresados.');
      }
    } finally {
      setLoading(false);
    }
  };

  const agregarParticipante = () => {
    const input = document.getElementById('participante-input');
    const valor = input.value.trim();
    
    if (valor && !participantesSeleccionados.includes(valor)) {
      setParticipantesSeleccionados([...participantesSeleccionados, valor]);
      input.value = '';
    }
  };

  const eliminarParticipante = (id) => {
    setParticipantesSeleccionados(participantesSeleccionados.filter(p => p !== id));
  };

  if (!viaje) {
    return (
      <div className="card">
        <p>No se ha seleccionado ningun viaje</p>
        <button onClick={() => navegarA('lista')}>Volver a la lista</button>
      </div>
    );
  }

  return (
    <div className="card">
      <h2>Agregar Gasto a: {viaje.name}</h2>

      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="titulo">Titulo del Gasto *</label>
          <input
            type="text"
            id="titulo"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            placeholder="Ej: Cena en restaurante"
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="monto">Monto ({viaje.currency}) *</label>
          <input
            type="number"
            id="monto"
            value={monto}
            onChange={(e) => setMonto(e.target.value)}
            placeholder="0.00"
            step="0.01"
            min="0.01"
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="pagador">ID del Pagador *</label>
          <input
            type="text"
            id="pagador"
            value={pagadorId}
            onChange={(e) => setPagadorId(e.target.value)}
            placeholder="UUID del usuario pagador"
            disabled={loading}
          />
          <small style={{ color: '#718096', fontSize: '12px' }}>
            Ingresa el ID del usuario que realizo el pago. Puede ser tu propio ID o el de otra persona.
          </small>
        </div>

        <div className="form-group">
          <label>Compartir gasto con (IDs) *</label>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
            <input
              type="text"
              id="participante-input"
              placeholder="UUID del participante"
              disabled={loading}
              style={{ flex: 1 }}
            />
            <button 
              type="button" 
              onClick={agregarParticipante}
              disabled={loading}
            >
              Agregar
            </button>
          </div>
          
          {participantesSeleccionados.length > 0 && (
            <div style={{ marginTop: '10px' }}>
              <p style={{ fontSize: '14px', marginBottom: '10px', color: '#4a5568' }}>
                Participantes ({participantesSeleccionados.length}):
              </p>
              {participantesSeleccionados.map((id, index) => (
                <div 
                  key={index}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '8px',
                    background: '#f7fafc',
                    borderRadius: '4px',
                    marginBottom: '5px'
                  }}
                >
                  <span style={{ fontSize: '12px', color: '#4a5568' }}>{id}</span>
                  <button
                    type="button"
                    onClick={() => eliminarParticipante(id)}
                    style={{ 
                      padding: '4px 8px', 
                      fontSize: '12px',
                      background: '#f56565'
                    }}
                  >
                    X
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="btn-group">
          <button type="submit" disabled={loading} className="btn-success">
            {loading ? 'Guardando...' : 'Guardar Gasto'}
          </button>
          <button 
            type="button"
            className="btn-secondary"
            onClick={() => navegarA('detalle', viaje)}
            disabled={loading}
          >
            Cancelar
          </button>
        </div>
      </form>

      <div style={{ 
        marginTop: '30px', 
        padding: '20px', 
        background: '#e0f2fe', 
        borderRadius: '8px',
        borderLeft: '4px solid #0369a1'
      }}>
        <h3 style={{ fontSize: '16px', marginBottom: '10px', color: '#0c4a6e' }}>
          Como obtener los IDs
        </h3>
        <ul style={{ fontSize: '14px', color: '#0c4a6e', lineHeight: '1.6', margin: 0, paddingLeft: '20px' }}>
          <li><strong>Tu propio ID:</strong> Haz clic en "Ver Mi ID" en el header (arriba a la derecha)</li>
          <li><strong>ID de otros usuarios:</strong> Pide a cada persona que comparta su ID desde su perfil</li>
          <li><strong>Participantes:</strong> Agrega el ID de cada persona que compartira este gasto</li>
          <li>El gasto se dividira equitativamente entre todos los participantes</li>
        </ul>
      </div>
    </div>
  );
}

export default AgregarGasto;