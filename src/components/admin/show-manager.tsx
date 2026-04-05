"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createShow, updateShow } from "@/app/actions";
import type { Show, ShowType, Brand } from "@/types/database";
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
import { PlusIcon, PencilIcon } from "lucide-react";

const SHOW_TYPES: { value: ShowType; label: string }[] = [
  { value: "weekly", label: "Weekly" },
  { value: "ppv", label: "PPV" },
  { value: "special", label: "Special" },
];

const BRANDS: { value: Brand | "none"; label: string }[] = [
  { value: "none", label: "No Brand" },
  { value: "raw", label: "Raw" },
  { value: "smackdown", label: "SmackDown" },
  { value: "nxt", label: "NXT" },
  { value: "unbranded", label: "Unbranded" },
];

const BRAND_COLORS: Record<string, string> = {
  raw: "bg-red-600 text-white",
  smackdown: "bg-blue-600 text-white",
  nxt: "bg-yellow-500 text-black",
  unbranded: "bg-zinc-600 text-white",
};

interface ShowFormData {
  name: string;
  short_name: string;
  show_type: ShowType;
  brand: Brand | "none";
}

const emptyForm: ShowFormData = {
  name: "",
  short_name: "",
  show_type: "weekly",
  brand: "none",
};

export function ShowManager({ shows }: { shows: Show[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ShowFormData>(emptyForm);

  function openCreate() {
    setEditingId(null);
    setForm(emptyForm);
    setDialogOpen(true);
  }

  function openEdit(s: Show) {
    setEditingId(s.id);
    setForm({
      name: s.name,
      short_name: s.short_name,
      show_type: s.show_type,
      brand: s.brand ?? "none",
    });
    setDialogOpen(true);
  }

  function handleSave() {
    if (!form.name.trim() || !form.short_name.trim()) {
      toast.error("Name and short name are required");
      return;
    }

    startTransition(async () => {
      try {
        const payload = {
          name: form.name.trim(),
          short_name: form.short_name.trim(),
          show_type: form.show_type,
          brand: form.brand === "none" ? undefined : form.brand,
        };

        if (editingId) {
          await updateShow(editingId, payload);
          toast.success("Show updated");
        } else {
          await createShow(payload);
          toast.success("Show created");
        }

        setDialogOpen(false);
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
          {shows.length} show{shows.length !== 1 ? "s" : ""}
        </p>
        <Button onClick={openCreate}>
          <PlusIcon data-icon="inline-start" />
          Add Show
        </Button>
      </div>

      <div className="rounded-xl ring-1 ring-foreground/10 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Short Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Brand</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {shows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                  No shows yet. Add your first show.
                </TableCell>
              </TableRow>
            ) : (
              shows.map((s) => (
                <TableRow key={s.id}>
                  <TableCell className="font-medium">{s.name}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {s.short_name}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{s.show_type.toUpperCase()}</Badge>
                  </TableCell>
                  <TableCell>
                    {s.brand ? (
                      <Badge className={BRAND_COLORS[s.brand]}>
                        {s.brand.toUpperCase()}
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant={s.is_active ? "default" : "secondary"}>
                      {s.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => openEdit(s)}
                    >
                      <PencilIcon />
                    </Button>
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
            <DialogTitle>{editingId ? "Edit Show" : "Add Show"}</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Monday Night Raw"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="short_name">Short Name *</Label>
              <Input
                id="short_name"
                value={form.short_name}
                onChange={(e) =>
                  setForm({ ...form, short_name: e.target.value })
                }
                placeholder="e.g. RAW"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="show_type">Show Type</Label>
              <Select
                value={form.show_type}
                onValueChange={(val) =>
                  setForm({ ...form, show_type: val as ShowType })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SHOW_TYPES.map((t) => (
                    <SelectItem key={t.value} value={t.value}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="brand">Brand</Label>
              <Select
                value={form.brand}
                onValueChange={(val) =>
                  setForm({ ...form, brand: val as Brand | "none" })
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
