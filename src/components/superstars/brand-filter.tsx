"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const BRANDS = [
  { value: "all", label: "All" },
  { value: "raw", label: "Raw" },
  { value: "smackdown", label: "SmackDown" },
  { value: "nxt", label: "NXT" },
] as const;

export function BrandFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentBrand = searchParams.get("brand") ?? "all";

  function handleBrandChange(value: string | number) {
    const brand = String(value);
    const params = new URLSearchParams(searchParams.toString());
    if (brand === "all") {
      params.delete("brand");
    } else {
      params.set("brand", brand);
    }
    const query = params.toString();
    router.push(query ? `?${query}` : "/superstars", { scroll: false });
  }

  return (
    <Tabs value={currentBrand} onValueChange={handleBrandChange}>
      <TabsList>
        {BRANDS.map((brand) => (
          <TabsTrigger key={brand.value} value={brand.value}>
            <span
              className={
                brand.value === "raw"
                  ? "brand-raw"
                  : brand.value === "smackdown"
                  ? "brand-smackdown"
                  : brand.value === "nxt"
                  ? "brand-nxt"
                  : ""
              }
            >
              {brand.label}
            </span>
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
