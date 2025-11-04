// CheckObjective.js
import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import axiosInstance from '../api/axiosConfig';
import { navigationRef } from '../navigation/RootNavigation';

const CheckObjective = ({ navigation }) => {
    useEffect(() => {
        const checkUserObjective = async () => {
            try {
                const response = await axiosInstance.get('/checkObjective'); // Endpoint que verifica el objetivo del usuario
                const { objetivo } = response.data;

                if (objetivo) {
                    navigation.navigate('Main', { screen: 'Inicio' });
                } else {
                    navigation.navigate('Objetivos');
                }
            } catch (error) {
                console.error('Error al verificar el objetivo del usuario: ', error);
                navigation.navigate('Login'); // En caso de error, redirige al login
            }
        };

        checkUserObjective();
    }, [navigation]);

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" />
        </View>
    );
};

export default CheckObjective;
