// ─── Auth ────────────────────────────────────────────────────────────────────

export interface User {
  id: string;
  email: string;
  display_name: string;
  avatar_url: string | null;
  created_at: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface SignupRequest {
  email: string;
  password: string;
  display_name?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

// ─── Groups ──────────────────────────────────────────────────────────────────

export interface GroupMember {
  id: string;
  user_id: string;
  group_id: string;
  role: 'admin' | 'member';
  joined_at: string;
  user: User;
}

export interface Group {
  id: string;
  name: string;
  created_by: string;
  created_at: string;
  members: GroupMember[];
}

export interface CreateGroupRequest {
  name: string;
  member_emails?: string[];
}

// ─── Rooms ───────────────────────────────────────────────────────────────────

export type RoomStatus = 'collecting' | 'swiping' | 'done';

export interface Room {
  id: string;
  group_id: string;
  created_by: string;
  status: RoomStatus;
  invite_code: string | null;
  movies: Movie[];
  created_at: string;
  expires_at: string;
  member_statuses?: MemberStatus[];
}

export interface MemberStatus {
  user_id: string;
  display_name: string;
  is_ready: boolean;
  swipe_count: number;
}

// ─── Preferences ─────────────────────────────────────────────────────────────

export type SwipeDirection = 'approved' | 'skipped';

export interface Preferences {
  id: string;
  room_id: string;
  user_id: string;
  genres: string[];
  mood_text: string | null;
  release_year_min: number | null;
  release_year_max: number | null;
  languages: string[];
  platforms: string[];
  swipes: Record<string, SwipeDirection>;
  is_ready: boolean;
  updated_at: string;
}

export interface SubmitPreferencesRequest {
  genres?: string[];
  mood_text?: string;
  release_year_min?: number;
  release_year_max?: number;
  languages?: string[];
  platforms?: string[];
}

export interface UpdateSwipesRequest {
  swipes: Record<string, SwipeDirection>;
  is_ready?: boolean;
}

// ─── Movies ──────────────────────────────────────────────────────────────────

export interface Movie {
  tmdb_id: number;
  title: string;
  overview: string;
  poster_url: string | null;
  backdrop_url: string | null;
  release_year: number | null;
  genres: string[];
  runtime: number | null;
  rating: number | null;
  approval_count?: number; // present in results
}

// ─── API Errors ──────────────────────────────────────────────────────────────

export interface ApiError {
  detail: string;
}