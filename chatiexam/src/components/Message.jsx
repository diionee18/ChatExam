import React, { useContext } from 'react'
import { AuthContext } from './context/AuthContext';
import { ChatContext } from './context/ChatContext';

const Message = ({message}) => {
    const { currentUser } = useContext(AuthContext);
    const { data } = useContext(ChatContext);
  return (
    <div className='message owner'>
      <div className="messageInfo">
        <img src="https://www.leisureopportunities.co.uk/images/995586_746594.jpg" alt="" />
        <span>Nyligen</span>
      </div>
      <div className="messageContent">
        <p>Hello</p>
      <img src="https://www.leisureopportunities.co.uk/images/995586_746594.jpg" alt="" />
      </div>

    </div>
  )
}

export default Message
