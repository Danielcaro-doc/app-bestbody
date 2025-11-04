// PlanExpired.js
import React from 'react';
import { View, Text, StyleSheet, Button, TouchableOpacity } from 'react-native';

const PlanExpired = ({ navigation }) => {
    return (
        <View style={styles.container}> 
            <Text style={styles.title}>Suscripción Vencida</Text>
            <Text style={styles.message}>Tu suscripción ha vencido. Por favor, renueva tu suscripción para continuar utilizando nuestros servicios.</Text>

            <TouchableOpacity style={styles.btnInscripcion} onPress={() => navigation.navigate('Planes')}>
                <Text style={styles.reservedText}>
                Renovar Plan
                </Text>
            </TouchableOpacity>

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    message: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20,
    },
            //btn REservas: 
            btnInscripcion: {
                backgroundColor: '#1A1A1A',
                padding: 14,
                width: '70%',
                borderRadius: 90,
                justifyContent: 'center',
                alignItems: 'center',
                alignSelf: 'center',
                
            },
            loadingText: {
                color: '#D5FF5F',
                textAlign: 'center',
                fontWeight: 'bold',
            },
            reservedContainer: {
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
            },
            reservedText: {
                marginRight: 5,
                color: '#D5FF5F',
                textAlign: 'center',
                fontWeight: 'bold',
            },
            checkIcon: {
                marginTop: 0,
                width: 10,
                height: 10,
                padding: 0,
            },
            reserveText: {
                color: '#D5FF5F',
                textAlign: 'center',
                fontWeight: 'bold',
            },
});

export default PlanExpired;
