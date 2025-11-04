import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Linking, Alert, Modal,ScrollView } from 'react-native';
import axios from 'axios'; 

import { useNavigation } from '@react-navigation/native';
import Boton from '../components/Boton';

export default function Planes() {
    
    const navigation = useNavigation();
    const [planes, setPlanes] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState(null);

 
    // Verificar si WhatsApp está instalado y abrir el enlace
    const openWhatsApp = () => {
        Linking.canOpenURL('whatsapp://send?phone=573202710411').then(supported => {
            if (supported) {
                Linking.openURL('whatsapp://send?phone=573202710411');
            } else {
                // Mostrar alerta si WhatsApp no está instalado
                Alert.alert(
                    "WhatsApp no está instalado",
                    "Por favor, instala WhatsApp para poder utilizar esta función.",
                    [{ text: "Aceptar", onPress: () => console.log("Alerta cerrada") }]
                );
            }
        }).catch(error => console.error("Error al abrir WhatsApp:", error));
    };

    //TRAE TODO LOS DATOS DE LA TABLA PLANES
    useEffect(() => {
        axios.get('https://app.bestbodygym.com/api/plans')
            .then(response => {
                setPlanes(response.data);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }, []);


    const openModal = (plan) => {
        setSelectedPlan(plan);
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
    };


    return (
<ScrollView style={{ backgroundColor: '#E8E9EA' }}>       
    <View style={styles.body}>

            <View style={styles.section}>
                <Text style={styles.titleSection}>Planes</Text>
                <View style={styles.sectionGrid}>
                    {planes.map(plan => (
                        <TouchableOpacity key={plan.id} style={styles.boxPlanes} onPress={() => openModal(plan)}>
                            <View style={styles.boxIcon}>
                                <Image
                                    source={require('../assets/images/musculo.png')}
                                    style={styles.logo}
                                />
                            </View>
                            <View style={{ marginLeft: 10 }}>
                                <Text style={styles.titleBoxPlan}>{plan.nombre}</Text>
                                <Text style={styles.SaldoBoxPlan}>${plan.precio}</Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Modal para mostrar los detalles del plan */}
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={closeModal}
                >
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>{selectedPlan ? selectedPlan.nombre : ''}</Text>
                            <Text style={styles.modalText}>Precio: ${selectedPlan ? selectedPlan.precio : ''}</Text>
                            <Text style={styles.modalTextDescripcion}>{selectedPlan ? selectedPlan.descripcion : ''}</Text>
                            <TouchableOpacity 
                                style={styles.BtnContactoFullWidth}
                                onPress={() => {
                                    const nombrePlan = selectedPlan ? selectedPlan.nombre : '';
                                    const mensaje = `¡Hola! Estoy interesado en el plan "${nombrePlan}". ¿Podrías proporcionarme más información, por favor?`;
                                    const urlWhatsApp = `whatsapp://send?phone=573202710411&text=${encodeURIComponent(mensaje)}`;
                                    Linking.openURL(urlWhatsApp);
                                }} 
                            >            
                                <Image
                                    source={require('../assets/images/whatsapp.png')}
                                    style={styles.iconContact}
                                />
                                <Text style={styles.textBoxBtnContacto}>Preguntar por este plan</Text>
                            </TouchableOpacity>

                            {/* Agrega más detalles del plan aquí */}
                            <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                                <Text style={styles.closeButtonText}>x</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
        </View>

            <View style={(styles.sectionContacto)}>
                <Text style={(styles.titleSection)}>Contacto</Text>
                <View style={(styles.sectionGrid)} >
                        
                    <View style={(styles.boxContacto)}>            
                            <Text style={(styles.titleBoxContacto)}>Sábados:</Text>
                            <Text style={(styles.textBoxContacto)}>6:00 AM - 12:00 PM</Text>
                    </View>
                    <View style={(styles.boxContacto)}>            
                            <Text style={(styles.titleBoxContacto)}>Lunes a viernes:</Text>
                            <Text style={(styles.textBoxContacto)}>6:00 AM - 10:00 PM</Text>
                    </View>

                    <TouchableOpacity 
                        style={styles.boxBtnContacto}
                        onPress={openWhatsApp}
                    >            
                        <Image
                            source={require('../assets/images/whatsapp.png')}
                            style={styles.iconContact}
                        />
                        <Text style={styles.textBoxBtnContacto}>320 271 0411</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={styles.boxBtnContacto}
                        onPress={() => {
                            Linking.openURL('tel:3202710411');
                        }}
                    >            
                        <Image
                            source={require('../assets/images/telefono.png')}
                            style={styles.iconContact}
                        />
                        <Text style={styles.textBoxBtnContacto}>320 271 0411</Text>
                    </TouchableOpacity>




                </View>
            </View> 

            <Boton
            onPress={() => navigation.navigate('Login')}
            iconSource={require('../assets/images/flecha-derecho.png')}
            >
            INGRESAR
            </Boton>


    </View>
    </ScrollView>
    );
}

const styles = StyleSheet.create({
    body: {
        flex: 1,
        backgroundColor: '#E8E9EA',
        padding: 20,
    },
    sectionHeader:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '90%',
        alignItems: 'center',
        marginTop: 20,
    },
    iconBtn:{
        marginLeft: 110,
    },
    section: {
        marginTop: 20,
        width: '100%',
    },
    sectionContacto: {
        width: '100%',
        flex: 1,
        marginTop: 20,
    },
    sectionGrid:{
        flexDirection: 'row',
        flexWrap: 'wrap',
        width: '100%',
    },
    titleSection:{
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 5,
    },
    titlePage:{
        color:  '#07A0C7',
        fontWeight: 'bold',
        fontSize: 18,
    },
    boxContacto: {
        backgroundColor: 'white',
        padding: 15,
        margin: 5,
        borderRadius: 10,
    },
    titleBoxContacto: {
        color: '#737C98',
        fontSize: 12,
        fontWeight: '500',
    },
    textBoxContacto: {
        color: '#1A1A1A',
        fontSize: 15,
        fontWeight: '600',
    },
    boxBtnContacto: {
        backgroundColor: '#D5FF5F',
        flexDirection: 'row',
        padding: 20,
        borderRadius: 90,
        margin: 5,
        width: '47%',
        justifyContent:'center',
    },
    BtnContactoFullWidth: {
        backgroundColor: '#D5FF5F',
        flexDirection: 'row',
        padding: 20,
        borderRadius: 90,
        margin: 5,
        width: '100%',
        marginTop: 20,
        justifyContent:'center',
    },
    iconContact: {
        marginRight: 5,
    },
    
    textBoxBtnContacto:{
        fontSize: 15,
        fontWeight: '600',
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
    boxPlanes:{
        backgroundColor: 'white',
        padding: 20,
        flexDirection: 'row',
        width: '47%',
        borderRadius: 10,
        margin: 5,
    },
    titleBoxPlan:{
        color: '#737C98',
        fontWeight: 'bold',
        fontSize: 10,
    },
    SaldoBoxPlan:{
        color: '#1A1A1A',
        fontWeight: 'bold',
        fontSize: 15,
    },
    contentButton:{
      width: '80%',
      padding: 0,
      marginTop: -60,
    },
    button: {
        marginTop: 20,
        width: '100%',
        alignItems: 'center', 
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#1A1A1A',
        borderRadius: 90, 

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

    //Estilos para el modal
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)', // fondo semi-transparente
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        width: '80%', // ocupar el 80% del ancho de la pantalla
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    modalText: {
        fontSize: 18,
        marginBottom: 20,
    },
    modalTextDescripcion:{
        fontSize: 14,
        color: '#737C98',
    },
    closeButton: {
        position: 'absolute',
        right: 10,
        top: 10,
        backgroundColor: '#1A1A1A', 
        width: 30,
        height: 30,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeButtonText: {
        color: '#D5FF5F',
        fontSize: 18,
        marginTop: -5,
        fontWeight: '900',
    },

});
