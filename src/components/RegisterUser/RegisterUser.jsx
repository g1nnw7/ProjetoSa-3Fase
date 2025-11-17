import axios from 'axios'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

const RegisterUser = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('')
    const [nome, setNome] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    const [isPasswordMatch, setIsPasswordMatch] = useState(true)
    const [isSaving, setIsSaving] = useState(false)

    const handleEmailChange = (e) => setEmail(e.target.value)
    const handlePasswordChange = (e) => setPassword(e.target.value)
    const handleNomeChange = (e) => setNome(e.target.value)
    const handleConfirmPasswordChange = (e) => setConfirmPassword(e.target.value)

    const isPasswordValid = () =>
        password.length >= 8 && password === confirmPassword

    const resetForm = () => {
        setEmail('')
        setPassword('')
        setNome('')
        setConfirmPassword('')
        setIsPasswordMatch(true)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!isPasswordValid()) {
            setIsPasswordMatch(false)
            return
        }

        setIsSaving(true)

        try {
            await axios.post('http://localhost:3000/auth/register', {
                nome: nome,
                email: email,
                senha: password
            })

            setIsSaving(false)
            resetForm()

            toast.success("Usuário criado com sucesso!", {
                autoClose: 3000,
                hideProgressBar: true
            })

            setTimeout(() => navigate("/login"), 2000)

        } catch (error) {
            console.error("Erro ao criar o usuário", error)
            toast.error("Erro ao criar o usuário!", {
                autoClose: 3000,
                hideProgressBar: true
            })
            setIsSaving(false)
        }
    }

    return (
        <div className="w-full max-w-sm mx-auto">
            <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                    Criar Usuário
                </h2>
                <p className="text-gray-500 text-sm">
                    Preencha os dados abaixo para criar sua conta
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Nome */}
                <div className='relative'>
                    <input
                        type="text"
                        id="nomeRegisterUser"
                        value={nome}
                        onChange={handleNomeChange}
                        required
                        className="peer w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm 
                        focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder=" "
                    />
                    <label htmlFor="nomeRegisterUser" 
                            className="absolute left-3 top-2 origin-[0] -translate-y-5 scale-75 transform 
                            cursor-text bg-white px-1 text-sm font-medium text-gray-700 
                            duration-200 ease-in-out
                            peer-placeholder-shown:translate-y-0 
                            peer-placeholder-shown:scale-100 
                            peer-focus:-translate-y-5 
                            peer-focus:scale-75 
                            peer-focus:text-green-600"
                    >
                        Nome
                    </label>
                </div>

                {/* Email */}
                <div className='relative'>
                    <input
                        type="email"
                        id="emailRegisterUser"
                        value={email}
                        onChange={handleEmailChange}
                        required
                        className="peer w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm 
                        focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder=" "
                    />
                    <label htmlFor="emailRegisterUser" 
                            className="absolute left-3 top-2 origin-[0] -translate-y-5 scale-75 transform 
                            cursor-text bg-white px-1 text-sm font-medium text-gray-700 
                            duration-200 ease-in-out
                            peer-placeholder-shown:translate-y-0 
                            peer-placeholder-shown:scale-100 
                            peer-focus:-translate-y-5 
                            peer-focus:scale-75 
                            peer-focus:text-green-600"
                    >
                        Email
                    </label>
                </div>

                {/* Senha */}
                <div className='relative'>
                    <input
                        type="password"
                        id="passwordRegisterUser"
                        value={password}
                        onChange={handlePasswordChange}
                        required
                        minLength={8}
                        className="peer w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm 
                        focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder=" "
                    />
                    <label htmlFor="passwordRegisterUser" 
                            className="absolute left-3 top-2 origin-[0] -translate-y-5 scale-75 transform 
                            cursor-text bg-white px-1 text-sm font-medium text-gray-700 
                            duration-200 ease-in-out
                            peer-placeholder-shown:translate-y-0 
                            peer-placeholder-shown:scale-100 
                            peer-focus:-translate-y-5 
                            peer-focus:scale-75 
                            peer-focus:text-green-600"
                    >
                        Senha
                    </label>
                </div>

                {/* Confirmar senha */}
                <div className='relative'>
                    <input
                        type="password"
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={handleConfirmPasswordChange}
                        required
                        minLength={8}
                        className="peer w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm 
                        focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder=" "
                    />
                    <label htmlFor="confirmPassword" 
                        className="absolute left-3 top-2 origin-[0] -translate-y-5 scale-75 transform 
                        cursor-text bg-white px-1 text-sm font-medium text-gray-700 
                        duration-200 ease-in-out
                        peer-placeholder-shown:translate-y-0 
                        peer-placeholder-shown:scale-100 
                        peer-focus:-translate-y-5 
                        peer-focus:scale-75 
                        peer-focus:text-green-600"
                    >
                        Confirmar senha
                    </label>

                    {!isPasswordMatch && (
                        <p className="text-red-500 text-sm mt-1">
                            As senhas não correspondem.
                        </p>
                    )}
                </div>

                {/* Botão */}
                <button
                    type="submit"
                    disabled={isSaving}
                    className={`w-full py-2 mt-2 text-white font-semibold rounded-lg shadow transition cursor-pointer 
                                ${isSaving
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-green-600 hover:bg-green-700"
                        }`}
                >
                    {isSaving ? "Salvando..." : "Criar Usuário"}
                </button>
            </form>
        </div>
    )
}

export default RegisterUser
