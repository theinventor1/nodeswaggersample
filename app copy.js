const express = require('express');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();
const port = 3000;

// Swagger configuration
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0', // Especificación OpenAPI (Swagger) utilizada
    info: {
      title: 'API con Swagger y Express',
      version: '1.0.0',
      description: 'Ejemplo de API con Swagger y Express',
    },
  },
  apis: ['app.js'], // Rutas y/o archivos donde se encuentra la documentación de la API
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);

// Middleware para servir la documentación generada por Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Rutas de ejemplo
/**
 * @swagger
 * /saludo:
 *   get:
 *     summary: Retorna un saludo simple
 *     responses:
 *       200:
 *         description: Saludo exitoso
 */
app.get('/saludo', (req, res) => {
  res.send('¡Hola, mundo!');
});

/**
 * @swagger
 * /usuario/{id}:
 *   get:
 *     summary: Retorna un usuario por su ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID del usuario a buscar
 *     responses:
 *       200:
 *         description: Usuario encontrado
 *       404:
 *         description: Usuario no encontrado
 */
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
