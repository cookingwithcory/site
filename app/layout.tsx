import type { Metadata } from "next";
import { Geist, Oswald } from "next/font/google";
import Link from "next/link";
import { AdminLink } from "@/components/AdminLink";
import { SignInOut } from "@/components/SignInOut";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Cooking With Cory",
  description: "Cory's recipes and cooking videos",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geistSans.variable} ${oswald.variable} antialiased`}>
      <body className="flex min-h-screen flex-col bg-white font-sans text-navy">
        <header className="border-b-4 border-silver bg-navy text-white">
          <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-x-6 gap-y-3 px-4 py-5">
            <Link href="/" className="font-display text-3xl font-bold uppercase tracking-wider sm:text-4xl">
              Cooking With Cory
            </Link>
            <form action="/" role="search" className="ml-auto flex min-w-48 flex-1 gap-2 sm:max-w-sm">
              <input
                name="q"
                type="search"
                aria-label="Search recipes"
                placeholder="Search recipes"
                className="w-full rounded-lg bg-white px-3 py-2 text-lg text-navy focus:outline-2 focus:outline-silver"
              />
              <button className="rounded-lg border border-silver px-4 py-2 font-semibold hover:bg-white hover:text-navy">
                Search
              </button>
            </form>
            <AdminLink href="/admin">Add recipe</AdminLink>
          </div>
        </header>
        <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-10">{children}</main>
        <footer className="border-t border-silver">
          <div className="mx-auto flex max-w-5xl justify-between px-4 py-6 text-sm text-navy/70">
            <span>Cooking With Cory</span>
            <SignInOut />
          </div>
        </footer>
      </body>
    </html>
  );
}
