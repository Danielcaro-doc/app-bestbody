import React from 'react';
import { View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

const Video = ({ url }) => {
  return (

      <WebView
        style={styles.video}
        javaScriptEnabled={true}
        source={{ uri: url }} 
      />
 
  );
};

export default Video;

const styles = StyleSheet.create({
    video:{
        width: '100%',
        height: 300,
    },
});