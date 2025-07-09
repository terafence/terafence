import { BlogPost } from '../types';

interface BlogListSchemaProps {
  posts: BlogPost[];
}

export default function BlogListSchema({ posts }: BlogListSchemaProps) {
  // Generate absolute URLs for any relative URLs
  const getAbsoluteUrl = (relativeUrl: string) => {
    return `https://yourdomain.com${relativeUrl}`;
  };

  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: posts.map((post, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
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
        url: `https://yourdomain.com/blog/${post.slug}`,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
    />
  );
}