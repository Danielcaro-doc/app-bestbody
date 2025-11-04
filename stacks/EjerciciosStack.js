// EntrenadoresStack.js
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Ejercicios from '../views/Ejercicios';
import DetalleEjercicio from '../views/DetalleEjercicio';
import Header from '../layouts/header';

const Stack = createStackNavigator();

function EjerciciosStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="Ejercicios" 
        component={Ejercicios} 
        options={{ 
          title: 'Ejercicios',
          headerTitleAlign: 'start',
          headerRight: () => <Header title='Ejercicios' />,
        }} 
      />
      <Stack.Screen 
        name="DetalleEjercicio" 
        component={DetalleEjercicio} 
        options={{ 
          headerTitleAlign: 'start',
          title: 'Detalle ejercicio',
          headerRight: () => <Header title='Detalle ' />,
        }} 
      />
    </Stack.Navigator>
  );
}

export default EjerciciosStack;
