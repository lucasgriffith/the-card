"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  createChampionship,
  updateChampionship,
  startChampionshipReign,
  endChampionshipReign,
  updateDefenseCount,
} from "@/app/actions";
import type {
  Championship,
  CurrentChampion,
  Wrestler,
  Brand,
  WeightClass,
} from "@/types/database";
import { formatReignDays } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  PlusIcon,
  PencilIcon,
  CrownIcon,
  MinusCircleIcon,
  ShieldIcon,
} from "lucide-react";

const BRANDS: { value: Brand | "none"; label: string }[] = [
  { value: "none", label: "No Brand" },
  { value: "raw", label: "Raw" },
  { value: "smackdown", label: "SmackDown" },
  { value: "nxt", label: "NXT" },
  { value: "unbranded", label: "Unbranded" },
];

const WEIGHT_CLASSES: { value: WeightClass | "none"; label: string }[] = [
  { value: "none", label: "None" },
  { value: "heavyweight", label: "Heavyweight" },
  { value: "midcard", label: "Midcard" },
  { value: "tag_team", label: "Tag Team" },
  { value: "womens", label: "Women's" },
  { value: "womens_tag", label: "Women's Tag" },
];

const BRAND_COLORS: Record<string, string> = {
  raw: "bg-red-600 text-white",
  smackdown: "bg-blue-600 text-white",
  nxt: "bg-yellow-500 text-black",
  unbranded: "bg-zinc-600 text-white",
};

interface ChampionshipFormData {
  name: string;
  brand: Brand | "none";
  weight_class: WeightClass | "none";
  display_order: string;
}

interface ReignFormData {
  wrestler_id: string;
  won_date: string;
  event_won_id: string;
}

interface EndReignFormData {
  lost_date: string;
  event_lost_id: string;
}

const emptyChampionshipForm: ChampionshipFormData = {
  name: "",
  brand: "none",
  weight_class: "none",
  display_order: "0",
};

const emptyReignForm: ReignFormData = {
  wrestler_id: "",
  won_date: "",
  event_won_id: "",
};

const emptyEndReignForm: EndReignFormData = {
  lost_date: "",
  event_lost_id: "",
};

export function ChampionshipManager({
  championships,
  currentChampions,
  wrestlers,
}: {
  championships: Championship[];
  currentChampions: CurrentChampion[];
  wrestlers: Wrestler[];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Championship dialog
  const [champDialogOpen, setChampDialogOpen] = useState(false);
  const [editingChampId, setEditingChampId] = useState<string | null>(null);
  const [champForm, setChampForm] =
    useState<ChampionshipFormData>(emptyChampionshipForm);

  // Start reign dialog
  const [reignDialogOpen, setReignDialogOpen] = useState(false);
  const [reignChampionshipId, setReignChampionshipId] = useState<string | null>(
    null
  );
  const [reignForm, setReignForm] = useState<ReignFormData>(emptyReignForm);

  // End reign dialog
  const [endReignDialogOpen, setEndReignDialogOpen] = useState(false);
  const [endReignId, setEndReignId] = useState<string | null>(null);
  const [endReignForm, setEndReignForm] =
    useState<EndReignFormData>(emptyEndReignForm);

  function getChampion(championshipId: string): CurrentChampion | undefined {
    return currentChampions.find(
      (c) => c.championship_id === championshipId
    );
  }

  // Championship CRUD
  function openCreateChampionship() {
    setEditingChampId(null);
    setChampForm(emptyChampionshipForm);
    setChampDialogOpen(true);
  }

  function openEditChampionship(c: Championship) {
    setEditingChampId(c.id);
    setChampForm({
      name: c.name,
      brand: c.brand ?? "none",
      weight_class: c.weight_class ?? "none",
      display_order: c.display_order.toString(),
    });
    setChampDialogOpen(true);
  }

  function handleSaveChampionship() {
    if (!champForm.name.trim()) {
      toast.error("Name is required");
      return;
    }

    startTransition(async () => {
      try {
        const payload = {
          name: champForm.name.trim(),
          brand:
            champForm.brand === "none" ? undefined : champForm.brand,
          weight_class:
            champForm.weight_class === "none"
              ? undefined
              : champForm.weight_class,
          display_order: Number(champForm.display_order) || 0,
        };

        if (editingChampId) {
          await updateChampionship(editingChampId, payload);
          toast.success("Championship updated");
        } else {
          await createChampionship(payload);
          toast.success("Championship created");
        }

        setChampDialogOpen(false);
        router.refresh();
      } catch (err) {
        toast.error(
          err instanceof Error ? err.message : "Something went wrong"
        );
      }
    });
  }

  // Start reign
  function openStartReign(championshipId: string) {
    setReignChampionshipId(championshipId);
    setReignForm(emptyReignForm);
    setReignDialogOpen(true);
  }

  function handleStartReign() {
    if (!reignForm.wrestler_id || !reignForm.won_date || !reignChampionshipId) {
      toast.error("Wrestler and won date are required");
      return;
    }

    startTransition(async () => {
      try {
        await startChampionshipReign({
          championship_id: reignChampionshipId,
          wrestler_id: reignForm.wrestler_id,
          won_date: reignForm.won_date,
          event_won_id: reignForm.event_won_id || undefined,
        });
        toast.success("Reign started");
        setReignDialogOpen(false);
        router.refresh();
      } catch (err) {
        toast.error(
          err instanceof Error ? err.message : "Something went wrong"
        );
      }
    });
  }

  // End reign
  function openEndReign(reignId: string) {
    setEndReignId(reignId);
    setEndReignForm(emptyEndReignForm);
    setEndReignDialogOpen(true);
  }

  function handleEndReign() {
    if (!endReignForm.lost_date || !endReignId) {
      toast.error("Lost date is required");
      return;
    }

    startTransition(async () => {
      try {
        await endChampionshipReign(endReignId, {
          lost_date: endReignForm.lost_date,
          event_lost_id: endReignForm.event_lost_id || undefined,
        });
        toast.success("Reign ended");
        setEndReignDialogOpen(false);
        router.refresh();
      } catch (err) {
        toast.error(
          err instanceof Error ? err.message : "Something went wrong"
        );
      }
    });
  }

  // Inline defense count update
  function handleUpdateDefenses(reignId: string, currentCount: number, delta: number) {
    const newCount = Math.max(0, currentCount + delta);
    startTransition(async () => {
      try {
        await updateDefenseCount(reignId, newCount);
        toast.success("Defense count updated");
        router.refresh();
      } catch (err) {
        toast.error(
          err instanceof Error ? err.message : "Something went wrong"
        );
      }
    });
  }

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {championships.length} championship
          {championships.length !== 1 ? "s" : ""}
        </p>
        <Button onClick={openCreateChampionship}>
          <PlusIcon data-icon="inline-start" />
          Add Championship
        </Button>
      </div>

      <div className="rounded-xl ring-1 ring-foreground/10 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Championship</TableHead>
              <TableHead>Brand</TableHead>
              <TableHead>Weight Class</TableHead>
              <TableHead>Current Holder</TableHead>
              <TableHead>Reign</TableHead>
              <TableHead>Defenses</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {championships.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center text-muted-foreground py-8"
                >
                  No championships yet. Add your first championship.
                </TableCell>
              </TableRow>
            ) : (
              championships.map((c) => {
                const champion = getChampion(c.id);
                return (
                  <TableRow key={c.id}>
                    <TableCell className="font-medium">{c.name}</TableCell>
                    <TableCell>
                      {c.brand ? (
                        <Badge className={BRAND_COLORS[c.brand]}>
                          {c.brand.toUpperCase()}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {c.weight_class ?? "-"}
                    </TableCell>
                    <TableCell>
                      {champion ? (
                        <span className="font-medium">
                          {champion.wrestler_name}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">Vacant</span>
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {champion ? formatReignDays(champion.reign_days) : "-"}
                    </TableCell>
                    <TableCell>
                      {champion ? (
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon-xs"
                            onClick={() =>
                              handleUpdateDefenses(
                                champion.reign_id,
                                champion.defense_count,
                                -1
                              )
                            }
                            disabled={
                              isPending || champion.defense_count === 0
                            }
                          >
                            -
                          </Button>
                          <span className="min-w-[2ch] text-center">
                            {champion.defense_count}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon-xs"
                            onClick={() =>
                              handleUpdateDefenses(
                                champion.reign_id,
                                champion.defense_count,
                                1
                              )
                            }
                            disabled={isPending}
                          >
                            +
                          </Button>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        {!champion && (
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => openStartReign(c.id)}
                            title="Start new reign"
                          >
                            <CrownIcon />
                          </Button>
                        )}
                        {champion && (
                          <>
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              onClick={() =>
                                openEndReign(champion.reign_id)
                              }
                              title="End reign"
                            >
                              <MinusCircleIcon />
                            </Button>
                          </>
                        )}
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => openEditChampionship(c)}
                        >
                          <PencilIcon />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Add/Edit Championship Dialog */}
      <Dialog open={champDialogOpen} onOpenChange={setChampDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingChampId ? "Edit Championship" : "Add Championship"}
            </DialogTitle>
          </DialogHeader>

          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="champ_name">Name *</Label>
              <Input
                id="champ_name"
                value={champForm.name}
                onChange={(e) =>
                  setChampForm({ ...champForm, name: e.target.value })
                }
                placeholder="e.g. WWE Championship"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="champ_brand">Brand</Label>
              <Select
                value={champForm.brand}
                onValueChange={(val) =>
                  setChampForm({
                    ...champForm,
                    brand: val as Brand | "none",
                  })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {BRANDS.map((b) => (
                    <SelectItem key={b.value} value={b.value}>
                      {b.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="champ_weight_class">Weight Class</Label>
              <Select
                value={champForm.weight_class}
                onValueChange={(val) =>
                  setChampForm({
                    ...champForm,
                    weight_class: val as WeightClass | "none",
                  })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {WEIGHT_CLASSES.map((wc) => (
                    <SelectItem key={wc.value} value={wc.value}>
                      {wc.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="display_order">Display Order</Label>
              <Input
                id="display_order"
                type="number"
                value={champForm.display_order}
                onChange={(e) =>
                  setChampForm({
                    ...champForm,
                    display_order: e.target.value,
                  })
                }
                placeholder="0"
              />
            </div>
          </div>

          <DialogFooter>
            <DialogClose render={<Button variant="outline" />}>
              Cancel
            </DialogClose>
            <Button onClick={handleSaveChampionship} disabled={isPending}>
              {isPending
                ? "Saving..."
                : editingChampId
                  ? "Update"
                  : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Start Reign Dialog */}
      <Dialog open={reignDialogOpen} onOpenChange={setReignDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Start Championship Reign</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="reign_wrestler">Wrestler *</Label>
              <Select
                value={reignForm.wrestler_id || "__none__"}
                onValueChange={(val) =>
                  setReignForm({
                    ...reignForm,
                    wrestler_id: val === "__none__" ? "" : (val as string),
                  })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a wrestler" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__none__" disabled>
                    Select a wrestler
                  </SelectItem>
                  {wrestlers.map((w) => (
                    <SelectItem key={w.id} value={w.id}>
                      {w.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="won_date">Won Date *</Label>
              <Input
                id="won_date"
                type="date"
                value={reignForm.won_date}
                onChange={(e) =>
                  setReignForm({ ...reignForm, won_date: e.target.value })
                }
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="event_won_id">Event Won ID (optional)</Label>
              <Input
                id="event_won_id"
                value={reignForm.event_won_id}
                onChange={(e) =>
                  setReignForm({
                    ...reignForm,
                    event_won_id: e.target.value,
                  })
                }
                placeholder="Event UUID"
              />
            </div>
          </div>

          <DialogFooter>
            <DialogClose render={<Button variant="outline" />}>
              Cancel
            </DialogClose>
            <Button onClick={handleStartReign} disabled={isPending}>
              {isPending ? "Starting..." : "Start Reign"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* End Reign Dialog */}
      <Dialog open={endReignDialogOpen} onOpenChange={setEndReignDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>End Championship Reign</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="lost_date">Lost Date *</Label>
              <Input
                id="lost_date"
                type="date"
                value={endReignForm.lost_date}
                onChange={(e) =>
                  setEndReignForm({
                    ...endReignForm,
                    lost_date: e.target.value,
                  })
                }
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="event_lost_id">Event Lost ID (optional)</Label>
              <Input
                id="event_lost_id"
                value={endReignForm.event_lost_id}
                onChange={(e) =>
                  setEndReignForm({
                    ...endReignForm,
                    event_lost_id: e.target.value,
                  })
                }
                placeholder="Event UUID"
              />
            </div>
          </div>

          <DialogFooter>
            <DialogClose render={<Button variant="outline" />}>
              Cancel
            </DialogClose>
            <Button onClick={handleEndReign} disabled={isPending}>
              {isPending ? "Ending..." : "End Reign"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
