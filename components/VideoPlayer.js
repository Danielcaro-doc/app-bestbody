// components/VideoPlayer.js
import React, { useState, useRef } from 'react';
import { View, Button, StyleSheet } from 'react-native';
import YoutubePlayer from 'react-native-youtube-iframe';
import getYouTubeID from 'get-youtube-id';

const VideoPlayer = ({ videoUrl }) => {
  const [playing, setPlaying] = useState(false);
  const playerRef = useRef(null);

  const togglePlaying = () => {
    setPlaying((prev) => !prev);
  };

  const seekTo = (seconds) => {
    playerRef.current?.seekTo(seconds, true);
  };

  const videoId = getYouTubeID(videoUrl);

  return (
    <View style={styles.containerVideo}>
      <YoutubePlayer
        ref={playerRef}
        width={300}
        height={300}
        play={playing}
        videoId={videoId}
        onChangeState={event => console.log(event)}
      />
      {/* <View style={styles.controls}>
        <Button title={playing ? "Pause" : "Play"} onPress={togglePlaying} />
        <Button title="Rewind 10s" onPress={() => seekTo(-10)} />
        <Button title="Forward 10s" onPress={() => seekTo(10)} />
      </View> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {

    justifyContent: 'center',
    alignItems: 'center',
  },

});

export default VideoPlayer;
