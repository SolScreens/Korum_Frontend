import { useParams } from 'react-router-dom';
import { useResults } from '../hooks/useRoom';
import type { Movie } from '../types';

function GenreChips({ genres }: { genres?: string[] }) {
  if (!genres?.length) return null;
  return (
    <div className="flex gap-1 flex-wrap">
      {genres.slice(0, 2).map((g) => (
        <span key={g} className="text-xs font-body text-ink-secondary bg-white border border-border px-2 py-0.5 rounded-chip">
          {g}
        </span>
      ))}
    </div>
  );
}

function WinnerCard({ movie }: { movie: Movie }) {
  return (
    <div className="h-full flex flex-col rounded-card border border-border overflow-hidden shadow-md bg-card">
      {/* Poster — 65% of card height */}
      <div className="relative overflow-hidden bg-border shrink-0" style={{ height: '65%' }}>
        {movie.poster_url ? (
          <img src={movie.poster_url} alt={movie.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-ink-muted font-body text-sm">No poster</span>
          </div>
        )}
        <div className="absolute top-3 left-3 text-3xl">🥇</div>
        {movie.rating && (
          <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm text-white text-xs font-body font-semibold px-2 py-1 rounded-chip">
            ★ {movie.rating.toFixed(1)}
          </div>
        )}
      </div>

      {/* Info — remaining 35% */}
      <div className="flex-1 p-4 flex flex-col justify-between overflow-hidden">
        <div className="space-y-1">
          <h2 className="font-heading font-semibold text-ink text-xl leading-tight line-clamp-1">{movie.title}</h2>
          <p className="font-body text-xs text-ink-muted">
            {movie.release_year}
            {movie.runtime && ` · ${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m`}
          </p>
          <GenreChips genres={movie.genres} />
          {movie.overview && (
            <p className="font-body text-xs text-ink-secondary line-clamp-3 leading-relaxed pt-0.5">{movie.overview}</p>
          )}
        </div>
        {movie.approval_count !== undefined && (
          <span className="font-body text-xs text-brand-primary font-medium">
            {movie.approval_count} approval{movie.approval_count !== 1 ? 's' : ''}
          </span>
        )}
      </div>
    </div>
  );
}

function RunnerUpCard({ movie, rank }: { movie: Movie; rank: 2 | 3 }) {
  const medal = rank === 2 ? '🥈' : '🥉';
  return (
    <div className="flex-1 bg-card rounded-card border border-border px-3 py-2.5 flex gap-3 items-center min-h-0">
      <span className="text-xl shrink-0">{medal}</span>
      {movie.poster_url && (
        <img src={movie.poster_url} alt={movie.title} className="w-20 h-[112px] object-cover rounded-[10px] shrink-0" />
      )}
      <div className="flex-1 min-w-0">
        <h3 className="font-heading font-semibold text-ink text-sm leading-tight line-clamp-1">{movie.title}</h3>
        <p className="font-body text-xs text-ink-muted mt-0.5">
          {movie.release_year}
          {movie.runtime && ` · ${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m`}
        </p>
        <GenreChips genres={movie.genres} />
      </div>
      {movie.approval_count !== undefined && (
        <span className="font-body text-xs text-brand-primary font-medium shrink-0">
          {movie.approval_count} ✓
        </span>
      )}
    </div>
  );
}

export default function ResultsPage() {
  const { roomId } = useParams<{ roomId: string }>();
  const { movies, isLoading, error } = useResults(roomId!);

  if (isLoading || error) {
    return (
      <div className="h-screen bg-page flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-4 border-brand-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  const top = movies.slice(0, 3);
  const [first, second, third] = top;

  if (top.length === 0) {
    return (
      <div className="h-screen bg-page flex items-center justify-center">
        <p className="font-body text-ink-muted">No results yet</p>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-page">
      {/* Header */}
      <header className="shrink-0 bg-white border-b border-border z-10">
        <div className="max-w-lg mx-auto px-4 py-4 flex items-center gap-3">
          <a href={`/rooms/${roomId}`} className="text-ink-muted hover:text-brand-primary text-sm font-body">
            ← Room
          </a>
          <h1 className="font-heading font-semibold text-xl text-ink">Group results</h1>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 flex flex-col min-h-0 max-w-lg w-full mx-auto px-4 py-4 gap-3">

        {/* Winner — 65% */}
        <div className="flex flex-col min-h-0" style={{ height: '65%' }}>
          <p className="shrink-0 font-heading font-semibold text-base text-ink mb-2">Recommended movie</p>
          <div className="flex-1 min-h-0">
            {first && <WinnerCard movie={first} />}
          </div>
        </div>

        {/* Runner-ups — 35% */}
        {(second || third) && (
          <div className="flex flex-col min-h-0" style={{ height: '35%' }}>
            <p className="shrink-0 font-heading font-semibold text-sm text-ink-secondary mb-2">Other recommendations</p>
            <div className="flex-1 flex flex-col gap-2 min-h-0">
              {second && <RunnerUpCard movie={second} rank={2} />}
              {third && <RunnerUpCard movie={third} rank={3} />}
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
