import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import Swiper from 'react-native-swiper';
import Gif from 'react-native-gif';
import Repetitions from '../assets/icons/Repetitions';
import Sets from '../assets/icons/Sets';
import Machine from '../assets/icons/Machine';
import Rest from '../assets/icons/Rest';
import HTMLView from 'react-native-htmlview';
import * as FileSystem from 'expo-file-system';
import { Ionicons } from '@expo/vector-icons';

const DetalleEjercicio = ({ route }) => {
  const { ejercicio } = route.params;
  const defaultPortada = 'https://app.bestbodygym.com/portada-predeterminada.jpg';
  const defaultFoto = 'https://app.bestbodygym.com/perfil-predeterminado.jpg';
  const links = JSON.parse(ejercicio.gif); // Asume que esto es un array de enlaces de gifs

  const [loading, setLoading] = useState(Array(links.length).fill(true));
  const [downloaded, setDownloaded] = useState(Array(links.length).fill(false));

  useEffect(() => {
    checkDownloadedGifs();
  }, []);

  const handleLoad = (index) => {
    const newLoading = [...loading];
    newLoading[index] = false;
    setLoading(newLoading);
  };

  const checkDownloadedGifs = async () => {
    const newDownloaded = await Promise.all(
      links.map(async (link) => {
        const fileUri = FileSystem.documentDirectory + link.split('/').pop();
        const fileInfo = await FileSystem.getInfoAsync(fileUri);
        return fileInfo.exists;
      })
    );
    setDownloaded(newDownloaded);
  };

  const downloadGif = async (url, index) => {
    const fileUri = FileSystem.documentDirectory + url.split('/').pop();
    await FileSystem.downloadAsync(url, fileUri);
    const newDownloaded = [...downloaded];
    newDownloaded[index] = true;
    setDownloaded(newDownloaded);
  };

  if (!ejercicio) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Error al cargar el ejercicio.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={{ backgroundColor: '#E8E9EA' }}>
      <View style={styles.container}>
        <Swiper
          style={styles.wrapper}
          showsButtons={true}
          loop={false}
          autoplay={false}
          nextButton={<Text style={styles.buttonText}>›</Text>}
          prevButton={<Text style={styles.buttonText}>‹</Text>}
          dot={<View style={styles.dot} />}
          activeDot={<View style={styles.activeDot} />}
        >
          {links.map((link, index) => (
            <View key={index} style={styles.slide}>
              <Gif
                style={styles.portada}
                source={{ uri: `https://app.bestbodygym.com/${link}` }}
                onLoad={() => handleLoad(index)}
              />
              <TouchableOpacity
                style={styles.downloadButton}
                onPress={() => downloadGif(`https://app.bestbodygym.com/${link}`, index)}
              >
                <Text style={styles.downloadButtonText}>Descargar GIF</Text>
              </TouchableOpacity>
            </View>
          ))}
        </Swiper>
        <View style={styles.centerTextTitle}>
          <Text style={styles.name}>{ejercicio.nombre}</Text>
        </View>
        <View style={styles.gridElement}>
          <View style={styles.contentStudy}>
            <View style={styles.bgIcon}>
              <Sets />
            </View>
            <Text style={styles.studyText}> Sets: {ejercicio.sets}</Text>
          </View>
          <View style={styles.contentStudy}>
            <View style={styles.bgIcon}>
              <Repetitions />
            </View>
            <Text style={styles.studyText}> Repeticiones: {ejercicio.repeticiones}</Text>
          </View>
          <View style={styles.contentStudy}>
            <View style={styles.bgIcon}>
              <Rest />
            </View>
            <Text style={styles.studyText}> Descanso: {ejercicio.descansos}s</Text>
          </View>
          <View style={styles.contentStudy}>
            <View style={styles.bgIcon}>
              <Machine />
            </View>
            <Text style={styles.studyText}> {ejercicio.maquinaejercicio.nombre}</Text>
          </View>
        </View>
        <View style={styles.sectionInfo}>
          <Text style={styles.tituleSeciton}>Antes de empezar</Text>
          <HTMLView value={ejercicio.preparacion} stylesheet={htmlStyles} />
        </View>
        <View style={styles.sectionInfo}>
          <Text style={styles.tituleSeciton}>Pasos a seguir</Text>
          <HTMLView value={ejercicio.ejecucion} stylesheet={htmlStyles} />
        </View>
        <View style={styles.sectionInfo}>
          <Text style={styles.tituleSeciton}>Recomendaciones</Text>
          <HTMLView value={ejercicio.consejos_clave} stylesheet={htmlStyles} />
        </View>
        <View style={{ marginBottom: 80 }}></View>
      </View>
    </ScrollView>
  );
};


export default DetalleEjercicio;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 5,
    backgroundColor: '#E8E9EA',
  },

  wrapper: {
    height: 250,
  },
  slide: {
height: 250,
width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    backgroundColor: 'rgba(0,0,0,.2)', // Color de los dots inactivos
    width: 10,
    height: 10,
    borderRadius: 5,
    margin: 3,
  },
  activeDot: {
    backgroundColor: '#1A1A1A', // Color de los dots activos
    width: 10,
    height: 10,
    borderRadius: 5,
    margin: 3,
  },
  buttonText: {
    color: '#D6FD67', // Cambia esto al color que prefieras
    fontSize: 50,
    backgroundColor: '#1A1A1A',
    borderRadius: 90,
    width: 35,
    height: 35,
    fontSize: 22,
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    fontWeight: 'bold',
  },

  bgIcon:{
    backgroundColor: '#D6FD67',
    borderRadius: 90,
    padding: 7,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 2,
    alignContent: 'center',
  },  
  portada:{
    width: '100%',
    height: 200,
    borderRadius: 10,
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center',
    margin: 'auto',
    backgroundColor: '#fff',
  },
  centerTextTitle: {
    alignItems: 'center',
    marginTop: 10,
    justifyContent: 'center',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  gridElement: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    width: '100%',
  },
  Contentdescription: {
    padding: 20,
    marginBottom: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    width: '100%',
  },
  descriptionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 5,
  },
  descriptionText: {
    fontSize: 14,
    color: '#737C98',
  },
  contact: {
    fontSize: 16,
    marginBottom: 10,
  },
  contentStudy:{
    width: '48%',
    marginRight: 7,
    paddingVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    borderRadius: 90,
    flexWrap: 'wrap',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  studyText: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 10,
    justifyContent: 'start',
    textAlign: 'left',
  },

  tituleSeciton: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 6,
    justifyContent: 'start',
    textAlign: 'start',
  },
  sectionInfo: {
    marginBottom: 10,
    padding: 13,
    backgroundColor: '#fff',
    width: '100%',
    borderRadius: 10,
  },
  sectionText: {
    fontSize: 13,
    color: '#737C98',
  },
  loading: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -50 }, { translateY: -50 }],
    alignItems: 'center',
  },
  downloadButton: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#1A1A1A',
    borderRadius: 90,
    flexDirection: 'row',
    alignItems: 'center',
  },
  downloadButtonText: {
    color: '#D5FF5F',
    fontSize: 14,
    marginLeft: 5,
  },
  
});


const htmlStyles = StyleSheet.create({
  p: {
    marginVertical: 0,
    paddingVertical: 0,
    fontSize: 14,
    lineHeight: 20,
    color: '#737C98',
    height: 'auto',
    marginVertical: 0,
  },
  br: {
    height: 0,
    lineHeight: 0,
    margin: 0,
    padding: 0,
  },
  div: {
    marginVertical: 0,
    paddingVertical: 0,
  },
  span: {
    marginVertical: 0,
    paddingVertical: 0,
  },
  li: {
    marginVertical: 0,
    paddingVertical: 0,
  },
  ul: {
    marginVertical: 0,
    paddingVertical: 0,
  },
  ol: {
    marginVertical: 0,
    paddingVertical: 0,
  },
  
});