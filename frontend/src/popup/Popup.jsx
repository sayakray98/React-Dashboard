import React, { useContext, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Logincontext } from '../services/Context/Context';

export default function Popup({ onClose  }) {
    const {setUsername} = useContext(Logincontext)
    const navigate = useNavigate();
    const [logout, setLogout] = useState(false)
    const onHandleLogout = () => {
        
        setLogout(true);
        setTimeout(() => {
            setUsername(null);
            sessionStorage.removeItem("username");
            navigate('/'); // Correct usage of useNavigate
        }, 2000);
    };
    return (
        <section className="popupbox">
            <div className="container">
                <div className="row">
                    <div className="col-lg-3 col-md-3 m-auto mt-5">
                        <div className="popmainboxcol">
                            <i className="fa-solid fa-power-off"></i>
                            <h6>Logout Account</h6>
                            <p>Are you sure you want to log out?</p>

                            <button className="fbtn" onClick={onClose} style={{ 'backgroundColor': 'red', 'color': 'white' }}>Cancel</button> &nbsp;
                            <button className="lbtn" style={{ 'backgroundColor': 'lightgreen', 'color': 'white' }} onClick={onHandleLogout}>{logout ? 'Logging out...' : 'Yes Logout'}</button>
                        </div>
                    </div>
                </div>
            </div>
        </section>

    
    );

   
}
