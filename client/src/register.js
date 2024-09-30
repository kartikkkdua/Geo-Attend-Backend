// src/Register.js
import React, { useState } from 'react';
import FaceApi from './face-api';

const Register = () => {
  const [faceDescriptor, setFaceDescriptor] = useState(null);
  const [isRegistered, setIsRegistered] = useState(false);

  const handleFaceCaptured = (descriptor) => {
    setFaceDescriptor(descriptor);
    setIsRegistered(true);
    // You can store the descriptor in local storage or send it to a backend server
    localStorage.setItem('userFace', JSON.stringify(descriptor));
  };

  return (
    <div>
      <h1>Register</h1>
      {isRegistered ? (
        <h2>Registration Successful!</h2>
      ) : (
        <FaceApi onFaceCaptured={handleFaceCaptured} />
      )}
    </div>
  );
};

export default Register;
