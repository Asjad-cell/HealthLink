import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes";
import { AuthProvider } from "./contexts/AuthContext";
import { Toaster } from "sonner";
import "./index.css";
import './chatbot.css' 

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes  />
        <Toaster />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
