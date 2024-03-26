import React, { useContext } from 'react'
import Sidebar from '../components/Sidebar'
import Chat from '../components/Chat'
import { AuthContext } from '../components/context/AuthContext';

export default function Home() {
    const { currentUser, showConv } = useContext(AuthContext);
  return (
    <div className='home'>
      <div className="container">
        <Sidebar/>
        {showConv && 
        <Chat/>
        }
      </div>
    </div>
  )
}
