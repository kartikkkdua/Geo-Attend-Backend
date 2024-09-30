import React from 'react';
import Avatar from '@mui/material/Avatar';
import placeholder from '../../assets/placeholder.png';
// Example colleague data with attendance status
const colleagues = [
    { id: 1, name: 'Aryan Bhandari', avatarUrl: 'https://via.placeholder.com/150', isPresent: true },
    { id: 2, name: 'Pranjal Rawat', avatarUrl: 'https://via.placeholder.com/150', isPresent: false },
    { id: 3, name: 'Manik Kapoor', avatarUrl: 'https://via.placeholder.com/150', isPresent: true },
    { id: 4, name: 'Ritika Panwar', avatarUrl: 'https://via.placeholder.com/150', isPresent: false },
];

function ColleaguesList() {
    return (
        <div className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Your Colleagues</h2>
            <div className="flex flex-col gap-6">
                {colleagues.map((colleague) => (
                    <div
                        key={colleague.id}
                        className="colleague-card bg-white shadow-md rounded-lg p-4 flex  items-start justify-start gap-6 w-[500px]"
                    >
                        <Avatar
                            alt={colleague.name}
                            src={placeholder}
                            sx={{ width: 56, height: 56 }}
                            className="mb-2"
                        />
                        <div className='flex flex-col justify-start' >

                            <span className="text-lg font-medium">{colleague.name}</span>
                            <span className={`mt-2 text-sm font-semibold ${colleague.isPresent ? 'text-green-600' : 'text-red-600'}`}>
                                {colleague.isPresent ? 'Present Today' : 'Absent Today'}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ColleaguesList;
