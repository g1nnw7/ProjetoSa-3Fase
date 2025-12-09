import { useState } from "react"


const ChatBox = ({onEnviarMensagem, desabilitado}) => {
    const [mensagem, setMensagem] = useState('')

    const handleSubmit = (event) => {
        event.preventDefault();

        onEnviarMensagem(mensagem)
        setMensagem('')

    }


    return (
        // Borda superior suave e fundo branco
        <div className="border-t border-gray-100 bg-white p-4 md:p-6">
            <form className="flex gap-3" onSubmit={handleSubmit}>
                <input 
                    type="text"
                    value={mensagem}
                    onChange={(e) => setMensagem(e.target.value)}
                    placeholder="Digite a receita desejada..."
                    disabled={desabilitado}
                    // Input com borda verde suave ao focar (ring-green-500)
                    className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all placeholder-gray-400 text-gray-700"
                />
                <button
                    type="submit"
                    disabled={desabilitado}
                    // Botão verde padrão do sistema
                    className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-xl transition-colors shadow-md disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center"
                >
                    Enviar
                </button>
            </form>
        </div>
    )
}

export default ChatBox