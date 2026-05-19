-- Add Bunny Stream video fields to lessons table
ALTER TABLE lessons
  ADD COLUMN IF NOT EXISTS bunny_video_id TEXT,
  ADD COLUMN IF NOT EXISTS bunny_library_id TEXT;

-- Index for fast lookup by video id
CREATE INDEX IF NOT EXISTS lessons_bunny_video_id_idx ON lessons (bunny_video_id);
