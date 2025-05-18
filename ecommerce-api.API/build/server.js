"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Shutdown = exports.httpServer = exports.application = void 0;
const http_1 = __importDefault(require("http"));
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const dotenv_1 = __importDefault(require("dotenv"));
require("./config/logging");
const db_1 = require("./config/db");
const inventory_1 = __importDefault(require("./routes/inventory"));
const shipmentRoutes_1 = __importDefault(require("./routes/shipmentRoutes"));
const transactionRoutes_1 = __importDefault(require("./routes/transactionRoutes"));
const categoryRoutes_1 = __importDefault(require("./routes/categoryRoutes"));
const productRoutes_1 = __importDefault(require("./routes/productRoutes"));
const rolesRoutes_1 = __importDefault(require("./routes/rolesRoutes"));
const permissionRoutes_1 = __importDefault(require("./routes/permissionRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const orderRoutes_1 = __importDefault(require("./routes/orderRoutes"));
const orderDetailRoutes_1 = __importDefault(require("./routes/orderDetailRoutes"));
const paymentRoutes_1 = __importDefault(require("./routes/paymentRoutes"));
const supplierRoutes_1 = __importDefault(require("./routes/supplierRoutes"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const webhookRoutes_1 = __importDefault(require("./routes/webhookRoutes"));
const cors_1 = __importDefault(require("cors"));
const loggingHandler_1 = require("./Middleware/loggingHandler");
const routeNotFound_1 = require("./Middleware/routeNotFound");
const swagger_1 = require("./config/swagger");
const auditTrailMiddleware_1 = require("./Middleware/auditTrailMiddleware"); // Import the middleware
const userRoutes_2 = __importDefault(require("./routes/userRoutes"));
const path_1 = __importDefault(require("path"));
const defaultMaterialRoutes_1 = __importDefault(require("./routes/defaultMaterialRoutes"));
dotenv_1.default.config();
exports.application = (0, express_1.default)();
const Main = async () => {
    logging.log("----------------------------------------");
    logging.log("Initializing API");
    logging.log("----------------------------------------");
    exports.application.use(express_1.default.urlencoded({ extended: true }));
    exports.application.use(express_1.default.json());
    exports.application.use('/uploads', express_1.default.static(path_1.default.join(__dirname, '..', 'uploads')));
    logging.log("----------------------------------------");
    logging.log("Swagger UI");
    logging.log("----------------------------------------");
    exports.application.use("/api", userRoutes_2.default);
    exports.application.use("/api/docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.specs, {
        explorer: true,
        customCss: ".swagger-ui .topbar { display: none }",
        customSiteTitle: "Your API Documentation",
    }));
    logging.log("----------------------------------------");
    logging.log("Connect to Mongo");
    logging.log("----------------------------------------");
    try {
        const connection = await mongoose_1.default.connect(db_1.mongo.MONGO_CONNECTION, db_1.mongo.MONGO_OPTIONS);
        logging.log("Connected to Mongo:", connection.version);
    }
    catch (error) {
        logging.error("Unable to connect to Mongo", error);
    }
    logging.log("----------------------------------------");
    logging.log("Logging & Configuration");
    logging.log("----------------------------------------");
    exports.application.use(loggingHandler_1.loggingHandler);
    exports.application.use((0, cors_1.default)({
        origin: "http://localhost:4200", // ✅ Allow Angular frontend
        credentials: true,
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS"
    }));
    exports.application.use(auditTrailMiddleware_1.auditTrailMiddleware);
    logging.log("----------------------------------------");
    logging.log("Define Controller Routing");
    logging.log("----------------------------------------");
    // Existing routes
    exports.application.use(inventory_1.default);
    exports.application.use(transactionRoutes_1.default);
    exports.application.use(shipmentRoutes_1.default);
    exports.application.use(categoryRoutes_1.default);
    exports.application.use(productRoutes_1.default);
    exports.application.use(orderDetailRoutes_1.default);
    exports.application.use(orderRoutes_1.default);
    exports.application.use(paymentRoutes_1.default);
    exports.application.use(rolesRoutes_1.default);
    exports.application.use(permissionRoutes_1.default);
    exports.application.use(userRoutes_1.default);
    exports.application.use(supplierRoutes_1.default);
    exports.application.use(authRoutes_1.default);
    exports.application.use(webhookRoutes_1.default);
    exports.application.use("/api/v1", defaultMaterialRoutes_1.default);
    // Error Handling
    logging.log("----------------------------------------");
    logging.log("Define Routing Error");
    logging.log("----------------------------------------");
    exports.application.use(routeNotFound_1.routeNotFound);
    logging.log("----------------------------------------");
    logging.log("Starting Server");
    logging.log("----------------------------------------");
    exports.httpServer = http_1.default.createServer(exports.application);
    exports.httpServer.listen(db_1.server.SERVER_PORT, () => {
        logging.log(`Server started on ${db_1.server.SERVER_HOSTNAME}:${db_1.server.SERVER_PORT}`);
    });
};
const Shutdown = (callback) => exports.httpServer && exports.httpServer.close(callback);
exports.Shutdown = Shutdown;
Main();
