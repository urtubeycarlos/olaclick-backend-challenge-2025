
# Order Management API

  

## Descripción

  

Este proyecto implementa una API RESTful para la gestión de órdenes de compra, desarrollada con **NestJS** y **Sequelize**. Permite registrar pedidos, consultar su estado, actualizar su progreso y eliminar aquellos que hayan sido entregados. Está diseñada para integrarse fácilmente con sistemas de frontend o servicios externos, y cuenta con documentación automática mediante Swagger.

  

## Características

  

- Registro de órdenes con múltiples ítems asociados.

- Transiciones de estado controladas (`initiated → sent → delivered`).

- Eliminación automática de órdenes entregadas mediante tareas programadas.

- Cacheo de órdenes no entregadas para mejorar el rendimiento.

- Documentación interactiva con Swagger (`/api`).

  

## Tecnologías utilizadas

  

-  **NestJS** como framework principal.

-  **Sequelize** como ORM para interacción con la base de datos.

-  **PostgreSQL** como motor de base de datos (configurable).

-  **@nestjs/schedule** para tareas cron.

-  **Swagger** para documentación de endpoints.

-  **Redis** para gestión de caché.

  

## 🏁 Ejecución

  

### 1. Instalación de Docker

  

Como punto de partida, es necesario contar con **Docker** y **Docker Compose** instalados en el sistema. Esto permite levantar todos los servicios del proyecto (API, base de datos, caché, etc.) de forma automatizada y aislada.

  

- Para instalar Docker, visite: [https://docs.docker.com/get-docker](https://docs.docker.com/get-docker)

- Docker Compose ya viene incluido en Docker Desktop en sistemas Windows y macOS. En Linux, puede instalarse por separado siguiendo [estas instrucciones](https://docs.docker.com/desktop/setup/install/linux).

  

Una vez instalado, verifique la instalación con:

  

```bash

docker  -v

docker  compose  version

```

  

### 2. Levantar el proyecto

  

Desde la raíz del proyecto, ejecute el siguiente comando para construir las imágenes necesarias y levantar los contenedores definidos en `docker-compose.yml`:

  

```bash

docker  compose  up  --build

```

  

Este comando iniciará todos los servicios del entorno de desarrollo.

  

Una vez que los contenedores estén corriendo, la aplicación estará disponible en el puerto configurado (por defecto, http://localhost:3000).

  
  

### 3. Ejecutar migraciones

Con los servicios en ejecución, es necesario aplicar las migraciones para crear las tablas en la base de datos. Esto se realiza con el siguiente comando:

  

```bash

npx sequelize-cli db:migrate --config sequelize.config.js

```

  

Este paso garantiza que la estructura de la base de datos esté actualizada y lista para operar.

  
  

## 📘 Utilización

  

Una vez que el proyecto esté en ejecución, se puede acceder a la documentación completa de la API a través de Swagger. Para ello, simplemente ingrese a la siguiente URL desde el navegador de su preferencia: http://localhost:3000/api

  
  

Este entorno interactivo permite:

  

- Consultar todos los endpoints disponibles.

- Visualizar los modelos de datos utilizados en las solicitudes y respuestas.

- Realizar pruebas directamente desde la interfaz, sin necesidad de herramientas externas.

  

Swagger facilita la exploración y validación de la API, especialmente durante el desarrollo y la integración con otros sistemas.

  
  

## 📌 Notas adicionales

  

### ¿Cómo desacoplar la lógica de negocio del framework NestJS?

  

Para lograr un desacoplamiento entre la lógica de negocio y el framework NestJS, se recomienda aplicar principios de arquitectura limpia (Clean Architecture) y diseño orientado a dominios (DDD). Esto implica:

  

- Definir **servicios de dominio** independientes del framework, que encapsulen la lógica de negocio.

- Utilizar **interfaces** para abstraer dependencias como repositorios, proveedores externos o mecanismos de almacenamiento.

- Implementar **inyección de dependencias** para que los controladores y servicios de infraestructura interactúen con la lógica de negocio sin acoplamiento directo.

- Evitar el uso de decoradores o clases específicas de NestJS dentro del núcleo de negocio.

  

Este enfoque permite reutilizar la lógica en otros entornos (CLI, microservicios, pruebas unitarias) sin depender del framework.

  

---

  

### ¿Cómo escalar esta API para soportar miles de órdenes concurrentes?

  

Para escalar la API de forma eficiente y soportar alta concurrencia, se pueden aplicar las siguientes estrategias:

  

-  **Horizontal scaling**: Ejecutar múltiples instancias de la aplicación detrás de un balanceador de carga (por ejemplo, Azure API Management.).

-  **Uso de base de datos optimizada**: Configurar PostgreSQL con índices adecuados, particiones si es necesario, y/o vistas materializadas.

-  **Caching estratégico**: Utilizar Redis para almacenar órdenes no entregadas, respuestas frecuentes o resultados de consultas costosas.

-  **Colas de procesamiento**: Delegar operaciones intensivas o asincrónicas (como procesamiento de órdenes, envío de notificaciones, etc.) a una cola como **RabbitMQ**, evitando bloquear el hilo principal.

  

Estas medidas permiten mantener la estabilidad y el rendimiento incluso bajo cargas elevadas.

  

---

  

### ¿Qué ventajas ofrece Redis en este caso y qué alternativas considerar?

  

Redis aporta múltiples beneficios en este contexto:

  

-  **Alto rendimiento**: Al ser una base de datos en memoria, permite acceder a datos en milisegundos.

-  **Cache distribuido**: Ideal para almacenar órdenes no entregadas.

-  **Expiración automática**: Permite definir TTL para datos temporales.

  

Como alternativa o complemento, se puede considerar:

  

-  **RabbitMQ**: Para implementar una cola de procesamiento de órdenes, desacoplando tareas pesadas del flujo principal.

  

La combinación de Redis para cache y RabbitMQ para procesamiento asincrónico permite construir una arquitectura robusta, escalable y resiliente.

  
  

### Sobre el challenge per se

  

Durante el desarrollo de este proyecto se priorizó la implementación funcional de la API y sus principales flujos de negocio. Si bien estaba contemplada la incorporación de pruebas automatizadas (unitarias y/o e2e), no fue posible concretarlas debido a limitaciones de tiempo y dificultades técnicas relacionadas con la instalación de Docker y la preparación del entorno de virtualización en sistemas Windows 11.

Respecto a la tarea programada, dado que no se definió una estrategia específica en el enunciado del desafío, se optó por una implementación arbitraria que elimina directamente las órdenes con estado `"delivered"`  cada 12 horas. Esta solución busca demostrar el uso de cron jobs y la integración con Sequelize, sin pretender representar una decisión definitiva de negocio.

Asimismo, con fines prácticos y considerando el contexto del desafío, se decidió incluir el archivo `.env` con información de desarrollo. Esta decisión busca facilitar la ejecución inmediata del proyecto por parte de evaluadores o colaboradores, sin necesidad de configurar variables de entorno manualmente.

Se reconoce que en un entorno de producción esta práctica no es recomendable, y que tanto las pruebas como la gestión segura de credenciales son aspectos fundamentales para la calidad y seguridad de cualquier sistema.