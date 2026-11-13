"use client";

import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useSignedIn } from "@/lib/useSignedIn";

/** Footer link: "Sign in" for visitors, "Sign out" for a signed-in user. */
export function SignInOut() {
  // null until the session check finishes, so neither label flashes.
  const signedIn = useSignedIn();

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
