import Mensagem from "../Mensagem/Mensagem"


const ListaMensagens = ({mensagens, loading}) => {


    return (
        // Alterado bg-white para um gradiente sutil:
        // from-white (topo branco) -> via-white (meio branco) -> to-green-50 (final levemente esverdeado)
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 scroll-smooth bg-linear-to-b from-white via-white to-green-50/50">
            {mensagens.map(mensagem => (
                <Mensagem key={mensagem.id} mensagem={mensagem} /> 
            ))}

            {loading && (
                <div className="flex justify-start">
                    <div className="bg-gray-100 px-4 py-3 rounded-2xl rounded-bl-none border border-gray-200">
                        <div className="flex space-x-2">
                            {/* Animação ajustada para tons de verde */}
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce delay-100"></div>
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce delay-200"></div>
                        </div>
                    </div>
                </div>
            )}
            
            <div id="scroll-anchor"></div>
        </div>
    )
}

export default ListaMensagens