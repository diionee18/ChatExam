import React, { useContext, useState } from "react";
import { collection, query, where, getDocs, doc, updateDoc, serverTimestamp, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import { AuthContext } from "./context/AuthContext";
import { ChatContext } from "./context/ChatContext";

const Search = () => {
    const [username, setUsername] = useState("");
    const [user, setUser] = useState(null);
    const [error, setError] = useState(false);

    const { currentUser, setShowConv } = useContext(AuthContext);
    const { dispatch } = useContext(ChatContext);

    const handleSearch = async () => {

        if (username === currentUser.displayName) {
            return;
        }

        const q = query(collection(db, "users"), where("displayName", "==", username));

        try {
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                setUser(doc.data());
            });
        } catch (err) {
            setError(true);
        }
    };

    const handleKey = (e) => {
        e.code === "Enter" && handleSearch();
    };

    const handleSelect = async () => {
        const combinedId =
          currentUser.uid > user.uid
            ? currentUser.uid + user.uid
            : user.uid + currentUser.uid;
        try {
          const res = await getDoc(doc(db, "chats", combinedId));
    
          if (!res.exists()) {
            await setDoc(doc(db, "chats", combinedId), { messages: [] });
    
            await updateDoc(doc(db, "userChats", currentUser.uid), {
              [combinedId + ".userInfo"]: {
                uid: user.uid,
                displayName: user.displayName,
                photoURL: user.photoURL,
              },
              [combinedId + ".date"]: serverTimestamp(),
            });
    
            await updateDoc(doc(db, "userChats", user.uid), {
              [combinedId + ".userInfo"]: {
                uid: currentUser.uid,
                displayName: currentUser.displayName,
                photoURL: currentUser.photoURL,
              },
              [combinedId + ".date"]: serverTimestamp(),
            });
    
           
            setShowConv(true);
          } else {
            
            setShowConv(true);
          }
        } catch (err) {}
    
        setUser(null);
        setUsername("");
    };
    
    return (
        <div className="search">
            <div className="searchForm">
                <input
                    type="text"
                    placeholder="Sök efter en användare för att börja chatta."
                    onKeyDown={handleKey}
                    onChange={(e) => setUsername(e.target.value)}
                    value={username}
                />
            </div>
            {error && <span>Kunde inte hitta användare.</span>}
            {user && (
                <div className="userChat" onClick={handleSelect}>
                    <img src={user.photoURL} alt="" />
                    <div className="userChatInfo">
                        <span>{user.displayName}</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Search;
