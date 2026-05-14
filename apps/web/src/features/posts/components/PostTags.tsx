import { Tag as TagIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Post } from '../../../types';

interface PostTagsProps {
  post: Post;
}

export const PostTags = ({ post }: PostTagsProps) => {
  if (!post.tags || post.tags.length === 0) return null;

  return (
    <div className="flex items-center space-x-3 py-10 border-t border-gray-100">
      <TagIcon size={18} className="text-gray-400" />
      <div className="flex flex-wrap gap-2">
        {post.tags.map((tag) => (
          <Link
            key={tag.id}
            to={`/tag/${tag.slug}`}
            className="bg-gray-50 text-gray-500 px-3 py-1.5 rounded-xl text-xs font-bold hover:bg-gray-100 hover:text-google-blue transition-all border border-transparent hover:border-gray-200"
          >
            #{tag.name}
          </Link>
        ))}
      </div>
    </div>
  );
};
