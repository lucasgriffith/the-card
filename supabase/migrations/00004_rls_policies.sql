-- Enable RLS on all tables
ALTER TABLE seasons ENABLE ROW LEVEL SECURITY;
ALTER TABLE wrestlers ENABLE ROW LEVEL SECURITY;
ALTER TABLE shows ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE match_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE championships ENABLE ROW LEVEL SECURITY;
ALTER TABLE championship_reigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_embeds ENABLE ROW LEVEL SECURITY;

-- Public read for all tables
CREATE POLICY "Public read" ON seasons FOR SELECT USING (true);
CREATE POLICY "Public read" ON wrestlers FOR SELECT USING (true);
CREATE POLICY "Public read" ON shows FOR SELECT USING (true);
CREATE POLICY "Public read" ON events FOR SELECT USING (true);
CREATE POLICY "Public read" ON matches FOR SELECT USING (true);
CREATE POLICY "Public read" ON match_participants FOR SELECT USING (true);
CREATE POLICY "Public read" ON championships FOR SELECT USING (true);
CREATE POLICY "Public read" ON championship_reigns FOR SELECT USING (true);
CREATE POLICY "Public read" ON media_embeds FOR SELECT USING (true);

-- All writes go through the service_role key (admin client), which bypasses RLS.
