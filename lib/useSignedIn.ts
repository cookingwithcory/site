"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

/** Null until the session check finishes, then true or false. */
export function useSignedIn(): boolean | null {
  const [signedIn, setSignedIn] = useState<boolean | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSignedIn(Boolean(data.session)));
  }, []);

  return signedIn;
}
