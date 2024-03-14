import React, { useState } from "react";
import "../style.scss";
import ProfileImg from "../img/addAvatar.png";
import FileInput from "../components/FileInput";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db, storage } from "../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
    const [errMessage, setErrMessage] = useState("");
    const [err, setErr] = useState(false);
    const [loading, setLoading] = useState(false);
    const [loadingStatus, setLoadingStatus] = useState(0);


    const navigate = useNavigate();
    
    const handleSubmit = async (e) => {
        e.preventDefault();

        const displayName = e.target[0].value;
        const email = e.target[1].value;
        const password = e.target[2].value;
        const file = e.target[3].files[0];

        try {

           

            // Validera e-post
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                setErr(true);
                setErrMessage("Felaktig e-postadress");
                return;
            }

            // Validera lösenord
            if (password.length < 6) {
                setErr(true);
                setErrMessage("Lösenordet måste vara minst 6 tecken långt");
                return;
            }

            // Validera filuppladdning
            
            const res = await createUserWithEmailAndPassword(auth, email, password);

            //Upload Image
            const storageRef = ref(storage, displayName);
            const uploadTask = uploadBytesResumable(storageRef, file);
            uploadTask.on(
                "state_changed",
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    setLoadingStatus(progress.toFixed(1));
                    setLoading(true)
                },
                (error) => {
                    setErr(true);
                    setLoading(false)
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
                            photoURL: downloadURL,
                        });
                        

                        await setDoc(doc(db, "userChats", res.user.uid), {});
                        navigate("/");
                    });
                }
            );
        } catch (err) {
            setErr(true);
            setErrMessage(err.message);
        }
    };

    const handleBlur = (e) => {
        const value = e.target.value.trim();
        if (!value) {
            e.target.classList.add('focus-error');
        } else if (value){
            e.target.classList.remove('error');
        }
    };

    const handleFocus = (e) => {
        e.target.classList.remove("focus-error");
        setErr(false)
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
                     <input
                        type="text"
                        placeholder="Användarnamn"
                        onBlur={handleBlur}
                        onFocus={handleFocus}
                    />
                    <input
                        type="email"
                        placeholder="E-post"
                        onBlur={handleBlur}
                        onFocus={handleFocus}
                    />
                    <input
                        type="password"
                        placeholder="Lösenord"
                        onBlur={handleBlur}
                        onFocus={handleFocus}
                    />
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
                    {loading && (
                        <>
                            <span className="loading">
                               Skapar konto.... {loadingStatus} %<br /> {}
                            </span>
                        </>
                    )}
                </form>
                <p>
                    Har du redan ett konto? <Link to="/login"> Logga in </Link>
                </p>
            </div>
        </div>
    );
}
