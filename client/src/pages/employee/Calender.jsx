import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import axios from 'axios';
import 'react-calendar/dist/Calendar.css';
import { Button } from '@mui/material';
import { useAuth } from '../../AuthContext';

export default function CalendarView() {
    const [date, setDate] = useState(new Date());
    const [events, setEvents] = useState([]);
    const { BaseURL } = useAuth();

    const fetchEvents = async (selectedDate) => {
        try {
            const response = await axios.get(`${BaseURL}/calendar/events`);
            const eventsForDate = response.data.holidays.concat(response.data.exams, response.data.miscellaneous)
                .filter(event => new Date(event.date).toDateString() === selectedDate.toDateString());
            setEvents(eventsForDate);
        } catch (error) {
            console.error('Error fetching events:', error);
        }
    };

    const handleDelete = async (eventId) => {
        try {
            await axios.post(`${BaseURL}/calendar/delete-event/${eventId}`);
            fetchEvents(date);
        } catch (error) {
            console.error('Error deleting event:', error);
        }
    };

    useEffect(() => {
        fetchEvents(date);
    }, [date]);

    return (
        <div className='flex lg:w-[650px] lg:flex-row flex-col gap-3'>
            <Calendar onChange={setDate} value={date} />
            <div className="mt-4">
                <h3 className="font-extrabold text-xl mb-2">Events on {date.toDateString()}</h3>
                {events.length > 0 ? (
                    <ul>
                        {events.map((event, index) => (
                            <li
                                key={index}
                                className={`p-2 rounded-lg mb-2 flex justify-between items-center ${event.type === 'holiday' ? 'bg-blue-200' : event.type === 'exam' ? 'bg-red-200' : 'bg-gray-200'
                                    }`}
                            >
                                <span>{event.name} - {event.description}</span>
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    size="small"
                                    onClick={() => handleDelete(event._id)}
                                >
                                    Delete
                                </Button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No events on this day.</p>
                )}
            </div>
        </div>
    );
}
