import { useState, useEffect, useCallback } from 'react';
import api from '../lib/api';
import type {
  Room,
  Preferences,
  SubmitPreferencesRequest,
  UpdateSwipesRequest,
  Movie,
} from '../types';

export function useRoom(roomId: string) {
  const [room, setRoom] = useState<Room | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRoom = useCallback(async () => {
    if (!roomId) return;
    setIsLoading(true);
    setError(null);
    try {
      const res = await api.get<Room>(`/rooms/${roomId}`);
      setRoom(res.data);
    } catch {
      setError('Failed to load room');
    } finally {
      setIsLoading(false);
    }
  }, [roomId]);

  useEffect(() => {
    fetchRoom();
  }, [fetchRoom]);

  const createRoom = useCallback(async (groupId: string) => {
    const res = await api.post<Room>(`/groups/${groupId}/rooms`);
    return res.data;
  }, []);

  const updateStatus = useCallback(
    async (status: Room['status']) => {
      const res = await api.patch<Room>(`/rooms/${roomId}/status`, { status });
      setRoom(res.data);
      return res.data;
    },
    [roomId]
  );

  return { room, isLoading, error, refetch: fetchRoom, createRoom, updateStatus };
}

export function usePreferences(roomId: string) {
  const [preferences, setPreferences] = useState<Preferences | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const submitPreferences = useCallback(
    async (data: SubmitPreferencesRequest) => {
      setIsLoading(true);
      try {
        const res = await api.post<Preferences>(
          `/rooms/${roomId}/preferences`,
          data
        );
        setPreferences(res.data);
        return res.data;
      } finally {
        setIsLoading(false);
      }
    },
    [roomId]
  );

  const updateSwipes = useCallback(
    async (data: UpdateSwipesRequest) => {
      const res = await api.patch<Preferences>(
        `/rooms/${roomId}/preferences`,
        data
      );
      setPreferences(res.data);
      return res.data;
    },
    [roomId]
  );

  return { preferences, isLoading, submitPreferences, updateSwipes };
}

export function useRecommendations(roomId: string) {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRecommendations = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await api.post<Movie[]>(`/rooms/${roomId}/recommendations`);
      setMovies(res.data);
      return res.data;
    } catch {
      setError('Failed to load recommendations');
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [roomId]);

  const fetchResults = useCallback(async () => {
    const res = await api.get<Movie[]>(`/rooms/${roomId}/results`);
    return res.data;
  }, [roomId]);

  return { movies, isLoading, error, fetchRecommendations, fetchResults };
}