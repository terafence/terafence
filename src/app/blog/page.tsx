import { Metadata } from 'next';
import { blogPosts, categories, tags } from './data/blogData';
import SearchBar from './components/SearchBar';
import TagCloud from './components/TagCloud';
import CategoryList from './components/CategoryList';
import BlogCard from './components/BlogCard';
import BlogListSchema from './components/BlogListSchema';
import AnimatedBlogHeader from './components/AnimatedBlogHeader';
import FeaturedPostsCarousel from './components/FeaturedPostsCarousel';
import ScrollToTopButton from './components/ScrollToTopButton';
import NewsletterSubscribe from './components/NewsletterSubscribe';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { IconStar, IconFilter, IconChevronDown, IconArrowRight } from '@tabler/icons-react';
import { Link } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Data Diode | What is a Data Diode? | Secure Cybersecurity Solutions by Terafence',
  description: 'Learn everything about data diodes – how the data diode works, why data diode isessential for cybersecurity, and how Terafence Data Diode is leading secure unidirectional data transfer technology.',
  openGraph: {
    title: 'Data Diode Explained | Terafence Data Diode - Secure Unidirectional Gateways',
    description: 'Explore Terafence’s expert insights on data diode. Discover their role in securing OT, ICS, SCADA systems with unidirectional data flow.',
    type: 'website',
    url: 'https://terafence.in/blog',
    images: [
      {
        url: 'https://terafence.in/images/data-diode-terafence.jpg',
        width: 1200,
        height: 630,
        alt: 'Data Diode Security Blog - Terafence',
      },
    ],
  },
  keywords: [
    'data diode',
    'what is a data diode',
    'data diode blog',
    'unidirectional gateway',
    'secure network communication',
    'OT security',
    'ICS cybersecurity',
    'SCADA protection',
    'air-gap alternative',
    'terafence data diode',
  ],
  alternates: {
    canonical: 'https://terafence.in/blog',
  },
};


export default function BlogHomePage() {
  const featuredPosts = blogPosts.filter(post => post.featured);
  const recentPosts = [...blogPosts].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
  
  return (
    <div className="container mx-auto px-4 py-2">
      <BlogListSchema posts={recentPosts.slice(0, 10)} />
      
      <div className="mb-16">
        <AnimatedBlogHeader 
          title="Our Blogs" 
          subtitle="Explore our latest articles on cybersecurity, data diode technology, and much more!" 
        />
        
        {/* Featured Posts Carousel with modern styling */}
        {featuredPosts.length > 0 && (
          <div className="mb-10 rounded-xl overflow-hidden shadow-md">
            <FeaturedPostsCarousel posts={featuredPosts} />
          </div>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Sidebar with design inspiration from the filter UI */}
          <aside className="lg:col-span-1">
            <Card className="sticky top-24 mb-6 rounded-xl shadow-sm overflow-hidden border-0">
              {/* Dark blue header similar to the filter UI */}
              <CardHeader className="pb-3 bg-[#0c1e35] text-white">
                <div className="flex items-center gap-2">
                  <IconFilter className="h-5 w-5" />
                  <CardTitle>Filters</CardTitle>
                </div>
                <CardDescription className="text-gray-200">
                  Refine your search results
                </CardDescription>
              </CardHeader>

              <CardContent className="p-0 divide-y divide-gray-100">
                {/* Search Section */}
                <div className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-medium text-gray-700 uppercase tracking-wider">Search</h3>
                    <div className="flex items-center">
                      <IconChevronDown className="h-4 w-4 text-gray-500" />
                    </div>
                  </div>
                  <SearchBar />
                </div>

                {/* Categories Section - Styled like the filter UI */}
                <div className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-medium text-gray-700 uppercase tracking-wider">Categories</h3>
                  </div>
                  <CategoryList categories={categories} />
                </div>

                {/* Tags Section - Styled like the filter UI */}
                <div className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-medium text-gray-700 uppercase tracking-wider">Tags</h3>
                  </div>
                  <TagCloud tags={tags} />
                </div>
              </CardContent>
            </Card>
          </aside>
          
          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold flex items-center gap-2 text-gray-900">
                <IconStar className="h-5 w-5 text-amber-500" />
                Recent Articles
              </h2>
              <Link href="/blog/all" className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-blue-700 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors">
                View All
                <IconArrowRight className="ml-1 h-3.5 w-3.5" />
              </Link>
            </div>

            {/* Blog Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {recentPosts.map(post => (
                <div key={post.id} className="group">
                  <div className="h-full transition-all duration-200 hover:shadow-md rounded-lg overflow-hidden border border-gray-100 hover:border-gray-200 bg-white">
                    <BlogCard post={post} />
                  </div>
                </div>
              ))}
            </div>
            
            {/* Pagination/Load More Button */}
            <div className="mt-12 flex justify-center">
              <button className="inline-flex items-center justify-center rounded-md bg-[#0c1e35] px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">
                Load More Articles
                <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer Newsletter */}
      <section className="mb-16 mt-20 border-t border-gray-100 pt-16">
        <div className="max-w-3xl mx-auto">
          <NewsletterSubscribe source="blog-footer" />
        </div>
      </section>
      
      {/* Scroll to Top Button */}
      <ScrollToTopButton />
    </div>
  );
}