import React, { useEffect, useState } from 'react';
import RNPickerSelect from 'react-native-picker-select';
import { StyleSheet, TouchableOpacity, Text, View, Image, ScrollView, ImageBackground, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axiosInstance from '../api/axiosConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Ejercicios() {
  const navigation = useNavigation();

  const [ejercicios, setEjercicios] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [maquinas, setMaquinas] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
  const [maquinaSeleccionada, setMaquinaSeleccionada] = useState(null);

  useEffect(() => {
    const fetchEjerciciosData = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        if (token) {
          const ejerciciosResponse = await axiosInstance.get('/ejercicios');
          setEjercicios(ejerciciosResponse.data);
        } else {
          Alert.alert('No se encontró un token de sesión.');
          navigation.navigate('Login');
        }
      } catch (error) {
        console.error('Error al obtener los ejercicios', error);
      }
    };

    const fetchGruposEjerciciosData = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        if (token) {
          const gruposEjerciciosResponse = await axiosInstance.get('/grupos_ejercicios');
          setCategorias(gruposEjerciciosResponse.data);
        } else {
          Alert.alert('No se encontró un token de sesión.');
          navigation.navigate('Login');
        }
      } catch (error) {
        console.error('Error al obtener los grupos de ejercicios', error);
      }
    };

    fetchEjerciciosData();
    fetchGruposEjerciciosData();
  }, []);

  useEffect(() => {
    const fetchMaquinasEjerciciosData = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        if (token) {
          const maquinasResponse = await axiosInstance.get('/categoriasEquipos');
          setMaquinas(maquinasResponse.data);
        } else {
          Alert.alert('No se encontró un token de sesión.');
          navigation.navigate('Login');
        }
      } catch (error) {
        console.error('Error al obtener las máquinas de ejercicios', error);
      }
    };

    fetchMaquinasEjerciciosData();
  }, []);

  const ejerciciosFiltrados = categoriaSeleccionada || maquinaSeleccionada
    ? ejercicios.filter(ejercicio =>
        (categoriaSeleccionada ? ejercicio.grupos_ejercicios_id === categoriaSeleccionada.id : true) &&
        (maquinaSeleccionada ? ejercicio.maquinas_ejercicios_id === maquinaSeleccionada : true)
      )
    : ejercicios;

  const limpiarFiltros = () => {
    setCategoriaSeleccionada(null);
    setMaquinaSeleccionada(null);
  };

  return (
    <View style={styles.container}>
      <View style={{ width: '95%', marginTop: 20, paddingBottom: 80 }}>
        {/* MAQUINAS */}
        <View style={styles.contentFilter}>
          {/* BOTON LIMPIAR FILTROS */}
          <TouchableOpacity onPress={limpiarFiltros} style={styles.btnLimpiarFiltros}>
            <Text style={styles.btnLimpiarFiltrosText}>Limpiar Filtros</Text>
          </TouchableOpacity>
          <View style={styles.selectWrapper}>
            <RNPickerSelect
              onValueChange={(value) => setMaquinaSeleccionada(value)}
              items={maquinas.map((maquina) => ({ label: maquina.nombre, value: maquina.id }))}
              value={maquinaSeleccionada}
              placeholder={{ label: 'Seleccione una máquina', value: null }}
              useNativeAndroidPickerStyle={false}
              style={{
                inputIOS: styles.selectInput,
                inputAndroid: styles.selectInput,
                placeholder: styles.selectPlaceholder,
              }}
            />
          </View>
        </View>

        {/* CATEGORIAS */}
        <ScrollView horizontal={true} contentContainerStyle={styles.contentScrollHorizontal}>
          {categorias.map((categoria) => (
            <TouchableOpacity
              key={categoria.id}
              onPress={() => setCategoriaSeleccionada(categoria)}
              style={[styles.btnCategorias, categoriaSeleccionada?.id === categoria.id && styles.btnCategoriasActive]}
            >
              <Text style={styles.btnCategoriasText}>{categoria.nombre}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <ScrollView>
          <View style={styles.grid}>
            {ejerciciosFiltrados.map((ejercicio, index) => (
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
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
      backgroundColor: '#E8E9EA', 
      alignItems: 'center',
      height: '100%',
      paddingBottom: 150,
    },
    contentScrollHorizontal: {
      flexDirection: 'row',
      marginTop: 10,
      paddingBottom: 20,
      paddingHorizontal: 10,
    },
    btnCategoriasActive: {
      backgroundColor: '#D6FD67', 
      color: '#D6FD67',
    },
    
    gridCategorias:{
      flexDirection: 'row',
      width: '100%',
      marginBottom: 5,
    },
    grid: {
      flexWrap: 'wrap',
      flexDirection: 'row',
      width: '100%',
    },
    btnCategorias: {
      backgroundColor: '#fff',
      padding: 10,
      paddingHorizontal: 15,
      borderRadius: 90,
      color: '#737C98',
      fontWeight: 'bold',
      marginRight: 5,
      height: 40,
    },
    grid: {
      flexDirection: 'row',
      width: '100%',
      flexWrap: 'wrap',
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
    selectWrapper: {
      backgroundColor: '#fff',
      borderRadius: 90,
      width: '65%',
      height: 40,
      paddingHorizontal: 12,
      justifyContent: 'center',
    },
    selectInput: {
      fontSize: 15,
      color: '#737C98',
    },
    selectPlaceholder: {
      color: '#737C98',
    },
    contentFilter: {
      width: '100%',
      alignItems: 'center', 
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    btnLimpiarFiltros: {
      backgroundColor: '#1A1A1A',
      padding: 10,
      paddingHorizontal: 13,
      marginRight: 5,
      borderRadius: 90,
    },
    btnLimpiarFiltrosText:{
      color: '#D5FF5F',
      fontSize: 13,
      fontWeight: 'bold',
    },  
    spacio: {
      marginBottom: 80,
    }
  });
  