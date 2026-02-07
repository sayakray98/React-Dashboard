import React, { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../Api/Api";

export const Logincontext = createContext();

export default function Context({ children }) {
  const [username, setUsername] = useState(
    sessionStorage.getItem("username") || "",
  );
  const [error, setError] = useState(null);
  const [token, setToken] = useState(sessionStorage.getItem("authtoken") || "");
  const [success, setSuccess] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (username) {
      sessionStorage.setItem("username", username);
    } else {
      sessionStorage.removeItem("username");
    }
  }, [username]);

  useEffect(() => {
    if (token) {
      fetchuserid();
    }
  }, [token]);

  const fetchuserid = async () => {
    try {
      const response = await api.get("/getuser", {
        headers: {
          "auth-token": token, // ✅ Correct way to pass headers
        },
      });

      if (response.status === 200) {
        console.log("User fetched successfully:", response.data);
      }
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  const handleLogin = async (name, password) => {
    setError("");

    try {
      const response = await api.post("/login", {
        name,
        password,
      });

      if (response.data?.authtoken) {
        localStorage.setItem("authtoken", response.data.authtoken);
        localStorage.setItem("username", response.data.name);

        setToken(response.data.authtoken);
        setUsername(response.data.name);

        setSuccess(
          <span style={{ color: "#19ff19" }}>
            <i
              className="fa-solid fa-circle-check"
              style={{ marginRight: "5px" }}
            ></i>
            You have successfully logged in
          </span>,
        );

        navigate("/header");
      } else {
        throw new Error("Token not found");
      }
    } catch (err) {
      setError(
        <span>
          <i
            className="fa-solid fa-circle-info"
            style={{ marginRight: "5px", color: "#ff4343" }}
          ></i>
          Login failed. Please check your credentials.
        </span>,
      );
      console.error("Login error:", err.response?.data || err);
    }
  };

  return (
    <Logincontext.Provider
      value={{ handleLogin, error, username, success, setUsername }}
    >
      {children}
    </Logincontext.Provider>
  );
}
