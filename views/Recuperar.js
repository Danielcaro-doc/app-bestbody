import React, { useState } from 'react';
import { StyleSheet, TextInput, Alert, Text, View, Image, TouchableOpacity, ActivityIndicator } from 'react-native';

export default function Recuperar() {
    const [textInputValue, setTextInputValue] = useState('');
    const [loading, setLoading] = useState(false);

    const handleInputChange = (text) => {
        setTextInputValue(text);
    };

    const handleButtonPress = async () => {
        setLoading(true);
        try {
            const response = await fetch('https://app.bestbodygym.com/api/recuperarPassword', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ correo: textInputValue }),
            });

            const data = await response.json();

            if (response.ok) {
                Alert.alert('Éxito', data.message);
            } else {
                Alert.alert('Error', data.message);
            }
        } catch (error) {
            Alert.alert('Error', 'Error interno del servidor. Por favor, inténtalo de nuevo más tarde.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.box1}>
                <Image
                    source={require('../assets/images/logo-full.png')}
                    style={styles.logo}
                />
                <Text style={styles.titulo}>¿Tienes problemas para acceder?</Text>
                <Text style={styles.texto}>No te preocupes, estamos aquí para ayudarte. Por favor, introduce tu correo electrónico registrado y te enviaremos instrucciones sobre cómo restablecer tu contraseña.</Text>
            </View>
            <View style={styles.box2}>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <View style={styles.inputContainer}>
                        <View style={styles.boxIcon}>
                            <Image
                                source={require('../assets/images/correo.png')}
                                style={styles.icon}
                            />
                        </View>
                        <View style={styles.boxdrh}>
                            <Text style={styles.label}>Correo electrónico</Text>
                            <TextInput
                                style={styles.input}
                                placeholder=""
                                placeholderTextColor="black"
                                onChangeText={handleInputChange}
                                value={textInputValue}
                                editable={!loading}
                            />
                        </View>
                    </View>
                </View>
                {loading && (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#0000ff" />
                        <Text style={styles.loadingText}>Verificando...</Text>
                    </View>
                )}
                <View style={styles.contentButton}>
                    <TouchableOpacity style={styles.button} onPress={handleButtonPress} disabled={loading}>
                        <Text style={styles.buttonText}>ENVIAR</Text>
                        <Image
                            style={styles.iconButton}
                            source={require('../assets/images/flecha-derecho.png')}
                        />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#E8E9EA',
        alignItems: 'center',
        paddingTop: 120,
        paddingBottom: 30,
        flexDirection: 'column',
        justifyContent: 'flex-center',
    },
    boxIcon:{
      backgroundColor: '#1A1A1A',
      padding: '20',
      height: 40,
      width: 40,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 90,
    },
    box1:{
        flex: 1,
        justifyContent: 'center',
    },
    box2:{
        flex: 1,
        justifyContent: 'center',
        margin: 'auto',
        width: '100%',
        alignItems: 'center',
    },
    contentButton:{
      width: '80%',
      padding: 0,
      marginTop: 0,
    },
    button: {
        marginTop: 0,
        width: '100%',
        alignItems: 'center', 
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#1A1A1A',
        borderRadius: 90, 
    },
    olvidoContra:{
      color: '#07A0C7',
      textAlign: 'center',
      alignSelf: 'center',
      fontWeight: 'bold',
      marginTop: 10,
      justifyContent: 'center',
    },
    iconButton: {
      marginLeft: 10,
    },
    buttonText: {
        alignItems: 'center', 
        color: '#D5FF5F',
        textAlign: 'center',
        fontWeight: 'bold',
    },
    logo:{
        margin: 'auto',
        alignSelf: 'center',
    }, 
    icono:{
        marginLeft: 10,
        width: 25,
        height: 25,
        padding: 20,
        background: '#1A1A1A',
    }, 
    titulo: {
        fontSize: 40,
        textAlign: 'center',
        textAlignVertical: 'center',
        fontWeight: '800',
    },
    texto: {
        fontSize: 15,
        textAlign: 'center',
        textAlignVertical: 'center',
        color: '#737C98',
        padding:10,
    },
    boxdrh:{
      width: '70%',
    },
    inputContainer: {
      marginBottom: 20,
      padding: 20,
      paddingBottom: 15,
      flexDirection: 'row',
      backgroundColor: '#fff',
      borderRadius: 10,
      width: '100%',
  },
  label: {
      marginTop: -5,
      fontSize: 14,
      color: '#737C98',
      fontWeight: '700',
      paddingHorizontal: 20,
  },
  input: {
      height: 30,
      fontWeight: 'bold',
      paddingHorizontal: 0,
      marginLeft: 20,
      color: '#1A1A1A',
      fontSize: 16,
      borderBottomColor: '#D2D2D2',
      borderBottomWidth: 1,
  },
});
