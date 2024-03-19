import React, { useContext, useEffect, useRef } from 'react'
import { AuthContext } from './context/AuthContext';
import { ChatContext } from './context/ChatContext';

const Message = ({ message }) => {
    const { currentUser } = useContext(AuthContext);
    const { data } = useContext(ChatContext);
    const isUserSelected = data && data.user; 

    const ref = useRef();
    useEffect(() => {
        ref.current?.scrollIntoView({ behavior: "smooth" });
    }, [message]);
  
    const renderMessageInfo = () => {
        if (isUserSelected) {
            return (
                <div className="messageInfo">
                    <img
                        src={
                            message.senderId === currentUser.uid
                                ? currentUser.photoURL
                                : data.user.photoURL
                        }
                        alt=""
                    />
                </div>
            );
        } else {
            return null; 
        }
    };

    if (!message || !isUserSelected) {
        return null;
    }

    return (
        <div
            ref={ref}
            className={`message ${message.senderId === currentUser.uid && "owner"}`}
        >
            {renderMessageInfo()}
            <div className="messageContent">
                <p>{message.text}</p>
                {message.img && <img src={message.img} alt="" />}
            </div>
        </div>
    );
}

export default Message;

