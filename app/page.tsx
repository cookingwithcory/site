import Link from "next/link";
import { Suspense } from "react";
import { supabase, type Recipe } from "@/lib/supabase";

const RECENT_COUNT = 12;

export default function Home({ searchParams }: PageProps<"/">) {
  return (
    <Suspense fallback={<p>Loading recipes…</p>}>
      <Recipes searchParams={searchParams} />
    </Suspense>
  );
}

async function Recipes({ searchParams }: Pick<PageProps<"/">, "searchParams">) {
  const { q, tag } = await searchParams;
  // shortcut: loads every matching recipe in one query, add paging past a few hundred recipes
  let query = supabase.from("recipes").select("*").order("created_at", { ascending: false });
  if (typeof q === "string" && q) {
    query = query.ilike("title", `%${q}%`);
  }
  if (typeof tag === "string" && tag) {
    query = query.contains("tags", [tag]);
  }
  const { data, error } = await query;
  if (error) {
    throw new Error(error.message);
  }
  const recipes = data as Recipe[];

  if (q || tag) {
    return <Section title={`${recipes.length} found for "${q || tag}"`} recipes={recipes} />;
  }
  return (
    <>
      <Section title="Recent recipes" recipes={recipes.slice(0, RECENT_COUNT)} />
      <Section title="Cory's favorites" recipes={recipes.filter((recipe) => recipe.favorite)} />
    </>
  );
}

function Section({ title, recipes }: { title: string; recipes: Recipe[] }) {
  return (
    <section className="mb-12">
      <h2 className="heading mb-5">{title}</h2>
      {recipes.length === 0 && <p className="text-navy/70">No recipes here yet.</p>}
      <ul className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
        {recipes.map((recipe) => (
          <li key={recipe.id}>
            <Link
              href={`/recipes/${recipe.id}`}
              className="block overflow-hidden rounded-xl border border-silver bg-white transition hover:-translate-y-1 hover:shadow-lg"
            >
              {recipe.photos[0] ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={recipe.photos[0]} alt="" loading="lazy" className="aspect-4/3 w-full object-cover" />
              ) : (
                <div aria-hidden className="flex aspect-4/3 w-full items-center justify-center bg-silver/30 font-display text-6xl">
                  {recipe.title.charAt(0)}
                </div>
              )}
              <div className="border-t border-silver p-4">
                <p className="font-display text-xl font-bold">{recipe.title}</p>
                {recipe.tags.length > 0 && (
                  <p className="mt-1 text-sm uppercase tracking-wide text-navy/70">{recipe.tags.join(" · ")}</p>
                )}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
