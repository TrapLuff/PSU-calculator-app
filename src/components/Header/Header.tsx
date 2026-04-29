import React from "react";
import { NavbarComponent } from "../Navbar/Navbar";
import { BreadCrumbs } from "../BreadCrumbs/Breadcrumbs";
import './header.css'

type HeaderProps = {
  crumbs: { label: string; path?: string }[];
};

export const HeaderComponent: React.FC<HeaderProps> = ({ crumbs }) => {
  return (
    <div className="header-content">
      <div className="header-up">
        <h1>Калькулятор мощности БП</h1>

        <NavbarComponent />

        <BreadCrumbs crumbs={crumbs} />

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