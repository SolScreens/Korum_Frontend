import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useRoom } from '../hooks/useRoom';
import { useRoomRealtime, usePreferencesRealtime } from '../hooks/useRealtime';
import { useAuth } from '../hooks/useAuth';
import MemberAvatar from '../components/shared/MemberAvatar/MemberAvatar';
import type { MemberPreferenceStatus } from '../types';

// ─── Status chip ─────────────────────────────────────────────────────────────

function statusChip(memberStatus: MemberPreferenceStatus, roomPhase: 'collecting' | 'swiping') {
  if (roomPhase === 'collecting') {
    if (memberStatus === 'pending') return { label: 'Pending', style: 'text-ink-muted bg-surface border-border' };
    return { label: 'Submitted', style: 'text-green-700 bg-green-50 border-green-200' };
  }
  if (memberStatus === 'done') return { label: 'Done', style: 'text-green-700 bg-green-50 border-green-200' };
  if (memberStatus === 'swiping') return { label: 'Swiping', style: 'text-brand-primary bg-tint-primary border-brand-primary' };
  return { label: 'Pending', style: 'text-ink-muted bg-surface border-border' };
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function RoomPage() {
  const { roomId } = useParams<{ roomId: string }>();
  const { room, isLoading, refetch, updateStatus } = useRoom(roomId!);
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isAdvancing, setIsAdvancing] = useState(false);

  const statuses = room?.member_statuses ?? [];
  const isCreator = !!(room && user && room.created_by === user.id);
  const roomPhase = room?.status === 'collecting' ? 'collecting' : 'swiping';

  const myStatus = statuses.find((s) => s.user_id === user?.id)?.status ?? 'pending';

  const prefsCount = statuses.filter((s) => s.status !== 'pending').length;
  const allPrefsSubmitted = statuses.length > 0 && prefsCount === statuses.length;
  const anyPrefsSubmitted = prefsCount > 0;

  const readyCount = statuses.filter((s) => s.status === 'done').length;
  const allReady = statuses.length > 0 && readyCount === statuses.length;
  const anyReady = readyCount > 0;

  // Realtime: refetch when room status or preferences change
  useRoomRealtime(roomId!, refetch);
  usePreferencesRealtime(roomId!, refetch);

  const advance = useCallback(
    async (to: 'swiping' | 'done') => {
      setIsAdvancing(true);
      try {
        await updateStatus(to);
        await refetch();
      } finally {
        setIsAdvancing(false);
      }
    },
    [updateStatus, refetch]
  );

  // Auto-advance from creator's client
  useEffect(() => {
    if (isCreator && room?.status === 'collecting' && allPrefsSubmitted && !isAdvancing) {
      advance('swiping');
    }
  }, [isCreator, room?.status, allPrefsSubmitted, isAdvancing, advance]);

  useEffect(() => {
    if (isCreator && room?.status === 'swiping' && allReady && !isAdvancing) {
      advance('done');
    }
  }, [isCreator, room?.status, allReady, isAdvancing, advance]);

  if (isLoading || !room) {
    return (
      <div className="min-h-screen bg-page flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-4 border-brand-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  // ─── CTA derivation ──────────────────────────────────────────────────────────

  let ctaLabel: string | null = null;
  let ctaAction: (() => void) | null = null;

  if (room.status === 'done') {
    ctaLabel = 'View results →';
    ctaAction = () => navigate(`/rooms/${roomId}/results`);
  } else if (room.status === 'swiping' && myStatus !== 'done') {
    ctaLabel = 'Choose movies →';
    ctaAction = () => navigate(`/rooms/${roomId}/swipe`);
  } else if (room.status === 'collecting' && myStatus === 'pending') {
    ctaLabel = 'Submit my preferences →';
    ctaAction = () => navigate(`/rooms/${roomId}/preferences`);
  }

  const showCreatorSkipPrefs = isCreator && room.status === 'collecting' && anyPrefsSubmitted && !allPrefsSubmitted;
  const showCreatorSkipSwipes = isCreator && room.status === 'swiping' && anyReady && !allReady;

  // ─── Progress ────────────────────────────────────────────────────────────────

  const doneCount = room.status === 'collecting' ? prefsCount : readyCount;
  const totalCount = statuses.length;
  const progressPct = totalCount ? (doneCount / totalCount) * 100 : 0;

  const phaseLabel =
    room.status === 'collecting'
      ? 'Collecting preferences'
      : room.status === 'swiping'
      ? 'Swiping phase'
      : 'Done';

  const progressLabel =
    room.status === 'collecting'
      ? `${doneCount} of ${totalCount} submitted preferences`
      : room.status === 'swiping'
      ? `${doneCount} of ${totalCount} finished swiping`
      : 'All done!';

  return (
    <div className="min-h-screen bg-page">
      {/* Header */}
      <header className="bg-white border-b border-border sticky top-0 z-10">
        <div className="max-w-lg mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            to={`/groups/${room.group_id}`}
            className="text-ink-muted hover:text-brand-primary text-sm font-body"
          >
            ← Group
          </Link>
          <span
            className={`font-body text-xs font-medium px-2.5 py-1 rounded-chip border ${
              room.status === 'collecting'
                ? 'text-amber-700 bg-amber-50 border-amber-200'
                : room.status === 'swiping'
                ? 'text-brand-primary bg-tint-primary border-brand-primary'
                : 'text-green-700 bg-green-50 border-green-200'
            }`}
          >
            {phaseLabel}
          </span>
        </div>
      </header>

      <main className={`max-w-lg mx-auto px-4 py-8 ${showCreatorSkipPrefs || showCreatorSkipSwipes ? 'pb-36' : 'pb-8'}`}>
        {/* Progress summary */}
        <div className="text-center mb-8">
          <p className="font-body text-sm text-ink-muted">{progressLabel}</p>
          <div className="mt-3 h-2 bg-border rounded-full overflow-hidden max-w-xs mx-auto">
            <div
              className="h-full bg-brand-primary rounded-full transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        {/* Member list */}
        <div className="bg-card rounded-card border border-border divide-y divide-border">
          {statuses.map((s) => {
            const chip = statusChip(s.status, roomPhase);
            return (
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
                  {room.status === 'swiping' && (
                    <p className="font-body text-xs text-ink-muted">
                      {s.swipe_count} movie{s.swipe_count !== 1 ? 's' : ''} swiped
                    </p>
                  )}
                </div>
                <span className={`font-body text-xs font-medium px-2 py-1 rounded-chip border ${chip.style}`}>
                  {chip.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Primary CTA — always inline so it can't be missed */}
        <div className="mt-6">
          {isAdvancing ? (
            <p className="text-center font-body text-sm text-ink-muted py-4">
              {room.status === 'collecting' ? 'Generating movie pool…' : 'Generating results…'}
            </p>
          ) : ctaLabel && ctaAction ? (
            <button
              onClick={ctaAction}
              className="w-full py-4 rounded-btn bg-brand-primary text-white font-heading font-semibold text-lg hover:bg-brand-hover transition-all duration-150"
            >
              {ctaLabel}
            </button>
          ) : room.status !== 'done' ? (
            <p className="text-center font-body text-sm text-ink-muted py-4">
              Waiting for others…
            </p>
          ) : null}
        </div>
      </main>

      {/* Sticky footer — creator-only overrides to skip stragglers */}
      {(showCreatorSkipPrefs || showCreatorSkipSwipes) && !isAdvancing && (
        <div className="fixed bottom-0 left-0 right-0 z-10 bg-white border-t border-border p-4">
          <div className="max-w-lg mx-auto">
            {showCreatorSkipPrefs && (
              <button
                onClick={() => advance('swiping')}
                className="w-full py-3 rounded-btn border border-brand-primary text-brand-primary font-body font-medium text-sm hover:bg-tint-primary transition-colors"
              >
                Start swiping now (skip stragglers)
              </button>
            )}
            {showCreatorSkipSwipes && (
              <button
                onClick={() => advance('done')}
                className="w-full py-3 rounded-btn border border-brand-primary text-brand-primary font-body font-medium text-sm hover:bg-tint-primary transition-colors"
              >
                Generate results now (skip stragglers)
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
