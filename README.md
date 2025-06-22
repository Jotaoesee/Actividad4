☁️ Firebase Backend para E-commerce con Stripe 💳
Descripción del Proyecto
Este proyecto es un backend de API RESTful serverless desarrollado con Node.js y Firebase Cloud Functions, diseñado para potenciar aplicaciones de comercio electrónico o cualquier sistema que requiera gestión de usuarios, productos y procesamiento de pagos. Utiliza Firebase Firestore como su base de datos NoSQL en la nube y se integra directamente con la pasarela de pagos Stripe para manejar transacciones de forma segura y eficiente.

La arquitectura serverless de Firebase Cloud Functions permite un despliegue y escalabilidad automáticos, eliminando la necesidad de gestionar servidores y facilitando un desarrollo ágil de APIs robustas.

El Problema que Resuelve
Firebase Backend para E-commerce con Stripe aborda la necesidad de:

Un backend escalable y de bajo mantenimiento: Al ser serverless, se eliminan las complejidades de la gestión de infraestructura.

Integración de pagos segura y eficiente: Facilita la implementación de funcionalidades de e-commerce con Stripe, gestionando clientes, pagos y recibos.

Gestión de datos de usuarios y productos: Proporciona endpoints para el CRUD (Crear, Leer, Actualizar, Borrar) de perfiles y productos.

Rapidez en el desarrollo de APIs: Utiliza Express.js para definir rutas de manera familiar y rápida.

¿Para Quién es Útil?
Este proyecto es una base excelente para:

Desarrolladores Frontend (Web/Móvil): Que necesitan un backend completo y listo para consumir, sin preocuparse por la infraestructura.

Startups y Pequeñas Empresas: Que buscan lanzar soluciones de e-commerce o servicios con un coste inicial bajo y alta escalabilidad.

Estudiantes y Aprendices: Interesados en el desarrollo serverless con Firebase, Node.js, Express.js y la integración de Stripe.

Equipos de Prototipado Rápido: Para construir MVPs (Minimum Viable Products) que requieran funcionalidades de usuario y pago.

✨ Características Destacadas
🚀 Arquitectura Serverless: Desplegado en Firebase Cloud Functions para escalabilidad automática y gestión de infraestructura cero.

📊 Base de Datos NoSQL con Firestore: Almacenamiento flexible y en tiempo real de perfiles de usuario, productos y recibos de transacciones.

💳 Integración Completa con Stripe:

Creación de perfiles de usuario con creación automática de clientes en Stripe.

Procesamiento de pagos por productos específicos utilizando PaymentIntents.

Gestión de recibos de compra en Firestore por usuario.

👤 Gestión de Perfiles de Usuario:

Endpoints para crear perfiles, obtener perfiles individuales por UID y listar perfiles con filtros de edad.

Almacenamiento de datos sensibles de tarjeta (con fines de prueba/demo, no para producción real).

📦 Gestión de Productos: Endpoint para crear y almacenar productos en Firestore.

🌐 API RESTful Estándar: Rutas definidas con Express.js, facilitando la integración con cualquier cliente HTTP.

🔐 CORS Configurado: Permite solicitudes desde diferentes orígenes, ideal para frontends web.

⚙️ Entorno de Desarrollo Node.js 22: Utiliza la versión LTS de Node.js para un rendimiento y compatibilidad óptimos.

🛠️ Tecnologías Utilizadas
Lenguaje de Programación: JavaScript (Node.js)

Plataforma Cloud: Firebase (Cloud Functions, Firestore)

Framework Web: Express.js

Middleware: CORS

Pasarela de Pagos: Stripe SDK (Node.js)

Dependencias Principales
El archivo package.json lista las siguientes dependencias clave:

cors: ^2.8.5

express: ^4.21.2

firebase-admin: ^12.7.0

firebase-functions: ^6.0.1

stripe: ^17.6.0

🚀 Cómo Instalar y Ejecutar
Este proyecto es un backend que se despliega como Firebase Cloud Functions. No necesita un servidor tradicional, pero sí una cuenta de Firebase y el CLI de Firebase.

Prerrequisitos
Node.js (v22 o superior) y npm/yarn: Asegúrate de tenerlos instalados.

Firebase CLI: Instala la herramienta de línea de comandos de Firebase:

npm install -g firebase-tools

Cuenta de Google y Proyecto de Firebase:

Crea un proyecto en la Consola de Firebase.

Habilita Firestore Database en modo de producción o prueba.

Configura las reglas de seguridad de Firestore adecuadamente. Para desarrollo y pruebas, puedes usar reglas laxas (ej., allow read, write: if true;), pero ¡NUNCA para producción sin una lógica de seguridad robusta!

Cuenta de Stripe:

Crea una cuenta en Stripe.

Obtén tus claves API de prueba (Secret Key y Publishable Key) desde tu Dashboard de Stripe (Developers > API keys).

Pasos de Instalación
Clona el repositorio:

git clone https://github.com/tu_usuario/tu_nombre_del_repositorio.git
cd tu_nombre_del_repositorio/functions # Asegúrate de entrar al directorio 'functions'

(Nota: Reemplaza tu_usuario/tu_nombre_del_repositorio.git con la URL real de tu repositorio y tu_nombre_del_repositorio con el nombre de tu proyecto en tu máquina si es diferente.)

Instala las dependencias de Node.js:
Dentro del directorio functions/:

npm install

Configura tus claves de Stripe:
En el archivo functions/index.js, la clave secreta de Stripe está codificada directamente. Para un entorno de producción, DEBES usar las variables de entorno de Firebase Functions o Firebase Config. Para pruebas rápidas con el código actual, la clave está en la línea:

const stripe = require("stripe")("sk_test_51QqCx7DzvfiQtQhxAogrZaGS6or1LwpT6QZHj88z2Tvg4hNUEvfZH3KYaFDon86NvaZdmt3AyddGTxWt7ULeDkeu006CLLRYLA");

Puedes reemplazar esta clave de prueba por la tuya.

Cómo Ejecutar y Desplegar las Funciones
Inicia sesión en Firebase CLI:

firebase login

Vincula tu proyecto local con tu proyecto de Firebase:
Dentro del directorio raíz de tu proyecto (un nivel por encima de functions/):

firebase use --add tu-id-de-proyecto-firebase

(Reemplaza tu-id-de-proyecto-firebase con el ID de tu proyecto en la consola de Firebase.)

Despliega las Cloud Functions:
Dentro del directorio raíz de tu proyecto, o dentro de functions/ si tu firebase.json está configurado para apuntar a source: "functions":

firebase deploy --only functions

Una vez desplegadas, Firebase te proporcionará las URLs de los endpoints de tus funciones. La URL principal para esta API será similar a: https://us-central1-tu-id-de-proyecto-firebase.cloudfunctions.net/api

📈 Cómo Usar la API
La API de este backend serverless proporciona los siguientes endpoints. Ten en cuenta que todos los datos de los métodos POST (creación y pago) se esperan como parámetros de consulta (query parameters) en la URL, lo cual es una peculiaridad de esta implementación y difiere de la práctica común de usar un cuerpo de solicitud JSON.

Endpoints Generales
GET / (Raíz de la función)

Propósito: Endpoint de prueba para verificar que la API está funcionando.

Respuesta: {"message": "API funcionando correctamente"}

Gestión de Perfiles (/perfiles/)
POST /perfiles/crear_perfil

Propósito: Crea un nuevo perfil de usuario en Firestore y un cliente asociado en Stripe.

Parámetros de Consulta (obligatorios):

nombre: Nombre del usuario.

email: Email del usuario.

edad: Edad del usuario.

tarjeta_credito: Número de tarjeta de crédito (ej., "4111111111111111").

caducidad: Fecha de caducidad de la tarjeta (ej., "10/28").

cvv: Código CVV de la tarjeta (ej., "123").

Ejemplo de URL (Postman/navegador):

https://us-central1-tu-id-de-proyecto.cloudfunctions.net/api/perfiles/crear_perfil?nombre=Pedro&email=pedro@example.com&edad=28&tarjeta_credito=4111111111111111&caducidad=10/28&cvv=123

Respuesta: {"id": "...", "stripeCustomerId": "cus_...", "message": "Perfil creado exitosamente"}

GET /perfiles/perfil

Propósito: Obtener los detalles de un perfil específico.

Parámetros de Consulta (obligatorio):

uid: UID (ID de documento) del perfil en Firestore.

Ejemplo de URL:

https://us-central1-tu-id-de-proyecto.cloudfunctions.net/api/perfiles/perfil?uid=R5TCEn0WK27p1sUV6HKT

Respuesta: Datos del perfil en formato JSON.

GET /perfiles/perfiles

Propósito: Obtener una lista de perfiles filtrados por edad mínima.

Parámetros de Consulta (obligatorio):

edad_min: Edad mínima para el filtro.

Ejemplo de URL:

https://us-central1-tu-id-de-proyecto.cloudfunctions.net/api/perfiles/perfiles?edad_min=30

Respuesta: Array de objetos perfil en formato JSON.

Gestión de Productos (/productos/)
POST /productos/crear_producto

Propósito: Crea un nuevo producto en Firestore.

Parámetros de Consulta (obligatorios):

nombre: Nombre del producto.

precio: Precio del producto (número decimal).

Ejemplo de URL:

https://us-central1-tu-id-de-proyecto.cloudfunctions.net/api/productos/crear_producto?nombre=teclado&precio=50

Respuesta: {"id": "...", "message": "Producto creado exitosamente"}

POST /productos/pagar_producto

Propósito: Procesa el pago de un producto para un usuario a través de Stripe.

Parámetros de Consulta (obligatorios):

uid_producto: UID del producto a comprar.

uid_usuario: UID del usuario que realiza la compra.

paymentMethodId: ID del método de pago de Stripe (ej., pm_card_visa para pruebas).

Ejemplo de URL:

https://us-central1-tu-id-de-proyecto.cloudfunctions.net/api/productos/pagar_producto?uid_producto=teA42YxNVwZsBtSNfktV&uid_usuario=R5TCEn0WK27p1sUV6HKT&paymentMethodId=pm_card_visa

Respuesta: {"message": "Pago realizado", "recibo": {...}} (incluye detalles del recibo).

Gestión de Recibos
GET /perfiles/recibos

Propósito: Obtener todos los recibos de todas las transacciones de todos los usuarios.

Parámetros de Consulta: Ninguno.

Ejemplo de URL:

https://us-central1-tu-id-de-proyecto.cloudfunctions.net/api/perfiles/recibos

Respuesta: Array de objetos de recibo en formato JSON.
