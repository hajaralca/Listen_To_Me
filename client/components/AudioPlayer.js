import React, { useState, useEffect } from 'react';
import { View, Slider, Text } from 'react-native';
import { Audio } from 'expo-av';

export default function AudioPlayer({ audioUrl }) {
  const [sound, setSound] = useState();
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const loadSound = async () => {
      const { sound } = await Audio.Sound.createAsync(
        { uri: audioUrl },
        { shouldPlay: false }
      );
      setSound(sound);
      sound.setOnPlaybackStatusUpdate(updateStatus);
    };

    const updateStatus = (status) => {
      setPosition(status.positionMillis);
      setDuration(status.durationMillis);
    };

    loadSound();
    return () => sound?.unloadAsync();
  }, [audioUrl]);

  return (
    <View>
      <Slider
        value={position}
        minimumValue={0}
        maximumValue={duration}
        onSlidingComplete={async (value) => {
          await sound.setPositionAsync(value);
        }}
      />
      <Text>
        {formatTime(position)} / {formatTime(duration)}
      </Text>
    </View>
  );
}

function formatTime(ms) {
  const minutes = Math.floor(ms / 60000);
  const seconds = ((ms % 60000) / 1000).toFixed(0);
  return `${minutes}:${seconds.padStart(2, '0')}`;
}