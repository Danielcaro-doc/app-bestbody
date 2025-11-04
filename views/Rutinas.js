import React, { useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, Text, View, Image, ScrollView, RefreshControl, ImageBackground } from 'react-native';
import axiosInstance from '../api/axiosConfig'; 
import moment from 'moment';
import CirclePlay from '../assets/icons/CirclePlay';
import Sets from '../assets/icons/Sets';
import Rest from '../assets/icons/Rest';
import ArrowRight from '../assets/icons/ArrowRight';

export default function Rutinas({ navigation }) {
  const [rutinasRecomendadas, setRutinasRecomendadas] = useState([]);
  const [rutinas, setRutinas] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date()); // Establecer una fecha inicial

  // Fetch de rutinas recomendadas
  const fetchRutinasRecomendadas = async () => {
    try {
      const response = await axiosInstance.get('/rutinasRecomendadas'); // Asegúrate de que la URL sea correcta
      if (response.data.rutinas) {
        setRutinasRecomendadas(response.data.rutinas);
        console.log('Rutinas recomendadas:', response.data.rutinas);
      } else {
        console.error('Error: No se encontraron rutinas');
      }
    } catch (error) {
      console.error('Error al obtener las rutinas: ', error);
    }
  };

  // Fetch de rutinas
  const listRutinas = async () => {
    try {
      const response = await axiosInstance.get('/rutinasColeccion');
      setRutinas(response.data);
    } catch (error) {
      console.error('Error: ', error);
    }
  };

  // Refrescar ambas listas
  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([fetchRutinasRecomendadas(), listRutinas()]);
    setRefreshing(false);
  };

  useEffect(() => {
    fetchRutinasRecomendadas();
    listRutinas();
  }, []); 

  const defaultPortada = 'https://app.bestbodygym.com/storage/images/portada-rutina.jpg';


  return (
    <ScrollView
      style={{ backgroundColor: '#E8E9EA' }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
    >
      <View style={styles.container}>
        <View style={{ width: '95%' }}>

            <View style={styles.listRutinasGrid}>
              {rutinasRecomendadas ? (
                <TouchableOpacity
                  key={rutinasRecomendadas.id}
                  style={styles.imageContainerRutinas}
                  onPress={() => navigation.navigate('DetallesRutinas', { id: rutinasRecomendadas.id })}
                >
                  <ImageBackground
                    source={{ uri: rutinasRecomendadas.imagen ? `https://app.bestbodygym.com/${rutinasRecomendadas.imagen}` : defaultPortada }}
                    style={styles.imageBackgroundRutinas}
                  >
                    <View style={styles.overlayRutinas}>
                      <Text style={styles.textCategoriaRutinas}>{rutinasRecomendadas.nombre}</Text>
                      <View style={styles.contentRutinasRutinas}>
                      
                          <Text style={{fontSize: 18,color: '#fff',fontWeight: 'bold',marginBottom: 5,}}> {rutinasRecomendadas.imagen ? `Rutina Recomendada` : `Valoración` } </Text>
                        <View style={styles.grid}>
                          <View style={styles.grid}>
                            <View style={styles.bgIcon}>
                              <Sets />
                            </View>
                            <View>
                              <Text style={styles.titleBoxRutinas}>Total ejercicios</Text>
                              <Text style={styles.textBoxRutinas}>
                              {rutinasRecomendadas.total_ejercicios_semana ? rutinasRecomendadas.total_ejercicios_semana : `14 - 16 ` } 
                               por semana</Text>
                            </View>
                          </View>
                          <View style={styles.grid}>
                            <View style={styles.bgIcon}>
                              <Rest />
                            </View>
                            <View>
                              <Text style={styles.titleBoxRutinas}>Tiempo estimado</Text>
                              <Text style={styles.textBoxRutinas}>{rutinasRecomendadas.tiempo_estimado_diario}</Text>
                            </View>
                          </View>
                        </View>
                      </View>
                    </View>
                  </ImageBackground>
                </TouchableOpacity>
              ) : (
                <Text>No se encontraron rutinas recomendadas</Text>
              )}
          </View>


          <View style={styles.listRutinasGrid}>
            {rutinas.map((rutina, index) => (
              <TouchableOpacity
                key={index}
                style={styles.imageContainer}
                onPress={() => navigation.navigate('DetallesRutinas', { id: rutina.id })}
              >
                <ImageBackground
                  source={{ uri: `https://app.bestbodygym.com/${rutina.imagen}` }}
                  style={styles.imageBackground}
                >
                  <View style={styles.overlay}>
                    <Text style={styles.textCategoria}>
                      {rutina.nombre}
                    </Text>
                    <View style={styles.contentRutinas}>
                      <View style={styles.grid}>
                        <View style={styles.grid}>
                          <View style={styles.bgIcon}>
                            <Sets />
                          </View>
                          <View>
                            <Text style={styles.titleBox}>Total ejercicios </Text>
                            <Text style={styles.textBox}>{rutina.total_ejercicios_semana} por semana</Text>
                          </View>
                        </View>
                        <View style={styles.grid}>
                          <View style={styles.bgIcon}>
                            <Rest />
                          </View>
                          <View>
                            <Text style={styles.titleBox}>Tiempo estimado</Text>
                            <Text style={styles.textBox}>{rutina.tiempo_estimado_diario}</Text>
                          </View>
                        </View>
                      </View>
                    </View>
                  </View>
                </ImageBackground>
              </TouchableOpacity>
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
    gridTExt:{        
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    contentRutinasTitle:{
        color: '#1A1A1A',
        fontSize: 18,
        fontWeight: 'bold',
        marginRight: 5,
    },
    contentRutinasSubtitle: {
        color: '#1A1A1A',
        fontSize: 14,
        fontWeight: 'regular',
    },
    grid:{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    imageContainer: {
        width: '100%',
        marginBottom: 15,
    },
    bgIcon:{
        backgroundColor: '#D6FD67',
        borderRadius: 90,
        padding: 7,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 7,
        alignContent: 'center',
    },  
    textCategoria: {
    backgroundColor: '#D5FF5F',
    paddingVertical: 10,
    paddingHorizontal: 18,
    color: '#1A1A1A',
    borderRadius: 90,
    fontWeight: 'bold',
    flex: 0,
    width: '55%',
    textAlign: 'center',
    fontSize: 13,
    },
    contentRutinas:{
        width: '100%',
        backgroundColor: '#fff',
        padding: 12,
        borderRadius: 10,
        marginBottom: 5,
        backgroundColor: 'rgba(255, 255, 255, 0.7)', // Fondo blanco con opacidad

    },
    titleBox:{
        color: '#1A1A1A',
        fontSize: 15,
        fontWeight: 'bold',
    },
    textBox: {
    color: '#171717',
    fontSize: 12,
    fontWeight: 'regular',
    },
    titleBoxRutinas:{
        color: '#fff',
        fontSize: 15,
        fontWeight: 'bold',
    },
    textBoxRutinas: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'regular',
    },


    imageBackground: {
        height: 240,
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingBottom: 5,
        borderRadius: 8,
        position: 'relative',
        overflow: 'hidden',
        
      },
      overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'space-between',
        flexDirection: 'column',
        borderRadius: 6,
        overflow: 'hidden',
        padding: 14,
        alignSelf: 'flex-start',
      },




      imageContainerRutinas: {
        width: '100%',
        marginBottom: 15,
    },
    imageBackgroundRutinas: {
      height: 240,
      justifyContent: 'flex-end',
      alignItems: 'center',
      paddingBottom: 5,
      borderRadius: 8,
      position: 'relative',
      overflow: 'hidden',

    },
    contentRutinasRutinas:{
      width: '100%',
      backgroundColor: '#fff',
      padding: 12,
      borderRadius: 10,
      marginBottom: 5,
      backgroundColor: 'rgba(12, 186, 237, 0.5)', // Fondo blanco con opacidad

  },
    overlayRutinas: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'space-between',
      flexDirection: 'column',
      borderRadius: 6,
      overflow: 'hidden',
      padding: 14,
      alignSelf: 'flex-start',
    },
    textCategoriaRutinas: {
      backgroundColor: '#0CBAED',
      paddingVertical: 10,
      paddingHorizontal: 18,
      color: '#fff',
      borderRadius: 90,
      fontWeight: 'bold',
      flex: 0,
      width: '55%',
      textAlign: 'center',
      fontSize: 13,
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
  