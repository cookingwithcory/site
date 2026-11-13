"use client";

import Link from "next/link";
import { useSignedIn } from "@/lib/useSignedIn";

/** A link that renders only for a signed-in user. The database rules do the real access check. */
export function AdminLink({ href, children }: { href: string; children: React.ReactNode }) {
  return useSignedIn() ? (
    <Link href={href} className="font-semibold underline">
      {children}
    </Link>
  ) : null;
}
