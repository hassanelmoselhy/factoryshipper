import React from 'react'
import './css/HangerAttendance.css'
import { LuClock } from "react-icons/lu";
import AttendanceStatCard from '../components/AttendanceStatCard';
import AttendanceTable from '../components/AttendanceTable';
function HangerAttendance() {
  return (
    <div className='hanger-attendance-container'>
        
        <div className='page-header'>
               <i className='clock-icon'>
                <LuClock />
                </i>

                <h4 >
                  تنظيم الحضور والانصراف
                </h4>
        </div>
        
        <div className='attendance-stats'>

           <AttendanceStatCard count={120} title="موظف حاضر" color="green" />
           <AttendanceStatCard count={3} title="موظف غائب" color="red" />
           <AttendanceStatCard count={2} title="متأخر" color="yellow" />

        </div>
    

      <AttendanceTable />
    

    </div>
  )
}

export default HangerAttendance