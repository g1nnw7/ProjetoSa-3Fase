import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null)

    useEffect(() => {
        const savedUser = localStorage.getItem("usuarioLogado");
        if (savedUser) {
            try {

                setUser(JSON.parse(savedUser)); 
            } catch (e) {
                console.error("Erro ao parsear usuário do localStorage", e);
                localStorage.removeItem("usuarioLogado");
            }
        }
    }, [])


    const login = (userData) => {
        localStorage.setItem("usuarioLogado", JSON.stringify(userData));
        setUser(userData); 
    }


    const logout = () => {
        localStorage.removeItem("usuarioLogado");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        setUser(null);
    }

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)