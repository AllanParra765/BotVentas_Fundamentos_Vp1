# BotVentas_Fundamentos_Vp1

CartBot - Bot de WhatsApp
¡Bienvenido al repositorio de CartBot! Este es un bot de WhatsApp desarrollado utilizando el paquete Bailey's, que permite automatizar conversaciones y realizar diversas tareas a través de WhatsApp.

Descripción del Proyecto
CartBot es un bot de WhatsApp que sigue un flujo de conversación estructurado. El bot está diseñado para gestionar conversaciones con usuarios y ejecutar diversas acciones, como responder preguntas frecuentes, tomar pedidos, mostrar información de productos y proporcionar asistencia general hasta cerrar ventas y notificar a los vendedores mediante mensajes.

Flujo de Conversación
El flujo de conversación de CartBot consta de múltiples etapas, que incluyen:

"flowPrincipal": Inicio de la conversación.
"flowPrincipalRegistrado": Interacción con usuarios registrados.
"flowDisenos": Mostrar diseños disponibles.
"flowplanes": Presentación de planes y precios.
"flowPreguntasFrecuentes": Responder preguntas comunes.
"flowAgente": Transferencia a un agente humano si es necesario.
"flowPedidos": Tomar pedidos de los usuarios.
"flowCompra": Completar el proceso de compra.
"flowDesing": Personalizar diseños.
"flowplan1", "flowplan2", "flowplan3": Detalles de los planes.
"flowPreguntasFrecuentes1" al "flowPreguntasFrecuentes6": Respuestas detalladas a preguntas frecuentes.
Tecnologías Utilizadas
Bailey's: Paquete para interactuar con la API de WhatsApp.
Axios: Para realizar peticiones a una API externa.
Express.js: Para crear el servidor web.
Morgan: Registro de peticiones HTTP.
Dotenv: Configuración de variables de entorno.
Express-Rate-Limit: Limitación de frecuencia de peticiones.
Express-Validator: Validación de datos de entrada.
Winston: Registro de eventos y seguimiento de actividad del servidor.
UUID: Generación de identificadores únicos.
HTTPS: Configuración de certificados SSL para seguridad.
Selfsigned: Generación de certificados autofirmados.
FS: Manipulación de archivos (lectura y escritura).
Path: Gestión de rutas de archivos.
Seguridad y Protección
CartBot se preocupa por la seguridad de la información y utiliza certificados SSL para garantizar la seguridad de las comunicaciones. Además, se aplican medidas de seguridad adicionales con paquetes como "helmet" y "cors" para protegerse contra ataques de seguridad comunes.

Uso de Registros
El bot utiliza "morgan" y "winston" para llevar un registro de eventos y actividades del servidor. Esto permite un seguimiento detallado y facilita la solución de problemas.


Inicio Rápido

¡Bienvenido a CartBot! Aquí te mostramos cómo iniciar y ejecutar el bot de forma rápida y sencilla. Antes de comenzar, asegúrate de cumplir con los siguientes requisitos:

Node.js: Debes tener Node.js instalado en tu máquina. CartBot requiere Node.js versión 17 o superior. Si no lo tienes instalado, puedes descargarlo desde el sitio web oficial de Node.js.

Para verificar la versión de Node.js que tienes instalada, ejecuta el siguiente comando en tu terminal:


node --version
Si Node.js está correctamente instalado, verás la versión que tienes.

NPM: Asegúrate de tener npm (Node Package Manager) instalado en tu sistema. Puedes verificar si tienes npm instalado ejecutando:


npm --version
Si no tienes npm, puedes instalarlo junto con Node.js desde el sitio web oficial mencionado anteriormente.

Iniciar CartBot
Sigue estos pasos para iniciar el bot:

Clona este repositorio en tu máquina local.


git clone <https://github.com/AllanParra765/BotVentas_Fundamentos_Vp1.git>
Ve al directorio donde clonaste el repositorio.


cd base-baileys-memory/

puedes iniciar el bot ejecutando:


npm start

Al ejecutar este comando, CartBot comenzará a funcionar y se ejecutará en el puerto 3000.

Para escanear el código QR y conectar CartBot a WhatsApp, hay varias opciones:

Abre la URL http://localhost:3000 en tu navegador y sigue las instrucciones para escanear el código QR.
Encuentra el archivo qr.png en la carpeta del proyecto y escanea el código QR desde tu aplicación WhatsApp.
Utiliza el enlace proporcionado en la consola para acceder a la interfaz web de CartBot.
Si todo va bien, verás un mensaje en la consola que indica que el proveedor se ha conectado y está listo.

Iniciar el Servidor
CartBot interactúa con una API REST para ciertas funcionalidades. Para iniciar el servidor de la API REST, sigue estos pasos:

Abre una nueva terminal.

Ve al directorio de la API REST.


cd apirest/
Instala las dependencias requeridas para la API REST ejecutando:


npm install express-validator winston morgan helmet express-rate-limit uuid axios express
Esto instalará todas las dependencias necesarias para el servidor de la API.

Inicia el servidor de la API ejecutando:


node appRest.js
El servidor se ejecutará en el puerto 4000.

Con estos pasos, CartBot y el servidor de la API REST deberían estar funcionando correctamente. Puedes comenzar a interactuar con el bot y explorar sus capacidades.

Para obtener más detalles y documentación, consulta la documentación oficial de CartBot.

Nota: Si deseas que el servidor se reinicie automáticamente, configura el archivo "restart.sh" con la ruta adecuada y sigue las instrucciones proporcionadas en ese archivo. Esto facilitará el reinicio automático del servidor en caso de que se detenga por algún motivo.

¡Disfruta utilizando CartBot para automatizar tus conversaciones en WhatsApp y brindar un mejor servicio a tus clientes!

Contacto
Si tienes alguna pregunta o comentario, no dudes en ponerte en contacto con nosotros.

¡Gracias por visitar el repositorio de CartBot! Esperamos que este proyecto sea útil y que puedas sacar el máximo provecho de él. ¡Disfruta automatizando tus conversaciones de WhatsApp!

CartBot - Automatización de Conversaciones en WhatsApp