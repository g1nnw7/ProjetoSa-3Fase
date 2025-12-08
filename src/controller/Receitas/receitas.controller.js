import obterRespostaReceita from "../../services/openia.service.js";

export const perguntarReceita = async (req, res) => {
    try{

    const { pergunta } = req.body

    if(!pergunta) {
        return res.status(400).json({
            erro: 'É obrigátorio enviar uma pergunta'
        })
    }

    const resposta = await obterRespostaReceita(pergunta)

    res.json({ resposta })
} catch(err){
    res.status(500).json({
        erro: 'Erro ao processar sua pergunta. Tente novamente'
    })
}

}