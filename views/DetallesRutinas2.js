import React, { useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, Text, View, Image, ScrollView, RefreshControl } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import CirclePlay from '../assets/icons/CirclePlay';

export default function Rutinas({ navigation }) {
  const [weekDates, setWeekDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState(moment().format('YYYY-MM-DD'));
  const [rutinas, setRutinas] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [nombresGruposEjercicios, setNombresGruposEjercicios] = useState([]);

  useEffect(() => {
    const startOfWeek = moment().startOf('isoWeek');
    const dates = [];
    for (let i = 0; i < 7; i++) {
      dates.push(startOfWeek.clone().add(i, 'days').format('YYYY-MM-DD'));
    }
    setWeekDates(dates);
  }, []);

  useEffect(() => {
    fetchRutinas(moment(selectedDate).isoWeekday());
  }, [selectedDate]);

  useEffect(() => {
    const today = moment().format('YYYY-MM-DD');
    setSelectedDate(today);
    fetchRutinas(moment(today).isoWeekday());
  }, []);

  const fetchRutinas = async (diaSemana) => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (token) {
        const response = await axios.post('https://app.bestbodygym.com/api/getRutinasByDay', {
          diaSemana
        }, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setRutinas(response.data);

        if (response.data.length > 0 && response.data[0].ejercicios.length > 0) {
          const nombresGrupos = response.data[0].ejercicios.map(ejercicio => ejercicio.grupos_ejercicios);
          const nombresGruposUnicos = Array.from(new Set(nombresGrupos));
          setNombresGruposEjercicios(nombresGruposUnicos);
        } else {
          console.log('No hay datos disponibles.');
          setNombresGruposEjercicios([]);
        }
      }
    } catch (error) {
      console.log('Error al traer datos de las rutinas:', error);
      setNombresGruposEjercicios([]);
    }
  };

  const handleRefresh = () => { 
    setRefreshing(true);
    fetchRutinas(moment(selectedDate).isoWeekday()).finally(() => setRefreshing(false));
  };

  return (
    <ScrollView style={{ backgroundColor: '#E8E9EA' }} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}>
      <View style={styles.container}>
        <View style={{ width: '95%' }}>
          <Text style={{ color: '#1A1A1A', fontWeight: 'bold', fontSize: 15 }}>Rutinas de la semana:</Text>
          <View style={styles.calendario}>
            <ScrollView horizontal={true} contentContainerStyle={styles.contentScrollHorizontal}>
              {weekDates.map(date => {
                const isSelected = selectedDate === date;
                const dayName = moment(date).format('ddd');
                const dayNumber = moment(date).format('D');

                return (
                  <TouchableOpacity
                    key={date}
                    style={[styles.boxCalendario, isSelected && styles.activeBox]}
                    onPress={() => setSelectedDate(date)}
                  >
                    <Text style={[styles.dayNumber, isSelected && styles.activeText]}>{dayNumber}</Text>
                    <Text style={isSelected ? styles.activeText : null}>{dayName}</Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'flex-end', marginTop: 10 }}>
            <Text style={{ color: '#737C98', fontWeight: 'medium', fontSize: 12 }}>Grupos de ejercicio:</Text>
            {nombresGruposEjercicios.length > 0 ? (
              nombresGruposEjercicios.map((nombreGrupo, index) => (
                <Text key={index} style={{ color: '#1A1A1A', fontWeight: 'bold', fontSize: 15 }}>{nombreGrupo}, </Text>
              ))
            ) : (
              <Text>No hay grupos de ejercicios disponibles.</Text>
            )}
          </View>

          <View style={styles.sectionGrid}>
            {rutinas.map((rutina, index) => (
              <View key={index}>
                {rutina.ejercicios.map((ejercicio, ejIndex) => (
                  <TouchableOpacity 
                    key={ejIndex} 
                    style={styles.boxEjerciciosDia}
                    onPress={() => navigation.navigate('DetalleEjercicio', { ejercicio })}
                  >
                    <Image
                      style={styles.image}
                      source={{ uri: `https://app.bestbodygym.com/${ejercicio.imagen}` }}
                    />
                    <View>
                      <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 5 }}>{ejercicio.nombre}</Text>
                      <Text style={{ fontSize: 13, fontWeight: '400', color: '#737C98' }}>Repeticiones: {ejercicio.repeticiones}</Text>
                      <Text style={{ fontSize: 13, fontWeight: '400', color: '#737C98' }}>Descanso: {ejercicio.descansos}</Text>
                    </View>
                    <CirclePlay />
                  </TouchableOpacity>
                ))}
              </View>
            ))}
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
    container: {
      backgroundColor: '#E8E9EA',
      paddingTop: 20,
      paddingBottom: 130,
      alignItems: 'center',
    },
    logo:{
      margin: 'auto',
      alignSelf: 'center',
    }, 
    icono:{
      marginLeft: 10,
    }, 
    titulo: {
      fontSize: 40,
      textAlign: 'center',
      textAlignVertical: 'center',
      fontWeight: '800',
    },
    sectionGrid:{
      flexDirection: 'row',
      flexWrap: 'wrap',
      width: '100%',
  },
  boxEjerciciosDia:{
    width: '100%',
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderRadius: 10,
    marginTop: 10,
  },
  imagesBoxDia:{
    width: 90,
    height: 90,
    borderRadius: 7,
    objectFit: 'cover',
  },
    texto: {
      fontSize: 15,
      textAlign: 'center',
      textAlignVertical: 'center',
      color: '#737C98',
      marginTop: 10,
      marginBottom: 10,
    },
    image: {
      width: 110,
      height: 80,
      borderRadius: 10,
    },

    contentScrollHorizontal: {
      flexDirection: 'row',
      marginTop: 10,
      paddingBottom: 10,
    },
    boxCalendario: {
      paddingHorizontal: 25,
      paddingVertical: 25,
      borderRadius: 5,
      marginRight: 8,
      backgroundColor: '#fff',
    },
    activeBox: {
      backgroundColor: '#1A1A1A', 
    },
    activeText: {
        color: '#D5FF5F', 
        fontWeight: 'bold',
    },


  });
  