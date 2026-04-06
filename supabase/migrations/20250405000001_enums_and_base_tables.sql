-- Enums
CREATE TYPE show_type AS ENUM ('weekly', 'ppv', 'special');
CREATE TYPE brand AS ENUM ('raw', 'smackdown', 'nxt', 'unbranded');
CREATE TYPE embed_type AS ENUM ('youtube', 'twitter');
CREATE TYPE embed_target AS ENUM ('match', 'event', 'wrestler');
CREATE TYPE weight_class AS ENUM ('heavyweight', 'midcard', 'tag_team', 'womens', 'womens_tag');

-- Seasons (WrestleMania to WrestleMania)
CREATE TABLE seasons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  start_date DATE NOT NULL,
  end_date DATE,
  is_current BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX idx_seasons_current ON seasons(is_current) WHERE is_current = true;

-- Wrestlers
CREATE TABLE wrestlers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  brand brand NOT NULL DEFAULT 'unbranded',
  image_url TEXT,
  height TEXT,
  weight INTEGER,
  finisher TEXT,
  hometown TEXT,
  debut_date DATE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_wrestlers_brand ON wrestlers(brand);
CREATE INDEX idx_wrestlers_slug ON wrestlers(slug);
CREATE INDEX idx_wrestlers_active ON wrestlers(is_active);

-- Shows (templates)
CREATE TABLE shows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  short_name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  show_type show_type NOT NULL,
  brand brand,
  logo_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Championships
CREATE TABLE championships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  brand brand,
  image_url TEXT,
  weight_class weight_class,
  is_active BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
