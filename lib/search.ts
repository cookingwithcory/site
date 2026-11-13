/** True when the search text is part of the title or part of any tag. Tags are stored lowercase. */
export function matchesSearch(recipe: { title: string; tags: string[] }, text: string): boolean {
  const needle = text.trim().toLowerCase();
  return recipe.title.toLowerCase().includes(needle) || recipe.tags.some((tag) => tag.includes(needle));
}
