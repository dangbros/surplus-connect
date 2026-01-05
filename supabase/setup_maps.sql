-- Add coordinate columns to donations table
ALTER TABLE public.donations 
ADD COLUMN IF NOT EXISTS latitude float,
ADD COLUMN IF NOT EXISTS longitude float;

-- Update existing donations with random coordinates near New York City (for demo purposes)
-- Center: 40.7128° N, 74.0060° W
-- Spread: +/- 0.05 degrees (approx 5km radius)

UPDATE public.donations
SET 
  latitude = 40.7128 + (random() * 0.1 - 0.05),
  longitude = -74.0060 + (random() * 0.1 - 0.05)
WHERE latitude IS NULL;
