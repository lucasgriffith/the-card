import { notFound } from "next/navigation";
import Image from "next/image";
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
import {
  formatDate,
  formatShortDate,
  formatReignDays,
  formatRecord,
  formatWinPct,
} from "@/lib/format";
import { MediaEmbedList } from "@/components/media/media-embed-list";
import type {
  Wrestler,
  ChampionshipReignWithDetails,
  WrestlerSeasonStats,
  MediaEmbed,
  Brand,
} from "@/types/database";

function getBrandColor(brand: Brand): string {
  switch (brand) {
    case "raw":
      return "border-raw-red text-raw-red";
    case "smackdown":
      return "border-smackdown-blue text-smackdown-blue";
    case "nxt":
      return "border-nxt-gold text-nxt-gold";
    default:
      return "";
  }
}

export default async function WrestlerProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  // Fetch wrestler
  const { data: wrestler, error } = await supabase
    .from("wrestlers")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !wrestler) {
    notFound();
  }

  const w = wrestler as Wrestler;

  // Fetch match history (last 20), championship reigns, season stats, media embeds in parallel
  const [matchesRes, reignsRes, statsRes, mediaRes] = await Promise.all([
    supabase
      .from("match_participants")
      .select(
        "*, matches(*, events(*, shows(*)), championships(*)), wrestlers(*)"
      )
      .eq("wrestler_id", w.id)
      .order("created_at", { ascending: false })
      .limit(20),
    supabase
      .from("championship_reigns")
      .select("*, wrestlers(*), championships(*)")
      .eq("wrestler_id", w.id)
      .order("won_date", { ascending: false }),
    supabase
      .from("wrestler_season_stats")
      .select("*")
      .eq("wrestler_id", w.id)
      .order("season_name", { ascending: false }),
    supabase
      .from("media_embeds")
      .select("*")
      .eq("target_type", "wrestler")
      .eq("target_id", w.id)
      .order("display_order", { ascending: true }),
  ]);

  const matchParticipations = matchesRes.data ?? [];
  const reigns = (reignsRes.data ?? []) as (ChampionshipReignWithDetails & {
    championships: { name: string; slug: string };
  })[];
  const seasonStats = (statsRes.data ?? []) as WrestlerSeasonStats[];
  const mediaEmbeds = (mediaRes.data ?? []) as MediaEmbed[];

  // Get current season stats
  const currentStats = seasonStats.length > 0 ? seasonStats[0] : null;

  // Build match history with opponents
  const matchHistory = matchParticipations
    .filter((mp: any) => mp.matches)
    .map((mp: any) => {
      const match = mp.matches;
      const event = match.events;
      const show = event?.shows;
      return {
        id: mp.id,
        date: event?.date ?? "",
        eventName: show?.short_name ?? show?.name ?? "Unknown",
        eventSlug: event?.slug ?? "",
        matchType: match.match_type,
        isWinner: mp.is_winner,
      };
    });

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8 animate-fade-in">
      {/* Hero */}
      <div className="flex flex-col md:flex-row gap-6 mb-8">
        {/* Image */}
        <div className="flex-shrink-0">
          {w.image_url ? (
            <Image
              src={w.image_url}
              alt={w.name}
              width={200}
              height={200}
              className="rounded-xl object-cover w-48 h-48 ring-2 ring-gold/20"
            />
          ) : (
            <div className="w-48 h-48 rounded-xl bg-muted flex items-center justify-center ring-2 ring-gold/20">
              <span className="text-5xl font-bold text-muted-foreground">
                {w.name.charAt(0)}
              </span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1">
          <h1 className="text-3xl md:text-4xl font-bold">{w.name}</h1>
          {w.brand && w.brand !== "unbranded" && (
            <Badge
              variant="outline"
              className={`mt-2 ${getBrandColor(w.brand)}`}
            >
              {w.brand.toUpperCase()}
            </Badge>
          )}

          <div className="grid grid-cols-2 gap-3 mt-4 text-sm">
            {w.hometown && (
              <div>
                <span className="text-muted-foreground">Hometown</span>
                <p className="font-medium">{w.hometown}</p>
              </div>
            )}
            {w.height && (
              <div>
                <span className="text-muted-foreground">Height</span>
                <p className="font-medium">{w.height}</p>
              </div>
            )}
            {w.weight && (
              <div>
                <span className="text-muted-foreground">Weight</span>
                <p className="font-medium">{w.weight} lbs</p>
              </div>
            )}
            {w.finisher && (
              <div>
                <span className="text-muted-foreground">Finisher</span>
                <p className="font-medium">{w.finisher}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      {currentStats && (
        <div className="grid grid-cols-3 gap-4 mb-8">
          <Card className="card-glow-gold">
            <CardContent className="text-center pt-2">
              <p className="text-2xl font-bold">
                {formatRecord(currentStats.wins, currentStats.losses)}
              </p>
              <p className="text-xs text-muted-foreground">W-L Record</p>
            </CardContent>
          </Card>
          <Card className="card-glow-gold">
            <CardContent className="text-center pt-2">
              <p className="text-2xl font-bold">
                {formatWinPct(currentStats.wins, currentStats.total_matches)}
              </p>
              <p className="text-xs text-muted-foreground">Win %</p>
            </CardContent>
          </Card>
          <Card className="card-glow-gold">
            <CardContent className="text-center pt-2">
              <p className="text-2xl font-bold">{currentStats.total_matches}</p>
              <p className="text-xs text-muted-foreground">Total Matches</p>
            </CardContent>
          </Card>
        </div>
      )}

      <Separator className="my-8" />

      {/* Championship History */}
      {reigns.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-bold mb-4">Championship History</h2>
          <div className="space-y-3 stagger-children">
            {reigns.map((reign) => (
              <Card key={reign.id} className="card-hover">
                <CardContent className="flex items-center justify-between py-3">
                  <div>
                    <Link
                      href={`/championships/${reign.championships?.slug}`}
                      className="font-semibold text-sm hover:text-gold transition-colors"
                    >
                      {reign.championships?.name}
                    </Link>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {formatShortDate(reign.won_date)}
                      {reign.lost_date
                        ? ` \u2013 ${formatShortDate(reign.lost_date)}`
                        : " \u2013 Present"}
                    </p>
                  </div>
                  <div className="text-right text-xs text-muted-foreground">
                    <p>
                      {reign.lost_date
                        ? `${Math.ceil(
                            (new Date(reign.lost_date).getTime() -
                              new Date(reign.won_date).getTime()) /
                              (1000 * 60 * 60 * 24)
                          )} days`
                        : formatReignDays(
                            Math.ceil(
                              (Date.now() -
                                new Date(reign.won_date).getTime()) /
                                (1000 * 60 * 60 * 24)
                            )
                          )}
                    </p>
                    <p>
                      {reign.defense_count}{" "}
                      {reign.defense_count === 1 ? "defense" : "defenses"}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      <Separator className="my-8" />

      {/* Recent Matches */}
      {matchHistory.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-bold mb-4">Recent Matches</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Event</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Result</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {matchHistory.map((match) => (
                <TableRow key={match.id} className="table-row-hover">
                  <TableCell className="text-muted-foreground text-xs">
                    {match.date ? formatShortDate(match.date) : "\u2014"}
                  </TableCell>
                  <TableCell>
                    {match.eventSlug ? (
                      <Link
                        href={`/results/${match.eventSlug}`}
                        className="hover:text-gold transition-colors"
                      >
                        {match.eventName}
                      </Link>
                    ) : (
                      match.eventName
                    )}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-xs">
                    {match.matchType}
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge
                      variant={match.isWinner ? "default" : "secondary"}
                      className={`text-[10px] ${
                        match.isWinner
                          ? "bg-green-500/20 text-green-500 border border-green-500/30"
                          : "text-muted-foreground"
                      }`}
                    >
                      {match.isWinner ? "W" : "L"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </section>
      )}

      {/* Media Embeds */}
      {mediaEmbeds.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-bold mb-4">Media</h2>
          <MediaEmbedList embeds={mediaEmbeds} />
        </section>
      )}

      {/* Empty state if no content at all */}
      {!currentStats &&
        reigns.length === 0 &&
        matchHistory.length === 0 &&
        mediaEmbeds.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              No additional data available for this superstar yet.
            </p>
          </div>
        )}
    </div>
  );
}
