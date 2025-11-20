import React, { useState } from 'react';
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

  // frete
  const [cep, setCep] = useState('');
  const [shippingOptions, setShippingOptions] = useState([]);
  const [selectedShipping, setSelectedShipping] = useState(null);
  const [loadingShipping, setLoadingShipping] = useState(false);
  const [addressInfo, setAddressInfo] = useState(null);
  const [cepError, setCepError] = useState(''); 

  // deixar o cep so em numeros eu acho
  const handleCepChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 8) value = value.substring(0, 8);
    if (value.length > 5) value = `${value.substring(0, 5)}-${value.substring(5)}`;
    setCep(value);
    
    if (cepError) setCepError('');
    
    if (value.length < 9) {
        setShippingOptions([]);
        setSelectedShipping(null);
        setAddressInfo(null);
    }
  };

  // Lógica de Cálculo 
  const calculateShipping = async () => {
    const cleanCep = cep.replace(/\D/g, '');
    if (cleanCep.length !== 8) {
        setCepError('CEP deve ter 8 dígitos.');
        return;
    }

    setLoadingShipping(true);
    setCepError(''); 
    
    try {

        const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
        const data = await response.json();

        if (!data.erro) {
            setAddressInfo(`${data.localidade} - ${data.uf}`);


            const basePrice = data.uf === 'SP' ? 15.00 : 
                              ['RJ', 'MG', 'ES', 'PR', 'SC', 'RS'].includes(data.uf) ? 25.00 : 40.00;
            

            const options = [
                { id: 'pac', name: 'PAC', price: basePrice, days: 7 },
                { id: 'sedex', name: 'SEDEX', price: basePrice * 1.8, days: 3 },
            ];
            setShippingOptions(options);
            setSelectedShipping(options[0]);
        } else {
            setCepError("CEP não encontrado!");
            setShippingOptions([]);
            setAddressInfo(null);
        }
    } catch (error) {
        console.error(error);
        setCepError("Erro ao consultar CEP. Verifique sua conexão.");
    } finally {
        setLoadingShipping(false);
    }
  };

  const handleCheckout = () => {
    if (!selectedShipping) {
        setCepError('Por favor, calcule e selecione o frete.');
        return;
    }
    //tenho q por o chechkout aqui
    alert(`Checkout iniciado!\nTotal: R$ ${(subtotal + selectedShipping.price).toFixed(2)}`);
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
              

              <div className="mb-4 pb-4 border-b border-gray-200">
                <label className="block text-sm font-medium text-gray-700 mb-1">Calcular Frete</label>
                <div className="flex gap-2">
                    <input 
                        type="text" 
                        placeholder="00000-000"
                        value={cep}
                        onChange={handleCepChange}
                        className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none 
                                    ${cepError ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-green-500'}`}
                    />
                    <button 
                        onClick={calculateShipping}
                        disabled={loadingShipping || cep.length < 9}
                        className="bg-green-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-50"
                    >
                        {loadingShipping ? '...' : 'OK'}
                    </button>
                </div>


                {cepError && (
                    <p className="text-red-500 text-xs mt-1 font-medium">{cepError}</p>
                )}


                {addressInfo && !cepError && (
                    <p className="text-xs text-gray-500 mt-1">📍 {addressInfo}</p>
                )}

                {shippingOptions.length > 0 && (
                    <div className="mt-3 space-y-2">
                        {shippingOptions.map(opt => (
                            <div 
                                key={opt.id}
                                onClick={() => setSelectedShipping(opt)}
                                className={`flex justify-between items-center p-2 rounded-lg border cursor-pointer text-sm
                                    ${selectedShipping?.id === opt.id ? 'border-green-500 bg-green-50' : 'border-gray-200 bg-white'}`}
                            >
                                <div>
                                    <span className="font-bold text-gray-700">{opt.name}</span>
                                    <span className="text-xs text-gray-500 ml-2">({opt.days} dias)</span>
                                </div>
                                <span className="font-semibold text-green-700">R$ {opt.price.toFixed(2).replace('.', ',')}</span>
                            </div>
                        ))}
                    </div>
                )}
              </div>


              <div className="flex justify-between items-center mb-2 text-gray-600">
                <span className="text-base font-medium">Subtotal:</span>
                <span className="text-lg font-semibold">
                  R$ {subtotal.toFixed(2).replace('.', ',')}
                </span>
              </div>


              {selectedShipping && (
                <div className="flex justify-between items-center mb-2 text-gray-600">
                    <span className="text-base font-medium">Frete:</span>
                    <span className="text-lg font-semibold">
                      R$ {selectedShipping.price.toFixed(2).replace('.', ',')}
                    </span>
                </div>
              )}

              <div className="flex justify-between items-center mb-4 pt-2 border-t border-gray-200">
                <span className="text-xl font-bold text-gray-900">Total:</span>
                <span className="text-2xl font-bold text-green-700">
                  R$ {(subtotal + (selectedShipping?.price || 0)).toFixed(2).replace('.', ',')}
                </span>
              </div>

              <button
                onClick={handleCheckout}
                className={`w-full py-3 px-4 rounded-lg text-white 
                           font-semibold text-lg hover:bg-green-700 transition-colors
                           focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 cursor-pointer
                           ${selectedShipping ? 'bg-green-600' : 'bg-red-500 disabled:bg-red-400'}`}
                disabled={!selectedShipping} 
              >
                {selectedShipping ? 'Finalizar Compra' : 'Calcular e Selecionar Frete'}
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}