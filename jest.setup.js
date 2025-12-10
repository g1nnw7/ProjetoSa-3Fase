// Define as variáveis de ambiente que o os testes vão compartilhar
process.env.ACCESS_TOKEN_SECRET = "chave_secreta_teste_123";
process.env.REFRESH_TOKEN_SECRET = "chave_refresh_teste_123";
process.env.JWT_ACCESS_EXPIRES_IN = "1h";
process.env.JWT_REFRESH_EXPIRES_IN = "1d";