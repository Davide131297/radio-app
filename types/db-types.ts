export type Ratings = {
  id: number; // ID des Ratings
  created_at: string | null; // Zeitstempel der Erstellung
  song_id: number | null; // ID des Songs
  moderator_id: string | null; // ID des Moderators
  rating: number; // Bewertung
};
