import React from 'react';
import ReactMarkdown from 'react-markdown';

const Mensagem = ({ mensagem }) => {
    const isBot = mensagem.remetente === 'bot';

    // Componentes personalizados para estilizar o Markdown do Bot
    // Isso transforma os símbolos (###, **, -) em classes Tailwind bonitas
    const botStyleComponents = {
        // Títulos (###)
        h3: ({node, ...props}) => (
            <h3 className="text-lg md:text-xl font-bold text-green-800 mt-4 mb-3 border-b border-green-200 pb-2" {...props} />
        ),
        // Negrito (**)
        strong: ({node, ...props}) => (
            <strong className="font-bold text-green-700" {...props} />
        ),
        // Parágrafos normais
        p: ({node, ...props}) => (
            <p className="mb-3 text-gray-700 leading-relaxed last:mb-0" {...props} />
        ),
        // Listas com bolinhas (-)
        ul: ({node, ...props}) => (
            <ul className="list-disc pl-5 mb-4 space-y-1 text-gray-700 marker:text-green-500" {...props} />
        ),
        // Listas numeradas (1.)
        ol: ({node, ...props}) => (
            <ol className="list-decimal pl-5 mb-4 space-y-2 text-gray-700 marker:font-bold marker:text-green-600" {...props} />
        ),
        // Itens de lista
        li: ({node, ...props}) => (
            <li className="pl-1" {...props} />
        ),
    };

    return (
        <div className={`flex w-full ${isBot ? 'justify-start' : 'justify-end'}`}>
            <div 
                className={`
                    relative px-5 py-4 max-w-[85%] md:max-w-[75%] shadow-sm
                    ${isBot 
                        ? 'bg-gray-50 text-gray-800 rounded-2xl rounded-tl-none border border-green-100' 
                        : 'bg-green-600 text-white rounded-2xl rounded-tr-none shadow-md'
                    }
                `}
            >
                {/* Ícone decorativo para o Bot */}
                {isBot && (
                    <div className="absolute -top-3 -left-3 w-8 h-8 bg-white rounded-full border border-green-200 flex items-center justify-center shadow-sm">
                        <span className="text-sm">🍳</span>
                    </div>
                )}

                {/* Renderização do Conteúdo */}
                {isBot ? (
                    <div className="markdown-content text-sm md:text-base">
                        <ReactMarkdown components={botStyleComponents}>
                            {mensagem.texto}
                        </ReactMarkdown>
                    </div>
                ) : (
                    // Mensagem do usuário (texto simples, branco)
                    <p className="text-sm md:text-base leading-relaxed whitespace-pre-wrap">
                        {mensagem.texto}
                    </p>
                )}
            </div>
        </div>
    );
}

export default Mensagem;