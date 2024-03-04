import React from "react";
import '../style.scss';
import ProfileImg from '../img/addAvatar.png'
import FileInput from "../components/FileInput";


export default function Register() {
    return (
        <div className="form-container">
            <div className="form-wrapper">
                <span className="logo">Chatii Exam</span>
                <span className="title">Registrering</span>
                <form action="">
                    <input type="text" placeholder="Användarnamn" />
                    <input type="email" placeholder="E-post" />
                    <input type="password" placeholder="Lösenord"/>
                    <FileInput inputType={ProfileImg}/>
                    <button>Skapa konto</button>
                </form>
                <p>Har du redan ett konto? Logga in</p>
            </div>
        </div>
    );
}
