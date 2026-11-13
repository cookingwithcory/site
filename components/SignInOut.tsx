"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

/** Footer link: "Sign in" for visitors, "Sign out" for a signed-in user. */
export function SignInOut() {
  // null until the session check finishes, so neither label flashes.
  const [signedIn, setSignedIn] = useState<boolean | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSignedIn(Boolean(data.session)));
  }, []);

  async function signOut(): Promise<void> {
    await supabase.auth.signOut();
    // Full page load so the header's "Add recipe" link disappears too.
    window.location.assign("/");
  }

  if (signedIn === null) {
    return null;
  }
  return signedIn ? (
    <button type="button" onClick={signOut} className="underline">
      Sign out
    </button>
  ) : (
    <Link href="/login" className="underline">
      Sign in
    </Link>
  );
}
