# Blog CMS - Backend (API)

Este backend es el motor del Sistema de Gestión de Contenido (CMS), diseñado para ser robusto, escalable y fácil de administrar, similar a un "mini-WordPress".

## ¿Qué es este CMS?
Es un sistema que permite administrar contenido sin tocar código. El backend proporciona todas las herramientas necesarias para gestionar el ciclo de vida de las publicaciones, desde el borrador hasta la publicación final.

## Arquitectura de Módulos (NestJS)
El proyecto está organizado en módulos claros para mantener la separación de responsabilidades:

- **Auth**: Gestión de autenticación y tokens JWT.
- **Users**: Administración de perfiles y roles (Admin, Editor, Lector).
- **Posts**: El núcleo del blog; creación, edición, eliminación y estados (borrador/publicado).
- **Categories**: Organización jerárquica del contenido.
- **Tags**: Etiquetas específicas para mejorar la búsqueda y SEO.
- **Comments**: Interacción de los usuarios con las publicaciones.
- **Uploads**: Gestión de archivos multimedia e imágenes para los artículos.

## Modelo de Datos y Relaciones
Propuesta inicial de relaciones (ej. PostgreSQL/Prisma):
- **User → Posts (1:N)**: Un autor puede tener muchos artículos.
- **Post → Comments (1:N)**: Un artículo puede recibir múltiples comentarios.
- **Post → Categories (N:1)**: Cada artículo pertenece a una categoría principal.
- **Post → Tags (N:N)**: Los artículos pueden tener múltiples etiquetas y viceversa.

## Funcionalidades Técnicas
- **SEO Ready**: Generación automática de slugs amigables.
- **Seguridad**: Control de acceso basado en roles (RBAC).
- **Persistencia**: Manejo de borradores y programación de publicaciones.
- **Interacción**: Sistema de likes y contador de vistas por post.
- **Búsqueda**: Filtros avanzados y paginación de resultados.
