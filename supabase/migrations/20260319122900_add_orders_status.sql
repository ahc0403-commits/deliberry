ALTER TABLE public.orders
ADD COLUMN IF NOT EXISTS status text DEFAULT 'pending';
