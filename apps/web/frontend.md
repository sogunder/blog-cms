# Blog CMS - Frontend (Web)

La interfaz de usuario del Blog CMS es una Single Page Application (SPA) moderna que permite a los usuarios gestionar y consumir contenido de forma intuitiva.

## Experiencia de Usuario (CMS)
El objetivo es que cualquier usuario pueda administrar su blog sin conocimientos técnicos:
- **Panel de Administración**: Un espacio privado para escribir, editar y organizar artículos.
- **Editor Enriquecido**: Integración de un editor de texto con formato (Rich Text) para crear contenido visualmente atractivo.
- **Gestión Visual**: Subida y previsualización de imágenes de portada.

## Características Principales
- **Dashboard**: Vista general con estadísticas (vistas, comentarios, likes).
- **Gestión de Posts**: Listado con filtros por estado (publicado/borrador), categorías y etiquetas.
- **Sección de Comentarios**: Moderación de comentarios de los lectores.
- **Perfil de Usuario**: Configuración de datos del autor y cambio de roles.

## Tecnologías y UI/UX
- **React 19 & TypeScript**: Para una interfaz rápida y libre de errores de tipo.
- **SEO & Performance**: Renderizado optimizado y manejo de slugs para mejorar el posicionamiento.
- **Interactividad**: Botones de "Like", sistemas de compartición y carga infinita o paginación.
- **Responsive Design**: Totalmente adaptado para administrar el blog desde móviles o tablets.

## Flujo de Trabajo
1. **Creación**: El editor escribe en el editor enriquecido.
2. **Organización**: Se asignan categorías y etiquetas mediante selectores intuitivos.
3. **Publicación**: El post se guarda como borrador o se publica instantáneamente.
