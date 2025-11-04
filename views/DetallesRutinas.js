import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import axiosInstance from '../api/axiosConfig';
import { useNavigation } from '@react-navigation/native';
import CirclePlay from '../assets/icons/CirclePlay';
const daysOfWeek = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

const DetallesRutinas = ({ route }) => {
  const { id } = route.params;
  const [rutina, setRutina] = useState(null);
  const [ejerciciosPorDia, setEjerciciosPorDia] = useState({});
  const [selectedDay, setSelectedDay] = useState(daysOfWeek[0]);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchRutina = async () => {
      try {
        const response = await axiosInstance.get(`/rutinasColeccion/${id}`);
        setRutina(response.data.rutina);
        setEjerciciosPorDia(response.data.ejerciciosPorDia);
      } catch (error) {
        console.error('Error: ', error);
      }
    };
    fetchRutina();
  }, [id]);

  const getGruposMusculares = (ejercicios) => {
    const grupos = {};
    ejercicios.forEach(ejercicio => {
      const grupo = ejercicio.ejercicio.grupos_ejercicios.nombre;
      if (!grupos[grupo]) {
        grupos[grupo] = [];
      }
      grupos[grupo].push(ejercicio);
    });
    return grupos;
  };

  if (!rutina) {
    return <Text>Cargando...</Text>;
  }


  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Rutina para: {rutina.nombre} </Text>
      <ScrollView horizontal style={styles.dayButtonsContainer}>
        {daysOfWeek.map((day) => (
          <TouchableOpacity
              key={day}
              style={[styles.dayButton, selectedDay === day && styles.selectedDayButton]}
              onPress={() => setSelectedDay(day)}
            >
              <Text style={[styles.dayButtonText, selectedDay === day && styles.selectedDayButtonText]}>
                {day}
              </Text>
            </TouchableOpacity>

        ))}
      </ScrollView>

      <ScrollView style={styles.scrollView}>
        {ejerciciosPorDia[selectedDay] ? (
          <>
            <Text style={styles.subtitulo}>
              {Array.from(new Set(ejerciciosPorDia[selectedDay].map(ej => ej.ejercicio.grupos_ejercicios.nombre))).join(', ')}
            </Text>
            {Object.entries(getGruposMusculares(ejerciciosPorDia[selectedDay])).map(([grupo, ejercicios]) => (
              <View key={grupo}>
                <Text style={styles.grupoMuscularTitle}>{grupo}</Text>
                {ejercicios.map((ejercicio) => (
                  <TouchableOpacity
                    key={ejercicio.id}
                    style={styles.boxEjerciciosDia}
                    onPress={() => {
                      navigation.navigate('DetalleEjercicio', { ejercicio: ejercicio.ejercicio });
                    }}
                  >
                      <Image
                      style={styles.image}
                      source={{ uri: `https://app.bestbodygym.com/${ejercicio.ejercicio.imagen}` }}
                    />

                    <View style={{ width: '60%' }}>
                      <Text style={{ fontSize: 15, fontWeight: '600', marginBottom: 5 }}>{ejercicio.ejercicio.nombre}</Text>
                      <Text style={{ fontSize: 13, fontWeight: '400', color: '#737C98' }}>Set: {ejercicio.ejercicio.sets}</Text>
                      <Text style={{ fontSize: 13, fontWeight: '400', color: '#737C98' }}>Repeticiones: {ejercicio.ejercicio.repeticiones}</Text>
                      <Text style={{ fontSize: 13, fontWeight: '400', color: '#737C98' }}>Descanso: {ejercicio.ejercicio.descansos}s</Text>
                    </View>
                    <CirclePlay style={{ width: '10%' }} />


                  </TouchableOpacity>
                ))}
              </View>
            ))}
          </>
        ) : (
          <Text style={styles.noEjerciciosText}>No hay ejercicios para este día.</Text>
        )}
      </ScrollView>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: '#E8E9EA',
    alignItems: 'center',
  },
  dayButtonsContainer: {
    marginBottom:0,
    height: 'auto',
    paddingBottom: 5,
  },
  dayButton: {
    paddingHorizontal: 25,
    paddingVertical: 25,
    borderRadius: 5,
    marginRight: 8,
    backgroundColor: '#fff',
  },
  selectedDayButton: {
    backgroundColor: '#1A1A1A',
  },
  selectedDayButtonText: {
    color: '#D5FF5F',
  },
  dayButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  scrollView: {
    height: '73%',
    width: '100%',
    paddingBottom: 250,
    marginBottom: 50,
  },
  titulo: {
    fontSize: 18,
  },
  subtitulo: {
    fontSize: 14,
    fontWeight: 'medium',
    marginTop: 0,
    zIndex: 10,

  },
  grupoMuscularTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: -3,
  },
  ejercicioContainer: {
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  ejercicioTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  noEjerciciosText: {
    fontSize: 16,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 20,
  },



  icono:{
    marginLeft: 10,
  }, 
  titulo: {
    fontSize: 19,
    textAlign: 'center',
    color: '#1A1A1A',
    textAlignVertical: 'center',
    fontWeight: '800',
    marginBottom: 10,
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
    width: 80,
    height: 80,
    borderRadius: 10,
    objectFit: 'cover',
  },
});

export default DetallesRutinas;
