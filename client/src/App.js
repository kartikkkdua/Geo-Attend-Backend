// src/App.js
import React, { useState } from 'react';
import FaceApi from './face-api';

const App = () => {
  const [capturedFace, setCapturedFace] = useState(null);

  const handleFaceCaptured = (descriptor) => {
    console.log("Captured Face Descriptor:", descriptor);
    setCapturedFace(descriptor);
  };

  return (
    <div>
      <h1>Face Capture App</h1>
      <FaceApi onFaceCaptured={handleFaceCaptured} />
      {capturedFace && <p>Face captured successfully!</p>}
    </div>
  );
};

export default App;
