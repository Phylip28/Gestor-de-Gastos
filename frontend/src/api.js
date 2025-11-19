// URL del backend
const API_URL = 'http://localhost:3002';

// Helper para hacer peticiones con autenticación
const fetchWithAuth = async (url, options = {}) => {
  const userId = localStorage.getItem('userId');
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // El backend espera 'user-id' en el header, no un token JWT
  if (userId) {
    headers['user-id'] = userId;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw { response: { data: error } };
  }

  return response.json();
};

// ============================================
// FUNCIONES DE VIAJES (TRIPS)
// ============================================

/**
 * Obtener todos los viajes del usuario
 */
export const obtenerViajes = async () => {
  const data = await fetchWithAuth(`${API_URL}/trips`);
  return { data };
};

/**
 * Crear un nuevo viaje
 * @param {Object} datos - { name, currency, participantEmails }
 */
export const crearViaje = async (datos) => {
  const data = await fetchWithAuth(`${API_URL}/trips`, {
    method: 'POST',
    body: JSON.stringify(datos),
  });
  return { data };
};

/**
 * Obtener detalles de un viaje específico
 * @param {string} tripId - ID del viaje
 */
export const obtenerViajeDetalle = async (tripId) => {
  const data = await fetchWithAuth(`${API_URL}/trips/${tripId}`);
  return { data };
};

// ============================================
// FUNCIONES DE GASTOS (EXPENSES)
// ============================================

/**
 * Crear un gasto en un viaje
 * @param {string} tripId - ID del viaje
 * @param {Object} datos - { title, amount, payerId, sharedWithIds }
 */
export const crearGasto = async (tripId, datos) => {
  const data = await fetchWithAuth(`${API_URL}/trips/${tripId}/expenses`, {
    method: 'POST',
    body: JSON.stringify(datos),
  });
  return { data };
};

// ============================================
// FUNCIONES DE BALANCES
// ============================================

/**
 * Obtener balances de un viaje
 * @param {string} tripId - ID del viaje
 */
export const obtenerBalances = async (tripId) => {
  const data = await fetchWithAuth(`${API_URL}/trips/${tripId}/balances`);
  return { data };
};

/**
 * Calcular liquidación de balances
 * @param {string} tripId - ID del viaje
 */
export const liquidarBalances = async (tripId) => {
  const data = await fetchWithAuth(`${API_URL}/trips/${tripId}/balances/settle`);
  return { data };
};

// ============================================
// FUNCIONES DE AUTENTICACIÓN
// ============================================

/**
 * Registrar nuevo usuario
 * @param {Object} datos - { name, email, password }
 */
export const registrarUsuario = async (datos) => {
  const response = await fetch(`${API_URL}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datos),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw { response: { data: error } };
  }

  const data = await response.json();
  
  // Guardar el userId si viene en la respuesta
  if (data.user && data.user.id) {
    localStorage.setItem('userId', data.user.id);
    localStorage.setItem('userEmail', data.user.email);
    localStorage.setItem('userName', data.user.name);
  }
  
  return { data };
};

/**
 * Iniciar sesión
 * @param {Object} datos - { email, password }
 */
export const iniciarSesion = async (datos) => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datos),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw { response: { data: error } };
  }

  const data = await response.json();
  
  // Guardar el userId en lugar de un token JWT
  if (data.user && data.user.id) {
    localStorage.setItem('userId', data.user.id);
    localStorage.setItem('userEmail', data.user.email);
    localStorage.setItem('userName', data.user.name);
  }
  
  return { data };
};

/**
 * Cerrar sesión
 */
export const cerrarSesion = () => {
  localStorage.removeItem('userId');
  localStorage.removeItem('userEmail');
  localStorage.removeItem('userName');
};

/**
 * Verificar si hay sesión activa
 */
export const hayToken = () => {
  return !!localStorage.getItem('userId');
};

/**
 * Obtener el ID del usuario actual
 */
export const obtenerUserId = () => {
  return localStorage.getItem('userId');
};