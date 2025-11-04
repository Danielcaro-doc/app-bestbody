import React from 'react';
import { StyleSheet, Text, TouchableOpacity, Image, View } from 'react-native';

function Boton({ onPress, children, icon }) {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <View style={styles.content}>
        <Text style={styles.text}>{children}</Text>
        {icon} 
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    marginTop: 20,
    width: '100%',
    alignItems: 'center',
    backgroundColor: '#1A1A1A',
    borderRadius: 90,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  text: {
    color: '#D5FF5F',
    textAlign: 'center',
    fontWeight: 'bold',
    marginRight: 10,
  },
  iconBtn: {
    marginLeft: 10, // Ajusta el espacio entre el texto y la imagen según sea necesario
  },
});

export default Boton;
