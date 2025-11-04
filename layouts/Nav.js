import React from 'react';
import { View, TouchableOpacity } from 'react-native';

const Nav = ({ navigation }) => {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-around', padding: 10 }}>
      <TouchableOpacity onPress={() => navigation.navigate('Inicio')}>
        {/* Icono para la pantalla de inicio */}
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Explorar')}>
        {/* Icono para la pantalla de explorar */}
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Favoritos')}>
        {/* Icono para la pantalla de favoritos */}
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Perfil')}>
        {/* Icono para la pantalla de perfil */}
      </TouchableOpacity>
    </View>
  );
}

export default Nav;
