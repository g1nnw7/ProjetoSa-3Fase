import React from 'react';
import { useCart } from '../../contexts/CartContext'; 


function FireIcon() {
  return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-red-500"><path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.983 8.983 0 0 1 3.361-3.867 8.224 8.224 0 0 0 3 1.48Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 0 0 .495-7.468 3.75 3.75 0 0 0-1.993-1.043A3.75 3.75 0 0 0 12 18Z" /></svg>;
}

function BoltIcon() {
  return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-yellow-500"><path strokeLinecap="round" strokeLinejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" /></svg>;
}


export default function ProductDetails({ product, onCloseAfterAdd }) {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(product);
    onCloseAfterAdd(); 
  };

  return (
    <div className="flex flex-col md:flex-row max-h-[80vh] overflow-hidden">
      
      {/* Lado Esquerdo: Imagem */}
      <div className="w-full md:w-1/2">
        <img
          src={product.imageUrl}
          alt={product.nome}
          className="w-full h-64 md:h-96 object-cover"
          onError={(e) => { e.target.src = 'https://placehold.co/600x600/EEE/CCC?text=Produto'; }}
        />
      </div>

      {/* Lado Direito: Informações */}
      <div className="w-full md:w-1/2 p-6 flex flex-col justify-between overflow-y-auto">
        <div>
          <span className="text-sm text-gray-500 uppercase">{product.category.nome}</span>
          <h2 className="text-3xl font-bold text-gray-800 mt-2">{product.nome}</h2>
          
          <p className="text-gray-700 mt-4 text-base">
            {product.descricao} 
          </p>

          {/* Informações Nutricionais */}
          <div className="mt-6">
            <h4 className="font-semibold text-gray-800 mb-2">Informação Nutricional:</h4>
            <div className="flex space-x-4">
              {product.calorias && (
                <div className="flex items-center space-x-1">
                  <FireIcon />
                  <span>{product.calorias} kcal</span>
                </div>
              )}
              {product.proteinas && (
                <div className="flex items-center space-x-1">
                  <BoltIcon />
                  <span>{product.proteinas}g Proteína</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Rodapé do Modal (Preço e Botão) */}
        <div className="mt-8">
          <span className="text-3xl font-bold text-green-600">
            R$ {product.preco.toFixed(2).replace('.', ',')}
          </span>
          <button
            onClick={handleAddToCart}
            className="w-full mt-4 py-3 px-4 rounded-lg bg-green-600 text-white 
                       font-semibold text-lg hover:bg-green-700 transition-colors
                       focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 cursor-pointer"
          >
            Adicionar ao Carrinho
          </button>
        </div>
      </div>
    </div>
  );
}