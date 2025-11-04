import React from "react";
import { StyleSheet, TouchableOpacity, Text, View, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Boton from '../components/Boton';
import Logo from "../assets/logo/Logo";
import ArrowRightGreen from '../assets/icons/ArrowRightGreen';
import Exercises from "../assets/icons/Exercises";
export default function WelcomeScreen() {
  

  const navigation = useNavigation()

  const handlePress = () => {
      console.log('Button pressed!');
  };

    return(
        <View style={styles.container}>
        <View style={styles.box1}>
            <Logo style={{  alignSelf: 'center', }} />
            <Text style={styles.titulo}>Bienvenidos</Text>
            <Text style={styles.texto}>Inicia sesión para acceder a una experiencia fitness. Juntos, alcanzaremos tus metas de bienestar. </Text>
        </View>
        <View style={styles.box2}>


          <Boton
            onPress={() => navigation.navigate('Planes')}
            icon={<Exercises color={'#D5FF5F'} />}
            > 
            PLANES
            </Boton>
            
          <Boton
            onPress={() => navigation.navigate('Login')}
            icon={<ArrowRightGreen/>}
            >
            INGRESAR
            </Boton>
        </View>
    </View>
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#E8E9EA',
      alignItems: 'center',
      paddingTop: 120,
      paddingBottom: 30,
      flexDirection: 'column',
      justifyContent: 'space-between',
    },
    box1:{
      flex: 1,
      justifyContent: 'flex-start',
      width: '90%',
    },
    box2:{
      flex: 1,
      justifyContent: 'flex-end',
      margin: 'auto',
      width: '90%',
      alignItems: 'center',
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
  });
  