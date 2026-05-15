import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  Search,
  Shield,
  Code,
  Briefcase,
  Cloud,
  Zap,
  ArrowRight,
  Clock,
} from 'lucide-react';

import { categoryService } from '../../services/category.service';
import { postService } from '../../services/post.service';

import type { Category, Post } from '../../types';

import { toast } from 'sonner';

const categoryIcons: Record<string, React.ReactNode> = {
  Ciberseguridad: <Shield size={32} />,
  'Desarrollo Web': <Code size={32} />,
  'Gestión y Negocios': <Briefcase size={32} />,
  'Infraestructura y Cloud': <Cloud size={32} />,
  'Inteligencia Artificial': <Zap size={32} />,
};

const categoryDescriptions: Record<string, string> = {
  Ciberseguridad:
    'Seguridad ofensiva, protección y buenas prácticas.',
  'Desarrollo Web':
    'Frontend moderno, React y arquitecturas escalables.',
  'Gestión y Negocios':
    'Productividad, estrategia y transformación digital.',
  'Infraestructura y Cloud':
    'Cloud computing, DevOps y despliegues modernos.',
  'Inteligencia Artificial':
    'IA generativa, automatización y machine learning.',
};

const categoryColors: Record<
  string,
  {
    bg: string;
    border: string;
    icon: string;
    accent: string;
  }
> = {
  Ciberseguridad: {
    bg: 'bg-red-50',
    border: 'border-red-100',
    icon: 'text-red-600',
    accent: 'bg-red-100/50',
  },

  'Desarrollo Web': {
    bg: 'bg-blue-50',
    border: 'border-blue-100',
    icon: 'text-blue-600',
    accent: 'bg-blue-100/50',
  },

  'Gestión y Negocios': {
    bg: 'bg-amber-50',
    border: 'border-amber-100',
    icon: 'text-amber-600',
    accent: 'bg-amber-100/50',
  },

  'Infraestructura y Cloud': {
    bg: 'bg-purple-50',
    border: 'border-purple-100',
    icon: 'text-purple-600',
    accent: 'bg-purple-100/50',
  },

  'Inteligencia Artificial': {
    bg: 'bg-emerald-50',
    border: 'border-emerald-100',
    icon: 'text-emerald-600',
    accent: 'bg-emerald-100/50',
  },
};

export const ExplorePage = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const articlesContainerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);

      const [categoriesData, postsData] = await Promise.all([
        categoryService.getCategories(),
        postService.getPublishedPosts(1, 6),
      ]);

      setCategories(categoriesData);
      setPosts(postsData.data);
    } catch (error) {
      toast.error('Error al cargar los datos');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      post.summary
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase());

    const matchesCategory =
      !selectedCategory ||
      post.category?.id === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setTimeout(() => {
      articlesContainerRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }, 0);
  };

  const handleClearFilter = () => {
    setSelectedCategory(null);
  };

  const selectedCategoryName = categories.find(
    (c) => c.id === selectedCategory
  )?.name;

  const handleSearchResultClick = (slug: string) => {
    setShowDropdown(false);
    setSearchQuery('');
    navigate(`/post/${slug}`);
  };

  return (
    <div className="space-y-28 py-12 md:py-20">
      <Helmet>
        <title>Explorar | Blog CMS</title>

        <meta
          name="description"
          content="Explora contenido moderno sobre tecnología, desarrollo e inteligencia artificial"
        />
      </Helmet>

      {/* Hero */}
      <section className="px-4">
        <div className="max-w-5xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center space-x-2 bg-blue-50 px-4 py-2 rounded-full border border-blue-100">
            <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse"></span>

            <span className="text-sm font-bold text-blue-600 uppercase tracking-widest">
              Exploración de contenido
            </span>
          </div>

          <div className="space-y-5">
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-gray-900 leading-tight">
              Explora contenido{' '}
              <span className="text-blue-600">
                tecnológico moderno
              </span>
            </h1>

            <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto font-medium">
              Descubre artículos y contenido sobre
              desarrollo, infraestructura, inteligencia
              artificial y tecnologías modernas.
            </p>
          </div>

          {/* Search */}
          <div
            className="max-w-2xl mx-auto relative"
            ref={searchContainerRef}
          >
            <div className="relative">
              <Search
                size={20}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              />

              <input
                type="text"
                placeholder="Buscar artículos..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowDropdown(e.target.value.length > 0);
                }}
                onFocus={() => {
                  if (searchQuery.length > 0) {
                    setShowDropdown(true);
                  }
                }}
                className="w-full pl-12 pr-5 py-4 rounded-2xl border-2 border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-600 transition-all font-medium"
              />

              {/* Search Dropdown */}
              {showDropdown && searchQuery && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-gray-100 shadow-xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  {filteredPosts.length > 0 ? (
                    <div className="max-h-[420px] overflow-y-auto">
                      {filteredPosts
                        .slice(0, 5)
                        .map((post, idx) => (
                          <button
                            key={post.id}
                            onClick={() =>
                              handleSearchResultClick(
                                post.slug
                              )
                            }
                            className={`w-full px-5 py-3.5 text-left hover:bg-blue-50 transition-colors flex items-start gap-3 ${
                              idx !==
                              Math.min(
                                filteredPosts.length - 1,
                                4
                              )
                                ? 'border-b border-gray-50'
                                : ''
                            }`}
                          >
                            <div className="flex-1 min-w-0">
                              <h4 className="font-bold text-gray-900 text-sm line-clamp-1">
                                {post.title}
                              </h4>
                              <div className="flex items-center gap-2 mt-1.5">
                                {post.category && (
                                  <span className="inline-block bg-gray-100 text-gray-700 px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                                    {
                                      post.category
                                        .name
                                    }
                                  </span>
                                )}
                                <span className="text-gray-400 text-[10px] font-medium flex items-center gap-1">
                                  <Clock size={10} />
                                  {new Date(
                                    post.publishedAt ||
                                      post.createdAt
                                  ).toLocaleDateString(
                                    'es-ES',
                                    {
                                      month: 'short',
                                      day: 'numeric',
                                    }
                                  )}
                                </span>
                              </div>
                            </div>
                            <ArrowRight
                              size={16}
                              className="text-blue-600 flex-shrink-0 mt-1 transition-transform"
                            />
                          </button>
                        ))}
                    </div>
                  ) : (
                    <div className="px-5 py-8 text-center">
                      <p className="text-gray-400 text-sm font-medium">
                        No se encontraron
                        artículos
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Categorías */}
      <section className="px-4">
        <div className="max-w-6xl mx-auto space-y-10">
          <div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
              Categorías
            </h2>

            <p className="text-lg text-gray-600 font-medium">
              Explora contenido por áreas tecnológicas
            </p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="h-64 rounded-2xl border border-gray-100 bg-white animate-pulse"
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((category) => {
                const colors =
                  categoryColors[category.name] ||
                  categoryColors['Desarrollo Web'];

                const Icon =
                  categoryIcons[category.name] || (
                    <Code size={32} />
                  );

                const postCount = posts.filter(
                  (post) =>
                    post.category?.id === category.id
                ).length;

                return (
                  <button
                    key={category.id}
                    onClick={() =>
                      handleCategoryClick(category.id)
                    }
                    className={`group ${colors.bg} ${colors.border} border rounded-2xl p-8 shadow-sm hover:shadow-xl hover:shadow-gray-200/50 transition-all hover:-translate-y-1 flex flex-col justify-between min-h-[260px] w-full text-left ${
                      selectedCategory === category.id
                        ? 'ring-2 ring-blue-600 ring-offset-2'
                        : ''
                    }`}
                  >
                    <div>
                      <div
                        className={`w-14 h-14 rounded-xl ${colors.accent} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}
                      >
                        <span className={colors.icon}>
                          {Icon}
                        </span>
                      </div>

                      <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                        {category.name}
                      </h3>

                      <p className="text-sm text-gray-600 leading-relaxed font-medium">
                        {
                          categoryDescriptions[
                            category.name
                          ]
                        }
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-5 mt-6 border-t border-gray-200/60">
                      <span className="text-sm font-bold text-gray-600">
                        {postCount}{' '}
                        {postCount === 1
                          ? 'artículo'
                          : 'artículos'}
                      </span>

                      <ArrowRight
                        size={18}
                        className="text-blue-600 group-hover:translate-x-1 transition-transform"
                      />
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Artículos destacados */}
      <section className="px-4" ref={articlesContainerRef}>
        <div className="max-w-6xl mx-auto space-y-10">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
                {selectedCategory
                  ? `Artículos de ${selectedCategoryName}`
                  : 'Artículos Destacados'}
              </h2>

              <div className="flex items-center gap-4">
                <p className="text-lg text-gray-600 font-medium">
                  {selectedCategory
                    ? `Mostrando ${filteredPosts.length} artículos`
                    : 'Contenido reciente y seleccionado'}
                </p>
                {selectedCategory && (
                  <button
                    onClick={handleClearFilter}
                    className="inline-flex items-center px-4 py-2 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors text-sm font-bold"
                  >
                    ✕ Limpiar filtro
                  </button>
                )}
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-80 bg-white rounded-2xl border border-gray-100 animate-pulse"
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post) => (
                <Link
                  key={post.id}
                  to={`/post/${post.slug}`}
                  className="group bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl hover:shadow-gray-200/50 transition-all hover:-translate-y-1 flex flex-col"
                >
                  {/* Placeholder */}
                  <div className="h-40 bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center group-hover:from-blue-200 group-hover:to-blue-100 transition-colors">
                    <span className="text-5xl font-bold text-blue-200 opacity-40">
                      {post.title.charAt(0)}
                    </span>
                  </div>

                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex items-center justify-between mb-4">
                      <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest">
                        {post.category?.name ??
                          'General'}
                      </span>

                      <span className="text-gray-400 text-xs font-bold flex items-center">
                        <Clock
                          size={12}
                          className="mr-1"
                        />

                        {new Date(
                          post.publishedAt ||
                            post.createdAt
                        ).toLocaleDateString()}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {post.title}
                    </h3>

                    <p className="text-sm text-gray-600 leading-relaxed font-medium line-clamp-3 flex-1 mb-6">
                      {post.summary}
                    </p>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-xs font-bold">
                          {(
                            post.author?.name ?? '?'
                          ).charAt(0)}
                        </div>

                        <span className="text-xs font-bold text-gray-900">
                          {post.author?.name ??
                            'Autor'}
                        </span>
                      </div>

                      <span className="text-blue-600 text-sm font-bold inline-flex items-center group-hover:translate-x-1 transition-transform">
                        Leer
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="px-4">
        <div className="max-w-4xl mx-auto rounded-3xl bg-gradient-to-r from-blue-600 to-blue-700 px-8 md:px-16 py-16 md:py-20 text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6">
            Descubre nuevas ideas y tecnologías
          </h2>

          <p className="text-xl text-blue-100 font-medium max-w-2xl mx-auto mb-10">
            Mantente actualizado con artículos y
            contenido moderno sobre tecnología y
            desarrollo.
          </p>

          <Link
            to="/"
            className="inline-flex items-center px-8 py-4 rounded-full bg-white text-blue-600 font-bold text-lg hover:bg-blue-50 transition-all hover:shadow-2xl hover:shadow-blue-700/30 hover:-translate-y-1"
          >
            Explorar artículos

            <ArrowRight
              size={20}
              className="ml-2"
            />
          </Link>
        </div>
      </section>
    </div>
  );
};