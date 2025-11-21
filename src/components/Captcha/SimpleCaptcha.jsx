import React, { useEffect, useRef, useState } from 'react';

function ArrowPathIcon({ className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
    </svg>
  );
}

export default function SimpleCaptcha({ onValidate }) {
  const canvasRef = useRef(null);
  const [captchaCode, setCaptchaCode] = useState('');
  const [userInput, setUserInput] = useState('');
  
  // Gera um código aleatório
  const generateCode = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  };

  const drawCaptcha = (code) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    // Limpa
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Fundo ruidoso
    ctx.fillStyle = '#f3f4f6';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Texto
    ctx.font = '30px Arial';
    ctx.fillStyle = '#374151';
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';
    
    // Adiciona ruído (linhas e pontos)
    for (let i = 0; i < 5; i++) {
        ctx.strokeStyle = `rgba(0,0,0,${Math.random() * 0.3})`;
        ctx.beginPath();
        ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
        ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
        ctx.stroke();
    }

    // Desenha o código com leve rotação para dificultar OCR
    const xBase = canvas.width / 2 - 40;
    for (let i = 0; i < code.length; i++) {
        ctx.save();
        ctx.translate(xBase + i * 15, canvas.height / 2);
        ctx.rotate((Math.random() - 0.5) * 0.4);
        ctx.fillText(code[i], 0, 0);
        ctx.restore();
    }
  };

  const refreshCaptcha = () => {
    const newCode = generateCode();
    setCaptchaCode(newCode);
    drawCaptcha(newCode);
    setUserInput('');
    onValidate(false); // Invalida ao gerar novo
  };

  useEffect(() => {
    refreshCaptcha();
  }, []);

  const handleChange = (e) => {
    const val = e.target.value.toUpperCase();
    setUserInput(val);
    if (val === captchaCode) {
        onValidate(true);
    } else {
        onValidate(false);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-3">
        <div className="flex items-center space-x-2">
            <canvas 
                ref={canvasRef} 
                width="160" 
                height="60" 
                className="border border-gray-300 rounded bg-gray-50"
            />
            <button 
                type="button" 
                onClick={refreshCaptcha}
                className="p-2 text-gray-500 hover:text-gray-700 cursor-pointer"
                title="Gerar novo código"
            >
                <ArrowPathIcon className="w-5 h-5" />
            </button>
        </div>
        <input 
            type="text" 
            placeholder="Digite os caracteres acima"
            value={userInput}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-center uppercase tracking-widest font-bold focus:ring-2 focus:ring-green-500 outline-none"
        />
    </div>
  );
}