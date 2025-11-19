import React from 'react';
import { useCart } from '../../contexts/CartContext';
import CartItem from './CartItem'; 


function XMarkIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 cursor-pointer">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
    </svg>
  );
}


function EmptyCartIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-24 h-24 text-gray-300">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25 5.106 5.272A1.125 1.125 0 0 1 6.182 4h11.636a1.125 1.125 0 0 1 1.076 1.272L19.5 14.25m-12 0h12" />
    </svg>
  );
}


export default function CartSidebar({ isOpen, onClose }) {
  const { cartState, subtotal, totalItems } = useCart();

  const handleCheckout = () => {
    alert('Coloca o checkout de compra aq dourado!');
  };

  return (
    <>
      <div 
        className={`fixed inset-0 z-40 bg-opacity-50 transition-opacity
                    ${isOpen ? 'opacity-100 backdrop-blur' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      ></div>

      <div
        className={`fixed top-0 right-0 z-50 h-full w-full max-w-md bg-white 
                    shadow-xl transition-transform duration-300 ease-in-out
                    ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex flex-col h-full">
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="text-xl font-semibold text-gray-800">Seu Carrinho ({totalItems})</h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-gray-800 rounded-full hover:bg-gray-100"
            >
              <XMarkIcon />
            </button>
          </div>

          {cartState.items.length === 0 ? (
            <div className="flex-1 flex flex-col justify-center items-center p-4">
              <EmptyCartIcon />
              <h3 className="mt-4 text-xl font-semibold text-gray-700">Seu carrinho está vazio</h3>
              <p className="mt-2 text-gray-500">Adicione produtos da loja para começar.</p>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {cartState.items.map((item) => (
                <CartItem key={item.id} item={item} />
              ))}
            </div>
          )}

          {cartState.items.length > 0 && (
            <div className="p-4 border-t bg-gray-50">
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-medium text-gray-700">Subtotal:</span>
                <span className="text-2xl font-bold text-gray-900">
                  R$ {subtotal.toFixed(2).replace('.', ',')}
                </span>
              </div>
              <button
                onClick={handleCheckout}
                className="w-full py-3 px-4 rounded-lg bg-green-600 text-white 
                           font-semibold text-lg hover:bg-green-700 transition-colors
                           focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 cursor-pointer"
              >
                Finalizar Compra
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}