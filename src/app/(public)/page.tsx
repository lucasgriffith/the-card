import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { formatDate, formatShortDate, formatReignDays } from "@/lib/format";
import type {
  CurrentChampion,
  EventWithShow,
  Season,
} from "@/types/database";

export default async function DashboardPage() {
  const supabase = await createClient();

  const [championsRes, latestEventsRes, upcomingEventsRes, currentSeasonRes] =
    await Promise.all([
      supabase
        .from("current_champions")
        .select("*")
        .order("championship_name"),
      supabase
        .from("events")
        .select("*, shows(*)")
        .eq("is_upcoming", false)
        .order("date", { ascending: false })
        .limit(3),
      supabase
        .from("events")
        .select("*, shows(*)")
        .eq("is_upcoming", true)
        .order("date", { ascending: true })
        .limit(5),
      supabase.from("seasons").select("*").eq("is_current", true).single(),
    ]);

  const champions = (championsRes.data ?? []) as CurrentChampion[];
  const latestEvents = (latestEventsRes.data ?? []) as EventWithShow[];
  const upcomingEvents = (upcomingEventsRes.data ?? []) as EventWithShow[];
  const currentSeason = currentSeasonRes.data as Season | null;

  // Fetch matches for latest events
  const latestEventIds = latestEvents.map((e) => e.id);
  const matchesRes =
    latestEventIds.length > 0
      ? await supabase
          .from("matches")
          .select(
            "*, match_participants(*, wrestlers(*))"
          )
          .in("event_id", latestEventIds)
          .order("match_order", { ascending: true })
      : { data: [] };

  const matchesByEvent = new Map<string, typeof matchesRes.data>();
  for (const match of matchesRes.data ?? []) {
    const existing = matchesByEvent.get(match.event_id) ?? [];
    existing.push(match);
    matchesByEvent.set(match.event_id, existing);
  }

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8 animate-fade-in">
      {/* Hero */}
      <div className="text-center mb-12">
        <h1 className="text-5xl md:text-6xl font-bold gradient-text-gold tracking-tight">
          THE CARD
        </h1>
        <p className="text-muted-foreground text-lg mt-2">Your WWE Hub</p>
        {currentSeason && (
          <Badge variant="outline" className="mt-3">
            {currentSeason.name}
          </Badge>
        )}
      </div>

      {/* Current Champions */}
      {champions.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <span className="gradient-text-gold">Current Champions</span>
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 stagger-children">
            {champions.map((champ) => (
              <Link
                key={champ.reign_id}
                href={`/championships/${champ.championship_slug}`}
              >
                <Card className="card-hover card-glow-gold h-full">
                  <CardContent className="flex flex-col items-center text-center pt-2">
                    {champ.wrestler_image ? (
                      <Image
                        src={champ.wrestler_image}
                        alt={champ.wrestler_name}
                        width={80}
                        height={80}
                        className="rounded-full object-cover w-20 h-20 mb-3 ring-2 ring-gold/30"
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-3 ring-2 ring-gold/30">
                        <span className="text-2xl font-bold text-muted-foreground">
                          {champ.wrestler_name.charAt(0)}
                        </span>
                      </div>
                    )}
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-1">
                      {champ.championship_name}
                    </p>
                    <p className="font-semibold text-sm">
                      {champ.wrestler_name}
                    </p>
                    <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                      <span>{formatReignDays(champ.reign_days)}</span>
                      <span className="text-border">|</span>
                      <span>
                        {champ.defense_count}{" "}
                        {champ.defense_count === 1 ? "defense" : "defenses"}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      )}

      <Separator className="my-8" />

      {/* Latest Results */}
      {latestEvents.length > 0 && (
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Latest Results</h2>
            <Link
              href="/results"
              className="text-sm text-gold hover:underline"
            >
              View All
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 stagger-children">
            {latestEvents.map((event) => {
              const eventMatches = matchesByEvent.get(event.id) ?? [];
              const isPPV = event.shows?.show_type === "ppv";
              return (
                <Link key={event.id} href={`/results/${event.slug}`}>
                  <Card
                    className={`card-hover h-full ${
                      isPPV ? "border-l-2 border-l-gold" : ""
                    }`}
                  >
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-base">
                          {event.shows?.short_name ?? event.shows?.name}
                        </CardTitle>
                        {isPPV && (
                          <Badge variant="default" className="text-[10px]">
                            PPV
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {formatShortDate(event.date)}
                        {event.venue && ` \u2022 ${event.venue}`}
                        {event.city && `, ${event.city}`}
                      </p>
                    </CardHeader>
                    <CardContent>
                      {eventMatches.length > 0 ? (
                        <ul className="space-y-1">
                          {eventMatches.slice(0, 5).map((match: any) => {
                            const winner =
                              match.match_participants?.find(
                                (p: any) => p.is_winner
                              );
                            return (
                              <li
                                key={match.id}
                                className="text-xs text-muted-foreground flex items-center gap-1"
                              >
                                {winner && (
                                  <span className="text-green-500 font-medium">
                                    {winner.wrestlers?.name}
                                  </span>
                                )}
                                {!winner && (
                                  <span className="italic">No contest</span>
                                )}
                              </li>
                            );
                          })}
                          {eventMatches.length > 5 && (
                            <li className="text-xs text-muted-foreground italic">
                              +{eventMatches.length - 5} more matches
                            </li>
                          )}
                        </ul>
                      ) : (
                        <p className="text-xs text-muted-foreground italic">
                          No matches recorded
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* Upcoming Shows */}
      {upcomingEvents.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold mb-6">Upcoming Shows</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 stagger-children">
            {upcomingEvents.map((event) => {
              const isPPV = event.shows?.show_type === "ppv";
              return (
                <Card
                  key={event.id}
                  className={`card-hover ${
                    isPPV ? "border-l-2 border-l-gold card-glow-gold" : ""
                  }`}
                >
                  <CardHeader>
                    <CardTitle>
                      {event.shows?.short_name ?? event.shows?.name}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(event.date)}
                    </p>
                  </CardHeader>
                  <CardContent>
                    {(event.venue || event.city) && (
                      <p className="text-sm text-muted-foreground">
                        {[event.venue, event.city].filter(Boolean).join(", ")}
                      </p>
                    )}
                    {isPPV && (
                      <Badge variant="default" className="mt-2 text-[10px]">
                        Premium Live Event
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>
      )}

      {/* Empty state */}
      {champions.length === 0 &&
        latestEvents.length === 0 &&
        upcomingEvents.length === 0 && (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg">
              No data available yet. Check back soon!
            </p>
          </div>
        )}
    </div>
  );
}
