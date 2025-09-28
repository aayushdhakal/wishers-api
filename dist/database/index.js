"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseModule = exports.UserRepository = exports.PrismaService = void 0;
var prisma_service_1 = require("./prisma.service");
Object.defineProperty(exports, "PrismaService", { enumerable: true, get: function () { return prisma_service_1.PrismaService; } });
var user_repository_1 = require("./repositories/user.repository");
Object.defineProperty(exports, "UserRepository", { enumerable: true, get: function () { return user_repository_1.UserRepository; } });
var database_module_1 = require("./database.module");
Object.defineProperty(exports, "DatabaseModule", { enumerable: true, get: function () { return database_module_1.DatabaseModule; } });
//# sourceMappingURL=index.js.map