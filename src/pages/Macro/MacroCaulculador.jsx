import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

function TrashIcon({ className }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
            <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12.578 0a48.097 48.097 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
        </svg>
    );
}

function PlusIcon({ className }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
    );
}

function SearchIcon({ className }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
        </svg>
    );
}

function CalculatorIcon({ className }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><rect x="4" y="2" width="16" height="20" rx="2" strokeLinecap="round" strokeLinejoin="round" /><path strokeLinecap="round" strokeLinejoin="round" d="M8 6h8m0 8v4m0-8h.01M12 10h.01M8 10h.01M12 14h.01M8 14h.01M12 18h.01M8 18h.01" />
        </svg>
    );
}


export default function MacroCalculadora() {
    const [alimentoInput, setAlimentoInput] = useState('');
    const [gramasInput, setGramasInput] = useState('');
    const [macros, setMacros] = useState(() => {
        const savedMacros = localStorage.getItem('user_macros');
        return savedMacros ? JSON.parse(savedMacros) : [];
    });

    const [alimentosDB, setAlimentosDB] = useState([]);
    const [sugestoes, setSugestoes] = useState([]);
    const [mostrarSugestoes, setMostrarSugestoes] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        localStorage.setItem('user_macros', JSON.stringify(macros));
    }, [macros]);

    const totais = macros.reduce(
        (acc, item) => {
            acc.gramas += item.gramas;
            acc.calorias += item.calorias;
            acc.proteinas += item.proteinas;
            acc.carboidratos += item.carboidratos;
            acc.gorduras += item.gorduras;
            return acc;
        },
        { gramas: 0, calorias: 0, proteinas: 0, carboidratos: 0, gorduras: 0 }
    );

    useEffect(() => {
        async function fetchAlimentos() {
            try {
                const res = await axios.get('http://localhost:3000/alimentos');
                setAlimentosDB(res.data);
            } catch (err) {
                console.error('Erro ao buscar alimentos:', err);
                toast.error('Erro ao conectar com o servidor.');
            }
        }
        fetchAlimentos();
    }, []);
    useEffect(() => {
        if (alimentoInput.length > 0) {
            const filtrados = alimentosDB.filter(item =>
                item.nome.toLowerCase().includes(alimentoInput.toLowerCase())
            );
            setSugestoes(filtrados);
            setMostrarSugestoes(true);
        } else {
            setSugestoes([]);
            setMostrarSugestoes(false);
        }
    }, [alimentoInput, alimentosDB]);
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setMostrarSugestoes(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const selecionarAlimento = (nome) => {
        setAlimentoInput(nome);
        setMostrarSugestoes(false);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!alimentoInput || !gramasInput) {
            toast.warn('Preencha todos os campos!');
            return;
        }

        const alimentoBase = alimentosDB.find(
            (item) => item.nome.toLowerCase() === alimentoInput.toLowerCase()
        );

        if (!alimentoBase) {
            toast.error('Alimento não encontrado! Selecione um da lista.');
            return;
        }

        const fator = parseFloat(gramasInput) / alimentoBase.gramas;

        const macroCalculado = {
            id: Date.now(),
            nome: alimentoBase.nome,
            gramas: parseFloat(gramasInput),
            calorias: alimentoBase.calorias * fator,
            proteinas: alimentoBase.proteinas * fator,
            carboidratos: alimentoBase.carboidratos * fator,
            gorduras: alimentoBase.gorduras * fator
        };

        setMacros([...macros, macroCalculado]);
        setAlimentoInput('');
        setGramasInput('');
        toast.success('Alimento adicionado!');
    };

    const excluir = (id) => {
        setMacros(macros.filter(m => m.id !== id));
        toast.info('Item removido.');
    };

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="container mx-auto max-w-5xl p-4 md:p-8">

                <div className="mb-8 p-6 bg-white rounded-xl shadow-sm border border-gray-200">
                    <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
                        <CalculatorIcon className="w-8 h-8 text-green-600" />
                        Calculadora de Macros
                    </h1>
                    <p className="text-gray-600 mt-2">
                        Planeje sua dieta calculando calorias e macronutrientes consumidos durante o seu dia!
                    </p>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    <div className="w-full lg:w-1/3">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 sticky top-6 z-20">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Adicionar Alimento</h2>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="relative" ref={dropdownRef}>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Nome do Alimento
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <SearchIcon className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            type="text"
                                            value={alimentoInput}
                                            onChange={(e) => setAlimentoInput(e.target.value)}
                                            onFocus={() => alimentoInput && setMostrarSugestoes(true)}
                                            placeholder="Ex: Arroz, Frango..."
                                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
                                            autoComplete="off"
                                        />
                                    </div>
                                    {mostrarSugestoes && (
                                        <ul className="absolute z-30 w-full bg-white border border-gray-200 rounded-lg shadow-xl mt-1 max-h-60 overflow-y-auto">
                                            {sugestoes.length > 0 ? (
                                                sugestoes.map((item) => (
                                                    <li
                                                        key={item.id}
                                                        onClick={() => selecionarAlimento(item.nome)}
                                                        className="px-4 py-2 hover:bg-green-50 cursor-pointer text-gray-700 border-b border-gray-100 last:border-0 transition-colors"
                                                    >
                                                        {item.nome}
                                                    </li>
                                                ))
                                            ) : (
                                                <li className="px-4 py-3 text-gray-500 text-sm text-center">Nenhum alimento encontrado.</li>
                                            )}
                                        </ul>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Quantidade (gramas)
                                    </label>
                                    <input
                                        type="number"
                                        value={gramasInput}
                                        onChange={(e) => setGramasInput(e.target.value)}
                                        placeholder="Ex: 100"
                                        min="1"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
                                        required
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-green-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2 shadow-md hover:shadow-lg cursor-pointer"
                                >
                                    <PlusIcon className="w-5 h-5" />
                                    Adicionar
                                </button>
                            </form>
                        </div>
                    </div>
                    <div className="w-full lg:w-2/3 z-10">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                                <h2 className="text-xl font-semibold text-gray-800">Refeição Atual</h2>
                                <span className="text-sm font-medium text-gray-500">{macros.length} itens</span>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-gray-50 text-gray-600 text-sm uppercase tracking-wider">
                                        <tr>
                                            <th className="px-6 py-3 font-medium">Alimento</th>
                                            <th className="px-6 py-3 font-medium text-center">Peso</th>
                                            <th className="px-6 py-3 font-medium text-center">Kcal</th>
                                            <th className="px-6 py-3 font-medium text-center text-blue-600">Prot</th>
                                            <th className="px-6 py-3 font-medium text-center text-yellow-600">Carb</th>
                                            <th className="px-6 py-3 font-medium text-center text-red-600">Gord</th>
                                            <th className="px-6 py-3 font-medium text-center">Ação</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {macros.length === 0 ? (
                                            <tr>
                                                <td colSpan="7" className="px-6 py-10 text-center text-gray-400">
                                                    Adicione alimentos para ver os macros.
                                                </td>
                                            </tr>
                                        ) : (
                                            macros.map((item) => (
                                                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                                    <td className="px-6 py-4 font-medium text-gray-800">{item.nome}</td>
                                                    <td className="px-6 py-4 text-center text-gray-600">{item.gramas.toFixed(0)}g</td>
                                                    <td className="px-6 py-4 text-center font-semibold text-gray-800">{item.calorias.toFixed(0)}</td>
                                                    <td className="px-6 py-4 text-center text-blue-600">{item.proteinas.toFixed(1)}g</td>
                                                    <td className="px-6 py-4 text-center text-yellow-600">{item.carboidratos.toFixed(1)}g</td>
                                                    <td className="px-6 py-4 text-center text-red-600">{item.gorduras.toFixed(1)}g</td>
                                                    <td className="px-6 py-4 text-center">
                                                        <button
                                                            onClick={() => excluir(item.id)}
                                                            className="text-red-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-full transition-colors cursor-pointer"
                                                            title="Remover"
                                                        >
                                                            <TrashIcon className="w-5 h-5" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                    {macros.length > 0 && (
                                        <tfoot className="bg-green-50 font-bold text-gray-800">
                                            <tr>
                                                <td className="px-6 py-4">TOTAL</td>
                                                <td className="px-6 py-4 text-center">{totais.gramas.toFixed(0)}g</td>
                                                <td className="px-6 py-4 text-center text-green-800">{totais.calorias.toFixed(0)}</td>
                                                <td className="px-6 py-4 text-center text-blue-800">{totais.proteinas.toFixed(1)}g</td>
                                                <td className="px-6 py-4 text-center text-yellow-800">{totais.carboidratos.toFixed(1)}g</td>
                                                <td className="px-6 py-4 text-center text-red-800">{totais.gorduras.toFixed(1)}g</td>
                                                <td className="px-6 py-4"></td>
                                            </tr>
                                        </tfoot>
                                    )}
                                </table>
                            </div>
                        </div>

                        {macros.length > 0 && (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                                <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 text-center">
                                    <h3 className="text-blue-800 font-semibold text-sm uppercase">Proteínas</h3>
                                    <p className="text-2xl font-bold text-blue-600">{totais.proteinas.toFixed(1)}g</p>
                                </div>
                                <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-100 text-center">
                                    <h3 className="text-yellow-800 font-semibold text-sm uppercase">Carboidratos</h3>
                                    <p className="text-2xl font-bold text-yellow-600">{totais.carboidratos.toFixed(1)}g</p>
                                </div>
                                <div className="bg-red-50 p-4 rounded-xl border border-red-100 text-center">
                                    <h3 className="text-red-800 font-semibold text-sm uppercase">Gorduras</h3>
                                    <p className="text-2xl font-bold text-red-600">{totais.gorduras.toFixed(1)}g</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}