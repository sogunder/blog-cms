import type { Comment } from '../../../types';
import { CommentItem } from './CommentItem';
import { MessageSquareOff } from 'lucide-react';

interface CommentListProps {
  comments: Comment[];
  isLoading?: boolean;
}

export const CommentList = ({ comments, isLoading }: CommentListProps) => {
  if (isLoading) {
    return (
      <div className="space-y-6">
        {[1, 2].map((i) => (
          <div key={i} className="flex space-x-4 animate-pulse">
            <div className="w-10 h-10 bg-gray-200 rounded-xl" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-1/4" />
              <div className="h-20 bg-gray-100 rounded-2xl" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (comments.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
        <MessageSquareOff size={32} className="mx-auto text-gray-300 mb-3" />
        <p className="text-gray-500 font-medium">Sé el primero en comentar este artículo.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {comments.map((comment) => (
        <CommentItem key={comment.id} comment={comment} />
      ))}
    </div>
  );
};
