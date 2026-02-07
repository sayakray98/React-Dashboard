import React, { useContext, useState, useEffect } from "react";
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
  const { handleLogin, error, success, setUsername } =
    useContext(Logincontext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoader(true);

    setTimeout(async () => {
      await handleLogin(name, password);
      setLoader(false);
    }, 3000);
  };

  // ✅ FIXED: Read token from HASH (GitHub Pages + HashRouter)
  useEffect(() => {
    const hash = window.location.hash; // #/login?token=xxx
    const queryString = hash.split("?")[1];
    const params = new URLSearchParams(queryString);
    const token = params.get("token");

    if (token) {
      localStorage.setItem("authtoken", token);
      setUsername("Google User"); // temporary label
      navigate("/header", { replace: true });
    }
  }, [navigate, setUsername]);

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

        <p style={{ fontSize: "10px", color: "#ff4343" }}>
          {error || success}
        </p>

        <button type="submit" className="submit-btn" disabled={loader}>
          {loader ? "Logging in..." : "Login"}
        </button>

        <div className="auth-divider">
          <span>or continue with</span>
        </div>

        <div className="social-login">
          {/* ✅ FIXED: type="button" */}
          <button
            type="button"
            className="social-btn google"
            onClick={() =>
              (window.location.href =
                "https://react-dashboard-5odm.onrender.com/api/google")
            }
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google"
            />
            Continue with Google
          </button>
        </div>
      </form>

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
