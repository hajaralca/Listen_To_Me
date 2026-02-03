import { View, Slider, Text } from 'react-native';
import { Audio } from 'expo-av';
import { useEffect, useState } from 'react';

export default function AudioPlayer({ audioUrl }) {
  const [sound, setSound] = useState();
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      const { sound } = await Audio.Sound.createAsync(
        { uri: audioUrl },
        { shouldPlay: false },
        status => {
          if (mounted) {
            setPosition(status.positionMillis);
            setDuration(status.durationMillis);
          }
        }
      );
      setSound(sound);
    };
    load();
    return () => {
      mounted = false;
      sound?.unloadAsync();
    };
  }, [audioUrl]);

  return (
    <View>
      <Slider
        value={position}
        maximumValue={duration}
        onSlidingComplete={value => sound?.setPositionAsync(value)}
      />
      <Text>
        {Math.floor(position / 1000)}s / {Math.floor(duration / 1000)}s
      </Text>
    </View>
  );
}
