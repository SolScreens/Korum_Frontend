import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useRecommendations } from '../hooks/useRoom';
import { useRoom } from '../hooks/useRoom';
import type { Movie } from '../types';

const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/w300';

export default function ResultsPage() {
  const { roomId } = useParams<{ roomId: string }>();
  const { room } = useRoom(roomId!);
  const { fetchResults } = useRecommendations(roomId!);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchResults()
      .then(setMovies)
      .finally(() => setIsLoading(false));
  }, [fetchResults]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FFF8F5] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-4 border-brand-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF8F5]">
      <header className="bg-white border-b border-[#E4E2DC] sticky top-0 z-10">
        <div className="max-w-lg mx-auto px-4 py-4 flex items-center gap-3">
          {room && (
            <Link
              to={`/groups/${room.group_id}`}
              className="text-[#9A7060] hover:text-brand-primary text-sm font-body"
            >
              ← Group
            </Link>
          )}
          <h1 className="font-heading font-semibold text-xl text-[#2A1200]">
            Group results
          </h1>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6">
        {movies.length === 0 ? (
          <div className="text-center py-16">
            <p className="font-body text-[#9A7060]">No results yet</p>
          </div>
        ) : (
          <>
            <p className="font-body text-sm text-[#9A7060] mb-4">
              Ranked by how many of you approved each movie
            </p>

            <div className="space-y-3">
              {movies.map((movie, i) => (
                <div
                  key={movie.tmdb_id}
                  className="bg-card rounded-card border border-[#E4E2DC] p-4 flex gap-4 items-start"
                >
                  {/* Rank */}
                  <div className="shrink-0 w-8 text-center">
                    {i === 0 ? (
                      <span className="text-2xl">🥇</span>
                    ) : i === 1 ? (
                      <span className="text-2xl">🥈</span>
                    ) : i === 2 ? (
                      <span className="text-2xl">🥉</span>
                    ) : (
                      <span className="font-heading font-semibold text-lg text-[#9A7060]">
                        {i + 1}
                      </span>
                    )}
                  </div>

                  {/* Poster thumbnail */}
                  {movie.poster_url && (
                    <img
                      src={`${TMDB_IMAGE_BASE}${movie.poster_url}`}
                      alt={movie.title}
                      className="w-14 h-20 object-cover rounded-[10px] shrink-0"
                    />
                  )}

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-heading font-semibold text-[#2A1200] text-base leading-tight">
                      {movie.title}
                    </h3>
                    <p className="font-body text-xs text-[#9A7060] mt-0.5">
                      {movie.release_year}
                      {movie.runtime && ` · ${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m`}
                    </p>
                    {movie.genres.length > 0 && (
                      <div className="flex gap-1 flex-wrap mt-1.5">
                        {movie.genres.slice(0, 2).map((g) => (
                          <span
                            key={g}
                            className="text-xs font-body text-[#6B6966] bg-white border border-[#E4E2DC] px-2 py-0.5 rounded-chip"
                          >
                            {g}
                          </span>
                        ))}
                      </div>
                    )}
                    {movie.approval_count !== undefined && (
                      <p className="font-body text-xs text-brand-primary font-medium mt-2">
                        {movie.approval_count} approval{movie.approval_count !== 1 ? 's' : ''}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}