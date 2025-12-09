import React from 'react';
import { useAuth } from '../../contexts/AuthContext.jsx'; 
import { useNavigate } from 'react-router-dom'; 


function UserCircleIcon() {
  return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-green-600"><path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>;
}
function ArchiveBoxIcon() {
  return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-green-600"><path strokeLinecap="round" strokeLinejoin="round" d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" /></svg>;
}
function MapPinIcon() {
  return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-green-600"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" /></svg>;
}

function DashboardCard({ icon, title, description, onClick }) {
  return (
    <button 
      onClick={onClick}
      className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 
                 flex items-center space-x-6 hover:shadow-lg 
                 hover:border-green-300 transition-all duration-300 cursor-pointer"
    >
      <div className="shrink-0 bg-green-100 p-4 rounded-full">
        {icon}
      </div>
      <div>
        <h3 className="text-xl font-semibold text-gray-800 text-left">{title}</h3>
        <p className="text-gray-600 text-left">{description}</p>
      </div>
    </button>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  if (!user) {
    return (
      <div className="container mx-auto max-w-4xl p-8">
        <h1 className="text-3xl font-bold text-gray-800">Carregando...</h1>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto max-w-4xl p-4 md:p-8">
        <div className="mb-8 p-6 bg-white rounded-lg shadow-sm border border-gray-200">
          <h1 className="text-4xl font-bold text-gray-800">
            Olá, <span className="text-green-600">{user.nome}!</span>
          </h1>
          <p className="text-lg text-gray-600 mt-2">
            Bem-vindo ao seu painel. Aqui você pode gerir as suas informações e pedidos.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <DashboardCard
            icon={<ArchiveBoxIcon />}
            title="Meus Pedidos"
            description="Ver o histórico dos seus pedidos"
            onClick={() => navigate('/dashboard/orders')}
          />
          
          <DashboardCard
            icon={<UserCircleIcon />}
            title="Minhas Informações"
            description="Atualizar o seu email e senha"
            onClick={() => navigate('/dashboard/info')} 
          />
          
          <DashboardCard
            icon={<MapPinIcon />}
            title="Endereços"
            description="Gerir os seus endereços de entrega"
            onClick={() => navigate('/dashboard/addresses')}
          />

          <DashboardCard
            icon={<MapPinIcon />}
            title="Planos"
            description="Seu histórico de planos alimentares"
            onClick={() => navigate('/dashboard/myplan')}
          />

        </div>

      </div>
    </div>
  );
}