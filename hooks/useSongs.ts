import { useEffect, useState } from 'react';

import { supabase } from '../initSupabase';

type Songs = {
  id: number;
  title: string;
  artist: string;
  album: string;
  duration: number;
  imageUrl: string;
  created_at: string;
};

export function useSongs() {
  const [songs, setSongs] = useState<Songs[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSongs() {
      try {
        const { data, error } = await supabase.from('songs').select('*');
        if (error) throw error;
        setSongs(data || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchSongs();
  }, []);

  return { songs, loading, error };
}
