import React, { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../Api/Api";

export const Logincontext = createContext();

export default function Context({ children }) {
  // ✅ Use ONE storage: localStorage
  const [username, setUsername] = useState(
    localStorage.getItem("username") || ""
  );
  const [token, setToken] = useState(
    localStorage.getItem("authtoken") || ""
  );
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const navigate = useNavigate();

  /* =========================
     Sync username to storage
  ========================== */
  useEffect(() => {
    if (username) {
      localStorage.setItem("username", username);
    } else {
      localStorage.removeItem("username");
    }
  }, [username]);

  /* =========================
     Sync token from storage
     (Google login / refresh)
  ========================== */
  useEffect(() => {
    const storedToken = localStorage.getItem("authtoken");
    if (storedToken && storedToken !== token) {
      setToken(storedToken);
    }
  }, []);

  /* =========================
     Fetch user when token set
  ========================== */
  useEffect(() => {
    if (token) {
      fetchUser();
    }
  }, [token]);

  const fetchUser = async () => {
    if (!token) return;

    try {
      const response = await api.get("/getuser", {
        headers: {
          "auth-token": token,
        },
      });

      // ✅ Set username from DB (important for Google login)
      setUsername(response.data.name);
    } catch (error) {
      console.error("Auth error:", error);

      // 🔐 Token invalid → logout safely
      localStorage.removeItem("authtoken");
      localStorage.removeItem("username");
      setToken("");
      setUsername("");
      navigate("/");
    }
  };

  /* =========================
     Normal login
  ========================== */
  const handleLogin = async (name, password) => {
    setError(null);
    setSuccess(null);

    try {
      const response = await api.post("/login", { name, password });

      if (!response.data?.authtoken) {
        throw new Error("Token not found");
      }

      // ✅ Save auth
      localStorage.setItem("authtoken", response.data.authtoken);
      localStorage.setItem("username", response.data.name);

      setToken(response.data.authtoken);
      setUsername(response.data.name);

      setSuccess("You have successfully logged in");
      navigate("/header");
    } catch (err) {
      setError("Login failed. Please check your credentials.");
      console.error("Login error:", err.response?.data || err);
    }
  };

  return (
    <Logincontext.Provider
      value={{
        handleLogin,
        error,
        success,
        username,
        setUsername,
        setToken,
      }}
    >
      {children}
    </Logincontext.Provider>
  );
}
