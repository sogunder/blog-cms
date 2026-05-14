import { useState, useEffect, type FormEvent } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  Calendar,
  ChevronLeft,
  Clock,
  Share2,
  Tag as TagIcon,
  Send,
} from 'lucide-react';
import type { Post } from '../../types';
import { postService } from '../../services/post.service';
import { commentService } from '../../services/comment.service';
import { toast } from 'sonner';
import { getApiErrorMessage } from '../../utils/api-error';
import { estimateReadingMinutes } from '../../utils/reading-time';
import { useAuthStore } from '../../app/store/useAuthStore';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

export const PostDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const [commentContent, setCommentContent] = useState('');
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [sendingComment, setSendingComment] = useState(false);

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
    } catch {
      toast.error('No se pudo encontrar el artículo');
    } finally {
      setIsLoading(false);
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: post?.title, url });
      } else {
        await navigator.clipboard.writeText(url);
        toast.success('Enlace copiado al portapapeles');
      }
    } catch {
      toast.error('No se pudo compartir');
    }
  };

  const handleCommentSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!post) return;
    const content = commentContent.trim();
    if (content.length < 2) {
      toast.error('El comentario es demasiado corto');
      return;
    }
    if (!isAuthenticated) {
      if (!guestName.trim() || !guestEmail.trim()) {
        toast.error('Nombre y correo son obligatorios');
        return;
      }
    }
    try {
      setSendingComment(true);
      if (isAuthenticated) {
        await commentService.createComment({ post: post.id, content });
      } else {
        await commentService.createComment({
          post: post.id,
          content,
          guestName: guestName.trim(),
          guestEmail: guestEmail.trim(),
        });
      }
      toast.success('Comentario enviado. Quedará pendiente de moderación.');
      setCommentContent('');
      setGuestName('');
      setGuestEmail('');
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'No se pudo enviar el comentario'));
    } finally {
      setSendingComment(false);
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

  const authorName = post.author?.name ?? 'Autor';
  const authorInitial = authorName.charAt(0).toUpperCase();
  const categoryLabel = post.category?.name ?? 'General';
  const readMin = estimateReadingMinutes(post.content);

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
            {categoryLabel}
          </span>
          <span className="flex items-center text-gray-400 text-sm font-medium">
            <Clock size={14} className="mr-1.5" />
            {readMin} min de lectura
          </span>
        </div>

        <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 leading-tight tracking-tight mb-8">
          {post.title}
        </h1>

        <div className="flex flex-wrap items-center justify-between gap-6 pb-8 border-b border-gray-100">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-google-blue rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-100">
              {authorInitial}
            </div>
            <div>
              <p className="text-gray-900 font-bold">{authorName}</p>
              <div className="flex items-center text-gray-400 text-xs font-bold uppercase tracking-wider">
                <Calendar size={12} className="mr-1" />
                {new Date(post.publishedAt || post.createdAt).toLocaleDateString('es-ES', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => void handleShare()}
              className="p-3 text-gray-400 hover:text-google-blue hover:bg-blue-50 rounded-2xl transition-all"
              aria-label="Compartir"
            >
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
            {post.tags.map((tag) => (
              <span
                key={tag.id}
                className="bg-gray-50 text-gray-500 px-3 py-1 rounded-lg text-xs font-bold hover:bg-gray-100 transition-colors"
              >
                #{tag.name}
              </span>
            ))}
          </div>
        </div>

        <section className="bg-gray-50 p-8 rounded-3xl border border-gray-100 space-y-6">
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-1">Deja un comentario</h3>
            <p className="text-gray-500 text-sm font-medium">
              Los comentarios se revisan antes de publicarse.
            </p>
          </div>
          <form onSubmit={handleCommentSubmit} className="space-y-4">
            {!isAuthenticated && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Nombre"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  autoComplete="name"
                />
                <Input
                  label="Correo"
                  type="email"
                  value={guestEmail}
                  onChange={(e) => setGuestEmail(e.target.value)}
                  autoComplete="email"
                />
              </div>
            )}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Mensaje</label>
              <textarea
                className="w-full p-4 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-google-blue focus:border-transparent transition-all outline-none min-h-[120px] text-sm font-medium"
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
                placeholder="Escribe tu comentario..."
                minLength={2}
                maxLength={8000}
                required
              />
            </div>
            <Button
              type="submit"
              className="bg-google-blue hover:bg-blue-600 rounded-2xl"
              isLoading={sendingComment}
            >
              <Send size={16} className="mr-2" />
              Enviar comentario
            </Button>
          </form>
        </section>
      </footer>
    </article>
  );
};
