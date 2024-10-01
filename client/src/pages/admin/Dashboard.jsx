import React from 'react'
import Register from '../../components/Register'
import AttendanceView from './Attendance'

export default function Dashboard() {
  return (
    <div className='flex gap-8' >
      <Register/>
      <AttendanceView/>
    </div>
  )
}
