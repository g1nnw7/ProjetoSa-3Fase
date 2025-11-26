import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '../../contexts/AuthContext.jsx';
import Modal from '../../components/Modal/Modal.jsx'; 

function TrashIcon({ className }) {
  return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12.578 0a48.097 48.097 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /></svg>;
}
function PencilIcon({ className }) {
  return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" /></svg>;
}
function PlusIcon({ className }) {
  return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>;
}
function UsersIcon({ className }) {
  return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-1.752-2.3 10.55 10.55 0 0 1-5.492-1.644c-1.566.963-3.63 1.641-5.963 1.641-2.333 0-4.397-.678-5.963-1.641A10.55 10.55 0 0 1 2.446 16.25a4.125 4.125 0 0 0 1.752 2.3 9.337 9.337 0 0 0 4.121.952 9.38 9.38 0 0 0 2.625-.372M15 19.128V19.5M6.63 15a9 9 0 0 1 10.74 0M12 12.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>;
}
function ShoppingBagIcon({ className }) {
  return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.669 0 1.189.578 1.119 1.243Z" /></svg>;
}
function ExclamationTriangleIcon({ className }) {
  return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" /></svg>;
}

const API_URL = 'http://localhost:3000';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('products'); 
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
      nome: '', preco: '', descricao: '', imageUrl: '', categorySlug: 'whey-protein'
  });

  const [productToDelete, setProductToDelete] = useState(null); 
  const [loadingDelete, setLoadingDelete] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    const token = localStorage.getItem('accessToken');
    const config = { headers: { Authorization: `Bearer ${token}` } };

    try {
        if (activeTab === 'products') {
            const res = await axios.get(`${API_URL}/products`);
            setProducts(res.data);
        } else if (activeTab === 'users') {
            const res = await axios.get(`${API_URL}/usuarios`, config);
            if (Array.isArray(res.data)) {
                setUsers(res.data);
            } else {
                setUsers([]);
            }
        }
    } catch (error) {
        console.error("Erro ao buscar dados:", error);
        if (error.response?.status === 401) toast.error("Sessão expirada.");
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab]);
  const handleDeleteClick = (id) => {
      setProductToDelete(id);
  };

  const confirmDeleteProduct = async () => {
      if (!productToDelete) return;
      
      setLoadingDelete(true);
      const token = localStorage.getItem('accessToken');
      try {
          await axios.delete(`${API_URL}/products/${productToDelete}`, { 
              headers: { Authorization: `Bearer ${token}` } 
          });
          toast.success("Produto removido!");
          setProductToDelete(null); 
          fetchData(); 
      } catch(e) { 
          toast.error("Erro ao remover."); 
      } finally {
          setLoadingDelete(false);
      }
  };

  const handleSaveProduct = async (e) => {
      e.preventDefault();
      const token = localStorage.getItem('accessToken');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      const payload = { ...formData, preco: parseFloat(formData.preco) };

      try {
          if (editingProduct) {
              await axios.put(`${API_URL}/products/${editingProduct.id}`, payload, config);
              toast.success("Produto atualizado!");
          } else {
              await axios.post(`${API_URL}/products`, payload, config);
              toast.success("Produto criado!");
          }
          setShowModal(false);
          fetchData();
      } catch(e) { 
          console.error(e);
          toast.error("Erro ao salvar produto."); 
      }
  };

  const openModal = (product = null) => {
      setEditingProduct(product);
      if(product) {
          setFormData({ 
              nome: product.nome, 
              preco: product.preco, 
              descricao: product.descricao, 
              imageUrl: product.imageUrl, 
              categorySlug: product.category?.slug || 'whey-protein'
          });
      } else {
          setFormData({ nome: '', preco: '', descricao: '', imageUrl: '', categorySlug: 'whey-protein' });
      }
      setShowModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Painel Administrativo</h1>
                <div className="bg-white p-2 rounded-lg shadow-sm flex gap-2">
                    <button 
                        onClick={() => setActiveTab('products')}
                        className={`px-4 py-2 rounded-md font-medium transition-colors cursor-pointer ${activeTab === 'products' ? 'bg-green-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                    >
                        <div className="flex items-center gap-2"><ShoppingBagIcon className="w-5 h-5"/> Produtos</div>
                    </button>
                    <button 
                        onClick={() => setActiveTab('users')}
                        className={`px-4 py-2 rounded-md font-medium transition-colors cursor-pointer ${activeTab === 'users' ? 'bg-green-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                    >
                        <div className="flex items-center gap-2"><UsersIcon className="w-5 h-5"/> Usuários</div>
                    </button>
                </div>
            </div>
            {activeTab === 'products' && (
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                        <h2 className="text-xl font-semibold">Gerenciar Produtos</h2>
                        <button onClick={() => openModal()} className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700 transition-colors cursor-pointer">
                            <PlusIcon className="w-5 h-5" /> Novo Produto
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 text-gray-600">
                                <tr>
                                    <th className="p-4">Nome</th>
                                    <th className="p-4">Preço</th>
                                    <th className="p-4">Categoria</th>
                                    <th className="p-4 text-right">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {products.map(prod => (
                                    <tr key={prod.id} className="hover:bg-gray-50">
                                        <td className="p-4 font-medium">{prod.nome}</td>
                                        <td className="p-4">R$ {prod.preco.toFixed(2)}</td>
                                        <td className="p-4"><span className="bg-gray-100 px-2 py-1 rounded text-sm">{prod.category?.nome}</span></td>
                                        <td className="p-4 text-right flex justify-end gap-2">
                                            <button onClick={() => openModal(prod)} className="text-blue-600 hover:bg-blue-50 p-2 rounded transition-colors cursor-pointer"><PencilIcon className="w-5 h-5"/></button>
                                            <button onClick={() => handleDeleteClick(prod.id)} className="text-red-600 hover:bg-red-50 p-2 rounded transition-colors cursor-pointer"><TrashIcon className="w-5 h-5"/></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
            {activeTab === 'users' && (
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-gray-100">
                        <h2 className="text-xl font-semibold">Gerenciar Usuários</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 text-gray-600">
                                <tr>
                                    <th className="p-4">Nome</th>
                                    <th className="p-4">Email</th>
                                    <th className="p-4">Role</th>
                                    <th className="p-4 text-right">ID</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {users.length === 0 ? (
                                    <tr><td colSpan="4" className="p-4 text-center text-gray-500">Nenhum usuário encontrado.</td></tr>
                                ) : (
                                    users.map(u => (
                                        <tr key={u.id} className="hover:bg-gray-50">
                                            <td className="p-4 font-medium">{u.nome}</td>
                                            <td className="p-4">{u.email}</td>
                                            <td className="p-4">
                                                <span className={`px-2 py-1 rounded text-xs font-bold ${u.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'}`}>
                                                    {u.role}
                                                </span>
                                            </td>
                                            <td className="p-4 text-right text-gray-400 text-sm">#{u.id}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
        {showModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
                <div className="bg-white rounded-xl p-6 w-full max-w-lg shadow-2xl">
                    <h3 className="text-xl font-bold mb-4 text-gray-800">{editingProduct ? 'Editar' : 'Criar'} Produto</h3>
                    <form onSubmit={handleSaveProduct} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                            <input className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-green-500 outline-none" placeholder="Nome do Produto" value={formData.nome} onChange={e => setFormData({...formData, nome: e.target.value})} required />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Preço</label>
                                <input className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-green-500 outline-none" type="number" step="0.01" placeholder="0.00" value={formData.preco} onChange={e => setFormData({...formData, preco: e.target.value})} required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
                                <select className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-green-500 outline-none bg-white" value={formData.categorySlug} onChange={e => setFormData({...formData, categorySlug: e.target.value})}>
                                    <option value="whey-protein">Whey Protein</option>
                                    <option value="creatina">Creatina</option>
                                    <option value="pre-treino">Pré Treino</option>
                                    <option value="acessorios">Acessórios</option>
                                    <option value="moda">Moda</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Imagem (URL)</label>
                            <input className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-green-500 outline-none" placeholder="https://..." value={formData.imageUrl} onChange={e => setFormData({...formData, imageUrl: e.target.value})} required />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                            <textarea className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-green-500 outline-none" rows="3" placeholder="Descrição do produto..." value={formData.descricao} onChange={e => setFormData({...formData, descricao: e.target.value})} required />
                        </div>
                        
                        <div className="flex justify-end gap-2 pt-4 border-t border-gray-100 mt-4">
                            <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer">Cancelar</button>
                            <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium cursor-pointer">Salvar</button>
                        </div>
                    </form>
                </div>
            </div>
        )}
        <Modal 
            isOpen={!!productToDelete} 
            onClose={() => setProductToDelete(null)}
            maxWidth="max-w-sm"
        >
            <div className="text-center p-2">
                <div className="flex justify-center mb-4">
                    <ExclamationTriangleIcon className="w-12 h-12 text-red-500" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Remover Produto?</h3>
                <p className="text-gray-600 mb-6 text-sm">
                    Tem certeza que deseja excluir este item? Esta ação não pode ser desfeita.
                </p>
                <div className="flex gap-3">
                    <button 
                        onClick={() => setProductToDelete(null)}
                        className="flex-1 py-2 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors cursor-pointer"
                    >
                        Cancelar
                    </button>
                    <button 
                        onClick={confirmDeleteProduct}
                        className="flex-1 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors cursor-pointer"
                        disabled={loadingDelete}
                    >
                        {loadingDelete ? 'Excluindo...' : 'Excluir'}
                    </button>
                </div>
            </div>
        </Modal>
    </div>
  );
}