import { Ionicons } from '@expo/vector-icons';
import { Roboto_500Medium, Roboto_400Regular } from '@expo-google-fonts/roboto';
import { useFonts } from 'expo-font';
import { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Image,
  TouchableOpacity,
  Animated,
} from 'react-native';

import { Button, ButtonText } from '@/components/ui/button';
import { useSong } from '@/context/SongContext';
import { useSongs } from '@/hooks/useSongs';

const LiveIndicator = () => (
  <View style={styles.liveContainer}>
    <View style={styles.redDot} />
    <Text style={styles.liveText}>LIVE</Text>
  </View>
);

// Sound wave animation component
const SoundWave = () => {
  const bars = [new Animated.Value(1), new Animated.Value(1), new Animated.Value(1)];

  useEffect(() => {
    const animations = bars.map((bar, i) =>
      Animated.loop(
        Animated.sequence([
          Animated.timing(bar, {
            toValue: 2,
            duration: 300 + i * 100,
            useNativeDriver: true,
          }),
          Animated.timing(bar, {
            toValue: 1,
            duration: 300 + i * 100,
            useNativeDriver: true,
          }),
        ])
      )
    );
    animations.forEach((anim) => anim.start());

    return () => animations.forEach((anim) => anim.stop());
  }, []);

  return (
    <View style={styles.soundWaveContainer}>
      {bars.map((bar, index) => (
        <Animated.View
          key={index}
          style={[
            styles.soundBar,
            {
              transform: [{ scaleY: bar }],
            },
          ]}
        />
      ))}
    </View>
  );
};

const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

export function HomeScreen() {
  const [fontsLoaded] = useFonts({
    Roboto_500Medium,
    Roboto_400Regular,
  });

  const { currentlyPlayingSong, setCurrentlyPlayingSong } = useSong();
  const { songs } = useSongs();
  const [currentSongIndex, setCurrentSongIndex] = useState(0);

  const [elapsedTime, setElapsedTime] = useState(0);
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!songs || songs.length === 0) return;

    const currentSong = songs[currentSongIndex];
    setElapsedTime(0);
    setCurrentlyPlayingSong(songs[currentSongIndex]);

    const timer = setInterval(() => {
      setElapsedTime((prev) => {
        if (prev >= currentSong.duration) {
          clearInterval(timer);
          setCurrentSongIndex((prevIndex) => (prevIndex + 1) % songs.length);
          return 0;
        }
        return prev + 1;
      });
    }, 1000);

    Animated.timing(progressAnim, {
      toValue: 1,
      duration: currentSong.duration * 1000,
      useNativeDriver: false,
    }).start();

    return () => {
      clearInterval(timer);
      progressAnim.setValue(0);
    };
  }, [currentSongIndex, songs]);

  if (!fontsLoaded) {
    return <Text>Loading...</Text>;
  }

  if (!songs || songs.length === 0) {
    return <Text>No songs available</Text>;
  }

  const handlePlay = () => console.log('Play Button Pressed');
  const handleStop = () => console.log('Stop Button Pressed');
  const handleShare = () => console.log('Share Button Pressed');
  const handleVolumeUp = () => console.log('Volume Up Button Pressed');
  const handleVolumeDown = () => console.log('Volume Down Button Pressed');

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.headerContainer}>
          <Image
            source={{
              uri:
                'https://dl.dropboxusercontent.com/scl/fi/4gyrrgse59aq1zbxypvcg/logo.png?rlkey=fgca2dl2h3xup4tkgls651imv&st=hhayj5xu&dl=1' +
                Date.now(),
            }}
            style={styles.logoImage}
            resizeMode="contain"
          />
          <LiveIndicator />
        </View>

        <View style={styles.songInfoContainer}>
          <Image
            source={{ uri: currentlyPlayingSong?.imageUrl }}
            style={styles.songImage}
            resizeMode="cover"
          />
          <View style={styles.overlay}>
            <Text style={styles.songTitle}>{currentlyPlayingSong?.title}</Text>
            <Text style={styles.artistName}>{currentlyPlayingSong?.artist}</Text>
            <Text style={styles.albumName}>{currentlyPlayingSong?.album}</Text>

            <View style={styles.audioControlsContainer}>
              <TouchableOpacity style={styles.controlButton} onPress={handlePlay}>
                <Ionicons name="play-circle" size={40} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.controlButton} onPress={handleStop}>
                <Ionicons name="stop-circle" size={40} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.controlButton} onPress={handleVolumeDown}>
                <Ionicons name="volume-low" size={40} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.controlButton} onPress={handleVolumeUp}>
                <Ionicons name="volume-high" size={40} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.controlButton} onPress={handleShare}>
                <Ionicons name="share-social" size={40} color="#fff" />
              </TouchableOpacity>
            </View>

            <View style={styles.progressContainer}>
              <Text style={styles.timeText}>{formatTime(elapsedTime)}</Text>
              <View style={styles.progressBarContainer}>
                <Animated.View style={[styles.progressBar, { width: progressWidth }]} />
              </View>
              <Text style={styles.timeText}>
                {currentlyPlayingSong ? formatTime(currentlyPlayingSong.duration) : '00:00'}
              </Text>
            </View>

            <SoundWave />
          </View>
        </View>
        <View style={styles.spacer} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 10,
  },
  headerContainer: {
    padding: 20,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    marginBottom: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoImage: {
    width: 150,
    height: 60,
    marginBottom: 5,
  },
  liveContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  redDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#F7073F',
    marginRight: 5,
  },
  liveText: {
    color: '#F7073F',
    fontWeight: 'bold',
    fontSize: 16,
  },
  songInfoContainer: {
    position: 'relative',
    marginHorizontal: 20,
    marginVertical: 10,
    borderRadius: 10,
    overflow: 'hidden',
  },
  songImage: {
    width: '100%',
    height: 530,
    borderRadius: 10,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  songTitle: {
    fontSize: 28,
    fontFamily: 'Roboto_500Medium',
    color: '#fff',
    marginBottom: 5,
  },
  artistName: {
    fontSize: 20,
    fontFamily: 'Roboto_400Regular',
    color: '#fff',
    marginBottom: 5,
  },
  albumName: {
    fontSize: 16,
    fontFamily: 'Roboto_400Regular',
    color: '#ccc',
    marginBottom: 20,
  },
  audioControlsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  controlButton: {
    marginHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  soundWaveContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    height: 30,
    marginTop: 10,
  },
  soundBar: {
    width: 6,
    height: 20,
    backgroundColor: '#46CDCF',
    marginHorizontal: 3,
    borderRadius: 3,
  },
  spacer: {
    flex: 1,
  },
  button: {
    backgroundColor: '#46CDCF',
    color: '#fff',
    borderRadius: 8,
    paddingVertical: 12,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
    marginHorizontal: 20,
  },
  timeText: {
    fontSize: 14,
    color: '#fff',
    fontFamily: 'Roboto_400Regular',
  },
  progressBarContainer: {
    flex: 1,
    height: 5,
    backgroundColor: '#ccc',
    borderRadius: 2.5,
    overflow: 'hidden',
    marginHorizontal: 10,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#46CDCF',
  },
});
