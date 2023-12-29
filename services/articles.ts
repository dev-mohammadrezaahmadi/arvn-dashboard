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

function updateArticle(params: { slug: string; article: CreateArticle }) {
  return useCustomFetch(`/api/articles/${params.slug}`, {
    method: "PUT",
    body: { article: params.article },
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

function getArticle(slug: string): Promise<{ article: Article }> {
  return useCustomFetch(`/api/articles/${slug}`);
}

export { getAllArticles, createArticle, getTags, deleteArticle, getArticle, updateArticle };
