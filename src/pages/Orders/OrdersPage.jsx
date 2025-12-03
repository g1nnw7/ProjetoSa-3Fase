import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

// Ícones
function BoxIcon({ className }) { return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" /></svg>; }
function BackIcon({ className }) { return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" /></svg>; }
function CalendarIcon({ className }) { return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 9v7.5" /></svg>; }

export default function OrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem('accessToken');
      if (!token) return;

      try {
        const response = await axios.get('http://localhost:3000/orders/my-orders', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setOrders(response.data.data || []);
      } catch (error) {
        console.error("Erro ao buscar pedidos:", error);
        toast.error("Erro ao carregar histórico de pedidos.");
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchOrders();
  }, [user]);

  // Helper para cor do status
  const getStatusColor = (status) => {
    switch (status) {
      case 'APROVADO': return 'bg-green-100 text-green-700 border-green-200';
      case 'PENDENTE': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'NEGADO': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto max-w-5xl p-4 md:p-8">
        
        {/* Voltar */}
        <div className="mb-6">
          <Link to="/dashboard" className="flex items-center text-base font-medium text-gray-600 hover:text-green-600 transition-colors">
            <BackIcon className="w-5 h-5 mr-1" />
            Voltar ao Dashboard
          </Link>
        </div>
        
        <h1 className="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-2">
            <BoxIcon className="w-8 h-8 text-green-600" />
            Meus Pedidos
        </h1>

        {loading ? (
             <div className="text-center p-10 text-gray-500 animate-pulse">Carregando seus pedidos...</div>
        ) : orders.length === 0 ? (
             <div className="bg-white p-12 rounded-xl shadow-sm text-center">
                 <p className="text-xl text-gray-600 mb-4">Você ainda não fez nenhum pedido.</p>
                 <Link to="/loja" className="bg-green-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-green-700">
                    Ir para a Loja
                 </Link>
             </div>
        ) : (
            <div className="space-y-6">
                {orders.map((order) => (
                    <div key={order.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                        {/* Cabeçalho do Pedido */}
                        <div className="bg-gray-50 p-4 border-b border-gray-200 flex flex-col md:flex-row justify-between md:items-center gap-4">
                            <div>
                                <p className="text-xs text-gray-500 uppercase font-bold tracking-wide">Pedido Realizado</p>
                                <p className="text-gray-800 font-medium flex items-center gap-1">
                                    <CalendarIcon className="w-4 h-4 text-gray-400" />
                                    {new Date(order.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase font-bold tracking-wide">Total</p>
                                <p className="text-gray-800 font-bold">R$ {order.total.toFixed(2).replace('.', ',')}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase font-bold tracking-wide">Nº do Pedido</p>
                                <p className="text-gray-600 font-mono text-sm">#{order.id.slice(-6).toUpperCase()}</p>
                            </div>
                            <div className="md:ml-auto">
                                <span className={`px-3 py-1 rounded-full text-sm font-bold border ${getStatusColor(order.status)}`}>
                                    {order.status}
                                </span>
                            </div>
                        </div>

                        {/* Lista de Itens */}
                        <div className="p-4">
                            {order.items.map((item) => (
                                <div key={item.id} className="flex items-center gap-4 py-3 border-b border-gray-100 last:border-0">
                                    <img 
                                        src={item.product.imageUrl || 'https://placehold.co/100x100'} 
                                        alt={item.product.nome} 
                                        className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                                    />
                                    <div className="flex-1">
                                        <h4 className="font-semibold text-gray-800">{item.product.nome}</h4>
                                        <p className="text-sm text-gray-500">Qtd: {item.quantidade}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-green-600">R$ {item.precoUnitario.toFixed(2).replace('.', ',')}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        )}
      </div>
    </div>
  );
}