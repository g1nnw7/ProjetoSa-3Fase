// Arquivo: src/services/api.js

import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL

export const api = async (pergunta) => {

    // Confirme se o nome no localStorage é 'accessToken' ou apenas 'token'
    // Se no login você salvou como 'token', mude aqui para 'token'
    const token = localStorage.getItem('accessToken'); 

    console.log("🔑 Token recuperado:", token); 

    try{
        const response = await axios.post(
            `${API_URL}receitas/perguntar`, 
            { pergunta }, // 2º Argumento: O Corpo (Body)
            {             // 3º Argumento: A Configuração (Headers) <--- FALTOU ISSO
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        )

        return response.data.resposta

    } catch(err){
        console.error('Erro ao buscar a resposta do servidor', err)
        throw err;
    }
}