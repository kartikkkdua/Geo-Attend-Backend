import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../AuthContext';
import CalendarView from './Calender';
import ColleaguesList from './List';
import Footer from './Footer';
import * as faceapi from "face-api.js";

function Attendance() {
  const [status, setStatus] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { logout, user, baseurl } = useAuth();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    loadModels().then(startVideo);
  }, []);

  const loadModels = async () => {
    const uri = "/models"; // Path to your model directory
    await faceapi.nets.ssdMobilenetv1.loadFromUri(uri);
    await faceapi.nets.faceLandmark68Net.loadFromUri(uri);
    await faceapi.nets.faceRecognitionNet.loadFromUri(uri);
  };

  const startVideo = () => {
    navigator.mediaDevices.getUserMedia({ video: {} })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch(err => console.error("Error accessing webcam: ", err));
  };

  const handleFaceDetection = async () => {
    if (videoRef.current && canvasRef.current) {
      // Get video dimensions
      const videoWidth = videoRef.current.videoWidth;
      const videoHeight = videoRef.current.videoHeight;

      // Set canvas dimensions to match video
      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;

      // Detect faces
      const detections = await faceapi.detectAllFaces(videoRef.current, new faceapi.SsdMobilenetv1Options())
        .withFaceLandmarks()
        .withFaceDescriptors();

      const resizedDetections = faceapi.resizeResults(detections, { width: videoWidth, height: videoHeight });

      // Clear previous drawings and draw the new detections
      const canvas = canvasRef.current.getContext('2d');
      canvas.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      faceapi.draw.drawDetections(canvasRef.current, resizedDetections);

      if (detections.length > 0) {
        markAttendance();
      }
    }
  };

  const markAttendance = () => {
    if (navigator.geolocation) {
      setIsSubmitting(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const data = {
            userId: user.id,
            latitude,
            longitude,
            checkinTime: new Date().toLocaleTimeString() // Update checkin time dynamically
          };

          try {
            const response = await axios.post(`${baseurl}/mark-attendance`, data);

            if (response.data?.message) {
              setStatus(response.data.message);
            } else {
              setStatus('Error: Unable to process attendance.');
            }
          } catch (error) {
            setStatus(`Failed to mark attendance: ${error.message}`);
          } finally {
            setIsSubmitting(false);
          }
        },
        (error) => {
          setStatus('Failed to retrieve location. Please enable location services.');
          setIsSubmitting(false);
        }
      );
    } else {
      setStatus('Geolocation is not supported by this browser.');
    }
  };

  useEffect(() => {
    const intervalId = setInterval(handleFaceDetection, 1000); // Check for face detection every second

    return () => clearInterval(intervalId); // Cleanup interval on unmount
  }, []);

  return (
    <>
      <div className='flex flex-col lg:flex-row lg:gap-8 gap-6 p-6'>
        {/* Left Section */}
        <div className='lg:w-1/2'>
          <div className="flex gap-6 items-center mb-6">
            <img src={`${baseurl}/uploads/${user.username}.jpg`} alt="User Placeholder" className='w-[100px] h-[100px] rounded-full' />
            <div className='text-lg'>
              <span className='mt-2 font-semibold'>Geofence Attendance System</span><br />
              <span>{`Name: ${user.username}`}</span><br />
              <span>{`Role: ${user.role}`}</span>
            </div>
          </div>

          <div className="relative">
            <video ref={videoRef} autoPlay muted className="w-full rounded-md" />
            <canvas ref={canvasRef} className="absolute top-0 left-0" />
          </div>
          {status && <p className={`mt-2 ${status.includes('Failed') ? 'text-red-500' : 'text-green-500'}`}>{status}</p>}

          <div className='mt-6'>
            <CalendarView />
          </div>
        </div>

        {/* Right Section */}
        <div className='lg:w-1/2'>
          <ColleaguesList />
        </div>
      </div>

      <Footer />
    </>
  );
}

export default Attendance;
