import React from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../store/store";
import { deleteComponentFromPower, updateComponentQuantity } from "../../slices/powerSlice";

interface Props {
  component: {
    id: number;
    title: string;
    image: string;
    quantity: number;
    tdp_up: number;
    tdp_typical: number;
    isActive: boolean;
  };
}

export const ComponentCardTable: React.FC<Props> = ({ component }) => {
  const dispatch = useDispatch<AppDispatch>();

  const imageSrc =
  component.image
    ? component.image.startsWith("http")
      ? component.image
      : component.image
    : import.meta.env.BASE_URL + "logo.png";

  const handleDelete = () => {
    dispatch(deleteComponentFromPower(component.id));
  };



  return (
    <tr>
      <td>  
        <Link
          to={`/components/${component.id}`}
          className="psu-name-link"
        >
          <img
            src={imageSrc}
            alt={component.title}
            className="psu-img"
          />

          {component.title}
        </Link>
      </td>

      <td>
        {component.tdp_up} Вт
      </td>

      <td>
        {component.tdp_typical} Вт
      </td>

      <td>
        <div>
          <button className="quantity-controls"
              onClick={() => {
              if (component.quantity <= 1) {
                dispatch(deleteComponentFromPower(component.id));
                return;
              }

              dispatch(
                updateComponentQuantity({
                  componentId: component.id,
                  quantity: component.quantity - 1,
                })
              );
            }}
          >
            -
          </button>

          <span>{component.quantity}</span>

          <button className="quantity-controls"
            onClick={() => {
              dispatch(
                updateComponentQuantity({
                  componentId: component.id,
                  quantity: component.quantity + 1,
                })
              );
            }}
          >
            +
          </button>
        </div>
      </td>

      <td>
        <button
            onClick={handleDelete}        >
            Удалить
        </button>
        </td>
    </tr>
  );
};