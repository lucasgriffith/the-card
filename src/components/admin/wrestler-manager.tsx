"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  createWrestler,
  updateWrestler,
  deleteWrestler,
} from "@/app/actions";
import type { Wrestler, Brand } from "@/types/database";
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
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PlusIcon, PencilIcon, TrashIcon } from "lucide-react";

const BRANDS: { value: Brand; label: string }[] = [
  { value: "raw", label: "Raw" },
  { value: "smackdown", label: "SmackDown" },
  { value: "nxt", label: "NXT" },
  { value: "unbranded", label: "Unbranded" },
];

const BRAND_COLORS: Record<Brand, string> = {
  raw: "bg-red-600 text-white",
  smackdown: "bg-blue-600 text-white",
  nxt: "bg-yellow-500 text-black",
  unbranded: "bg-zinc-600 text-white",
};

interface WrestlerFormData {
  name: string;
  brand: Brand;
  image_url: string;
  height: string;
  weight: string;
  finisher: string;
  hometown: string;
}

const emptyForm: WrestlerFormData = {
  name: "",
  brand: "raw",
  image_url: "",
  height: "",
  weight: "",
  finisher: "",
  hometown: "",
};

export function WrestlerManager({ wrestlers }: { wrestlers: Wrestler[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<WrestlerFormData>(emptyForm);

  function openCreate() {
    setEditingId(null);
    setForm(emptyForm);
    setDialogOpen(true);
  }

  function openEdit(w: Wrestler) {
    setEditingId(w.id);
    setForm({
      name: w.name,
      brand: w.brand,
      image_url: w.image_url ?? "",
      height: w.height ?? "",
      weight: w.weight?.toString() ?? "",
      finisher: w.finisher ?? "",
      hometown: w.hometown ?? "",
    });
    setDialogOpen(true);
  }

  function handleSave() {
    if (!form.name.trim()) {
      toast.error("Name is required");
      return;
    }

    startTransition(async () => {
      try {
        const payload = {
          name: form.name.trim(),
          brand: form.brand,
          image_url: form.image_url.trim() || undefined,
          height: form.height.trim() || undefined,
          weight: form.weight ? Number(form.weight) : undefined,
          finisher: form.finisher.trim() || undefined,
          hometown: form.hometown.trim() || undefined,
        };

        if (editingId) {
          await updateWrestler(editingId, payload);
          toast.success("Wrestler updated");
        } else {
          await createWrestler(payload);
          toast.success("Wrestler created");
        }

        setDialogOpen(false);
        router.refresh();
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Something went wrong");
      }
    });
  }

  function handleDelete(id: string, name: string) {
    if (!confirm(`Delete ${name}? This cannot be undone.`)) return;

    startTransition(async () => {
      try {
        await deleteWrestler(id);
        toast.success("Wrestler deleted");
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
          {wrestlers.length} superstar{wrestlers.length !== 1 ? "s" : ""}
        </p>
        <Button onClick={openCreate}>
          <PlusIcon data-icon="inline-start" />
          Add Wrestler
        </Button>
      </div>

      <div className="rounded-xl ring-1 ring-foreground/10 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Brand</TableHead>
              <TableHead>Finisher</TableHead>
              <TableHead>Hometown</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {wrestlers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                  No wrestlers yet. Add your first superstar.
                </TableCell>
              </TableRow>
            ) : (
              wrestlers.map((w) => (
                <TableRow key={w.id}>
                  <TableCell className="font-medium">{w.name}</TableCell>
                  <TableCell>
                    <Badge className={BRAND_COLORS[w.brand]}>
                      {w.brand.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {w.finisher ?? "-"}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {w.hometown ?? "-"}
                  </TableCell>
                  <TableCell>
                    <Badge variant={w.is_active ? "default" : "secondary"}>
                      {w.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => openEdit(w)}
                      >
                        <PencilIcon />
                      </Button>
                      <Button
                        variant="destructive"
                        size="icon-sm"
                        onClick={() => handleDelete(w.id, w.name)}
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
              {editingId ? "Edit Wrestler" : "Add Wrestler"}
            </DialogTitle>
          </DialogHeader>

          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Roman Reigns"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="brand">Brand</Label>
              <Select
                value={form.brand}
                onValueChange={(val) =>
                  setForm({ ...form, brand: val as Brand })
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
              <Label htmlFor="image_url">Image URL</Label>
              <Input
                id="image_url"
                value={form.image_url}
                onChange={(e) =>
                  setForm({ ...form, image_url: e.target.value })
                }
                placeholder="https://..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="height">Height</Label>
                <Input
                  id="height"
                  value={form.height}
                  onChange={(e) =>
                    setForm({ ...form, height: e.target.value })
                  }
                  placeholder={`6'2"`}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="weight">Weight (lbs)</Label>
                <Input
                  id="weight"
                  type="number"
                  value={form.weight}
                  onChange={(e) =>
                    setForm({ ...form, weight: e.target.value })
                  }
                  placeholder="265"
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="finisher">Finisher</Label>
              <Input
                id="finisher"
                value={form.finisher}
                onChange={(e) =>
                  setForm({ ...form, finisher: e.target.value })
                }
                placeholder="e.g. Spear"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="hometown">Hometown</Label>
              <Input
                id="hometown"
                value={form.hometown}
                onChange={(e) =>
                  setForm({ ...form, hometown: e.target.value })
                }
                placeholder="e.g. Pensacola, FL"
              />
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
