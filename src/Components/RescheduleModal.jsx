// File: RescheduleModal.jsx
import React, { useEffect, useState } from "react";
import { X, Calendar, CheckCircle, Info,Clock } from "lucide-react";
import useUserStore from "../Store/UserStore/userStore";
import { useNavigate } from "react-router-dom";
import "./css/RescheduleModal.css";

export default function RescheduleModal({
  show = true,
  onClose = () => {},
  
  type = "Delivery",
  
 
}) {
 
  const [notifyReceiver, setNotifyReceiver] = useState(true);
  const [selectedRequestId, setSelectedRequestId] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [requestsData, setRequestsData] = useState([]);
  const navigate=useNavigate();
  const user = useUserStore((state) => state.user);
const [FormData,setFormData]=useState({
  scheduledRequestId:'',
  newRequestDate:'',
  newTimeWindowStart:'',
  newTimeWindowEnd:'',
  reason:'',

})
  // simple char limit
  const maxReason = 300;

 


  // If a selectedRequestId changes, update the info card fields
  useEffect(() => {
    if (selectedRequestId == null) {
      // keep existing provided props if nothing selected
      
      
      setSelectedRequest(null);
      return;
    }
    const req = requestsData.find((r) => r.requestId === selectedRequestId) || null;
    console.log('req from req data',req)
    setSelectedRequest(req);

    











  }, [selectedRequestId]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(()=>{

    const fetchrequestes=async()=>{

      try{
        const res=await fetch(`https://stakeexpress.runasp.net/api/Requests/to-reschedule-requests`,{
          method:'GET',
          headers: {
            "Content-Type": "application/json",
            "X-Client-Key": "web API",
            Authorization: `Bearer ${user?.token}`,
          }
        })
          if(res.ok){
            const data=await res.json();
            console.log('fetching requests successful',data);
            setRequestsData(data.data);
          }
          else{
            console.log('error in fetching requests');
          }


      }catch(err){

        console.log('error in fetching requests',err);
      }




    }

    fetchrequestes();

  },[])

  const handleformchange=(e)=>{

    const {name,value}=e.target;
    setFormData({...FormData,[name]:value})
  }
  if (!show) return null;

  // helper to derive a Date object from requestDate + timeWindowStart
  function deriveDatetimeFromRequest(req) {
    console.log('from timer',req)
    // requestDate format assumed 'YYYY-MM-DD', time 'HH:mm'
    const iso = `${req?.RequestDate}T${req?.windowStart}:00`;
    const dt = new Date(iso);
   
    return dt;
  }

  const handleSubmit = async() => {
    console.log('form data are',FormData);
    // if (!selectedRequestId) {
    //   alert("Please select the scheduled request to reschedule.");
    //   return;
    // }
    // if (FormData&&(!FormData.newRequestDate||!FormData.newTimeWindowStart||!FormData.newTimeWindowEnd||!FormData.reason.trim()||!FormData.scheduledRequestId)) {
    //   alert("Please fill required fields");
    //   return;
    // }
    

    try{
      const payload={
  scheduledRequestId: FormData.scheduledRequestId,
  newRequestDate: FormData.newRequestDate,
  newTimeWindowStart: FormData.newTimeWindowStart +":00",
  newTimeWindowEnd: FormData.newTimeWindowEnd+":00",
  reason: FormData.reason

      }
      console.log('from res payload',payload)
      const res=await fetch('https://stakeexpress.runasp.net/api/Requests/reschedule-requests',{

        method:'POST',
        headers: {
            "Content-Type": "application/json",
            "X-Client-Key": "web API",
            Authorization: `Bearer ${user?.token}`,
          },
          body:JSON.stringify(payload)

      })

      if(res.ok){
          const data=await res.json()
        console.log("request reschedule successfully",data)
        onclose()
        
      }


    }catch(err){

console.log('error in rescheduling request',err)

    }


  };

  // toggle selection using a checkbox input while ensuring only one can be selected
  function handleCheckboxToggle(request) {
    console.log("toggling", request);
    
    setSelectedRequest(request)
    setFormData({...FormData,scheduledRequestId:request?.id})
    
    setSelectedRequestId(request?.id); 
    
  }

  return (
    <div className="resched-backdrop" role="dialog" aria-modal="true">
      <div className="resched-modal">
        <div className="resched-header">
          <div>
            <div className="resched-title">Reschedule Request</div>
            <div className="resched-sub">
              Change the scheduled delivery for request <strong>{selectedRequest ? selectedRequest.id : requestsData.id}</strong>
            </div>
          </div>
          <button className="btn btn-sm btn-light" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <div className="resched-body">
          {/* --- Table: pick a scheduled request (single select using checkbox) --- */}
          <div className="mb-3">
            <label className="form-label" style={{ fontWeight: 600 }}>
              Select scheduled request to reschedule
            </label>
            <div className="table-responsive">
              <table className="table table-hover table-sm">
                <thead >
                  <tr>
                    <th>Request ID</th>
                    <th>Request type</th>
                    <th>Request date</th>
                    <th>Time window start</th>
                    <th>Time window end</th>
                    <th className="text-center"> quantity</th>
                    <th className="text-center">Select</th>
                  </tr>
                </thead>
                <tbody>
                  {requestsData.map((r) => (
                    <tr
                      key={r.id}
                      className={selectedRequestId === r.id ? "table-active" : ""}
                      style={{ cursor: "pointer" }}
                      onClick={() => handleCheckboxToggle(r)}
                    >
                      <td>{r.id}</td>
                      <td>{r.requestType}</td>
                      <td>{r.requestDate}</td>
                      <td>{r.windowStart}</td>
                      <td>{r.windowEnd}</td>
                      <td className="text-center">{r.shipmentsCount}</td>
                      <td className="text-center">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id={`sel-${r.requestId}`}
                            checked={FormData?.scheduledRequestId === r.requestId}
                            onChange={() => handleCheckboxToggle(r.requestId)}
                            aria-label={`Select ${r.requestId}`}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* --- Info card: shows the selected request details (or fallback to passed props) --- */}
          <div className="info-card mb-4">
            <div className="type-pill">{selectedRequest ? selectedRequest.requestType : type}</div>
            <div style={{ marginLeft: 12 }}>
              <div style={{ fontSize: 12, color: "#6b7280" }}>Original datetime</div>
              <div className="original-row">
                <Calendar size={16} />
                <div style={{ fontWeight: 700 }}>
                  {selectedRequest ? selectedRequest.requestDate +" , " + selectedRequest?.windowStart:"ddfgdff"}
                </div>
              </div>
            </div>
            <div className="order-id">{FormData?.scheduledRequestId}</div>
          </div>

      
          <div className="row ">
             <div className="col-lg-4 mb-3">
            <label className="form-label-icon">
              <Calendar size={16} /> Pickup Date
            </label>
            <input type="date" name="newRequestDate" onChange={handleformchange} className="form-control form-control-custom" placeholder="mm/dd/yyyy" />
          
          </div>

          <div className="col-lg-4 mb-3">
            <label className="form-label-icon">
              <Clock size={16} /> Window Start
            </label>
            <input type="time"  name="newTimeWindowStart"   onChange={handleformchange}  className="form-control form-control-custom" placeholder="--:-- --" />
          </div>

          <div className="col-lg-4 mb-3">
            <label className="form-label-icon">
              <Clock size={16} /> Window End
            </label>
            <input type="time" name="newTimeWindowEnd"  onChange={handleformchange}  className="form-control form-control-custom" placeholder="--:-- --" />
          </div>
          </div>
         
          
          {/* --- Reason textarea --- */}
          <div className="mb-3">
            <label className="form-label" style={{ fontWeight: 600 }}>
              Reason <span style={{ color: "#ef4444" }}> *</span>
            </label>
            <textarea
              maxLength={maxReason}
              className="form-control textarea-custom"
              placeholder="Brief explanation for the reschedule request (max 300 characters)"
              name="reason"
              value={FormData.reason}
              onChange={handleformchange}
            />
            <div className="text-end mt-1 text-muted" style={{ fontSize: 13 }}>
              {FormData?.reason.length}/{maxReason}
            </div>
          </div>

          {/* --- Notify receiver switch --- */}
          <div className="mb-3">
            <div className="notify-pill">
              <div className="check">
                <CheckCircle size={16} />
              </div>
              <div style={{ fontWeight: 600 }}>Notify receiver about this reschedule request</div>
              <div style={{ marginLeft: "auto" }}>
                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="notifySwitch"
                    checked={notifyReceiver}
                    onChange={(e) => setNotifyReceiver(e.target.checked)}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="note-box d-flex align-items-start">
            <Info size={18} style={{ marginRight: 10 }} />
            <div>Your request will be reviewed by the hub manager. You'll be notified once approved or rejected.</div>
          </div>
        </div>

        <div className="resched-footer">
          <button className="btn-cancel" onClick={onClose}>
            Cancel
          </button>
          <button className="btn-orange" onClick={handleSubmit}>
            Submit Request
          </button>
        </div>
      </div>
    </div>
  );
}
