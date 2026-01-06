-- Create the fulfillment_type enum
CREATE TYPE fulfillment_type AS ENUM ('PICKUP', 'VOLUNTEER', 'DONOR_DELIVERY');

-- Add fulfillment_method column to claims table
ALTER TABLE claims 
ADD COLUMN fulfillment_method fulfillment_type NOT NULL DEFAULT 'VOLUNTEER';
