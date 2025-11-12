import jwt from "jsonwebtoken";
import { env } from "../../env.js";

export function signAccessToken(payload) {
    console.log(env);
    return jwt.sign(payload, env.accessSecret, {
        expiresIn: env.accessTtl, // <- sem Number()
    });
}

export function signRefreshToken(payload) {
    return jwt.sign(payload, env.refreshSecret, {
        expiresIn: env.refreshTtl, // <- sem Number()
    });
}

export function verifyAccess(token) {
    return jwt.verify(token, env.accessSecret);
}

export function verifyRefresh(token) {
    return jwt.verify(token, env.refreshSecret);
}

export function getToken(token) {
    const tokenWithoutBearer = token.slice("Bearer ".length);
    return jwt.decode(tokenWithoutBearer);
}
