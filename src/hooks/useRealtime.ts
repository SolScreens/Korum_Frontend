import { useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';

// Supabase client for Realtime only — no DB queries
// Public anon key is safe here (Realtime only, RLS enforced)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

let supabase: ReturnType<typeof createClient> | null = null;

function getSupabase() {
  if (!supabase && supabaseUrl && supabaseAnonKey) {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
  }
  return supabase;
}

// ─── Watch room status changes ────────────────────────────────────────────────

export function useRoomRealtime(
  roomId: string,
  onStatusChange: (status: string) => void
) {
  const callbackRef = useRef(onStatusChange);
  callbackRef.current = onStatusChange;

  useEffect(() => {
    if (!roomId) return;
    const client = getSupabase();
    if (!client) return;

    const channel = client
      .channel(`room:${roomId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'rooms',
          filter: `id=eq.${roomId}`,
        },
        (payload) => {
          const newStatus = payload.new?.status;
          if (newStatus) callbackRef.current(newStatus);
        }
      )
      .subscribe();

    return () => {
      client.removeChannel(channel);
    };
  }, [roomId]);
}

// ─── Watch preferences (who is_ready) ────────────────────────────────────────

export function usePreferencesRealtime(
  roomId: string,
  onUpdate: () => void
) {
  const callbackRef = useRef(onUpdate);
  callbackRef.current = onUpdate;

  useEffect(() => {
    if (!roomId) return;
    const client = getSupabase();
    if (!client) return;

    const channel = client
      .channel(`preferences:${roomId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'preferences',
          filter: `room_id=eq.${roomId}`,
        },
        () => {
          callbackRef.current();
        }
      )
      .subscribe();

    return () => {
      client.removeChannel(channel);
    };
  }, [roomId]);
}