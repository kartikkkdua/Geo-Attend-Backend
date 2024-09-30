import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../AuthContext';

function Attendance() {
  const [status, setStatus] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { logout, user  , baseurl} = useAuth();


  const markAttendance = () => {
    if (navigator.geolocation) {
      setIsSubmitting(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const userId = `${user.userId}`;
          try {
            const response = await axios.post(`${baseurl}/mark-attendance`, {
              userId: "66fa87be716c7ce9a774248c",
              latitude: 30.342764,
              longitude: 77.888023,
              checkinTime: "9:00 A.M"
            });

            if (response.data) {
              setStatus(response.data.message);
            } else {
              setStatus('Error: ' + response.data.message);
            }
          } catch (error) {
            setStatus('Failed to mark attendance.', error);
          } finally {
            setIsSubmitting(false);
          }
        },
        (error) => {
          setStatus('Failed to retrieve location.');
          setIsSubmitting(false);
        }
      );
    } else {
      setStatus('Geolocation is not supported by this browser.');
    }
  };

  return (
    <div>
      <h1>Geofence Attendance System</h1>
      <button
        className='bg-black px-2 py-1 text-white shadow-md'
        onClick={markAttendance}
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Marking...' : 'Mark Attendance'}
      </button>
      {status && <p>{status}</p>}

      <button onClick={logout} className='mt-4'>Logout</button>
    </div>
  );
}

export default Attendance;
