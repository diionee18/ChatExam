import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { auth } from "../firebase";

export default function Login() {
    const [err, setErr] = useState(false);
    const [errMessage, setErrMessage] = useState("");
    const navigate = useNavigate();
    const [emailError, setEmailError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const email = e.target[0].value;
        const password = e.target[1].value;

        if (emailError && passwordError && setErr === true) {
            setEmailError(false);
            setPasswordError(false);
            setErr(false);
        }

        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate("/");
        } catch (err) {
            setErr(true);
            setErrMessage(err.message);
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setEmailError(true);
        } else {
            setEmailError(false);
        }

        if (password.length < 6) {
            setPasswordError(true);
            return;
        } else {
            setPasswordError(false);
        }
    };

    return (
        <div className="form-container">
            <div className="form-wrapper">
                <span className="logo">Chatii Exam</span>
                <span className="title">Logga in</span>
                <form onSubmit={handleSubmit}>
                    <input
                        type="email"
                        placeholder="E-post"
                        className={emailError ? "error" : ""}
                    />
                    {emailError && <span className="error-message">Felaktig e-postadress</span>}

                    <input
                        type="password"
                        placeholder="Lösenord"
                        className={passwordError ? "error" : ""}
                    />
                    {passwordError && (
                        <span className="error-message">
                            Lösenordet måste vara minst 6 tecken långt
                        </span>
                    )}

                    {err && (
                        <>
                            <span className="errMessage">
                                Opps... Något gick fel. <br /> {errMessage}
                            </span>
                        </>
                    )}
                    <button>Logga in</button>
                </form>
                <p>
                    Inget konto? <Link to="/register"> Skapa ett! </Link>
                </p>
            </div>
        </div>
    );
}
