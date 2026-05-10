import { useState, useEffect, useCallback } from 'react';
import api from '../lib/api';
import type { Group, CreateGroupRequest } from '../types';

export function useGroups() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGroups = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await api.get<Group[]>('/groups');
      setGroups(res.data);
    } catch {
      setError('Failed to load groups');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGroups();
  }, [fetchGroups]);

  const createGroup = useCallback(async (data: CreateGroupRequest) => {
    const res = await api.post<Group>('/groups', data);
    setGroups((prev) => [res.data, ...prev]);
    return res.data;
  }, []);

  const inviteMember = useCallback(async (groupId: string, email: string) => {
    await api.post(`/groups/${groupId}/members`, { email });
  }, []);

  const removeMember = useCallback(
    async (groupId: string, userId: string) => {
      await api.delete(`/groups/${groupId}/members/${userId}`);
    },
    []
  );

  return {
    groups,
    isLoading,
    error,
    refetch: fetchGroups,
    createGroup,
    inviteMember,
    removeMember,
  };
}

export function useGroup(groupId: string) {
  const [group, setGroup] = useState<Group | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGroup = useCallback(async () => {
    if (!groupId) return;
    setIsLoading(true);
    setError(null);
    try {
      const res = await api.get<Group>(`/groups/${groupId}`);
      setGroup(res.data);
    } catch {
      setError('Failed to load group');
    } finally {
      setIsLoading(false);
    }
  }, [groupId]);

  useEffect(() => {
    fetchGroup();
  }, [fetchGroup]);

  return { group, isLoading, error, refetch: fetchGroup };
}