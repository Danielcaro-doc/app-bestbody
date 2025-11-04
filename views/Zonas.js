import React, { useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, ImageBackground, Text, View, Image, ScrollView, Modal, Alert, RefreshControl, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import BotonMediano from "../components/BotonMediano";
import CirclePlay from "../assets/icons/CirclePlay";
import { WebView } from 'react-native-webview';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Cancel from '../assets/icons/Cancel';
import Check from '../assets/icons/Check';
import Busy from '../assets/icons/Busy';
import Available from '../assets/icons/Available';
import Spinner from 'react-native-loading-spinner-overlay';
import axiosInstance from '../api/axiosConfig'; // Importar la instancia de axios configurada
import VideoPlayer from '../components/VideoPlayer';


export default function Zonas() {
  const navigation = useNavigation();
  const [zonas, setZonas] = useState([]);
  const [modalReservaVisible, setModalReservaVisible] = useState(false);
  const [modalVideoVisible, setModalVideoVisible] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [countReservas, setCountReservas] = useState(0);
  const [selectedZona, setSelectedZona] = useState(null);
  const [estadoReservable, setEstadoReservable] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notificacion, setNotificacion] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');


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
  
  const fetchZonas = async () => {
    try {
      const response = await axiosInstance.get('/zonas');
      setZonas(response.data);
    } catch (error) {
      console.error('Error: ', error);
    }
  };

  const fetchCountReservas = async () => {
    try {
      const response = await axiosInstance.get('/countReservas');
      setCountReservas(response.data.count);
    } catch (error) {
      console.error('Error: ', error);
    }
  };

  const fetchEstadoReservable = async () => {
    setLoading(true);
    try {
        const response = await axiosInstance.get('/estadoReservable');
        setEstadoReservable(response.data);
    } catch (error) {
        console.error('Error', error);
    } finally {
        setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([fetchZonas(), fetchCountReservas(), fetchEstadoReservable()]);
    setRefreshing(false);
  };

  useEffect(() => {
    fetchEstadoReservable();
  }, []);
  
  useEffect(() => {
    fetchZonas();
    fetchCountReservas();
  }, []);

  const handleConfirm = async () => {
    setLoading(true);
    setNotificacion('Procesando la reserva...');
    try {
      const response = await axiosInstance.post('/reservaZona', {
        id: selectedZona.id,
        confirmado: 1
      });

      console.log('Correos:', response.data.correo);
      console.log('Correos enviados:', response.data.correosEnviados);
      if (response.data.success) {
        console.log('Reserva confirmada:', response.data);
        Alert.alert('Reserva Confirmada', response.data.mensaje, [{ text: 'Ok', onPress: closeModalReserva }]);
        fetchCountReservas(); 
        fetchEstadoReservable();
        fetchZonas();
      } else {
        console.log('Error al confirmar la reserva:', response.data.mensaje);
        Alert.alert('Error', response.data.mensaje, [{ text: 'Ok', onPress: closeModalReserva }]);
      }
    } catch (error) {
      console.error('Error al confirmar la reserva:', error);
    } finally {
      setLoading(false);
      setNotificacion('');
    }
  };

  const handleCancel = async (zona) => {
    Alert.alert(
      'Confirmar Cancelación',
      '¿Estás seguro de que quieres cancelar esta reserva?',
      [
        {
          text: 'Cancelar',
          onPress: () => console.log('Cancelación no confirmada'),
          style: 'cancel',
        },
        { text: 'Confirmar', onPress: () => confirmCancel(zona) },
      ],
      { cancelable: true }
    );
  };
  
  const confirmCancel = async (zona) => {
    try {
      const response = await axiosInstance.post('/cancelReservaZonas', {
        id: zona.id,
        confirmado: 1
      });
  
      if (response.data.success) {
        console.log('Reserva cancelada:', response.data);
        Alert.alert('Reserva Cancelada', response.data.mensaje, [{ text: 'Ok' }]);
        fetchCountReservas(); 
        fetchEstadoReservable();
        fetchZonas();
      } else {
        console.log('Error al cancelar la reserva:', response.data.mensaje);
        Alert.alert('Error', response.data.mensaje, [{ text: 'Ok' }]);
      }
    } catch (error) {
      console.error('Error al cancelar la reserva:', error);
    }
  };
  
  const openModalReserva = (zona) => {
    setSelectedZona(zona);
    setModalReservaVisible(true);
  };
  const closeModalReserva = () => {
    setModalReservaVisible(false);
    setSelectedZona(null);
  };
  


  const openModalVideo = (zona) => {
    setVideoUrl(zona.video);
    setModalVideoVisible(true);
  };
  const closeModalVideo = () => {
    setModalVideoVisible(false);
    setSelectedVideo(null);
    setVideoUrl('');
  };
 
  return (
    <ScrollView 
    style={{ backgroundColor: '#E8E9EA' }}
    refreshControl={
      <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
    }
  >
      <View style={styles.container}>
      <Spinner
        visible={loading}
        textContent={notificacion}
        textStyle={styles.spinnerTextStyle}
      />
        <View style={{ width: '95%', marginTop: 20 }}>
          {zonas.map((zona, index) => (
            zona.reservable == 1 && (
              <View key={index} style={styles.boxClasesGrupales}>
                <View style={{ width: '58%' }}>
                  <Text style={{ fontSize: 19, fontWeight: '800', marginBottom: 8 }}>
                    {zona.nombre}
                  </Text>
                  <Text style={{ fontSize: 13, fontWeight: '400', color: '#737C98' }}>
                    {zona.descripcion}
                  </Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                    <Text style={{ fontSize: 11, fontWeight: '500', color: '#737C98' }}>Duración:</Text>
                    <Text style={{ fontSize: 12, fontWeight: '700', color: '#1A1A1A' }}> {zona.duracion} </Text>
                  </View>
                  <View style={{ flexDirection: 'column', alignItems: 'start', marginTop: 5 }}>
                    <Text style={{ fontSize: 11, fontWeight: '500', color: '#737C98' }}>Funcionamiento:</Text>
                    <Text style={{ fontSize: 12, fontWeight: '700', color: '#1A1A1A' }}>{convertToAMPM(zona.fecha_hora_inicio)} hasta {convertToAMPM(zona.fecha_hora_fin)} </Text>
                  </View>
                  <View style={{ marginTop: 15, width: '100%', flexDirection: 'row', alignItems: 'center', alignContent: 'center', justifyContent: 'center' }}>
                    <TouchableOpacity 
                      style={{ width: 45, height: 45, padding: 10, backgroundColor: '#1A1A1A', borderRadius: 90, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginRight: 10 }} 
                      onPress={() => handleCancel(zona)}
                    >
                      <Cancel />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.btnInscripcion} key={zona.id} onPress={() => openModalReserva(zona)}>
                      {loading ? (
                        <Text style={styles.loadingText}>Cargando...</Text>
                      ) : (
                        estadoReservable.estado == 1 && estadoReservable.idZona === zona.id ? (
                          <View style={styles.reservedContainer}>
                            <Text style={styles.reservedText}>Reservado</Text>
                            <Check style={styles.checkIcon} />
                          </View>
                        ) : (
                          <Text style={styles.reserveText}>Reservar</Text>
                        )
                      )}
                    </TouchableOpacity>
                  </View>
                  {zona.estadoOcupado == 1 && (
                    <View style={styles.contentOcupado}>
                      <Busy/>
                    </View>
                  )}
                  {zona.estado_disponible == 0 && (
                    <View style={styles.contentOcupado}>
                      <Available/>
                    </View>
                  )}
                </View>
                <TouchableOpacity onPress={() => openModalVideo(zona)} style={{ width: '38%', height: 205, marginLeft: 10, position: 'relative' }}>
                  <Image 
                    style={{ width: '100%', height: '100%', borderRadius: 6 }} 
                    source={{ uri: `https://app.bestbodygym.com/${zona.imagen}` }} 
                  />
                  <Text style={{ position: 'absolute', top: -10, right: -10, fontSize: 15, fontWeight: '700', color: '#000', width: 25, height: 25, alignItems: 'center', textAlign: 'center', backgroundColor: '#0CBAED', borderRadius: 90, justifyContent: 'center', flexDirection: 'row' }}>
                    {zona.reservas_activas_count}
                  </Text>
                  <CirclePlay style={styles.play} />
                </TouchableOpacity>
              </View>
            )
          ))}

          <View style={styles.grid}>
            {zonas.map((zona, index) => (
              zona.reservable == 0 && (
                <TouchableOpacity
                  key={index}
                  style={styles.imageContainer}
                  onPress={() => openModalVideo(zona)}
                >
                  <ImageBackground 
                    source={{ uri: `https://app.bestbodygym.com/${zona.imagen}` }} 
                    style={styles.imageBackground}
                  >
                    <View style={styles.overlay}>
                      <View>
                      
                      </View>
                      <View style={{ flexDirection: 'column', justifyContent: 'flex-end', height: 80, alignItems: 'end' }}>
                        <CirclePlay style={styles.iconCircle}/>
                      </View>
                      <View style={{ flexDirection: 'column', justifyContent: 'flex-end', height: 40, alignItems: 'end' }}>
                        <Text style={styles.overlayText}>{zona.nombre}</Text>
                      </View>
                    </View>
                  </ImageBackground>
                </TouchableOpacity>
              )
            ))}
          </View>

        </View>
        {/* Modal para reserva zona */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalReservaVisible}
          onRequestClose={closeModalReserva}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>¿Te gustaría reservar tu espacio en el {selectedZona?.nombre}?</Text>
              <Text style={styles.modalText}>Ten encuenta que: {selectedZona?.descripcion}</Text>
              <View style={{ flexDirection: 'row' }}>
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

        {/* Modal para mostrar el video */} 
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVideoVisible}
          onRequestClose={closeModalVideo}
        >
          <View style={styles.modalContainerVideo}> 
            <View style={styles.modalContentVideo}>

            <SafeAreaView style={styles.container}>
            <VideoPlayer videoUrl={videoUrl} />
          </SafeAreaView>

              <TouchableOpacity style={styles.closeButton} onPress={closeModalVideo}>
                <Text style={styles.closeButtonText}>x</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>



      </View>
    </ScrollView>
  );
}


const styles = StyleSheet.create({
  container: {
    backgroundColor: '#E8E9EA',
    alignItems: 'center',
    height: '100%',
    paddingBottom: 100,
  },
  videoPlayer: {
    width: '100%',
    height: 300,
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
  btnActive:{
    height: 45,
    alignItems: 'center',
  },
  grid: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    width: '100%',
  },
  play: {
    position: 'absolute',
    top: '40%',
    left: '40%',
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
    contentHeaderTop: {
      alignItems: 'flex-end',
      flexDirection: 'row',
      width: '100%',
      justifyContent: 'space-between',
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
      marginTop: 10,
      marginBottom: 10,
    },
    //overlai bg
    grid: {
      flexDirection: 'row',
      width: '100%',
      flexWrap: 'wrap',
      marginTop: 10,
    },
    imageBackground: {
      height: 150,
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
      justifyContent: 'space-evenly',
      paddingBottom: 5,
      alignItems: 'center',
      borderRadius: 6,
      overflow: 'hidden',
    },
    imageContainer: {
      width: '47%',
      margin: 5, 
    },
    overlayText: {
      fontSize: 13,
      color: '#fff',
      fontWeight: '700',
      textAlign: 'center',
    },
    iconCircle: {
      fontSize: 13,
      color: '#fff',
      fontWeight: '700',
      textAlign: 'center',
    },

    //estilos modal
    modalContainerVideo: {
      flex: 1,
      height: 200,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContentVideo:{
      backgroundColor: 'white',
      padding: 20,
      borderRadius: 10,
      width: '80%', 
      justifyContent: 'center',
      alignItems: 'center',
      height: 200,

    },
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
      width: '80%', 
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
      marginBottom: 20,
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

  //btn REservas: 
      btnInscripcion: {
        backgroundColor: '#1A1A1A',
        padding: 14,
        width: '70%',
        borderRadius: 90,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        
    },
    loadingText: {
        color: '#D5FF5F',
        textAlign: 'center',
        fontWeight: 'bold',
    },
    reservedContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
    },
    reservedText: {
        marginRight: 5,
        color: '#D5FF5F',
        textAlign: 'center',
        fontWeight: 'bold',
    },
    checkIcon: {
        marginTop: 0,
        width: 10,
        height: 10,
        padding: 0,
    },
    reserveText: {
        color: '#D5FF5F',
        textAlign: 'center',
        fontWeight: 'bold',
    },
    //spiner
    spinnerTextStyle: {
      color: '#FFF',
    },
    //ocupado
    contentOcupado: {
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(255, 255, 255, 0.8)', 
      position: 'absolute',
      top:0,
      left: 0,
      right: 0,
      bottom: 0,
      justifyContent: 'center',
      alignItems: 'center',
    },
    textOcupado: {
      color: '#1A1A1A',
      backgroundColor: '#D5FF5F',
      padding: 20,
      borderRadius: 7,
      borderWidth: 2, 
      borderColor: '#1A1A1A', 
    },
  });
  