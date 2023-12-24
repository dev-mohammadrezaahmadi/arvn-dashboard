import type { GetArticlesParams, Article } from "~/types";

function getAllArticles(
  params?: GetArticlesParams
): Promise<{ articles: Article[]; articlesCount: number }> {
  return useCustomFetch("/api/articles", {
    params: params,
  });
}

export { getAllArticles };
