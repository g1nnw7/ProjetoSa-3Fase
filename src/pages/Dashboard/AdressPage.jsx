import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

function EditIcon({ className }) {
  return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" /></svg>;
}
function TrashIcon({ className }) {
  return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12.578 0a48.097 48.097 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /></svg>;
}
function PlusIcon({ className }) {
  return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>;
}
function BackIcon({ className }) {
  return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" /></svg>;
}
function SearchIcon({ className }) { 
  return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" /></svg>; 
}

const initialAddressState = {
  id: null,
  apelido: '',
  rua: '',
  numero: '',
  complemento: '',
  cep: '',
  cidade: '',
  estado: '',
};

function AddressForm({ editingAddress, setEditingAddress, onSave }) {
  const [formData, setFormData] = useState(editingAddress || initialAddressState);
  const [loading, setLoading] = useState(false);
  const [loadingCep, setLoadingCep] = useState(false);

  useEffect(() => {
    setFormData(editingAddress || initialAddressState);
  }, [editingAddress]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'cep') {
        const masked = value.replace(/\D/g, '').substring(0, 8);
        setFormData(prev => ({ ...prev, [name]: masked }));
    } else {
        setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleCepBlur = async () => {
    const cep = formData.cep?.replace(/\D/g, '');
    if (cep?.length !== 8) return;

    setLoadingCep(true);
    try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await response.json();

        if (!data.erro) {
            setFormData(prev => ({
                ...prev,
                rua: data.logradouro,
                cidade: data.localidade,
                estado: data.uf,
            }));
            toast.success("Endereço encontrado!");
        } else {
            toast.error("CEP não encontrado.");
        }
    } catch (error) {
        console.error(error);
        toast.error("Erro ao buscar CEP.");
    } finally {
        setLoadingCep(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await onSave(formData);
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl w-full max-w-lg p-6 shadow-2xl animate-fadeIn overflow-y-auto max-h-[90vh]">
        <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">
          {formData.id ? 'Editar Endereço' : 'Adicionar Novo Endereço'}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Campo de CEP com Botão de Busca */}
          <div className="relative">
             <label className="block text-sm font-medium text-gray-700">CEP</label>
             <div className="flex gap-2">
                <input
                    type="text"
                    name="cep"
                    value={formData.cep}
                    onChange={handleChange}
                    onBlur={handleCepBlur} // Busca ao sair do campo
                    placeholder="00000000"
                    required
                    maxLength={8}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                />
                <button 
                    type="button" 
                    onClick={handleCepBlur}
                    disabled={loadingCep}
                    className="bg-gray-200 text-gray-700 px-3 rounded-lg hover:bg-gray-300 disabled:opacity-50 transition-colors cursor-pointer"
                    title="Buscar CEP"
                >
                    {loadingCep ? '...' : <SearchIcon className="w-5 h-5" />}
                </button>
             </div>
          </div>

          <div>
             <label className="block text-sm font-medium text-gray-700">Apelido (ex: Casa, Trabalho)</label>
             <input
                type="text"
                name="apelido"
                value={formData.apelido}
                onChange={handleChange}
                placeholder="Minha Casa"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
              />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Rua/Avenida</label>
            <input
                type="text"
                name="rua"
                value={formData.rua}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none bg-gray-50"
            />
          </div>

          <div className="flex space-x-3">
            <div className="w-1/3">
                <label className="block text-sm font-medium text-gray-700">Número</label>
                <input
                type="text"
                name="numero"
                value={formData.numero}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                />
            </div>
            <div className="w-2/3">
                <label className="block text-sm font-medium text-gray-700">Complemento</label>
                <input
                type="text"
                name="complemento"
                value={formData.complemento}
                onChange={handleChange}
                placeholder="Apto 101"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                />
            </div>
          </div>

          <div className="flex space-x-3">
            <div className="w-2/3">
                <label className="block text-sm font-medium text-gray-700">Cidade</label>
                <input
                type="text"
                name="cidade"
                value={formData.cidade}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none bg-gray-50"
                />
            </div>
            <div className="w-1/3">
                <label className="block text-sm font-medium text-gray-700">UF</label>
                <input
                type="text"
                name="estado"
                value={formData.estado}
                onChange={handleChange}
                required
                maxLength={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none bg-gray-50"
                />
            </div>
          </div>

          <div className="pt-4 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setEditingAddress(null)}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium cursor-pointer"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:bg-gray-400 cursor-pointer"
              disabled={loading}
            >
              {loading ? 'Salvando...' : formData.id ? 'Salvar Edição' : 'Adicionar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AddressesPage() {
  const { user } = useAuth();
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingAddress, setEditingAddress] = useState(null);

  const fetchAddresses = async () => {
    setLoading(true);
    const token = localStorage.getItem('accessToken');
    if (!token || !user) {
        setLoading(false);
        return;
    }

    try {
      const response = await axios.get(
        `http://localhost:3000/enderecos`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAddresses(response.data.data || []);
    } catch (error) {
      console.error("Erro ao buscar endereços:", error);
      setAddresses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, [user]); 

  const handleSave = async (data) => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
        toast.error('Sessão expirada. Faça login novamente.');
        return;
    }
    
    try {
      if (data.id) {
        await axios.put(
          `http://localhost:3000/enderecos/${data.id}`,
          data,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success('Endereço atualizado!');
      } else {
        await axios.post(
          'http://localhost:3000/enderecos',
          data,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success('Novo endereço adicionado!');
      }
      setEditingAddress(null); 
      fetchAddresses(); 
    } catch (error) {
      console.error("Erro ao salvar endereço:", error);
      toast.error('Erro ao salvar endereço.');
    }
  };

  const handleDelete = async (addressId) => {
    if (!window.confirm("Tem certeza que deseja remover este endereço?")) return;
    
    const token = localStorage.getItem('accessToken');
    try {
      await axios.delete(
        `http://localhost:3000/enderecos/${addressId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Endereço removido!');
      fetchAddresses();
    } catch (error) {
      console.error("Erro ao deletar endereço:", error);
      toast.error('Erro ao remover endereço.');
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto max-w-4xl p-4 md:p-8">
        <div className="mb-6">
          <Link 
            to="/dashboard"
            className="flex items-center text-base font-medium text-gray-600 hover:text-green-600 transition-colors"
          >
            <BackIcon className="w-5 h-5 mr-1" />
            Voltar ao Dashboard
          </Link>
        </div>
        
        <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Meus Endereços</h1>
            <button
                onClick={() => setEditingAddress(initialAddressState)}
                className="flex items-center space-x-2 py-2 px-4 rounded-lg bg-green-600 text-white 
                           font-semibold hover:bg-green-700 transition-colors shadow-md hover:shadow-lg cursor-pointer"
            >
                <PlusIcon className="w-5 h-5" />
                <span>Adicionar Novo</span>
            </button>
        </div>

        {loading && (
            <div className="text-center p-8 text-lg text-gray-500 animate-pulse">Carregando endereços...</div>
        )}

        {!loading && addresses.length === 0 && (
            <div className="text-center p-12 bg-white rounded-xl shadow-sm border border-gray-200">
                <p className="text-gray-500 text-lg mb-4">Você ainda não tem endereços cadastrados.</p>
                <button
                    onClick={() => setEditingAddress(initialAddressState)}
                    className="text-green-600 font-semibold hover:underline cursor-pointer"
                >
                    Cadastre o seu primeiro endereço agora
                </button>
            </div>
        )}

        {/* Lista de Endereços */}
        <div className="space-y-4">
            {addresses.map((address) => (
                <div key={address.id} className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:border-green-200 transition-all flex justify-between items-start">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-xl font-bold text-gray-800">{address.apelido}</h3>
                            <span className="bg-gray-100 text-gray-500 text-xs px-2 py-0.5 rounded-full uppercase font-bold">
                                {address.estado}
                            </span>
                        </div>
                        <p className="text-gray-600">
                            {address.rua}, {address.numero} {address.complemento && `(${address.complemento})`}
                        </p>
                        <p className="text-gray-500 text-sm mt-1">
                            CEP: {address.cep} - {address.cidade}
                        </p>
                    </div>
                    
                    <div className="flex space-x-2 flex-shrink-0">
                        <button
                            onClick={() => setEditingAddress(address)}
                            className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-full transition-colors cursor-pointer"
                            title="Editar"
                        >
                            <EditIcon className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => handleDelete(address.id)}
                            className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-full transition-colors cursor-pointer"
                            title="Remover"
                        >
                            <TrashIcon className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            ))}
        </div>

      </div>
      
      {/* Modal de Adicionar/Editar */}
      {editingAddress && (
        <AddressForm 
          editingAddress={editingAddress} 
          setEditingAddress={setEditingAddress} 
          onSave={handleSave} 
        />
      )}
    </div>
  );
}