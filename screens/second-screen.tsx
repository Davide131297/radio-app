import { useState } from 'react';
import { Button } from '@react-navigation/elements';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { View, Text, ScrollView, TouchableOpacity, TextInput,Image, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RootStackParamList } from 'types/navigation';
import { useFonts } from 'expo-font';

import { Roboto_500Medium, Roboto_400Regular } from '@expo-google-fonts/roboto';
import { Ionicons } from '@expo/vector-icons'; // Importing Ionicons for icons
import { LinearGradient } from 'expo-linear-gradient';


export function SecondScreen() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [playlistRating, setPlaylistRating] = useState<number | null>(null);
  const [hostRating, setHostRating] = useState<number | null>(null);
  const [songRequest, setSongRequest] = useState<string>('');
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [ratingSubmitted, setRatingSubmitted] = useState<boolean>(false);

  // Load custom fonts
  let [fontsLoaded] = useFonts({
    Roboto_400Regular,
    Roboto_500Medium,
  });

  if (!fontsLoaded) {
    return <Text>Loading...</Text>;
  }

  const handlePlaylistRating = (value: number) => {
    setPlaylistRating(value);
    setSubmitted(true);
  };

  const handleHostRating = (value: number) => {
    setHostRating(value);
    setRatingSubmitted(true);
  };

  const handleSongRequest = () => {
    if (songRequest) {
      alert(`Song requested: ${songRequest}`);
      setSongRequest('');
    } else {
      alert("Please enter a song name.");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.headerContainer}>
           <Image 
            source={{ uri: 'https://dl.dropboxusercontent.com/scl/fi/4gyrrgse59aq1zbxypvcg/logo.png?rlkey=fgca2dl2h3xup4tkgls651imv&st=1isekmpj&dl=1'+ Date.now() }} 
            style={styles.logoImage}
            resizeMode="contain"
          />
          {/*<Text style={styles.headerText}>Radio App</Text>*/}
          <Text style={styles.subHeaderText}>Reviews</Text>
        </View>

        <View style={styles.mainContent}>
          {/* Playlist Rating */}
          <Text style={styles.sectionTitle}>Bewerte die aktuelle Playlist:</Text>

          <View style={styles.ratingContainer}>
            {[1, 2, 3, 4, 5].map((value) => (
              <TouchableOpacity
                key={value}
                onPress={() => handlePlaylistRating(value)}
                style={[styles.ratingButton, playlistRating === value && styles.activeRatingButton]}
              >
                <Text style={styles.ratingText}>{value}⭐</Text>
              </TouchableOpacity>
            ))}
          </View>
          {submitted && (
            <Text style={styles.thankYouText}>
              Danke für deine Bewertung der Playlist: {playlistRating} Sterne!
            </Text>
          )}

          {/* Song Request */}
          <Text style={styles.sectionTitle}>Wünsch dir einen Song:</Text>
          <TextInput
            style={styles.input}
            placeholder="Songname eingeben"
            placeholderTextColor="#999"
            value={songRequest}
            onChangeText={setSongRequest}
          />
          <Button onPress={handleSongRequest}
          style={styles.songRequestButton}
          >Song wünschen</Button>

          {/* Radio Host Rating */}
          <Text style={styles.sectionTitle}>Bewerte den/die Radiomoderator:in:</Text>

          <View style={styles.ratingContainer}>
            {[1, 2, 3, 4, 5].map((value) => (
              <TouchableOpacity
                key={value}
                onPress={() => handleHostRating(value)}
                style={[styles.ratingButton, hostRating === value && styles.activeRatingButton]}
              >
                <Text style={styles.ratingText}>{value}⭐</Text>
              </TouchableOpacity>
            ))}
          </View>

          {ratingSubmitted && (
            <Text style={styles.thankYouText}>
              Danke für deine Bewertung des/der Moderators/in: {hostRating} Sterne!
            </Text>
          )}
        </View>
      </ScrollView>

      {/* Bottom Button */}
           <View style={styles.bottomButtonContainer}>
             <Button onPress={() => navigation.navigate('SecondScreen')} style={styles.button}>
               Back to Home
             </Button>
           </View>
         </SafeAreaView>
       );
}

// Modern styles with custom fonts
const styles = StyleSheet.create({
  logoImage: {
    width: 150, 
    height: 60, 
    marginBottom: 8, // Space between logo and subheader
  },
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 100, // Padding for content above button
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
    alignItems: 'center', // Center horizontally
    justifyContent: 'center', // Center vertically 
  },
  headerText: {
    fontSize: 32,
    fontFamily: 'Roboto_500Medium',
    color: '#333',
  },
  subHeaderText: {
    fontSize: 18,
    fontFamily: 'Roboto_400Regular',
    color: '#666',
  },
  mainContent: {
    paddingHorizontal: 20,
    paddingBottom: 80,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Roboto_500Medium',
    color: '#333',
    marginBottom: 35,
    marginTop:30,
  }, 
  songRequestButton: {
    backgroundColor: '#46CDCF',
    marginBottom: 30,
    
  },
  ratingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 15,
  },
  ratingButton: {
    backgroundColor: '#e0e0e0',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 50,
  },
  activeRatingButton: {
    backgroundColor: '#46CDCF',
  },
  ratingText: {
    fontSize: 20,
    fontFamily: 'Roboto_400Regular',
    color: '#333',
  },
  thankYouText: {
    marginTop: 15,
    fontSize: 16,
    fontFamily: 'Roboto_400Regular',
    color: '#46CDCF',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 10,
    marginVertical: 10,
    fontFamily: 'Roboto_400Regular',
    fontSize: 16,
  },
  bottomButtonContainer: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
  },
  button: {
    backgroundColor: '#46CDCF', // Blue button 
    color: '#fff',
    borderRadius: 8,
    paddingVertical: 12,
  },
});
