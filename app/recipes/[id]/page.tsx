import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { AdminLink } from "@/components/AdminLink";
import { instagramEmbedUrl } from "@/lib/instagram";
import { supabase, type Recipe } from "@/lib/supabase";

export default function RecipePage({ params }: PageProps<"/recipes/[id]">) {
  return (
    <Suspense fallback={<p>Loading recipe…</p>}>
      <RecipeView params={params} />
    </Suspense>
  );
}

function lines(text: string): string[] {
  return text.split("\n").map((line) => line.trim()).filter(Boolean);
}

async function RecipeView({ params }: Pick<PageProps<"/recipes/[id]">, "params">) {
  const { id } = await params;
  // A malformed id returns an error from Postgres, which is also a missing page.
  const { data } = await supabase.from("recipes").select("*").eq("id", id).maybeSingle();
  if (!data) {
    notFound();
  }
  const recipe = data as Recipe;
  const embedUrl = recipe.instagram_url ? instagramEmbedUrl(recipe.instagram_url) : null;
  const facts = [
    recipe.prep_minutes !== null && `Prep ${recipe.prep_minutes} min`,
    recipe.cook_minutes !== null && `Cook ${recipe.cook_minutes} min`,
    recipe.servings && `Serves ${recipe.servings}`,
  ].filter(Boolean);

  return (
    <article className="text-lg">
      <div className="flex items-baseline justify-between gap-4">
        <h1 className="font-display text-4xl font-bold sm:text-5xl">{recipe.title}</h1>
        <AdminLink href={`/admin/${recipe.id}`}>Edit</AdminLink>
      </div>
      {recipe.description && <p className="mt-4 text-xl text-navy/80">{recipe.description}</p>}
      {facts.length > 0 && (
        <p className="mt-6 border-y border-silver py-3 text-sm font-semibold uppercase tracking-widest">
          {facts.join("  ·  ")}
        </p>
      )}
      <p className="mt-4 flex flex-wrap gap-2">
        {recipe.tags.map((tag) => (
          <Link
            key={tag}
            href={`/?tag=${encodeURIComponent(tag)}`}
            className="rounded-full border border-silver px-3 py-1 text-sm hover:bg-navy hover:text-white"
          >
            {tag}
          </Link>
        ))}
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {recipe.photos.map((photo) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={photo} src={photo} alt={recipe.title} className="w-full rounded-xl border border-silver" />
        ))}
      </div>

      <div className="mt-10 grid gap-10 md:grid-cols-3">
        <section className="self-start rounded-xl bg-silver/25 p-6">
          <h2 className="font-display text-2xl font-bold">Ingredients</h2>
          <ul className="mt-4 space-y-2">
            {lines(recipe.ingredients).map((line, index) => (
              <li key={index} className="border-b border-silver pb-2 last:border-0">{line}</li>
            ))}
          </ul>
        </section>

        <section className="md:col-span-2">
          <h2 className="heading">Directions</h2>
          <ol className="mt-4 space-y-5">
            {lines(recipe.steps).map((line, index) => (
              <li key={index} className="flex gap-4">
                <span aria-hidden className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-navy font-semibold text-white">
                  {index + 1}
                </span>
                <span className="pt-1">{line}</span>
              </li>
            ))}
          </ol>
        </section>
      </div>

      {embedUrl && (
        <section className="mt-12">
          <h2 className="heading">Watch Cory make it</h2>
          <iframe
            src={embedUrl}
            title={`${recipe.title} video on Instagram`}
            loading="lazy"
            allowFullScreen
            className="mx-auto mt-5 h-[720px] w-full max-w-md rounded-xl border border-silver bg-white"
          />
        </section>
      )}
    </article>
  );
}
