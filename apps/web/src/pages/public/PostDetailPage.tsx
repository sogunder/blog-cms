import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import type { Post } from '../../types';

// Mock post for demonstration
const MOCK_POST: Post = {
  id: '1',
  title: 'Primeros pasos con React 19',
  slug: 'primeros-pasos-react-19',
  content: `
    <p>¡React 19 ya está aquí! Esta versión trae muchas características nuevas y emocionantes que hacen que el desarrollo web sea aún más agradable y eficiente.</p>
    <h2>Nuevos Hooks</h2>
    <p>Una de las características más comentadas es la introducción de varios hooks nuevos que simplifican la gestión del estado y los efectos secundarios.</p>
    <h2>Mejor Rendimiento</h2>
    <p>El equipo de React ha trabajado duro en optimizaciones internas que conducen a un renderizado más rápido y tamaños de paquete más pequeños.</p>
  `,
  summary: 'Una guía rápida sobre las nuevas características de React 19.',
  status: 'published',
  views: 1250,
  author: { id: 'v1', name: 'Vicente Admin', email: '', role: 'admin', createdAt: '' },
  category: { id: 'c1', name: 'Desarrollo', slug: 'dev' },
  tags: [{ id: 't1', name: 'React', slug: 'react' }, { id: 't2', name: 'Frontend', slug: 'frontend' }],
  createdAt: '2026-05-10T10:00:00Z',
  updatedAt: '2026-05-10T10:00:00Z',
};

export const PostDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  
  // In a real app, we would fetch the post using the slug with useQuery
  const post = MOCK_POST; 

  if (!post) {
    return <div className="text-center py-20 text-gray-500 font-bold">Post no encontrado.</div>;
  }

  return (
    <article className="max-w-3xl mx-auto py-12">
      <Helmet>
        <title>{post.title} | Blog CMS</title>
        <meta name="description" content={post.summary} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.summary} />
        <meta property="og:type" content="article" />
      </Helmet>

      <header className="mb-10">
        <div className="flex items-center space-x-2 text-sm text-google-blue font-bold mb-4 uppercase tracking-widest">
          <span>{post.category.name}</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 leading-tight tracking-tight">
          {post.title}
        </h1>
        <div className="flex items-center text-gray-500 text-sm font-medium">
          <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-google-blue mr-3 font-bold border border-blue-100">
            {post.author.name.charAt(0)}
          </div>
          <span>Por <span className="text-gray-900 font-bold">{post.author.name}</span></span>
          <span className="mx-3 text-gray-300">•</span>
          <span>{new Date(post.createdAt).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
          <span className="mx-3 text-gray-300">•</span>
          <span>{post.views} vistas</span>
        </div>
      </header>

      <div 
        className="prose prose-blue lg:prose-xl max-w-none"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      <footer className="mt-16 pt-8 border-t border-gray-100">
        <div className="flex flex-wrap gap-2">
          {post.tags.map(tag => (
            <span 
              key={tag.id} 
              className="px-4 py-1.5 bg-gray-100 text-gray-600 rounded-xl text-sm font-bold hover:bg-blue-50 hover:text-google-blue transition-colors cursor-pointer"
            >
              #{tag.name}
            </span>
          ))}
        </div>
      </footer>
    </article>
  );
};
