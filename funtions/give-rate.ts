import { supabase } from '@/initSupabase';

type GiveRateResponse = {
  song_id: number | null;
  moderator_id: number | null;
  user_id: number;
  rating: number;
};

export default async function GiveRate({
  song_id,
  moderator_id,
  user_id,
  rating,
}: GiveRateResponse) {
  return supabase
    .from('ratings')
    .insert({
      song_id,
      moderator_id,
      user_id,
      rating,
    })
    .then(({ data, error }) => {
      if (error) {
        throw new Error(error.message);
      }
      return data;
    });
}
