"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { createEvent, updateEvent, deleteEvent } from "@/app/actions";
import type { EventWithShow, Show, Season } from "@/types/database";
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
  TrashIcon,
  ListIcon,
} from "lucide-react";

interface EventFormData {
  show_id: string;
  season_id: string;
  date: string;
  slug: string;
  venue: string;
  city: string;
  is_upcoming: boolean;
}

const emptyForm: EventFormData = {
  show_id: "",
  season_id: "",
  date: "",
  slug: "",
  venue: "",
  city: "",
  is_upcoming: false,
};

export function EventManager({
  events,
  shows,
  seasons,
}: {
  events: EventWithShow[];
  shows: Show[];
  seasons: Season[];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<EventFormData>(emptyForm);

  function openCreate() {
    setEditingId(null);
    setForm({
      ...emptyForm,
      show_id: shows[0]?.id ?? "",
      season_id: seasons.find((s) => s.is_current)?.id ?? seasons[0]?.id ?? "",
    });
    setDialogOpen(true);
  }

  function openEdit(ev: EventWithShow) {
    setEditingId(ev.id);
    setForm({
      show_id: ev.show_id,
      season_id: ev.season_id,
      date: ev.date,
      slug: ev.slug,
      venue: ev.venue ?? "",
      city: ev.city ?? "",
      is_upcoming: ev.is_upcoming,
    });
    setDialogOpen(true);
  }

  function handleSave() {
    if (!form.show_id || !form.season_id || !form.date || !form.slug.trim()) {
      toast.error("Show, season, date, and slug are required");
      return;
    }

    startTransition(async () => {
      try {
        const payload = {
          show_id: form.show_id,
          season_id: form.season_id,
          date: form.date,
          slug: form.slug.trim(),
          venue: form.venue.trim() || undefined,
          city: form.city.trim() || undefined,
          is_upcoming: form.is_upcoming,
        };

        if (editingId) {
          await updateEvent(editingId, payload);
          toast.success("Event updated");
        } else {
          await createEvent(payload);
          toast.success("Event created");
        }

        setDialogOpen(false);
        router.refresh();
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Something went wrong");
      }
    });
  }

  function handleDelete(id: string) {
    if (!confirm("Delete this event? This cannot be undone.")) return;

    startTransition(async () => {
      try {
        await deleteEvent(id);
        toast.success("Event deleted");
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
          {events.length} event{events.length !== 1 ? "s" : ""}
        </p>
        <Button onClick={openCreate}>
          <PlusIcon data-icon="inline-start" />
          Add Event
        </Button>
      </div>

      <div className="rounded-xl ring-1 ring-foreground/10 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Show</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Venue</TableHead>
              <TableHead>City</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {events.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                  No events yet. Add your first event.
                </TableCell>
              </TableRow>
            ) : (
              events.map((ev) => (
                <TableRow key={ev.id}>
                  <TableCell className="font-medium">
                    {ev.shows?.name ?? "Unknown Show"}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatShortDate(ev.date)}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {ev.venue ?? "-"}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {ev.city ?? "-"}
                  </TableCell>
                  <TableCell>
                    {ev.is_upcoming ? (
                      <Badge className="bg-amber-600 text-white">
                        Upcoming
                      </Badge>
                    ) : (
                      <Badge variant="secondary">Past</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        render={
                          <Link href={`/admin/events/${ev.id}/matches`} />
                        }
                        title="Manage matches"
                      >
                        <ListIcon />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => openEdit(ev)}
                      >
                        <PencilIcon />
                      </Button>
                      <Button
                        variant="destructive"
                        size="icon-sm"
                        onClick={() => handleDelete(ev.id)}
                        disabled={isPending}
                      >
                        <TrashIcon />
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
              {editingId ? "Edit Event" : "Add Event"}
            </DialogTitle>
          </DialogHeader>

          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="show_id">Show *</Label>
              <Select
                value={form.show_id}
                onValueChange={(val) =>
                  setForm({ ...form, show_id: val as string })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a show" />
                </SelectTrigger>
                <SelectContent>
                  {shows.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="season_id">Season *</Label>
              <Select
                value={form.season_id}
                onValueChange={(val) =>
                  setForm({ ...form, season_id: val as string })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a season" />
                </SelectTrigger>
                <SelectContent>
                  {seasons.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.name}
                      {s.is_current ? " (Current)" : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="date">Date *</Label>
                <Input
                  id="date"
                  type="date"
                  value={form.date}
                  onChange={(e) =>
                    setForm({ ...form, date: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="slug">Slug *</Label>
                <Input
                  id="slug"
                  value={form.slug}
                  onChange={(e) =>
                    setForm({ ...form, slug: e.target.value })
                  }
                  placeholder="e.g. raw-2024-01-15"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="venue">Venue</Label>
                <Input
                  id="venue"
                  value={form.venue}
                  onChange={(e) =>
                    setForm({ ...form, venue: e.target.value })
                  }
                  placeholder="e.g. Madison Square Garden"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={form.city}
                  onChange={(e) =>
                    setForm({ ...form, city: e.target.value })
                  }
                  placeholder="e.g. New York, NY"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                id="is_upcoming"
                type="checkbox"
                checked={form.is_upcoming}
                onChange={(e) =>
                  setForm({ ...form, is_upcoming: e.target.checked })
                }
                className="h-4 w-4 rounded border-input"
              />
              <Label htmlFor="is_upcoming">Mark as upcoming</Label>
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
