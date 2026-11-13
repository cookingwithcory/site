"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase, type Recipe } from "@/lib/supabase";

const MAX_PHOTOS = 2;
const MAX_PHOTO_PIXELS = 1600;

/** Scales a photo down to 1600px on its long side, because iPad photos run 3 to 5 MB each. */
async function shrink(file: File): Promise<Blob> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_PHOTO_PIXELS / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext("2d")!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("That photo could not be read."))),
      "image/jpeg",
      0.85,
    );
  });
}

async function upload(file: File): Promise<string> {
  const path = `${crypto.randomUUID()}.jpg`;
  const { error } = await supabase.storage.from("photos").upload(path, await shrink(file), { contentType: "image/jpeg" });
  if (error) {
    throw new Error(error.message);
  }
  return supabase.storage.from("photos").getPublicUrl(path).data.publicUrl;
}

function minutes(value: FormDataEntryValue | null): number | null {
  return value ? Number(value) : null;
}

export function RecipeForm({ recipe }: { recipe?: Recipe }) {
  const router = useRouter();
  const [photos, setPhotos] = useState<string[]>(recipe?.photos ?? []);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        router.replace("/login");
      }
    });
  }, [router]);

  async function save(event: React.FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setBusy(true);
    setError("");
    try {
      const files = (form.getAll("photos") as File[]).filter((file) => file.size > 0);
      const uploaded = await Promise.all(files.slice(0, MAX_PHOTOS - photos.length).map(upload));
      const values = {
        title: String(form.get("title")).trim(),
        description: String(form.get("description")).trim() || null,
        ingredients: String(form.get("ingredients")),
        steps: String(form.get("steps")),
        prep_minutes: minutes(form.get("prep_minutes")),
        cook_minutes: minutes(form.get("cook_minutes")),
        servings: String(form.get("servings")).trim() || null,
        tags: String(form.get("tags")).split(",").map((tag) => tag.trim().toLowerCase()).filter(Boolean),
        instagram_url: String(form.get("instagram_url")).trim() || null,
        photos: [...photos, ...uploaded],
        favorite: form.get("favorite") === "on",
      };
      const request = recipe
        ? supabase.from("recipes").update(values).eq("id", recipe.id).select("id").single()
        : supabase.from("recipes").insert(values).select("id").single();
      const { data, error: saveError } = await request;
      if (saveError) {
        throw new Error(saveError.message);
      }
      router.push(`/recipes/${data.id}`);
    } catch (caught) {
      // The typed text stays in the form, so a failed save loses nothing.
      setError(caught instanceof Error ? caught.message : "Saving failed. Try again.");
      setBusy(false);
    }
  }

  async function remove(): Promise<void> {
    if (!recipe || !window.confirm(`Delete "${recipe.title}"? This cannot be undone.`)) {
      return;
    }
    // shortcut: photo files stay in storage after a delete, clean the bucket if it nears 1 GB
    const { error: deleteError } = await supabase.from("recipes").delete().eq("id", recipe.id);
    if (deleteError) {
      setError(deleteError.message);
      return;
    }
    router.push("/");
  }

  return (
    <form onSubmit={save} className="space-y-5 text-lg">
      <h1 className="font-display text-3xl font-bold">{recipe ? "Edit recipe" : "New recipe"}</h1>
      <label className="block">
        Title
        <input name="title" required defaultValue={recipe?.title} className="field" />
      </label>
      <label className="block">
        Short description (optional)
        <textarea name="description" rows={2} defaultValue={recipe?.description ?? ""} className="field" />
      </label>
      <label className="block">
        Ingredients, one per line
        <textarea name="ingredients" required rows={8} defaultValue={recipe?.ingredients} className="field" />
      </label>
      <label className="block">
        Directions, one step per line
        <textarea name="steps" required rows={10} defaultValue={recipe?.steps} className="field" />
      </label>
      <div className="grid gap-4 sm:grid-cols-3">
        <label className="block">
          Prep minutes
          <input name="prep_minutes" type="number" min={0} inputMode="numeric" defaultValue={recipe?.prep_minutes ?? ""} className="field" />
        </label>
        <label className="block">
          Cook minutes
          <input name="cook_minutes" type="number" min={0} inputMode="numeric" defaultValue={recipe?.cook_minutes ?? ""} className="field" />
        </label>
        <label className="block">
          Serves
          <input name="servings" defaultValue={recipe?.servings ?? ""} className="field" />
        </label>
      </div>
      <label className="block">
        Tags, separated by commas
        <input name="tags" autoCapitalize="none" placeholder="dinner, chicken, grill" defaultValue={recipe?.tags.join(", ")} className="field" />
      </label>
      <label className="block">
        Instagram video link
        <input name="instagram_url" type="url" placeholder="https://www.instagram.com/reel/…" defaultValue={recipe?.instagram_url ?? ""} className="field" />
      </label>

      <fieldset>
        <legend>Photos (up to {MAX_PHOTOS})</legend>
        <ul className="mt-2 flex gap-4">
          {photos.map((photo) => (
            <li key={photo} className="text-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={photo} alt="" className="h-28 w-28 rounded-lg object-cover" />
              <button type="button" onClick={() => setPhotos(photos.filter((kept) => kept !== photo))} className="mt-1 text-base text-red-700 underline">
                Remove
              </button>
            </li>
          ))}
        </ul>
        {photos.length < MAX_PHOTOS && (
          <input name="photos" type="file" accept="image/*" multiple aria-label="Add photos" className="mt-2 block" />
        )}
      </fieldset>

      <label className="flex items-center gap-3">
        <input name="favorite" type="checkbox" defaultChecked={recipe?.favorite} className="h-6 w-6" />
        One of my favorites
      </label>

      {error && <p role="alert" className="text-red-700">{error}</p>}
      <div className="flex items-center justify-between">
        <button disabled={busy} className="button">{busy ? "Saving…" : "Save recipe"}</button>
        {recipe && (
          <button type="button" onClick={remove} className="text-red-700 underline">
            Delete recipe
          </button>
        )}
      </div>
    </form>
  );
}
