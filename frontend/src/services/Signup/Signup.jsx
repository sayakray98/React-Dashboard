import React, { useState } from "react";
import { TextField, Button, Alert } from "@mui/material";
import API from "../Api/Api";
import "./Signup.css";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();

  // After successful signup

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    cnfpassword: "",
    phone: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (formData.password !== formData.cnfpassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const res = await API.post("/createuser", formData);

      // Save JWT token
      localStorage.setItem("token", res.data.authtoken);

      setSuccess("Account created successfully!");
      console.log("JWT:", res.data.authtoken);

      // Optional: redirect
      // navigate("/login");

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else if (err.response?.data?.errors) {
        setError(err.response.data.errors[0].msg);
      } else {
        setError("Something went wrong");
      }
    }
  };

  return (
    <div className="signup-wrapper">
      <div className="signup-card">
        <h2 className="signup-title">Create Account</h2>
        <p className="signup-subtitle">Start your journey with us</p>

        {error && <Alert severity="error">{error}</Alert>}
        {success && <Alert severity="success">{success}</Alert>}

        <form className="signup-form" onSubmit={handleSubmit}>
          <TextField
            label="Full Name"
            name="name"
            fullWidth
            required
            value={formData.name}
            onChange={handleChange}
          />

          <TextField
            label="Email Address"
            name="email"
            type="email"
            fullWidth
            required
            value={formData.email}
            onChange={handleChange}
          />

          <TextField
            label="Phone"
            name="phone"
            fullWidth
            value={formData.phone}
            onChange={handleChange}
          />

          <TextField
            label="Password"
            name="password"
            type="password"
            fullWidth
            required
            value={formData.password}
            onChange={handleChange}
          />

          <TextField
            label="Confirm Password"
            name="cnfpassword"
            type="password"
            fullWidth
            required
            value={formData.cnfpassword}
            onChange={handleChange}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            className="signup-button"
          >
            Sign Up
          </Button>
        </form>

        <div className="signup-footer">
          Already have an account? <span>Login</span>
        </div>
      </div>
    </div>
  );
};

export default Signup;
