import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { AuthContextProvider } from "./components/context/AuthContext.jsx";
import { ChatContextProvider } from "./components/context/ChatContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
    <AuthContextProvider>
        <ChatContextProvider>
            <React.StrictMode>
                <App />
            </React.StrictMode>
        </ChatContextProvider>
    </AuthContextProvider>
);
