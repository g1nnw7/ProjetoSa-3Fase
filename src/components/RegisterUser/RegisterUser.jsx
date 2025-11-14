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
                <div>
                    <label htmlFor="nomeRegisterUser" className="text-sm font-medium text-gray-700">
                        Nome
                    </label>
                    <input
                        type="text"
                        id="nomeRegisterUser"
                        value={nome}
                        onChange={handleNomeChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm 
                                   focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                </div>

                {/* Email */}
                <div>
                    <label htmlFor="emailRegisterUser" className="text-sm font-medium text-gray-700">
                        Email
                    </label>
                    <input
                        type="email"
                        id="emailRegisterUser"
                        value={email}
                        onChange={handleEmailChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm 
                                   focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                </div>

                {/* Senha */}
                <div>
                    <label htmlFor="passwordRegisterUser" className="text-sm font-medium text-gray-700">
                        Senha
                    </label>
                    <input
                        type="password"
                        id="passwordRegisterUser"
                        value={password}
                        onChange={handlePasswordChange}
                        required
                        minLength={8}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm 
                                   focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                </div>

                {/* Confirmar senha */}
                <div>
                    <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                        Confirmar senha
                    </label>
                    <input
                        type="password"
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={handleConfirmPasswordChange}
                        required
                        minLength={8}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm 
                                   focus:outline-none focus:ring-2 focus:ring-green-500"
                    />

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
                    className={`w-full py-2 mt-2 text-white font-semibold rounded-lg shadow transition 
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
