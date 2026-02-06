import React, { useContext, useState } from 'react';
import '../Login/Login.css';

import Lottie from "lottie-react";
import { useNavigate } from "react-router-dom";
import { Logincontext } from '../../services/Context/Context';
import loadingAnimation from '../../assets/Animation - 1741085787432.json'; // Ensure this is a valid .lottie file
import Popup from '../../popup/Popup';

export default function Login() {
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [loader, setLoader] = useState(false);
    const [btntap, setBtntap] = useState(false)
    const navigate = useNavigate();

    const { handleLogin, error, success } = useContext(Logincontext);

   
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoader(true);

        // Show loading animation for 5 seconds before login
        setTimeout(async () => {
            await handleLogin(e, name, password);
            setLoader(false);
        }, 5000);
    };

    return (

        <>

           

        
            <div className="login-container">
                <h3 style={{ color: 'white' }}>Dashboard</h3>
                <div className="lottiedatafile">
                    {loader && <Lottie animationData={loadingAnimation} loop autoplay style={{ width: '100px', height: '100px' }} />}
                </div>


                <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>


                    <div className="form-group">
                        <input
                            type="text"
                            id="username"
                            placeholder="Enter your username"
                            onChange={(e) => setName(e.target.value)}
                            value={name}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <input
                            type="password"
                            id="password"
                            placeholder="Enter your password"
                            onChange={(e) => setPassword(e.target.value)}
                            value={password}
                            required
                        />
                    </div>

                    <p style={{ fontSize: '10px', color: '#ff4343' }}>
                        {error || success}
                    </p>

                    <button type="submit" className="submit-btn" disabled={loader}>
                        {loader ? "Logging in..." : "Login"}
                    </button>
                </form>
            </div>

        </>
    );
}
