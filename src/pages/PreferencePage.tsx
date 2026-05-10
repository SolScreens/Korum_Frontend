import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { usePreferences } from '../hooks/useRoom';
import PreferenceChip from '../components/shared/PreferenceChip/PreferenceChip';
import ProgressDots from '../components/shared/ProgressDots/ProgressDots';
import { getErrorMessage } from '../lib/api';

const GENRES = [
  'Action', 'Comedy', 'Drama', 'Horror', 'Thriller',
  'Romance', 'Sci-Fi', 'Animation', 'Documentary', 'Fantasy',
  'Mystery', 'Crime',
];

const PLATFORMS = ['Netflix', 'Prime Video', 'Disney+', 'Apple TV+', 'Hotstar'];

const LANGUAGES = ['English', 'Hindi', 'Tamil', 'Telugu', 'Korean', 'Spanish', 'French', 'Japanese'];

const MOODS = [
  'Something cozy', 'Feel-good', 'Edge of my seat',
  'Mind-bending', 'Laugh out loud', 'Emotional',
];

const CURRENT_YEAR = new Date().getFullYear();

export default function PreferencePage() {
  const { roomId } = useParams<{ roomId: string }>();
  const { submitPreferences, isLoading } = usePreferences(roomId!);
  const navigate = useNavigate();

  const [genres, setGenres] = useState<string[]>([]);
  const [mood, setMood] = useState('');
  const [platforms, setPlatforms] = useState<string[]>([]);
  const [languages, setLanguages] = useState<string[]>([]);
  const [yearMin, setYearMin] = useState('');
  const [yearMax, setYearMax] = useState('');
  const [error, setError] = useState<string | null>(null);

  const toggle = <T,>(list: T[], setList: (v: T[]) => void, item: T) => {
    setList(list.includes(item) ? list.filter((x) => x !== item) : [...list, item]);
  };

  const handleSubmit = async () => {
    setError(null);
    try {
      await submitPreferences({
        genres,
        mood_text: mood || undefined,
        platforms,
        languages,
        release_year_min: yearMin ? parseInt(yearMin) : undefined,
        release_year_max: yearMax ? parseInt(yearMax) : undefined,
      });
      navigate(`/rooms/${roomId}/swipe`);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const sectionClass = 'space-y-3';
  const labelClass = 'font-heading font-semibold text-base text-ink';
  const chipRow = 'flex flex-wrap gap-2';

  return (
    <div className="min-h-screen bg-page">
      <header className="bg-white border-b border-border sticky top-0 z-10">
        <div className="max-w-lg mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-3">
            <h1 className="font-heading font-semibold text-xl text-ink">
              Your preferences
            </h1>
            <span className="font-body text-xs text-ink-muted">All optional</span>
          </div>
          <ProgressDots total={3} current={0} />
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6 space-y-7 pb-32">
        {/* Genres */}
        <div className={sectionClass}>
          <h2 className={labelClass}>What genres are you up for?</h2>
          <div className={chipRow}>
            {GENRES.map((g) => (
              <PreferenceChip
                key={g}
                label={g}
                selected={genres.includes(g)}
                onToggle={() => toggle(genres, setGenres, g)}
              />
            ))}
          </div>
        </div>

        {/* Mood */}
        <div className={sectionClass}>
          <h2 className={labelClass}>What's the vibe?</h2>
          <div className={chipRow}>
            {MOODS.map((m) => (
              <PreferenceChip
                key={m}
                label={m}
                selected={mood === m}
                onToggle={() => setMood(mood === m ? '' : m)}
              />
            ))}
          </div>
          <input
            type="text"
            value={mood}
            onChange={(e) => setMood(e.target.value)}
            placeholder="Or describe your mood in your own words…"
            className="w-full px-4 py-3 rounded-[14px] border border-border-warm bg-white font-body text-sm text-ink placeholder:text-ink-muted focus:outline-none focus:border-brand-primary transition-colors"
          />
        </div>

        {/* Release year */}
        <div className={sectionClass}>
          <h2 className={labelClass}>Release year range</h2>
          <div className="flex gap-3 items-center">
            <input
              type="number"
              value={yearMin}
              onChange={(e) => setYearMin(e.target.value)}
              min={1900}
              max={CURRENT_YEAR}
              placeholder="From"
              className="flex-1 px-4 py-3 rounded-[14px] border border-border-warm bg-white font-body text-sm text-ink placeholder:text-ink-muted focus:outline-none focus:border-brand-primary transition-colors"
            />
            <span className="font-body text-ink-muted text-sm">to</span>
            <input
              type="number"
              value={yearMax}
              onChange={(e) => setYearMax(e.target.value)}
              min={1900}
              max={CURRENT_YEAR}
              placeholder="To"
              className="flex-1 px-4 py-3 rounded-[14px] border border-border-warm bg-white font-body text-sm text-ink placeholder:text-ink-muted focus:outline-none focus:border-brand-primary transition-colors"
            />
          </div>
        </div>

        {/* Languages */}
        <div className={sectionClass}>
          <h2 className={labelClass}>Language preference</h2>
          <div className={chipRow}>
            {LANGUAGES.map((l) => (
              <PreferenceChip
                key={l}
                label={l}
                selected={languages.includes(l)}
                onToggle={() => toggle(languages, setLanguages, l)}
              />
            ))}
          </div>
        </div>

        {/* Platforms */}
        <div className={sectionClass}>
          <h2 className={labelClass}>Streaming platforms</h2>
          <div className={chipRow}>
            {PLATFORMS.map((p) => (
              <PreferenceChip
                key={p}
                label={p}
                selected={platforms.includes(p)}
                onToggle={() => toggle(platforms, setPlatforms, p)}
              />
            ))}
          </div>
        </div>
      </main>

      {/* Sticky CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-border p-4">
        <div className="max-w-lg mx-auto">
          {error && (
            <p className="font-body text-sm text-red-500 mb-2">{error}</p>
          )}
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full py-4 rounded-btn bg-brand-primary text-white font-heading font-semibold text-lg hover:bg-brand-hover disabled:opacity-60 transition-all duration-150"
          >
            {isLoading ? 'Loading your feed…' : 'See my recommendations →'}
          </button>
        </div>
      </div>
    </div>
  );
}