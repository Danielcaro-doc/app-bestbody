// global/UserContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const defaultFoto = 'https://app.bestbodygym.com/storage/images/perfil-predeterminado.webp';
  const baseUrl = 'https://app.bestbodygym.com/';

  const fetchUserData = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (token) {
        const response = await axios.get('https://app.bestbodygym.com/api/user', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setUserData({
          ...response.data,
          foto: response.data.foto ? `${baseUrl}${response.data.foto}` : defaultFoto,
          nombre: response.data.nombre,
          correo: response.data.correo,
          portada: response.data.portada,
          entrenador: response.data.entrenador,
        });
      } else {
        console.error('No se encontró un token de sesión.');
      }
    } catch (error) {
      console.error('Error al obtener datos del usuario:', error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <UserContext.Provider value={{ userData, setUserData, fetchUserData }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
