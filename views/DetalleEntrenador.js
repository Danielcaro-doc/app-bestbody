import React from 'react';
import { StyleSheet, View, Text, Image, ScrollView } from 'react-native';
import Boock from '../assets/icons/Boock';
 
const DetalleEntrenador = ({ route }) => {
  const { entrenador } = route.params;
  const defaultPortada = 'https://app.bestbodygym.com/storage/images/portada-predeterminada.webp';
  const defaultFoto = 'https://app.bestbodygym.com/storage/images/perfil-predeterminado.webp';
  return (

    <ScrollView style={{ backgroundColor: '#E8E9EA' }}>
    <View style={styles.container}>
    <Image  
        style={styles.portada}
        source={{ uri: entrenador.portada ? `https://app.bestbodygym.com/${entrenador.portada}` : defaultPortada }}
      />
      <Image 
        style={styles.image}
        source={{ uri: entrenador.foto ? `https://app.bestbodygym.com/${entrenador.foto}` : defaultFoto }}
      />
      <View style={styles.centerTextTitle}>
        <Text style={styles.name}>{entrenador.nombre} {entrenador.apellido}</Text>
      </View>
      <View style={styles.contentStudy}> 
        <Boock />
        <Text style={styles.studyText}>  {entrenador.estudios}</Text>
      </View> 
      <View style={styles.Contentdescription}>
        <Text style={styles.descriptionTitle}>Descripción</Text>
        <Text style={styles.descriptionText}>{entrenador.descripcion}</Text>
      </View>
    </View>
  </ScrollView>

  );
};

export default DetalleEntrenador;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#E8E9EA',
  },
  portada:{
    width: '100%',
    height: 200,
    borderRadius: 10,
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginTop: -70,

  },
  centerTextTitle: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
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
    width: '100%',
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
    borderRadius: 90,
    flexWrap: 'wrap',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  studyText: {
    fontSize: 14,
    marginBottom: 10,
    justifyContent: 'start',
    textAlign: 'left',
  },
});
