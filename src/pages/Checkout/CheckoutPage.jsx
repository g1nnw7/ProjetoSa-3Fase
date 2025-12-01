import React, { useState, useEffect } from 'react';
import { useCart } from '../../contexts/CartContext.jsx';
import { useAuth } from '../../contexts/AuthContext.jsx';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';


function MapPinIcon({ className }) { return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" /></svg>; }
function CreditCardIcon({ className }) { return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" /></svg>; }
function ShieldCheckIcon({ className }) { return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" /></svg>; }
function LockClosedIcon({ className }) { return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" /></svg>; }


export default function CheckoutPage() {
  const { cartState, subtotal } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);

  useEffect(() => {
    const fetchAddresses = async () => {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      try {
        const res = await axios.get('http://localhost:3000/enderecos', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAddresses(res.data.data || []);
        if (res.data.data && res.data.data.length > 0) {
            setSelectedAddressId(res.data.data[0].id);
        }
      } catch (error) {
        console.error("Erro ao buscar endereços", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchAddresses();
  }, [user]);

  const handlePayment = async () => {
    if (!selectedAddressId) {
        toast.error("Selecione um endereço de entrega.");
        return;
    }
    
    setPaymentLoading(true);
    const token = localStorage.getItem('accessToken');

    try {
        const response = await axios.post('http://localhost:3000/payment/create_preference', {
            items: cartState.items,
            addressId: selectedAddressId
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });

        if (response.data.init_point) {
            window.location.href = response.data.init_point; 
        }

    } catch (error) {
        console.error(error);
        toast.error("Erro ao iniciar pagamento. Tente novamente.");
        setPaymentLoading(false);
    }
  };

  if (cartState.items.length === 0) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
            <h2 className="text-2xl font-bold text-gray-700 mb-4">Seu carrinho está vazio</h2>
            <button onClick={() => navigate('/loja')} className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 cursor-pointer">
                Voltar para a Loja
            </button>
        </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="container mx-auto max-w-6xl px-4">
        
        <h1 className="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-2">
            <LockClosedIcon className="w-8 h-8 text-green-600" /> 
            Finalizar Pedido
        </h1>

        <div className="flex flex-col lg:flex-row gap-8">
            
            <div className="w-full lg:w-2/3 space-y-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <MapPinIcon className="w-5 h-5 text-green-600" />
                        Endereço de Entrega
                    </h2>

                    {loading ? (
                        <p>Carregando endereços...</p>
                    ) : addresses.length === 0 ? (
                        <div className="text-center py-4">
                            <p className="text-gray-500 mb-3">Você não tem endereços cadastrados.</p>
                            <button onClick={() => navigate('/dashboard/addresses')} className="text-green-600  cursor-pointer font-semibold hover:underline ">
                                + Cadastrar Endereço
                            </button>
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {addresses.map((addr) => (
                                <label 
                                    key={addr.id} 
                                    className={`relative flex cursor-pointer rounded-lg border p-4 shadow-sm focus:outline-none transition-all
                                        ${selectedAddressId === addr.id ? 'border-green-600 ring-1 ring-green-600 bg-green-50' : 'border-gray-300 bg-white hover:border-gray-400'}`}
                                >
                                    <input 
                                        type="radio" 
                                        name="address" 
                                        value={addr.id} 
                                        className="sr-only" 
                                        checked={selectedAddressId === addr.id}
                                        onChange={() => setSelectedAddressId(addr.id)}
                                    />
                                    <span className="flex flex-1">
                                        <span className="flex flex-col">
                                            <span className="block text-sm font-medium text-gray-900">{addr.apelido}</span>
                                            <span className="mt-1 flex items-center text-sm text-gray-500">
                                                {addr.rua}, {addr.numero} - {addr.cidade}/{addr.estado} - CEP: {addr.cep}
                                            </span>
                                        </span>
                                    </span>
                                    <span className={`h-5 w-5 rounded-full border flex items-center justify-center
                                        ${selectedAddressId === addr.id ? 'bg-green-600 border-transparent' : 'bg-white border-gray-400'}`}
                                        aria-hidden="true"
                                    >
                                        {selectedAddressId === addr.id && <div className="h-2.5 w-2.5 rounded-full bg-white" />}
                                    </span>
                                </label>
                            ))}
                             <button onClick={() => navigate('/dashboard/addresses')} className="cursor-pointer text-sm text-green-600 hover:underline mt-2 font-medium">
                                + Gerenciar endereços
                            </button>
                        </div>
                    )}
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                     <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <CreditCardIcon className="w-5 h-5 text-green-600" />
                        Pagamento
                    </h2>
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 flex items-center gap-4">
                        <img src="https://http2.mlstatic.com/frontend-assets/ui-navigation/5.19.5/mercadolibre/logo__large_plus.png" alt="Mercado Pago" className="h-8 object-contain" />
                        <p className="text-sm text-gray-600">
                            Você será redirecionado para o ambiente seguro do <strong>Mercado Pago</strong> para finalizar o pagamento via Pix, Cartão de Crédito ou Boleto.
                        </p>
                    </div>
                    <div className="mt-4 flex items-center gap-2 text-sm text-green-700 bg-green-50 p-2 rounded">
                        <ShieldCheckIcon className="w-5 h-5" />
                        <span>Pagamento 100% Seguro e criptografado.</span>
                    </div>
                </div>

            </div>
            <div className="w-full lg:w-1/3">
                <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 sticky top-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-6 border-b pb-4">Resumo do Pedido</h2>
                    
                    <div className="space-y-4 max-h-60 overflow-y-auto custom-scrollbar pr-2 mb-6">
                        {cartState.items.map((item) => (
                            <div key={item.id} className="flex gap-3">
                                <img 
                                    src={item.imageUrl} 
                                    alt={item.nome} 
                                    className="w-12 h-12 object-cover rounded-md bg-gray-100"
                                />
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-800 line-clamp-1">{item.nome}</p>
                                    <p className="text-xs text-gray-500">Qtd: {item.quantity} x R$ {item.preco.toFixed(2)}</p>
                                </div>
                                <div className="text-sm font-bold text-gray-800">
                                    R$ {(item.preco * item.quantity).toFixed(2)}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="border-t border-gray-100 pt-4 space-y-2">
                        <div className="flex justify-between text-gray-600">
                            <span>Subtotal</span>
                            <span>R$ {subtotal.toFixed(2).replace('.', ',')}</span>
                        </div>
                        {/* Se você implementou a lógica de frete global, adicione aqui */}
                        <div className="flex justify-between text-gray-600">
                            <span>Frete</span>
                            <span className="text-green-600 text-xs font-bold uppercase">A calcular no próximo passo</span>
                        </div>
                        <div className="flex justify-between text-xl font-extrabold text-gray-900 pt-2 border-t border-gray-100 mt-2">
                            <span>Total</span>
                            <span>R$ {subtotal.toFixed(2).replace('.', ',')}</span>
                        </div>
                    </div>

                    <button 
                        onClick={handlePayment}
                        disabled={paymentLoading || addresses.length === 0}
                        className="cursor-pointer w-full mt-6 bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-200 disabled:bg-gray-400 flex justify-center items-center"
                    >
                        {paymentLoading ? (
                            <span className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                        ) : (
                            "Pagar com Mercado Pago"
                        )}
                    </button>
                </div>
            </div>
            
        </div>
      </div>
    </div>
  );
}