// for AdonisJS v6
import path from "node:path";
import url from "node:url";
// ---

export default {
  path: path.dirname(url.fileURLToPath(import.meta.url)) + "/../",
  tagIndex: 2,
  info: {
    title: "Eventownik backend",
    version: "0.5.0",
    description: "Eventownik backend API documentation",
  },
  snakeCase: false,
  ignore: ["/swagger", "/docs"],
  preferredPutPatch: "PUT", // if PUT/PATCH are provided for the same route, prefer PUT
  common: {
    parameters: {}, // OpenAPI conform parameters that are commonly used
    headers: {}, // OpenAPI conform headers that are commonly used
  },
  securitySchemes: {}, // optional
  authMiddlewares: ["auth", "auth:api"], // optional
  defaultSecurityScheme: "BearerAuth", // optional
  showFullPath: false, // the path displayed after endpoint summary
};