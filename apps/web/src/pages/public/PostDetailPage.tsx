import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import type { Post } from '../../types';

// Mock post for demonstration
const MOCK_POST: Post = {
  id: '1',
  title: 'Getting Started with React 19',
  slug: 'getting-started-react-19',
  content: `
    <p>React 19 is finally here! This release brings a lot of exciting new features and improvements that make web development even more enjoyable and efficient.</p>
    <h2>New Hooks</h2>
    <p>One of the most talked-about features is the introduction of several new hooks that simplify state management and side effects.</p>
    <h2>Better Performance</h2>
    <p>The React team has worked hard on under-the-hood optimizations that lead to faster rendering and smaller bundle sizes.</p>
  `,
  summary: 'A brief guide to the new features in React 19.',
  status: 'published',
  views: 1250,
  author: { id: 'u1', name: 'John Doe', email: '', role: 'admin', createdAt: '' },
  category: { id: 'c1', name: 'Development', slug: 'dev' },
  tags: [{ id: 't1', name: 'React', slug: 'react' }, { id: 't2', name: 'Frontend', slug: 'frontend' }],
  createdAt: '2026-05-10T10:00:00Z',
  updatedAt: '2026-05-10T10:00:00Z',
};

export const PostDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();

  // Mock: solo coincide con el slug del post de demo; en producción harías fetch por slug.
  const post = slug === MOCK_POST.slug ? MOCK_POST : undefined; 

  if (!post) {
    return <div className="text-center py-20 text-gray-500">Post not found.</div>;
  }

  return (
    <article className="max-w-3xl mx-auto py-12">
      <Helmet>
        <title>{post.title} | Blog CMS</title>
        <meta name="description" content={post.summary} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.summary} />
        <meta property="og:type" content="article" />
      </Helmet>

      <header className="mb-8">
        <div className="flex items-center space-x-2 text-sm text-indigo-600 font-medium mb-3">
          <span>{post.category.name}</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
          {post.title}
        </h1>
        <div className="flex items-center text-gray-500 text-sm">
          <span>By {post.author.name}</span>
          <span className="mx-2">•</span>
          <span>{new Date(post.createdAt).toLocaleDateString()}</span>
          <span className="mx-2">•</span>
          <span>{post.views} views</span>
        </div>
      </header>

      <div 
        className="prose prose-indigo prose-lg max-w-none text-gray-800 leading-relaxed"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      <footer className="mt-12 pt-8 border-t">
        <div className="flex flex-wrap gap-2">
          {post.tags.map(tag => (
            <span 
              key={tag.id} 
              className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm"
            >
              #{tag.name}
            </span>
          ))}
        </div>
      </footer>
    </article>
  );
};
