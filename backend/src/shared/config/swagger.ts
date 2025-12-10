import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";
import { swaggerDocBuilt } from "./docs"

const servers_list = process.env.SERVERS_LIST?.split(",");


const options: swaggerJSDoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "EDU_CRM API",
      version: "0.0.4",
      description:
        "API documentation for the Edu_CRM backend application.",
    },
    servers: servers_list?.map((item) => ({ url: item })),
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: ["./src/features/**/*.ts"],
};

const swaggerSpec = process.env.NODE_ENV === "production" ? swaggerDocBuilt : swaggerJSDoc(options);

export const setupSwagger = (app: Express) => {
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  app.get("/docs-json", (_, res) => res.json(swaggerSpec))
};
