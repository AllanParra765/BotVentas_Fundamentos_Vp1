const fs = require('fs');
const path = require('path');
const express = require('express');
const app = express();
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const morgan = require('morgan');
const winston = require('winston');
const https = require('https');

app.use(helmet()); // Diversas configuraciones de seguridad, incluida protección XSS


const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100 // máximo 100 solicitudes por IP
});

app.use(limiter);


// Definir la ruta relativa al archivo contactos.json
const rutaCarpetaEscritorio = path.join(__dirname, '../../contacto');
const archivoContactos = path.join(rutaCarpetaEscritorio, 'contactos.json');



// Configuración de winston
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'tu-servidor' },
  transports: [
    new winston.transports.File({ maxsize: 5120000, maxFiles:5, filename: `${rutaCarpetaEscritorio}/contactos.log` })
  ]
});

// Crear un flujo de escritura a un archivo de registros
const logFileStream = fs.createWriteStream(`${rutaCarpetaEscritorio}/contactos.log`, { flags: 'a' });

// Asignar el flujo de escritura a logger.stream
logger.stream = {
  write: (message) => {
    logFileStream.write(message);
  }
};

// Configurar morgan para utilizar logger.stream
app.use(morgan('combined', { stream: logger.stream }));



// Cargar los datos del archivo JSON
function cargarContactos() {
// Crear la carpeta si no existe
if (!fs.existsSync(rutaCarpetaEscritorio)) {
  fs.mkdirSync(rutaCarpetaEscritorio);
}

// Comprobar si el archivo existe antes de leerlo o escribirlo
if (fs.existsSync(archivoContactos)) {
  // Hacer algo con el archivo existente
  try {
    const datos = fs.readFileSync(archivoContactos, 'utf8');
    return JSON.parse(datos);
} catch (error) {
    return []; // Si el archivo no existe o hay un error al leerlo, retornamos un array vacío
}
} else {
  // Crear el archivo si no existe
  fs.writeFileSync(archivoContactos, JSON.stringify([]));
}

}


function guardarContactos(contactos) {
  fs.writeFileSync(archivoContactos, JSON.stringify(contactos, null, 2), 'utf8');
}


app.use(express.json());
const contactos = cargarContactos();
//const contactos = []; // Array para almacenar los contactos (simulando una base de datos)

// Ruta para obtener todos los contactos
app.get('/api/contactos', (req, res) => {
  res.json(contactos);
  // Guardar los contactos actualizados en el archivo
guardarContactos(contactos);
});

app.get('/api/contactos/:phoneNumber', (req, res) => {
  const phoneNumber = req.params.phoneNumber;
  const contacto = contactos.find(c => c.userId === phoneNumber);

  if (contacto) {
    res.json(contacto);
    // Guardar los contactos actualizados en el archivo
guardarContactos(contactos);
  } else {
    res.status(404).json({ error: 'Contacto no encontrado.' });
  }
});


const { body, validationResult } = require('express-validator');
// ...

app.post('/api/contactos', [
  body('userId').isString().notEmpty(),
  body('id').isUUID(), // Validación para UUID
  body('nombre').isString().notEmpty(),
  body('apellidos').isString().notEmpty(),
  body('correoElectronico').isEmail(),
  body('tarjeta').isString().notEmpty(),
  body('planDetarjeta').isInt(), // Validación para número entero
  body('PasoVenta').isString().notEmpty(),
  body('Preguntas').isInt(), // Validación para número entero
  body('Pago').isInt(), // Validación para número entero
  body('enlace').isString().notEmpty(),
], (req, res) => {
 
  // Procede con la creación del nuevo post
  const nuevoContacto = {
    userId: req.body.userId,
    id: req.body.id,
    nombre: req.body.nombre,
    apellidos: req.body.apellidos,
    correoElectronico: req.body.correoElectronico,
    tarjeta: req.body.tarjeta,
    planDetarjeta: req.body.planDetarjeta,
    PasoVenta: req.body.PasoVenta,
    Preguntas: req.body.Preguntas,
    Pago: req.body.Pago,
    enlace: req.body.enlace
  };

//  const nuevoContacto = req.body;
    // Generar un ID único utilizando uuid
    nuevoContacto.id = uuidv4();
  //nuevoContacto.id = contactos.length + 1; // Generar un ID único
  contactos.push(nuevoContacto);
  // Guardar los contactos actualizados en el archivo
  guardarContactos(contactos);

  res.status(201).json(nuevoContacto);
/*
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  */
});



/*
// Ruta para crear un nuevo contacto
app.post('/api/contactos', (req, res) => {
  const nuevoContacto = req.body;
  nuevoContacto.id = contactos.length + 1; // Generar un ID único
  contactos.push(nuevoContacto);
  // Guardar los contactos actualizados en el archivo
guardarContactos(contactos);

  res.status(201).json(nuevoContacto);
});
*/



app.put('/api/contactos/:id', [
  body('tarjeta').isString().notEmpty(),
  body('planDetarjeta').isString().notEmpty(),
  body('PasoVenta').isString().notEmpty(),
  body('Preguntas').isInt(),
  body('Pago').isInt(),
  body('enlace').isString().notEmpty(), // Validación para el campo "nombre"
], (req, res) => {
  const id = req.params.id;
  const nombreActualizado = req.body.nombre; // El nuevo valor para el campo "nombre"
  const tarjeta = req.body.tarjeta;
  const planDetarjeta = req.body.planDetarjeta;
  const PasoVenta = req.body.PasoVenta;
  const Preguntas = req.body.Preguntas;
  //const Pago = req.body.Pago;
  //const enlace = req.body.enlace;
 

  // Buscar el contacto en el array de contactos
  const contacto = contactos.find(c => c.id === id);

  if (contacto) {
    // Actualizar el campo "nombre" del contacto
    contacto.nombre = nombreActualizado;
    contacto.tarjeta = tarjeta;
    contacto.planDetarjeta = planDetarjeta;
    contacto.PasoVenta = PasoVenta;
    contacto.Preguntas = Preguntas;
   //contacto.Pago = Pago;
    //contacto.enlace = enlace;

    // Guardar los contactos actualizados en el archivo
    guardarContactos(contactos);

    res.json(contacto);
  } else {
    res.status(404).json({ error: 'Contacto no encontrado.' });
  }
  /*const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  */
});


/*
// Ruta para actualizar un contacto por su ID
app.put('/api/contactos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const contactoIndex = contactos.findIndex(c => c.id === id);

  if (contactoIndex !== -1) {
    contactos[contactoIndex] = { ...contactos[contactoIndex], ...req.body };
    res.json(contactos[contactoIndex]);
    // Guardar los contactos actualizados en el archivo
guardarContactos(contactos);
  } else {
    res.status(404).json({ error: 'Contacto no encontrado.' });
  }
});
*/

// Ruta para eliminar un contacto por su ID
app.delete('/api/contactos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const contactoIndex = contactos.findIndex(c => c.id === id);

  if (contactoIndex !== -1) {
    const contactoEliminado = contactos.splice(contactoIndex, 1);
    res.json(contactoEliminado[0]);
    // Guardar los contactos actualizados en el archivo
guardarContactos(contactos);
  } else {
    res.status(404).json({ error: 'Contacto no encontrado.' });
  }
});

//cambia la url a hhtp
const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});




/*

// Cargar los certificados
const privateKey = fs.readFileSync('private-key.pem', 'utf8');// Tu clave privada
const certificate = fs.readFileSync('certificate.pem', 'utf8');// Tu certificado
const credentials = { key: privateKey, cert: certificate };

// Crear un servidor HTTPS solofunciona con POSTMAN cambia la url a hhtps
const httpsServer = https.createServer(credentials, app);

// Escuchar en el puerto 4000 (o el puerto que prefieras)
httpsServer.listen(4000, () => {
  console.log('Servidor HTTPS escuchando en el puerto 4000');
});
*/

