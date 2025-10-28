"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProfile = exports.updatePersonalInfo = exports.getProfile = exports.createUser = void 0;
const userService_1 = require("../services/userService");
/**
 * Controller para criação de usuário
 *
 * Recebe os dados do usuário via body da requisição,
 * valida os dados, chama o serviço para criar o usuário
 * e retorna a resposta apropriada.
 *
 * @param req - Requisição Express contendo os dados do usuário no body
 * @param res - Resposta Express
 */
const createUser = async (req, res) => {
    try {
        const user = await userService_1.UserService.createUser(req.body);
        res.status(201).json({
            success: true,
            message: 'Usuário criado com sucesso',
            user: user
        });
    }
    catch (error) {
        console.error('Erro ao criar usuário:', error);
        // Tratamento específico de erros
        if (error.message === 'Email já está cadastrado') {
            return res.status(409).json({
                success: false,
                error: 'Email já está cadastrado',
                code: 'EMAIL_ALREADY_EXISTS'
            });
        }
        // Erro genérico
        res.status(500).json({
            success: false,
            error: 'Erro interno do servidor',
            code: 'INTERNAL_SERVER_ERROR'
        });
    }
};
exports.createUser = createUser;
/**
 * Controller para buscar o perfil do usuário logado.
 * Chama o serviço que busca os dados no banco.
 */
const getProfile = async (req, res) => {
    console.log("--- [CONTROLLER] A função getProfile foi chamada. ---");
    try {
        // O ID do usuário é injetado na requisição pelo seu middleware de autenticação
        const userId = req.user.id;
        const userProfile = await userService_1.UserService.getProfile(userId);
        res.status(200).json(userProfile);
    }
    catch (error) {
        const errorMessage = error.message;
        // Retorna erros específicos vindos do serviço
        if (errorMessage === "Usuário não encontrado") {
            return res.status(404).json({ success: false, error: errorMessage });
        }
        // Retorna um erro genérico para outros casos
        res.status(500).json({ success: false, error: 'Erro interno do servidor' });
    }
};
exports.getProfile = getProfile;
/**
 * Controller para atualizar informações pessoais do usuário logado.
 * Chama o serviço que salva os dados pessoais no banco.
 */
const updatePersonalInfo = async (req, res) => {
    try {
        const userId = req.user.id;
        const personalData = req.body;
        // Validar dados de entrada - incluir avatar também
        const allowedFields = ['name', 'email', 'contact', 'avatar'];
        const filteredData = {};
        for (const field of allowedFields) {
            if (personalData[field] !== undefined) {
                filteredData[field] = personalData[field];
            }
        }
        const updatedUser = await userService_1.UserService.updatePersonalInfo(userId, filteredData);
        res.status(200).json({
            success: true,
            message: 'Informações pessoais atualizadas com sucesso',
            user: {
                id: updatedUser.id,
                name: updatedUser.name,
                email: updatedUser.email,
                contact: updatedUser.contact
            }
        });
    }
    catch (error) {
        console.error("Controller Error - updatePersonalInfo:", error);
        const errorMessage = error.message;
        if (errorMessage === 'Nome não pode ser vazio' ||
            errorMessage === 'Email não pode ser vazio' ||
            errorMessage === 'Telefone não pode ser vazio' ||
            errorMessage === 'Formato de email inválido' ||
            errorMessage === 'Email já está em uso') {
            return res.status(400).json({
                success: false,
                error: errorMessage,
                code: 'VALIDATION_ERROR'
            });
        }
        res.status(500).json({
            success: false,
            error: 'Erro interno do servidor ao atualizar informações pessoais',
            code: 'INTERNAL_SERVER_ERROR'
        });
    }
};
exports.updatePersonalInfo = updatePersonalInfo;
/**
 * Controller para atualizar o perfil do usuário logado (método legado).
 * Chama o serviço que salva os dados no banco.
 */
const updateProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const profileData = req.body;
        // Chama o serviço para atualizar os dados
        await userService_1.UserService.updateProfile(userId, profileData);
        res.status(200).json({ success: true, message: 'Perfil atualizado com sucesso' });
    }
    catch (error) {
        console.error("Controller Error - updateProfile:", error); // Log para ajudar na depuração
        res.status(500).json({ success: false, error: 'Erro interno do servidor ao atualizar perfil' });
    }
};
exports.updateProfile = updateProfile;
//# sourceMappingURL=userController.js.map