export interface Article {
  id: string;
  titre: string;
  slug: string;
  contenu: string;
  resume: string;
  categorie: string;
  tags: string; // JSON string
  auteur?: string;
  source: 'AUTO_GENERATED' | 'MANUAL' | 'USER_DATA';
  sourceData?: string; // JSON string
  imageUrl?: string;
  vue: number;
  likes: number;
  published: boolean;
  publishedAt?: string;
  seoTitle?: string;
  seoDescription?: string;
  keywords?: string;
  leadId?: string;
  createdAt: string;
  updatedAt: string;
  lead?: {
    id: string;
    nom: string;
    prenom: string;
    email: string;
  };
}

export interface ArticlesResponse {
  articles: Article[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ArticleStats {
  total: number;
  published: number;
  unpublished: number;
  byCategory: Array<{
    categorie: string;
    count: number;
  }>;
  bySource: Array<{
    source: string;
    count: number;
  }>;
  totalViews: number;
  totalLikes: number;
  recentArticles: Array<{
    id: string;
    titre: string;
    slug: string;
    vue: number;
    createdAt: string;
  }>;
}

export interface GenerateArticleRequest {
  type: 'comparison' | 'lead' | 'bien-search' | 'simulator' | 'market-analysis';
  data: any;
}
