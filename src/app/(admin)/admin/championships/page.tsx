import { createClient } from "@/lib/supabase/server";
import { ChampionshipManager } from "@/components/admin/championship-manager";
import type {
  Championship,
  CurrentChampion,
  Wrestler,
} from "@/types/database";

export default async function ChampionshipsPage() {
  const supabase = await createClient();

  const [championshipsRes, currentChampionsRes, wrestlersRes] =
    await Promise.all([
      supabase
        .from("championships")
        .select("*")
        .order("display_order"),
      supabase.from("current_champions").select("*"),
      supabase
        .from("wrestlers")
        .select("*")
        .eq("is_active", true)
        .order("name"),
    ]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold gradient-text-gold">
        Manage Championships
      </h1>
      <ChampionshipManager
        championships={(championshipsRes.data as Championship[]) ?? []}
        currentChampions={(currentChampionsRes.data as CurrentChampion[]) ?? []}
        wrestlers={(wrestlersRes.data as Wrestler[]) ?? []}
      />
    </div>
  );
}
