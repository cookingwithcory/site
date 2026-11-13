"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

/** A link that renders only for a signed-in user. The database rules do the real access check. */
export function AdminLink({ href, children }: { href: string; children: React.ReactNode }) {
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSignedIn(Boolean(data.session)));
  }, []);

  return signedIn ? (
    <Link href={href} className="font-semibold underline">
      {children}
    </Link>
  ) : null;
}
