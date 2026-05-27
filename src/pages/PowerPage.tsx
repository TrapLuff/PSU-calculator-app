import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";

import { HeaderComponent } from "../components/Header/Header";
import { ROUTE_LABELS } from "../routes";

import { ComponentCardTable } from "../components/ComponentCardTable/ComponentCardTable";

import type { RootState, AppDispatch } from "../store/store";
import { updatePower } from "../slices/powerSlice";

import { formPower, deletePower, fetchPowerById } from "../slices/powerSlice";
import { useNavigate } from "react-router-dom";

export const PowerPage: React.FC = () => {
  const { id } = useParams();

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const power = useSelector((state: RootState) => state.power.power);
  //const loading = useSelector((state: RootState) => state.power.loading);
  const error = useSelector((state: RootState) => state.power.error);

  const [efficiency, setEfficiency] = useState(power?.efficiency ?? 85);
const [description, setDescription] = useState(power?.description ?? "");

  // загрузка заявки через thunk
  useEffect(() => {
  if (!id) return;

  const powerId = Number(id);

  if (Number.isNaN(powerId)) return;

  dispatch(fetchPowerById(powerId));
}, [id, dispatch]);

    useEffect(() => {
  if (power) {
    setEfficiency(power.efficiency);
    setDescription(power.description ?? "");
  }
}, [power]);

  // ошибки
  if (error === "FORBIDDEN") {
    return <div>У вас нет доступа к этой заявке</div>;
  }

  if (error === "NOT_FOUND") {
    return <div>Заявка не найдена</div>;
  }

  if (error) {
    return <div>Ошибка загрузки</div>;
  }

  // пока грузится
  if (!power) {
    return <div>Загрузка...</div>;
  }

  return (
    <main>
      <HeaderComponent
        crumbs={[
          { label: ROUTE_LABELS.POWERS },
          { label: `Конфигурация #${power.powerId}` },
        ]}
      />

      <div className="header-content">
        <h3>
          На данной странице вы можете увидеть итог расчёта
          необходимой мощности блока питания.
        </h3>
      </div>

      <hr />
            <div className="power-layout">
      <div className="result-container summary-block">
        
        <p className="result-name">
          Итоги расчёта мощности БП
        </p>

        <p className="result-name">
          Номер заявки: #{power.powerId}
        </p>

        <p className="component-info-text">
          Компонентов: {power.componentsCount}
        </p>

        <p className="component-info-text">
          Пиковая нагрузка: {power.upTotal} Вт
        </p>

        <p className="component-info-text">
          Стандартная нагрузка: {power.typicalTotal} Вт
        </p>

        <p className="component-info-text">
          КПД (80 PLUS): {power.efficiency}%
        </p>

        <p className="component-info-text">
          Описание: {power.description || "Описание отсутствует"}
        </p>

        <p className="component-info-text">
          Рекомендуемая мощность БП:{" "}
          {power.recommendedPower} Вт
        </p>

        <button
            onClick={async () => {
                if (!power) return;

                await dispatch(formPower(power.powerId));
               const res = await dispatch(fetchPowerById(power.powerId)).unwrap();
                if (res.status === "FORMED") {
  navigate("/components");
}
            }}
            >
            Сформировать
        </button>
                <button
        onClick={async () => {
            if (!power) return;

            await dispatch(deletePower(power.powerId));

            navigate("/components"); 
        }}
        >
        Удалить Power
        </button>
      </div>

      <div className="result-container  settings-block">
  <p className="result-name">Настройки Power</p>

  <div >
    <label className="component-info-text">КПД: &nbsp;</label>
    <input
      type="number"
      value={efficiency}
      min={1}
      max={100}
      onChange={(e) => setEfficiency(Number(e.target.value))}
    />
  </div>

  <div>
    <label className="component-info-text">Описание:</label>
    <textarea
  className="description-textarea"
  value={description}
  onChange={(e) => setDescription(e.target.value)}
/>
  </div>

  <button className="long-button"
    onClick={() => {
      if (!power) return;

      dispatch(
        updatePower({
          powerId: power.powerId,
          efficiency,
          description,
        })
      );
    }}
  >
    Сохранить изменения
  </button>
</div>
</div>
<div className="table-wrapper">
      <table className="psu-table">
  <thead>
    <tr>
      <th>Название</th>
      <th>Макс. тепловыделение</th>
      <th>Базовое тепловыделение</th>
      <th>Выбрано</th>
      <th>Действие</th>
    </tr>
  </thead>

  <tbody>
    {power.components.filter(c => c.isActive).length === 0 ? (
      <tr>
        <td colSpan={4}>
          Список пуст
        </td>
      </tr>
    ) : (
      power.components
        .filter(c => c.isActive)
        .map(component => (
          <ComponentCardTable
            key={component.id}
            component={component}
          />
        ))
    )}
  </tbody>
</table>
</div>
    </main>
  );
};