import type { Meta, StoryObj } from '@storybook/react';
import MovieCard from './MovieCard';
import type { Movie } from '../../../types';

const meta = {
  title: 'Rooms/MovieCard',
  component: MovieCard,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  args: {
    onApprove: () => {},
    onSkip: () => {},
  },
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof MovieCard>;

export default meta;
type Story = StoryObj<typeof meta>;

const fullMovie: Movie = {
  tmdb_id: 238,
  title: 'The Godfather',
  overview:
    'Spanning the years 1945 to 1955, a chronicle of the fictional Italian-American Corleone crime family.',
  poster_url: '/3bhkrj58Vtu7enYsLegHnDcdh9.jpg',
  backdrop_url: null,
  release_year: 1972,
  runtime: 175,
  genres: ['Crime', 'Drama'],
  rating: 9.2,
};

const minimalMovie: Movie = {
  tmdb_id: 999,
  title: 'Unknown Title',
  overview: '',
  poster_url: null,
  backdrop_url: null,
  release_year: null,
  runtime: null,
  genres: [],
  rating: null,
};

export const FullDetails: Story = { args: { movie: fullMovie, isTop: true } };
export const NoPoster: Story = { args: { movie: minimalMovie, isTop: true } };
export const NotTopCard: Story = { args: { movie: fullMovie, isTop: false } };
export const ManyGenres: Story = {
  args: {
    movie: { ...fullMovie, genres: ['Crime', 'Drama', 'Thriller', 'Mystery'] },
    isTop: true,
  },
};
