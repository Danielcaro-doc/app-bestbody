import React from 'react';
import { View, Text, StyleSheet, Button, TouchableOpacity, ScrollView } from 'react-native';

export default function Valoraciones() {
    
    return (
        <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
          />
        } >


        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#E8E9EA',
        alignItems: 'center',
        height: '100%',
        paddingBottom: 5,
        
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

