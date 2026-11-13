import { createClient } from "@supabase/supabase-js";

export type Recipe = {
  id: string;
  title: string;
  description: string | null;
  ingredients: string;
  steps: string;
  prep_minutes: number | null;
  cook_minutes: number | null;
  servings: string | null;
  tags: string[];
  instagram_url: string | null;
  photos: string[];
  favorite: boolean;
  created_at: string;
};

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);
