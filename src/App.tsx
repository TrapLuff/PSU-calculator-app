import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useDispatch } from "react-redux";

import { ComponentsList } from "./pages/ComponentsList";
import { ComponentPage } from "./pages/ComponentPage";
import { HomePage } from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import { PowerPage } from "./pages/PowerPage";
import { PowersList } from "./pages/PowersList";

import type { AppDispatch } from "./store/store";
import { setUser, clearUser } from "./slices/userSlice";
import { fetchCartAsync } from "./slices/cartSlice";


import "./style.css";

export const App: React.FC = () => {

    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        dispatch(fetchCartAsync());

        const saved = localStorage.getItem("user");

        if (saved) {
            try {
            dispatch(setUser(JSON.parse(saved)));
            } catch {
            dispatch(clearUser());
            }
        }
        }, []);

    return (
        <Router>
            <div className="container mt-3">
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/components" element={<ComponentsList />} />
                    <Route path="/components/:id" element={<ComponentPage />} />

                    <Route path="/powers" element={<PowersList />} />
                    <Route path="/powers/:id" element={<PowerPage />} />

                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                </Routes>
            </div>
        </Router>
    );
};