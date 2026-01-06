-- Add can_deliver column to donations table
ALTER TABLE donations 
ADD COLUMN can_deliver boolean NOT NULL DEFAULT false;
