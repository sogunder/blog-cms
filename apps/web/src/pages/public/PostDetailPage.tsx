import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ChevronLeft } from 'lucide-react';
import type { Post } from '../../types';
import { postService } from '../../services/post.service';
import { toast } from 'sonner';
import { PostHeader } from '../../features/posts/components/PostHeader';
import { PostContent } from '../../features/posts/components/PostContent';
import { PostTags } from '../../features/posts/components/PostTags';
import { CommentsSection } from '../../features/comments/components/CommentsSection';

export const PostDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      loadPost(slug);
    }
    window.scrollTo(0, 0);
  }, [slug]);

  const loadPost = async (postSlug: string) => {
    try {
      setIsLoading(true);
      const data = await postService.getPostBySlug(postSlug);
      setPost(data);
    } catch {
      toast.error('No se pudo encontrar el artículo');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto py-24 px-4 text-center">
        <div className="animate-pulse space-y-8">
          <div className="h-4 bg-gray-200 rounded w-24 mx-auto" />
          <div className="h-12 bg-gray-200 rounded w-3/4 mx-auto" />
          <div className="h-64 bg-gray-100 rounded-3xl w-full" />
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded w-full" />
            <div className="h-4 bg-gray-200 rounded w-full" />
            <div className="h-4 bg-gray-200 rounded w-2/3" />
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-4xl mx-auto py-24 px-4 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Artículo no encontrado</h1>
        <p className="text-gray-500 mb-8">El artículo que buscas no existe o ha sido movido.</p>
        <Link 
          to="/" 
          className="inline-flex items-center text-google-blue font-bold hover:underline"
        >
          <ChevronLeft size={20} className="mr-1" />
          Volver al inicio
        </Link>
      </div>
    );
  }

  return (
    <article className="max-w-5xl mx-auto py-12 md:py-20 px-4">
      <Helmet>
        <title>{post.title} | Blog CMS</title>
        <meta name="description" content={post.summary} />
      </Helmet>

      <Link 
        to="/" 
        className="inline-flex items-center text-gray-500 hover:text-google-blue font-bold transition-colors mb-10 group"
      >
        <ChevronLeft size={20} className="mr-1 group-hover:-translate-x-1 transition-transform" />
        Explorar más artículos
      </Link>

      <div className="max-w-4xl mx-auto">
        <PostHeader post={post} />
        
        {/* Placeholder for Featured Image if not exists */}
        <div className="w-full aspect-video bg-gradient-to-br from-primary-50 to-blue-50 rounded-[2.5rem] mb-12 flex items-center justify-center overflow-hidden border border-primary-100/50 shadow-inner">
           <div className="text-primary-200 opacity-50 select-none transform -rotate-12 scale-150">
             <span className="text-9xl font-black">BLOG</span>
           </div>
        </div>

        <PostContent post={post} />
        <PostTags post={post} />
        
        <CommentsSection postId={post.id} />
      </div>
    </article>
  );
};
