import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Image, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axiosInstance from '../api/axiosConfig';

const DefaultImage = require('../assets/images/defaultImage.jpg');

const Zonas = () => {
  const [entrenadores, setEntrenadores] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axiosInstance.get('/entrenadores');
        setEntrenadores(response.data);
      } catch (error) {
        if (error.response && error.response.status === 403) {
          navigation.navigate('PlanExpired');
        } else {
          console.log('Error al obtener los datos', error.message);
        }
      }
    };

    fetchUserData();
  }, []);

  const getInitials = (nombre, apellido) => {
    const nameInitial = nombre ? nombre.charAt(0).toUpperCase() : '';
    const lastNameInitial = apellido ? apellido.charAt(0).toUpperCase() : '';
    return `${nameInitial}${lastNameInitial}`;
  };

  const getRandomColor = () => {
    const colors = ['#FFB6C1', '#B0E0E6', '#FFD700', '#98FB98', '#DDA0DD'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  return (
    <ScrollView style={{ backgroundColor: '#E8E9EA' }}>
      <View style={styles.container}>
        <View style={{ width: '95%', marginTop: 20 }}>
          <View style={styles.grid}>
            {entrenadores.map((entrenador, index) => (
              <TouchableOpacity
                key={index}
                style={styles.box}
                onPress={() => navigation.navigate('DetalleEntrenador', { entrenador })}
              >
                {entrenador.foto ? (
                  <Image
                    style={styles.image}
                    source={{ uri: `https://app.bestbodygym.com/${entrenador.foto}` }}
                    defaultSource={DefaultImage}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = DefaultImage;
                    }}
                  />
                ) : (
                  <View style={[styles.defaultAvatar, { backgroundColor: getRandomColor() }]}>
                    <Text style={styles.initials}>{getInitials(entrenador.nombre, entrenador.apellido)}</Text>
                  </View>
                )}
                <Text>{entrenador.nombre} {entrenador.apellido}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </ScrollView>
  );
};


export default function Entrenadores() {
  return (
    <View style={{ flex: 1 }}>
      <Zonas />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#E8E9EA',
    alignItems: 'center',
    height: '100%',
    paddingBottom: 100,
  },
  grid: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    width: '100%',
  },
  box: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginRight: 7,
    marginTop: 7,
    width: '48%',
  },
  image: {
    width: 82,
    height: 82,
    borderRadius: 90,
  },
  defaultAvatar: {
    width: 82,
    height: 82,
    borderRadius: 90,
    justifyContent: 'center',
    alignItems: 'center',
  },
  initials: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
});
