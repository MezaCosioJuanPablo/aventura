# Red Social de Aventuras en Acapulco 🏄‍♂️

## Descripción del Proyecto

Este proyecto implementa una red social para compartir aventuras y experiencias en Acapulco, desarrollado como parte de la evaluación universitaria de proyectos Full Stack.

## Arquitectura del Sistema

El proyecto está construido siguiendo una arquitectura de microservicios:

### Microservicios

- **post-service** (Antonio): Gestión de publicaciones, fotos y comentarios
- **user-service** (Juan Pablo): Registro, login y seguimiento de usuarios

### Tecnologías Utilizadas

- **Backend**: Java Spring Boot 3.5.3 con arquitectura MVC
- **Base de Datos**: MySQL 8.0
- **Mensajería**: RabbitMQ para comunicación entre servicios
- **Documentación**: Swagger/OpenAPI
- **Seguridad**: JWT Authentication
- **Contenedores**: Docker y Docker Compose

## Estructura del Proyecto

```
aventura/
├── docker-compose.yml          # Orquestación de servicios
├── postservice/                # Microservicio de publicaciones
│   ├── src/main/java/com/aca/postservice/
│   │   ├── controller/         # Controladores REST
│   │   ├── service/           # Lógica de negocio
│   │   ├── repository/        # Acceso a datos
│   │   ├── model/            # Entidades JPA
│   │   ├── dto/              # Objetos de transferencia
│   │   ├── config/           # Configuraciones
│   │   └── event/            # Eventos para RabbitMQ
│   ├── Dockerfile            # Imagen Docker
│   └── pom.xml               # Dependencias Maven
└── userservice/               # Microservicio de usuarios
    ├── src/main/java/com/aca/userservice/
    │   ├── controller/        # Controladores REST
    │   ├── service/          # Lógica de negocio
    │   ├── repository/       # Acceso a datos
    │   ├── model/           # Entidades JPA
    │   ├── dto/             # Objetos de transferencia
    │   ├── config/          # Configuraciones
    │   └── event/           # Eventos para RabbitMQ
    ├── Dockerfile           # Imagen Docker
    └── pom.xml              # Dependencias Maven
```

## Funcionalidades del Post Service

### Endpoints Principales

- `POST /api/posts` - Crear nueva publicación
- `GET /api/posts` - Obtener todas las publicaciones (con paginación)
- `GET /api/posts/{id}` - Obtener publicación por ID
- `GET /api/posts/user/{userId}` - Obtener publicaciones por usuario
- `GET /api/posts/search` - Buscar publicaciones por ubicación/tipo
- `GET /api/posts/feed` - Obtener feed de usuarios seguidos
- `PUT /api/posts/{id}` - Actualizar publicación
- `DELETE /api/posts/{id}` - Eliminar publicación
- `POST /api/posts/{id}/like` - Dar like a publicación
- `DELETE /api/posts/{id}/like` - Quitar like de publicación

### Endpoints de Comentarios

- `POST /api/comments` - Crear nuevo comentario
- `GET /api/comments/post/{postId}` - Obtener comentarios por post
- `DELETE /api/comments/{id}` - Eliminar comentario

### Características de las Publicaciones

- Título y descripción
- Ubicación en Acapulco
- Tipo de aventura (surf, buceo, senderismo, etc.)
- Nivel de dificultad
- Duración estimada
- Múltiples fotos
- Sistema de likes y comentarios
- Timestamps de creación y actualización

## Comunicación entre Microservicios

### Eventos Publicados

- **PostCreatedEvent**: Se envía cuando se crea una nueva publicación
- **UserFollowEvent**: Se envía cuando un usuario sigue a otro

### Colas RabbitMQ

- `post.created.queue` - Para notificar sobre nuevas publicaciones
- `user.follow.queue` - Para notificar sobre nuevos seguidores

## Instalación y Ejecución

### Prerrequisitos

- Docker y Docker Compose
- Java 17 (para desarrollo local)
- Maven (para desarrollo local)

### Ejecución con Docker Compose

```bash
# Clonar el repositorio
git clone <repository-url>
cd aventura

# Construir y ejecutar todos los servicios
docker-compose up --build

# Ejecutar en segundo plano
docker-compose up -d --build
```

### Acceso a los Servicios

- **Post Service**: http://localhost:8081
- **User Service**: http://localhost:8080
- **MySQL**: localhost:3306
- **RabbitMQ Management**: http://localhost:15672 (guest/guest)
- **Swagger Post Service**: http://localhost:8081/swagger-ui.html

### Desarrollo Local

```bash
# Post Service
cd postservice
mvn spring-boot:run

# User Service
cd userservice
mvn spring-boot:run
```

## Base de Datos

### Esquemas

- **aventura_posts**: Base de datos para el post-service
- **aventuras_db**: Base de datos para el user-service

### Tablas Principales

- `posts`: Publicaciones de aventuras
- `post_photos`: URLs de fotos de las publicaciones
- `comments`: Comentarios en las publicaciones
- `users`: Información de usuarios (en user-service)

## Seguridad y Autenticación

### JWT Authentication

- Tokens JWT para autenticación
- Filtros de seguridad configurados
- Rutas protegidas y públicas

### CORS

- Configuración CORS habilitada para desarrollo
- Headers permitidos configurados

## Monitoreo y Logging

### Actuator

- Endpoints de salud: `/actuator/health`
- Métricas: `/actuator/metrics`
- Información: `/actuator/info`

### Logging

- Logs estructurados con SLF4J
- Niveles configurables por paquete
- Patrones de logging personalizados

## Próximos Pasos

### Funcionalidades Pendientes

- [ ] Frontend en Next.js o Angular
- [ ] Sistema de notificaciones en tiempo real
- [ ] Subida de archivos para fotos
- [ ] Sistema de moderación de contenido
- [ ] Analytics y métricas de uso

### Mejoras Técnicas

- [ ] Tests unitarios y de integración
- [ ] CI/CD pipeline
- [ ] Monitoreo con Prometheus/Grafana
- [ ] Cache con Redis
- [ ] Load balancing

## Contribución

### Equipo

- **Antonio Salinas**: Post Service, fotos y publicaciones
- **Juan Pablo**: User Service, autenticación y usuarios

### Estándares de Código

- Código en español (comentarios y mensajes)
- Convenciones de Spring Boot
- Uso de Lombok para reducir boilerplate
- Logging consistente en todos los servicios

## Licencia

MIT License - Ver archivo LICENSE para más detalles

## Contacto

- Antonio Salinas: [email]
- Juan Pablo: [email]
- Repositorio: [GitHub URL]
