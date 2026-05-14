import type { Post } from '../../../types';

interface PostContentProps {
  post: Post;
}

export const PostContent = ({ post }: PostContentProps) => {
  return (
    <div className="mb-16">
      {post.summary && (
        <p className="text-xl md:text-2xl text-gray-500 font-medium leading-relaxed mb-10 italic border-l-4 border-google-blue pl-6 py-2">
          {post.summary}
        </p>
      )}
      
      <div
        className="prose prose-lg md:prose-xl prose-blue max-w-none text-gray-800 leading-loose space-y-6"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
    </div>
  );
};
