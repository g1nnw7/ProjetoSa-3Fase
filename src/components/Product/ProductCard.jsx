import React from 'react';
import { useCart } from '../../contexts/CartContext'; 

function CheckIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    </svg>
  );
}

export default function ProductCard({ product, onProductClick }) {
  const { addToCart } = useCart();
  const [showToast, setShowToast] = React.useState(false);

  const handleAddToCart = (e) => {

    e.stopPropagation(); 
    
    addToCart(product);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 2000);
  };


  const handleCardClick = () => {
    onProductClick(product);
  };

  return (

    <div 
      onClick={handleCardClick}
      className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden 
                 transition-all duration-300 hover:shadow-lg group relative cursor-pointer"
    >
      
      {/* Imagem e Selos */}
      <div className="relative">
        <img 
          src={product.imageUrl} 
          alt={product.nome} 
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(e) => { e.target.src = 'https://placehold.co/600x400/EEE/CCC?text=Produto'; }}
        />
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.isVegano && (
            <span className="text-xs bg-green-500 text-white px-2 py-0.5 rounded-full shadow-md">Vegano</span>
          )}
          {product.isGlutenFree && (
            <span className="text-xs bg-blue-500 text-white px-2 py-0.5 rounded-full shadow-md">Sem Glúten</span>
          )}
        </div>
      </div>

      {/* Conteúdo */}
      <div className="p-4 flex flex-col h-full justify-between">
        <div>
          <span className="text-sm text-gray-500 uppercase">{product.category.nome}</span>
          <h4 className="text-lg font-semibold text-gray-800 truncate mt-1">{product.nome}</h4>
          
          <p className="text-sm text-gray-600 mt-2 h-10 overflow-hidden text-ellipsis">
            {product.descricao.substring(0, 50)}...
          </p>
        </div>

        <div className="flex justify-between items-center mt-4">
          <span className="text-xl font-bold text-green-600">
            R$ {product.preco.toFixed(2).replace('.', ',')}
          </span>
          <button 
            onClick={handleAddToCart}
            className="bg-green-600 text-white px-4 py-2 rounded-lg 
                       font-semibold text-sm hover:bg-green-700 transition-colors
                       focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50
                       z-10"
          >
            Adicionar
          </button>
        </div>
      </div>

      <div 
        className={`absolute bottom-4 right-4 flex items-center gap-2 bg-gray-900 text-white 
                    px-4 py-2 rounded-lg shadow-lg transition-all duration-300
                    ${showToast ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3 pointer-events-none'}`}
      >
        <CheckIcon />
        <span>Adicionado!</span>
      </div>
    </div>
  );
}