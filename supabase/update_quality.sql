-- Add is_verified column for Strict Quality Control
ALTER TABLE donations 
ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT FALSE;

-- Ensure other quality control columns exist (idempotent)
ALTER TABLE donations 
ADD COLUMN IF NOT EXISTS freshness_score INTEGER,
ADD COLUMN IF NOT EXISTS ai_notes TEXT;

COMMENT ON COLUMN donations.is_verified IS 'True if AI explicitly marked the image as Safe.';
