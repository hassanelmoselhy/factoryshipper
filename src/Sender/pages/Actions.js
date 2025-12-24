import React, { useEffect, useMemo, useState } from "react";
import { FaFilter } from "react-icons/fa";
import useLanguageStore from "../../Store/LanguageStore/languageStore";
import translations from "../../Store/LanguageStore/translations";
import useUserStore from "../../Store/UserStore/userStore";
import LoadingOverlay from "../components/LoadingOverlay";
import ActionsList from "../components/ActionsList";
import TableSkeleton from "../components/TableSkeleton";
import CancelModal from "../../Components/CancelModal";
import axios from "axios";
import Swal from "sweetalert2";
import styles from "./css/Actions.module.css";
import api from "../../utils/Api";

const Actions = () => {
  const { lang } = useLanguageStore();
  const t = translations[lang];
  const [Requests, setResquests] = useState([]);
  const user = useUserStore((state) => state.user);
  const [loading, setloading] = useState(false);
  const [searchTerm, SetsearchTerm] = useState("");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [timeFilter, setTimeFilter] = useState("all"); // "all", "week", "day"

  //cancel modal states
  const [showModal, SetShow] = useState(false);
  const handleshow = (id, type) => {
    setSelectedRequest({ id, type });
    SetShow(true);
  };

  //fetch all requests
  useEffect(() => {
    const fetchRequests = async () => {
      setloading(true);
      try {
        const res = await api.get('/PickupRequests');
        const result = res.data.data;

        console.log('fetching requests sucessfully', result);
        setResquests(result);

      } catch (err) {
        const message = err.response?.data.message;
        console.log('Error', err);
        console.log('fetching requests failed', message);
      } finally {
        setloading(false);
      }
    };

    fetchRequests();
  }, []);

  // Helper function to check if a date is today
  const isToday = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  };

  // Helper function to check if a date is within the last 7 days
  const isThisWeek = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const weekAgo = new Date(today);
    weekAgo.setDate(today.getDate() - 7);
    return date >= weekAgo && date <= today;
  };

  const FilteredRequests = useMemo(() => {
    let list = Requests || [];

    // Apply time filter
    if (timeFilter === "day") {
      list = list.filter((o) => isToday(o.createdAt));
    } else if (timeFilter === "week") {
      list = list.filter((o) => isThisWeek(o.createdAt));
    }

    // Apply search filter
    if (searchTerm !== "") {
      const q = searchTerm.trim();
      list = list.filter((o) => {
        const Idmatch = String(o.id).includes(q);
        const Requesttype = (o.requestType || "").toLowerCase().includes(q);
        const status = (o.requestStatus || "").toLowerCase().includes(q);
        return Idmatch || Requesttype || status;
      });
    }

    return list;
  }, [searchTerm, Requests, timeFilter]);

  // Calculate counts for each filter
  const todayCount = useMemo(() => {
    return Requests.filter((o) => isToday(o.createdAt)).length;
  }, [Requests]);

  const weekCount = useMemo(() => {
    return Requests.filter((o) => isThisWeek(o.createdAt)).length;
  }, [Requests]);

  const getStatusBadge = (status) => {
    const statusKey = status || 'Pending';
    const statusClass = `status-${statusKey}`;
    return (
      <span className={`${styles['status-badge']} ${styles[statusClass]}`}>
        {t[statusKey] || statusKey}
      </span>
    );
  };

  const handleCancelRequest = async () => {
    console.log(selectedRequest);

    let ids = [];
    if (selectedRequest?.type === "PickupRequest") {
      try {
        const res = await axios.get('https://stakeexpress.runasp.net/api/Requests/pickup-requests/' + selectedRequest.id, {
          headers: {
            "Content-Type": "application/json",
            "X-Client-Key": "web API",
            Authorization: `Bearer ${user?.token}`,
          }
        });

        console.log(res.data.data.shipments);
        const shipments = res.data?.data?.shipments || [];
        ids = shipments.map((s) => s.id);

      } catch (err) {
        console.log('error in fetching request details', err);
      }
    }

    if (selectedRequest?.type === "ReturnRequest") {
      try {
        const res = await axios.get('https://stakeexpress.runasp.net/api/Requests/return-requests/' + selectedRequest.id, {
          headers: {
            "Content-Type": "application/json",
            "X-Client-Key": "web API",
            Authorization: `Bearer ${user?.token}`,
          }
        });

        console.log(res.data.data.shipments);
        const shipments = res.data?.data?.shipments || [];
        ids = shipments.map((s) => s.id);
        console.log('ids', ids);

      } catch (err) {
        console.log('error in fetching request details', err);
      }
    }

    //////// post cancelation
    const url = `https://stakeexpress.runasp.net/api/Requests/${selectedRequest?.id}/cancellations`;
    const ShipmentIds = ids || [];

    try {
      const res = await axios.post(url, { "ShipmentIds": ShipmentIds }, {
        headers: {
          "Content-Type": "application/json",
          "X-Client-Key": "web API",
          Authorization: `Bearer ${user.token}`,
        }
      });

      console.log('res=', res);
      Swal.fire({
        position: "center-center",
        icon: "success",
        title: "Request Canceled Successfully",
        showConfirmButton: false,
        timer: 2000
      });

    } catch (err) {
      console.log('Error in cancel request', err);
    }

    SetShow(false);
  };

  return (
    <>
      <CancelModal
        show={showModal}
        onCancel={() => SetShow(false)}
        onConfirm={handleCancelRequest}
        title="Cancel Request"
        message="Are you sure you want to Cancel this Request? This action cannot be undone."
      />
      <div className={`${styles['actions-container']} ${lang === "ar" ? styles.rtl : styles.ltr} px-4`}>

        {/* فلتر وبحث */}
        <div className={styles['filter-search']}>
          <button className={styles['filter-btn']}>
            <FaFilter /> {t.advancedFilter}
          </button>
          <input
            type="text"
            placeholder={t.searchTask}
            onChange={(e) => SetsearchTerm(e.target.value)}
            value={searchTerm}
          />
        </div>

        {/* Tabs */}
        <div className={styles.tabs}>
          <span
            className={timeFilter === "day" ? styles.active : ""}
            onClick={() => setTimeFilter("day")}
            style={{ cursor: "pointer" }}
          >
            {t.today} ({todayCount})
          </span>
          <span
            className={timeFilter === "week" ? styles.active : ""}
            onClick={() => setTimeFilter("week")}
            style={{ cursor: "pointer" }}
          >
            {t.week} ({weekCount})
          </span>
          <span
            className={timeFilter === "all" ? styles.active : ""}
            onClick={() => setTimeFilter("all")}
            style={{ cursor: "pointer" }}
          >
            {t.all} ({Requests.length})
          </span>
        </div>

        {/* Modern Table Container */}
        <div className={styles['tasks-wrapper']}>
          <table className={` ${styles['tasks-table']} ${styles['modern-table']} `}>
            <thead className={styles.tableheader}>
              <tr>
                <th>Request No</th>
                <th>Orders</th>
                <th>Address</th>
                <th>Phone</th>
                <th>Status</th>
                <th>Date</th>
                <th>{t.actions || "Actions"}</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <TableSkeleton rows={5} columns={7} />
              ) : (
                <>
               
                {(FilteredRequests||[]).length==0 &&
                  (
                    <tr>
                    <td colSpan={10} className="text-center p-2">
                    <h3>No Data Found</h3>
                    </td>
                    </tr>
                  )
                }
                {FilteredRequests.map((request, index) => (
                  <tr
                    key={request.requestNumber || request.id}
                    className={styles['table-row']}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <td>
                        <span className={styles['task-id']} title={request.requestNumber}>
                            {request.requestNumber ? String(request.requestNumber).substring(0, 8) + '...' : request.id}
                        </span>
                    </td>
                    <td>
                        <span className={styles['orders-count']}>{request.ordersCount}</span>
                    </td>
                    <td>
                         <div style={{ fontSize: "0.85rem", lineHeight: "1.4" }}>
                            {request.pickupAddress?.street}, {request.pickupAddress?.city}
                            <div className="text-muted" style={{ fontSize: "0.75rem" }}>{request.pickupAddress?.governorate}</div>
                         </div>
                    </td>
                    <td>{request.shipperPhoneNumber}</td>
                    <td>{getStatusBadge(request.requestStatus)}</td>
                    <td>
                        <div>{new Date(request.createdAt).toLocaleDateString()}</div>
                        <small className="text-muted">{new Date(request.createdAt).toLocaleTimeString()}</small>
                    </td>
                    <td>
                      <ActionsList
                        id={request?.requestNumber}
                        requestype={request?.requestType || "PickupRequest"}
                        showModal={() => handleshow(request?.requestNumber, request?.requestType || "PickupRequest")}
                      />
                    </td>
                  </tr>
                ))}
                 </>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default Actions;