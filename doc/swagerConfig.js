const swaggerJsDoc = require("swagger-jsdoc");
require('dotenv').config();
const path = require('path');

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Calendário Econômico",
      version: "1.0.0",
      description: "Obtenha os resultados das reuniões/eventos que movimentam os as cotações das moedas no mundo inteiro."
    },
    servers: [
      {
        url: process.env.NODE_ENV == 'Production' ? "https://economicalendar.site" : "http://localhost:3000", // URL do seu servidor
      },
    ],
  },
  apis: [ "./doc/swagger.yaml"], // Caminho absoluto
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
module.exports = swaggerDocs;
