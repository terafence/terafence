import { notFound } from "next/navigation";
import { blogPosts } from "../data/blogData";
import BlogHeader from "../components/BlogHeader";
import TOCSection from "../components/TOCSection";
import RelatedPosts from "../components/RelatedPosts";
import SocialShare from "../components/SocialShare";
import ReadingProgressBar from "../components/ReadingProgressBar";
import ResourceDownload from "../components/ResourceDownload";
import BlogPostSchema from "../components/BlogPostSchema";
import AnimatedBookmarkButton from "../components/AnimatedBookmarkButton";
import ScrollToTopButton from "../components/ScrollToTopButton";
import CodeBlock from "../components/CodeBlock";
import CollapsibleSection from "../components/CollapsibleSection";
import VideoEmbed from "../components/VideoEmbed";
import NewsletterSubscribe from "../components/NewsletterSubscribe";
import RecentlyViewed from "../components/RecentlyViewed";

// Generate metadata for the page
export async function generateMetadata({ params }) {
  const post = blogPosts.find((post) => post.slug === params.slug);

  if (!post) {
    return {
      title: "Post Not Found",
      description: "The requested blog post could not be found.",
    };
  }

  return {
    title: `${post.title} | Blog`,
    description: post.description,
    authors: [{ name: post.author.name }],
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt || post.publishedAt,
      authors: [post.author.name],
      images: [
        {
          url: `https://terafence.in${post.coverImage}`,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
  };
}

// Page component as a function
export default async function Page({ params }) {
  const post = blogPosts.find((post) => post.slug === params.slug);
  if (!post) notFound();

  const tocItems = extractTOCItems(post.content);
  const relatedPostsData = post.relatedPosts
    ? post.relatedPosts
        .map((id) => blogPosts.find((p) => p.id === id))
        .filter((post) => post !== undefined)
    : [];

  return (
    <>
      <ReadingProgressBar />
      <BlogPostSchema post={post} />
      <article className="container mx-auto px-4 py-8">
        <BlogHeader post={post} />

        <div className="flex justify-end mb-6">
          <AnimatedBookmarkButton postId={post.id} postTitle={post.title} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8">
          <aside className="hidden lg:block lg:col-span-2">
            <div className="sticky top-24">
              <TOCSection tocItems={tocItems} />
            </div>
          </aside>

          <div className="lg:col-span-7 prose prose-lg max-w-none">
            <div dangerouslySetInnerHTML={{ __html: post.content }} />

            <CodeBlock
              language="bash"
              code={`// bash scripting in linux
# Start the service
sudo systemctl start ui-app.service

# Stop the service
sudo systemctl stop ui-app.service

# Restart the service
sudo systemctl restart ui-app.service

# Check the status of the service
sudo systemctl status ui-app.service

# Enable the service to start on boot
sudo systemctl enable ui-app.service

# Disable the service from starting on boot
sudo systemctl disable ui-app.service

# View logs for troubleshooting in real-time
sudo journalctl -u ui-app.service -f
`}
            />

            <CollapsibleSection title="Data Diode Configuration Options">
              <p>
                This section provides advanced configuration options for users
                looking to implement a data diode in their system. Expand this
                section only if you&apos;re familiar with the concept of data
                diodes and their use in secure data transmission.
              </p>
              <div className="bg-gray-100 p-4 rounded-lg shadow-lg">
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <span className="text-green-600 font-semibold">⚙️</span>
                    <span className="ml-2">
                      Performance Optimization: Tune the data flow rates for
                      enhanced security and efficiency.
                    </span>
                  </li>
                  <li className="flex items-center">
                    <span className="text-blue-600 font-semibold">🔐</span>
                    <span className="ml-2">
                      Custom Data Security: Customize encryption and decryption
                      protocols for the diode&apos;s data stream.
                    </span>
                  </li>
                  <li className="flex items-center">
                    <span className="text-yellow-600 font-semibold">🔄</span>
                    <span className="ml-2">
                      Advanced Routing: Configure routing parameters for
                      optimized one-way data flow across networks.
                    </span>
                  </li>
                </ul>
              </div>
            </CollapsibleSection>

            <VideoEmbed
              type="youtube"
              src="h5dwKBqHpDU"
              title="Terafence Private Limited"
            />

            {post.resources && post.resources.length > 0 && (
              <div className="my-12">
                <h3 className="text-xl font-bold mb-4">Resources</h3>
                <div className="space-y-4">
                  {post.resources.map((resource, index) => (
                    <ResourceDownload key={index} resource={resource} />
                  ))}
                </div>
              </div>
            )}

            <section className="mb-16 mt-20 border-t border-gray-100 pt-16">
              <div className="max-w-3xl mx-auto">
                <NewsletterSubscribe source="blog-footer" />
              </div>
            </section>
          </div>

          <aside className="lg:col-span-3">
            <div className="sticky top-24 space-y-8">
              <SocialShare post={post} />

              {relatedPostsData.length > 0 && (
                <RelatedPosts posts={relatedPostsData} />
              )}

              <RecentlyViewed currentPostId={post.id} />
            </div>
          </aside>
        </div>
      </article>

      <ScrollToTopButton />
    </>
  );
}

function extractTOCItems(content) {
  const h2Regex = /<h2 id="([^"]+)">([^<]+)<\/h2>/g;
  const h3Regex = /<h3 id="([^"]+)">([^<]+)<\/h3>/g;
  const tocItems = [];

  let match;

  while ((match = h2Regex.exec(content)) !== null) {
    tocItems.push({
      id: match[1],
      text: match[2],
      level: "h2",
    });
  }

  while ((match = h3Regex.exec(content)) !== null) {
    tocItems.push({
      id: match[1],
      text: match[2],
      level: "h3",
    });
  }

  return tocItems.sort((a, b) => {
    const posA = content.indexOf(`id="${a.id}"`);
    const posB = content.indexOf(`id="${b.id}"`);
    return posA - posB;
  });
}
