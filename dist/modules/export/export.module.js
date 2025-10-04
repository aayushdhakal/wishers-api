"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExportModule = void 0;
const common_1 = require("@nestjs/common");
const database_module_1 = require("../../database/database.module");
const export_controller_1 = require("./controllers/export.controller");
const export_service_1 = require("../../services/export/export.service");
const event_repository_1 = require("../../database/repositories/event.repository");
const user_repository_1 = require("../../database/repositories/user.repository");
let ExportModule = class ExportModule {
};
exports.ExportModule = ExportModule;
exports.ExportModule = ExportModule = __decorate([
    (0, common_1.Module)({
        imports: [database_module_1.DatabaseModule],
        controllers: [export_controller_1.ExportController],
        providers: [export_service_1.ExportService, event_repository_1.EventRepository, user_repository_1.UserRepository],
        exports: [export_service_1.ExportService],
    })
], ExportModule);
//# sourceMappingURL=export.module.js.map