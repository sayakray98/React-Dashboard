import React from "react";
import { Route, Routes } from "react-router-dom";
import Header from "./Components/Headers/Header";
import Error404 from "./Pages/404Page/404page";
import Login from "./services/Login/Login";
import Signup from "./services/Signup/Signup"; // ✅ ADD THIS
import "./App.css";
import Context from "./services/Context/Context";
import Protectedroutes from "./services/Protectedroutes";

export default function App() {
  return (
    <Context>
      <Routes>
        {/* 🔐 Auth routes */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} /> {/* optional but recommended */}
        <Route path="/signup" element={<Signup />} /> {/* ✅ SIGNUP */}

        {/* 🔒 Protected routes */}
        <Route
          path="/header"
          element={
            <Protectedroutes>
              <Header />
            </Protectedroutes>
          }
        />

        {/* ❌ 404 */}
        <Route path="*" element={<Error404 />} />
      </Routes>
    </Context>
  );
}
