const swaggerJsdoc = require('swagger-jsdoc')

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Employee Management API",
            version: "1.0.0",
            description: "API documentation for Employee Management System",
        },
        servers: [
            {
            url: "http://localhost:5000",
            },
            {

               url: "https://employee-management-system-backend-only-production.up.railway.app",
               description: "Production",


            },
            
        ],

        components: {
            securitySchemes: {
            bearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT"
        },
       },
      },
    },
    apis: ["./Routes/*.js"]




};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
