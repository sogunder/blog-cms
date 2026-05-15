import { Mail, Zap, Lock, Smartphone, Search, TrendingUp, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

export const AboutPage = () => {
  const features = [
    {
      icon: Zap,
      title: 'Alto rendimiento',
      description: 'Carga ultrarrápida con optimizaciones de vanguardia y CDN global'
    },
    {
      icon: Lock,
      title: 'Seguridad',
      description: 'Autenticación JWT avanzada y encriptación de datos en tránsito'
    },
    {
      icon: Smartphone,
      title: 'Responsive',
      description: 'Diseño adaptable perfecto en cualquier dispositivo y pantalla'
    },
    {
      icon: Search,
      title: 'SEO',
      description: 'Optimizado para motores de búsqueda con metadatos completos'
    },
    {
      icon: TrendingUp,
      title: 'Escalable',
      description: 'Arquitectura preparada para crecer sin limitaciones'
    },
    {
      icon: CheckCircle,
      title: 'Gestión de contenido',
      description: 'Editor intuitivo y panel de control poderoso'
    }
  ];

  const stats = [
    { value: '+500', label: 'Publicaciones' },
    { value: '+10', label: 'Categorías' },
    { value: '99.9%', label: 'Uptime' },
    { value: 'Ultra', label: 'Alto rendimiento' }
  ];

  const technologies = [
    'React 19',
    'NestJS',
    'MongoDB',
    'TailwindCSS',
    'JWT',
    'Cloud'
  ];

  const team = [
    {
      role: 'Administrador Principal',
      description: 'Liderazgo estratégico y gestión del proyecto'
    },
    {
      role: 'Editor de Contenido',
      description: 'Creación y curación de contenido de calidad'
    },
    {
      role: 'Backend Developer',
      description: 'Desarrollo de APIs robustas y escalables'
    },
    {
      role: 'UI/UX Designer',
      description: 'Diseño limpio y experiencia de usuario excepcional'
    }
  ];

  return (
    <div className="space-y-32 py-12 md:py-20">
      <Helmet>
        <title>Sobre Nosotros | Blog CMS</title>
        <meta name="description" content="Conoce la historia, misión y equipo detrás de BlogCMS" />
      </Helmet>

      {/* Hero Section */}
      <section className="text-center space-y-8 px-4">
        <div className="inline-flex items-center space-x-2 bg-blue-50 px-4 py-2 rounded-full border border-blue-100">
          <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse"></span>
          <span className="text-sm font-bold text-blue-600 uppercase tracking-widest">
            Nuestra Historia
          </span>
        </div>
        
        <div className="space-y-4">
          <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 tracking-tight leading-tight">
            Construyendo el futuro<br />
            del contenido digital
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed font-medium">
            <span className="text-blue-600 font-bold">BlogCMS</span> nació con una misión: 
            revolucionar la forma en que se crean, gestionan y comparten contenidos en línea.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Link
            to="/"
            className="inline-flex items-center justify-center px-8 py-3 rounded-full bg-blue-600 text-white font-bold hover:bg-blue-700 transition-all hover:shadow-lg hover:shadow-blue-600/30 hover:-translate-y-0.5"
          >
            Explorar Blog
          </Link>
          <button
            onClick={() => alert('Formulario de contacto')}
            className="inline-flex items-center justify-center px-8 py-3 rounded-full border-2 border-gray-200 text-gray-900 font-bold hover:border-blue-600 hover:text-blue-600 transition-all hover:shadow-lg hover:shadow-blue-600/10"
          >
            <Mail size={18} className="mr-2" />
            Contactar
          </button>
        </div>
      </section>

      {/* Historia y Estadísticas */}
      <section className="space-y-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-8">
            Nuestra Historia
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed mb-8 font-medium">
            BlogCMS surge como respuesta a un problema común: la necesidad de una plataforma 
            de blogging moderna, rápida y fácil de usar. Combinamos las mejores tecnologías 
            actuales con un enfoque centrado en el usuario.
          </p>
          <p className="text-lg text-gray-600 leading-relaxed font-medium">
            Desde su lanzamiento, hemos ayudado a miles de creadores, empresas y profesionales 
            a compartir su voz con el mundo. Nuestro compromiso es continuar innovando para 
            ofrecerte las herramientas que necesitas para tener éxito.
          </p>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center hover:shadow-xl hover:shadow-gray-200/50 transition-all hover:-translate-y-1"
            >
              <div className="text-4xl md:text-5xl font-extrabold text-blue-600 mb-2">
                {stat.value}
              </div>
              <p className="text-gray-600 font-bold">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Características */}
      <section className="space-y-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
            Características Principales
          </h2>
          <p className="text-lg text-gray-600 font-medium">
            Diseñadas para ofrecerte el mejor desempeño
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, idx) => {
            const IconComponent = feature.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 hover:shadow-xl hover:shadow-gray-200/50 transition-all hover:-translate-y-1"
              >
                <div className="bg-blue-50 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                  <IconComponent size={24} className="text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 font-medium">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Misión, Visión, Valores */}
      <section className="space-y-12 px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">
            Misión, Visión y Valores
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 p-8 hover:shadow-lg transition-all hover:-translate-y-1">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Misión</h3>
            <p className="text-gray-700 font-medium leading-relaxed">
              Proporcionar la plataforma de blogging más intuitiva, rápida y segura del mercado, 
              empoderando a creadores de contenido en todo el mundo.
            </p>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 p-8 hover:shadow-lg transition-all hover:-translate-y-1">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Visión</h3>
            <p className="text-gray-700 font-medium leading-relaxed">
              Ser la plataforma de referencia para la gestión de contenido, revolucionando 
              cómo se publican y descubren historias en Internet.
            </p>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 p-8 hover:shadow-lg transition-all hover:-translate-y-1">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Valores</h3>
            <p className="text-gray-700 font-medium leading-relaxed">
              Innovación, calidad, transparencia y compromiso con la excelencia en cada 
              aspecto de nuestro trabajo.
            </p>
          </div>
        </div>
      </section>

      {/* Tecnologías */}
      <section className="space-y-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
            Stack Tecnológico
          </h2>
          <p className="text-lg text-gray-600 font-medium mb-12">
            Construido con las mejores herramientas modernas
          </p>

          <div className="flex flex-wrap gap-3">
            {technologies.map((tech, idx) => (
              <span
                key={idx}
                className="inline-flex items-center px-4 py-2 rounded-full bg-blue-50 border border-blue-200 text-blue-700 font-bold text-sm hover:bg-blue-100 transition-colors cursor-default"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Equipo */}
      <section className="space-y-12 px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">
            Nuestro Equipo
          </h2>
          <p className="text-lg text-gray-600 font-medium mt-4">
            Profesionales dedicados a la excelencia
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {team.map((member, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 hover:shadow-xl hover:shadow-gray-200/50 transition-all hover:-translate-y-1"
            >
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-lg mb-4">
                {(member.role.charAt(0))}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{member.role}</h3>
              <p className="text-gray-600 font-medium">{member.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Final */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-3xl px-8 md:px-16 py-16 md:py-20 text-center max-w-4xl mx-auto mx-4">
        <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6">
          ¿Listo para empezar?
        </h2>
        <p className="text-xl text-blue-100 mb-8 font-medium">
          Únete a miles de creadores que ya utilizan BlogCMS
        </p>
        <Link
          to="/"
          className="inline-flex items-center px-8 py-4 rounded-full bg-white text-blue-600 font-bold text-lg hover:bg-blue-50 transition-all hover:shadow-2xl hover:shadow-blue-600/30 hover:-translate-y-1"
        >
          Comenzar Ahora
        </Link>
      </section>
    </div>
  );
};
