import React, { useState } from 'react';
// CORREÇÃO DE CAMINHO: De ../../ para ../ se o arquivo estiver em src/components/
import { useCart } from '../../contexts/CartContext.jsx'; 
import CartItem from './CartItem.jsx'; 

// Ícones
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

function TagIcon(props) {
  return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6Z" /></svg>;
}

export default function CartSidebar({ isOpen, onClose }) {
  const { cartState, subtotal, totalItems } = useCart();

  // separação de bagé CEP
  const [cep, setCep] = useState('');
  const [shippingOptions, setShippingOptions] = useState([]);
  const [selectedShipping, setSelectedShipping] = useState(null);
  const [loadingShipping, setLoadingShipping] = useState(false);
  const [addressInfo, setAddressInfo] = useState(null);
  const [cepError, setCepError] = useState(''); 
  
  // separação de bagé cupom
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState(null); 
  const [couponMessage, setCouponMessage] = useState({ type: '', text: '' });


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
        setCepError("Erro ao consultar CEP.");
    } finally {
        setLoadingShipping(false);
    }
  };


  const handleApplyCoupon = () => {
    if (!couponCode) return;
    
    setCouponMessage({ type: '', text: '' });
    const code = couponCode.toUpperCase();


    if (code === 'NUTRIFIT40') {
        const discountValue = subtotal * 0.40; 
        setDiscount(discountValue);
        setAppliedCoupon(code);
        setCouponMessage({ type: 'success', text: 'Cupom de 40% aplicado!' });
    } else if (code === '1COMPRA') {
        const discountValue = 20.00;
        setDiscount(discountValue);
        setAppliedCoupon(code);
        setCouponMessage({ type: 'success', text: 'Desconto de R$ 20,00 aplicado!' });
    } else if (code === 'BAGERLK') {
        const discountValue = subtotal * 0.75;
        setDiscount(discountValue);
        setAppliedCoupon(code);
        setCouponMessage({ type: 'success', text: 'Cupom de 75% aplicado!' });
    } else {
        setDiscount(0);
        setAppliedCoupon(null);
        setCouponMessage({ type: 'error', text: 'Cupom inválido ou expirado.' });
    }
  };

  const handleRemoveCoupon = () => {
      setCouponCode('');
      setDiscount(0);
      setAppliedCoupon(null);
      setCouponMessage({ type: '', text: '' });
  };

  const handleCheckout = () => {
    if (!selectedShipping) {
        setCepError('Por favor, calcule o frete antes de finalizar.');
        return;
    }
    const totalFinal = Math.max(0, subtotal + selectedShipping.price - discount);
    console.log(`Checkout iniciado!\nTotal Final: R$ ${totalFinal.toFixed(2)}`);
    //mudar aqui depois viado
  };

  // calcular os krlh tudo
  const shippingCost = selectedShipping ? selectedShipping.price : 0;
  const finalTotal = Math.max(0, subtotal + shippingCost - discount);

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
              
              <div className="mb-4 border-b border-gray-200 pb-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Calcular Frete</p>
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
                        className="bg-gray-700 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 disabled:opacity-50 cursor-pointer"
                    >
                        {loadingShipping ? '...' : 'OK'}
                    </button>
                </div>
                
                {cepError && (
                    <p className="text-red-500 text-xs mt-1 font-medium">{cepError}</p>
                )}

                {addressInfo && !cepError && <p className="text-xs text-gray-500 mt-1">📍 {addressInfo}</p>}
                
                {shippingOptions.length > 0 && (
                    <div className="mt-2 space-y-1">
                        {shippingOptions.map(opt => (
                            <div 
                                key={opt.id}
                                onClick={() => setSelectedShipping(opt)}
                                className={`flex justify-between items-center p-2 rounded border cursor-pointer text-xs
                                    ${selectedShipping?.id === opt.id ? 'border-green-500 bg-green-50' : 'border-gray-200 bg-white'}`}
                            >
                                <span>{opt.name} ({opt.days} dias)</span>
                                <span className="font-bold text-green-700">R$ {opt.price.toFixed(2).replace('.', ',')}</span>
                            </div>
                        ))}
                    </div>
                )}
              </div>

              <div className="mb-4 border-b border-gray-200 pb-4">
                 <p className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                    <TagIcon className="w-4 h-4" /> Cupom de Desconto
                 </p>
                 <div className="flex gap-2">
                    <input 
                        type="text" 
                        placeholder="Código do cupom"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        disabled={!!appliedCoupon} 
                        className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-green-500 uppercase
                                    ${appliedCoupon ? 'bg-gray-100 text-gray-500' : 'bg-white'}`}
                    />
                    {appliedCoupon ? (
                        <button 
                            onClick={handleRemoveCoupon}
                            className="bg-red-100 text-red-600 px-3 py-2 rounded-lg text-sm font-medium hover:bg-red-200 cursor-pointer"
                        >
                            Remover
                        </button>
                    ) : (
                        <button 
                            onClick={handleApplyCoupon}
                            className="bg-green-100 text-green-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-green-200 cursor-pointer"
                        >
                            Aplicar
                        </button>
                    )}
                 </div>
                 {couponMessage.text && (
                     <p className={`text-xs mt-1 ${couponMessage.type === 'error' ? 'text-red-500' : 'text-green-600'}`}>
                         {couponMessage.text}
                     </p>
                 )}
              </div>


              <div className="space-y-1 mb-4 text-sm text-gray-600">
                <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>R$ {subtotal.toFixed(2).replace('.', ',')}</span>
                </div>
                
                {selectedShipping && (
                    <div className="flex justify-between">
                        <span>Frete:</span>
                        <span>R$ {selectedShipping.price.toFixed(2).replace('.', ',')}</span>
                    </div>
                )}

                {discount > 0 && (
                    <div className="flex justify-between text-green-600 font-medium">
                        <span>Desconto:</span>
                        <span>- R$ {discount.toFixed(2).replace('.', ',')}</span>
                    </div>
                )}
                
                <div className="flex justify-between items-center pt-2 border-t border-gray-200 mt-2">
                    <span className="text-lg font-bold text-gray-900">Total:</span>
                    <span className="text-2xl font-extrabold text-green-700">
                      R$ {finalTotal.toFixed(2).replace('.', ',')}
                    </span>
                </div>
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