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
import { formatShortDate, formatReignDays } from "@/lib/format";
import type {
  Championship,
  ChampionshipReign,
  Wrestler,
  CurrentChampion,
} from "@/types/database";

export default async function ChampionshipHistoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  // Fetch championship
  const { data: championship, error } = await supabase
    .from("championships")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !championship) {
    notFound();
  }

  const champ = championship as Championship;

  // Fetch reigns with wrestler details, and current champion data
  const [reignsRes, currentChampRes] = await Promise.all([
    supabase
      .from("championship_reigns")
      .select("*, wrestlers(*)")
      .eq("championship_id", champ.id)
      .order("won_date", { ascending: false }),
    supabase
      .from("current_champions")
      .select("*")
      .eq("championship_id", champ.id)
      .single(),
  ]);

  const reigns = (reignsRes.data ?? []) as (ChampionshipReign & {
    wrestlers: Wrestler;
  })[];
  const currentChampion = currentChampRes.data as CurrentChampion | null;

  // Calculate stats
  const reignDays = reigns.map((r) => {
    if (r.lost_date) {
      return Math.ceil(
        (new Date(r.lost_date).getTime() - new Date(r.won_date).getTime()) /
          (1000 * 60 * 60 * 24)
      );
    }
    return Math.ceil(
      (Date.now() - new Date(r.won_date).getTime()) / (1000 * 60 * 60 * 24)
    );
  });

  const longestReign =
    reigns.length > 0
      ? reigns[reignDays.indexOf(Math.max(...reignDays))]
      : null;
  const longestReignDays =
    reignDays.length > 0 ? Math.max(...reignDays) : 0;

  // Count most reigns per wrestler
  const reignCountMap = new Map<string, { name: string; count: number }>();
  for (const r of reigns) {
    const existing = reignCountMap.get(r.wrestler_id);
    if (existing) {
      existing.count++;
    } else {
      reignCountMap.set(r.wrestler_id, {
        name: r.wrestlers?.name ?? "Unknown",
        count: 1,
      });
    }
  }
  const mostReigns = Array.from(reignCountMap.values()).sort(
    (a, b) => b.count - a.count
  )[0];

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8 animate-fade-in">
      <h1 className="text-3xl md:text-4xl font-bold gradient-text-gold mb-2">
        {champ.name}
      </h1>
      {champ.brand && champ.brand !== "unbranded" && (
        <Badge variant="outline" className="mb-6">
          {champ.brand.toUpperCase()}
        </Badge>
      )}

      {/* Current Champion Highlight */}
      {currentChampion && (
        <Card className="card-glow-gold mb-8">
          <CardHeader>
            <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">
              Current Champion
            </p>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              {currentChampion.wrestler_image ? (
                <Image
                  src={currentChampion.wrestler_image}
                  alt={currentChampion.wrestler_name}
                  width={64}
                  height={64}
                  className="rounded-full object-cover w-16 h-16 ring-2 ring-gold/30"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center ring-2 ring-gold/30">
                  <span className="text-2xl font-bold text-muted-foreground">
                    {currentChampion.wrestler_name.charAt(0)}
                  </span>
                </div>
              )}
              <div>
                <Link
                  href={`/superstars/${currentChampion.wrestler_slug}`}
                  className="font-bold text-lg hover:text-gold transition-colors"
                >
                  {currentChampion.wrestler_name}
                </Link>
                <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                  <span>{formatReignDays(currentChampion.reign_days)}</span>
                  <span className="text-border">|</span>
                  <span>
                    {currentChampion.defense_count}{" "}
                    {currentChampion.defense_count === 1
                      ? "defense"
                      : "defenses"}
                  </span>
                  <span className="text-border">|</span>
                  <span>
                    Since {formatShortDate(currentChampion.won_date)}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {!currentChampion && (
        <Card className="mb-8">
          <CardContent className="py-6 text-center">
            <p className="text-muted-foreground italic">
              This championship is currently vacant.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Stats */}
      {reigns.length > 0 && (
        <div className="grid grid-cols-2 gap-4 mb-8">
          {longestReign && (
            <Card>
              <CardContent className="text-center pt-2">
                <p className="text-sm font-semibold">
                  {longestReign.wrestlers?.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  Longest Reign ({formatReignDays(longestReignDays)})
                </p>
              </CardContent>
            </Card>
          )}
          {mostReigns && (
            <Card>
              <CardContent className="text-center pt-2">
                <p className="text-sm font-semibold">{mostReigns.name}</p>
                <p className="text-xs text-muted-foreground">
                  Most Reigns ({mostReigns.count}x)
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      <Separator className="my-8" />

      {/* Title History Table */}
      <h2 className="text-xl font-bold mb-4">Title History</h2>

      {reigns.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No title history recorded.</p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">#</TableHead>
              <TableHead>Champion</TableHead>
              <TableHead>Won</TableHead>
              <TableHead>Lost</TableHead>
              <TableHead className="text-right">Days</TableHead>
              <TableHead className="text-right">Defenses</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reigns.map((reign, index) => {
              const days = reign.lost_date
                ? Math.ceil(
                    (new Date(reign.lost_date).getTime() -
                      new Date(reign.won_date).getTime()) /
                      (1000 * 60 * 60 * 24)
                  )
                : Math.ceil(
                    (Date.now() - new Date(reign.won_date).getTime()) /
                      (1000 * 60 * 60 * 24)
                  );
              const isCurrentReign = !reign.lost_date;

              return (
                <TableRow
                  key={reign.id}
                  className={`table-row-hover ${
                    isCurrentReign ? "winner-highlight" : ""
                  }`}
                >
                  <TableCell className="font-mono text-muted-foreground">
                    {reign.reign_number ?? reigns.length - index}
                  </TableCell>
                  <TableCell>
                    <Link
                      href={`/superstars/${reign.wrestlers?.slug}`}
                      className="font-medium hover:text-gold transition-colors"
                    >
                      {reign.wrestlers?.name}
                    </Link>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-xs">
                    {formatShortDate(reign.won_date)}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-xs">
                    {reign.lost_date
                      ? formatShortDate(reign.lost_date)
                      : "Current"}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatReignDays(days)}
                  </TableCell>
                  <TableCell className="text-right">
                    {reign.defense_count}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
