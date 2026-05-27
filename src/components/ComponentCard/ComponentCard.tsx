import React from "react";
import {  Button } from "react-bootstrap";
import type { Component } from "../../modules/types";
import { Link } from "react-router-dom";

import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../../store/store";
import axios from "axios";
import { fetchCartAsync } from "../../slices/cartSlice";
import { fetchPowerById } from "../../slices/powerSlice";
import { useEffect } from "react";

const API_URL = import.meta.env.VITE_API_URL;


interface Props {
    component: Component;
}   

export const ComponentCard: React.FC<Props> = ({ component }) => {
  const dispatch = useDispatch<AppDispatch>();
  const cart = useSelector((state: RootState) => state.cart);

  const isAuthenticated = useSelector(
    (state: RootState) => state.user.isAuthenticated
  );

  const power = useSelector((state: RootState) => state.power.power);

  const selected = power?.components.find(
    (c) => c.id === component.id
  );

  const quantity = selected?.quantity ?? 0;

  useEffect(() => {
  if (!isAuthenticated) return;
  if (!cart.draftId) return;

  dispatch(fetchPowerById(cart.draftId));
}, [isAuthenticated, cart.draftId]);

  const handleAdd = async () => {
  await axios.post(
    `${API_URL}/components-powers/add/${component.id}`,
    { componentId: component.id },
    { withCredentials: true }
  );

  dispatch(fetchCartAsync());

  // важно: всегда пробуем обновить power
  if (cart.draftId) {
    dispatch(fetchPowerById(cart.draftId));
  }
};

const imageSrc =
  component.image
    ? component.image.startsWith("http")
      ? component.image
      : component.image
    : import.meta.env.BASE_URL + "logo.png";
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
                    {isAuthenticated ? (<>
                        <div className="component-info-status">
                    <p className="component-status">Выбрано: {quantity}</p>
                    <Button onClick={handleAdd}>
                        Добавить
                    </Button></div></>
                    
                    ) : (
                    <p className="component-status">
                        Войдите в аккаунт чтобы выбрать
                    </p>
                    )}
                </div>
            </div>
        </div>
    );
};