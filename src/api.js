import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3002',
  headers: {
    'Content-Type': 'application/json',
  }
});

// debo cambiar esto en cada ejecucion?
const USER_ID = 'fec8ff60-7ce6-4b06-b741-6a98a1af2137';

api.interceptors.request.use(
  (config) => {
    config.headers['user-id'] = USER_ID;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// TRIPS
export const obtenerViajes = () => {
  return api.get('/trips');
};

export const obtenerViajeDetalle = (tripId) => {
  return api.get(`/trips/${tripId}`);
};

export const crearViaje = (datos) => {
  return api.post('/trips', datos);
};

export const unirseAViaje = (codigo) => {
  return api.post('/trips/join', { code: codigo });
};

// EXPENSES
export const obtenerGastos = (tripId) => {
  return api.get(`/trips/${tripId}/expenses`);
};

export const crearGasto = (tripId, datos) => {
  return api.post(`/trips/${tripId}/expenses`, datos);
};

export const obtenerGastoDetalle = (tripId, expenseId) => {
  return api.get(`/trips/${tripId}/expenses/${expenseId}`);
};

// BALANCES
export const obtenerBalances = (tripId) => {
  return api.get(`/trips/${tripId}/balances`);
};

export const liquidarBalances = (tripId) => {
  return api.post(`/trips/${tripId}/balances/settle`);
};

export default api;