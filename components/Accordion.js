import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Animated, } from 'react-native';
import Collapsible from 'react-native-collapsible';
import Icon from 'react-native-vector-icons/FontAwesome';
import ArrowBottomCircle from '../assets/icons/ArrowBottomCircle';

const Accordion = ({ title, children, isOpen, onPress }) => {
    const rotate = new Animated.Value(isOpen ? 1 : 0); // valor inicial
  
    useEffect(() => {
      Animated.timing(rotate, {
        toValue: isOpen ? 1 : 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }, [isOpen]); 
  
    const spin = rotate.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '180deg']
    });
  
    return (
      <View style={styles.container}>
        <TouchableOpacity  onPress={onPress}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{title}</Text>
            <Animated.View style={{ transform: [{ rotate: spin }] }}>
              <ArrowBottomCircle size={12} />
            </Animated.View>
          </View>
        </TouchableOpacity>
        <Collapsible collapsed={!isOpen}>
          <View style={styles.content}>
            {children}
          </View>
        </Collapsible>
      </View>
    );
  };
  

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
  },
  title: {
    fontWeight: 'bold',
  },
  content: {
    padding: 5,
  },
});

export default Accordion;
