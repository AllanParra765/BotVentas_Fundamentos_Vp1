const {
  createBot,
  createProvider,
  createFlow,
  addKeyword,
} = require("@bot-whatsapp/bot");

const QRPortalWeb = require("@bot-whatsapp/portal");
const BaileysProvider = require("@bot-whatsapp/provider/baileys");
const MockAdapter = require("@bot-whatsapp/database/mock");
const { delay } = require("@adiwajshing/baileys");
const axios = require("axios"); // Importamos la biblioteca Axios

let nombre;
let apellidos;
let correo;
let telefono;
let Diseno = [
  "Clásico. 🎩",
  "Moderno. 🚀",
  " Elegante. 👔",
  "Creativo. 🎨",
  "Corporativo. 🏢",
  "Personalizado. 🌟",
];
let disenoNumero = 0;
let plandeTarjeta = 0;
let tarjeta = 0;
let pago = 0;
let pasoDeVenta = "";
let enlaceVenta='revisión de compra';
const expresionRegularCorreo =
  /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
const expresionRegularNombre = /^[a-zA-Z\s]+$/;

///////////////////////URL CARGAR//////////////////////////
// URL de la API que proporciona los datos JSON de los posts
const apiUrl = "http://localhost:4000/api/contactos";
//const apiUrl = "https://localhost:4000/api/contactos";
///////////////////////////AGREGAR////////////////////////
async function crearPost(postData) {
  try {
    const response = await axios.post(apiUrl, postData);
    return response.data;
  } catch (error) {
    console.error("Error al crear el post:", error.message);
    return null;
  }
}
//////////////////////////Buscar///////////////////////
// Definimos una función para obtener los datos del cliente utilizando Axios
async function buscarCliente(userId) {
  try {
    const response = await axios.get(`${apiUrl}/${userId}`);
    return response.data; // Devolvemos los datos de la respuesta
  } catch (error) {
    console.error("Error al obtener los datos del cliente:", error.message);
    throw error; // Propagamos el error para manejarlo adecuadamente
  }
}

/////////////////////////////////////////////////

////////////////////////actualizar////////////////////////

// Función para actualizar un post existente por su ID

  async function actualizarPost(id, postData) {
    try {
      const response = await axios.put(`${apiUrl}/${id}`, postData);
      return response.data;
    } catch (error) {
      console.error(`Error al actualizar el post con ID ${id}:`, error.message);
      return null;
    }
  }


  
///////////////////////////////////////////////


const flowCompra = addKeyword(["1"]).addAnswer(
  [
    `Te gustaria la tarjeta`,
    "👉 *Profecional* $1,1500.00 MX",
    "👉 *Empresarial* $1,490.00 MX\n",
    "Acontinuación realiza tu pago aquí",
    "👉 https://bot-whatsapp.netlify.app/",
    "\n*Proceso de pago:* 👉  ingresa el monto, elige el medio de pago ¡y listo!",
    "\n*Proceso de entrega:* 👉 👉 Elige entre dos propuestas que te proporcionamos o crea una nueva combinando ambas. ¡Tu tarjeta estará lista con tus detalles en solo unas horas!",
    "\n*Recibirás:* 👉 Un enlace web y un archivo PDF de tu tarjeta digital.",
    "\nRecuerda guardar y *compartirnos* tu comprobante de pago. ¡Estamos aquí para cualquier duda! 😊🌟",
  ],
  { capture: true },



  async (ctx, {provider, endFlow, fallBack,flowDynamic, }) => {
    if (ctx.body.includes("_event_media__")) { 
    await delay(1000);
    const clienteId = ctx.from;
    const clienteData = await buscarCliente(clienteId);

    let nuevoPost = {
      userId: clienteData.telefono,
      id: clienteData.id,
      nombre: clienteData.nombre,
      apellidos: clienteData.apellidos,
      correoElectronico: clienteData.correo,
      tarjeta: clienteData.tarjeta,
      planDetarjeta: clienteData.plandeTarjeta,
      PasoVenta: "Pago de tarjeta",
      Preguntas: clienteData.Preguntas,
      Pago: ctx.body,
      enlace: clienteData.enlaceVenta
    };


    //const id = ctx.key.remoteJid;         
    //provider.vendor.sendMessage(mobile + "@s.whatsapp.net", id, {image: { url: "https://mmg.whatsapp.net/o1/v/t62.7118-24/f1/m237/up-oil-image-43c63cf9-7f0c-499c-805c-29cab5c99eb9?ccb=9-4&oh=01_AdQxrPJdfHyx_BmTUIIr1PwxCQnkwvl2Mnc5YKlCJDCqkA&oe=651F2984&mms3=true" }, caption: `El Número: ${ctx.from} \n Nombre: ${nombre} \n Diseño: ${clienteData.tarjeta}\nComprovante: ${ctx.key.remoteJid}`});                                                                           
     //nuevoPost.tarjeta= `${Diseno[ctx.body - 1]}`;
   // console.error("nueva PAGOtarjeta: ", nuevoPost.Pago);
    console.log("clienteData PAGOtarjeta: ", ctx);
    const mobile = "5714772301019"
    const message = `El Número: ${ctx.from} acaba de adquirir el\n Diseño: ${clienteData.tarjeta} \nSu Nombre es: ${nombre} \nEl Comprovante: *Se encuentra Arriba*`;/////flujo de envio de mensajes de Comprado ctx.key.remoteJid  /  message.Message.imageMessage.ImageMessage
  await provider.sendText(mobile + "@s.whatsapp.net", message);
    
  
  await actualizarPost(clienteData.id, nuevoPost);
    return endFlow(`¡Gracias! Validaremos tu compra. En breve, un asesor se comunicará contigo, ${nombre} 😊📞 \nPara volver al menú escribe: 👉*menu* o *0*`);
  }else {
    return fallBack(
      `😊 Comparte tu *comprobante* y un agente se pondrá en contacto contigo ${nombre} en minutos 📄🕒`
    );
  }
  }
);

const flowDesing = addKeyword(["1","2","3","4","5",
  "6",
]).addAnswer(
  [
    "🎨 Ahora, necesito algunos detalles para personalizar el diseño. Por favor,",
    "\n📝 Puedes hacer clic en el siguiente enlace para completar el formulario con la información que deseas en tu Tarjeta Digital:",
    "👉 https://bot-whatsapp.netlify.app/",    
    "\n🛒 Puedes colocar 👉*1* para continuar con la compra."
  ],
  { capture: true },

  async (ctx, { flowDynamic, fallBack }) => {
    if (!["1"].includes(ctx.body)) {
      return fallBack("Coloca *1* para continuar con la compra 😊, por favor");
    }else{
    await delay(1000);

    const clienteId = ctx.from;
    const clienteData = await buscarCliente(clienteId);
  
    let nuevoPost = {
      userId: clienteData.telefono,
      id: clienteData.id,
      nombre: clienteData.nombre,
      apellidos: clienteData.apellidos,
      correoElectronico: clienteData.correo,
      tarjeta: clienteData.tarjeta,
      planDetarjeta: clienteData.plandeTarjeta,
      PasoVenta: "formulario de compra",
      Preguntas: clienteData.Preguntas,
      Pago: clienteData.pago,
      enlace: clienteData.enlaceVenta
    };
  
   // nuevoPost.tarjeta= `${Diseno[ctx.body - 1]}`;
   // console.error("nueva Paso Venta: ", nuevoPost.PasoVenta);
    console.log("clienteData paso Venta: ", clienteData.PasoVenta);
    await actualizarPost(clienteData.id, nuevoPost);
   
    return flowDynamic(
      `"¡Genial! Tu tarjeta con el Diseño ${Diseno[disenoNumero - 1]} está lista para ser creada.`, 
      `\n🎉✨ Ahora, déjame encargarme de los detalles para que obtengas una Tarjeta Digital que realmente destaque. \n🎨💼 ¡Estoy emocionado por comenzar este proceso contigo! 😊🌟`
    );
  }
},
  [flowCompra]
);


//'Ver diseños predefinidos.', 'Ver diseños predefinidos','Ver diseños predefinidos.', 'diseños',
const flowDisenos = addKeyword(["1"])

  .addAnswer('¡Genial! Selecciona el *número* del diseño que más te guste:')
  
.addAnswer(
  [
    "👉*1*  Clásico. 🎩",
    "👉*2*  Moderno. 🚀",
    "👉*3*  Elegante. 👔", //mandamos medias 3 para cada opción
    "👉*4*  Creativo. 🎨",
    "👉*5*  Corporativo. 🏢",
    "👉*6*  Personalizado. 🌟",
  ],
  { capture: true },
//validamos con try catch
  async (ctx, { flowDynamic, fallBack }) => {
    if (!["1", "2", "3", "4", "5", "6"].includes(ctx.body)) {
      return fallBack("Sólo del *1* al *6*, por favor");
    }
    disenoNumero = ctx.body;
    await delay(1000);
    const clienteId = ctx.from;
    const clienteData = await buscarCliente(clienteId);

    let nuevoPost = {
      userId: clienteData.telefono,
      id: clienteData.id,
      nombre: clienteData.nombre,
      apellidos: clienteData.apellidos,
      correoElectronico: clienteData.correo,
      tarjeta: clienteData.tarjeta,
      planDetarjeta: disenoNumero,
      PasoVenta: "Ver diseños predefinidos.",
      Preguntas: clienteData.Preguntas,
      Pago: clienteData.pago,
      enlace: clienteData.enlaceVenta
    };

    nuevoPost.tarjeta= `${Diseno[ctx.body - 1]}`;
    //console.error("nueva Diseños tarjeta: ", nuevoPost.PasoVenta);
    console.log("clienteData Diseños tarjeta: ", clienteData.PasoVenta);
    await actualizarPost(clienteData.id, nuevoPost);
    return flowDynamic( `Perfecto. Tu tarjeta con el Diseño *${Diseno[disenoNumero - 1]}* esta casi lista.`
    );
  },
  [flowDesing]
);
//flowPersonalizar

const flowplan1 = addKeyword([
  "1",
  "uno",
  "Uno",
  "Tarjeta Digital Profesional",
  "tarjeta digital profesional",
])
  .addAnswer([
    "🌐 ¡Crea conexiones duraderas y maximiza tu presencia en el mundo empresarial!",
    "🤝 Tarjeta Digital Profesional: Tu carta de presentación moderna."
  ])
  .addAnswer("Para volver a menú escribe: 👉*menu* o *0*");

const flowplan2 = addKeyword([
  "2",
  "dos",
  "Dos",
  "Tarjeta Digital Ejecutiva",
  "tarjeta digital ejecutiva",
])
  .addAnswer([
    "🎯 ¡Destaca en cada interacción y proyecta una imagen de excelencia ejecutiva!",
    "✨ esta tarjeta cautiva con un estilo sofisticado, detalles de contacto precisos y una presentación impecable.",
  ])
  .addAnswer("Para regresar a menú escribe: 👉*menu* o *0*");

const flowplan3 = addKeyword([
  "3",
  "tres",
  "Tres",
  "Diseños Especiales",
  "diseños especiales",
])
  .addAnswer([
    "💻 Transformamos tus ideas en realidad digital:",
    "💌 Invitaciones 🎂 Publicidad 📄 Menús 🌐 Sitios web",
    "\n*¡Tus grandes ideas las creamos en digital!*",
  ])
  .addAnswer("Para volver a menú escribe: 👉*menu* o *0*");

const flowplanes = addKeyword(["2",
]).addAnswer(
  [
    "👉*1*.- Tarjeta Digital Profesional  💼",
    "👉*2*.- Tarjeta Digital Ejecutiva 🎩",
    "👉*3*.- Diseños Especiales 🎨",
  ],
  { capture: true },
  async (ctx, { flowDynamic, fallBack }) => {
    await delay(1000);
    if (!["1", "2", "3"].includes(ctx.body)) {
      return fallBack("Sólo del *1* al *3*, por favor");
    }
    const clienteId = ctx.from;
    const clienteData = await buscarCliente(clienteId);

    let nuevoPost = {
      userId: clienteData.telefono,
      id: clienteData.id,
      nombre: clienteData.nombre,
      apellidos: clienteData.apellidos,
      correoElectronico: clienteData.correo,
      tarjeta: clienteData.tarjeta,
      planDetarjeta: ctx.body,
      PasoVenta: "Precios Planes.",
      Preguntas: clienteData.Preguntas,
      Pago: clienteData.pago,
      enlace: clienteData.enlaceVenta
    };
    console.log("planes Precios: ", nuevoPost.PasoVenta);
    //console.log("clienteData Precios: ", clienteData.PasoVenta);
    await actualizarPost(clienteData.id, nuevoPost);
    return flowDynamic(``);
  },
  [flowplan1, flowplan2, flowplan3]
);

const flowPreguntasFrecuentes1 = addKeyword(["1"])
.addAnswer("¿Modificar alguna información tiene algún costo extra?")
  .addAnswer([
    "🚀 Sin costo",
    "* Cambio de texto",
    "* Imagenes",
    "* Videos",
    "* *Datos Proporcionados por el solicitante*",
  ])
  .addAnswer([
    "Tiene costo❗",
    "* Cambio de diseño",
    "* Cambio de formato",
    "* Colores\n",
    "Para volver a menu escribe: 👉*menu* o *0*",
  ]);

const flowPreguntasFrecuentes2 = addKeyword(["2"])
.addAnswer("¿Qué métodos de pago aceptas?")
.addAnswer([
"🚀 Métodos de Pago:\n",
"💳 Transferencia Electrónica\n💵 Pago en Efectivo\n💸 Mercado Pago\n",
"Elige el método que más te convenga al comprar. Si tienes dudas o necesitas ayuda con el pago, estamos aquí para ti.\n",
"Para volver al menú, escribe: 👉 *menu* o *0*"
]);

const flowPreguntasFrecuentes3 = addKeyword(["3"])
  .addAnswer("¿Tiene vigencia mi tarjeta?")
  .addAnswer([
    "🚀 ¡Sí! Las tarjetas digitales tienen 1 año de vigencia, renovables por 1 año más. Renovar diseño es gratuito al renovar o mejorar tu paquete contratado. ⏳✨",
    "Para volver al menú, escribe: 👉 *menu* o *0*"
  ]);

const flowPreguntasFrecuentes4 = addKeyword(["4"])
  .addAnswer("¿Cómo adquiero mi tarjeta digital?")
  .addAnswer([
"🚀 Atención personalizada: Contacta a un asesor por WhatsApp para tus dudas e info de tu tarjeta digital. 👥💬",
"🚀 Chatbot: Escríbenos *Menu* para obtener más opciones. 💬🤖"
  ]);

const flowPreguntasFrecuentes5 = addKeyword(["5"])
  .addAnswer("¿Cómo guardo mi tarjeta en mi dispositivo?")
  .addAnswer([
    "🚀 Todos los paquetes incluyen un QR para compartir en redes, correo, e imprimir para escanear o compartir tu enlace. ✉️📲",
    "Para volver al menú, escribe: 👉 *menu* o *0*"
  ]);

const flowPreguntasFrecuentes6 = addKeyword(["6"])
  .addAnswer("¿Cómo envío mi tarjeta a mis clientes?")
  .addAnswer([
    "🚀 Adjunta un enlace o QR en tu Tarjeta Digital. ¡Conecta en un clic! 💼📱",
    "Para volver al menú, escribe: 👉 *menu* o *0*"
  ]);

const flowPreguntasFrecuentes = addKeyword(["3"])
  .addAnswer(["🚀 Preguntas más Frecuentes"])
  .addAnswer([
    "👉 *1* ¿Modificar alguna información tiene algún costo extra?",
    "👉 *2* ¿Qué métodos de pago aceptas?",
    "👉 *3* ¿Tiene vigencia mi tarjeta?",
    "👉 *4* ¿Cómo adquiero mi tarjeta digital?",
    "👉 *5* ¿Cómo guardo mi tarjeta en mi dispositivo?",
    "👉 *6* ¿Cómo envío mi tarjeta a mis clientes?",
  ],
  { capture: true },
  async (ctx, { flowDynamic, fallBack }) => {   
    await delay(1000);

    const clienteId = ctx.from;
    const clienteData = await buscarCliente(clienteId);
  
    let nuevoPost = {
      userId: clienteData.telefono,
      id: clienteData.id,
      nombre: clienteData.nombre,
      apellidos: clienteData.apellidos,
      correoElectronico: clienteData.correo,
      tarjeta: clienteData.tarjeta,
      planDetarjeta: clienteData.plandeTarjeta,
      PasoVenta: "Preguntas frecuentes "+ctx.body,
      Preguntas: ctx.body,
      Pago: clienteData.pago,
      enlace: clienteData.enlaceVenta
    };
    //console.error("nueva agente Pregunta: ", nuevoPost.PasoVenta);
    console.log("clienteData agente pregunta: ", clienteData.PasoVenta);
    await actualizarPost(clienteData.id, nuevoPost);
    return flowDynamic(``);
  },
  [
      flowPreguntasFrecuentes1,
      flowPreguntasFrecuentes2,
      flowPreguntasFrecuentes3,
      flowPreguntasFrecuentes4,
      flowPreguntasFrecuentes5,
      flowPreguntasFrecuentes6,
    ]
  );

const   flowAgente = addKeyword(["4"])
  .addAnswer(
    "🚀 Claro, te dirijo con un agente que puede apoyarte con tus dudas y procesos de compras"
  )
  .addAnswer("Buscando un agente Disponible...⏳", { delay: 3500 })
  
  .addAnswer(
    "Contacta al siguiente Agente dando *clic en el enlace siguiente*, por favor",
    { delay: 1500 }
  )
  .addAnswer("https://bot-whatsapp.netlify.app/")

  .addAnswer("",
  null,
  async (ctx, { flowDynamic}) => {   
    await delay(1000);

    const clienteId = ctx.from;
    const clienteData = await buscarCliente(clienteId);
  
    let nuevoPost = {
      userId: clienteData.telefono,
      id: clienteData.id,
      nombre: clienteData.nombre,
      apellidos: clienteData.apellidos,
      correoElectronico: clienteData.correo,
      tarjeta: clienteData.tarjeta,
      planDetarjeta: clienteData.plandeTarjeta,
      PasoVenta: "Hablar con un agente.",
      Preguntas: clienteData.Preguntas,
      Pago: clienteData.pago,
      enlace: clienteData.enlaceVenta
    };
    console.error("nueva agente: ", nuevoPost.PasoVenta);
  //  console.log("clienteData agente: ", clienteData.PasoVenta);
    await actualizarPost(clienteData.id, nuevoPost);
    return flowDynamic(`Contacte al agente`);
  },
  )
  .addAnswer("Para volver al menú, escribe: 👉 *menu* o *0*");


/////////////////////////BUSCAR REGISTRO/////////////////////////////

const flowPedidos = addKeyword(["5"])
.addAnswer('Claro consultado tu pedido 😊🌟',null,
async (ctx, { flowDynamic }) => {
    try {
      
      const clienteId = ctx.from; // Supongo que el ID del cliente es el ID del usuario del chat
      const clienteData = await buscarCliente(clienteId);
      enlaceVenta = clienteData.enlace

      if (clienteData.enlace !== 'revisión de compra') {
        flowDynamic(`Claro puedes validar tus propuestas en el siguiente enlace, por favor ${enlaceVenta} \nPara volver al menú, escribe: 👉 *menu* o *0*`);
      } 
      else {
        flowDynamic(`*${nombre}* Tu pedido se encuentra actualmente en estatus de *revisión de compra* en cuanto lo revisen un agente se pondra en contacto contigo, por favor  \nPara volver al menú, escribe: 👉 *menu* o *0*`);
      }
    } catch (error) {
      
      console.error("Error en el flujo de búsqueda:", error.message);
      flowDynamic(`Lo siento, estamos haciendo algunas mejoras tomara algunos minutos. \nPara volver al menú, escribe: 👉 *menu* o *0*`);
    }
  });

const flowPrincipalRegistrado = addKeyword(["menu", "0", "Menu", "cero"])
//ejemplos de textos para la conversación con emojis
.addAnswer('Hola buen día 😁',null,
async (ctx, { flowDynamic,endFlow }) => {
    try {
      const clienteId = ctx.from;
      const clienteData = await buscarCliente(clienteId);
      if (clienteData.nombre) {
        nombre = clienteData.nombre
        telefono=clienteData.userId
        flowDynamic(`Bienvenid@ ${nombre} ¿En que puedo ayudarte? *marca el número de la opción*`);
      } else {
        nombre="No estas registrado aun"
        flowDynamic("Cliente no encontrado.");
      }
    }
    catch (error) {
     if(nombre!= undefined){
      console.error("Error en el flujo de búsqueda:", error.message);
      flowDynamic(`Lo siento, estamos haciendo algunas mejoras tomara algunos minutos. ${nombre}"`);
     }else{
      console.error("Error en el flujo de búsqueda:", error.message);
      endFlow(`Lo siento, al parecer no estas registrado, registrate escribiendo *Hola* o estamos haciendo algunas mejoras tomara algunos minutos, Disculpa.`);
     }
    }
  })

  .addAnswer(
    [
      "👉 *1*.- Ver diseños", 
      "👉 *2*.- Ver precios y planes",
      "👉 *3*.- Preguntas frecuentes",
      "👉 *4*.- Hablar con un agente",
      "👉 *5*.- Ver mi compra",
    ],
    { capture: true,delay:1000 },
    (ctx, { fallBack }) => {
           if (!["1", "2", "3", "4", "5"].includes(ctx.body)) {
        return fallBack("La opción *no* es valida");
      }
    },
    [flowDisenos, flowplanes, flowPreguntasFrecuentes, flowAgente, flowPedidos]
  );

///////////////////////////////////termina flujo de registrados

const flowPrincipal = addKeyword(["Hola", "hola","validar","Validar","v","V"])
  .addAnswer(
    ["¡Hola! Soy CartBot 🤖 ¿Con quien tengo el gusto?😊 *sólo nombre*"],
    { capture: true },

    async (ctx, { fallBack, flowDynamic}) => {
      if (!expresionRegularNombre.test(ctx.body)) {
        return fallBack(
          "❌ Problema con el *nombre*, inténtalo nuevamente." 
        );
      }
      telefono = ctx.from;
      nombre = ctx.body;
      return flowDynamic(`Encantado *${nombre}*, continuamos...`);
    }
  )

  .addAnswer(
    [`Ingresa tus *apellidos*, por favor`],
    { capture: true },

    async (ctx, { fallBack, flowDynamic}) => {
      if (!expresionRegularNombre.test(ctx.body)) {
        return fallBack(
          "❌ Problema con los *apellidos*, inténtalo nuevamente."
        );
      }
      apellidos = ctx.body;
      return flowDynamic(``);
    }
  )

  .addAnswer(
    [`Por último, tu *correo electrónico*, por favor`],
    { capture: true },

    async (ctx, { fallBack, flowDynamic}) => {
      if (!expresionRegularCorreo.test(ctx.body)) {
        return fallBack(
          "❌ Problema con los *correo electrónico*, inténtalo nuevamente."
        );
      }
      correo = ctx.body;
      return flowDynamic(
        `Gracias *${nombre}*, confirma si todo está correcto.\n👤 *Nombre completo:* ${nombre} ${apellidos}\n ✉️ *Correo electrónico:* ${correo}`
      );
    }
  )

  .addAnswer(
    [`¿Es toda la información correcta?\n1️⃣ Sí\n2️⃣ No`],
    { capture: true },
    async (ctx, { flowDynamic, fallBack, endFlow }) => {
      if (ctx.body !== "1" && ctx.body !== "2") {
        return fallBack(
          "Algo no va bien Solo 👉*1* Correcto o 👉*2* Mal, por favor"
        );
      }
      if (ctx.body === "2") {
        return endFlow("Validemos si falta algo... 👉*v* para continuar");
      }
      await delay(1000);
      return flowDynamic(`Gracias *${nombre}*, por confirmar`);
    }
  )

  .addAnswer(
    "¿En que puedo ayudarte? *marca el número de la opción*",
    null,
    async (ctx, { flowDynamic }) => {
     let  nuevoPost = {
        userId: telefono,
        id: 1,
        nombre: nombre,
        apellidos: apellidos,
        correoElectronico: correo,
        tarjeta: tarjeta,
        planDetarjeta: plandeTarjeta,
        PasoVenta: pasoDeVenta,
        Preguntas: 0,
        Pago: pago,
        enlace: enlaceVenta
      };
      const data = await crearPost(nuevoPost);
      flowDynamic(data);
    }
  )

  .addAnswer(
    [
      "👉 *1*.- Ver diseños", 
      "👉 *2*.- Ver precios y planes",
      "👉 *3*.- Preguntas frecuentes",
      "👉 *4*.- Hablar con un agente",
    ],
    { capture: true },
    (ctx, { fallBack }) => {
      if (!["1", "2", "3", "4"].includes(ctx.body)) {
        return fallBack("La opción *no* es valida");
      }
    },
    [flowDisenos, flowplanes, flowPreguntasFrecuentes, flowAgente]
  );

/////////////////////////////////////////flujo de registrados
//////////////////////////////flujo de envio de mensajes de Comprado
/*
    const flowmande2 = addKeyword('mande2').addAction(async (ctx, {provider,flowDynamic}) => {

      await flowDynamic('En unos momentos te contactará uno de nuestros colaboradores');
      const mobile = "5214772301019"
      await provider.sendText(mobile + "@s.whatsapp.net", `Tu mensaje de mande Si`);
        });
*/
const main = async () => {
  const adapterDB = new MockAdapter();
  const adapterFlow = createFlow([
    flowPrincipal,
    flowPrincipalRegistrado,
  //  flowmande2,

  ]);
  const adapterProvider = createProvider(BaileysProvider);

  createBot({
    flow: adapterFlow,
    provider: adapterProvider,
    database: adapterDB,
  });

  QRPortalWeb();
};

main();
