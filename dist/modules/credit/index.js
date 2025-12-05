"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreditController = exports.CreditModule = void 0;
var credit_module_1 = require("./credit.module");
Object.defineProperty(exports, "CreditModule", { enumerable: true, get: function () { return credit_module_1.CreditModule; } });
var controllers_1 = require("./controllers");
Object.defineProperty(exports, "CreditController", { enumerable: true, get: function () { return controllers_1.CreditController; } });
__exportStar(require("./dto"), exports);
//# sourceMappingURL=index.js.map