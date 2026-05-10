import { useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useRoom } from '../hooks/useRoom';
import { useRoomRealtime, usePreferencesRealtime } from '../hooks/useRealtime';
import { useAuth } from '../hooks/useAuth';
import MemberAvatar from '../components/MemberAvatar';
import ProgressDots from '../components/ProgressDots';

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
      <div className="min-h-screen bg-[#FFF8F5] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-4 border-brand-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  const statuses = room.member_statuses || [];
  const readyCount = statuses.filter((s) => s.is_ready).length;
  const totalCount = statuses.length;
  const allReady = readyCount === totalCount && totalCount > 0;

  return (
    <div className="min-h-screen bg-[#FFF8F5]">
      <header className="bg-white border-b border-[#E4E2DC] sticky top-0 z-10">
        <div className="max-w-lg mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-3">
            <Link
              to={`/groups/${room.group_id}`}
              className="text-[#9A7060] hover:text-brand-primary text-sm font-body"
            >
              ← Group
            </Link>
          </div>
          <ProgressDots total={3} current={2} />
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-8 text-center">
        <h1 className="font-heading font-semibold text-2xl text-[#2A1200]">
          Waiting for the group
        </h1>
        <p className="font-body text-sm text-[#9A7060] mt-1">
          {readyCount} of {totalCount} done swiping
        </p>

        {/* Progress bar */}
        <div className="mt-5 h-2 bg-[#E4E2DC] rounded-full overflow-hidden max-w-xs mx-auto">
          <div
            className="h-full bg-brand-primary rounded-full transition-all duration-500"
            style={{ width: totalCount ? `${(readyCount / totalCount) * 100}%` : '0%' }}
          />
        </div>

        {/* Member list */}
        <div className="mt-8 bg-card rounded-card border border-[#E4E2DC] divide-y divide-[#E4E2DC] text-left">
          {statuses.map((s) => (
            <div key={s.user_id} className="flex items-center gap-3 px-4 py-3">
              <MemberAvatar
                user={{ display_name: s.display_name, avatar_url: null }}
                size="md"
              />
              <div className="flex-1 min-w-0">
                <p className="font-body font-medium text-sm text-[#2A1200]">
                  {s.display_name}
                  {s.user_id === user?.id && (
                    <span className="text-[#9A7060] font-normal"> (you)</span>
                  )}
                </p>
                <p className="font-body text-xs text-[#9A7060]">
                  {s.swipe_count} movies reviewed
                </p>
              </div>
              {s.is_ready ? (
                <span className="text-green-500 text-lg">✓</span>
              ) : (
                <span className="font-body text-xs text-[#9A7060] bg-[#F8F7F4] border border-[#E4E2DC] px-2 py-1 rounded-chip">
                  Swiping…
                </span>
              )}
            </div>
          ))}
        </div>

        {allReady && (
          <button
            onClick={() => navigate(`/rooms/${roomId}/results`)}
            className="mt-6 w-full py-4 rounded-btn bg-brand-primary text-white font-heading font-semibold text-lg hover:bg-[#FF7A45] transition-colors"
          >
            See results →
          </button>
        )}
      </main>
    </div>
  );
}