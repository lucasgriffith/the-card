import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BrandFilter } from "@/components/superstars/brand-filter";
import type { Wrestler, CurrentChampion, Brand } from "@/types/database";

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

function getBrandBgColor(brand: Brand): string {
  switch (brand) {
    case "raw":
      return "bg-[#d32f2f]";
    case "smackdown":
      return "bg-[#1565c0]";
    case "nxt":
      return "bg-[#ffc107] text-black";
    default:
      return "bg-muted";
  }
}

export default async function SuperstarsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedSearchParams = await searchParams;
  const brandFilter = (resolvedSearchParams.brand as string) ?? "all";

  const supabase = await createClient();

  const [wrestlersRes, championsRes] = await Promise.all([
    supabase
      .from("wrestlers")
      .select("*")
      .eq("is_active", true)
      .order("name", { ascending: true }),
    supabase.from("current_champions").select("*"),
  ]);

  const wrestlers = (wrestlersRes.data ?? []) as Wrestler[];
  const champions = (championsRes.data ?? []) as CurrentChampion[];

  // Map wrestler_id to championship name
  const championshipMap = new Map<string, string>();
  for (const c of champions) {
    championshipMap.set(c.wrestler_id, c.championship_name);
  }

  // Filter by brand
  const filteredWrestlers =
    brandFilter === "all"
      ? wrestlers
      : wrestlers.filter((w) => w.brand === brandFilter);

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8 animate-fade-in">
      <h1 className="text-3xl font-bold mb-6">Superstars</h1>

      <div className="mb-6">
        <Suspense fallback={null}>
          <BrandFilter />
        </Suspense>
      </div>

      {filteredWrestlers.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-muted-foreground">
            No superstars found
            {brandFilter !== "all" ? ` for ${brandFilter.toUpperCase()}` : ""}.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 stagger-children">
          {filteredWrestlers.map((wrestler) => {
            const championshipName = championshipMap.get(wrestler.id);
            return (
              <Link
                key={wrestler.id}
                href={`/superstars/${wrestler.slug}`}
              >
                <Card className="card-hover card-glow-gold h-full">
                  <CardContent className="flex flex-col items-center text-center pt-2">
                    {wrestler.image_url ? (
                      <Image
                        src={wrestler.image_url}
                        alt={wrestler.name}
                        width={80}
                        height={80}
                        className="rounded-full object-cover w-20 h-20 mb-3"
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-3">
                        <span className="text-2xl font-bold text-muted-foreground">
                          {wrestler.name.charAt(0)}
                        </span>
                      </div>
                    )}
                    <p className="font-semibold text-sm">{wrestler.name}</p>
                    {wrestler.brand && wrestler.brand !== "unbranded" && (
                      <Badge
                        variant="outline"
                        className={`text-[10px] mt-1 ${getBrandColor(
                          wrestler.brand
                        )}`}
                      >
                        {wrestler.brand.toUpperCase()}
                      </Badge>
                    )}
                    {championshipName && (
                      <Badge
                        variant="default"
                        className="text-[10px] mt-2 bg-gold text-black"
                      >
                        {championshipName}
                      </Badge>
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
