import React, { useState, useEffect } from 'react';
import { StyleSheet, TextInput, Button, Alert, Text, View, Image, TouchableOpacity, ScrollView } from 'react-native';
import Svg, { Path } from "react-native-svg";
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Boton from '../components/Boton';
import Logo from "../assets/logo/Logo";
import Mail from '../assets/icons/Mail';
import ArrowRightGreen from '../assets/icons/ArrowRightGreen';
import IconPassword from './IconPassword';
import axios from 'axios';
import { useUser } from '../global/UserContext';
import axiosInstance from '../api/axiosConfig';

export default function Login() {
  const [objetivo, setObjetivo] = useState(null);
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const { userData, setUserData, fetchUserData } = useUser();

  const fetchObjetivos = async () => {
    try {
      const response = await axiosInstance.get('/checkObjective');
      setObjetivo(response.data);
      console.log('ESTADO OBJETIVO: ', objetivo);
    } catch (error) {
      console.error('Error: ', error);
    }
  };

  useEffect(() => {
    const loadRememberedUser = async () => {
      try {
        const savedEmail = await AsyncStorage.getItem('userEmail');
        const savedPassword = await AsyncStorage.getItem('userPassword');
        if (savedEmail && savedPassword) {
          setEmail(savedEmail);
          setPassword(savedPassword);
          setRememberMe(true);
        }
      } catch (error) {
        console.error('Failed to load remembered user:', error);
      }
    };

    loadRememberedUser();
    fetchObjetivos(); // Llamada para obtener el objetivo al montar el componente
  }, []);

  const handleEmailChange = (text) => {
    setEmail(text);
  };

  const handlePasswordChange = (text) => {
    setPassword(text);
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post('https://app.bestbodygym.com/api/login', {
        correo: email,
        password: password,
      });
      const token = response.data.token;
      console.log('Login successful, token:', token);

      // Guardar el token en AsyncStorage
      await AsyncStorage.setItem('authToken', token);

      if (rememberMe) {
        await AsyncStorage.setItem('userEmail', email);
        await AsyncStorage.setItem('userPassword', password);
      } else {
        await AsyncStorage.removeItem('userEmail');
        await AsyncStorage.removeItem('userPassword');
      }

      await fetchUserData();

      if (userData?.entrenador === true) {
        navigation.navigate('Perfil');
      } else if (userData?.entrenador === false) {
          navigation.navigate('Main', { screen: 'Inicio' });
      }
    
      // Verificar y navegar según el estado del objetivo
      if (objetivo?.objetivo === true) {
        navigation.navigate('Objetivos');
      } else if (objetivo?.objetivo === false) {
          navigation.navigate('Main', { screen: 'Inicio' });
      }
      
    } catch (error) {
      console.error('Login failed:', error);
      let errorMessage = 'Correo o contraseña incorrectos';
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.message) {
        errorMessage = error.message; // Mensaje de error de red u otros
      }
      Alert.alert('Error', errorMessage);
    }
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const toggleRememberMe = () => {
    setRememberMe(!rememberMe);
  };
  
  return (
    <View style={styles.container2}>
      <ScrollView style={{ padding: '10%', width: '100%' }}>
        <View style={styles.box1}>
          <Logo style={{ alignSelf: 'center' }} />
          <Text style={styles.titulo}>¡Bienvenidos de nuevo!</Text>
          <Text style={styles.texto}>Por favor, ingresa tus datos para continuar. </Text>
        </View>
        <View style={styles.box2}>
          <View style={styles.inputContainer}>
            <View style={styles.boxIcon}>
              <Mail style={styles.icon} />
            </View>
            <View style={styles.boxdrh}>
              <Text style={styles.label}>Correo electrónico</Text>
              <TextInput
                style={styles.input}
                placeholder=""
                placeholderTextColor="black"
                onChangeText={handleEmailChange}
                value={email}
              />
            </View>
          </View>
          <View style={styles.inputContainer}>
            <View style={styles.boxIcon}>
              <IconPassword style={styles.icon} />
            </View>
            <View style={styles.boxdrh}>
              <Text style={styles.label}>Contraseña</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.input}
                  placeholder=""
                  placeholderTextColor="black"
                  onChangeText={handlePasswordChange}
                  value={password}
                  secureTextEntry={!isPasswordVisible}
                />
                <TouchableOpacity onPress={togglePasswordVisibility}>
                  <Image
                    source={isPasswordVisible ? require('../assets/images/ojo-abierto.png') : require('../assets/images/ojo-cerrado.png')}
                    style={styles.icon}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <View style={styles.rememberMeContainer}>
            <TouchableOpacity onPress={toggleRememberMe} style={styles.checkbox}>
              {rememberMe && <View style={styles.checkboxChecked} />}
            </TouchableOpacity>
            <Text style={styles.rememberMeText}>Recordar contraseña</Text>
          </View>
          <Boton onPress={handleLogin} icon={<ArrowRightGreen />}>
            INGRESAR
          </Boton>
          <Text style={{ marginTop: 15 }} onPress={() => navigation.navigate('Recuperar')}>
            Olvide mi contraseña
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#E8E9EA',
        alignItems: 'center',
        paddingTop: 80,
        paddingBottom: 30,
        paddingHorizontal: '5%',
        flexDirection: 'column',
        justifyContent: 'space-between',
        width: '100%',
        height: '100%',
    },
    boxIcon:{
      backgroundColor: '#1A1A1A',
      padding: '20',
      height: 40,
      width: 40,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 90,
    },
    box1:{
        width: '90%',
    },
    box2:{
        margin: 'auto',
        width: '100%',
      marginTop: 40,
      justifyContent: 'center', 
      alignItems: 'center'
    },
    contentButton:{
      width: '80%',
      padding: 0,
    },
    button: {
        marginTop: 20,
        width: '100%',
        alignItems: 'center', 
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#1A1A1A',
        borderRadius: 90, 
    },
    olvidoContra:{
      color: '#07A0C7',
      textAlign: 'center',
      alignSelf: 'center',
      fontWeight: 'bold',
      marginTop: 10,
      justifyContent: 'center',
    },
    iconButton: {
      marginLeft: 10,
    },
    buttonText: {
        alignItems: 'center', 
        color: '#D5FF5F',
        textAlign: 'center',
        fontWeight: 'bold',
    },
    logo:{
        margin: 'auto',
        alignSelf: 'center',
        width: 100,
    }, 
    icono:{
        marginLeft: 10,
        width: 25,
        height: 25,
        padding: 20,
        background: '#1A1A1A',
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
    TextRecuperar: {
      color: '#07A0C7',
      marginTop: 15,
      fontSize: 15,
      fontWeight: '600',
      marginTop: 20,    
    },
    boxdrh:{
      width: '70%',
    },
    inputContainer: {
      marginBottom: 20,
      padding: 20,
      paddingBottom: 15,
      flexDirection: 'row',
      backgroundColor: '#fff',
      borderRadius: 10,
      width: '100%',
  },
  label: {
      marginTop: -5,
      fontSize: 14,
      color: '#737C98',
      fontWeight: '700',
      paddingHorizontal: 20,
  },
  input: {
      height: 30,
      fontWeight: 'bold',
      paddingHorizontal: 0,
      marginLeft: 20,
      color: '#1A1A1A',
      fontSize: 16,
      borderBottomColor: '#D2D2D2',
      borderBottomWidth: 1,
      width: '100%',
  },


  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'space-between',
  },

  rememberMeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  checkboxChecked: {
    width: 10,
    height: 10,
    backgroundColor: '#000',
  },
  rememberMeText: {
    // estilos para rememberMeText
  },
  TextRecuperar: {
    // estilos para TextRecuperar
  }
});
