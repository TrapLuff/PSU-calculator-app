import React from "react";
import { NavbarComponent } from "../Navbar/Navbar";
import { BreadCrumbs } from "../BreadCrumbs/Breadcrumbs";
import './headerMin.css'

import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import type { RootState, AppDispatch } from "../../store/store";
import { clearUser } from "../../slices/userSlice";
import { clearFilters } from "../../slices/ComponentsListSlice";
import { clearCart } from "../../slices/cartSlice";
import { clearPowers } from "../../slices/powerSlice";
import axios from "axios";
import { Link } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

type HeaderProps = {
  crumbs: { label: string; path?: string }[];
};

export const HeaderMinComponent: React.FC<HeaderProps> = ({ crumbs }) => {

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

  await axios.post(`${API_URL}/users/logout`, {}, { withCredentials: true });

  //console.log("LOGOUT RESPONSE DONE");

  dispatch(clearUser());
  dispatch(clearFilters());
  dispatch(clearCart());
  dispatch(clearPowers());
};

  return (
    <div className="header-content">
      <div className="header-up">
        <div className="header-left">
          <h1>Калькулятор мощности БП</h1>
          <NavbarComponent />
          <BreadCrumbs crumbs={crumbs} />
        </div>


        <div className="header-right">
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
      <Link to="/components" className="logo">
          <img src={import.meta.env.BASE_URL + "/logo.png"} className="header-logo" />
        </Link>
      </div>
        
      </div>
    </div>
  );
};