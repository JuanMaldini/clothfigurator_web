import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./pages/App/App.jsx";
import "./styles.css";
import "./webVitals.js";

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </StrictMode>
);
