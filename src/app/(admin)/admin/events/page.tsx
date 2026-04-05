import { createClient } from "@/lib/supabase/server";
import { EventManager } from "@/components/admin/event-manager";
import type { EventWithShow, Show, Season } from "@/types/database";

export default async function EventsPage() {
  const supabase = await createClient();

  const [eventsRes, showsRes, seasonsRes] = await Promise.all([
    supabase
      .from("events")
      .select("*, shows(*)")
      .order("date", { ascending: false }),
    supabase.from("shows").select("*").order("name"),
    supabase
      .from("seasons")
      .select("*")
      .order("start_date", { ascending: false }),
  ]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold gradient-text-gold">
        Manage Events
      </h1>
      <EventManager
        events={(eventsRes.data as EventWithShow[]) ?? []}
        shows={(showsRes.data as Show[]) ?? []}
        seasons={(seasonsRes.data as Season[]) ?? []}
      />
    </div>
  );
}
