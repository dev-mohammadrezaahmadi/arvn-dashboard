import type { GetArticlesParams, Article, CreateArticle } from "~/types";

function getAllArticles(
  params?: GetArticlesParams
): Promise<{ articles: Article[]; articlesCount: number }> {
  return useCustomFetch("/api/articles", {
    params: params,
  });
}

function createArticle(params: {
  article: CreateArticle;
}): Promise<{ article: Article }> {
  return useCustomFetch("/api/articles", {
    method: "POST",
    body: params,
  });
}

function getTags(): Promise<{ tags: string[] }> {
  return useCustomFetch("/api/tags");
}

function deleteArticle(slug: string): Promise<any> {
  return useCustomFetch(`/api/articles/${slug}`, {
    method: "DELETE",
  });
}

export { getAllArticles, createArticle, getTags, deleteArticle };
