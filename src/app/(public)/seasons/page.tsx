import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatShortDate } from "@/lib/format";
import type { Season } from "@/types/database";

export default async function SeasonsPage() {
  const supabase = await createClient();

  const { data: seasons, error } = await supabase
    .from("seasons")
    .select("*")
    .order("start_date", { ascending: false });

  const allSeasons = (seasons ?? []) as Season[];

  if (error) {
    return (
      <div className="container mx-auto max-w-7xl px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Seasons</h1>
        <p className="text-muted-foreground">
          Failed to load seasons. Please try again later.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8 animate-fade-in">
      <h1 className="text-3xl font-bold mb-8">Seasons</h1>

      {allSeasons.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-muted-foreground">No seasons available yet.</p>
        </div>
      ) : (
        <div className="space-y-4 stagger-children">
          {allSeasons.map((season) => (
            <Link key={season.id} href={`/seasons/${season.slug}`}>
              <Card
                className={`card-hover ${
                  season.is_current ? "border-l-2 border-l-gold card-glow-gold" : ""
                }`}
              >
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <CardTitle>{season.name}</CardTitle>
                    {season.is_current && (
                      <Badge variant="default" className="text-[10px]">
                        Current
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {formatShortDate(season.start_date)}
                    {season.end_date
                      ? ` \u2013 ${formatShortDate(season.end_date)}`
                      : " \u2013 Present"}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
