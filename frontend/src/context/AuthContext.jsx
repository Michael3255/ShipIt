// AuthContext
import { createContext} from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({children}) => {
    // hardcode token - swap later
    const value = {
        accessToken: import.meta.env.VITE_ACCESS_TOKEN,
    }
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
export default AuthContext
