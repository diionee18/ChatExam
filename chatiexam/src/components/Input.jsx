import React, { useContext, useState } from "react";
import FileInput from "./FileInput";
import imgIcon from "../img/img.png";
import attach from "../img/attach.png";
import { AuthContext } from "./context/AuthContext";
import { ChatContext } from "./context/ChatContext";
import { Timestamp, arrayUnion, doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { db, storage } from "../firebase";
import { v4 as uuid } from "uuid";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";



const Input = () => {
    const [text, setText] = useState("");
    const [img, setImg] = useState(null);
    const [err, setErr] = useState(false);
    const [errMessage, setErrMessage] = useState("");

    const { currentUser } = useContext(AuthContext);
    const { data } = useContext(ChatContext);

    const handleSend = async () => {
        if (img) {
            const storageRef = ref(storage, uuid());
            const uploadTask = uploadBytesResumable(storageRef, img);

            uploadTask.on(
                (error) => {
                    setErr(true);
                    setErrMessage(error.message);                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
                        await updateDoc(doc(db, "chats", data.chatId), {
                            messages: arrayUnion({
                                id: uuid(),
                                text,
                                senderId: currentUser.uid,
                                date: Timestamp.now(),
                                img: downloadURL,
                            }),
                        });
                    });
                }
            );
        } else {
            await updateDoc(doc(db, "chats", data.chatId), {
                messages: arrayUnion({
                    id: uuid(),
                    text,
                    senderId: currentUser.uid,
                    date: Timestamp.now(),
                }),
            });
        }

        await updateDoc(doc(db, "userChats", currentUser.uid), {
            [data.chatId + ".lastMessage"]: {
                text,
            },
            [data.chatId + ".date"]: serverTimestamp(),
        });

        await updateDoc(doc(db, "userChats", data.user.uid), {
            [data.chatId + ".lastMessage"]: {
                text,
            },
            [data.chatId + ".date"]: serverTimestamp(),
        });

        setText("");
        setImg(null);
    };


   
    return (
        <div className="input">
            <input
                type="text"
                placeholder="Skriv ett meddelande"
                onChange={(e) => setText(e.target.value)}
                value={text}
            />
            <div className="send">
                <img src={attach} alt="" />

                <input
                    style={{ display: "none" }}
                    type="file"
                    id="file"
                    onChange={(e) => setImg(e.target.files[0])}
                />
                <label htmlFor="file">
                    <img src={imgIcon} alt="" />
                </label>
                {err && <span>{errMessage}</span>}
                <button onClick={handleSend}>Skicka</button>
            </div>
        </div>
    );
};

export default Input;
