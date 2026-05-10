import { useNavigate, useParams, Link } from 'react-router-dom';
import { useGroup } from '../hooks/useGroups';
import { useRoom } from '../hooks/useRoom';
import { useAuth } from '../hooks/useAuth';
import MemberAvatar from '../components/MemberAvatar';
import StatusBadge from '../components/StatusBadge';
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
      <div className="min-h-screen bg-[#FFF8F5] flex items-center justify-center">
        <p className="font-body text-[#9A7060]">Loading…</p>
      </div>
    );
  }

  if (error || !group) {
    return (
      <div className="min-h-screen bg-[#FFF8F5] flex items-center justify-center">
        <div className="text-center">
          <p className="font-body text-[#6B6966]">Group not found</p>
          <Link to="/" className="font-body text-sm text-brand-primary mt-2 block">
            ← Back home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF8F5]">
      {/* Header */}
      <header className="bg-white border-b border-[#E4E2DC] sticky top-0 z-10">
        <div className="max-w-lg mx-auto px-4 py-4 flex items-center gap-3">
          <Link to="/" className="text-[#9A7060] hover:text-brand-primary transition-colors">
            ←
          </Link>
          <h1 className="font-heading font-semibold text-xl text-[#2A1200] truncate">
            {group.name}
          </h1>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6 space-y-6">
        {/* Members */}
        <section>
          <h2 className="font-heading font-semibold text-lg text-[#2A1200] mb-3">
            Members
          </h2>
          <div className="bg-card rounded-card border border-[#E4E2DC] divide-y divide-[#E4E2DC]">
            {group.members.map((m) => (
              <div key={m.user_id} className="flex items-center gap-3 px-4 py-3">
                <MemberAvatar user={m.user} size="md" />
                <div className="min-w-0 flex-1">
                  <p className="font-body font-medium text-sm text-[#2A1200] truncate">
                    {m.user.display_name}
                  </p>
                  <p className="font-body text-xs text-[#9A7060] truncate">
                    {m.user.email}
                  </p>
                </div>
                {m.role === 'admin' && (
                  <span className="text-xs font-body font-medium text-brand-secondary bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-chip shrink-0">
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
            <h2 className="font-heading font-semibold text-lg text-[#2A1200]">
              Decision rooms
            </h2>
          </div>

          <button
            onClick={handleStartRoom}
            disabled={creating}
            className="w-full py-4 rounded-card border-2 border-dashed border-[#EAD8CE] text-brand-primary font-body font-medium hover:bg-orange-50 hover:border-brand-primary disabled:opacity-60 transition-all duration-150"
          >
            {creating ? 'Starting…' : '+ Start a new room'}
          </button>

          {createError && (
            <p className="font-body text-sm text-red-500 mt-2">{createError}</p>
          )}

          {/* Past rooms placeholder */}
          <div className="mt-3 text-center py-8">
            <p className="font-body text-sm text-[#9A7060]">
              Past rooms will appear here
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}