import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../AuthContext';

const AttendanceView = () => {
    const [date, setDate] = useState('');
    const [attendanceRecords, setAttendanceRecords] = useState([]);
    const { baseurl } = useAuth();

    const handleFetchAttendance = async () => {
        try {
            const response = await axios.get(`${baseurl}/attendance/${date}`);
            setAttendanceRecords(response.data.attendanceRecords.data);
            console.log(response.data.attendanceRecords.data);
        } catch (error) {
            console.error("Error fetching attendance", error);
        }
    };

    const calculateDuration = (checkin, checkout) => {
        // Check if both checkin and checkout are valid
        if (!checkin || !checkout) {
            return 'N/A'; // Return a default message if either is missing
        }

        const parseTime = (timeString) => {
            const regex = /(\d{1,2}):(\d{2}):(\d{2}) (AM|PM)/; // Regex to match time format
            const match = timeString.match(regex); // Match the time string

            if (!match) {
                console.error(`Invalid time format: ${timeString}`);
                return new Date(NaN); // Return NaN date for invalid format
            }

            let [_, hours, minutes, seconds, modifier] = match;
            hours = parseInt(hours, 10);
            minutes = parseInt(minutes, 10);
            seconds = parseInt(seconds, 10);

            if (modifier === 'PM' && hours !== 12) {
                hours += 12; // Convert to 24-hour format
            }
            if (modifier === 'AM' && hours === 12) {
                hours = 0; // Midnight case
            }

            // Create a Date object with a dummy date
            return new Date(1970, 0, 1, hours, minutes, seconds); // Year, Month (0-based), Date, Hours, Minutes, Seconds
        };

        console.log(`Checkin: ${checkin}, Checkout: ${checkout}`); // Log the input values
        const checkinDate = parseTime(checkin);
        const checkoutDate = parseTime(checkout);

        // Check if the dates are valid
        if (isNaN(checkinDate.getTime()) || isNaN(checkoutDate.getTime())) {
            return 'Invalid Time Format'; // Handle invalid time format
        }

        const durationInMs = checkoutDate - checkinDate;

        // Check for negative duration
        if (durationInMs < 0) {
            return 'Checkout before Checkin'; // Handle case where checkout is before checkin
        }

        const hours = Math.floor(durationInMs / 3600000); // Calculate hours
        const minutes = Math.round((durationInMs % 3600000) / 60000); // Calculate minutes

        return `${hours}h ${minutes}m`; // Return duration in hours and minutes
    };

    return (
        <div className="max-w-3xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">View Attendance</h1>
            <div className="flex mb-4">
                <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="border border-gray-300 rounded p-2 mr-2"
                />
                <button
                    onClick={handleFetchAttendance}
                    className="bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-600"
                >
                    Fetch Attendance
                </button>
            </div>

            <h2 className="text-xl font-semibold mb-2">Attendance Records for {date}</h2>
            <table className="min-w-full border border-gray-300">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="border border-gray-300 px-4 py-2">User ID</th>
                        <th className="border border-gray-300 px-4 py-2">Status</th>
                        <th className="border border-gray-300 px-4 py-2">Check In</th>
                        <th className="border border-gray-300 px-4 py-2">Check Out</th>
                        <th className="border border-gray-300 px-4 py-2">Duration</th> {/* Added Duration header */}
                    </tr>
                </thead>
                <tbody>
                    {attendanceRecords.length > 0 ? (
                        attendanceRecords.map((record) => (
                            <tr key={record._id}>
                                <td className="border border-gray-300 px-4 py-2">{record._id}</td>
                                <td className="border border-gray-300 px-4 py-2">{record.status}</td>
                                <td className="border border-gray-300 px-4 py-2">{record.checkin}</td>
                                <td className="border border-gray-300 px-4 py-2">{record.checkout}</td>
                                <td className="border border-gray-300 px-4 py-2">
                                    {calculateDuration(record.checkin, record.checkout)}
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5" className="border border-gray-300 px-4 py-2 text-center">No records found</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default AttendanceView;
