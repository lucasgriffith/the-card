import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatShortDate } from "@/lib/format";
import type { EventWithShow } from "@/types/database";

export default async function ResultsPage() {
  const supabase = await createClient();

  const { data: events, error } = await supabase
    .from("events")
    .select("*, shows(*)")
    .eq("is_upcoming", false)
    .order("date", { ascending: false });

  const allEvents = (events ?? []) as EventWithShow[];

  // Fetch match counts per event
  const eventIds = allEvents.map((e) => e.id);
  const matchCountsRes =
    eventIds.length > 0
      ? await supabase
          .from("matches")
          .select("event_id")
          .in("event_id", eventIds)
      : { data: [] };

  const matchCountMap = new Map<string, number>();
  for (const m of matchCountsRes.data ?? []) {
    matchCountMap.set(m.event_id, (matchCountMap.get(m.event_id) ?? 0) + 1);
  }

  if (error) {
    return (
      <div className="container mx-auto max-w-7xl px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Results</h1>
        <p className="text-muted-foreground">
          Failed to load results. Please try again later.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8 animate-fade-in">
      <h1 className="text-3xl font-bold mb-8">Results</h1>

      {allEvents.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-muted-foreground">No results available yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 stagger-children">
          {allEvents.map((event) => {
            const isPPV = event.shows?.show_type === "ppv";
            const matchCount = matchCountMap.get(event.id) ?? 0;
            return (
              <Link key={event.id} href={`/results/${event.slug}`}>
                <Card
                  className={`card-hover h-full ${
                    isPPV ? "border-l-2 border-l-gold" : ""
                  }`}
                >
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <CardTitle>
                        {event.shows?.short_name ?? event.shows?.name}
                      </CardTitle>
                      {isPPV && (
                        <Badge variant="default" className="text-[10px]">
                          PPV
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {formatShortDate(event.date)}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>
                        {[event.venue, event.city].filter(Boolean).join(", ") ||
                          "TBA"}
                      </span>
                      <span>
                        {matchCount} {matchCount === 1 ? "match" : "matches"}
                      </span>
                    </div>
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
