import { createContext, useState } from "react"

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
    const [accessToken, setAccessToken] = useState(
        localStorage.getItem("access") || null
    )

    const login = (tokens) => {
        localStorage.setItem("access", tokens.access)
        localStorage.setItem("refresh", tokens.refresh)
        setAccessToken(tokens.access)
    }

    const logout = () => {
        localStorage.removeItem("access")
        localStorage.removeItem("refresh")
        setAccessToken(null)
    }

    const value = { accessToken, login, logout }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export default AuthContext