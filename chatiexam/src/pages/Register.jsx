import React, { useState } from "react";
import "../style.scss";
import ProfileImg from "../img/addAvatar.png";
import FileInput from "../components/FileInput";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db, storage } from "../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function Register() {
    const [err, setErr] = useState(false);
    const [errMessage, setErrMessage] = useState("");
    const navigate = useNavigate()


    const handleSubmit = async (e) => {
        e.preventDefault();

        const displayName = e.target[0].value;
        const email = e.target[1].value;
        const password = e.target[2].value;
        const file = e.target[3].files[0];

        try {
            const res = await createUserWithEmailAndPassword(auth, email, password);

            //Upload Image
            const storageRef = ref(storage, displayName);
            const uploadTask = uploadBytesResumable(storageRef, file);
            uploadTask.on(
                "state_changed",
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log("Upload is " + progress + "% done");
                    switch (snapshot.state) {
                        case "paused":
                            console.log("Upload is paused");
                            break;
                        case "running":
                            console.log("Upload is running");
                            break;
                    }
                },
                (error) => {
                    setErr(true);
                    setErrMessage(error.message);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
                        await updateProfile(res.user, {
                            displayName,
                            photoURL: downloadURL,
                        });
                        await setDoc(doc(db, "users", res.user.uid), {
                            uid: res.user.uid,
                            displayName,
                            email,
                            photoURL: downloadURL
                        });

                        await setDoc(doc(db, "userChats", res.user.uid),{})
                        navigate("/")
                    });
                }
            );
        } catch (err) {
            setErr(true);
            setErrMessage(err.message);
        }
    };
    const closeError = () => {
        setErr(false);
    };

    return (
        <div className="form-container">
            <div className="form-wrapper">
                <span className="logo">Chatii Exam</span>
                <span className="title">Registrering</span>
                <form onSubmit={handleSubmit}>
                    <input type="text" placeholder="Användarnamn" />
                    <input type="email" placeholder="E-post" />
                    <input type="password" placeholder="Lösenord" />
                    <FileInput inputType={ProfileImg} />
                    <button>Skapa konto</button>
                    {err && (
                        <>
                            <span className="errMessage">
                                Opps... Något gick fel. <br /> {errMessage}
                            </span>
                            <span onClick={() => closeError()} className="closeErr"></span>
                        </>
                    )}
                </form>
                <p>Har du redan ett konto? Logga in</p>
            </div>
        </div>
    );
}
