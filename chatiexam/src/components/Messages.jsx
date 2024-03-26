import React, { useContext, useEffect, useState } from "react";
import Message from "./Message";
import { ChatContext } from "./context/ChatContext";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";

const Messages = () => {
    const [messages, setMessages] = useState([]);
    const { data } = useContext(ChatContext);

    useEffect(() => {
        const unSub = onSnapshot(doc(db, "chats", data.chatId), (doc) => {
            doc.exists() && setMessages(doc.data().messages);
        });

        return () => {
            unSub();
        };
    }, [data.chatId]);

    if (!data || !data.user) {
        return (
            <div className="messages">
                <p>Välj en användare för att börja meddela</p>
            </div>
        );
    }

    return (
        <div className="messages">
            {messages.map((m) => (
                <Message message={m} key={m.id} />
            ))}
        </div>
    );
};

export default Messages;
