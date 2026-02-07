import React, { useEffect, useMemo, useState } from "react";
import { Filter, Search, ClipboardList } from "lucide-react";
import useLanguageStore from "../../Store/LanguageStore/languageStore";
import translations from "../../Store/LanguageStore/translations";
import LoadingOverlay from "../components/LoadingOverlay";
import ActionsList from "../components/ActionsList";
import TableSkeleton from "../components/TableSkeleton";
import CancelModal from "../../Components/CancelModal";
import Swal from "sweetalert2";
import styles from "./css/Actions.module.css";
import api from "../../utils/Api";
import { getPickupRequest, getReturnRequest, cancelRequest } from "../Data/RequestsService";

const Actions = () => {
  const { lang } = useLanguageStore();
  const t = translations[lang];
  const [Requests, setResquests] = useState([]);
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
        const res = await getPickupRequest(selectedRequest.id);
        if (res.Success) {
          const shipments = res.Data?.shipments || [];
          ids = shipments.map((s) => s.id);
        }
      } catch (err) {
        console.log('error in fetching request details', err);
      }
    }

    if (selectedRequest?.type === "ReturnRequest") {
      try {
        const res = await getReturnRequest(selectedRequest.id);
        if (res.Success) {
          const shipments = res.Data?.shipments || [];
          ids = shipments.map((s) => s.id);
          console.log('ids', ids);
        }
      } catch (err) {
        console.log('error in fetching request details', err);
      }
    }

    try {
      const res = await cancelRequest(selectedRequest?.id, ids);

      if (res.Success) {
        Swal.fire({
          position: "center-center",
          icon: "success",
          title: "Request Canceled Successfully",
          showConfirmButton: false,
          timer: 2000
        });
      }
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
      <div className={`${styles['actions-page']} ${lang === "ar" ? styles.rtl : styles.ltr}`}>
        <div className={styles['actions-card']}>

          {/* Page Title */}
          <div className={styles['page-title']}>
            <ClipboardList size={24} />
            <span>{t.requests || "Requests"}</span>
            <span className={styles['requests-count']}>{Requests.length}</span>
          </div>

          {/* Filter & Search */}
          <div className={styles['filter-search']}>
            <button className={styles['filter-btn']}>
              <Filter size={16} /> {t.advancedFilter}
            </button>
            <div className={styles['search-wrapper']}>
              <Search size={16} className={styles['search-icon']} />
              <input
                type="text"
                placeholder={t.searchTask}
                onChange={(e) => SetsearchTerm(e.target.value)}
                value={searchTerm}
              />
            </div>
          </div>

          {/* Tabs */}
          <div className={styles.tabs}>
            <span
              className={`${styles['tab-item']} ${timeFilter === "day" ? styles.active : ""}`}
              onClick={() => setTimeFilter("day")}
            >
              {t.today} ({todayCount})
            </span>
            <span
              className={`${styles['tab-item']} ${timeFilter === "week" ? styles.active : ""}`}
              onClick={() => setTimeFilter("week")}
            >
              {t.week} ({weekCount})
            </span>
            <span
              className={`${styles['tab-item']} ${timeFilter === "all" ? styles.active : ""}`}
              onClick={() => setTimeFilter("all")}
            >
              {t.all} ({Requests.length})
            </span>
          </div>

          {/* Table */}
          <div className={styles['tasks-wrapper']}>
            <table className={styles['tasks-table']}>
              <thead>
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
                  {(FilteredRequests||[]).length === 0 && (
                    <tr>
                      <td colSpan={7} className="text-center p-4">
                        <h5 className="text-muted">No Data Found</h5>
                      </td>
                    </tr>
                  )}
                  {FilteredRequests.map((request, index) => (
                    <tr
                      key={request.requestNumber || request.id}
                      className={styles['table-row']}
                      style={{ animationDelay: `${index * 0.05}s` }}
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
                        <div className={styles['address-cell']}>
                          {request.pickupAddress?.street}, {request.pickupAddress?.city}
                          <div className={styles['address-sub']}>{request.pickupAddress?.governorate}</div>
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
      </div>
    </>
  );
};

export default Actions;