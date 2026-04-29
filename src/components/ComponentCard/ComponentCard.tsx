import React from "react";
import { Card, Button } from "react-bootstrap";
import type { Component } from "../../modules/types";
import { Link } from "react-router-dom";

interface Props {
    component: Component;
}

export const ComponentCard: React.FC<Props> = ({ component }) => {
    const imageSrc = component.image
    ? component.image.startsWith("http")
        ? component.image
        : `${component.image}`
    : "/logo.png";

    return (
        <div className="component-item">
            <div className="component-title">
                <Link to={`/components/${component.id}`}>
                    {component.title}
                </Link>
            </div>

            <div className="component-other">
                <div className="component-img">
                    <Link to={`/components/${component.id}`}>
                        <img 
                            src={imageSrc} 
                            alt={component.title}
                            className="component-logo"
                        />
                    </Link>
                </div>

                <div className="component-info">
                    <p className="component-info-text">
                        Макс. тепловыделение: {component.tdp_up} Вт.
                    </p>
                    <p className="component-info-text">
                        Базовое тепловыделение: {component.tdp_typical} Вт.
                    </p>
                    <p className="component-status">
                        Войдите в аккаунт чтобы выбрать
                    </p>
                </div>
            </div>
        </div>
    );
};