import { supabase } from '@/initSupabase';
import { Ratings } from '@/types/db-types';

export default async function GetRate({ song_id, moderator_id, user_id, rating }: Ratings) {
  return supabase
    .from('ratings')
    .select('*')
    .then(({ data, error }) => {
      if (error) {
        throw new Error(error.message);
      }
      return data;
    });
}
