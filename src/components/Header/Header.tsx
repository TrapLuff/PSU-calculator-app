import React from "react";
import { NavbarComponent } from "../Navbar/Navbar";
import { BreadCrumbs } from "../BreadCrumbs/Breadcrumbs";
import './header.css'

import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import type { RootState, AppDispatch } from "../../store/store";
import { clearUser } from "../../slices/userSlice";
import { clearFilters } from "../../slices/ComponentsListSlice";
import { clearCart } from "../../slices/cartSlice";
import { clearPowers } from "../../slices/powerSlice";
import axios from "axios";

type HeaderProps = {
  crumbs: { label: string; path?: string }[];
};

export const HeaderComponent: React.FC<HeaderProps> = ({ crumbs }) => {

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const isAuthenticated = useSelector(
    (state: RootState) => state.user.isAuthenticated
  );

  const username = useSelector(
    (state: RootState) => state.user.login // можно либо логин или фулимя
  );

 const handleLogout = async () => {
  //console.log("LOGOUT CLICKED");

  await axios.post("/api/users/logout", {}, { withCredentials: true });

  //console.log("LOGOUT RESPONSE DONE");

  dispatch(clearUser());
  dispatch(clearFilters());
  dispatch(clearCart());
  dispatch(clearPowers());
};

  return (
    <div className="header-content">
      <div className="header-up">
        <h1>Калькулятор мощности БП</h1>

        <NavbarComponent />

        <BreadCrumbs crumbs={crumbs} />

        <div className="auth-buttons">
        {!isAuthenticated ? (
          <button
            onClick={() => navigate("/login")}
            className="auth-btn"
          >
            Войти
          </button>
        ) : (
           <>
           <span className="username">
          {username}
          </span>

          <button
            onClick={handleLogout}
            className="auth-btn"
          >
            Выйти
          </button></>
          
        )}
      </div>

        <a href="/components" className="logo">
          <img src="/logo.png" className="header-logo" />
        </a>
      </div>

      <img src="/header-background.png" className="header-background" />

      <h3>
        Добро пожаловать в калькулятор мощности блока питания.
        Перейдите к списку компонентов, чтобы собрать конфигурацию системы.
      </h3>
    </div>
  );
};