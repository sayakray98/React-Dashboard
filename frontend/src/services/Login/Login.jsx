import React, { useContext, useState } from "react";
import "../Login/Login.css";
import Lottie from "lottie-react";
import { useNavigate, Link } from "react-router-dom";
import { Logincontext } from "../../services/Context/Context";
import loadingAnimation from "../../assets/Animation - 1741085787432.json";

export default function Login() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [loader, setLoader] = useState(false);

  const navigate = useNavigate();
  const { handleLogin, error, success } = useContext(Logincontext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoader(true);

    setTimeout(async () => {
      await handleLogin(name, password);
      setLoader(false);
    }, 3000);
  };

  return (
    <div className="login-container">
      <h3 style={{ color: "white" }}>Dashboard</h3>

      <div className="lottiedatafile">
        {loader && (
          <Lottie
            animationData={loadingAnimation}
            loop
            autoplay
            style={{ width: "100px", height: "100px" }}
          />
        )}
      </div>

      <form onSubmit={handleSubmit} style={{ marginTop: "20px" }}>
        <div className="form-group">
          <input
            type="text"
            placeholder="Enter your username"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <p style={{ fontSize: "10px", color: "#ff4343" }}>{error || success}</p>

        <button type="submit" className="submit-btn" disabled={loader}>
          {loader ? "Logging in..." : "Login"}
        </button>
      </form>

      {/* ✅ SIGNUP LINK */}
      <div className="auth-footer">
        <p>
          Don’t have an account?{" "}
          <Link to="/signup" className="auth-link">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
