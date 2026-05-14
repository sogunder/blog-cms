import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { 
  Calendar, 
  ChevronLeft, 
  Clock, 
  Share2,
  Tag as TagIcon
} from 'lucide-react';
import type { Post } from '../../types';
import { postService } from '../../services/post.service';
import { toast } from 'sonner';

export const PostDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      loadPost(slug);
    }
  }, [slug]);

  const loadPost = async (postSlug: string) => {
    try {
      setIsLoading(true);
      const data = await postService.getPostBySlug(postSlug);
      setPost(data);
    } catch (error) {
      toast.error('No se pudo encontrar el artículo');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="max-w-4xl mx-auto py-24 text-center font-bold text-gray-500">Cargando artículo...</div>;
  }

  if (!post) {
    return (
      <div className="max-w-4xl mx-auto py-24 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Artículo no encontrado</h1>
        <Link to="/" className="text-google-blue font-bold flex items-center justify-center">
          <ChevronLeft size={20} className="mr-1" />
          Volver al inicio
        </Link>
      </div>
    );
  }

  return (
    <article className="max-w-4xl mx-auto py-12 md:py-20">
      <Helmet>
        <title>{post.title} | Blog CMS</title>
        <meta name="description" content={post.summary} />
      </Helmet>

      <Link to="/" className="inline-flex items-center text-gray-500 hover:text-google-blue font-bold transition-colors mb-10 group">
        <ChevronLeft size={20} className="mr-1 group-hover:-translate-x-1 transition-transform" />
        Volver al Inicio
      </Link>

      <header className="mb-12">
        <div className="flex items-center space-x-3 mb-6">
          <span className="bg-blue-50 text-google-blue px-4 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-widest border border-blue-100">
            {post.category.name}
          </span>
          <span className="flex items-center text-gray-400 text-sm font-medium">
            <Clock size={14} className="mr-1.5" />
            5 min de lectura
          </span>
        </div>
        
        <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 leading-tight tracking-tight mb-8">
          {post.title}
        </h1>

        <div className="flex flex-wrap items-center justify-between gap-6 pb-8 border-b border-gray-100">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-google-blue rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-100">
              {post.author.name.charAt(0)}
            </div>
            <div>
              <p className="text-gray-900 font-bold">{post.author.name}</p>
              <div className="flex items-center text-gray-400 text-xs font-bold uppercase tracking-wider">
                <Calendar size={12} className="mr-1" />
                {new Date(post.publishedAt || post.createdAt).toLocaleDateString('es-ES', { 
                  day: 'numeric', 
                  month: 'long', 
                  year: 'numeric' 
                })}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button className="p-3 text-gray-400 hover:text-google-blue hover:bg-blue-50 rounded-2xl transition-all">
              <Share2 size={20} />
            </button>
          </div>
        </div>
      </header>

      <div className="prose prose-lg prose-blue max-w-none mb-16">
        <p className="text-xl text-gray-500 font-medium leading-relaxed mb-8 italic border-l-4 border-google-blue pl-6">
          {post.summary}
        </p>
        <div 
          className="text-gray-800 leading-loose space-y-6 font-medium"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </div>

      <footer className="pt-12 border-t border-gray-100">
        <div className="flex items-center space-x-3 mb-8">
          <TagIcon size={18} className="text-gray-400" />
          <div className="flex flex-wrap gap-2">
            {post.tags.map(tag => (
              <span key={tag.id} className="bg-gray-50 text-gray-500 px-3 py-1 rounded-lg text-xs font-bold hover:bg-gray-100 transition-colors cursor-pointer">
                #{tag.name}
              </span>
            ))}
          </div>
        </div>

        <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100 text-center">
          <h3 className="text-xl font-bold text-gray-900 mb-2">¿Te gustó lo que leíste?</h3>
          <p className="text-gray-500 font-medium mb-6">Comparte este artículo con tu red o déjanos un comentario.</p>
          <button className="bg-google-blue text-white px-8 py-3 rounded-2xl font-bold hover:bg-blue-600 transition-all shadow-lg shadow-blue-100">
            Compartir Artículo
          </button>
        </div>
      </footer>
    </article>
  );
};
