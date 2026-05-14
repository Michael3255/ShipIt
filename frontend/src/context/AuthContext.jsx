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

    // Uses the refresh token to get a new access token
    // If refresh token is expired or missing, logs the user out
    const refreshAccessToken = async () => {
        const refresh = localStorage.getItem("refresh")
        if (!refresh) {
            logout()
            return null
        }
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/token/refresh/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refresh })
        })
        if (res.ok) {
            const data = await res.json()
            localStorage.setItem("access", data.access)
            setAccessToken(data.access)
            return data.access
        } else {
            // if refresh token expired force the user to log in again
            logout()
            return null
        }
    }

    // Drop-in replacement for fetch that handles token expiry automatically
    // If a request returns a 401, it refreshes the token and retries, on fail it redirects back to login
    const authFetch = async (url, options = {}) => {
        const token = localStorage.getItem("access")
        const res = await fetch(url, {
            ...options,
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
                ...options.headers
            }
        })

        // if token expired try to refresh and retry the request
        if (res.status === 401) {
            const newToken = await refreshAccessToken()
            if (!newToken) return res  // if refresh failed, user is logged out
            return fetch(url, {
                ...options,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${newToken}`,
                    ...options.headers
                }
            })
        }
        return res
    }

    const value = { accessToken, login, logout, authFetch }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export default AuthContext