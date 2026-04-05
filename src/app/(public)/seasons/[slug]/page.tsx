import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatShortDate, formatRecord, formatWinPct } from "@/lib/format";
import type {
  Season,
  EventWithShow,
  WrestlerSeasonStats,
} from "@/types/database";

export default async function SeasonDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  // Fetch season
  const { data: season, error } = await supabase
    .from("seasons")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !season) {
    notFound();
  }

  const s = season as Season;

  // Fetch events in this season and wrestler stats
  const [eventsRes, statsRes, matchCountRes] = await Promise.all([
    supabase
      .from("events")
      .select("*, shows(*)")
      .eq("season_id", s.id)
      .order("date", { ascending: true }),
    supabase
      .from("wrestler_season_stats")
      .select("*")
      .eq("season_id", s.id)
      .order("win_percentage", { ascending: false }),
    supabase
      .from("events")
      .select("id")
      .eq("season_id", s.id),
  ]);

  const events = (eventsRes.data ?? []) as EventWithShow[];
  const allStats = (statsRes.data ?? []) as WrestlerSeasonStats[];

  // Filter top performers: min 3 matches
  const topPerformers = allStats.filter((s) => s.total_matches >= 3);

  // Count total matches across all events
  const eventIds = events.map((e) => e.id);
  let totalMatches = 0;
  if (eventIds.length > 0) {
    const { count } = await supabase
      .from("matches")
      .select("id", { count: "exact", head: true })
      .in("event_id", eventIds);
    totalMatches = count ?? 0;
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8 animate-fade-in">
      <div className="flex items-center gap-3 mb-2">
        <h1 className="text-3xl md:text-4xl font-bold">{s.name}</h1>
        {s.is_current && (
          <Badge variant="default" className="text-[10px]">
            Current
          </Badge>
        )}
      </div>
      <p className="text-muted-foreground mb-8">
        {formatShortDate(s.start_date)}
        {s.end_date
          ? ` \u2013 ${formatShortDate(s.end_date)}`
          : " \u2013 Present"}
      </p>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <Card className="card-glow-gold">
          <CardContent className="text-center pt-2">
            <p className="text-2xl font-bold">{events.length}</p>
            <p className="text-xs text-muted-foreground">Total Events</p>
          </CardContent>
        </Card>
        <Card className="card-glow-gold">
          <CardContent className="text-center pt-2">
            <p className="text-2xl font-bold">{totalMatches}</p>
            <p className="text-xs text-muted-foreground">Total Matches</p>
          </CardContent>
        </Card>
      </div>

      <Separator className="my-8" />

      {/* Top Performers */}
      {topPerformers.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-bold mb-4">Top Performers</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">#</TableHead>
                <TableHead>Wrestler</TableHead>
                <TableHead>Record</TableHead>
                <TableHead className="text-right">Win %</TableHead>
                <TableHead className="text-right">Matches</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {topPerformers.slice(0, 20).map((stat, index) => (
                <TableRow key={stat.wrestler_id} className="table-row-hover">
                  <TableCell className="font-mono text-muted-foreground">
                    {index + 1}
                  </TableCell>
                  <TableCell>
                    <Link
                      href={`/superstars/${stat.wrestler_slug}`}
                      className="font-medium hover:text-gold transition-colors"
                    >
                      {stat.wrestler_name}
                    </Link>
                  </TableCell>
                  <TableCell>
                    {formatRecord(stat.wins, stat.losses)}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatWinPct(stat.wins, stat.total_matches)}
                  </TableCell>
                  <TableCell className="text-right">
                    {stat.total_matches}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </section>
      )}

      <Separator className="my-8" />

      {/* Events List */}
      <section>
        <h2 className="text-xl font-bold mb-4">Events</h2>

        {events.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              No events recorded for this season.
            </p>
          </div>
        ) : (
          <div className="space-y-3 stagger-children">
            {events.map((event) => {
              const isPPV = event.shows?.show_type === "ppv";
              return (
                <Link key={event.id} href={`/results/${event.slug}`}>
                  <Card
                    className={`card-hover ${
                      isPPV ? "border-l-2 border-l-gold" : ""
                    }`}
                  >
                    <CardContent className="flex items-center justify-between py-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm">
                            {event.shows?.short_name ?? event.shows?.name}
                          </span>
                          {isPPV && (
                            <Badge
                              variant="default"
                              className="text-[10px]"
                            >
                              PPV
                            </Badge>
                          )}
                        </div>
                        {(event.venue || event.city) && (
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {[event.venue, event.city]
                              .filter(Boolean)
                              .join(", ")}
                          </p>
                        )}
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {formatShortDate(event.date)}
                      </span>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
