import React, { useEffect, useMemo, useState } from "react";
import { FaFilter } from "react-icons/fa";
import useLanguageStore from "../../Store/LanguageStore/languageStore";
import translations from "../../Store/LanguageStore/translations";
import useUserStore from "../../Store/UserStore/userStore";
import LoadingOverlay from "../components/LoadingOverlay";
import ActionsList from "../components/ActionsList";
import CancelModal from "../../Components/CancelModal";
import axios from "axios";
import Swal from "sweetalert2";
import "bootstrap/dist/js/bootstrap.bundle.min.js"; // needed for dropdown behavior
import "./css/Actions.css";
import api from "../../utils/Api";
const Actions = () => {
  const { lang } = useLanguageStore();
  const t = translations[lang];
  const [Requests, setResquests] = useState([]);
  const user = useUserStore((state) => state.user);
  const [loading, setloading] = useState(false);
  const [searchTerm,SetsearchTerm]=useState("")
  const [selectedRequest,setSelectedRequest]=useState(null);

 //cancel modal states
 const[showModal,SetShow]=useState(false)
const handleshow=(id,type)=>{
setSelectedRequest({id,type})
SetShow(true)
}


  //fetch all requests
  useEffect(() => {
    const fetchRequests = async () => {
      setloading(true);
      try {
        const res = await api.get('/Requests');
        const result=res.data.data
        
          
          console.log('fetching requests sucessfully', result);
          setResquests(result);
        
        
      } catch (err) {
        const message=err.response?.data.message
        console.log('Error', err);
        console.log('fetching requests failed', message);
      } 
    };

    fetchRequests();
  }, []);

  const FilteredRequests=useMemo(()=>{
    let list= Requests||[];

    if(searchTerm!==""){
      const q=searchTerm.trim()
      list=list.filter((o)=>{
        const Idmatch=String(o.id).includes(q)
        const Requesttype=(o.requestType||"").toLowerCase().includes(q)
        const status=(o.requestStatus||"").toLowerCase().includes(q)
        return Idmatch||Requesttype||status
      })
      
    }
      

return list

  },[searchTerm,Requests])

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
      <span className={`status-badge`}>
        {statusText[status] || 'Pending'}
      </span>
    );
  };
 const handleCancelRequest=async()=>{

  console.log(selectedRequest) 

  let ids=[]
    if(selectedRequest?.type==="PickupRequest"){
      try{

        const res=await  axios.get('https://stakeexpress.runasp.net/api/Requests/pickup-requests/'+selectedRequest.id,{
          headers:{
             "Content-Type": "application/json",
            "X-Client-Key": "web API",
            Authorization: `Bearer ${user?.token}`,
          }
        })
        
      console.log(res.data.data.shipments)
      const shipments = res.data?.data?.shipments || [];
      ids=shipments.map((s)=>s.id)
      

      }catch(err){
        console.log('error in fetching request details',err)
      }

}
    if(selectedRequest?.type==="ReturnRequest"){
      try{

        const res=await  axios.get('https://stakeexpress.runasp.net/api/Requests/return-requests/'+selectedRequest.id,{
          headers:{
             "Content-Type": "application/json",
            "X-Client-Key": "web API",
            Authorization: `Bearer ${user?.token}`,
          }
        })
        
      console.log(res.data.data.shipments)
      const shipments = res.data?.data?.shipments || [];
      ids=shipments.map((s)=>s.id)
      console.log('ids',ids)

      }catch(err){
        console.log('error in fetching request details',err)
      }

}
  //////// post cancelation
  const url=`https://stakeexpress.runasp.net/api/Requests/${selectedRequest?.id}/cancellations`;
  const ShipmentIds=ids||[]

  try{
    const res=await  axios.post(url,{"ShipmentIds":ShipmentIds},{
      headers:{
         "Content-Type": "application/json",
            "X-Client-Key": "web API",
            Authorization: `Bearer ${user.token}`,
      }
    })

    console.log('res=',res)
       Swal.fire({
          position: "center-center",
          icon: "success",
          title: "Request Canceled Successfully",
          showConfirmButton: false,
          timer: 2000
    
            });

  }catch(err){
console.log('Error in cancel request',err)

  }



SetShow(false)
}
  return (
    <>
      <CancelModal 
      show={showModal} 
      onCancel={()=>SetShow(false)} 
      onConfirm={handleCancelRequest}
      title="Cancel Request"
      message="Are you sure you want to Cancel this Request? This action cannot be undone."
      />
      <div className={`actions-container ${lang === "ar" ? "rtl" : "ltr"} px-4`}>
 

        {/* فلتر وبحث */}
        <div className="filter-search">
          <button className="filter-btn">
            <FaFilter /> {t.advancedFilter}
          </button>
          <input type="text" placeholder={t.searchTask} 
          onChange={(e)=>SetsearchTerm(e.target.value)}
          value={searchTerm}
          />
        </div>

        {/* Tabs */}
        <div className="tabs">
          <span>{t.today} (0)</span>
          <span>{t.week} (0)</span>
          <span className="active">{t.all} ({Requests.length})</span>
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
              {FilteredRequests.map((request, index) => (
                <tr 
                  key={request.id} 
                  className="table-row"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <td>{request.id}</td>
                  <td>{String(request.requestType).replace("Request", " Request")}</td>
                  <td>{new Date(request.createdAt).toLocaleDateString()}</td>
                  <td>{new Date(request.updatedAt).toLocaleDateString()}</td>
                  <td>{request.requestStatus}</td>
                  <td>
                    <span className="orders-count">{request.shipmentsCount}</span>
                  </td>
                  <td>
                   
                <ActionsList 

  id={request?.id}
  requestype={request?.requestType}
  showModal={()=>handleshow(request?.id,request?.requestType)}

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