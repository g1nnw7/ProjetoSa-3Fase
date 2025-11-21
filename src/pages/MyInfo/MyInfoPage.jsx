import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext'; 
import axios from 'axios';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import SimpleCaptcha from '../../components/Captcha/SimpleCaptcha'; 


function ExclamationTriangleIcon({ className = "w-12 h-12 text-red-500" }) {
  return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" /></svg>;
}

function InfoCard({ title, children, borderColor = "border-gray-100" }) {
  return (
    <div className={`bg-white p-6 rounded-xl shadow-lg border ${borderColor}`}>
      <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">{title}</h2>
      {children}
    </div>
  );
}

function FinalWarningModal({ onClose, onConfirm, loading }) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden p-6 text-center border-2 border-red-500 animate-pulse-border">
            <div className="flex justify-center mb-4">
                <ExclamationTriangleIcon className="w-16 h-16 text-red-600" />
            </div>
            <h3 className="text-2xl font-bold text-red-700 mb-2">Último Aviso!</h3>
            <p className="text-gray-700 mb-6 text-sm">
                Esta ação é <strong>irreversível</strong>. Todos os seus dados, histórico e configurações serão apagados permanentemente.
            </p>
            <div className="flex flex-col gap-3">
                <button 
                    onClick={onConfirm}
                    disabled={loading}
                    className="w-full py-3 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-colors shadow-lg hover:shadow-xl disabled:bg-gray-400 cursor-pointer"
                >
                    {loading ? 'EXCLUINDO...' : 'SIM, EXCLUIR TUDO'}
                </button>
                <button 
                    onClick={onClose}
                    disabled={loading}
                    className="w-full py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors cursor-pointer"
                >
                    Cancelar
                </button>
            </div>
        </div>
    </div>
  );
}

export default function MyInfoPage() {
  const { user, login, logout } = useAuth(); 
  const navigate = useNavigate();
  const [loadingInfo, setLoadingInfo] = useState(false);
  const [loadingPass, setLoadingPass] = useState(false); 

  const [nome, setNome] = useState(user ? user.nome : '');
  const [email, setEmail] = useState(user ? user.email : '');

  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [showDeleteFormModal, setShowDeleteFormModal] = useState(false); 
  const [showFinalWarning, setShowFinalWarning] = useState(false); 
  const [deletePassword, setDeletePassword] = useState('');
  const [isCaptchaValid, setIsCaptchaValid] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);


  const handleInfoSubmit = async (e) => {
    e.preventDefault();
    setLoadingInfo(true);
    const token = localStorage.getItem('accessToken');
    if (!token) { toast.error('Sessão expirada.'); setLoadingInfo(false); return; }
    try {
      const response = await axios.put(`http://localhost:3000/usuarios/${user.id}`, { nome, email }, { headers: { Authorization: `Bearer ${token}` } });
      login(response.data.data); 
      toast.success('Informações atualizadas!');
    } catch (error) { console.error(error); toast.error('Erro ao atualizar.'); } 
    finally { setLoadingInfo(false); }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setLoadingPass(true);
    const token = localStorage.getItem('accessToken');
    if (!token) { toast.error('Sessão expirada.'); setLoadingPass(false); return; }
    if (novaSenha.length < 8) { toast.error("A nova senha deve ter pelo menos 8 caracteres."); setLoadingPass(false); return; }
    try {
      await axios.post('http://localhost:3000/auth/change-password', { senhaAtual, novaSenha }, { headers: { Authorization: `Bearer ${token}` } });
      toast.success("Senha alterada!"); setSenhaAtual(''); setNovaSenha('');
    } catch (error) { 
        if (error.response?.status === 401) toast.error("A senha atual está incorreta.");
        else toast.error("Erro ao alterar senha.");
    } 
    finally { setLoadingPass(false); }
  };

  // validar a o captcha pika
  const handleValidateAndOpenFinalConfirm = () => {
      if (!isCaptchaValid) {
          toast.error("Por favor, resolva o Captcha corretamente.");
          return;
      }
      if (!deletePassword) {
          toast.error("Por favor, digite sua senha para confirmar.");
          return;
      }
      setShowDeleteFormModal(false);
      setShowFinalWarning(true);
  };

  const executeDeletion = async () => {
      setLoadingDelete(true);
      const token = localStorage.getItem('accessToken');
      try {
          await axios.delete('http://localhost:3000/auth/delete-account', {
              headers: { Authorization: `Bearer ${token}` },
              data: { password: deletePassword } 
          });
          
          toast.success("Conta excluída com sucesso.");
          logout(); 
          navigate('/'); 
      } catch (error) {
          console.error(error);
          setShowFinalWarning(false);
          setShowDeleteFormModal(true);
          
          if (error.response?.status === 401) toast.error("Senha incorreta. Tente novamente.");
          else toast.error("Erro ao excluir conta.");
      } finally {
          setLoadingDelete(false);
      }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto max-w-4xl p-4 md:p-8">
        
        <div className="mb-6">
          <Link to="/dashboard" className="flex items-center text-base font-medium text-gray-600 hover:text-green-600 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-1"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" /></svg>
            Voltar ao Dashboard
          </Link>
        </div>
        
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Minhas Informações</h1>

        <InfoCard title="Informações Pessoais">
          <form onSubmit={handleInfoSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Nome</label>
              <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>
            <button type="submit" disabled={loadingInfo} className="w-full py-2 px-4 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition-colors disabled:bg-gray-400 cursor-pointer">
              {loadingInfo ? 'Salvando...' : 'Salvar Alterações'}
            </button>
          </form>
        </InfoCard>

        <div className="mt-8">
          <InfoCard title="Mudar Senha">
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Senha Atual</label>
                <input type="password" value={senhaAtual} onChange={(e) => setSenhaAtual(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Nova Senha (mín. 8 caracteres)</label>
                <input type="password" value={novaSenha} onChange={(e) => setNovaSenha(e.target.value)} required minLength={8} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
              </div>
              <button type="submit" disabled={loadingPass} className="w-full py-2 px-4 rounded-lg bg-gray-700 text-white font-semibold hover:bg-gray-800 transition-colors disabled:bg-gray-400 cursor-pointer">
                {loadingPass ? 'Alterando...' : 'Mudar Senha'}
              </button>
            </form>
          </InfoCard>
        </div>

        {/* assutar os otario q querem largar a nutriFit */}
        <div className="mt-12 pt-8 border-t-2 border-red-100">
            <div className="bg-red-50 border border-red-200 p-6 rounded-xl flex justify-between items-center">
                <div>
                    <h3 className="text-xl font-bold text-red-700">Excluir Conta</h3>
                    <p className="text-red-600 text-sm mt-1">Esta ação é permanente e removerá todos os seus dados.</p>
                </div>
                <button 
                    onClick={() => setShowDeleteFormModal(true)}
                    className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors shadow-sm cursor-pointer"
                >
                    Excluir
                </button>
            </div>
        </div>

        {/* modal com o CAPTCHA la e a senha */}
        {showDeleteFormModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-fadeIn">
                    <div className="p-6 text-center">
                        <div className="flex justify-center mb-4">
                            <ExclamationTriangleIcon />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">Exclusão de Conta</h2>
                        <p className="text-gray-600 mb-6">
                            Para continuar, resolva o captcha e confirme sua senha atual.
                        </p>

                        <div className="space-y-6 text-left">
                            {/* Captcha */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">1. Resolva o Captcha</label>
                                <SimpleCaptcha onValidate={setIsCaptchaValid} />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">2. Confirme sua Senha</label>
                                <input 
                                    type="password" 
                                    placeholder="Sua senha atual"
                                    value={deletePassword}
                                    onChange={(e) => setDeletePassword(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                                />
                            </div>
                        </div>

                        <div className="mt-8 flex space-x-3">
                            <button 
                                onClick={() => setShowDeleteFormModal(false)}
                                className="flex-1 py-2 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors cursor-pointer"
                            >
                                Cancelar
                            </button>
                            <button 
                                onClick={handleValidateAndOpenFinalConfirm}
                                disabled={!isCaptchaValid || !deletePassword}
                                className="flex-1 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed cursor-pointer"
                            >
                                Próximo
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {/* confirmar se vai largar nossa pequena nutrifit pra sempre excluindo conta */}
        {showFinalWarning && (
            <FinalWarningModal 
                loading={loadingDelete}
                onConfirm={executeDeletion}
                onClose={() => setShowFinalWarning(false)}
            />
        )}

      </div>
    </div>
  );
}