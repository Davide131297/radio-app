import { User } from '@supabase/supabase-js';
import { useState, useEffect } from 'react';

import { supabase } from '@/initSupabase';

interface AuthState {
  user: User | null;
  error: string | null;
  loading: boolean;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    error: null,
    loading: true,
  });

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      setAuthState({
        user,
        error: error?.message || null,
        loading: false,
      });
    };

    fetchUser();

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthState({
        user: session?.user || null,
        error: null,
        loading: false,
      });
    });

    return () => subscription.subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    setAuthState((prev) => ({ ...prev, loading: true }));
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    setAuthState({
      user: data?.user || null,
      error: error?.message || null,
      loading: false,
    });
  };

  const register = async (
    email: string,
    password: string,
    username: string,
    isChecked: boolean | null
  ) => {
    setAuthState((prev) => ({ ...prev, loading: true }));
    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error) {
      setAuthState({
        user: null,
        error: error.message,
        loading: false,
      });
      return;
    }

    if (!data?.user) {
      setAuthState({
        user: null,
        error: 'Registrierung fehlgeschlagen: Kein Benutzer erstellt.',
        loading: false,
      });
      return;
    }

    if (data?.user) {
      const { error } = await supabase.from('users').insert([
        {
          id: data.user.id,
          user_name: username,
          role: isChecked ? 'moderator' : 'hörer',
        },
      ]);

      if (error) {
        console.error('Error inserting user into database:', error, data);
        setAuthState({
          user: null,
          error: error.message,
          loading: false,
        });
        return;
      }

      setAuthState({
        user: data.user,
        error: null,
        loading: false,
      });
    }
  };

  const logout = async () => {
    setAuthState((prev) => ({ ...prev, loading: true }));
    const { error } = await supabase.auth.signOut();
    setAuthState({
      user: null,
      error: error?.message || null,
      loading: false,
    });
  };

  return {
    user: authState.user,
    error: authState.error,
    loading: authState.loading,
    login,
    register,
    logout,
  };
};
