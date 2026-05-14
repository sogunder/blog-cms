import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { postService } from '../../services/post.service';
import type { Post } from '../../types';
import { toast } from 'sonner';
import { Clock, ArrowRight } from 'lucide-react';

export const HomePage = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      setIsLoading(true);
      const data = await postService.getPublishedPosts(1, 10);
      setPosts(data.data);
    } catch (error) {
      toast.error('Error al cargar las entradas');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-20 py-12">
      {/* Hero Section */}
      <section className="text-center space-y-8">
        <div className="inline-flex items-center space-x-2 bg-blue-50 px-4 py-2 rounded-full border border-blue-100">
          <span className="flex h-2 w-2 rounded-full bg-google-blue animate-pulse"></span>
          <span className="text-sm font-bold text-google-blue uppercase tracking-widest">Plataforma de Nueva Generación</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 tracking-tight leading-tight">
          Bienvenido a <span className="text-google-blue">Blog CMS</span>
        </h1>
        <p className="text-xl text-gray-500 max-w-3xl mx-auto leading-relaxed font-medium">
          Una plataforma de blog moderna y de alto rendimiento construida con React 19, NestJS y MongoDB. 
          Diseñada para ofrecer velocidad, diseño y una experiencia de usuario excepcional.
        </p>
      </section>

      {/* Latest Posts */}
      <section className="space-y-12">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Últimas Entradas</h2>
          <Link to="/posts" className="text-google-blue font-bold flex items-center hover:underline">
            Ver todas <ArrowRight size={18} className="ml-1" />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-3xl border border-gray-100 shadow-sm h-80 animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map(post => (
              <Link 
                key={post.id} 
                to={`/post/${post.slug}`}
                className="group bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-xl hover:shadow-gray-200/50 transition-all hover:-translate-y-1 flex flex-col"
              >
                <div className="p-8 flex-1 flex flex-col">
                  <div className="flex items-center space-x-3 mb-4">
                    <span className="bg-blue-50 text-google-blue px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest">
                      {post.category.name}
                    </span>
                    <span className="text-gray-400 text-xs font-bold flex items-center">
                      <Clock size={12} className="mr-1" />
                      {new Date(post.publishedAt || post.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-google-blue transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-gray-500 text-sm font-medium line-clamp-3 mb-6">
                    {post.summary}
                  </p>
                  <div className="mt-auto flex items-center justify-between pt-6 border-t border-gray-50">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 text-xs font-bold border border-gray-100">
                        {post.author.name.charAt(0)}
                      </div>
                      <span className="text-xs font-bold text-gray-900">{post.author.name}</span>
                    </div>
                    <span className="text-google-blue font-bold text-sm inline-flex items-center group-hover:translate-x-1 transition-transform">
                      Leer más <ArrowRight size={14} className="ml-1" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {!isLoading && posts.length === 0 && (
          <div className="bg-gray-50 rounded-3xl border border-dashed border-gray-200 p-20 text-center">
            <p className="text-gray-400 font-bold text-lg">No hay entradas publicadas aún.</p>
          </div>
        )}
      </section>
    </div>
  );
};
