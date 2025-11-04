import React, { useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, Text, View, ScrollView, Modal, Alert, RefreshControl, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Clock from "../assets/icons/Clock";
import BotonMediano from "../components/BotonMediano";
import Cancel from '../assets/icons/Cancel';
import Check from '../assets/icons/Check';
import InClass from '../assets/icons/InClass';
import Available from '../assets/icons/Available';
import axiosInstance from '../api/axiosConfig'; // Importar la instancia de axios configurada

export default function Clases() {
  const navigation = useNavigation(); 
  const [clases, setClases] = useState([]);
  const [modalReservaVisible, setModalReservaVisible] = useState(false);
  const [selectedClase, setSelectedClase] = useState(null);
  const [estadoReservable, setEstadoReservableClases] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
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

  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([fetchClases(), fetchEstadoReservable()]);
    setRefreshing(false);
  };

  const fetchClases = async () => {
    try {
      const response = await axiosInstance.get('/clases');
      setClases(response.data);
    } catch (error) {
      console.error('Error fetching clases:', error);
    }
  };

  const fetchEstadoReservable = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('/estadoReservableClases');
      setEstadoReservableClases(response.data);
    } catch (error) {
      console.error('Error fetching estado reservable:', error);
    } finally {
      setLoading(false);
    }
  }; 

  useEffect(() => {
    fetchClases();
    fetchEstadoReservable();
  }, []);

  const handleConfirm = async () => {
    if (!selectedClase) return;
    try {
      const response = await axiosInstance.post(
        '/reservaClase',
        { id: selectedClase.id, confirmado: 1 }
      );
      if (response.data.success) {
        Alert.alert('Reserva Confirmada', response.data.mensaje, [{ text: 'Ok', onPress: closeModalReserva }]);
        fetchEstadoReservable();
      } else {
        Alert.alert('Error', response.data.mensaje, [{ text: 'Ok', onPress: closeModalReserva }]);
      }
    } catch (error) {
      console.error('Error confirming reservation:', error);
    }
  };

  const handleCancel = async (clase) => {
    Alert.alert(
      'Confirmar Cancelación',
      '¿Estás seguro de que quieres cancelar esta reserva?',
      [
        { text: 'Cancelar', onPress: () => console.log('Cancelación no confirmada'), style: 'cancel' },
        { text: 'Confirmar', onPress: () => confirmCancel(clase) },
      ],
      { cancelable: true }
    );
  };

  const confirmCancel = async (clase) => {
    try {
      const response = await axiosInstance.post('/cancelReservaClases', {
        id: clase.id, confirmado: 1
      });
      if (response.data.success) {
        Alert.alert('Reserva Cancelada', response.data.mensaje, [{ text: 'Ok' }]);
        fetchEstadoReservable();
      } else {
        Alert.alert('Error', response.data.mensaje, [{ text: 'Ok' }]);
      }
    } catch (error) {
      console.error('Error cancelling reservation:', error);
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
  return (
    <ScrollView 
    style={{ backgroundColor: '#E8E9EA' }}
    refreshControl={
      <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
    }
  >
      <View style={styles.container}>
        <View style={{ width: '95%', marginTop: 20 }}>
          {clases.map((clase, index) => ( 
            <View key={index} style={styles.boxClasesGrupales}>
              <View style={{ width: '58%' }}>
                <Text style={{ fontSize: 18, fontWeight: '600' }}>{clase.nombre}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 10 }}>
                  <Clock style={{ marginRight: 10 }} />
                  <View>
                    <Text style={{ fontSize: 13, fontWeight: '400', color: '#737C98' }}>Hora de inicio</Text>
                    <Text style={{ fontSize: 15, fontWeight: '600', marginBottom: 0 }}> {convertToAMPM(clase.fecha_hora_inicio)}</Text>
                  </View>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 2 }}>
                  <Clock style={{ marginRight: 10 }} />
                  <View>
                    <Text style={{ fontSize: 13, fontWeight: '400', color: '#737C98' }}>Hora de finalizado</Text>
                    <Text style={{ color: '#1A1A1Af', fontSize: 15, fontWeight: '600', marginBottom: 0 }}> {convertToAMPM(clase.fecha_hora_finalizado)}</Text>
                  </View>
                </View>

                <View style={{marginTop: 15,width: '100%', flexDirection: 'row', alignItems: 'center', alignContent: 'center', justifyContent: 'center',}}>
                    <TouchableOpacity 
                      style={{ marginRight: 10, width: 45, height: 45, padding: 10, backgroundColor: '#1A1A1A', borderRadius: 90, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }} 
                      onPress={() => handleCancel(clase)}
                    >
                      <Cancel />
                    </TouchableOpacity> 
                    <TouchableOpacity style={styles.btnInscripcion} key={clase.id} onPress={() => openModalReserva(clase)}>
                        {loading ? (
                            <Text style={styles.loadingText}>
                                Cargando...
                            </Text>
                        ) : (
                            estadoReservable.estado == 1 && estadoReservable.idClass == clase.id ? (
                                <View style={styles.reservedContainer}>
                                    <Text style={styles.reservedText}>
                                        Reservado
                                    </Text>
                                    <Check style={styles.checkIcon} />
                                </View>
                            ) : (
                                <Text style={styles.reserveText}>
                                    Reservar
                                </Text>
                            )
                        )}
                    </TouchableOpacity>
                  </View>
                  {clase.estadoOcupado == 1 && (
          <View style={styles.contentOcupado}>
            <InClass/>
          </View>
        )}
        {clase.estado_disponible == 0 && (
          <View style={styles.contentOcupado}>
            <Available/>
          </View>
        )}
              </View>
              <View style={{ width: '39%', marginLeft: 10,  flexDirection: 'column', alignItems: 'flex-end' }}>
                <Text style={{ fontSize: 13, fontWeight: '400', color: '#737C98' }}>Instructor</Text>
                <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 5 }}>{clase.entrenadores.nombre}</Text>
                <Image style={{ width: 96, height: 95, borderRadius: 6 }} 
                  source={{ uri: clase.entrenadores.foto ? `https://app.bestbodygym.com/${clase.entrenadores.foto}` : imgPredetrminada }} 
                  />
                <View style={{ flexDirection: 'column', alignItems: 'center', marginVertical: 10 }}>
                  <Text style={{ fontSize: 13, fontWeight: '400', color: '#737C98' }}>Duración:</Text>
                  <Text style={{ color: '#1A1A1Af', fontSize: 15, fontWeight: '600', marginBottom: 0 }}>{clase.duracion}</Text>
                </View>
              </View>
            </View>
          ))}
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
    boxClasesGrupales: {
      flexDirection: 'row',
      width: '100%',
      justifyContent: 'space-between',
      backgroundColor: '#fff',
      padding: 20,
      borderRadius: 8,
      marginTop: 10,
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
    btnInscripcion: {
      backgroundColor: '#1A1A1A',
      padding: 14,
      width: '70%',
      borderRadius: 90,
      color: '#D5FF5F',
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
  