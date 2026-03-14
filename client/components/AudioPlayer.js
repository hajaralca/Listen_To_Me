import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';
import { Audio } from 'expo-av';
import { useEffect, useState } from 'react';

export default function AudioPlayer({ audioUrl }) {
  const [sound, setSound] = useState(null);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let mounted = true;
    let currentSound = null;

    const load = async () => {
      try {
        const { sound } = await Audio.Sound.createAsync(
          { uri: audioUrl },
          { shouldPlay: false },
          status => {
            if (!mounted) return;
            if (!status.isLoaded) {
              setIsLoaded(false);
              return;
            }
            setIsLoaded(true);
            setPosition(status.positionMillis ?? 0);
            setDuration(status.durationMillis ?? 0);
            setIsPlaying(status.isPlaying ?? false);
          }
        );
        currentSound = sound;
        setSound(sound);
      } catch (e) {
        console.warn('Failed to load audio', e);
      }
    };

    load();
    return () => {
      mounted = false;
      if (currentSound) {
        currentSound.unloadAsync();
      }
    };
  }, [audioUrl]);

  const togglePlayPause = async () => {
    if (!sound || !isLoaded) return;
    try {
      if (isPlaying) {
        await sound.pauseAsync();
      } else {
        await sound.playAsync();
      }
    } catch (e) {
      console.warn('Failed to toggle playback', e);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <TouchableOpacity
          onPress={togglePlayPause}
          disabled={!isLoaded}
          style={[styles.button, !isLoaded && styles.buttonDisabled]}
        >
          <Text style={styles.buttonText}>{isPlaying ? 'Pause' : 'Play'}</Text>
        </TouchableOpacity>
        <Text style={styles.timeText}>
          {Math.floor(position / 1000)}s / {Math.floor(duration / 1000)}s
        </Text>
      </View>
      <Slider
        style={styles.slider}
        value={position}
        minimumValue={0}
        maximumValue={duration || 1}
        onSlidingComplete={value => sound?.setPositionAsync(value)}
        disabled={!isLoaded}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 4,
    paddingBottom: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  button: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#4CAF50',
    marginRight: 10,
  },
  buttonDisabled: {
    backgroundColor: '#9e9e9e',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  timeText: {
    fontSize: 12,
    color: '#555',
  },
  slider: {
    width: '100%',
  },
});
