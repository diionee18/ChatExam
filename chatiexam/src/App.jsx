import React, { useContext } from 'react'
import Register from './pages/Register'
import Login from './pages/Login'
import Home from './pages/Home'
import {
    BrowserRouter,
    Routes,
    Route
} from 'react-router-dom'
import { AuthContext } from './components/context/AuthContext'

export default function App() {
    const currentUser = useContext(AuthContext)
    console.log("CurrentUser",currentUser);
  return (
    <BrowserRouter>
    <Routes>
        <Route path='/'>
        <Route index element={<Home/>}/>
        <Route path='login' element={<Login/>}/>
        <Route path='register' element={<Register/>}/>
        </Route>
    </Routes>
    </BrowserRouter>
  )
}
