import React from "react";
import FileInput from "./FileInput";
import img from "../img/img.png";
import attach from "../img/attach.png";

const input = () => {
    return (
        <div className="input">
            <input type="text" placeholder="Skriv ett meddelande" />
            <div className="send">
                <img src={attach} alt="" />

                <input style={{ display: "none" }} type="file" id="file" />
                <label htmlFor="file">
                    <img src={img} alt="" />
                </label>
                <button>Skicka</button>
            </div>
        </div>
    );
};

export default input;
