import React, { useContext } from 'react'
import { Logincontext } from './Context/Context'
import { Navigate } from 'react-router-dom'

export default function Protectedroutes({children}) {

    const { username } = useContext(Logincontext)
    const isAuthenticated = username || sessionStorage.getItem("username");
    if (!isAuthenticated) {
        return <Navigate to='/' />
    }
    return children
}
