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
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.createEmployee = void 0;
const employeeService = __importStar(require("../services/employeeService"));
/**
 * Controller para criação de funcionário
 *
 * Recebe os dados do usuário via body da requisição,
 * chama o serviço para criar o funcionário e retorna a resposta apropriada.
 *
 * @param req - Requisição Express contendo os dados do funcionário no body
 * @param res - Resposta Express
 */
const createEmployee = async (req, res) => {
    try {
        const employee = await employeeService.createEmployee(req.body);
        res.status(201).json({ employee: employee });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
};
exports.createEmployee = createEmployee;
//# sourceMappingURL=employeeController.js.map