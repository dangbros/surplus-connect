-- Add columns for Detailed Inspection Features
ALTER TABLE donations 
ADD COLUMN IF NOT EXISTS freshness_score INTEGER,
ADD COLUMN IF NOT EXISTS ai_notes TEXT,
ADD COLUMN IF NOT EXISTS pickup_address TEXT;

-- Comment on columns for clarity
COMMENT ON COLUMN donations.freshness_score IS 'AI-generated freshness score from 1-10';
COMMENT ON COLUMN donations.ai_notes IS 'AI-generated reasoning for the freshness score';
COMMENT ON COLUMN donations.pickup_address IS 'Human-readable pickup location address';
