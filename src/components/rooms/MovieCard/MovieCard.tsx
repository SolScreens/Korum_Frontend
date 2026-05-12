import type { Movie } from '../../../types';

interface Props {
  movie: Movie;
  onApprove: () => void;
  onSkip: () => void;
}

export default function MovieCard({ movie, onApprove, onSkip }: Props) {
  return (
    <div className="h-full flex flex-col rounded-card overflow-hidden border border-border shadow-lg bg-card">

      {/* Poster — 65% of card height */}
      <div className="relative overflow-hidden bg-border" style={{ height: '65%' }}>
        {movie.poster_url ? (
          <img
            src={movie.poster_url}
            alt={movie.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-ink-muted font-body text-sm">No poster</span>
          </div>
        )}

        {/* Rating badge */}
        {movie.rating && (
          <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm text-white text-xs font-body font-semibold px-2 py-1 rounded-chip">
            ★ {movie.rating.toFixed(1)}
          </div>
        )}
      </div>

      {/* Info — remaining 35% */}
      <div className="flex flex-col flex-1 p-4 overflow-hidden">
        {/* Title + meta */}
        <div className="shrink-0">
          <h3 className="font-heading font-semibold text-ink text-lg leading-tight line-clamp-1">
            {movie.title}
          </h3>
          <div className="flex items-center gap-2 mt-0.5 flex-wrap">
            {movie.release_year && (
              <span className="font-body text-xs text-ink-muted">{movie.release_year}</span>
            )}
            {movie.runtime && (
              <span className="font-body text-xs text-ink-muted">
                · {Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m
              </span>
            )}
            {movie.genres?.slice(0, 2).map((g) => (
              <span
                key={g}
                className="px-2 py-0.5 bg-surface border border-border rounded-chip text-xs font-body text-ink-secondary"
              >
                {g}
              </span>
            ))}
          </div>
        </div>

        {/* Overview — fills remaining space */}
        {movie.overview && (
          <p className="font-body text-sm text-ink-secondary mt-2 line-clamp-2 leading-relaxed flex-1">
            {movie.overview}
          </p>
        )}

        {/* Action buttons — always at the bottom */}
        <div className="flex gap-3 mt-3 shrink-0">
          <button
            onClick={onSkip}
            className="flex-1 py-2.5 rounded-btn border border-border font-body font-medium text-sm text-ink-secondary hover:bg-red-50 hover:border-red-200 hover:text-red-500 transition-all duration-150"
          >
            Skip
          </button>
          <button
            onClick={onApprove}
            className="flex-1 py-2.5 rounded-btn bg-brand-primary text-white font-body font-medium text-sm hover:bg-brand-hover transition-all duration-150"
          >
            Interested
          </button>
        </div>
      </div>

    </div>
  );
}
