import { useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useRoom } from '../hooks/useRoom';
import { useRoomRealtime, usePreferencesRealtime } from '../hooks/useRealtime';
import { useAuth } from '../hooks/useAuth';
import MemberAvatar from '../components/shared/MemberAvatar/MemberAvatar';
import ProgressDots from '../components/shared/ProgressDots/ProgressDots';

export default function RoomPage() {
  const { roomId } = useParams<{ roomId: string }>();
  const { room, isLoading, refetch } = useRoom(roomId!);
  const { user } = useAuth();
  const navigate = useNavigate();

  // Realtime: refresh room when status changes
  useRoomRealtime(roomId!, (status) => {
    if (status === 'done') navigate(`/rooms/${roomId}/results`);
    else refetch();
  });

  // Realtime: refresh when any member marks ready
  usePreferencesRealtime(roomId!, refetch);

  useEffect(() => {
    if (room?.status === 'done') {
      navigate(`/rooms/${roomId}/results`);
    }
  }, [room?.status, roomId, navigate]);

  if (isLoading || !room) {
    return (
      <div className="min-h-screen bg-page flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-4 border-brand-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  const statuses = room.member_statuses || [];
  const readyCount = statuses.filter((s) => s.is_ready).length;
  const totalCount = statuses.length;
  const allReady = readyCount === totalCount && totalCount > 0;

  return (
    <div className="min-h-screen bg-page">
      <header className="bg-white border-b border-border sticky top-0 z-10">
        <div className="max-w-lg mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-3">
            <Link
              to={`/groups/${room.group_id}`}
              className="text-ink-muted hover:text-brand-primary text-sm font-body"
            >
              ← Group
            </Link>
          </div>
          <ProgressDots total={3} current={2} />
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-8 text-center">
        <h1 className="font-heading font-semibold text-2xl text-ink">
          Waiting for the group
        </h1>
        <p className="font-body text-sm text-ink-muted mt-1">
          {readyCount} of {totalCount} done swiping
        </p>

        {/* Progress bar */}
        <div className="mt-5 h-2 bg-border rounded-full overflow-hidden max-w-xs mx-auto">
          <div
            className="h-full bg-brand-primary rounded-full transition-all duration-500"
            style={{ width: totalCount ? `${(readyCount / totalCount) * 100}%` : '0%' }}
          />
        </div>

        {/* Member list */}
        <div className="mt-8 bg-card rounded-card border border-border divide-y divide-border text-left">
          {statuses.map((s) => (
            <div key={s.user_id} className="flex items-center gap-3 px-4 py-3">
              <MemberAvatar
                user={{ display_name: s.display_name, avatar_url: null }}
                size="md"
              />
              <div className="flex-1 min-w-0">
                <p className="font-body font-medium text-sm text-ink">
                  {s.display_name}
                  {s.user_id === user?.id && (
                    <span className="text-ink-muted font-normal"> (you)</span>
                  )}
                </p>
                <p className="font-body text-xs text-ink-muted">
                  {s.swipe_count} movies reviewed
                </p>
              </div>
              {s.is_ready ? (
                <span className="text-brand-secondary text-lg">✓</span>
              ) : (
                <span className="font-body text-xs text-ink-muted bg-surface border border-border px-2 py-1 rounded-chip">
                  Swiping…
                </span>
              )}
            </div>
          ))}
        </div>

        {allReady && (
          <button
            onClick={() => navigate(`/rooms/${roomId}/results`)}
            className="mt-6 w-full py-4 rounded-btn bg-brand-primary text-white font-heading font-semibold text-lg hover:bg-brand-hover transition-colors"
          >
            See results →
          </button>
        )}
      </main>
    </div>
  );
}