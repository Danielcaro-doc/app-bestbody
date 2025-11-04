// src/api/axiosConfig.js
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { navigate } from '../navigation/RootNavigation';

const axiosInstance = axios.create({
    baseURL: 'https://app.bestbodygym.com/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor para agregar el token a las cabeceras de cada solicitud
axiosInstance.interceptors.request.use(
    async (config) => {
        try {
            const token = await AsyncStorage.getItem('authToken');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        } catch (error) {
            console.error('Error obteniendo el token de AsyncStorage', error);
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Interceptor para manejar errores de respuesta
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 403) {
            navigate('PlanExpired');
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
