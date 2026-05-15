import { Mail, Zap, Lock, ScanEye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

export const AboutPage = () => {
  const features = [
    {
      icon: Zap,
      title: 'Rápido',
      description: 'Carga optimizada para la mejor experiencia de lectura'
    },
    {
      icon: Lock,
      title: 'Seguro',
      description: 'Autenticación segura y datos protegidos'
    },
    {
      icon: ScanEye ,
      title: 'Diseño Moderno',
      description: 'Interfaz limpia enfocada en una experiencia de lectura agradable'
    }
  ];

  const technologies = [
    {
      name: 'React 19',
      description: 'Interfaz moderna y reactiva'
    },
    {
      name: 'TypeScript',
      description: 'Código seguro y mantenible'
    },
    {
      name: 'MongoDB',
      description: 'Base de datos flexible y escalable'
    },
    {
      name: 'NestJS',
      description: 'Backend robusto y estructurado'
    },
    {
      name: 'JWT',
      description: 'Autenticación segura'
    },
    {
      name: 'TailwindCSS',
      description: 'Estilos modernos y consistentes'
    }
  ];

  return (
    <div className="space-y-32 py-12 md:py-20">
      <Helmet>
        <title>Sobre Nosotros | Blog CMS</title>
        <meta name="description" content="BlogCMS - Una plataforma moderna para crear y compartir contenido" />
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
            onClick={() => alert('blogCMS@gmail.com')}
            className="inline-flex items-center justify-center px-8 py-3 rounded-full border-2 border-gray-200 text-gray-900 font-bold hover:border-blue-600 hover:text-blue-600 transition-all hover:shadow-lg hover:shadow-blue-600/10"
          >
            <Mail size={18} className="mr-2" />
            Contactar
          </button>
        </div>
      </section>

      {/* Historia */}
      <section className="space-y-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-8">
            Nuestra Historia
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed mb-6 font-medium">
            BlogCMS es una plataforma moderna diseñada para crear y compartir contenido de forma sencilla. 
            Creemos que el contenido de calidad no necesita ser complicado.
          </p>
          <p className="text-lg text-gray-600 leading-relaxed font-medium">
            Nuestro enfoque es ofrecer las herramientas necesarias para que puedas enfocarte en lo que realmente 
            importa: tu contenido.
          </p>
        </div>
      </section>

      {/* Características */}
      <section className="space-y-12 px-4">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
            Diseñado para la Simplicidad
          </h2>
          <p className="text-lg text-gray-600 font-medium max-w-2xl mx-auto">
            Una plataforma moderna que pone el contenido en primer lugar
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {features.map((feature, idx) => {
            const IconComponent = feature.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 hover:shadow-xl hover:shadow-gray-200/50 transition-all hover:-translate-y-1 text-center"
              >
                <div className="bg-blue-50 w-12 h-12 rounded-xl flex items-center justify-center mb-4 mx-auto">
                  <IconComponent size={24} className="text-blue-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 font-medium text-sm">{feature.description}</p>
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

      {/* Tecnologías y Arquitectura */}
      <section className="space-y-12 px-4">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
            Tecnologías y Arquitectura
          </h2>
          <p className="text-lg text-gray-600 font-medium max-w-2xl mx-auto">
            Construido con herramientas modernas y escalables
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {technologies.map((tech, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-xl hover:shadow-gray-200/50 transition-all hover:-translate-y-1 text-center"
            >
              <h3 className="text-lg font-bold text-gray-900 mb-2">{tech.name}</h3>
              <p className="text-gray-600 font-medium text-sm">{tech.description}</p>
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
