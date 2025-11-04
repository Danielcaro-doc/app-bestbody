import React from 'react';
import { View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';


import Inicio from '../views/Inicio';
import EntrenadoresStack from '../stacks/EntrenadoresStack';
import EjerciciosStack from '../stacks/EjerciciosStack';
import RutinasStack from '../stacks/RutinasStack';
import Rutinas from '../views/Rutinas';
import Zonas from '../views/Zonas';
import Clases from '../views/Clases';
import Header from '../layouts/header';

import Home from '../assets/icons/Home';
import Coach from '../assets/icons/Coach';
import Exercises from '../assets/icons/Exercises';
import Routines from '../assets/icons/Routines';
import Zones from '../assets/icons/Zones';
import Classes from '../assets/icons/Classes';

const Tab = createBottomTabNavigator();

function BottomTabNavigator() {
    return (
        <Tab.Navigator
            screenOptions={{
                tabBarActiveTintColor: '#D6FD67',
                tabBarStyle: {
                    backgroundColor: '#1A1A1A',
                    paddingTop: 5,
                    paddingBottom: 5,
                    height: 75,
                    borderRadius: 0,
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                },
            }}
        >
            <Tab.Screen
                name="Inicio"
                component={Inicio}
                options={{
                    title: 'Inicio',
                    headerTitleAlign: 'center',
                    headerRight: () => <Header title='Inicio' />,
                    tabBarLabel: 'Inicio',
                    tabBarIcon: ({ color, size }) => (
                        <View style={{ width: 50, justifyContent: 'center', alignContent: 'center', flexDirection: 'row', padding: 10, borderRadius: 90, backgroundColor: color === '#D6FD67' ? '#3F3F3F' : 'transparent' }}>
                            <Home name="home" color={color} size={size} />
                        </View>
                    ),
                }}
            />
            <Tab.Screen
                name="EntrenadoresStack"
                component={EntrenadoresStack}
                options={{
                    title: 'Entrenadores',
                    headerTitleAlign: 'center',
                    tabBarLabel: 'Entrenadores',
                    headerShown: false,
                    tabBarIcon: ({ color, size }) => (
                        <View style={{ width: 50, justifyContent: 'center', alignContent: 'center', flexDirection: 'row', padding: 10, borderRadius: 90, backgroundColor: color === '#D6FD67' ? '#3F3F3F' : 'transparent' }}>
                            <Coach name="home" color={color} size={size} />
                        </View>
                    ),
                }}
            />
            <Tab.Screen
                name="EjerciciosStack"
                component={EjerciciosStack}
                options={{
                    title: 'Ejercicios',
                    headerTitleAlign: 'center',
                    headerShown: false,
                    tabBarLabel: 'Ejercicios',
                    tabBarIcon: ({ color, size }) => (
                        <View style={{ width: 50, justifyContent: 'center', alignContent: 'center', flexDirection: 'row', padding: 10, borderRadius: 90, backgroundColor: color === '#D6FD67' ? '#3F3F3F' : 'transparent' }}>
                            <Exercises name="home" color={color} size={size} />
                        </View>
                    ),
                }}
            />
            <Tab.Screen
                name="RutinasStack"
                component={RutinasStack}  // Usa el nuevo Stack Navigator
                options={{
                    title: 'Rutinas',
                    headerTitleAlign: 'center',
                    headerShown: false,
                    tabBarLabel: 'Rutinas',
                    tabBarIcon: ({ color, size }) => (
                        <View style={{ width: 50, justifyContent: 'center', alignContent: 'center', flexDirection: 'row', padding: 10, borderRadius: 90, backgroundColor: color === '#D6FD67' ? '#3F3F3F' : 'transparent' }}>
                            <Routines name="home" color={color} size={size} />
                        </View>
                    ),
                }}
            />
            <Tab.Screen
                name="Zonas"
                component={Zonas}
                options={{
                    title: 'Zonas',
                    headerTitleAlign: 'center',
                    headerRight: () => <Header title='Zonas' />,
                    tabBarLabel: 'Zonas',
                    tabBarIcon: ({ color, size }) => (
                        <View style={{ width: 50, justifyContent: 'center', alignContent: 'center', flexDirection: 'row', padding: 10, borderRadius: 90, backgroundColor: color === '#D6FD67' ? '#3F3F3F' : 'transparent' }}>
                            <Zones name="home" color={color} size={size} />
                        </View>
                    ),
                }}
            />
            <Tab.Screen
                name="Clases"
                component={Clases}
                options={{
                    title: 'Clases',
                    headerTitleAlign: 'center',
                    headerRight: () => <Header title='Clases' />,
                    tabBarLabel: 'Clases',
                    tabBarIcon: ({ color, size }) => (
                        <View style={{ width: 50, justifyContent: 'center', alignContent: 'center', flexDirection: 'row', padding: 10, borderRadius: 90, backgroundColor: color === '#D6FD67' ? '#3F3F3F' : 'transparent' }}>
                            <Classes name="home" color={color} size={size} />
                        </View>
                    ),
                }}
            />
        </Tab.Navigator>
    );
}

export default BottomTabNavigator;
