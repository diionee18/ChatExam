import React, { useContext } from 'react'
import { signOut } from 'firebase/auth'
import { auth } from '../firebase'
import {AuthContext} from './context/AuthContext'

const Navbar = () => {
    const {currentUser, setShowConv} = useContext(AuthContext)
    

    const signOutUser = () => {
        signOut(auth)
        setShowConv(false)
    }

  return (
    <div className='navbar'>
        <span className="logo">Chatii Exam</span>
      <div className="user">
        <img src={currentUser.photoURL} alt="" />
        <span>{currentUser.displayName}</span>
        <button onClick={signOutUser}>Logga ut</button>
      </div>
    </div>
  )
}

export default Navbar
