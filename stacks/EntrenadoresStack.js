// EntrenadoresStack.js
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Entrenadores from '../views/Entrenadores';
import DetalleEntrenador from '../views/DetalleEntrenador';
import Header from '../layouts/header';

const Stack = createStackNavigator();

function EntrenadoresStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="Entrenadores" 
        component={Entrenadores} 
        options={{ 
          title: 'Entrenadores',
          headerTitleAlign: 'start',
          headerRight: () => <Header title='Entrenadores' />,
        }} 
      />
      <Stack.Screen 
        name="DetalleEntrenador" 
        component={DetalleEntrenador} 
        options={{ 
          headerTitleAlign: 'start',
          title: 'Detalle entrenador',
          headerRight: () => <Header title='Detalle ' />,
        }} 
      />
    </Stack.Navigator>
  );
}

export default EntrenadoresStack;
