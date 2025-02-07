import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";

const options: swaggerJsdoc.Options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Email Service API",
            version: "1.0.0",
            description: "API documentation for my Email Service",
        },
        servers: [
            {
                url: "http://localhost:8080",
                description: "Local server",
            },
        ],
    },
    apis: ["./src/routes/EmailRoutes.ts", "./src/routes/StatsRoutes.ts", "./src/routes/AuthRoutes.ts"],
};

const swaggerSpec = swaggerJsdoc(options);

export function setupSwagger(app: Express) {
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}
