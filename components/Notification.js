import React, { useState } from 'react';
import { Modal, Text, TouchableHighlight, View, Alertm, StyleSheet } from 'react-native';
import BotonMediano from './BotonMediano';

const Notification = ({ children, buttonTitle }) => {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View style={{ marginTop: 22 }}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert('Modal ha sido cerrado.');
        }}>
        <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Notificaciones</Text>
                
                <View style={styles.boxNotification}>
                    <View style={{width: '65%',}}>
                        <Text>¡Sauna Disponible!</Text>
                        <Text>¡El sauna ya está listo para tu disfrute!</Text>
                    </View>
                
                    <View style={{width: '65%',}}>
                            <TouchableHighlight style={styles.btnEliminarNoti}>
                                <Text style={{color: '#D5FF5F', fontSize: 14, fontWeight: '700'}}>Limpiar notificaciones</Text>
                        </TouchableHighlight>
                    </View>
                </View>
                
                <TouchableHighlight
                    style={styles.closeButton}
                    onPress={() => {
                    setModalVisible(!modalVisible);
                    }}>
                    <Text style={styles.closeButtonText}>x</Text>
                </TouchableHighlight >
                <TouchableHighlight style={styles.btnEliminarNoti}>
                        <Text style={{color: '#D5FF5F', fontSize: 14, fontWeight: '700'}}>Limpiar notificaciones</Text>
                </TouchableHighlight>
            </View>
        </View>
      </Modal>

      <TouchableHighlight
        style={{ backgroundColor: "#2196F3", borderRadius: 20, padding: 10, elevation: 2 }}
        onPress={() => {
          setModalVisible(true);
        }}>
        <Text style={{ color: "white", fontWeight: "bold", textAlign: "center" }}>{buttonTitle}</Text>
      </TouchableHighlight>
    </View>
  );
};

export default Notification;

const styles = StyleSheet.create({
    boxNotification:{
        backgroundColor: '#E8E9EA',
        padding: 10,
        borderRadius: 7,
        width: '100%',
        flexDirection: 'row',
    },
        //Estilos para el modal
        modalContainer: {
            position: ''
            // flex: 1,
            // justifyContent: 'center',
            // alignItems: 'center',
            // backgroundColor: 'rgba(0,0,0,0.5)',

        },
        btnEliminarNoti:{
            borderRadius: 90,
            padding: 10,
            backgroundColor: '#1A1A1A',
            width: '100%',
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