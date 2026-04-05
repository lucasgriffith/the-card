"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { slugify } from "@/lib/slugify";
import type {
  Brand,
  ShowType,
  WeightClass,
  EmbedType,
  EmbedTarget,
} from "@/types/database";

// ---------------------------------------------------------------------------
// Auth
// ---------------------------------------------------------------------------

async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    throw new Error("Unauthorized");
  }

  return user;
}

// ---------------------------------------------------------------------------
// Wrestlers
// ---------------------------------------------------------------------------

export async function createWrestler(data: {
  name: string;
  brand?: Brand;
  image_url?: string;
  height?: string;
  weight?: number;
  finisher?: string;
  hometown?: string;
  debut_date?: string;
}) {
  await requireAdmin();
  const supabase = createAdminClient();

  const slug = slugify(data.name);

  const { data: wrestler, error } = await supabase
    .from("wrestlers")
    .insert({ ...data, slug })
    .select()
    .single();

  if (error) throw new Error(error.message);

  revalidatePath("/");
  return wrestler;
}

export async function updateWrestler(
  id: string,
  data: Partial<{
    name: string;
    brand: Brand;
    image_url: string;
    height: string;
    weight: number;
    finisher: string;
    hometown: string;
    debut_date: string;
  }>,
) {
  await requireAdmin();
  const supabase = createAdminClient();

  const updates: Record<string, unknown> = { ...data };
  if (data.name) {
    updates.slug = slugify(data.name);
  }

  const { data: wrestler, error } = await supabase
    .from("wrestlers")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(error.message);

  revalidatePath("/");
  return wrestler;
}

export async function deleteWrestler(id: string) {
  await requireAdmin();
  const supabase = createAdminClient();

  const { error } = await supabase.from("wrestlers").delete().eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/");
}

// ---------------------------------------------------------------------------
// Shows
// ---------------------------------------------------------------------------

export async function createShow(data: {
  name: string;
  short_name: string;
  show_type: ShowType;
  brand?: Brand;
}) {
  await requireAdmin();
  const supabase = createAdminClient();

  const slug = slugify(data.name);

  const { data: show, error } = await supabase
    .from("shows")
    .insert({ ...data, slug })
    .select()
    .single();

  if (error) throw new Error(error.message);

  revalidatePath("/");
  return show;
}

export async function updateShow(
  id: string,
  data: Partial<{
    name: string;
    short_name: string;
    show_type: ShowType;
    brand: Brand;
  }>,
) {
  await requireAdmin();
  const supabase = createAdminClient();

  const updates: Record<string, unknown> = { ...data };
  if (data.name) {
    updates.slug = slugify(data.name);
  }

  const { data: show, error } = await supabase
    .from("shows")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(error.message);

  revalidatePath("/");
  return show;
}

// ---------------------------------------------------------------------------
// Events
// ---------------------------------------------------------------------------

export async function createEvent(data: {
  show_id: string;
  season_id: string;
  date: string;
  slug: string;
  venue?: string;
  city?: string;
  is_upcoming?: boolean;
}) {
  await requireAdmin();
  const supabase = createAdminClient();

  const { data: event, error } = await supabase
    .from("events")
    .insert(data)
    .select()
    .single();

  if (error) throw new Error(error.message);

  revalidatePath("/");
  return event;
}

export async function updateEvent(
  id: string,
  data: Partial<{
    show_id: string;
    season_id: string;
    date: string;
    slug: string;
    venue: string;
    city: string;
    is_upcoming: boolean;
  }>,
) {
  await requireAdmin();
  const supabase = createAdminClient();

  const { data: event, error } = await supabase
    .from("events")
    .update(data)
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(error.message);

  revalidatePath("/");
  return event;
}

export async function deleteEvent(id: string) {
  await requireAdmin();
  const supabase = createAdminClient();

  const { error } = await supabase.from("events").delete().eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/");
}

// ---------------------------------------------------------------------------
// Matches
// ---------------------------------------------------------------------------

export async function createMatch(data: {
  event_id: string;
  match_order: number;
  match_type: string;
  stipulation?: string;
  championship_id?: string;
  duration_seconds?: number;
  rating?: number;
  is_main_event?: boolean;
}) {
  await requireAdmin();
  const supabase = createAdminClient();

  const { data: match, error } = await supabase
    .from("matches")
    .insert(data)
    .select()
    .single();

  if (error) throw new Error(error.message);

  revalidatePath("/");
  return match;
}

export async function updateMatch(
  id: string,
  data: Partial<{
    event_id: string;
    match_order: number;
    match_type: string;
    stipulation: string;
    championship_id: string;
    duration_seconds: number;
    rating: number;
    is_main_event: boolean;
  }>,
) {
  await requireAdmin();
  const supabase = createAdminClient();

  const { data: match, error } = await supabase
    .from("matches")
    .update(data)
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(error.message);

  revalidatePath("/");
  return match;
}

export async function deleteMatch(id: string) {
  await requireAdmin();
  const supabase = createAdminClient();

  const { error } = await supabase.from("matches").delete().eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/");
}

// ---------------------------------------------------------------------------
// Match Participants
// ---------------------------------------------------------------------------

export async function addMatchParticipant(data: {
  match_id: string;
  wrestler_id: string;
  team_number?: number;
  is_winner?: boolean;
  entry_number?: number;
}) {
  await requireAdmin();
  const supabase = createAdminClient();

  const { data: participant, error } = await supabase
    .from("match_participants")
    .insert(data)
    .select()
    .single();

  if (error) throw new Error(error.message);

  revalidatePath("/");
  return participant;
}

export async function removeMatchParticipant(id: string) {
  await requireAdmin();
  const supabase = createAdminClient();

  const { error } = await supabase
    .from("match_participants")
    .delete()
    .eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/");
}

export async function setMatchWinner(matchId: string, wrestlerId: string) {
  await requireAdmin();
  const supabase = createAdminClient();

  // Reset all participants in this match to not winner
  const { error: resetError } = await supabase
    .from("match_participants")
    .update({ is_winner: false })
    .eq("match_id", matchId);

  if (resetError) throw new Error(resetError.message);

  // Set the specified wrestler as winner
  const { error: winnerError } = await supabase
    .from("match_participants")
    .update({ is_winner: true })
    .eq("match_id", matchId)
    .eq("wrestler_id", wrestlerId);

  if (winnerError) throw new Error(winnerError.message);

  revalidatePath("/");
}

// ---------------------------------------------------------------------------
// Championships
// ---------------------------------------------------------------------------

export async function createChampionship(data: {
  name: string;
  brand?: Brand;
  image_url?: string;
  weight_class?: WeightClass;
  display_order?: number;
}) {
  await requireAdmin();
  const supabase = createAdminClient();

  const slug = slugify(data.name);

  const { data: championship, error } = await supabase
    .from("championships")
    .insert({ ...data, slug })
    .select()
    .single();

  if (error) throw new Error(error.message);

  revalidatePath("/");
  return championship;
}

export async function updateChampionship(
  id: string,
  data: Partial<{
    name: string;
    brand: Brand;
    image_url: string;
    weight_class: WeightClass;
    display_order: number;
  }>,
) {
  await requireAdmin();
  const supabase = createAdminClient();

  const updates: Record<string, unknown> = { ...data };
  if (data.name) {
    updates.slug = slugify(data.name);
  }

  const { data: championship, error } = await supabase
    .from("championships")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(error.message);

  revalidatePath("/");
  return championship;
}

// ---------------------------------------------------------------------------
// Championship Reigns
// ---------------------------------------------------------------------------

export async function startChampionshipReign(data: {
  championship_id: string;
  wrestler_id: string;
  won_date: string;
  event_won_id?: string;
  reign_number?: number;
  notes?: string;
}) {
  await requireAdmin();
  const supabase = createAdminClient();

  const { data: reign, error } = await supabase
    .from("championship_reigns")
    .insert(data)
    .select()
    .single();

  if (error) throw new Error(error.message);

  revalidatePath("/");
  return reign;
}

export async function endChampionshipReign(
  reignId: string,
  data: { lost_date: string; event_lost_id?: string },
) {
  await requireAdmin();
  const supabase = createAdminClient();

  const { data: reign, error } = await supabase
    .from("championship_reigns")
    .update(data)
    .eq("id", reignId)
    .select()
    .single();

  if (error) throw new Error(error.message);

  revalidatePath("/");
  return reign;
}

export async function updateDefenseCount(
  reignId: string,
  defenseCount: number,
) {
  await requireAdmin();
  const supabase = createAdminClient();

  const { data: reign, error } = await supabase
    .from("championship_reigns")
    .update({ defense_count: defenseCount })
    .eq("id", reignId)
    .select()
    .single();

  if (error) throw new Error(error.message);

  revalidatePath("/");
  return reign;
}

// ---------------------------------------------------------------------------
// Media Embeds
// ---------------------------------------------------------------------------

export async function addMediaEmbed(data: {
  url: string;
  embed_type: EmbedType;
  target_type: EmbedTarget;
  target_id: string;
  title?: string;
  display_order?: number;
}) {
  await requireAdmin();
  const supabase = createAdminClient();

  const { data: embed, error } = await supabase
    .from("media_embeds")
    .insert(data)
    .select()
    .single();

  if (error) throw new Error(error.message);

  revalidatePath("/");
  return embed;
}

export async function removeMediaEmbed(id: string) {
  await requireAdmin();
  const supabase = createAdminClient();

  const { error } = await supabase.from("media_embeds").delete().eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/");
}

// ---------------------------------------------------------------------------
// Seasons
// ---------------------------------------------------------------------------

export async function createSeason(data: {
  name: string;
  start_date: string;
  end_date?: string;
  is_current?: boolean;
}) {
  await requireAdmin();
  const supabase = createAdminClient();

  const slug = slugify(data.name);

  const { data: season, error } = await supabase
    .from("seasons")
    .insert({ ...data, slug })
    .select()
    .single();

  if (error) throw new Error(error.message);

  revalidatePath("/");
  return season;
}

export async function updateSeason(
  id: string,
  data: Partial<{
    name: string;
    start_date: string;
    end_date: string;
    is_current: boolean;
  }>,
) {
  await requireAdmin();
  const supabase = createAdminClient();

  const updates: Record<string, unknown> = { ...data };
  if (data.name) {
    updates.slug = slugify(data.name);
  }

  const { data: season, error } = await supabase
    .from("seasons")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(error.message);

  revalidatePath("/");
  return season;
}

export async function setCurrentSeason(id: string) {
  await requireAdmin();
  const supabase = createAdminClient();

  // Set all seasons to not current
  const { error: resetError } = await supabase
    .from("seasons")
    .update({ is_current: false })
    .neq("id", id);

  if (resetError) throw new Error(resetError.message);

  // Set the specified season as current
  const { error: setError } = await supabase
    .from("seasons")
    .update({ is_current: true })
    .eq("id", id);

  if (setError) throw new Error(setError.message);

  revalidatePath("/");
}
