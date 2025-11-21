
import bcrypt from "bcrypt";
import { prismaClient } from "../../../prisma/prisma.js";
import {
    signAccessToken,
    signRefreshToken,
    verifyRefresh,
} from "../../utils/jwt.js";


class AuthController {
    constructor() { }

    async register(
        req,
        res
    ) {
        try {
            const { email, senha, nome } = req.body;
            if (!email || !senha) {
                return res.status(400).json({ error: "Email e senha são obrigatórios" });
            }
            const existingUser = await prismaClient.usuario.findUnique({
                where: { email },
            });
            console.log(existingUser)
            if (existingUser) {
                return res.status(409).json({ error: "Usuário já existe" });
            }
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(senha, saltRounds);
            const user = await prismaClient.usuario.create({
                data: { email, senha: hashedPassword, nome: nome },
                select: {
                    id: true,
                    email: true,
                    nome: true,
                },
            });
            return res.status(201).json(user);
        } catch (error) {
            console.error("Erro no registro:", error);
            res.status(500).json({ error: "Erro interno do servidor" });
        }
        return res.status(400).send("Not Found");
    };

    async login(req, res) {
        try {
            const { email, senha } = req.body;
            const user = await prismaClient.usuario.findUnique({ where: { email } }); // Verificar se usuário existe e senha está correta
            if (!user || !(await bcrypt.compare(senha, user.senha))) {
                return res.status(401).json({ error: "Credenciais inválidas" });
            }
            const accessToken = signAccessToken({
                userId: user.id,
                email: user.email,
                nome: user.nome,
            });
            const refreshToken = signRefreshToken({
                userId: user.id,
                email: user.email,
                nome: user.nome,
            });
            const expiresAt = new Date();
            expiresAt.setDate(expiresAt.getDate() + 7);
            console.log(refreshToken)
            await prismaClient.token.create({
                data: {
                    token: refreshToken,
                    type: "refresh",
                    usuarioId: user.id,
                    expiresAt,
                },
            });
            res.status(200).json({
                accessToken,
                refreshToken,
                user: {
                    id: user.id,
                    email: user.email,
                    nome: user.nome,
                },
            });
        } catch (error) {
            console.error("Erro no login:", error);
            res.status(500).json({ error: "Erro interno do servidor" });
        }
        return res;
    };

    async refresh(
        req,
        res
    ) {
        const { refreshToken } = req.body;
        const storedRefreshToken = await prismaClient.token.findFirst({
            where: { token: refreshToken },
        });
        if (
            !storedRefreshToken ||
            storedRefreshToken.revoked ||
            storedRefreshToken.expiresAt < new Date()
        )
            return res.status(401).json({ error: "invalid refresh token" });

        try {
            const payload = verifyRefresh(refreshToken);
            const accessToken = signAccessToken({
                userId: payload.userId,
                email: payload.email,
                nome: payload.nome,
            });
            return res.json({ accessToken });
        } catch {
            return res.status(401).json({ error: "invalid refresh token" });
        }
    };

    async logout(
        req,
        res
    ) {
        const { refreshToken } = req.body;
        try {
            const storedRefreshToken = await prismaClient.token.findFirst({
                where: { token: refreshToken },
            });
            if (
                !storedRefreshToken ||
                storedRefreshToken.revoked ||
                storedRefreshToken.expiresAt < new Date()
            )
                return res.status(401).json({ error: "invalid refresh token" });

            await prismaClient.token.updateMany({
                where: { id: storedRefreshToken?.id ?? 0 },
                data: { revoked: true },
            });
        } catch (error) {
            res.status(400).json(error)
        }

        return res.status(200).json("Usuário deslogado!");

    }

    async changePassword(req, res) {
        try {

            const userId = req.auth?.id || req.auth?.userId;

            if (!userId) {
                return res.status(401).json({ error: "ID do utilizador não encontrado. Acesso negado." });
            }
            const { senhaAtual, novaSenha } = req.body;
            if (!senhaAtual || !novaSenha) {
                return res.status(400).json({ error: "Todos os campos são obrigatórios." });
            }
            if (novaSenha.length < 8) {
                return res.status(400).json({ error: "A nova senha deve ter pelo menos 8 caracteres." });
            }
            const user = await prismaClient.usuario.findUnique({
                where: { id: userId },
            });

            if (!user) {
                return res.status(404).json({ error: "Utilizador não encontrado." });
            }
            const isPasswordCorrect = await bcrypt.compare(senhaAtual, user.senha);
            if (!isPasswordCorrect) {
                return res.status(401).json({ error: "A senha atual está incorreta." });
            }

            const saltRounds = 10;
            const hashedNewPassword = await bcrypt.hash(novaSenha, saltRounds);
            await prismaClient.usuario.update({
                where: { id: userId },
                data: { senha: hashedNewPassword },
            });

            return res.status(200).json({ message: "Senha alterada com sucesso!" });

        } catch (error) {
            console.error("Erro ao alterar senha:", error);
            res.status(500).json({ error: "Erro interno do servidor" });
        }
    }

    async deleteAccount(req, res) {
        try {
            const userId = req.auth?.id || req.auth?.userId;
            const { password } = req.body;

            if (!userId) return res.status(401).json({ error: "Não autenticado." });
            if (!password) return res.status(400).json({ error: "Senha é obrigatória." });

            // 1. Buscar o usuário para verificar a senha
            const user = await prismaClient.usuario.findUnique({
                where: { id: userId },
            });

            if (!user) return res.status(404).json({ error: "Usuário não encontrado." });

            // 2. Verificar senha
            const isPasswordCorrect = await bcrypt.compare(password, user.senha);
            if (!isPasswordCorrect) {
                return res.status(401).json({ error: "Senha incorreta." });
            }

            // 3. Transação para deletar dados relacionados primeiro (Tokens, Endereços, etc)
            // Isso evita erros de chave estrangeira (Foreign Key Constraint)
            await prismaClient.$transaction([
                prismaClient.token.deleteMany({ where: { usuarioId: userId } }),
                // Adicione aqui outras tabelas se necessário, ex:
                // prismaClient.endereco.deleteMany({ where: { userId: userId } }), 
                prismaClient.usuario.delete({ where: { id: userId } }),
            ]);

            return res.status(200).json({ message: "Conta excluída com sucesso." });

        } catch (error) {
            console.error("Erro ao excluir conta:", error);
            return res.status(500).json({ error: "Erro interno ao excluir conta." });
        }
    }


}






export const authController = new AuthController();