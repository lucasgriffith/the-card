import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { MatchCardEditor } from "@/components/admin/match-card-editor";
import type {
  Event,
  Show,
  MatchWithParticipants,
  Wrestler,
  Championship,
} from "@/types/database";

export default async function MatchesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: event } = await supabase
    .from("events")
    .select("*, shows(*)")
    .eq("id", id)
    .single();

  if (!event) {
    notFound();
  }

  const [matchesRes, wrestlersRes, championshipsRes] = await Promise.all([
    supabase
      .from("matches")
      .select(
        "*, match_participants(*, wrestlers(*)), championships(*)"
      )
      .eq("event_id", id)
      .order("match_order"),
    supabase.from("wrestlers").select("*").eq("is_active", true).order("name"),
    supabase
      .from("championships")
      .select("*")
      .eq("is_active", true)
      .order("display_order"),
  ]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold gradient-text-gold">
        Match Card Editor
      </h1>
      <MatchCardEditor
        event={event as Event & { shows: Show }}
        matches={(matchesRes.data as MatchWithParticipants[]) ?? []}
        wrestlers={(wrestlersRes.data as Wrestler[]) ?? []}
        championships={(championshipsRes.data as Championship[]) ?? []}
      />
    </div>
  );
}
