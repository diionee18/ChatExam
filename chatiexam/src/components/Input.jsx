import React, { useContext, useState } from "react";
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
    const [file, setFile] = useState(null);
    const [errMessage, setErrMessage] = useState("");
    const [filePreview, setFilePreview] = useState(null);
    const { currentUser } = useContext(AuthContext);
    const { data } = useContext(ChatContext);

    const handleSend = async () => {
        if (text.trim() === "" && !img) {
            return;
        }

        let messageData = {
            id: uuid(),
            senderId: currentUser.uid,
            date: Timestamp.now(),
        };

        if (text.trim() !== "") {
            messageData.text = text;
        }

        if (img) {
            const storageRef = ref(storage, uuid());
            const uploadTask = uploadBytesResumable(storageRef, img);

            try {
                const snapshot = await uploadTask;
                const downloadURL = await getDownloadURL(snapshot.ref);
                messageData.img = downloadURL;
            } catch (error) {
                setErr(true);
                setErrMessage(error.message);
                return;
            }
        }

        try {
            await updateDoc(doc(db, "chats", data.chatId), {
                messages: arrayUnion(messageData),
            });

            const updateData = {
                [data.chatId + ".lastMessage"]: {
                    text: messageData.text || "Bild",
                },
                [data.chatId + ".date"]: serverTimestamp(),
            };

            await Promise.all([
                updateDoc(doc(db, "userChats", currentUser.uid), updateData),
                updateDoc(doc(db, "userChats", data.user.uid), updateData),
            ]);
        } catch (error) {
            console.error("Error sending message:", error);
        }

        setText("");
        setImg(null);
        setFilePreview(null);
    };

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile) {
            if (selectedFile.type.startsWith("image/")) {
                setFile(selectedFile);
                setFilePreview(URL.createObjectURL(selectedFile));
                setErr(false); // Återställ felmeddelandet om en giltig fil har valts
            } else {
                setFile(null); // Återställ fil och förhandsvisning om en ogiltig fil har valts
                setFilePreview(null);
                setErr(true);
                setErrMessage("Felaktig filtyp. Vänligen välj en bildfil.");
            }
        } else {
            setErr(false);
            setErrMessage("");
        }
    };

    const removeFile = () =>{
        setImg(null);
        setFilePreview(null);
    }

    return (
        <div className="input">
            <input
                type="text"
                placeholder="Skriv ett meddelande"
                onChange={(e) => setText(e.target.value)}
                value={text}
            />
            {filePreview && (
                <div className="prevDiv">
                    <span onClick={removeFile} className="closePrev">&#88;</span>

                    <img
                        src={filePreview} 
                        alt="Bildförhandsvisning"
                        
                    />
                </div>
            )}
            {err && <span>{errMessage}</span>}

            <div className="send">
                <label htmlFor="file">
                    <img src={imgIcon} alt="" />
                </label>

                <input
                    style={{ display: "none" }}
                    type="file"
                    id="file"
                    accept="image/png, image/gif, image/jpeg"
                    onChange={handleFileChange}
                />
                <button onClick={handleSend}>Skicka</button>
            </div>
        </div>
    );
};

export default Input;
