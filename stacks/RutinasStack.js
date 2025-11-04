// RutinasStack.js
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Rutinas from '../views/Rutinas';
import DetallesRutinas from '../views/DetallesRutinas';
import Header from '../layouts/header';

const Stack = createStackNavigator();

function RutinasStack() {
    return (
        <Stack.Navigator initialRouteName="Rutinas">
            <Stack.Screen 
                name="Rutinas" 
                component={Rutinas} 
                options={{ 
                    title: 'Rutinas',
                    headerTitleAlign: 'start',
                    headerRight: () => <Header title='Rutinas' />,
                }} 
            />
            <Stack.Screen 
                name="DetallesRutinas" 
                component={DetallesRutinas} 
                options={{ 
                    headerTitleAlign: 'start',
                    title: 'Detalle rutina',
                    headerRight: () => <Header title='Detalle' />,
                }} 
            />
        </Stack.Navigator>
    );
}

export default RutinasStack;
