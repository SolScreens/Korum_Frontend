import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useRecommendations, usePreferences } from '../hooks/useRoom';
import MovieCard from '../components/rooms/MovieCard/MovieCard';
import type { SwipeDirection } from '../types';

const MIN_APPROVALS = 5;

export default function SwipePage() {
  const { roomId } = useParams<{ roomId: string }>();
  const { movies, isLoading, error, refetch } = useRecommendations(roomId!);
  const { updateSwipes } = usePreferences(roomId!);
  const navigate = useNavigate();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [swipes, setSwipes] = useState<Record<string, SwipeDirection>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const approvalCount = Object.values(swipes).filter((v) => v === 'approved').length;
  const canFinish = approvalCount >= MIN_APPROVALS || currentIndex >= movies.length;
  const isDone = currentIndex >= movies.length;

  const swipe = (direction: SwipeDirection) => {
    if (currentIndex >= movies.length) return;
    const movie = movies[currentIndex];
    const newSwipes = { ...swipes, [movie.tmdb_id]: direction };
    setSwipes(newSwipes);
    const nextIndex = currentIndex + 1;
    setCurrentIndex(nextIndex);
    const newApprovals = Object.values(newSwipes).filter((v) => v === 'approved').length;
    if (nextIndex >= movies.length || newApprovals >= MIN_APPROVALS) {
      submitSwipes(newSwipes);
    }
  };

  const submitSwipes = async (finalSwipes: Record<string, SwipeDirection>) => {
    setIsSubmitting(true);
    try {
      await updateSwipes({ swipes: finalSwipes, status: 'done' });
      navigate(`/rooms/${roomId}`);
    } catch {
      setIsSubmitting(false);
    }
  };

  const handleDone = () => submitSwipes(swipes);

  if (isLoading) {
    return (
      <div className="h-screen bg-page flex flex-col items-center justify-center gap-3">
        <div className="w-10 h-10 rounded-full border-4 border-brand-primary border-t-transparent animate-spin" />
        <p className="font-body text-ink-muted text-sm">Loading your movies…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen bg-page flex items-center justify-center">
        <div className="text-center px-4">
          <p className="font-body text-ink-secondary">{error}</p>
          <button onClick={refetch} className="mt-3 font-body text-sm text-brand-primary hover:underline">
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-page">
      {/* Header */}
      <header className="shrink-0 bg-white border-b border-border z-10">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="font-heading font-semibold text-lg text-ink">Swipe your picks</h1>
          <span className="font-body text-xs text-ink-muted">{approvalCount} liked</span>
        </div>
      </header>

      {/* Content — fills all remaining height */}
      <main className="flex-1 flex flex-col overflow-hidden max-w-lg w-full mx-auto px-4 py-3">
        {canFinish || isDone ? (
          /* Done state */
          <div className="flex-1 flex flex-col items-center justify-center gap-4">
            <p className="font-heading font-semibold text-xl text-ink">
              You've liked {approvalCount} movie{approvalCount !== 1 ? 's' : ''}
            </p>
            <p className="font-body text-sm text-ink-muted">
              {isDone ? "You've seen all recommendations" : 'You can finish now or keep going'}
            </p>
            <button
              onClick={handleDone}
              disabled={isSubmitting}
              className="mt-2 w-full max-w-xs py-4 rounded-btn bg-brand-primary text-white font-heading font-semibold text-lg hover:bg-brand-hover disabled:opacity-60 transition-all duration-150"
            >
              {isSubmitting ? 'Submitting…' : "I'm done →"}
            </button>
          </div>
        ) : (
          /* Swiping state */
          <>
            {/* Counter row */}
            <div className="shrink-0 flex items-center justify-between mb-2">
              <span className="font-body text-xs text-ink-muted">
                {currentIndex + 1} of {movies.length}
              </span>
              {approvalCount < MIN_APPROVALS && (
                <span className="font-body text-xs text-ink-muted">
                  Like {MIN_APPROVALS - approvalCount} more to finish
                </span>
              )}
            </div>

            {/* Card — min-h-0 lets flex-1 shrink below content size */}
            <div className="flex-1 min-h-0">
              <MovieCard
                movie={movies[currentIndex]}
                onApprove={() => swipe('approved')}
                onSkip={() => swipe('skipped')}
              />
            </div>
          </>
        )}
      </main>
    </div>
  );
}
