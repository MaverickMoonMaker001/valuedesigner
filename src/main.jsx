import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App.jsx";
import ThinkingPage from "./pages/ThinkingPage.jsx";
import ArticlePage from "./pages/ArticlePage.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/thinking" element={<ThinkingPage />} />
        <Route path="/thinking/:slug" element={<ArticlePage />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
