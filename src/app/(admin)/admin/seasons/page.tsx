import { createClient } from "@/lib/supabase/server";
import { SeasonManager } from "@/components/admin/season-manager";
import type { Season } from "@/types/database";

export default async function SeasonsPage() {
  const supabase = await createClient();

  const { data: seasons } = await supabase
    .from("seasons")
    .select("*")
    .order("start_date", { ascending: false });

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold gradient-text-gold">
        Manage Seasons
      </h1>
      <SeasonManager seasons={(seasons as Season[]) ?? []} />
    </div>
  );
}
