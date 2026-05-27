import { ROUTES, ROUTE_LABELS } from "../routes"
import React, { useEffect, useState } from "react";
import type { Component } from "../modules/types";
import { useParams } from "react-router-dom";
import { fetchComponentById } from "../modules/componentsApi";
import { HeaderMinComponent } from "../components/HeaderMin/HeaderMin";


export const ComponentPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [component, setComponent] = useState<Component | null>(null);

    useEffect(() => {
        if (id) {
            fetchComponentById(Number(id)).then(c => c && setComponent(c));
        }
    }, [id]);

    if (!component) return <div>Загрузка...</div>;

    const imageSrc =
        component.image
            ? component.image.startsWith("http")
            ? component.image
            : component.image
    : import.meta.env.BASE_URL + "logo.png";

    const videoSrc =
        component.video
            ? component.video.startsWith("http")
            ? component.video
            : component.video
    : import.meta.env.BASE_URL + "video.mp4";   
    
    return (
        <div className="portrait-mode">
            {/* Видео фон */}
            {videoSrc && (
                <video autoPlay muted loop playsInline className="background-video">
                    <source src={videoSrc} type="video/mp4" />
                </video>
            )}

            <HeaderMinComponent crumbs={[{ label: ROUTE_LABELS.COMPONENT_DETAIL, path: ROUTES.COMPONENTS}, { label: component.title }]} />

            {/* Контент */}
            <div className="component-all">

                <p className="component-other-text">
                    {component.description}
                </p>

                <p className="component-other-text">
                    {component.type}
                </p>

                <br />

                <span className="component-other-text-gray">
                    Макс. тепловыделение: {component.tdp_up} Вт. ·
                </span>

                <span className="component-other-text-gray">
                    Баз. тепловыделение: {component.tdp_typical} Вт.
                </span>

                <div className="component-about">
                    <div className="component-img">
                        <img 
                            src={imageSrc}
                            alt={component.title}
                            className="component-logo-mini"
                        />
                    </div>

                    <div className="component-title">
                        <p className="component-info-text">
                            {component.title}
                        </p>

                        <p className="component-info-text-status">
                            Войдите в аккаунт чтобы выбрать
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};