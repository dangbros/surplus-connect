-- Add gamification columns to profiles if they don't exist
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS points INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS lifetime_deliveries INTEGER DEFAULT 0;
