import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ComponentsList } from "./pages/ComponentsList";
import { ComponentPage } from "./pages/ComponentPage";
import { HomePage } from "./pages/HomePage";
import './style.css'


export const App: React.FC = () => (
    <Router>
        <div className="container mt-3">
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/components" element={<ComponentsList />} />
                <Route path="/components/:id" element={<ComponentPage />} />
            </Routes>
        </div>
    </Router>
);