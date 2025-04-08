import { Roboto_500Medium, Roboto_400Regular } from '@expo-google-fonts/roboto';
import { Button } from '@react-navigation/elements';
import { useFonts } from 'expo-font';
import { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useToast, Toast } from '@/components/ui/toast';
import { useSong } from '@/context/SongContext';
import GetRate from '@/funtions/get-rate';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/initSupabase';
import type { Ratings } from '@/types/db-types';

export function SecondScreen() {
  const [rating, setRating] = useState<Ratings | null>(null);
  const { user } = useAuth();
  const { currentlyPlayingSong } = useSong();

  useEffect(() => {
    getRating();
  }, [user]);

  useEffect(() => {
    console.log('Currently Playing Song:', currentlyPlayingSong);
    setPlaylistRating(null);
    setSubmitted(false);
  }, [currentlyPlayingSong]);

  useEffect(() => {
    const interval = setInterval(
      () => {
        console.log('Resetting host rating to null');
        setHostRating(null);
        setRatingSubmitted(false);
      },
      60 * 60 * 1000
    );

    return () => clearInterval(interval);
  }, []);

  function getRating() {
    if (user?.id) {
      try {
        GetRate({ id: user?.id }).then((data) => {
          setRating(data);
          //console.log('Rating data:', data);
        });
      } catch (error) {
        console.error('Error fetching rating:', error);
      }
    }
  }
  const [playlistRating, setPlaylistRating] = useState<number | null>(null);
  const [hostRating, setHostRating] = useState<number | null>(null);
  const [songRequest, setSongRequest] = useState<string>('');
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [ratingSubmitted, setRatingSubmitted] = useState<boolean>(false);

  // Load custom fonts
  const [fontsLoaded] = useFonts({
    Roboto_400Regular,
    Roboto_500Medium,
  });

  if (!fontsLoaded) {
    return <Text>Loading...</Text>;
  }

  const handlePlaylistRating = (value: number) => {
    setPlaylistRating(value);
    setSubmitted(true);
    console.log('Playlist rating:', value);

    supabase
      .from('ratings')
      .insert([
        {
          rating: value, // Korrektur: Daten als Objekt übergeben
          song_id: currentlyPlayingSong?.id,
        },
      ])
      .then((response) => {
        if (response.error) {
          console.error('Error inserting rating:', response.error);
        } else {
          console.log('Rating inserted successfully:', response.data);
        }
      });
  };

  const handleHostRating = (value: number) => {
    setHostRating(value);
    setRatingSubmitted(true);
    console.log('Host rating:', value);
    supabase
      .from('ratings')
      .insert([
        {
          rating: value,
          moderator_id: '04b8805f-95fe-4bf7-ab3c-81d2ec01ab1f',
        },
      ])
      .then((response) => {
        if (response.error) {
          console.error('Error inserting rating:', response.error);
        } else {
          console.log('Rating inserted successfully:', response.data);
        }
      });
  };

  const handleSongRequest = async () => {
    if (songRequest) {
      try {
        const { error } = await supabase.from('requests').insert([
          {
            song_title: songRequest,
            user_id: user?.id,
            status: 'requested',
          },
        ]);

        if (error) {
          console.error('Error inserting song request:', error);
          alert('Es gab ein Problem beim Anfragen des Songs. Bitte versuche es erneut.');
        } else {
          setSongRequest('');
          alert('Du hast einen Song gewünscht: ' + songRequest);
        }
      } catch (err) {
        console.error('Unexpected error:', err);
        alert('Ein unerwarteter Fehler ist aufgetreten. Bitte versuche es erneut.');
      }
    } else {
      alert('Bitte gib einen Songnamen ein.');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.headerContainer}>
          <Image
            source={{
              uri:
                'https://dl.dropboxusercontent.com/scl/fi/4gyrrgse59aq1zbxypvcg/logo.png?rlkey=fgca2dl2h3xup4tkgls651imv&st=1isekmpj&dl=1' +
                Date.now(),
            }}
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
            {[1, 2, 3, 4, 5].map((value) => {
              const isDisabled = submitted;
              return (
                <TouchableOpacity
                  key={value}
                  onPress={() => handlePlaylistRating(value)}
                  disabled={isDisabled}
                  style={[styles.ratingButton, isDisabled && styles.disabledRatingButton]}>
                  <Text style={[styles.ratingText, isDisabled && styles.disabledRatingText]}>
                    {value}⭐
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
          {submitted && (
            <>
              <Text style={styles.thankYouText}>
                Danke für deine Bewertung der Playlist: {playlistRating} Sterne!
              </Text>
              <Text style={styles.thankYouText}>
                Warte auf den nächsten Song um eine neue Bewertung abzugeben.
              </Text>
            </>
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
          <Button onPress={handleSongRequest} style={styles.songRequestButton}>
            Song wünschen
          </Button>

          {/* Radio Host Rating */}
          <Text style={styles.sectionTitle}>Bewerte den/die Radiomoderator:in:</Text>

          <View style={styles.ratingContainer}>
            {[1, 2, 3, 4, 5].map((value) => {
              const isDisabled = ratingSubmitted;
              return (
                <TouchableOpacity
                  key={value}
                  onPress={() => handleHostRating(value)}
                  disabled={isDisabled}
                  style={[styles.ratingButton, isDisabled && styles.disabledRatingButton]}>
                  <Text style={styles.ratingText}>{value}⭐</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {ratingSubmitted && (
            <>
              <Text style={styles.thankYouText}>
                Danke für deine Bewertung des/der Moderators/in: {hostRating} Sterne!
              </Text>
              <Text style={styles.thankYouText}>Du kannst in einer Stunde erneut bewerten.</Text>
            </>
          )}
        </View>
      </ScrollView>
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
    marginTop: 30,
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
    backgroundColor: '#46CDCF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 50,
    opacity: 1, // Default opacity for active buttons
  },
  disabledRatingButton: {
    backgroundColor: '#46CDCF', // Keep the same color but reduce opacity
    opacity: 0.6, // Subtle disabled effect
  },
  ratingText: {
    fontSize: 20,
    fontFamily: 'Roboto_400Regular',
    color: '#fff',
  },
  disabledRatingText: {
    color: '#ddd', // Slightly lighter text color for disabled state
  },
  activeRatingButton: {
    backgroundColor: '#46CDCF',
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
