import React, { useState, useEffect, useCallback } from 'react';
import { View, Image, Text, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import Campaign from '../assets/icons/Campaign'; 
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useUser } from '../global/UserContext'; 
import AsyncStorage from '@react-native-async-storage/async-storage';
import CloseIcon from '../assets/icons/CloseIcon';
import CampaignNotification from '../assets/icons/CampaignNotification';
import axios from 'axios';

export default function Header({ title }) {
  const navigation = useNavigation();
  const { userData } = useUser(); 

  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const defaultFoto = 'https://app.bestbodygym.com/storage/images/perfil-predeterminado.webp';

  const fetchNotifications = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (token) {
        const response = await axios.get('https://app.bestbodygym.com/api/obtenerNotificaciones', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.data.success) {
          setNotifications(response.data.notificaciones);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchNotifications();
    }, [])
  );

  const eliminarNotificacion = async (id) => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (token) {
        await axios.delete(`https://app.bestbodygym.com/api/eliminarNotificacion/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setNotifications(notifications.filter(notification => notification.id !== id));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const eliminarTodasNotificaciones = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (token) {
        await axios.delete('https://app.bestbodygym.com/api/eliminarTodasNotificaciones', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setNotifications([]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={() => setShowNotifications(false)}>
      <View style={{ flexDirection: 'row', marginRight: 10, alignItems: 'center' }}>
        <View>
          <TouchableOpacity style={{ position: 'relative', padding: 20, backgroundColor: '#F4F4F4', borderRadius: 90, width: 40, height: 40, flexDirection: 'column', alignItems: 'center', marginRight: 15, justifyContent: 'center' }} onPress={() => setShowNotifications(!showNotifications)}>
            <Campaign style={{ marginRight: 0 }} />
            <Text style={{ position: 'absolute', top: -10, right: 0, backgroundColor: '#0CBAED', width: 20, height: 20, borderRadius: 90, alignItems: 'center', justifyContent: 'center', textAlign: 'center', fontWeight: '700', fontSize: 13 }}>
              {notifications.length} 
            </Text>
          </TouchableOpacity>
          {showNotifications && (
            <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
              <View style={{
                position: 'absolute',
                top: 40,
                right: 0,
                width: 240,
                backgroundColor: 'white',
                borderWidth: 1,
                borderColor: '#ccc',
                borderRadius: 5,
                padding: 20,
                zIndex: 1000,
              }}>
                <Text style={{ textAlign: 'right', fontSize: 15, fontWeight: 'bold', marginBottom: 10, color: '#1A1A1A', marginBottom: 20 }}>Notificaciones</Text>
                
                {notifications.length > 0 ? notifications.map((notification, index) => (
                  <View key={index} style={{ padding: 14, backgroundColor: '#F4F4F4', borderRadius: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 13 }}>
                    <View style={{ flexDirection: 'column' }}>
                      <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#1A1A1A', marginBottom: 5 }}>{notification.titulo}</Text>
                      <Text style={{ fontSize: 14, fontWeight: 'medium', color: '#737C98' }}>{notification.mensaje}</Text>
                    </View>
                    <TouchableOpacity onPress={() => eliminarNotificacion(notification.id)}>
                      <CloseIcon />
                    </TouchableOpacity>
                  </View>
                )) : (
                  <View style={{ alignItems: 'center', paddingVertical: 40, }}>
                    <CampaignNotification />
                    <Text style={{ fontSize: 16, color: '#1A1A1A', textAlign: 'center' }}>Sin notificaciones</Text>
                    <Text style={{ fontSize: 13, color: '#737C98', textAlign: 'center' }}>No tienes nuevas notificaciones en este momento.</Text>
                  </View>
                )}

                {notifications.length > 0 && (
                  <TouchableOpacity style={{ width: '100%', backgroundColor: '#1A1A1A', padding: 15, borderRadius: 90, marginTop: 20 }} onPress={eliminarTodasNotificaciones}>
                    <Text style={{ color: '#D5FF5F', fontSize: 13, fontWeight: 'bold', textAlign: 'center' }}>Limpiar notificaciones</Text>
                  </TouchableOpacity>
                )}
              </View>
            </TouchableWithoutFeedback>
          )}
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('Perfil')}>
          <Image
            style={{ width: 41, height: 41, borderRadius: 900 }}
            source={{ uri: userData && userData.foto ? userData.foto : defaultFoto }}
          />
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
}
