import { createClient } from "@/lib/supabase/server";
import { ShowManager } from "@/components/admin/show-manager";
import type { Show } from "@/types/database";

export default async function ShowsPage() {
  const supabase = await createClient();

  const { data: shows } = await supabase
    .from("shows")
    .select("*")
    .order("name");

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold gradient-text-gold">
        Manage Shows
      </h1>
      <ShowManager shows={(shows as Show[]) ?? []} />
    </div>
  );
}
