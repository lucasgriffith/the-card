-- Media Embeds
CREATE TABLE media_embeds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  url TEXT NOT NULL,
  embed_type embed_type NOT NULL,
  target_type embed_target NOT NULL,
  target_id UUID NOT NULL,
  title TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_media_target ON media_embeds(target_type, target_id);

-- Current Champions view
CREATE OR REPLACE VIEW current_champions AS
SELECT
  cr.id AS reign_id,
  cr.championship_id,
  c.name AS championship_name,
  c.slug AS championship_slug,
  c.image_url AS championship_image,
  c.brand AS championship_brand,
  c.weight_class,
  cr.wrestler_id,
  w.name AS wrestler_name,
  w.slug AS wrestler_slug,
  w.image_url AS wrestler_image,
  cr.won_date,
  cr.defense_count,
  (CURRENT_DATE - cr.won_date) AS reign_days
FROM championship_reigns cr
JOIN championships c ON c.id = cr.championship_id
JOIN wrestlers w ON w.id = cr.wrestler_id
WHERE cr.lost_date IS NULL
  AND c.is_active = true
ORDER BY c.display_order;

-- Wrestler season stats view
CREATE OR REPLACE VIEW wrestler_season_stats AS
SELECT
  w.id AS wrestler_id,
  w.name AS wrestler_name,
  w.slug AS wrestler_slug,
  s.id AS season_id,
  s.name AS season_name,
  COUNT(mp.id) AS total_matches,
  COUNT(mp.id) FILTER (WHERE mp.is_winner = true) AS wins,
  COUNT(mp.id) FILTER (WHERE mp.is_winner = false) AS losses,
  CASE
    WHEN COUNT(mp.id) > 0
    THEN ROUND(COUNT(mp.id) FILTER (WHERE mp.is_winner = true)::NUMERIC / COUNT(mp.id) * 100, 1)
    ELSE 0
  END AS win_percentage
FROM wrestlers w
CROSS JOIN seasons s
LEFT JOIN match_participants mp ON mp.wrestler_id = w.id
LEFT JOIN matches m ON m.id = mp.match_id
LEFT JOIN events e ON e.id = m.event_id AND e.season_id = s.id
WHERE e.season_id = s.id OR mp.id IS NULL
GROUP BY w.id, w.name, w.slug, s.id, s.name;
