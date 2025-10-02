const swaggerJsdoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Pet Adoption',
      version: '1.0.0',
      description: 'API para gerenciamento de pets para adoção',
    },
    servers: [
      {
        url: 'http://localhost:5000/',
        description: 'Servidor Local',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      { bearerAuth: [] },
    ],
  },
  apis: ['./routes/*.js', './models/*.js'], // Caminho dos arquivos com anotações
}

const swaggerSpec = swaggerJsdoc(options)

function swaggerDocs(app) {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
  console.log('📄 Swagger rodando em: http://localhost:5000/api-docs')
}

module.exports = swaggerDocs
