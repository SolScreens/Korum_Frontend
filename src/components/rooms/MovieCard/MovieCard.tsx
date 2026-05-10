import type { Movie } from '../../../types';

interface Props {
  movie: Movie;
  onApprove: () => void;
  onSkip: () => void;
  isTop?: boolean;
}

const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';

export default function MovieCard({ movie, onApprove, onSkip, isTop = false }: Props) {
  const posterUrl = movie.poster_url
    ? `${TMDB_IMAGE_BASE}${movie.poster_url}`
    : null;

  return (
    <div
      className={`
        relative w-full bg-card rounded-card overflow-hidden border border-border
        transition-shadow duration-200
        ${isTop ? 'shadow-lg' : 'shadow-sm'}
      `}
    >
      {/* Poster */}
      <div className="aspect-[2/3] w-full bg-border relative overflow-hidden">
        {posterUrl ? (
          <img
            src={posterUrl}
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

      {/* Info */}
      <div className="p-4">
        <h3 className="font-heading font-semibold text-ink text-xl leading-tight">
          {movie.title}
        </h3>

        <div className="flex items-center gap-2 mt-1 flex-wrap">
          {movie.release_year && (
            <span className="font-body text-sm text-ink-muted">
              {movie.release_year}
            </span>
          )}
          {movie.runtime && (
            <span className="font-body text-sm text-ink-muted">
              · {Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m
            </span>
          )}
        </div>

        {movie.genres.length > 0 && (
          <div className="flex gap-1.5 flex-wrap mt-2">
            {movie.genres.slice(0, 3).map((g) => (
              <span
                key={g}
                className="px-2.5 py-0.5 bg-surface border border-border rounded-chip text-xs font-body text-ink-secondary"
              >
                {g}
              </span>
            ))}
          </div>
        )}

        {movie.overview && (
          <p className="font-body text-sm text-ink-secondary mt-3 line-clamp-3 leading-relaxed">
            {movie.overview}
          </p>
        )}

        {/* Action buttons */}
        <div className="flex gap-3 mt-4">
          <button
            onClick={onSkip}
            className="flex-1 py-3 rounded-btn border border-border font-body font-medium text-ink-secondary hover:bg-red-50 hover:border-red-200 hover:text-red-500 transition-all duration-150"
          >
            Skip
          </button>
          <button
            onClick={onApprove}
            className="flex-1 py-3 rounded-btn bg-brand-primary text-white font-body font-medium hover:bg-brand-hover transition-all duration-150"
          >
            Interested
          </button>
        </div>
      </div>
    </div>
  );
}