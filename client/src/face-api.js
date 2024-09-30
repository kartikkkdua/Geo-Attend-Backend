// src/FaceApi.js
import React, { useEffect, useRef, useState } from 'react';
import * as faceapi from 'face-api.js';

const FaceApi = ({ onFaceCaptured }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isFaceDetected, setIsFaceDetected] = useState(false);
  const [faceDescriptors, setFaceDescriptors] = useState([]);

  const loadModels = async () => {
    const MODEL_URL = '/models'; // Ensure this path is correct
    await Promise.all([
      faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
      faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
      faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
    ]);
  };

  const startVideo = () => {
    navigator.mediaDevices.getUserMedia({ video: {} })
      .then(stream => {
        videoRef.current.srcObject = stream;
      })
      .catch(err => console.error("Error accessing the camera: ", err));
  };

  const handleVideoOnPlay = async () => {
    const displaySize = { width: videoRef.current.width, height: videoRef.current.height };
    faceapi.matchDimensions(canvasRef.current, displaySize);

    const detections = await faceapi.detectAllFaces(videoRef.current, new faceapi.SsdMobilenetv1Options())
      .withFaceLandmarks()
      .withFaceDescriptors();

    const resizedDetections = faceapi.resizeResults(detections, displaySize);

    if (resizedDetections.length > 0) {
      setIsFaceDetected(true);
      const descriptors = resizedDetections.map(d => d.descriptor);
      setFaceDescriptors(descriptors);
    } else {
      setIsFaceDetected(false);
      setFaceDescriptors([]); // Reset face descriptors if no face is detected
    }

    canvasRef.current.getContext('2d').clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    faceapi.draw.drawDetections(canvasRef.current, resizedDetections);
    faceapi.draw.drawFaceLandmarks(canvasRef.current, resizedDetections);
  };

  const captureFace = () => {
    console.log("Capture button clicked"); // Log button click
    if (faceDescriptors.length > 0) {
      // Pass the first descriptor to the parent component
      onFaceCaptured(faceDescriptors[0]);
      alert("Face captured!"); // Feedback to the user
    } else {
      alert("No face detected to capture!");
    }
  };

  useEffect(() => {
    loadModels().then(startVideo);
  }, []);

  return (
    <div className="relative">
      <video
        ref={videoRef}
        onPlay={handleVideoOnPlay}
        width="640"
        height="480"
        autoPlay
        muted
        className="border border-gray-300 rounded"
      />
      <canvas ref={canvasRef} style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }} />
      {isFaceDetected && <h2 className="text-green-500">Face Detected!</h2>}
      {!isFaceDetected && <h2 className="text-red-500">No Face Detected</h2>}
      <button
        onClick={captureFace}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        Capture Face
      </button>
    </div>
  );
};

export default FaceApi;
