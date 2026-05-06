/*
  # Create articles table for the Thinking / Blog section

  ## Summary
  Creates the `articles` table used to store long-form editorial content for the
  "Thinking" section of the Value Designer site. Content is authored in Markdown
  and rendered on the front-end.

  ## New Tables
  - `articles`
    - `id` (uuid, primary key)
    - `slug` (text, unique) — URL-safe identifier, e.g. "close-the-value-gap"
    - `title` (text) — article headline
    - `subtitle` (text) — one-line descriptor shown on index and article header
    - `category` (text) — label tag, e.g. "Value Gap", "Acquisition", "Retention"
    - `body` (text) — full article content in Markdown format
    - `meta_description` (text) — SEO description shown in search results
    - `read_time_minutes` (integer) — estimated read time displayed to readers
    - `is_published` (boolean, default false) — controls public visibility; flip to true to go live
    - `published_date` (date) — display date shown on the article (set manually)
    - `created_at` (timestamptz) — auto-set on insert

  ## Security
  - RLS enabled
  - Public SELECT policy restricted to published articles only (is_published = true)
  - No unauthenticated write access
*/

CREATE TABLE IF NOT EXISTS articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL DEFAULT '',
  subtitle text NOT NULL DEFAULT '',
  category text NOT NULL DEFAULT '',
  body text NOT NULL DEFAULT '',
  meta_description text NOT NULL DEFAULT '',
  read_time_minutes integer NOT NULL DEFAULT 5,
  is_published boolean NOT NULL DEFAULT false,
  published_date date,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read published articles"
  ON articles FOR SELECT
  TO anon, authenticated
  USING (is_published = true);

CREATE POLICY "Authenticated users can insert articles"
  ON articles FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update articles"
  ON articles FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);
