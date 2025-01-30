import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [token, setToken] = useState(null);

  useEffect(() => {
    const getToken = async () => {
      try {
        const res = await axios.get(
          "https://kanban-yuql.onrender.com/api/Register/refecth",
          { withCredentials: true }
        );

        if (res.data && typeof res.data === "string") {
          setToken(res.data); // Ensure only the token is stored
        } else {
          console.error("Unexpected response format:", res.data);
        }
      } catch (err) {
        if (err.response?.status === 401) {
          console.error("Unauthorized: Token is missing or invalid");
        } else {
          console.error("Error fetching token:", err);
        }
      }
    };

    getToken();
  }, []);

  return (
    <UserContext.Provider value={{ token, setToken }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
