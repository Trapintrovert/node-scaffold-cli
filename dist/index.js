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
exports.generateFiles = exports.generateResource = void 0;
var generate_1 = require("./commands/generate");
Object.defineProperty(exports, "generateResource", { enumerable: true, get: function () { return generate_1.generateResource; } });
var fileGenerator_1 = require("./generators/fileGenerator");
Object.defineProperty(exports, "generateFiles", { enumerable: true, get: function () { return fileGenerator_1.generateFiles; } });
__exportStar(require("./utils/stringUtils"), exports);
//# sourceMappingURL=index.js.map