import React from "react";
import { NavbarComponent } from "../Navbar/Navbar";
import { BreadCrumbs } from "../BreadCrumbs/Breadcrumbs";
import './HeaderMin.css'

type HeaderProps = {
  crumbs: { label: string; path?: string }[];
};

export const HeaderMinComponent: React.FC<HeaderProps> = ({ crumbs }) => {
  return (
    <header>
        <div className="header-content-min">
            <div className="header-top">

                {/* ЛЕВАЯ ЧАСТЬ */}
                <div className="header-left">
                    <h1>Калькулятор мощности БП</h1>
                    <NavbarComponent />
                </div>

                {/* ПРАВАЯ ЧАСТЬ */}
                <a href="/components" className="logo">
                    <img src="/logo.png" className="header-logo" />
                </a>

            </div>
            <BreadCrumbs crumbs={crumbs} />
        </div>
    </header>
  );
};