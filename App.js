// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SubscriptionProvider } from './global/SubscriptionContext';
import { UserProvider } from './global/UserContext';
import { navigationRef } from './navigation/RootNavigation';

import Bienvenidos from './views/Bienvenidos';
import Planes from './views/Planes';
import Login from './views/Login';
import Recuperar from './views/Recuperar';
import DetalleEjercicio from './views/DetalleEjercicio';
import DetallesRutinas from './views/DetallesRutinas';
import Objetivos from './views/Objetivos';


import Perfil from './views/Perfil';
import PlanExpired from './views/PlanExpired';
import BottomTabNavigator from './navigation/BottomTabNavigator';
import Header from './layouts/header';

const Stack = createStackNavigator();

function App() {
    return (
        <UserProvider>
            <SubscriptionProvider>
                <NavigationContainer ref={navigationRef}>
                    <Stack.Navigator initialRouteName="Bienvenidos">
                        <Stack.Screen name="Objetivos" component={Objetivos} options={{ headerShown: false }} />
                        <Stack.Screen name="Bienvenidos" component={Bienvenidos} options={{ headerShown: false }} />
                        <Stack.Screen name="Planes" component={Planes} />
                        <Stack.Screen name="Login" component={Login} options={{ title: 'Ingresar' }} />
                        <Stack.Screen name="Recuperar" component={Recuperar} />
                        <Stack.Screen name="DetalleEjercicio" component={DetalleEjercicio} />
                        <Stack.Screen name="DetallesRutinas" component={DetallesRutinas} />
                        <Stack.Screen name="Perfil" component={Perfil} options={{ headerRight: () => <Header title='Perfil' />, }} />
                        <Stack.Screen name="Main" component={BottomTabNavigator} options={{ headerShown: false }} />
                        <Stack.Screen name="PlanExpired" component={PlanExpired}  options={{title: 'Plan finalizado', headerRight: () => <Header title='Perfil' />, }}/>
                    </Stack.Navigator>
                </NavigationContainer>
            </SubscriptionProvider>
        </UserProvider>
    );
}

export default App;
