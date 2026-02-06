import React, { useContext, useState } from 'react'
import './Header.css';
import Home from './Homepage/Home';
import User from '../../assets/user.jpg';
import { Link } from 'react-router-dom';
import { Logincontext } from '../../services/Context/Context';
import Popup from '../../popup/Popup';

export default function Header() {



    const { username } = useContext(Logincontext)
    const [bar, setBar] = useState(false);
    const [btntap, setBtntap] = useState(false);
    const [user, setUser] = useState(false)
    const [mode, setMode] = useState(false)


    const onmodechange = () => {
        setMode((mode) => {

            if (!mode) {
                document.documentElement.classList.add('dark-mode');
                document.body.classList.add('dark-mode');
            } else {
                document.documentElement.classList.remove('dark-mode');
                document.body.classList.remove('dark-mode');
            }

            return !mode

        })
    }
    const onhandletap = () => {
        setBtntap((prev) => !prev);


    };


    const onHandleClickBar = () => {
        setBar((bard) => !bard);
        setUser((user) => !user)
        const togglebar = document.querySelectorAll('.togglebar');
        togglebar.forEach((e) => {
            e.style.transition = '0.2s';
        })
        const navfirstElements = document.querySelectorAll('.navfirst'); // Select all elements

        navfirstElements.forEach((e) => {
            if (bar) { // Assuming 'bar' is a boolean
                e.style.width = "16.12%";
            } else {
                e.style.width = "7.68%";
            }
        });




    }

    const menus = [

        {
            id: 1, name: "Overview", color: "#1285d9", icon: "fa-solid fa-info"
        },
        {
            id: 2, name: "Products", color: "#c4af1a", icon: "fa-solid fa-box-archive"
        },
        {
            id: 3, name: "Users", color: "#b1a6a6", icon: "fa-solid fa-user"
        },
        {
            id: 4, name: "Sales", color: "#21af73", icon: "fa-brands fa-shopify"
        },
        {
            id: 5, name: "Orders", color: "#ce8219", icon: "fa-solid fa-cart-arrow-down"
        },
        {
            id: 6, name: "Analytics", color: "#2b3fc6", icon: "fa-solid fa-chart-simple"
        },
        {
            id: 7, name: "Settings", color: "#ffffff", icon: "fa-solid fa-gears"
        },
    ]



    return (

        <>



            <header>
                <div className="row">
                    <div className="col-lg-12">
                        <div className="row">
                            {/* Sidebar Navbar */}
                            <div className={`${bar ? "col-lg-1 col-1" : "col-lg-2 col-1"} p-0 togglebar linetag`}>
                                <nav className="navbar navbar-expand-lg navfirst" style={{ padding: "20px" }}>
                                    <div className="container-fluid">
                                        <i
                                            className={`${!bar ? "fa-solid fa-bars-staggered" : "fa-solid fa-xmark"} barbar`}
                                            onClick={onHandleClickBar}
                                        ></i>

                                    </div>
                                </nav>
                                {/* Sidebar Offcanvas Menu */}
                                <div className="offcanvas offcanvas-start" tabIndex="-1" id="offcanvasNavbar" aria-labelledby="offcanvasNavbarLabel" data-bs-theme={!mode ? "dark" : "light"}
                                    style={{ backgroundColor: !mode ? "rgb(42, 52, 71)" : "#fff", color: !mode ? "#fff" : "#000" }}>
                                    <div className="offcanvas-header">
                                        <h5 className="offcanvas-title" id="offcanvasNavbarLabel">Dashboard</h5>
                                        <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                                    </div>
                                    <div className="offcanvas-body">
                                        <div className="navbarfirstallmenusnew">
                                            <ul className="menuslists">
                                                {menus.map((m) => (
                                                    <li key={m.id}>
                                                        <Link to="/" style={{ color: m.color }}>
                                                            <i className={m.icon}></i> &nbsp; {bar ? "..." : m.name}
                                                        </Link>
                                                    </li>
                                                ))}
                                            </ul>

                                            {/* User Sign-In Section */}
                                            <div className="usersigninmain">
                                                <img src={User} alt="" width={35} style={{ borderRadius: "50px" }} />
                                                <div className="usersignindetails ps-3">
                                                    <h5 style={{ fontSize: "16px", padding: "0", margin: "0" }}>{username}</h5>
                                                    <span style={{ fontSize: "11px", marginTop: "-20px" }}>Developer</span>
                                                </div>
                                                <button className="btnnew" onClick={onhandletap}>
                                                    <i className="fa-solid fa-power-off"></i>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="navbarfirstallmenus">

                                    <ul className='menuslists'>
                                        {menus.map((m) => (
                                            <li key={m.id}><Link to="/" style={{ color: m.color }}><i className={m.icon}></i> &nbsp; {bar ? "..." : m.name}</Link></li>
                                        ))}
                                    </ul>


                                    <div className={`${user ? `usersigninmain` : `usersignin`}`}>
                                        <img src={User} alt="" width={35} style={{ 'borderRadius': '50px' }} />
                                        <div className="usersignindetails ps-3">
                                            <h5 style={{
                                                'font-size': '16px', 'padding': '0',
                                                'margin': '0'
                                            }}>{username}</h5>
                                            <span style={{ 'font-size': '11px', 'margin-top': '-20px' }}>Devoloper</span>
                                        </div>
                                        <button className='btnnew ' onClick={onhandletap}><i className="fa-solid fa-power-off"></i></button>
                                    </div>


                                </div>


                            </div>

                            {/* Main Content Navbar */}
                            <div className={`${bar ? "col-lg-11 col-11" : "col-lg-10 col-10"} p-0 togglebar`}>
                                <nav className="navbar navbar-expand-lg navsecond">
                                    <button
                                        className="navbar-toggler"
                                        type="button"
                                        data-bs-toggle="offcanvas"
                                        data-bs-target="#offcanvasNavbar"
                                        aria-controls="offcanvasNavbar"
                                        aria-label="Toggle navigation"

                                    >
                                        <span className="toggler-icon top-bar"></span>
                                        <span className="toggler-icon middle-bar"></span>
                                        <span className="toggler-icon bottom-bar"></span>

                                    </button>

                                    <div className="container-fluid">
                                        <Link className="navbar-brand" to="/header" style={{'fontFamily': '"Lato", sans-serif','fontWeight':'900'}}>Company</Link>
                                        <span onClick={onmodechange}>
                                            <i className={`${!mode ? "lni lni-moon-half-right-5" : "lni lni-sun-1"}`}></i>
                                        </span>
                                        <button className='btnnew btnnewdata' onClick={onhandletap}><i className="fa-solid fa-power-off"></i></button>
                                    </div>
                                </nav>

                                {/* Home Content */}
                                <div className="homedetails mt-5">
                                    <Home />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Popup Modal */}
                <div className={`popupel ${btntap ? "show" : ""}`}>
                    {btntap && (
                        <>
                            <div onClick={onhandletap}></div>
                            <Popup onClose={onhandletap} />
                        </>
                    )}
                </div>
            </header>

        </>
    )
}
