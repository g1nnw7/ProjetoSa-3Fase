export const env = {
    accessSecret: process.env.ACCESS_TOKEN_SECRET ?? "",
    refreshSecret: process.env.REFRESH_TOKEN_SECRET ?? "",
    accessTtl: process.env.JWT_ACCESS_EXPIRES_IN ?? "15m",
    refreshTtl: process.env.JWT_REFRESH_EXPIRES_IN ?? "8h",
};
