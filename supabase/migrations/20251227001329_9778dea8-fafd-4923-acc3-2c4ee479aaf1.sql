-- Create matches table to store match history
CREATE TABLE public.matches (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  match_details JSONB NOT NULL,
  match_state JSONB NOT NULL,
  status TEXT NOT NULL DEFAULT 'in_progress',
  team1_name TEXT NOT NULL,
  team2_name TEXT NOT NULL,
  team1_score INTEGER DEFAULT 0,
  team2_score INTEGER DEFAULT 0,
  winner TEXT
);

-- Enable Row Level Security (public access for now since no auth)
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Anyone can read matches"
ON public.matches
FOR SELECT
USING (true);

-- Create policy for public insert access
CREATE POLICY "Anyone can insert matches"
ON public.matches
FOR INSERT
WITH CHECK (true);

-- Create policy for public update access
CREATE POLICY "Anyone can update matches"
ON public.matches
FOR UPDATE
USING (true);

-- Create policy for public delete access
CREATE POLICY "Anyone can delete matches"
ON public.matches
FOR DELETE
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_matches_updated_at
BEFORE UPDATE ON public.matches
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();