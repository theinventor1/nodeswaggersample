const express = require('express');
const session = require('express-session');
const Keycloak = require('keycloak-connect');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const path = require('path');
const fs = require('fs'); // Importar fs para leer el archivo JSON

const app = express();
const port = 3001;

// Configuración de sesión
const memoryStore = new session.MemoryStore();
app.use(session({
    secret: 'some secret',
    resave: false,
    saveUninitialized: true,
    store: memoryStore
}));

// Cargar keycloak.json
const keycloakConfigx = JSON.parse(fs.readFileSync(path.join(__dirname, 'config/keycloak.json'), 'utf8'));

const keycloakConfig ={
clientId: 'nodeswaggersample',
serverUrl: 'http://localhost:8080/auth',
realm: 'Multirealm',
}

const keycloak = new Keycloak({ store: memoryStore }, keycloakConfig);

app.use(keycloak.middleware());

// Ruta al archivo YAML de Swagger
const swaggerDocument = YAML.load(path.join(__dirname, 'swagger.yaml'));
const swaggerDocument2 = YAML.load(path.join(__dirname, './routes/swagger.yaml'));

// Middleware para servir la documentación generada por Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Rutas de ejemplo
app.get('/saludo', (req, res) => {
  console.log('hola mundo');
  res.send('¡Hola, mundo!');
});

app.get('/', (req, res) => {
  res.send('¡soy una API root!');
});

// Rutas protegidas por Keycloak
app.get('/llave2', keycloak.protect(), (req, res) => {
  res.send('¡soy una API REST2!');
});

// Rutas protegidas por Keycloak
app.get('/key' , keycloak.protect(), (req, res) => {

  res.send('¡soy una API REST2!');
});


app.get('/usuario/:id', (req, res) => {
  const userId = req.params.id;
  // Simulación de búsqueda de usuario
  if (userId === '1') {
    res.json({ id: 1, nombre: 'Ejemplo' });
  } else {
    res.status(404).json({ error: 'Usuario no encontrado' });
  }
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
