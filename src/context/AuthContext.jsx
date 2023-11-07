import { useEffect } from "react";
import { createContext, useContext, useState } from "react";
import { account } from "../config/appwriteConfig";
import { useNavigate } from "react-router-dom";
import { ID } from "appwrite";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    getUserOnLoad();
  }, []);

  const getUserOnLoad = async () => {
    try {
      const currentAccount = await account.get();
      setUser(currentAccount);
    } catch (error) {
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const register = async (e, credentials) => {
    e.preventDefault();
    // Check password
    if (credentials.password1 !== credentials.password2) {
      return alert(
        "Password not match. Please input password again correctly.",
      );
    }

    try {
      await account.create(
        ID.unique(),
        credentials.email,
        credentials.password1,
        credentials.username,
      );
      // Create session
      await account.createEmailSession(
        credentials.email,
        credentials.password1,
      );
      const currentAccount = await account.get();
      if (currentAccount) {
        setUser(currentAccount);
      }
      navigate("/");
    } catch (error) {
      console.error(error.message);
    }
  };

  const login = async (e, credentials) => {
    e.preventDefault();
    try {
      await account.createEmailSession(credentials.email, credentials.password);
      const currentAccount = await account.get();
      if (currentAccount) {
        setUser(currentAccount);
      }
      navigate("/");
    } catch (error) {
      console.error(error.message);
    }
  };

  const logout = async () => {
    try {
      await account.deleteSession("current");
      setUser(null);
    } catch (error) {
      console.error(error.message);
    }
  };

  const contextData = {
    user,
    register,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={contextData}>
      {loading ? <div>Loading...</div> : children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;
