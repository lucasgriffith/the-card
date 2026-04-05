"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import {
  createMatch,
  deleteMatch,
  addMatchParticipant,
  removeMatchParticipant,
  setMatchWinner,
} from "@/app/actions";
import type {
  Event,
  Show,
  MatchWithParticipants,
  Wrestler,
  Championship,
} from "@/types/database";
import { formatShortDate } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  TrashIcon,
  TrophyIcon,
  UserPlusIcon,
  ArrowLeftIcon,
} from "lucide-react";

interface MatchFormData {
  match_type: string;
  stipulation: string;
  championship_id: string;
  is_main_event: boolean;
}

interface ParticipantFormData {
  wrestler_id: string;
  team_number: string;
  is_winner: boolean;
}

const emptyMatchForm: MatchFormData = {
  match_type: "",
  stipulation: "",
  championship_id: "",
  is_main_event: false,
};

const emptyParticipantForm: ParticipantFormData = {
  wrestler_id: "",
  team_number: "",
  is_winner: false,
};

export function MatchCardEditor({
  event,
  matches,
  wrestlers,
  championships,
}: {
  event: Event & { shows: Show };
  matches: MatchWithParticipants[];
  wrestlers: Wrestler[];
  championships: Championship[];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [matchDialogOpen, setMatchDialogOpen] = useState(false);
  const [participantDialogOpen, setParticipantDialogOpen] = useState(false);
  const [activeMatchId, setActiveMatchId] = useState<string | null>(null);
  const [matchForm, setMatchForm] = useState<MatchFormData>(emptyMatchForm);
  const [participantForm, setParticipantForm] =
    useState<ParticipantFormData>(emptyParticipantForm);

  function openAddMatch() {
    setMatchForm(emptyMatchForm);
    setMatchDialogOpen(true);
  }

  function openAddParticipant(matchId: string) {
    setActiveMatchId(matchId);
    setParticipantForm(emptyParticipantForm);
    setParticipantDialogOpen(true);
  }

  function handleCreateMatch() {
    if (!matchForm.match_type.trim()) {
      toast.error("Match type is required");
      return;
    }

    startTransition(async () => {
      try {
        await createMatch({
          event_id: event.id,
          match_order: matches.length + 1,
          match_type: matchForm.match_type.trim(),
          stipulation: matchForm.stipulation.trim() || undefined,
          championship_id: matchForm.championship_id || undefined,
          is_main_event: matchForm.is_main_event,
        });
        toast.success("Match added");
        setMatchDialogOpen(false);
        router.refresh();
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Something went wrong");
      }
    });
  }

  function handleDeleteMatch(matchId: string) {
    if (!confirm("Delete this match? This cannot be undone.")) return;

    startTransition(async () => {
      try {
        await deleteMatch(matchId);
        toast.success("Match deleted");
        router.refresh();
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Something went wrong");
      }
    });
  }

  function handleAddParticipant() {
    if (!participantForm.wrestler_id || !activeMatchId) {
      toast.error("Select a wrestler");
      return;
    }

    startTransition(async () => {
      try {
        await addMatchParticipant({
          match_id: activeMatchId,
          wrestler_id: participantForm.wrestler_id,
          team_number: participantForm.team_number
            ? Number(participantForm.team_number)
            : undefined,
          is_winner: participantForm.is_winner,
        });
        toast.success("Participant added");
        setParticipantDialogOpen(false);
        router.refresh();
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Something went wrong");
      }
    });
  }

  function handleRemoveParticipant(participantId: string) {
    startTransition(async () => {
      try {
        await removeMatchParticipant(participantId);
        toast.success("Participant removed");
        router.refresh();
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Something went wrong");
      }
    });
  }

  function handleSetWinner(matchId: string, wrestlerId: string) {
    startTransition(async () => {
      try {
        await setMatchWinner(matchId, wrestlerId);
        toast.success("Winner set");
        router.refresh();
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Something went wrong");
      }
    });
  }

  return (
    <>
      {/* Event info header */}
      <div className="mb-6">
        <Link
          href="/admin/events"
          className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeftIcon className="size-4" />
          Back to Events
        </Link>
        <Card>
          <CardHeader>
            <CardTitle>{event.shows.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <span>{formatShortDate(event.date)}</span>
              {event.venue && <span>{event.venue}</span>}
              {event.city && <span>{event.city}</span>}
              {event.is_upcoming && (
                <Badge className="bg-amber-600 text-white">Upcoming</Badge>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Matches list */}
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {matches.length} match{matches.length !== 1 ? "es" : ""}
        </p>
        <Button onClick={openAddMatch}>
          <PlusIcon data-icon="inline-start" />
          Add Match
        </Button>
      </div>

      <div className="space-y-4">
        {matches.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              No matches yet. Add the first match to this card.
            </CardContent>
          </Card>
        ) : (
          matches.map((match) => (
            <Card key={match.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">#{match.match_order}</Badge>
                    <CardTitle className="text-base">
                      {match.match_type}
                    </CardTitle>
                    {match.is_main_event && (
                      <Badge className="bg-amber-600 text-white">
                        Main Event
                      </Badge>
                    )}
                    {match.stipulation && (
                      <Badge variant="secondary">{match.stipulation}</Badge>
                    )}
                    {match.championships && (
                      <Badge variant="outline">
                        {match.championships.name}
                      </Badge>
                    )}
                  </div>
                  <Button
                    variant="destructive"
                    size="icon-sm"
                    onClick={() => handleDeleteMatch(match.id)}
                    disabled={isPending}
                  >
                    <TrashIcon />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {match.match_participants.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      No participants added yet.
                    </p>
                  ) : (
                    match.match_participants.map((p) => (
                      <div
                        key={p.id}
                        className={`flex items-center justify-between rounded-lg px-3 py-2 ${
                          p.is_winner
                            ? "bg-green-500/10 ring-1 ring-green-500/30"
                            : "bg-muted/50"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-medium">
                            {p.wrestlers.name}
                          </span>
                          {p.team_number != null && (
                            <Badge variant="outline" className="text-xs">
                              Team {p.team_number}
                            </Badge>
                          )}
                          {p.is_winner && (
                            <Badge className="bg-green-600 text-white">
                              Winner
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-1">
                          {!p.is_winner && (
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              onClick={() =>
                                handleSetWinner(match.id, p.wrestler_id)
                              }
                              disabled={isPending}
                              title="Set as winner"
                            >
                              <TrophyIcon />
                            </Button>
                          )}
                          <Button
                            variant="destructive"
                            size="icon-sm"
                            onClick={() => handleRemoveParticipant(p.id)}
                            disabled={isPending}
                            title="Remove participant"
                          >
                            <TrashIcon />
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openAddParticipant(match.id)}
                    className="mt-2"
                  >
                    <UserPlusIcon data-icon="inline-start" />
                    Add Participant
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Add Match Dialog */}
      <Dialog open={matchDialogOpen} onOpenChange={setMatchDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Match</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="match_type">Match Type *</Label>
              <Input
                id="match_type"
                value={matchForm.match_type}
                onChange={(e) =>
                  setMatchForm({ ...matchForm, match_type: e.target.value })
                }
                placeholder="e.g. Singles, Tag Team, Triple Threat"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="stipulation">Stipulation</Label>
              <Input
                id="stipulation"
                value={matchForm.stipulation}
                onChange={(e) =>
                  setMatchForm({ ...matchForm, stipulation: e.target.value })
                }
                placeholder="e.g. No DQ, Steel Cage"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="championship_id">Championship (optional)</Label>
              <Select
                value={matchForm.championship_id || "__none__"}
                onValueChange={(val) =>
                  setMatchForm({
                    ...matchForm,
                    championship_id: val === "__none__" ? "" : (val as string),
                  })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="None" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__none__">None</SelectItem>
                  {championships.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <input
                id="is_main_event"
                type="checkbox"
                checked={matchForm.is_main_event}
                onChange={(e) =>
                  setMatchForm({
                    ...matchForm,
                    is_main_event: e.target.checked,
                  })
                }
                className="h-4 w-4 rounded border-input"
              />
              <Label htmlFor="is_main_event">Main Event</Label>
            </div>
          </div>

          <DialogFooter>
            <DialogClose render={<Button variant="outline" />}>
              Cancel
            </DialogClose>
            <Button onClick={handleCreateMatch} disabled={isPending}>
              {isPending ? "Adding..." : "Add Match"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Participant Dialog */}
      <Dialog
        open={participantDialogOpen}
        onOpenChange={setParticipantDialogOpen}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Participant</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="wrestler_id">Wrestler *</Label>
              <Select
                value={participantForm.wrestler_id || "__none__"}
                onValueChange={(val) =>
                  setParticipantForm({
                    ...participantForm,
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
              <Label htmlFor="team_number">Team Number (optional)</Label>
              <Input
                id="team_number"
                type="number"
                value={participantForm.team_number}
                onChange={(e) =>
                  setParticipantForm({
                    ...participantForm,
                    team_number: e.target.value,
                  })
                }
                placeholder="e.g. 1, 2"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                id="is_winner_participant"
                type="checkbox"
                checked={participantForm.is_winner}
                onChange={(e) =>
                  setParticipantForm({
                    ...participantForm,
                    is_winner: e.target.checked,
                  })
                }
                className="h-4 w-4 rounded border-input"
              />
              <Label htmlFor="is_winner_participant">Is Winner</Label>
            </div>
          </div>

          <DialogFooter>
            <DialogClose render={<Button variant="outline" />}>
              Cancel
            </DialogClose>
            <Button onClick={handleAddParticipant} disabled={isPending}>
              {isPending ? "Adding..." : "Add Participant"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
