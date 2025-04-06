import { supabase } from '@/initSupabase';
import { Ratings } from '@/types/db-types';

export default async function GetRate({ id }: { id: string }) {
  return supabase
    .from('ratings')
    .select('*')
    .eq('moderator_id', id)
    .then(({ data, error }) => {
      if (error) {
        throw new Error(error.message);
      }
      return data as unknown as Ratings;
    });
}
