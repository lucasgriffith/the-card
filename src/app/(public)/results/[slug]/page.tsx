import { notFound } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { formatDate, formatDuration } from "@/lib/format";
import { MediaEmbedList } from "@/components/media/media-embed-list";
import type {
  Event,
  Show,
  MatchWithParticipants,
  MediaEmbed,
} from "@/types/database";

function renderStars(rating: number): string {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.25 && rating % 1 < 0.75 ? 1 : 0;
  const extra = rating % 1 >= 0.75 ? 1 : 0;
  return (
    "\u2605".repeat(full + extra) +
    (half ? "\u00BD" : "") +
    ` (${rating.toFixed(1)})`
  );
}

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  // Fetch event with show
  const { data: event, error: eventError } = await supabase
    .from("events")
    .select("*, shows(*)")
    .eq("slug", slug)
    .single();

  if (eventError || !event) {
    notFound();
  }

  const eventData = event as Event & { shows: Show };

  // Fetch matches with participants, wrestlers, and championships
  const { data: matches } = await supabase
    .from("matches")
    .select(
      "*, match_participants(*, wrestlers(*)), championships(*)"
    )
    .eq("event_id", event.id)
    .order("match_order", { ascending: true });

  const allMatches = (matches ?? []) as MatchWithParticipants[];

  // Fetch media embeds for the event
  const { data: mediaEmbeds } = await supabase
    .from("media_embeds")
    .select("*")
    .eq("target_type", "event")
    .eq("target_id", event.id)
    .order("display_order", { ascending: true });

  const embeds = (mediaEmbeds ?? []) as MediaEmbed[];

  const isPPV = eventData.shows?.show_type === "ppv";

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8 animate-fade-in">
      {/* Hero */}
      <div
        className={`mb-8 p-6 rounded-xl ${
          isPPV
            ? "main-event-badge"
            : "bg-card ring-1 ring-foreground/10"
        }`}
      >
        <div className="flex items-center gap-2 mb-2">
          {isPPV && (
            <Badge variant="default" className="text-[10px]">
              Premium Live Event
            </Badge>
          )}
          {eventData.shows?.brand && eventData.shows.brand !== "unbranded" && (
            <Badge
              variant="outline"
              className={`text-[10px] ${
                eventData.shows.brand === "raw"
                  ? "border-raw-red text-raw-red"
                  : eventData.shows.brand === "smackdown"
                  ? "border-smackdown-blue text-smackdown-blue"
                  : "border-nxt-gold text-nxt-gold"
              }`}
            >
              {eventData.shows.brand.toUpperCase()}
            </Badge>
          )}
        </div>
        <h1 className="text-3xl md:text-4xl font-bold">
          {eventData.shows?.name}
        </h1>
        <p className="text-muted-foreground mt-1">
          {formatDate(eventData.date)}
        </p>
        {(eventData.venue || eventData.city) && (
          <p className="text-sm text-muted-foreground">
            {[eventData.venue, eventData.city].filter(Boolean).join(", ")}
          </p>
        )}
        {eventData.notes && (
          <p className="text-sm text-muted-foreground mt-2 italic">
            {eventData.notes}
          </p>
        )}
      </div>

      {/* Event-level media embeds */}
      {embeds.length > 0 && (
        <div className="mb-8">
          <MediaEmbedList embeds={embeds} />
        </div>
      )}

      {/* Match Card List */}
      <h2 className="text-xl font-bold mb-4">
        Match Card ({allMatches.length}{" "}
        {allMatches.length === 1 ? "match" : "matches"})
      </h2>

      {allMatches.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            No matches have been recorded for this event yet.
          </p>
        </div>
      ) : (
        <div className="space-y-4 stagger-children">
          {allMatches.map((match, index) => {
            const winners = match.match_participants?.filter(
              (p) => p.is_winner
            );
            const losers = match.match_participants?.filter(
              (p) => !p.is_winner
            );
            const isMainEvent = match.is_main_event;
            const isTitleMatch = !!match.championship_id;

            return (
              <Card
                key={match.id}
                className={isMainEvent ? "main-event-badge" : ""}
              >
                <CardHeader>
                  <div className="flex items-center flex-wrap gap-2">
                    <span className="text-xs text-muted-foreground font-mono">
                      #{match.match_order}
                    </span>
                    <Badge variant="secondary" className="text-[10px]">
                      {match.match_type}
                    </Badge>
                    {match.stipulation && (
                      <Badge variant="outline" className="text-[10px]">
                        {match.stipulation}
                      </Badge>
                    )}
                    {isTitleMatch && match.championships && (
                      <Badge
                        variant="default"
                        className="text-[10px] bg-gold text-black"
                      >
                        {match.championships.name}
                      </Badge>
                    )}
                    {isMainEvent && (
                      <Badge
                        variant="default"
                        className="text-[10px] bg-gold/20 text-gold border border-gold/30"
                      >
                        Main Event
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Participants */}
                  <div className="space-y-2">
                    {/* Winners */}
                    {winners && winners.length > 0 && (
                      <div className="winner-highlight rounded-md px-3 py-2">
                        <div className="flex items-center gap-2">
                          <span className="text-green-500 text-sm">&#10003;</span>
                          <div className="flex flex-wrap gap-2">
                            {winners.map((p) => (
                              <span
                                key={p.id}
                                className="font-semibold text-sm"
                              >
                                {p.wrestlers?.name}
                              </span>
                            ))}
                          </div>
                          <Badge
                            variant="outline"
                            className="text-[10px] text-green-500 border-green-500/30 ml-auto"
                          >
                            Winner
                          </Badge>
                        </div>
                      </div>
                    )}

                    {/* Losers */}
                    {losers && losers.length > 0 && (
                      <div className="px-3 py-2">
                        <div className="flex flex-wrap gap-2">
                          {losers.map((p) => (
                            <span
                              key={p.id}
                              className="text-sm text-muted-foreground"
                            >
                              {p.wrestlers?.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* No winner case */}
                    {(!winners || winners.length === 0) &&
                      match.match_participants &&
                      match.match_participants.length > 0 && (
                        <div className="px-3 py-2">
                          <div className="flex flex-wrap gap-2">
                            {match.match_participants.map((p) => (
                              <span
                                key={p.id}
                                className="text-sm text-muted-foreground"
                              >
                                {p.wrestlers?.name}
                              </span>
                            ))}
                          </div>
                          <Badge
                            variant="outline"
                            className="text-[10px] mt-1"
                          >
                            No Contest
                          </Badge>
                        </div>
                      )}
                  </div>

                  {/* Meta info */}
                  <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                    {match.duration_seconds != null &&
                      match.duration_seconds > 0 && (
                        <span>{formatDuration(match.duration_seconds)}</span>
                      )}
                    {match.rating != null && (
                      <span className="text-gold">
                        {renderStars(match.rating)}
                      </span>
                    )}
                  </div>

                  {match.notes && (
                    <p className="text-xs text-muted-foreground italic mt-2">
                      {match.notes}
                    </p>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
