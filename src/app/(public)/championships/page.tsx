import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatReignDays } from "@/lib/format";
import type { CurrentChampion, Championship } from "@/types/database";

export default async function ChampionshipsPage() {
  const supabase = await createClient();

  const [championshipsRes, championsRes] = await Promise.all([
    supabase
      .from("championships")
      .select("*")
      .eq("is_active", true)
      .order("display_order", { ascending: true }),
    supabase.from("current_champions").select("*"),
  ]);

  const championships = (championshipsRes.data ?? []) as Championship[];
  const champions = (championsRes.data ?? []) as CurrentChampion[];

  // Map championship_id to current champion
  const championMap = new Map<string, CurrentChampion>();
  for (const c of champions) {
    championMap.set(c.championship_id, c);
  }

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8 animate-fade-in">
      <h1 className="text-3xl font-bold mb-8">Championships</h1>

      {championships.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-muted-foreground">
            No championships available yet.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 stagger-children">
          {championships.map((championship) => {
            const currentChamp = championMap.get(championship.id);
            return (
              <Link
                key={championship.id}
                href={`/championships/${championship.slug}`}
              >
                <Card className="card-hover card-glow-gold h-full">
                  <CardHeader>
                    <CardTitle className="text-base gradient-text-gold">
                      {championship.name}
                    </CardTitle>
                    {championship.brand &&
                      championship.brand !== "unbranded" && (
                        <Badge variant="outline" className="w-fit text-[10px]">
                          {championship.brand.toUpperCase()}
                        </Badge>
                      )}
                  </CardHeader>
                  <CardContent>
                    {currentChamp ? (
                      <div className="flex items-center gap-3">
                        {currentChamp.wrestler_image ? (
                          <Image
                            src={currentChamp.wrestler_image}
                            alt={currentChamp.wrestler_name}
                            width={48}
                            height={48}
                            className="rounded-full object-cover w-12 h-12 ring-2 ring-gold/30"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center ring-2 ring-gold/30">
                            <span className="text-lg font-bold text-muted-foreground">
                              {currentChamp.wrestler_name.charAt(0)}
                            </span>
                          </div>
                        )}
                        <div>
                          <p className="font-semibold text-sm">
                            {currentChamp.wrestler_name}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>
                              {formatReignDays(currentChamp.reign_days)}
                            </span>
                            <span className="text-border">|</span>
                            <span>
                              {currentChamp.defense_count}{" "}
                              {currentChamp.defense_count === 1
                                ? "defense"
                                : "defenses"}
                            </span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground italic">
                        Vacant
                      </p>
                    )}
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
