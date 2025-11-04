import React, { useState, useEffect } from 'react';
import { View, Text, Button, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axiosInstance from '../api/axiosConfig';
import Logo from '../assets/logo/Logo';
import Boton from '../components/Boton';
import ArrowRightGreen from '../assets/icons/ArrowRightGreen';

const Objetivos = ({ navigation }) => {
    const [selectedObjetivo, setSelectedObjetivo] = useState('');
    const [objetivos, setObjetivos] = useState([]);

    useEffect(() => {
        listObjetivos();
    }, []);

    const listObjetivos = async () => {
        try {
            const response = await axiosInstance.get('/objetivos');
            setObjetivos(response.data);
        } catch (error) {
            console.error('Error: ', error);
        }
    };

    const handleSave = async () => {
        if (selectedObjetivo) {
            try {
                const response = await axiosInstance.post('/saveObjetivo', { objetivo: selectedObjetivo });
                if (response.data.success) {
                    await AsyncStorage.setItem('hasSelectedObjective', 'true');
                    navigation.navigate('Main', { screen: 'Inicio' });
                }
            } catch (error) {
                console.error('Error: ', error);
            }
        } else {
            alert('Por favor selecciona un objetivo.');
        }
    };

    const renderGrid = () => {
        return objetivos.map((item) => (
            <TouchableOpacity
                key={item.id}
                style={[
                    styles.button,
                    selectedObjetivo === item.id && styles.buttonActive
                ]}
                onPress={() => setSelectedObjetivo(item.id)}
            >
                <Text style={[
                    styles.buttonText,
                    selectedObjetivo === item.id && styles.buttonTextActive
                ]}>
                    {item.nombre}
                </Text>
            </TouchableOpacity>
        ));
    };

    return (
        <View style={styles.container}>
            <Logo></Logo>
            <Text style={styles.title}>Hola, Bienvenid@ a BestBodyGym </Text>
            <Text style={styles.subtitle}>Por favor selecciona tu objetivo para comenzar</Text>
            <View style={styles.grid}>
                {renderGrid()}
            </View>
            <Boton icon={<ArrowRightGreen/>}  onPress={handleSave}>
                Guardar y comenzar
            </Boton>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#E8E9EA',
    },
    title: {
        fontSize: 35,
        marginBottom: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        paddingVertical: 12,
    },
    subtitle:{
        fontSize: 18,
        marginBottom: 20,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        marginBottom: 20,
    },
    button: {
        padding: 15,
        backgroundColor: '#fff',
        borderRadius: 5,
        margin: 5,
        minWidth: 100,
        alignItems: 'center',
    },
    buttonActive: {
        backgroundColor: '#1A1A1A',
        color: '#D5FF5F',
    },
    buttonText: {
        color: '#000',
    },
    buttonTextActive: {
        color: '#D5FF5F',
    },
});

export default Objetivos;
