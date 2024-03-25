import React, { useContext, useState } from "react";
import { AuthContext } from "./context/AuthContext";

function FileInput({ inputType }) {
    const { disable, setDisable } = useContext(AuthContext);
    const [notEmpty, setNotEmpty] = useState(false)

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file && file.type.startsWith("image/")) {
            setDisable(false)
            setNotEmpty(true)
        } else {
            setNotEmpty(false)
            setDisable(true)
        }
    };

    return (
        <div className="fileInput">
            <input
                required
                style={{ display: "none" }}
                type="file"
                id="file"
                onChange={handleFileChange}
            />
            <label htmlFor="file">
                <img src={inputType} alt="" />
                <span>Lägg till profilbild {notEmpty && <span> &#10003; </span>}</span>
            </label>
            {disable && <span>Felaktig filtyp vald. Vänligen välj en bildfil.</span>}
        </div>
    );
}

export default FileInput;
