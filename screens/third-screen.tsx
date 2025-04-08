import { useEffect, useState } from 'react';
import { View, Image, ScrollView, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button, ButtonText } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/initSupabase';

type Rating = {
  id: number;
  song_id: number | null;
  rating: number;
  created_at: string | null;
  moderator_id: string | null;
  songs: {
    title: string;
  };
  users: {
    user_name: string;
  };
};

type Request = {
  id: number;
  user_id: string;
  song_title: string;
  status: string;
  created_at: string;
  users: {
    user_name: string;
    role: string | null;
    created_at: string;
  };
};

export function ThirdScreen() {
  const { logout, error } = useAuth();
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [requests, setRequests] = useState<Request[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  async function handleLogout() {
    await logout();
    if (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    // Fetch initial data for ratings and requests
    const fetchData = async () => {
      const { data: ratingsData, error: ratingsError } = await supabase.from('ratings').select(`
        *,
        users:moderator_id (
          user_name
        ),
        songs:song_id (
          title
        )
      `);
      if (ratingsError) {
        console.error('Error fetching ratings:', ratingsError);
      } else {
        setRatings(ratingsData || []);
      }

      const { data: requestsData, error: requestsError } = await supabase.from('requests').select(`
          *,
          users:user_id (
            user_name,
            role,
            created_at
          )
        `);

      if (requestsError) {
        console.error('Error fetching requests:', requestsError);
      } else {
        setRequests(requestsData || []);
      }
    };

    fetchData();
    setIsLoading(false);

    // Set up real-time subscriptions for ratings and requests
    const ratingsSubscription = supabase
      .channel('ratings-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'ratings' }, (payload) => {
        setRatings((prev) => {
          if (payload.eventType === 'INSERT') {
            return [...prev, payload.new as Rating];
          } else if (payload.eventType === 'UPDATE') {
            return prev.map((item) =>
              item.id === payload.new.id ? (payload.new as Rating) : item
            );
          } else if (payload.eventType === 'DELETE') {
            return prev.filter((item) => item.id !== payload.old.id);
          }
          return prev;
        });
      })
      .subscribe();

    const requestsSubscription = supabase
      .channel('requests-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'requests' }, (payload) => {
        setRequests((prev) => {
          if (payload.eventType === 'INSERT') {
            return [...prev, payload.new as Request];
          } else if (payload.eventType === 'UPDATE') {
            return prev.map((item) =>
              item.id === payload.new.id ? (payload.new as Request) : item
            );
          } else if (payload.eventType === 'DELETE') {
            return prev.filter((item) => item.id !== payload.old.id);
          }
          return prev;
        });
      })
      .subscribe();

    // Cleanup subscriptions on unmount
    return () => {
      supabase.removeChannel(ratingsSubscription);
      supabase.removeChannel(requestsSubscription);
    };
  }, []);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-100">
        <Spinner size="large" color="#46CDCF" />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1">
      {/* Header Section */}
      <View className="mb-5 flex flex-row items-center justify-between bg-white p-5">
        <View className="flex-1 items-center">
          <Image
            source={{
              uri:
                'https://dl.dropboxusercontent.com/scl/fi/4gyrrgse59aq1zbxypvcg/logo.png?rlkey=fgca2dl2h3xup4tkgls651imv&st=hhayj5xu&dl=1' +
                Date.now(),
            }}
            className="h-16 w-40"
            resizeMode="contain"
          />
        </View>
        <Button onPress={handleLogout} className="bg-red-500">
          <ButtonText className="text-white">Logout</ButtonText>
        </Button>
      </View>
      <ScrollView>
        {/* Content Section */}
        <View className="flex flex-col gap-6 px-5">
          {/* Ratings Section */}
          <View className="rounded-lg bg-white p-4 shadow-md">
            <Text className="mb-3 text-lg font-bold text-gray-800">Ratings:</Text>
            {ratings.length > 0 ? (
              ratings.map((rating) => (
                <View key={rating.id} className="mb-4 rounded-lg bg-gray-50 p-4 shadow-sm">
                  {rating.moderator_id && (
                    <Text className="text-lg font-bold text-gray-800">
                      Bewertung von: {rating.users.user_name}
                    </Text>
                  )}
                  {rating.song_id && (
                    <Text className="text-lg font-bold text-gray-800">
                      Titel: {rating.songs.title}
                    </Text>
                  )}
                  <Text className="mt-2 text-sm text-gray-800">
                    <Text className="font-bold">Rating:</Text> {'⭐'.repeat(rating.rating)} (
                    {rating.rating}/5)
                  </Text>
                </View>
              ))
            ) : (
              <Text className="text-sm text-gray-500">No ratings available.</Text>
            )}
          </View>

          {/* Requests Section */}
          <View className="rounded-lg bg-white p-4 shadow-md">
            <Text className="mb-3 text-lg font-bold text-gray-800">Requests:</Text>
            {requests.length > 0 ? (
              requests.map((request) => (
                <View key={request.id} className="mb-4 rounded-lg bg-gray-50 p-4 shadow-sm">
                  <Text className="text-lg font-bold text-gray-800">Songwunsch</Text>
                  <Text className="mt-2 text-sm text-gray-800">
                    <Text className="font-bold">Song:</Text> {request.song_title}
                  </Text>
                  <Text className="text-sm text-gray-800">
                    <Text className="font-bold">Username:</Text>
                    {request.users.user_name}
                  </Text>
                </View>
              ))
            ) : (
              <Text className="text-sm text-gray-500">No requests available.</Text>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
