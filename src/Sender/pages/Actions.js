import React, { useEffect, useState } from "react";
import { FaFilter } from "react-icons/fa";
import useLanguageStore from "../../Store/LanguageStore/languageStore";
import translations from "../../Store/LanguageStore/translations";
import { Link } from "react-router-dom";
import useUserStore from "../../Store/UserStore/userStore";
import LoadingOverlay from "../components/LoadingOverlay";
import RescheduleModal from "../../Components/RescheduleModal";
import ActionsList from "../components/ActionsList";
import "bootstrap/dist/js/bootstrap.bundle.min.js"; // needed for dropdown behavior
import "./css/Actions.css";
const Actions = () => {
  const { lang } = useLanguageStore();
  const t = translations[lang];
  const [Resquests, setResquests] = useState([]);
  const user = useUserStore((state) => state.user);
  const [loading, setloading] = useState(false);
  const [isRescheduleOpen,SetisRescheduleOpen]=useState(false)
  
  //fetch all requests
  useEffect(() => {
    const fetchRequests = async () => {
      setloading(true);
      try {
        const res = await fetch('https://stakeexpress.runasp.net/api/Requests/getAllRequests', {
          method: 'GET',
          headers: {
            'X-Client-Key': 'web api',
            Authorization: `Bearer ${user.token}`
          }
        });

        if (res.ok === true) {
          const data = await res.json();
          console.log('fetching requests sucessfully', data);
          setResquests(data.data);
        } else {
          const data = await res.json();
          console.log('fetching requests failed', data);
        }
      } catch (err) {
        console.log('Error', err);
      } finally {
        setloading(false);
      }
    };

    fetchRequests();
  }, []);

  const getStatusBadge = (status) => {
    const statusMap = {
      'pending': 'status-pending',
      'in-progress': 'status-in-progress',
      'completed': 'status-completed',
      'cancelled': 'status-cancelled',
      'Pending': 'status-pending',
      'InProgress': 'status-in-progress',
      'Completed': 'status-completed',
      'Cancelled': 'status-cancelled'
    };
    
    const statusText = {
      'pending': 'Pending',
      'in-progress': 'In Progress',
      'completed': 'Completed',
      'cancelled': 'Cancelled',
      'Pending': 'Pending',
      'InProgress': 'In Progress',
      'Completed': 'Completed',
      'Cancelled': 'Cancelled'
    };
    
    return (
      <span className={`status-badge ${statusMap[status] || 'status-pending'}`}>
        {statusText[status] || 'Pending'}
      </span>
    );
  };

  return (
    <>
      <LoadingOverlay loading={loading} message="please wait..." color="#fff" size={44} />
      
      <div className={`actions-container ${lang === "ar" ? "rtl" : "ltr"} px-4`}>
        {/* زر إضافة جديد */}
        <div className="header-actions">
          <Link to="/Pickuporder" className="new-request">{t.newRequest}</Link>
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
          <span className="active">{t.all} ({Resquests.length})</span>
        </div>

        {/* Modern Table Container */}
        <div className="tasks-wrapper">
          <table className=" tasks-table modern-table " >
            <thead className="tableheader">
              <tr>
                <th>{t.requestId || "Request ID"}</th>
                <th>{t.requestName || "Request Name"}</th>
                <th>{t.createDate || "Create Date"}</th>
                <th>{t.lastUpdate || "Last Update"}</th>
                <th>{t.status || "Status"}</th>
                <th>{t.ordersCount || "Orders Count"}</th>
                <th>{t.actions || "Actions"}</th>
              </tr>
            </thead>
            <tbody>
              {Resquests.map((request, index) => (
                <tr 
                  key={request.id} 
                  className="table-row"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <td>{request.id}</td>
                  <td>{String(request.requestType).replace("Request", " Request")}</td>
                  <td>{new Date(request.createdAt).toLocaleDateString()}</td>
                  <td>{new Date(request.updatedAt).toLocaleDateString()}</td>
                  <td>{getStatusBadge(request.status)}</td>
                  <td>
                    <span className="orders-count">{request.shipmentsCount}</span>
                  </td>
                  <td>
                   
                <ActionsList 
  handleopenSchedule={() => SetisRescheduleOpen(true)}
  requestId={request?.id}
  requestype={request?.requestType}
/>

                  </td>
                </tr>
              ))}
              
            </tbody>
          </table>
        </div>
      </div>



      
    </>
  );
};

export default Actions;