"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function sendLink(event: React.FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    const email = String(new FormData(event.currentTarget).get("email"));
    setBusy(true);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      // shouldCreateUser false: only the users added in the Supabase dashboard can sign in.
      options: { shouldCreateUser: false, emailRedirectTo: `${window.location.origin}/admin` },
    });
    setBusy(false);
    setMessage(error ? error.message : `Sign in link sent to ${email}. Open it on this device.`);
  }

  return (
    <form onSubmit={sendLink} className="mx-auto max-w-sm space-y-4 text-lg">
      <h1 className="font-display text-3xl font-bold">Sign in</h1>
      <label className="block">
        Email
        <input name="email" type="email" autoComplete="email" required className="field" />
      </label>
      {message && <p role="status">{message}</p>}
      <button disabled={busy} className="button">Email me a sign in link</button>
    </form>
  );
}
