"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createSeason, updateSeason, setCurrentSeason } from "@/app/actions";
import type { Season } from "@/types/database";
import { formatShortDate } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
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
import { PlusIcon, PencilIcon, StarIcon } from "lucide-react";

interface SeasonFormData {
  name: string;
  start_date: string;
  end_date: string;
}

const emptyForm: SeasonFormData = {
  name: "",
  start_date: "",
  end_date: "",
};

export function SeasonManager({ seasons }: { seasons: Season[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<SeasonFormData>(emptyForm);

  function openCreate() {
    setEditingId(null);
    setForm(emptyForm);
    setDialogOpen(true);
  }

  function openEdit(s: Season) {
    setEditingId(s.id);
    setForm({
      name: s.name,
      start_date: s.start_date,
      end_date: s.end_date ?? "",
    });
    setDialogOpen(true);
  }

  function handleSave() {
    if (!form.name.trim() || !form.start_date) {
      toast.error("Name and start date are required");
      return;
    }

    startTransition(async () => {
      try {
        const payload = {
          name: form.name.trim(),
          start_date: form.start_date,
          end_date: form.end_date || undefined,
        };

        if (editingId) {
          await updateSeason(editingId, payload);
          toast.success("Season updated");
        } else {
          await createSeason(payload);
          toast.success("Season created");
        }

        setDialogOpen(false);
        router.refresh();
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Something went wrong");
      }
    });
  }

  function handleSetCurrent(id: string) {
    startTransition(async () => {
      try {
        await setCurrentSeason(id);
        toast.success("Current season updated");
        router.refresh();
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Something went wrong");
      }
    });
  }

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {seasons.length} season{seasons.length !== 1 ? "s" : ""}
        </p>
        <Button onClick={openCreate}>
          <PlusIcon data-icon="inline-start" />
          Add Season
        </Button>
      </div>

      <div className="rounded-xl ring-1 ring-foreground/10 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>End Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {seasons.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                  No seasons yet. Add your first season.
                </TableCell>
              </TableRow>
            ) : (
              seasons.map((s) => (
                <TableRow key={s.id}>
                  <TableCell className="font-medium">{s.name}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatShortDate(s.start_date)}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {s.end_date ? formatShortDate(s.end_date) : "-"}
                  </TableCell>
                  <TableCell>
                    {s.is_current ? (
                      <Badge className="bg-green-600 text-white">Current</Badge>
                    ) : (
                      <Badge variant="secondary">Inactive</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      {!s.is_current && (
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => handleSetCurrent(s.id)}
                          disabled={isPending}
                          title="Set as current season"
                        >
                          <StarIcon />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => openEdit(s)}
                      >
                        <PencilIcon />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingId ? "Edit Season" : "Add Season"}
            </DialogTitle>
          </DialogHeader>

          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Season 1"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="start_date">Start Date *</Label>
                <Input
                  id="start_date"
                  type="date"
                  value={form.start_date}
                  onChange={(e) =>
                    setForm({ ...form, start_date: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="end_date">End Date</Label>
                <Input
                  id="end_date"
                  type="date"
                  value={form.end_date}
                  onChange={(e) =>
                    setForm({ ...form, end_date: e.target.value })
                  }
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <DialogClose render={<Button variant="outline" />}>
              Cancel
            </DialogClose>
            <Button onClick={handleSave} disabled={isPending}>
              {isPending ? "Saving..." : editingId ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
