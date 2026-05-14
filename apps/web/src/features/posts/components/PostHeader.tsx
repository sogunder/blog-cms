import { Calendar, Clock, Share2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Post } from '../../../types';
import { estimateReadingMinutes } from '../../../utils/reading-time';
import { toast } from 'sonner';

interface PostHeaderProps {
  post: Post;
}

export const PostHeader = ({ post }: PostHeaderProps) => {
  const authorName = post.author?.name ?? 'Autor';
  const authorInitial = authorName.charAt(0).toUpperCase();
  const categoryLabel = post.category?.name ?? 'General';
  const readMin = estimateReadingMinutes(post.content);

  const handleShare = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: post.title, url });
      } else {
        await navigator.clipboard.writeText(url);
        toast.success('Enlace copiado al portapapeles');
      }
    } catch {
      toast.error('No se pudo compartir');
    }
  };

  return (
    <header className="mb-12">
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <Link
          to={`/category/${post.category?.slug ?? ''}`}
          className="bg-primary-50 text-google-blue px-4 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-widest border border-primary-100 hover:bg-primary-100 transition-colors"
        >
          {categoryLabel}
        </Link>
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
            <p className="text-gray-900 font-bold leading-tight">{authorName}</p>
            <div className="flex items-center text-gray-400 text-xs font-bold uppercase tracking-wider mt-1">
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
            className="p-3 text-gray-400 hover:text-google-blue hover:bg-primary-50 rounded-2xl transition-all"
            title="Compartir"
          >
            <Share2 size={20} />
          </button>
        </div>
      </div>
    </header>
  );
};
