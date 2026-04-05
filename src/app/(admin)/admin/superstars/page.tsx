import { createClient } from "@/lib/supabase/server";
import { WrestlerManager } from "@/components/admin/wrestler-manager";
import type { Wrestler } from "@/types/database";

export default async function SuperstarsPage() {
  const supabase = await createClient();

  const { data: wrestlers } = await supabase
    .from("wrestlers")
    .select("*")
    .order("name");

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold gradient-text-gold">
        Manage Superstars
      </h1>
      <WrestlerManager wrestlers={(wrestlers as Wrestler[]) ?? []} />
    </div>
  );
}
