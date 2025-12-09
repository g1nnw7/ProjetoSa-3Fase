import React, { useState } from 'react'
import ListaMensagens from '../ListaMensagens/ListaMensagens'
import ChatBox from '../ChatBox/ChatBox'
import { api } from '../../services/api'

const DevReceita = () => {
const [loading, setLoading] = useState(false)
const [mensagens, setMensagens] = useState([
    {
        id:1,
        texto:'Olá! Sou sua assistente de receitas. Como posso ajudar você hoje?',
        remetente:'bot'
    },
])

const onEnviarMensagem = async (mensagem) => {
    const novaMensagemUsuario = {
        id: Date.now(),
        texto: mensagem,
        remetente: 'usuario'
    }

    setMensagens( prev => [...prev, novaMensagemUsuario])
    setLoading(true)

    try{

        const resposta = await api(mensagem)

        const novaMensagemBot = {
             id: Date.now() + 1,
             texto: resposta,
             remetente: 'bot'
        }

        setMensagens( prev => [...prev, novaMensagemBot])

    } catch(err){
        console.error(err)

         const novaMensagem = {
        id: Date.now(),
        texto: 'Falha ao enviar, tente novamente',
        remetente: 'bot'
    }

    setMensagens( prev => [...prev, novaMensagem])
    } finally {
        setLoading(false)
    }

}

  return (
    <div className="min-h-screen bg-linear-to-b from-green-50 to-green-100 p-4 md:p-6">
        <div className="max-w-4xl mx-auto">
            
            {/* Cabeçalho Ajustado: Margem inferior reduzida (mb-4) e padding reduzido */}
            <header className='flex flex-col items-center justify-center mb-4 pt-2'>
                
                {/* Título: Tamanho levemente reduzido para proporção */}
                <h1 className='text-3xl md:text-4xl font-extrabold tracking-tight text-gray-800 mb-2'>
                    Nutri
                    <span className="bg-clip-text text-transparent bg-linear-to-r from-green-600 to-emerald-500 ml-2">
                        IA
                    </span>
                </h1>
                
                {/* Subtítulo */}
                <div className="flex items-center gap-2 text-gray-500 font-medium bg-white/50 px-3 py-1 rounded-full border border-green-50/50">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                    <p className='text-xs md:text-sm'>Assistente de Culinária Inteligente</p>
                </div>
            </header>

            {/* Altura reduzida de 600px para 500px para ficar mais compacto */}
            <div className='bg-white rounded-2xl shadow-lg border border-green-100 overflow-hidden h-[500px] flex flex-col'>
                < ListaMensagens mensagens={mensagens} loading={loading}/>
                < ChatBox onEnviarMensagem={onEnviarMensagem} desabilitado={loading}/>
            </div>
        </div>
    </div>
  )
}

export default DevReceita