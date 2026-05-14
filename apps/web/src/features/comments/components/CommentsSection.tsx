import { useEffect, useState } from 'react';
import type { Comment } from '../../../types';
import { commentService } from '../../../services/comment.service';
import { CommentList } from './CommentList';
import { CommentForm } from './CommentForm';
import { MessageSquare } from 'lucide-react';

interface CommentsSectionProps {
  postId: string;
}

export const CommentsSection = ({ postId }: CommentsSectionProps) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadComments = async () => {
    try {
      setIsLoading(true);
      const data = await commentService.getCommentsByPost(postId);
      setComments(data);
    } catch (error) {
      console.error('Failed to load comments:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (postId) {
      loadComments();
    }
  }, [postId]);

  return (
    <section id="comments" className="py-12 border-t border-gray-100 mt-8">
      <div className="flex items-center space-x-3 mb-10">
        <div className="bg-google-blue/10 p-2.5 rounded-2xl">
          <MessageSquare className="text-google-blue" size={24} />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">
          Comentarios {comments.length > 0 && `(${comments.length})`}
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-7 space-y-12">
          <CommentList comments={comments} isLoading={isLoading} />
        </div>
        <div className="lg:col-span-5">
          <div className="sticky top-24">
            <CommentForm postId={postId} />
          </div>
        </div>
      </div>
    </section>
  );
};
