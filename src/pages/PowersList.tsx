  import { useEffect, useState } from "react";
  import { useDispatch, useSelector } from "react-redux";
  import type { AppDispatch, RootState } from "../store/store";
  import { fetchPowers } from "../slices/powerSlice";
  import { PowerRow } from "../components/PowerCardTable/PowerCardTable";

  import { HeaderComponent } from "../components/Header/Header";
  import { ROUTE_LABELS } from "../routes";
  import { updatePowerStatus } from "../slices/powerSlice";


  export const PowersList = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { powers, loading } = useSelector(
      (state: RootState) => state.power
    );

const today = new Date().toISOString().split("T")[0];

    const [status, setStatus] = useState("");
    const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState(today);
    //const [creator, setCreator] = useState(""); // frontend filter

    const role = useSelector((state: RootState) => state.user.role);

const normalizedRole = role ?? "guest";
const [creatorId, setCreatorId] = useState("");
const isModerator = normalizedRole === "moderator";

    useEffect(() => {
  const load = () => {
    dispatch(
      fetchPowers({
        silent: true,
      })
    );
  };

  load();

  const interval = setInterval(load, 10000);

  return () => clearInterval(interval);
}, []);

const handleStatusChange = async (
  powerId: number,
  status: "COMPLETED" | "DECLINED"
) => {
  await dispatch(updatePowerStatus({ powerId, status }));
  dispatch(fetchPowers({
  status,
  dateFrom,
  dateTo,
  creatorId,
}));
};



    

    return (
    <main className="powers-list">
      <HeaderComponent crumbs={[{ label: ROUTE_LABELS.POWERS }]} />

      <div className="header-content">
        <h3>
          Список всех конфигураций мощности блока питания
        </h3>
      </div>

      <hr />
      {/* SUMMARY BLOCK (как PowerPage) */}
        <div className="result-container summary-block">
          <p className="result-name">Общая информация</p>

          <p className="component-info-text">
            Всего конфигураций: {powers.length}
          </p>

          <p className="component-info-text">
            Роль: {normalizedRole === "moderator"
              ? "Модератор"
              : normalizedRole === "guest"
              ? "Гость"
              : "Пользователь"}
          </p>
        </div>
      

      {/* FILTER PANEL (как settings-block) */}
      <div className="power-layout">
        <div className="top-filters">
    <div>
      <label>Статус</label><br />
      <select onChange={(e) => setStatus(e.target.value)}>
        <option value="">ВСЕ</option>
        <option value="COMPLETED">ЗАВЕРШЕНЫ</option>
        <option value="DRAFT">ЧЕРНОВИКИ</option>
        <option value="DECLINED">ОТКЛОНЕНЫ</option>
      </select>
    </div>

    <div>
      <label>Дата от</label><br />
      <input type="date" onChange={(e) => setDateFrom(e.target.value)} />
    </div>

    <div>
      <label>Дата до</label><br />
      <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
    </div>
    {isModerator && (
      <input
        value={creatorId}
        onChange={(e) => setCreatorId(e.target.value)}
        placeholder="Creator ID"
      />
    )}
    <div>
      <button onClick={() =>
        dispatch(fetchPowers({ status, dateFrom, dateTo, creatorId }))
      }>
        Найти
      </button>
    </div>

      
  </div>

        </div>

      <br/>
      <hr />

      {/* TABLE */}
      {loading ? (
        <p style={{ margin: "20px 30px" }}>Загрузка...</p>
      ) : (
        <div className="table-wrapper">
        <table className="psu-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Статус</th>
              <th>Дата формирования</th>
              <th>КПД</th>
              <th>Реком. мощность</th>
              <th>Действия</th>
            </tr>
          </thead>

          <tbody>
            {powers.map((p) => (
              <PowerRow
                key={p.powerId}
                power={p}
                isModerator={isModerator}
                onStatusChange={handleStatusChange}
              />
            ))}
          </tbody>
        </table>
        </div>
      )}
    </main>
  );
};
