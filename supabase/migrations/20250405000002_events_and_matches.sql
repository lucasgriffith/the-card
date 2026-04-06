-- Events (specific instances of a show)
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  show_id UUID NOT NULL REFERENCES shows(id),
  season_id UUID NOT NULL REFERENCES seasons(id),
  slug TEXT NOT NULL UNIQUE,
  date DATE NOT NULL,
  venue TEXT,
  city TEXT,
  notes TEXT,
  is_upcoming BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_events_show ON events(show_id);
CREATE INDEX idx_events_season ON events(season_id);
CREATE INDEX idx_events_date ON events(date DESC);
CREATE INDEX idx_events_upcoming ON events(is_upcoming) WHERE is_upcoming = true;

-- Matches
CREATE TABLE matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  match_order INTEGER NOT NULL,
  match_type TEXT NOT NULL,
  stipulation TEXT,
  championship_id UUID REFERENCES championships(id),
  duration_seconds INTEGER,
  rating NUMERIC(3,2),
  is_main_event BOOLEAN NOT NULL DEFAULT false,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_matches_event ON matches(event_id);
CREATE INDEX idx_matches_championship ON matches(championship_id);

-- Match Participants
CREATE TABLE match_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id UUID NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
  wrestler_id UUID NOT NULL REFERENCES wrestlers(id),
  team_number INTEGER,
  is_winner BOOLEAN NOT NULL DEFAULT false,
  entry_number INTEGER,
  eliminated_by UUID REFERENCES wrestlers(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_match_participants_match ON match_participants(match_id);
CREATE INDEX idx_match_participants_wrestler ON match_participants(wrestler_id);
CREATE UNIQUE INDEX idx_match_participants_unique ON match_participants(match_id, wrestler_id);

-- Championship Reigns
CREATE TABLE championship_reigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  championship_id UUID NOT NULL REFERENCES championships(id),
  wrestler_id UUID NOT NULL REFERENCES wrestlers(id),
  won_date DATE NOT NULL,
  lost_date DATE,
  event_won_id UUID REFERENCES events(id),
  event_lost_id UUID REFERENCES events(id),
  reign_number INTEGER,
  defense_count INTEGER NOT NULL DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_reigns_championship ON championship_reigns(championship_id);
CREATE INDEX idx_reigns_wrestler ON championship_reigns(wrestler_id);
CREATE INDEX idx_reigns_current ON championship_reigns(lost_date) WHERE lost_date IS NULL;
