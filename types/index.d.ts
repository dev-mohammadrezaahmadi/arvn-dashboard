export type NetworkState = "IDLE" | "PENDING" | "SUCCESS" | "FAIL";

export interface Article {
  slug: string;
  title: string;
  description: string;
  body: string;
  tagList: string[];
  createdAt: string;
  updatedAt: string;
  favorited: boolean;
  favoritesCount: number;
  author: Author;
}

export interface Author {
  username: string;
  image: string;
  bio: string;
  following: boolean;
}

export interface GetArticlesParams {
  tag?: string;
  author?: string;
  favorited?: string;
  limit: number;
  offset: number;
}
