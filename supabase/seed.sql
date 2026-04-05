-- ─── Shows ──────────────────────────────────────────────────────────────
INSERT INTO shows (name, short_name, slug, show_type, brand) VALUES
  ('Monday Night Raw', 'Raw', 'raw', 'weekly', 'raw'),
  ('SmackDown', 'SmackDown', 'smackdown', 'weekly', 'smackdown'),
  ('NXT', 'NXT', 'nxt', 'weekly', 'nxt'),
  ('Saturday Night''s Main Event', 'SNME', 'saturday-nights-main-event', 'special', NULL),
  ('Royal Rumble', 'Royal Rumble', 'royal-rumble', 'ppv', NULL),
  ('Elimination Chamber', 'Elimination Chamber', 'elimination-chamber', 'ppv', NULL),
  ('WrestleMania', 'WrestleMania', 'wrestlemania', 'ppv', NULL),
  ('Backlash', 'Backlash', 'backlash', 'ppv', NULL),
  ('King and Queen of the Ring', 'KOTR', 'king-and-queen-of-the-ring', 'ppv', NULL),
  ('Money in the Bank', 'MITB', 'money-in-the-bank', 'ppv', NULL),
  ('SummerSlam', 'SummerSlam', 'summerslam', 'ppv', NULL),
  ('Bash in Berlin', 'Bash in Berlin', 'bash-in-berlin', 'ppv', NULL),
  ('Bad Blood', 'Bad Blood', 'bad-blood', 'ppv', NULL),
  ('Crown Jewel', 'Crown Jewel', 'crown-jewel', 'ppv', NULL),
  ('Survivor Series', 'Survivor Series', 'survivor-series', 'ppv', NULL);

-- ─── Season 1 ───────────────────────────────────────────────────────────
INSERT INTO seasons (name, slug, start_date, end_date, is_current) VALUES
  ('Season 1 (2025-2026)', 'season-1-2025-2026', '2025-04-19', NULL, true);

-- ─── Championships ──────────────────────────────────────────────────────
INSERT INTO championships (name, slug, brand, weight_class, display_order) VALUES
  ('Undisputed WWE Championship', 'undisputed-wwe-championship', NULL, 'heavyweight', 1),
  ('World Heavyweight Championship', 'world-heavyweight-championship', 'raw', 'heavyweight', 2),
  ('WWE Women''s Championship', 'wwe-womens-championship', 'raw', 'womens', 3),
  ('Women''s World Championship', 'womens-world-championship', 'smackdown', 'womens', 4),
  ('Intercontinental Championship', 'intercontinental-championship', NULL, 'midcard', 5),
  ('United States Championship', 'united-states-championship', NULL, 'midcard', 6),
  ('WWE Tag Team Championship', 'wwe-tag-team-championship', NULL, 'tag_team', 7),
  ('World Tag Team Championship', 'world-tag-team-championship', NULL, 'tag_team', 8),
  ('WWE Women''s Tag Team Championship', 'wwe-womens-tag-team-championship', NULL, 'womens_tag', 9),
  ('WWE Speed Championship', 'wwe-speed-championship', NULL, 'midcard', 10);
