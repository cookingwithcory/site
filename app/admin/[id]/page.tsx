import { notFound } from "next/navigation";
import { Suspense } from "react";
import { RecipeForm } from "@/components/RecipeForm";
import { supabase, type Recipe } from "@/lib/supabase";

export default function EditRecipePage({ params }: PageProps<"/admin/[id]">) {
  return (
    <Suspense fallback={<p>Loading recipe…</p>}>
      <Edit params={params} />
    </Suspense>
  );
}

async function Edit({ params }: Pick<PageProps<"/admin/[id]">, "params">) {
  const { id } = await params;
  const { data } = await supabase.from("recipes").select("*").eq("id", id).maybeSingle();
  if (!data) {
    notFound();
  }
  return <RecipeForm recipe={data as Recipe} />;
}
