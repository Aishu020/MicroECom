const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "MicroECom API Gateway",
      version: "1.0.0",
      description: "Gateway documentation for MicroECom services"
    },
    servers: [
      {
        url: "http://localhost:8080",
        description: "Local gateway"
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT"
        }
      }
    },
    security: [{ bearerAuth: [] }]
  },
  apis: [__dirname + "/swaggerRoutes.js"]
};

module.exports = swaggerJsdoc(options);
