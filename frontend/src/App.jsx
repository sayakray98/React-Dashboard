import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './Components/Headers/Header';
import Error404 from './Pages/404Page/404page';
import Login from './services/Login/Login';
import './App.css';
import Context from './services/Context/Context';
import Protectedroutes from './services/Protectedroutes';
export default function App() {
  return (
    
      <Router>
        <Context>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/header" element={<Protectedroutes><Header /></Protectedroutes>} />
          <Route path="*" element={<Error404 />} />
        </Routes>
        </Context>
      </Router>
 
  );
}
