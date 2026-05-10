import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useRecommendations, usePreferences } from '../hooks/useRoom';
import MovieCard from '../components/rooms/MovieCard/MovieCard';
import ProgressDots from '../components/shared/ProgressDots/ProgressDots';
import type { SwipeDirection } from '../types';

const MIN_APPROVALS = 5;

export default function SwipePage() {
  const { roomId } = useParams<{ roomId: string }>();
  const { movies, isLoading, error, fetchRecommendations } = useRecommendations(roomId!);
  const { updateSwipes } = usePreferences(roomId!);
  const navigate = useNavigate();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [swipes, setSwipes] = useState<Record<string, SwipeDirection>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchRecommendations();
  }, [fetchRecommendations]);

  const approvalCount = Object.values(swipes).filter((v) => v === 'approved').length;
  const canFinish = approvalCount >= MIN_APPROVALS || currentIndex >= movies.length;
  const isDone = currentIndex >= movies.length;

  const swipe = async (direction: SwipeDirection) => {
    if (currentIndex >= movies.length) return;
    const movie = movies[currentIndex];
    const newSwipes = { ...swipes, [movie.tmdb_id]: direction };
    setSwipes(newSwipes);
    setCurrentIndex((i) => i + 1);

    // Persist swipe immediately (fire and forget)
    updateSwipes({ swipes: newSwipes }).catch(() => {});
  };

  const handleDone = async () => {
    setIsSubmitting(true);
    try {
      await updateSwipes({ swipes, is_ready: true });
      navigate(`/rooms/${roomId}/lobby`);
    } catch {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-page flex flex-col items-center justify-center gap-3">
        <div className="w-10 h-10 rounded-full border-4 border-brand-primary border-t-transparent animate-spin" />
        <p className="font-body text-ink-muted text-sm">Claude is finding your movies…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-page flex items-center justify-center">
        <div className="text-center px-4">
          <p className="font-body text-ink-secondary">{error}</p>
          <button
            onClick={fetchRecommendations}
            className="mt-3 font-body text-sm text-brand-primary hover:underline"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-page">
      {/* Header */}
      <header className="bg-white border-b border-border sticky top-0 z-10">
        <div className="max-w-lg mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-3">
            <h1 className="font-heading font-semibold text-xl text-ink">
              Swipe your picks
            </h1>
            <span className="font-body text-xs text-ink-muted">
              {approvalCount} liked
            </span>
          </div>
          <ProgressDots total={3} current={1} />
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6 pb-32">
        {isDone || canFinish ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-3">🎉</div>
            <h2 className="font-heading font-semibold text-xl text-ink">
              You've liked {approvalCount} movie{approvalCount !== 1 ? 's' : ''}
            </h2>
            <p className="font-body text-sm text-ink-muted mt-1">
              {isDone
                ? 'You have seen all recommendations'
                : 'You can finish now or keep going'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Counter */}
            <p className="font-body text-sm text-ink-muted text-center">
              {currentIndex + 1} of {movies.length}
            </p>

            {/* Current card */}
            <MovieCard
              movie={movies[currentIndex]}
              isTop
              onApprove={() => swipe('approved')}
              onSkip={() => swipe('skipped')}
            />

            {/* Hint */}
            {approvalCount < MIN_APPROVALS && (
              <p className="text-center font-body text-xs text-ink-muted">
                Like at least {MIN_APPROVALS - approvalCount} more to finish
              </p>
            )}
          </div>
        )}
      </main>

      {/* Sticky CTA — only show when enough approvals */}
      {canFinish && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-border p-4">
          <div className="max-w-lg mx-auto">
            <button
              onClick={handleDone}
              disabled={isSubmitting}
              className="w-full py-4 rounded-btn bg-brand-primary text-white font-heading font-semibold text-lg hover:bg-brand-hover disabled:opacity-60 transition-all duration-150"
            >
              {isSubmitting ? 'Submitting…' : "I'm done →"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}