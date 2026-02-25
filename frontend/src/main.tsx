import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";

// INSTRUCCIÓN: Importar CSS aquí para que Tailwind funcione
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
