import { Calendar } from 'lucide-react';
import type { Comment } from '../../../types';

interface CommentItemProps {
  comment: Comment;
}

export const CommentItem = ({ comment }: CommentItemProps) => {
  const authorName = comment.user?.name || 'Anónimo';
  const authorInitial = authorName.charAt(0).toUpperCase();
  const dateLabel = new Date(comment.createdAt).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="flex space-x-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="flex-shrink-0">
        <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-gray-500 font-bold text-lg">
          {authorInitial}
        </div>
      </div>
      <div className="flex-1 space-y-2">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-bold text-gray-900">{authorName}</h4>
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center">
            <Calendar size={10} className="mr-1" />
            {dateLabel}
          </span>
        </div>
        <div className="bg-white border border-gray-100 p-4 rounded-2xl text-sm text-gray-700 leading-relaxed shadow-sm">
          {comment.content}
        </div>
      </div>
    </div>
  );
};
