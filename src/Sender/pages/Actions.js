import React, { useEffect, useState } from "react";
import "./css/Actions.css";
import { FaFilter} from "react-icons/fa";
import useLanguageStore from "../../Store/LanguageStore/languageStore";
import translations from "../../Store/LanguageStore/translations";
import { Link } from "react-router-dom";
import ActionsDropdown from './../components/dropdown';
import useUserStore from "../../Store/UserStore/userStore";
import LoadingOverlay from "../components/LoadingOverlay";



const Actions = () => {
  const { lang } = useLanguageStore();
  const t = translations[lang];
  const [Resquests, setResquests] = useState([]);
  const user=useUserStore((state)=>state.user)
  const [loading,setloading]=useState(false)
 
 
  useEffect(()=>{

 const fetchRequests=async()=>{
setloading(true)
  try{
const res=await fetch('https://stakeexpress.runasp.net/api/Shipments/getAllRequests',{

  method:'GET',
  headers:{
    'X-Client-Key':'web api',
    Authorization:`Bearer ${user.token}`
  }
})

  if(res.ok===true){
    const data=await res.json();
    console.log('fetching requests sucessfully',data)
    setResquests(data.data)
  }else{
     const data=await res.json();
    console.log('fetching requests failed',data)
  }

  }catch(err){

    console.log('Error',err)
  }finally{

    setloading(false)
  }




 }

fetchRequests();


 },[])

  return (
    <>
     <LoadingOverlay loading={loading} message="please wait..." color="#fff" size={44} />
    
<div className={`actions-container ${lang === "ar" ? "rtl" : "ltr"}`}>
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
    {Resquests.map((request) => (
      <tr key={request.id}>
        <td>{request.id}</td>
        <td>{String(request.requestType).replace("Request"," Request") }</td>
        <td> {request.createdAt}</td>
        <td>{request.updatedAt}</td>
        <td><span className="orders-count">{request.shipmentsCount}</span></td>
        <td>
          <ActionsDropdown taskId={request.id} />
        </td>
      </tr>
    ))}
  </tbody>
      </table>

    </div>
   
    
    </>
  );
};

export default Actions;
