export interface Author {
  id: string;
  name: string;
  avatar: string;
  bio: string;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  description: string;
  content: string;
  coverImage: string;
  author: Author;
  publishedAt: string;
  updatedAt?: string;
  readingTime: string;
  tags: Tag[];
  category: Category;
  featured?: boolean;
  popular?: boolean;
  resources?: {
    title: string;
    description?: string;
    url: string;
    type: 'pdf' | 'zip' | 'doc' | 'other';
  }[];
  relatedPosts?: string[]; 
}

export interface TOCItem {
  id: string;
  text: string;
  level: 'h2' | 'h3';
}