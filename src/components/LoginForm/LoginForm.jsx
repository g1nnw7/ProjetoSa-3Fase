import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import Modal from "../Modal/Modal";
import RegisterUser from "../RegisterUser/RegisterUser";

const LoginForm = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const { login, user } = useAuth();
    const navigate = useNavigate();

    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        if (user) {
            navigate("/");
        }
    }, [user, navigate]);

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const data = {
                email: email,
                senha: password,
            };

            const response = await axios.post("http://localhost:3000/auth/login", data);

            if (response.data.error) {
                toast.error(response.data.error, {
                    autoClose: 3000,
                    hideProgressBar: true,
                });
                return;
            }

            const { user, accessToken, refreshToken } = response.data;

            localStorage.setItem("usuarioLogado", JSON.stringify(user))
            localStorage.setItem("accessToken", accessToken);
            localStorage.setItem("refreshToken", refreshToken);

            login(user);

            toast.success("Login realizado com sucesso!", {
                autoClose: 3000,
                hideProgressBar: true,
            });

            setTimeout(() => navigate("/"), 2000);
        } catch (error) {
            console.error("Erro ao verificar o usuário:", error);

            if (error.response?.status === 401) {
                toast.error("Email ou senha inválidos!", {
                    autoClose: 3000,
                    hideProgressBar: true,
                });
            } else {
                toast.error("Erro ao conectar com o servidor!", {
                    autoClose: 3000,
                    hideProgressBar: true,
                });
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-sm">

                {/* Logo */}
                {/* <a href="/" className="flex flex-col items-center mb-6">
                    <img 
                        src="/img/logo.png" 
                        alt="Logo" 
                        className="h-12 w-auto  block mx-auto"
                    />
                </a> */}
                <h1 className="flex flex-col text-2xl font-bold text-gray-800 items-center m-5">Login</h1>

                <form onSubmit={handleLogin} className="space-y-4">
                    <div className="relative">
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="peer w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm 
                            focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder=" "
                        />
                        <label
                            htmlFor="email"
                            className="absolute left-3 top-2 origin-[0] -translate-y-5 scale-75 transform 
                            cursor-text bg-white px-1 text-sm font-medium text-gray-700 
                            duration-200 ease-in-out
                            peer-placeholder-shown:translate-y-0 
                            peer-placeholder-shown:scale-100 
                            peer-focus:-translate-y-5 
                            peer-focus:scale-75 
                            peer-focus:text-green-600"
                        >
                            Email:
                        </label>
                    </div>

                    <div className="relative">
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength={8}
                            className="peer w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm 
                            focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder=" " // Importante: um placeholder com um espaço
                        />
                        <label
                            htmlFor="password"
                            className="absolute left-3 top-2 origin-[0] -translate-y-5 scale-75 transform 
                            cursor-text bg-white px-1 text-sm font-medium text-gray-700 
                            duration-200 ease-in-out
                            peer-placeholder-shown:translate-y-0 
                            peer-placeholder-shown:scale-100 
                            peer-focus:-translate-y-5 
                            peer-focus:scale-75 
                            peer-focus:text-green-600"
                        >
                            Senha:
                        </label>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-green-600 hover:bg-green-700 
                                   text-white font-semibold py-2 rounded-lg shadow transition-all duration-300 ease-in-out cursor-pointer"
                    >
                        Entrar
                    </button>
                </form>

                <p className="text-center text-sm text-gray-600 mt-4">
                    Esqueceu sua senha?{" "}
                    <button className="text-green-600 hover:underline font-medium cursor-pointer">
                        Recuperar
                    </button>
                    <br />
                    Não tem conta?{" "}
                    <button
                        className="text-green-600 hover:underline font-medium cursor-pointer"
                        onClick={() => setIsModalOpen(true)}
                    >
                        Criar conta
                    </button>
                </p>

                <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                    <RegisterUser />
                </Modal>
            </div>
        </div>
    );
};

export default LoginForm;
