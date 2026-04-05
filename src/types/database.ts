// ─── Enums ─────────────────────────────────────────────────────────────

export type ShowType = "weekly" | "ppv" | "special";
export type Brand = "raw" | "smackdown" | "nxt" | "unbranded";
export type EmbedType = "youtube" | "twitter";
export type EmbedTarget = "match" | "event" | "wrestler";
export type WeightClass =
  | "heavyweight"
  | "midcard"
  | "tag_team"
  | "womens"
  | "womens_tag";

// ─── Tables ────────────────────────────────────────────────────────────

export interface Season {
  id: string;
  name: string;
  slug: string;
  start_date: string;
  end_date: string | null;
  is_current: boolean;
  created_at: string;
}

export interface Wrestler {
  id: string;
  name: string;
  slug: string;
  brand: Brand;
  image_url: string | null;
  height: string | null;
  weight: number | null;
  finisher: string | null;
  hometown: string | null;
  debut_date: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Show {
  id: string;
  name: string;
  short_name: string;
  slug: string;
  show_type: ShowType;
  brand: Brand | null;
  logo_url: string | null;
  is_active: boolean;
  created_at: string;
}

export interface Championship {
  id: string;
  name: string;
  slug: string;
  brand: Brand | null;
  image_url: string | null;
  weight_class: WeightClass | null;
  is_active: boolean;
  display_order: number;
  created_at: string;
}

export interface Event {
  id: string;
  show_id: string;
  season_id: string;
  slug: string;
  date: string;
  venue: string | null;
  city: string | null;
  notes: string | null;
  is_upcoming: boolean;
  created_at: string;
}

export interface Match {
  id: string;
  event_id: string;
  match_order: number;
  match_type: string;
  stipulation: string | null;
  championship_id: string | null;
  duration_seconds: number | null;
  rating: number | null;
  is_main_event: boolean;
  notes: string | null;
  created_at: string;
}

export interface MatchParticipant {
  id: string;
  match_id: string;
  wrestler_id: string;
  team_number: number | null;
  is_winner: boolean;
  entry_number: number | null;
  eliminated_by: string | null;
  created_at: string;
}

export interface ChampionshipReign {
  id: string;
  championship_id: string;
  wrestler_id: string;
  won_date: string;
  lost_date: string | null;
  event_won_id: string | null;
  event_lost_id: string | null;
  reign_number: number | null;
  defense_count: number;
  notes: string | null;
  created_at: string;
}

export interface MediaEmbed {
  id: string;
  url: string;
  embed_type: EmbedType;
  target_type: EmbedTarget;
  target_id: string;
  title: string | null;
  display_order: number;
  created_at: string;
}

// ─── Views ─────────────────────────────────────────────────────────────

export interface CurrentChampion {
  reign_id: string;
  championship_id: string;
  championship_name: string;
  championship_slug: string;
  championship_image: string | null;
  championship_brand: Brand | null;
  weight_class: WeightClass | null;
  wrestler_id: string;
  wrestler_name: string;
  wrestler_slug: string;
  wrestler_image: string | null;
  won_date: string;
  defense_count: number;
  reign_days: number;
}

export interface WrestlerSeasonStats {
  wrestler_id: string;
  wrestler_name: string;
  wrestler_slug: string;
  season_id: string;
  season_name: string;
  total_matches: number;
  wins: number;
  losses: number;
  win_percentage: number;
}

// ─── Joined types for queries ──────────────────────────────────────────

export interface EventWithShow extends Event {
  shows: Show;
}

export interface MatchWithParticipants extends Match {
  match_participants: (MatchParticipant & {
    wrestlers: Wrestler;
  })[];
  championships?: Championship | null;
}

export interface EventDetail extends Event {
  shows: Show;
  matches: MatchWithParticipants[];
}

export interface ChampionshipReignWithDetails extends ChampionshipReign {
  wrestlers: Wrestler;
  event_won?: Event | null;
  event_lost?: Event | null;
}
