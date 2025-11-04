import React, { useState, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, Text, View, Image, ScrollView, Alert, RefreshControl, TextInput  } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import PencilEdit from "../assets/icons/PencilEdit";
import Accordion from "../components/Accordion";
import Off from "../assets/icons/Off";
import CalendarIcon from '../assets/icons/CalendarIcon';
import { useUser } from '../global/UserContext'; 


export default function Perfil() {
  const navigation = useNavigation();
  const { userData, setUserData, fetchUserData } = useUser();
  const [openAccordion, setOpenAccordion] = useState(null);
  const defaultFoto = 'https://app.bestbodygym.com/storage/images/perfil-predeterminado.webp';
  const defaultPortada = 'https://app.bestbodygym.com/storage/images/portada-predeterminada.webp';
  const [refreshing, setRefreshing] = useState(false);
  const [planState, setPlanState] = useState([]);

  //PAGOS PLANES
  const [pagos, setPagos] = useState([]);
  const [selectedDatePagos, setSelectedDatePagos] = useState('');
  const [activeIndexPagos, setActiveIndexPagos] = useState(null); 

  //VALORACIONES
  const [valoraciones, setValoraciones] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [activeIndex, setActiveIndex] = useState(null);

  //CAMBIAR CONTRASEÑA
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
 

  const [isCurrentPasswordVisible, setCurrentPasswordVisible] = useState(false);
  const [isNewPasswordVisible, setNewPasswordVisible] = useState(false);
  const [isConfirmNewPasswordVisible, setConfirmNewPasswordVisible] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchUserData();
    setRefreshing(false);
  };


    // Función para manejar la solicitud de cambio de contraseña
    const handleChangePassword = async () => {
      if (newPassword !== confirmNewPassword) {
        Alert.alert('Error', 'Las nuevas contraseñas no coinciden.');
        return;
      }
      setIsLoading(true);
  
      try {
        const token = await AsyncStorage.getItem('authToken');
        if (token) {
          const response = await axios.post('https://app.bestbodygym.com/api/changePassword', {
            current_password: currentPassword,
            new_password: newPassword,
            new_password_confirmation: confirmNewPassword
          }, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
  
          Alert.alert('Éxito', 'Contraseña cambiada exitosamente, por favor ingresa con tu nueva contraseña.');
          navigation.navigate('Login');
        }
      } catch (error) {
        console.log('Error al cambiar la contraseña:', error);
        if (error.response) {
          const { message } = error.response.data;
          if (message === 'La contraseña actual es incorrecta.') {
            Alert.alert('Error', 'La contraseña actual es incorrecta.');
          } else {
            Alert.alert('Error', 'Hubo un problema al cambiar la contraseña.');
          }
        } else {
          Alert.alert('Error', 'Error interno del servidor. Por favor, inténtalo de nuevo más tarde.');
        }
      } finally {
        setIsLoading(false);
      }
    };
    const togglePasswordVisibility = (passwordType) => {
      if (passwordType === 'current') {
        setCurrentPasswordVisible(!isCurrentPasswordVisible);
      } else if (passwordType === 'new') {
        setNewPasswordVisible(!isNewPasswordVisible);
      } else if (passwordType === 'confirmNew') {
        setConfirmNewPasswordVisible(!isConfirmNewPasswordVisible);
      }
    };


  // Datos del plan del usuario:
useEffect(() => {
    const fetchPlanState = async () => {
        try {
            const token = await AsyncStorage.getItem('authToken');
            if (token) {
                const response = await axios.get('https://app.bestbodygym.com/api/inscripcionUser', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setPlanState(response.data); 
            }
        } catch (error) {
            console.log('Error al obtener los datos del plan', error);
        }
    };

    fetchPlanState();
}, []);
const latestPlan = planState.length > 0 ? planState[0] : null;
  // Datos de valoraciones
  useEffect(() => {
    const fetchValoraciones = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        if (token) {
          const response = await axios.get('https://app.bestbodygym.com/api/valoraciones', {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          const valoracionesData = response.data.consulta || [];
          setValoraciones(valoracionesData);
  
          if (valoracionesData.length > 0) {
            // Establecer la primera fecha como seleccionada por defecto
            setSelectedDate(valoracionesData[0].fecha.split(' ')[0]);
            setActiveIndex(0);
          }
        }
      } catch (error) {
        console.log('Error al traer datos de valoraciones:', error);
      }
    };
  
    fetchValoraciones();
  }, []);
  
  const filteredValoraciones = selectedDate ? valoraciones.filter(valoracion => valoracion.fecha.split(' ')[0] === selectedDate) : valoraciones;

  // DATOS PAGOS PLANES
  useEffect(() => {
    const fetchPagos = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        if (token) {
          const response = await axios.get('https://app.bestbodygym.com/api/pagos', {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          const pagosData = response.data.pagos || [];
          setPagos(pagosData);

          if (pagosData.length > 0 && pagosData[0].fecha_final) {
            // Verificar que fecha_final no sea null antes de usar split
            setSelectedDatePagos(pagosData[0].fecha_final.split(' ')[0]);
            setActiveIndexPagos(0);
          }
        }
      } catch (error) {
        console.log('Error al traer datos de los pagos:', error);
      }
    };

    fetchPagos();
  }, []);
  
  const filteredPagos = selectedDatePagos 
  ? pagos.filter(pago => pago.fecha_final && pago.fecha_final.split(' ')[0] === selectedDatePagos)
  : pagos;
  const formatNumber = (value) => {
    return value.toLocaleString('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0,
    });
};

  //PEDIR PERMISOS PARA SUBIR LA IAMAGEN
  const requestPermissionsAndPickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Lo sentimos, necesitamos permisos para acceder a tu galería de fotos.');
        return;
      }

      pickImage();
    } catch (error) {
      console.error('Error al solicitar permisos:', error);
      Alert.alert('Error al solicitar permisos:', error.message);
    }
  };

  //IMPORTAR PORTADA
  const pickPortada = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [16, 9],
        quality: 1,
      });
  
      if (!result.cancelled && result.assets && result.assets.length > 0) {
        const localUri = result.assets[0].uri;
        const filename = localUri.split('/').pop();
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : `image`;
  
        const formData = new FormData();
        formData.append('portada', { uri: localUri, name: filename, type });
  
        const token = await AsyncStorage.getItem('authToken');
  
        try {
          const response = await axios.post('https://app.bestbodygym.com/api/uploadPortada', formData, {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data',
            },
          });
  
          if (response.status === 200) {
            setUserData({ ...userData, portada: response.data.portada });
            fetchUserData(); // Recarga los datos de usuario
          } else {
            Alert.alert('Error al actualizar la portada');
          }
        } catch (error) {
          if (error.response && error.response.data && error.response.data.errors) {
            const errors = error.response.data.errors;
            const errorMessage = Object.values(errors).flat().join('\n');
            Alert.alert('Error al subir la portada:', errorMessage);
          } else {
            console.error('Error al subir la portada:', error);
            Alert.alert('Error al subir la portada:', error.message);
          }
        }
      }
    } catch (error) {
      console.error('Error al seleccionar la imagen:', error);
      Alert.alert('Error al seleccionar la imagen:', error.message);
    }
  };
  

  //IMPORTAR IMAGEN
  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });
  
      if (!result.cancelled && result.assets && result.assets.length > 0) {
        const localUri = result.assets[0].uri;
        const filename = localUri.split('/').pop();
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : `image`;
  
        const formData = new FormData();
        formData.append('foto', { uri: localUri, name: filename, type });
  
        const token = await AsyncStorage.getItem('authToken');
        const endpoint = userData.entrenador 
          ? 'https://app.bestbodygym.com/api/uploadPhotoProfileEntranadores' 
          : 'https://app.bestbodygym.com/api/uploadPhotoProfile';
  
        try {
          const response = await axios.post(endpoint, formData, {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data',
            },
          });
  
          if (response.status === 200) {
            setUserData({ ...userData, foto: response.data.foto });
            fetchUserData(); // Recarga los datos de usuario
          } else {
            Alert.alert('Error al actualizar la foto');
          }
        } catch (error) {
          if (error.response && error.response.data && error.response.data.errors) {
            const errors = error.response.data.errors;
            const errorMessage = Object.values(errors).flat().join('\n');
            Alert.alert('Error al subir la foto:', errorMessage);
          } else {
            console.error('Error al subir la foto:', error);
            Alert.alert('Error al subir la foto:', error.message);
          }
        }
      }
    } catch (error) {
      console.error('Error al seleccionar la imagen:', error);
      Alert.alert('Error al seleccionar la imagen:', error.message);
    }
  };
  
  
  //CERRAR SESION
  const handleLogout = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (token) {
        await axios.get('https://app.bestbodygym.com/api/logout', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        await AsyncStorage.removeItem('authToken');
        Alert.alert('Has cerrado sesión exitosamente');
        navigation.navigate('Login');
      } else {
        Alert.alert('No se encontró un token de sesión.');
      }
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      Alert.alert('Error al cerrar sesión:', error.message);
    }
  };

  //UPLOADS ENTRENADORES 
  //_________________________________________________//___________________________________________//
  const [descripcion, setDescripcion] = useState('');

  useEffect(() => {
    const fetchDescripcion = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        if (token) {
          const response = await axios.get('https://app.bestbodygym.com/api/getDescripcionEntrenador', {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          setDescripcion(response.data.descripcion); 
        }
      } catch (error) {
        console.log('Error al obtener la descripción', error);
      }
    };

    fetchDescripcion();
  }, []);

  const guardarDescripcion = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (token) {
        const response = await axios.post('https://app.bestbodygym.com/api/descripcionEntrenadores', 
        { descripcion },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (response.status === 200) {
          Alert.alert('Descripción guardada exitosamente.');
        } else {
          Alert.alert('Error al guardar la descripción.');
        }
      }
    } catch (error) {
      console.error('Error al guardar la descripción:', error);
      Alert.alert('Error al guardar la descripción:', error.message);
    }
  };


  return (
    <ScrollView
      contentContainerStyle={styles.contentContainer}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
        />
      }
    >
      <View style={styles.innerContainer}>
        <View style={{ width: '90%' }}>
          <View style={styles.fotoPerfil}>

          {userData.entrenador ? (
            <>
            <TouchableOpacity style={styles.contentPortada} onPress={pickPortada}>
            <PencilEdit style={styles.pencilEdit} />
              <Image
                style={styles.portada}
                source={{ uri: userData.portada ? `https://app.bestbodygym.com/${userData.portada}` : defaultPortada }}
              />
            </TouchableOpacity>
            </>
          ) : (
            <> 
            <Text style={{ marginTop: 50, }}></Text>
            </>
          )}
          
            <TouchableOpacity style={{ marginTop: -60,justifyContent: 'center',     textAlign: 'center',justifyContent: 'center',flexDirection: 'column', alignItems: 'center', }} onPress={pickImage}>
              <Image
                style={{ width: 130, height: 130, borderRadius: 90 }}
                source={{ uri: userData.foto ? userData.foto : defaultFoto }}
              />
              <PencilEdit style={{ marginTop: -15 }} />
            </TouchableOpacity>
            <Text style={{ fontSize: 20, marginTop: 10, fontWeight: '800' }}>{userData.nombre}</Text>
            <Text style={{ fontSize: 15, color: '#737C98' }}>{userData.correo}</Text>
          </View>
          {userData.entrenador ? (
              <>
              
              </>
            ) : (
              <> 
        <View style={styles.contentHeaderTop}>
            {latestPlan ? (
                <View style={styles.contentHeaderTop} key={latestPlan.inscripcion.id}>
                      <View>
                        <Text>Tu plan vence</Text>
                        <Text style={{ fontSize: 20, fontWeight: '600' }}>El {latestPlan.fecha_fin}</Text>
                      </View>
                      <View>
                        <Text style={{ fontSize: 17, fontWeight: '600' }}>{latestPlan.tiempo_restante}</Text>
                      </View>
                </View>
            ) : (
                <Text>Cargando datos...</Text>
            )}
        </View>

              </>
            )}
          



      {userData.entrenador ? (
        <>
          <Accordion
            title="Descripción"
            isOpen={openAccordion === 4}
            onPress={() => setOpenAccordion(openAccordion === 4 ? null : 4)}
          >
              <View style={styles.contentDescripcion}>
              <Text style={styles.textDes}> {descripcion ? descripcion : 'Aún no agregas una descripción. '} </Text>
              <TextInput
                style={styles.inputDes}
                onChangeText={setDescripcion}
                placeholder="Escribe tu descripción aquí"
              />
              <TouchableOpacity
                  style={styles.btnInscripcion}
                  onPress={guardarDescripcion}
                  disabled={isLoading}
                >
                  <Text style={styles.reservedText}>Guardar Descripción</Text>
                </TouchableOpacity>
            </View>
          </Accordion>    


        </>
      ) : (
        <>
          <Accordion
              title="Valoraciones"
              isOpen={openAccordion === 1}
              onPress={() => setOpenAccordion(openAccordion === 1 ? null : 1)}
            >
              <ScrollView horizontal={true} contentContainerStyle={styles.contentScrollHorizontal}>
                {valoraciones.map((valoracion, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.btnInscripcion,
                      activeIndex === index && styles.btnActive 
                    ]}
                    onPress={() => {
                      setSelectedDate(valoracion.fecha.split(' ')[0]);
                      setActiveIndex(index); 
                    }}
                  >
                    <Text style={[
                      styles.reservedText,
                      activeIndex === index && styles.textActive 
                    ]}>
                      <CalendarIcon style={{ marginRight: 5 }} />  {valoracion.fecha.split(' ')[0]}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              {filteredValoraciones.length > 0 ? (
                <View>
                  {filteredValoraciones.map((valoracion, index) => (
                    <View key={index} style={styles.contentVal}>
                      <View style={styles.gridTextVal}>
                        <Text style={styles.textTitleVal}>Peso:</Text>
                        <Text style={styles.textVal}>{valoracion.peso}</Text>
                      </View>
                      <View style={styles.gridTextVal}>
                        <Text style={styles.textTitleVal}>Ingesta diarias de calorías:</Text>
                        <Text style={styles.textVal}>{valoracion.ingesta_diarias_calorias}</Text>
                      </View>
                      <View style={styles.gridTextVal}>
                        <Text style={styles.textTitleVal}>Índice de masa corporal:</Text>
                        <Text style={styles.textVal}>{valoracion.indice_masa_coporal}</Text>
                      </View>
                      <View style={styles.gridTextVal}>
                        <Text style={styles.textTitleVal}>Porcentaje de grasa corporal:</Text>
                        <Text style={styles.textVal}>{valoracion.porcentaje_de_grasa_corporal}</Text>
                      </View>
                      <View style={styles.gridTextVal}>
                        <Text style={styles.textTitleVal}>Masa muscular:</Text>
                        <Text style={styles.textVal}>{valoracion.masa_muscular}</Text>
                      </View>
                      <View style={styles.gridTextVal}>
                        <Text style={styles.textTitleVal}>Nivel de grasa visceral:</Text>
                        <Text style={styles.textVal}>{valoracion.nivel_grasa_viceral}</Text>
                      </View>
                      <View style={styles.gridTextVal}>
                        <Text style={styles.textTitleVal}>Recomendaciones:</Text>
                        <Text style={styles.textVal}>{valoracion.recomendaciones}</Text>
                      </View>
                    </View>
                  ))}
                </View>
              ) : (
                <View style={styles.noValoraciones}>
                  <Text style={styles.noValoracionesText}>No tienes valoraciones disponibles.</Text>
                </View>
              )}
          </Accordion>

          <Accordion
            title="Historial de pagos"
            isOpen={openAccordion === 3}
            onPress={() => setOpenAccordion(openAccordion === 3 ? null : 3)}
          >
            <ScrollView horizontal={true} contentContainerStyle={styles.contentScrollHorizontal}>
                  {pagos.map((pago, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.btnInscripcion,
                        activeIndexPagos === index && styles.btnActive 
                      ]}
                      onPress={() => {
                        setSelectedDatePagos(pago.fecha_final.split(' ')[0]);
                        setActiveIndexPagos(index); // Actualizar el índice activo
                      }}
                    >
                      <Text style={[
                        styles.reservedText,
                        activeIndexPagos === index && styles.textActive
                      ]}>
                        <CalendarIcon style={{ marginRight: 5 }} /> {pago.fecha_final.split(' ')[0]}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
                
                {filteredPagos.length > 0 ? (
                  <View>
                    {filteredPagos.map((pago, index) => (
                      <View key={index} style={styles.contentVal}>
                        <View style={styles.gridTextVal}>
                          <Text style={styles.textTitleVal}>Plan:</Text>
                          <Text style={styles.textVal}>{pago.plan.nombre}</Text>
                        </View>
                        <View style={styles.gridTextVal}>
                          <Text style={styles.textTitleVal}>Fecha inicio:</Text>
                          <Text style={styles.textVal}>{pago.fecha_inicio}</Text>
                        </View>
                        <View style={styles.gridTextVal}>
                          <Text style={styles.textTitleVal}>Fecha final:</Text>
                          <Text style={styles.textVal}>{pago.fecha_final}</Text>
                        </View>
                        <View style={styles.gridTextVal}>
                          <Text style={styles.textTitleVal}>Precio:</Text>
                          <Text style={styles.textVal}>{formatNumber(pago.plan.precio)}</Text>
                        </View>
                      </View>
                    ))}
                  </View>
                  ) : (
                    <View style={styles.noValoraciones}>
                      <Text style={styles.noValoracionesText}>Hasta el momento, no existen registros de pagos finalizadas.</Text>
                    </View>
                  )}
          </Accordion>

        </>
      )}
          <Accordion
            title="Cambiar contraseña"
            isOpen={openAccordion === 2}
            onPress={() => setOpenAccordion(openAccordion === 2 ? null : 2)}
          >
          
              <View style={styles.contentPass}>
                <Text style={styles.label}>Contraseña Actual</Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    secureTextEntry={!isCurrentPasswordVisible}
                    value={currentPassword}
                    onChangeText={setCurrentPassword}
                  />
                  <TouchableOpacity onPress={() => togglePasswordVisibility('current')}>
                    <Image
                      source={isCurrentPasswordVisible ? require('../assets/images/ojo-abierto.png') : require('../assets/images/ojo-cerrado.png')}
                      style={styles.icon}
                    />
                  </TouchableOpacity>
                </View>

                <Text style={styles.label}>Nueva Contraseña</Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    secureTextEntry={!isNewPasswordVisible}
                    value={newPassword}
                    onChangeText={setNewPassword}
                  />
                  <TouchableOpacity onPress={() => togglePasswordVisibility('new')}>
                    <Image
                      source={isNewPasswordVisible ? require('../assets/images/ojo-abierto.png') : require('../assets/images/ojo-cerrado.png')}
                      style={styles.icon}
                    />
                  </TouchableOpacity>
                </View>

                <Text style={styles.label}>Confirmar Nueva Contraseña</Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    secureTextEntry={!isConfirmNewPasswordVisible}
                    value={confirmNewPassword}
                    onChangeText={setConfirmNewPassword}
                  />
                  <TouchableOpacity onPress={() => togglePasswordVisibility('confirmNew')}>
                    <Image
                      source={isConfirmNewPasswordVisible ? require('../assets/images/ojo-abierto.png') : require('../assets/images/ojo-cerrado.png')}
                      style={styles.icon}
                    />
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  style={styles.btnInscripcion}
                  onPress={handleChangePassword}
                  disabled={isLoading}
                >
                  <Text style={styles.reservedText}>{isLoading ? 'Cambiando...' : 'Cambiar Contraseña'}</Text>
                </TouchableOpacity>
              </View>
  
          </Accordion>
  
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
          >
            <Text style={styles.logoutText}>Cerrar sesión</Text>
            <Off style={styles.iconOff} />
          </TouchableOpacity>
          <View>
            <Text style={{ color: '#737C98', textAlign: 'center', marginTop: 50 }}>Versión 1.0</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  ScrollView:{
    backgroundColor: '#E8E9EA',
  },
  container: {
    backgroundColor: '#E8E9EA',
    alignItems: 'center',
    height: '100%',
    paddingBottom: 5,
    flexGrow: 1,
    height: '100vh',
  },
  contentContainer: {
    backgroundColor: '#E8E9EA',
    alignItems: 'center',
    paddingBottom: 15,
    width: '100%',
    height: '100vh',
  },
  innerContainer: {
    width: '100%',
    alignItems: 'center',
  },
  contentHeaderTop: { 
    alignItems: 'flex-end',
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  fotoPerfil:{
    textAlign: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
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
    logoutButton: {
      backgroundColor: '#1A1A1A', 
      flexDirection: 'row', 
      alignItems: 'center', 
      justifyContent: 'center',
      marginTop: 10, 
      padding: 20, 
      borderRadius: 90,
    },
    logoutText:{
      color: '#D5FF5F', 
      fontSize: 16, 
      textAlign: 'center',
      marginRight: 10,
    },
      //BOTON: 
      btnInscripcion: {
        backgroundColor: '#1A1A1A',
        padding: 14,
        paddingTop: 14,
        paddingHorizontal: 25,
        borderRadius: 90,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        marginLeft: 5,
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
        color: '#D5FF5F',
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 12,
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
    //GRID BTN VALORACIONES
    gidBtnVal:{
      flexDirection: 'row',
      width: '100%',
    }, 
    
    contentScrollHorizontal: {
      flexDirection: 'row',
      marginTop: 10,
      paddingBottom: 10,
    },
    contentVal:{
      padding: 15,
      backgroundColor: '#fff',
      borderRadius: 10,
      width: '100%',
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    gridTextVal:{
      width: '48%',
      marginBottom: 10,
    },
    textTitleVal:{
      color: '#737C98',
      fontSize: 12,
      fontWeight: 'medium',
      marginBottom: 2,
    },
    textVal:{
      color: '#1A1A1A',
      fontSize: 14,
      fontWeight: 'bold',
      marginBottom: 3,
    },
    btnActive: {
      backgroundColor: '#575757', 
    },
//CAMBIAR CONTRASEÑA
    contentPass:{
      padding: 15,
      borderRadius: 10,
      backgroundColor: '#fff',
      width: '100%',
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      width: '100%',
      justifyContent: 'space-between',
    },
    label: {
      fontSize: 14,
      marginBottom: 8,
    },
    input: {
      flex: 1,
      borderWidth: 1,
      borderColor: '#ccc',
      padding: 10,
      marginBottom: 16,
      borderRadius: 4,
      width: '100%',
      height: 60,
    },
    icon: {
      marginLeft: 10,
      position:  'absolute',
      right: 10,
      bottom: 0,
    },
    noValoraciones: {
      paddingBottom: 10,
      justifyContent: 'center',
      alignItems: 'center',
    },
    noValoracionesText: {
      fontSize: 15,
      color: '#737C98',
      textAlign: 'center',
    },
    //DESCRIPCION
    contentDescripcion: {
      padding: 16,
      backgroundColor: '#fff',
      borderRadius: 10,
    },
    inputDes:{
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 16,
    borderRadius: 4,
    width: '100%',
    height: 60,
    },
    textDes: {
      color: '#000',
      marginBottom: 10,
      textAlign: 'center',
      backgroundColor: '#E9FFAA',
      padding: 10,
      borderRadius: 7,
    },
    //PORTADA ENTRENADORES
    contentPortada:{
      width: '100%',
      position: 'relative',
    },
    portada:{
      width: '100%',
      height: 200,
      borderRadius: 10,
    },
    pencilEdit: {
      position: 'absolute',
      top: 10,
      left: 10,
      width: 20,
      height: 20,
      zIndex: 1,
    },
  });
  