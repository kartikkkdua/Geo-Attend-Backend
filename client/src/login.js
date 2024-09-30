// src/Login.js
import React, { useState , useEffect , videoRef} from 'react';
import FaceApi from './face-api';
import * as faceapi from 'face-api.js';


const Login = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [storedFaceDescriptor, setStoredFaceDescriptor] = useState(null);

  // Load the stored face descriptor from local storage
  const loadStoredFace = () => {
    const descriptor = localStorage.getItem('userFace');
    if (descriptor) {
      setStoredFaceDescriptor(JSON.parse(descriptor));
    }
  };

  const handleFaceCaptured = async (capturedDescriptor) => {
    const labeledFaceDescriptors = [new faceapi.LabeledFaceDescriptors('user', storedFaceDescriptor)];
    const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, 0.6); // Threshold for matching

    const detections = await faceapi.detectAllFaces(videoRef.current).withFaceLandmarks().withFaceDescriptors();
    const resizedDetections = faceapi.resizeResults(detections, { width: 640, height: 480 });
    const matches = resizedDetections.map(d => faceMatcher.findBestMatch(d.descriptor));
    
    if (matches.length > 0 && matches[0]._label === 'user') {
      setIsLoggedIn(true);
    } else {
      alert('Login failed. Face not recognized.');
    }
  };

  useEffect(() => {
    loadStoredFace();
  }, []);

  return (
    <div>
      <h1>Login</h1>
      {isLoggedIn ? (
        <h2>Welcome Back!</h2>
      ) : (
        <FaceApi onFaceCaptured={handleFaceCaptured} />
      )}
    </div>
  );
};

export default Login;
