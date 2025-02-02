import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  console.log("token is this ",token)

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
      console.log("token is in useeffect ",token)
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);
  useEffect(() => {
    // Function to fetch the access token from the backend
    const getAccessToken = async () => {
      try {
        const res = await axios.get(
          "https://kanban-yuql.onrender.com/api/Register/refecth",
          {
            withCredentials: true, 
          }
        );
        console.log("Fetched token:", res.data);
        setToken(res.data); // Set the token in the state
      } catch (err) {
        console.error("Problem in getAccessToken:", err);
      }
    };

   
    getAccessToken();
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
