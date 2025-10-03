import React, { useEffect, useState } from "react";
import "./css/Actions.css";
import { FaFilter} from "react-icons/fa";
import useLanguageStore from "../../Store/LanguageStore/languageStore";
import translations from "../../Store/LanguageStore/translations";
import ActionsDropdown from './../components/dropdown';

const fallbackData = [
  { id: "M-001", name: "توصيل طرود", createdAt: "2024-01-12", updatedAt: "2024-01-15", orders: 12 },
  { id: "M-002", name: "إرجاع منتجات", createdAt: "2024-01-13", updatedAt: "2024-01-16", orders: 8 },
  { id: "M-003", name: "طلب تسليم عاجل", createdAt: "2024-01-14", updatedAt: "2024-01-16", orders: 25 },
];

const API_URL = "https://example.com/api/missions";

const Actions = () => {
  const { lang } = useLanguageStore();
  const t = translations[lang];
  const [data, setData] = useState([]);
  // const [openMenu, setOpenMenu] = useState(null); // state لتحديد أي Dropdown مفتوح

  useEffect(() => {
    const fetchMissions = async () => {
      try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
        const missions = await res.json();

        setData(Array.isArray(missions) && missions.length > 0 ? missions : fallbackData);
      } catch (error) {
        console.warn("API Error:", error.message, "— Using fallback data.");
        setData(fallbackData);
      }
    };

    fetchMissions();
  }, []);

 

  return (
    <div className={`actions-container ${lang === "ar" ? "rtl" : "ltr"}`}>
      {/* زر إضافة جديد */}
      <div className="header-actions">
        <a href="/new-request" className="new-request">{t.newRequest}</a>
      </div>

      {/* فلتر وبحث */}
      <div className="filter-search">
        <button className="filter-btn">
          <FaFilter /> {t.advancedFilter}
        </button>
        <input type="text" placeholder={t.searchTask} />
      </div>

      {/* Tabs */}
      <div className="tabs">
        <span>{t.today} (0)</span>
        <span>{t.week} (0)</span>
        <span className="active">{t.all} ({data.length})</span>
      </div>

      {/* جدول المهام */}
     <table className="tasks-table">
  <thead>
    <tr>
      <th>{t.requestId || "Request ID"}</th>
      <th>{t.requestName || "Request Name"}</th>
      <th>{t.createDate || "Create Date"}</th>
      <th>{t.lastUpdate || "Last Update"}</th>
      <th>{t.ordersCount || "Orders Count"}</th>
      <th>{t.actions || "Actions"}</th>
    </tr>
  </thead>
  <tbody>
    {data.map((request) => (
      <tr key={request.id}>
        <td>{request.id}</td>
        <td>{request.name}</td>
        <td>{request.createdAt}</td>
        <td>{request.updatedAt}</td>
        <td><span className="orders-count">{request.orders}</span></td>
        <td>
          <ActionsDropdown taskId={request.id} />
        </td>
      </tr>
    ))}
  </tbody>
</table>

    </div>
  );
};

export default Actions;
