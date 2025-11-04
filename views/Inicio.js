import React, { useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, ImageBackground, ScrollView, Alert, Modal, Text, View, Image, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Boton from '../components/Boton';
import ArrowRight from "../assets/icons/ArrowRight";
import CirclePlay from "../assets/icons/CirclePlay";
import Clock from "../assets/icons/Clock";
import BotonMediano from '../components/BotonMediano';
import axiosInstance from '../api/axiosConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import moment from 'moment';
import 'moment/locale/es';
import momentTimezone from 'moment-timezone';
import MotivationalMessages from '../components/MotivationalMessages ';
import Sets from '../assets/icons/Sets';
import Rest from '../assets/icons/Rest';

moment.locale('es');
momentTimezone.tz.setDefault('America/Bogota');

export default function WelcomeScreen() {
  const navigation = useNavigation();

  const [rutinas, setRutinas] = useState(null);
  const [clases1, setClases1] = useState([]);
  const [ejercicio1, setEjercicio1] = useState([]);
  const [inscripciones, setInscripciones] = useState([]);
  const [modalReservaVisible, setModalReservaVisible] = useState(false);
  const [selectedClase, setSelectedClase] = useState(null);
  const [refreshing, setRefreshing] = useState(false);


    const [weekDates, setWeekDates] = useState([]);
    const [selectedDate, setSelectedDate] = useState(moment().format('YYYY-MM-DD'));

    useEffect(() => {
        const startOfWeek = moment().startOf('week');
        const dates = [];
        for (let i = 0; i < 7; i++) {
            dates.push(startOfWeek.clone().add(i, 'days').format('YYYY-MM-DD'));
        }
        setWeekDates(dates);
    }, []);


  // Inscripciones
  useEffect(() => {
    fetchInscripciones();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([fetchRutinas(), fetchClases1(), fetchEjercicio1(), fetchInscripciones()]);
    setRefreshing(false);
  };

  // Lista de rutinas
  const fetchRutinas = async () => {
    try {
      const response = await axiosInstance.get('/rutinasRecomendadas'); // Asegúrate de que la URL sea correcta
      if (response.data.rutinas) {
        setRutinas(response.data.rutinas);
        console.log('Rutinas recomendadas:', response.data.rutinas);
      } else {
        console.error('Error: No se encontraron rutinas');
      }
    } catch (error) {
      console.error('Error al obtener las rutinas: ', error);
    }
  };

  useEffect(() => {
    fetchRutinas();
  }, []);

  // Suscripciones del usuario
  const primeraInscripcion = inscripciones.length > 0 ? inscripciones[0] : null;
  const fetchInscripciones = async () => {
    try {
      const response = await axiosInstance.get('/inscripcionUser');
      setInscripciones(response.data);
      console.log('incripcion del usuario: ', response.data);
    } catch (error) {
      console.error('Error inscripcion: ', error);
    }
  };

  // Lista de clases
  const fetchClases1 = async () => {
    try {
      const response = await axiosInstance.get('/clases1');
      setClases1(response.data);
    } catch (error) {
      console.error('Error: ', error);
    }
  };
  const imgPredetrminada = "https://app.bestbodygym.com/storage/images/perfil-predeterminado.webp";

  const convertToAMPM = (dateString) => {
    const date = new Date(dateString.replace(' ', 'T')); 
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; 
    const minutesStr = minutes < 10 ? `0${minutes}` : minutes;
    const strTime = `${hours}:${minutesStr} ${ampm}`;
    return strTime;
  }; 


  // Lista de ejercicios
  const fetchEjercicio1 = async () => {
    try {
      const response = await axiosInstance.get('/ejercicio1');
      setEjercicio1(response.data);
    } catch (error) {
      console.error('Error: ', error);
    }
  };

  // Reservar clases
  useEffect(() => {
    handleRefresh();
  }, []); 

  const handleConfirm = async () => {
    if (!selectedClase) return;

    try {
      const response = await axiosInstance.post('/reservaClase', {
        id: selectedClase.id,
        confirmado: 1
      });

      console.log('Reserva confirmada:', response.data);
      closeModalReserva();
      Alert.alert('Reserva Confirmada', 'Tu reserva ha sido confirmada exitosamente, no más se complete el cupo te enviaremos una notificación al correo.', [{ text: 'Ok', onPress: closeModalReserva }]);
      handleRefresh();
    } catch (error) {
      console.error('Error al confirmar la reserva:', error);
    }
  };

  const openModalReserva = (clase) => {
    setSelectedClase(clase);
    setModalReservaVisible(true);
  };

  const closeModalReserva = () => {
    setModalReservaVisible(false);
    setSelectedClase(null);
  };

  const defaultPortada = 'https://app.bestbodygym.com/storage/images/portada-rutina.jpg';

    return(
      <ScrollView 
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
>
        <View style={styles.container}>



          <View
                  style={styles.BannerContainer}
                > 
                  <ImageBackground 
                    source={{ uri: 'https://t4.ftcdn.net/jpg/01/44/17/47/360_F_144174786_rf6a74RBVK2Njzsx9juej4uUaKFWnZ3U.jpg' }} 
                    style={styles.banner}
                  >
                    <View style={styles.overlayBanner}>
  
                      <MotivationalMessages style={styles.overlayTextBanner} />
                    </View>
                  </ImageBackground>
          </View>





          <View style={styles.content}>
          <LinearGradient colors={['rgba(255,255,255,0)', 'rgba(214,253,103,1)']} style={styles.contentCalendario}>
          {primeraInscripcion ? (
        <View style={styles.contentHeaderTop}>
          <View> 
            <Text>Tu plan vence</Text>
            <Text style={{ fontSize: 20, fontWeight: '600' }}>{primeraInscripcion.fecha_fin}</Text>
          </View>
          <View>
            <Text style={{ fontSize: 17, fontWeight: '600' }}>{primeraInscripcion.tiempo_restante}</Text>
          </View>
        </View>
      ) : (
        <Text>No hay inscripciones disponibles.</Text>
      )}
        <View style={styles.calendario}>
            <ScrollView horizontal={true} contentContainerStyle={styles.contentScrollHorizontal}>
                {weekDates.map(date => {
                    const isToday = moment().format('YYYY-MM-DD') === date;
                    const dayName = moment(date).format('ddd');
                    const dayNumber = moment(date).format('D');

                    return (
                        <TouchableOpacity
                            key={date}
                            style={[styles.boxCalendario, isToday && styles.activeBox]}
                            onPress={() => setSelectedDate(date)}
                        >
                            <Text style={[styles.dayNumber, isToday && styles.activeText]}>{dayNumber}</Text>
                            <Text style={isToday ? styles.activeText : null}>{dayName}</Text>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>
        </View>
            </LinearGradient>
          </View>

          <View style={{ width: '95%', marginTop: 20, }}>
            <View style={styles.contentHeaderTop}>
                <View>
                  <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 10, }}>Rutina recomendada</Text>
                </View>
                <View>
                  <Text onPress={() => navigation.navigate('Rutinas')} style={{ fontSize: 13, fontWeight: '600', color: '#0CBAED',marginBottom: 10, }}>Ver todos <ArrowRight />  </Text>
                </View>
              </View>
 
        <View style={styles.listRutinasGrid}>
      {rutinas ? (
        <TouchableOpacity
          key={rutinas.id}
          style={styles.imageContainerRutinas}
          onPress={() => navigation.navigate('DetallesRutinas', { id: rutinas.id })}
        >
          <ImageBackground
            source={{ uri: rutinas.imagen ? `https://app.bestbodygym.com/${rutinas.imagen}` : defaultPortada }}
            style={styles.imageBackgroundRutina}
          >
            <View style={styles.overlayRutina}>
              <Text style={styles.textCategoria}>{rutinas.nombre}</Text>
              <View style={styles.contentRutinas}>
                      <View style={styles.grid}>
                        <View style={styles.grid}>
                          <View style={styles.bgIcon}>
                            <Sets />
                          </View>
                          <View>
                            <Text style={styles.titleBox}>Total ejercicios </Text>
                            <Text style={styles.textBox}>{rutinas.total_ejercicios_semana ? rutinas.total_ejercicios_semana : `20 - 30 ` } Por semana</Text>
                          </View>
                        </View>
                        <View style={styles.grid}>
                          <View style={styles.bgIcon}>
                            <Rest />
                          </View>
                          <View>
                            <Text style={styles.titleBox}>Tiempo estimado</Text>
                            <Text style={styles.textBox}>{rutinas.tiempo_estimado_diario}</Text>
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

     
          </View>



            <View style={{ width: '95%', marginTop: 20, }}>

              <View style={styles.contentHeaderTop}>
                <View>
                  <Text style={{ fontSize: 16, fontWeight: '600' }}>Clases grupales</Text>
                </View>
                <View>
                  <Text onPress={() => navigation.navigate('Rutinas')} style={{ fontSize: 13, fontWeight: '600', color: '#0CBAED', }}>Ver todas <ArrowRight />  </Text>
                </View>
              </View>
              
              {clases1.map((clase, index) => (
            <View key={index} style={styles.boxClasesGrupales}>
              <View style={{ width: '58%' }}>
                <Text style={{ fontSize: 18, fontWeight: '600' }}>{clase.nombre}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 10 }}>
                  <Clock style={{ marginRight: 10 }} />
                  <View>
                    <Text style={{ fontSize: 13, fontWeight: '400', color: '#737C98' }}>Hora de inicio</Text>
                    <Text style={{ fontSize: 15, fontWeight: '600', marginBottom: 0 }}>{convertToAMPM(clase.fecha_hora_inicio)}</Text>
                  </View>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 2 }}>
                  <Clock style={{ marginRight: 10 }} />
                  <View>
                    <Text style={{ fontSize: 13, fontWeight: '400', color: '#737C98' }}>Hora de finalizado</Text>
                    <Text style={{ color: '#1A1A1Af', fontSize: 15, fontWeight: '600', marginBottom: 0 }}>{convertToAMPM(clase.fecha_hora_finalizado)}</Text>
                  </View>
                </View>
                <BotonMediano style={styles.boxPlanes} onPress={() => navigation.navigate('Clases')}>
                  Ver clase
                </BotonMediano>
              </View>
              <View style={{ width: '39%', marginLeft: 10, flexDirection: 'column', alignItems: 'flex-end'}}>

                <Text style={{ fontSize: 13, fontWeight: '400', color: '#737C98' }}>Instructor</Text>
                <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 5 }}>{clase.entrenadores.nombre}</Text>
                <Image style={{ width: 110, height: 95, borderRadius: 6 }} source={{ uri: clase.entrenadores.foto ? `https://app.bestbodygym.com/${clase.entrenadores.foto}` : imgPredetrminada }} />
                <View style={{ flexDirection: 'column', alignItems: 'center', marginVertical: 10 }}>
                  <Text style={{ fontSize: 13, fontWeight: '400', color: '#737C98' }}>Duración:</Text>
                  <Text style={{ color: '#1A1A1Af', fontSize: 15, fontWeight: '600', marginBottom: 0 }}>{clase.duracion}</Text>
                </View>
              </View>
            </View>
          ))}
         
          </View>

          <View style={{ width: '95%', marginTop: 20, marginBottom: 60, }}>
              <View style={styles.contentHeaderTop}>
                <View>
                  <Text style={{ fontSize: 16, fontWeight: '600' }}>Ejercicios</Text>
                </View>
                <View>
                  <Text onPress={() => navigation.navigate('EjerciciosStack')} style={{ fontSize: 13, fontWeight: '600', color: '#0CBAED', }}>Ver todos <ArrowRight />  </Text>
                </View>
              </View>
              <View style={styles.gridEjercicios}>

                {ejercicio1.map( (ejercicio, index)=>(
                  <TouchableOpacity
                  key={index}
                  style={styles.imageContainer}
                  onPress={() => navigation.navigate('DetalleEjercicio', { ejercicio })}
                > 
                  <ImageBackground 
                    source={{ uri: `https://app.bestbodygym.com/${ejercicio.imagen}` }} 
                    style={styles.imageBackground}
                  >
                    <View style={styles.overlay}>
                      <Text style={styles.overlayText}>{ejercicio.nombre}</Text>
                    </View>
                  </ImageBackground>
                </TouchableOpacity>
                ))}
               
               
              </View>
          </View>

        </View>
        {/* Modal para reserva */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalReservaVisible}
          onRequestClose={closeModalReserva}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>¿Te gustaría reservar tu espacio en {selectedClase?.nombre}?</Text>
              <Text style={{  color: '#1A1A1A',fontSize: 15,textAlign: 'center', marginBottom: 10, }}>Instructor: {selectedClase?.entrenadores.nombre}</Text>
              <Text style={styles.modalText}>Por favor, asegúrate de estar presente al menos 5 minutos antes de la hora programada. Te enviaremos una notificación 10 minutos antes del inicio para recordarte.</Text>

              <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 20 }}>
                <TouchableOpacity style={styles.btnConfirm} onPress={handleConfirm}>
                  <Text style={styles.textBtn}>Confirmar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.btnConfirm} onPress={closeModalReserva}>
                  <Text style={styles.textBtn}>Cancelar</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity style={styles.closeButton} onPress={closeModalReserva}>
                <Text style={styles.closeButtonText}>x</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

      </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
      backgroundColor: '#E8E9EA',
      alignItems: 'center',
      paddingTop: 20,
      paddingBottom: 30,
      flexDirection: 'column',
    },
    contentCalendario: {
      padding: 20,
      borderRadius: 10,
      marginTop: 0,
    },
    content: {
      width: '95%',
    },
    contentHeaderTop: {
      alignItems: 'flex-end',
      flexDirection: 'row',
      width: '100%',
      justifyContent: 'space-between',
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
      borderRadius: 7,
      objectFit: 'cover',
    },
    boxClasesGrupales: {
      flexDirection: 'row',
      width: '100%',
      justifyContent: 'space-between',
      backgroundColor: '#fff',
      padding: 20,
      borderRadius: 8,
      marginTop: 10,
    },
    contentScrollHorizontal: {
      flexDirection: 'row',
      marginTop: 10,
      paddingBottom: 10,
    },
    boxCalendario: {
      paddingHorizontal: 20,
      paddingVertical: 20,
      borderRadius: 5,
      marginRight: 8,
      backgroundColor: '#fff',
    },
    activeBox: {
      backgroundColor: '#1A1A1A', 
    },
    activeText: {
        color: 'white', 
    },
    button: {
      marginTop: 20,
      width: '80%',
      alignItems: 'center', 
      flexDirection: 'row',
      justifyContent: 'center',
      padding: 20,
      backgroundColor: '#1A1A1A',
      borderRadius: 90,
    },
    gridEjercicios: {
      flexDirection: 'row',
      width: '100%',
      flexWrap: 'wrap',
      marginTop: 7,
    },
    imageBackground: {
      height: 110,
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
      justifyContent: 'flex-end',
      paddingBottom: 5,
      alignItems: 'center',
      borderRadius: 6,
      overflow: 'hidden',
    },
    imageContainer: {
      width: '30%',
      margin: 5, 
    },
    overlayText: {
      fontSize: 13,
      color: '#fff',
      fontWeight: '700',
      textAlign: 'center',
    },
    buttonText: {
      alignItems: 'center', 
      color: '#D5FF5F',
      textAlign: 'center',
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
    texto: {
      fontSize: 15,
      textAlign: 'center',
      textAlignVertical: 'center',
      color: '#737C98',
    },

    banner: {
      height: 150,
      justifyContent: 'flex-end',
      alignItems: 'center',
      paddingBottom: 5,
      borderRadius: 8,
      position: 'relative',
      overflow: 'hidden',
    },
    overlayBanner: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      paddingHorizontal: 50,

      alignItems: 'center',
      borderRadius: 6,
      overflow: 'hidden',
    },
    BannerContainer: {
      width: '95%',
      margin: 5, 
    },
    overlayTextBanner: {
      fontSize: 13,
      color: '#fff',
      fontWeight: '700',
      textAlign: 'center',
    },
    //estilos modal
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.5)', // fondo semi-transparente
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        width: '80%', // ocupar el 80% del ancho de la pantalla
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    modalText: {
      color: '#737C98',
        fontSize: 15,
        textAlign: 'center',
        marginBottom: 10,
    },
    modalTextDescripcion:{
        fontSize: 14,
        color: '#737C98',
    },
    closeButton: {
        position: 'absolute',
        right: 10,
        top: 10,
        backgroundColor: '#1A1A1A', 
        width: 30,
        height: 30,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeButtonText: {
        color: '#D5FF5F',
        fontSize: 18,
        marginTop: -5,
        fontWeight: '900',
    },
    btnConfirm:{
      backgroundColor: '#1A1A1A',
      paddingVertical: 15,
      paddingHorizontal: 20, 
      borderRadius: 90,
      marginLeft: 10,
    },
    textBtn: {
      color:'#D5FF5F',
      fontWeight: '700',
    },
    image: {
      width: 110,
      height: 80,
      borderRadius: 10,
    },

    //estilos rutinas
    imageContainerRutina: {
      width: '100%',
      marginBottom: 15,
  },
  listRutinasGrid: {
    width: '100%',
  },

  imageBackgroundRutina:{
    height: 240,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 5,
    borderRadius: 8,
    position: 'relative',
    overflow: 'hidden',
  },
  overlayRutina: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'space-between',
    flexDirection: 'column',
    borderRadius: 6,
    overflow: 'hidden',
    padding: 14,
    alignSelf: 'flex-start',
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
    grid:{
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
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
    bgIcon:{
      backgroundColor: '#D6FD67',
      borderRadius: 90,
      padding: 7,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 7,
      alignContent: 'center',
  },
  });
  