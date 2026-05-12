import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useGroup } from '../hooks/useGroups';
import { useRoom, useGroupRooms } from '../hooks/useRoom';
import { useAuth } from '../hooks/useAuth';
import MemberAvatar from '../components/shared/MemberAvatar/MemberAvatar';
import { getErrorMessage } from '../lib/api';
import type { Room } from '../types';

function roomStatusLabel(status: Room['status']) {
  if (status === 'collecting') return 'Collecting preferences';
  if (status === 'swiping') return 'Swiping phase';
  return 'Done';
}

function roomStatusStyle(status: Room['status']) {
  if (status === 'collecting') return 'text-amber-700 bg-amber-50 border-amber-200';
  if (status === 'swiping') return 'text-brand-primary bg-tint-primary border-brand-primary';
  return 'text-green-700 bg-green-50 border-green-200';
}

export default function GroupPage() {
  const { groupId } = useParams<{ groupId: string }>();
  const { user } = useAuth();
  const { group, isLoading: groupLoading, error: groupError } = useGroup(groupId!);
  const { rooms, isLoading: roomsLoading, refetch: refetchRooms } = useGroupRooms(groupId!);
  const { createRoom } = useRoom('');
  const navigate = useNavigate();

  const [step, setStep] = useState<'idle' | 'selecting'>('idle');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  // Pre-select all members when group loads
  useEffect(() => {
    if (group) setSelectedIds(group.members.map((m) => m.user_id));
  }, [group]);

  const toggleMember = (userId: string) => {
    if (userId === user?.id) return;
    setSelectedIds((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  const handleCreate = async () => {
    setCreating(true);
    setCreateError(null);
    try {
      const room = await createRoom(groupId!, selectedIds);
      await refetchRooms();
      navigate(`/rooms/${room.id}`);
    } catch (err) {
      setCreateError(getErrorMessage(err));
    } finally {
      setCreating(false);
    }
  };

  if (groupLoading) {
    return (
      <div className="min-h-screen bg-page flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-4 border-brand-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  if (groupError || !group) {
    return (
      <div className="min-h-screen bg-page flex items-center justify-center">
        <div className="text-center">
          <p className="font-body text-ink-secondary">Group not found</p>
          <Link to="/" className="font-body text-sm text-brand-primary mt-2 block">← Back home</Link>
        </div>
      </div>
    );
  }

  const activeRooms = rooms.filter((r) => r.status !== 'done');
  const pastRooms = rooms.filter((r) => r.status === 'done');
  const canStartNew = activeRooms.length === 0;

  return (
    <div className="min-h-screen bg-page">
      <header className="bg-white border-b border-border sticky top-0 z-10">
        <div className="max-w-lg mx-auto px-4 py-4 flex items-center gap-3">
          <Link to="/" className="text-ink-muted hover:text-brand-primary transition-colors">←</Link>
          <h1 className="font-heading font-semibold text-xl text-ink truncate">{group.name}</h1>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6 space-y-6">

        {/* Members */}
        <section>
          <h2 className="font-heading font-semibold text-lg text-ink mb-3">Members</h2>
          <div className="bg-card rounded-card border border-border divide-y divide-border">
            {group.members.map((m) => (
              <div key={m.user_id} className="flex items-center gap-3 px-4 py-3">
                <MemberAvatar user={m.user} size="md" />
                <div className="min-w-0 flex-1">
                  <p className="font-body font-medium text-sm text-ink truncate">{m.user?.display_name}</p>
                  <p className="font-body text-xs text-ink-muted truncate">{m.user?.email}</p>
                </div>
                {m.role === 'admin' && (
                  <span className="text-xs font-body font-medium text-brand-primary bg-tint-primary border border-border px-2.5 py-1 rounded-chip shrink-0">
                    Admin
                  </span>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Decision rooms */}
        <section>
          <h2 className="font-heading font-semibold text-lg text-ink mb-3">Decision rooms</h2>

          {/* Active rooms */}
          {roomsLoading ? (
            <div className="py-6 flex justify-center">
              <div className="w-6 h-6 rounded-full border-4 border-brand-primary border-t-transparent animate-spin" />
            </div>
          ) : (
            <div className="space-y-3 mb-3">
              {activeRooms.map((room) => (
                <button
                  key={room.id}
                  onClick={() => navigate(`/rooms/${room.id}`)}
                  className="w-full bg-white rounded-card border border-border p-4 text-left hover:border-brand-primary transition-colors shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <p className="font-heading font-semibold text-base text-ink">Active room</p>
                    <span className={`font-body text-xs font-medium px-2.5 py-1 rounded-chip border ${roomStatusStyle(room.status)}`}>
                      {roomStatusLabel(room.status)}
                    </span>
                  </div>
                  <p className="font-body text-sm text-brand-primary mt-2">Open room →</p>
                </button>
              ))}

              {pastRooms.map((room) => (
                <button
                  key={room.id}
                  onClick={() => navigate(`/rooms/${room.id}/results`)}
                  className="w-full bg-white rounded-card border border-border p-4 text-left hover:border-brand-primary transition-colors opacity-60"
                >
                  <div className="flex items-center justify-between">
                    <p className="font-heading font-medium text-sm text-ink">Past room</p>
                    <span className={`font-body text-xs font-medium px-2.5 py-1 rounded-chip border ${roomStatusStyle(room.status)}`}>
                      {roomStatusLabel(room.status)}
                    </span>
                  </div>
                  <p className="font-body text-sm text-ink-muted mt-1">View results →</p>
                </button>
              ))}
            </div>
          )}

          {/* Member selection */}
          {step === 'selecting' ? (
            <div className="bg-white rounded-card border border-border-warm p-5 space-y-4">
              <div>
                <p className="font-heading font-semibold text-base text-ink mb-1">Invite to room</p>
                <p className="font-body text-xs text-ink-muted">Select who you want in this session</p>
              </div>

              <div className="space-y-2">
                {group.members.map((m) => {
                  const isMe = m.user_id === user?.id;
                  const selected = selectedIds.includes(m.user_id);
                  return (
                    <button
                      key={m.user_id}
                      onClick={() => toggleMember(m.user_id)}
                      disabled={isMe}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-[14px] border transition-all duration-150 ${
                        selected
                          ? 'border-brand-primary bg-tint-primary'
                          : 'border-border bg-page hover:border-border-warm'
                      } disabled:cursor-default`}
                    >
                      <MemberAvatar user={m.user} size="sm" />
                      <span className="font-body text-sm text-ink flex-1 text-left">
                        {m.user?.display_name}
                        {isMe && <span className="text-ink-muted font-normal"> (you)</span>}
                      </span>
                      <span className={`w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center ${
                        selected ? 'border-brand-primary bg-brand-primary' : 'border-border'
                      }`}>
                        {selected && <span className="text-white text-[10px] leading-none">✓</span>}
                      </span>
                    </button>
                  );
                })}
              </div>

              {createError && (
                <p className="font-body text-sm text-red-500">{createError}</p>
              )}

              <div className="flex gap-2">
                <button
                  onClick={() => { setStep('idle'); setCreateError(null); }}
                  className="flex-1 py-2.5 rounded-btn border border-border font-body text-sm font-medium text-ink-secondary hover:bg-surface transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreate}
                  disabled={creating || selectedIds.length === 0}
                  className="flex-1 py-2.5 rounded-btn bg-brand-primary text-white font-body text-sm font-medium hover:bg-brand-hover disabled:opacity-60 transition-colors"
                >
                  {creating ? 'Creating…' : 'Create room'}
                </button>
              </div>
            </div>
          ) : canStartNew ? (
            <button
              onClick={() => setStep('selecting')}
              className="w-full py-4 rounded-card border-2 border-dashed border-border-warm text-brand-primary font-body font-medium hover:bg-surface hover:border-brand-primary transition-all duration-150"
            >
              + Start a new room
            </button>
          ) : null}
        </section>
      </main>
    </div>
  );
}
