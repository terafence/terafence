import { BlogPost } from '../types';

interface BlogPostSchemaProps {
  post: BlogPost;
}

export default function BlogPostSchema({ post }: BlogPostSchemaProps) {
  // Generate absolute URLs for any relative URLs
  const getAbsoluteUrl = (relativeUrl: string) => {
    return `https://yourdomain.com${relativeUrl}`;
  };

  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    image: getAbsoluteUrl(post.coverImage),
    datePublished: post.publishedAt,
    dateModified: post.updatedAt || post.publishedAt,
    author: {
      '@type': 'Person',
      name: post.author.name,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Your Company Name',
      logo: {
        '@type': 'ImageObject',
        url: 'https://yourdomain.com/logo.png',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://yourdomain.com/blog/${post.slug}`,
    },
    keywords: post.tags.map(tag => tag.name).join(', '),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
    />
  );
}