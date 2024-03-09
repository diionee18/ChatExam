import React from "react";
function FileInput({inputType}) {
    return (
        <div className="fileInput">
            <input required style={{ display: "none" }} type="file" id="file" />
            <label htmlFor="file">
                <img src={inputType} alt="" />
                <span>Lägg till profilbild</span>
            </label>
        </div>
    );
}

export default FileInput;
