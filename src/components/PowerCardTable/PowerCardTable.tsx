import React from "react";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../store/store";
import { updatePowerStatus } from "../../slices/powerSlice";
import { Link } from "react-router-dom";

interface Props {
  power: {
    powerId: number;
    status: string;
    efficiency: number;
    recommendedPower: number;
    formedAt?: string | null;
  };

  isModerator: boolean;

  onStatusChange: (id: number, status: "COMPLETED" | "DECLINED") => void;
}

export const PowerRow: React.FC<Props> = ({
  power,
  isModerator,
  onStatusChange,
}) => {
  return (
    <tr>
      <td>
        <Link to={`/powers/${power.powerId}`}>
          #{power.powerId}
        </Link>
      </td>

      <td>{power.status}</td>

      <td>
        {power.formedAt
          ? new Date(power.formedAt).toLocaleDateString()
          : "—"}
      </td>

      <td>{power.efficiency}%</td>
      <td>{power.recommendedPower} Вт</td>

      <td>
        {isModerator && power.status === "FORMED" && (
          <>
            <button onClick={() => onStatusChange(power.powerId, "COMPLETED")}>
              Завершить
            </button>

            <button onClick={() => onStatusChange(power.powerId, "DECLINED")}>
              Отклонить
            </button>
          </>
        )}
      </td>
    </tr>
  );
};