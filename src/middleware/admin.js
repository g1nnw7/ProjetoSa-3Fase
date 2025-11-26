export function adminAuth(req, res, next) {
    const user = req.auth;

    if (!user) {
        return res.status(401).json({ error: "Não autenticado." });
    }

    if (user.role !== 'ADMIN') {
        return res.status(403).json({ error: "Acesso negado. Área restrita para administradores." });
    }

    next();
}