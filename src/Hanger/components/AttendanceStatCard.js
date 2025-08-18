import React from 'react'
import './css/AttendanceStatCard.css'
function AttendanceStatCard({count,title,color}) {
  return (
    

         <div className={`stat-card stat-card-${color}`} >
            
            <div className={`stat-count stat-count-${color}`}   >{count}</div>  
            <div className='stat-title'>{title}</div>
            
            </div>

  )
}

export default AttendanceStatCard