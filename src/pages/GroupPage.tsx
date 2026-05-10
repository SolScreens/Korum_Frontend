import { useNavigate, useParams, Link } from 'react-router-dom';
import { useGroup } from '../hooks/useGroups';
import { useRoom } from '../hooks/useRoom';
import { useAuth } from '../hooks/useAuth';
import MemberAvatar from '../components/shared/MemberAvatar/MemberAvatar';
import StatusBadge from '../components/rooms/StatusBadge/StatusBadge';
import { getErrorMessage } from '../lib/api';
import { useState } from 'react';

export default function GroupPage() {
  const { groupId } = useParams<{ groupId: string }>();
  const { user } = useAuth();
  const { group, isLoading, error } = useGroup(groupId!);
  const { createRoom } = useRoom('');
  const navigate = useNavigate();

  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  const handleStartRoom = async () => {
    setCreating(true);
    setCreateError(null);
    try {
      const room = await createRoom(groupId!);
      navigate(`/rooms/${room.id}/preferences`);
    } catch (err) {
      setCreateError(getErrorMessage(err));
    } finally {
      setCreating(false);
    }
  };

  const isAdmin = group?.members.find((m) => m.user_id === user?.id)?.role === 'admin';

  if (isLoading) {
    return (
      <div className="min-h-screen bg-page flex items-center justify-center">
        <p className="font-body text-ink-muted">Loading…</p>
      </div>
    );
  }

  if (error || !group) {
    return (
      <div className="min-h-screen bg-page flex items-center justify-center">
        <div className="text-center">
          <p className="font-body text-ink-secondary">Group not found</p>
          <Link to="/" className="font-body text-sm text-brand-primary mt-2 block">
            ← Back home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-page">
      {/* Header */}
      <header className="bg-white border-b border-border sticky top-0 z-10">
        <div className="max-w-lg mx-auto px-4 py-4 flex items-center gap-3">
          <Link to="/" className="text-ink-muted hover:text-brand-primary transition-colors">
            ←
          </Link>
          <h1 className="font-heading font-semibold text-xl text-ink truncate">
            {group.name}
          </h1>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6 space-y-6">
        {/* Members */}
        <section>
          <h2 className="font-heading font-semibold text-lg text-ink mb-3">
            Members
          </h2>
          <div className="bg-card rounded-card border border-border divide-y divide-border">
            {group.members.map((m) => (
              <div key={m.user_id} className="flex items-center gap-3 px-4 py-3">
                <MemberAvatar user={m.user} size="md" />
                <div className="min-w-0 flex-1">
                  <p className="font-body font-medium text-sm text-ink truncate">
                    {m.user.display_name}
                  </p>
                  <p className="font-body text-xs text-ink-muted truncate">
                    {m.user.email}
                  </p>
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

        {/* Start a room */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-heading font-semibold text-lg text-ink">
              Decision rooms
            </h2>
          </div>

          <button
            onClick={handleStartRoom}
            disabled={creating}
            className="w-full py-4 rounded-card border-2 border-dashed border-border-warm text-brand-primary font-body font-medium hover:bg-surface hover:border-brand-primary disabled:opacity-60 transition-all duration-150"
          >
            {creating ? 'Starting…' : '+ Start a new room'}
          </button>

          {createError && (
            <p className="font-body text-sm text-red-500 mt-2">{createError}</p>
          )}

          {/* Past rooms placeholder */}
          <div className="mt-3 text-center py-8">
            <p className="font-body text-sm text-ink-muted">
              Past rooms will appear here
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}