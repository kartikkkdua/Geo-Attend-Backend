import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../AuthContext';
import CalendarView from './Calender';
import ColleaguesList from './List';
import Footer from './Footer';
import * as faceapi from "face-api.js";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import CSS for toast notifications
import { IconButton, Tooltip } from '@mui/material';
import { CameraAlt, CameraEnhanceRounded, CameraOutdoor, Logout, NoPhotography } from '@mui/icons-material';

function Attendance() {
  const [status, setStatus] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true); // Add loading state
  const { logout, user, baseurl } = useAuth();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [referenceDescriptor, setReferenceDescriptor] = useState(null);
  const [stream, setStream] = useState(null); // Store the camera stream
  const [cameraOn, setCameraOn] = useState(false); // Manage camera state

  useEffect(() => {
    loadModels(); // Load models only once

    return () => stopVideo(); // Stop the video when component unmounts
  }, []);

  const loadModels = async () => {
    const uri = "/models"; // Path to your model directory
    await faceapi.nets.ssdMobilenetv1.loadFromUri(uri);
    await faceapi.nets.faceLandmark68Net.loadFromUri(uri);
    await faceapi.nets.faceRecognitionNet.loadFromUri(uri);

    // Load reference image and extract face descriptor
    const img = await faceapi.fetchImage(`${baseurl}/uploads/${user.username}.jpg`);
    const detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor();
    if (detections) {
      setReferenceDescriptor(detections.descriptor);
    }
  };

  const startVideo = () => {
    setLoading(true); // Set loading to true before starting the video
    navigator.mediaDevices.getUserMedia({ video: {} })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setStream(stream); // Store the stream for later access
          setCameraOn(true); // Camera is now on
          setLoading(false); // Set loading to false once the stream is ready
        }
      })
      .catch(err => {
        console.error("Error accessing webcam: ", err);
        setLoading(false); // Ensure loading stops if there's an error
      });
  };

  const stopVideo = () => {
    if (stream) {
      // Stop all video tracks to turn off the camera
      stream.getTracks().forEach(track => track.stop());
      setCameraOn(false); // Camera is off
    }
  };

  const handleFaceDetection = async () => {
    if (videoRef.current && canvasRef.current) {
      const videoWidth = videoRef.current.videoWidth;
      const videoHeight = videoRef.current.videoHeight;

      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;

      const detections = await faceapi.detectAllFaces(videoRef.current, new faceapi.SsdMobilenetv1Options())
        .withFaceLandmarks()
        .withFaceDescriptors();

      const resizedDetections = faceapi.resizeResults(detections, { width: videoWidth, height: videoHeight });

      const canvas = canvasRef.current.getContext('2d');
      canvas.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      faceapi.draw.drawDetections(canvasRef.current, resizedDetections);

      if (detections.length > 0 && referenceDescriptor) {
        const faceMatcher = new faceapi.FaceMatcher(referenceDescriptor);
        const matchedFace = faceMatcher.findBestMatch(detections[0].descriptor);

        if (matchedFace.label !== 'unknown') {
          markAttendance(); // If matched, mark attendance
        }
      }
    }
  };

  const handelCheckOut = async () => {
    if (navigator.geolocation) {
      setIsSubmitting(true); // Set submitting state to true
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const data = {
            userId: user.id,
            latitude,
            longitude,
            checkoutTime: new Date().toLocaleTimeString() // Add checkout time
          };
  
          try {
            const response = await axios.post(`${baseurl}/mark-checkout`, data);
  
            if (response.data?.message) {
              setStatus(response.data.message);
              toast.success(response.data.message); // Show success toast
              stopVideo(); // Optionally stop the video if you want
            } else {
              setStatus('Error: Unable to process checkout.');
              toast.error('Error: Unable to process checkout.'); // Show error toast
            }
          } catch (error) {
            setStatus(`Failed to mark checkout: ${error.message}`);
            toast.error(`Failed to mark checkout: ${error.message}`); // Show error toast
          } finally {
            setIsSubmitting(false); // Set submitting state to false after the operation
          }
        },
        (error) => {
          setStatus('Failed to retrieve location for checkout. Please enable location services.');
          toast.error('Failed to retrieve location for checkout. Please enable location services.'); // Show error toast
          setIsSubmitting(false); // Set submitting state to false
        }
      );
    } else {
      setStatus('Geolocation is not supported by this browser.');
      toast.error('Geolocation is not supported by this browser.'); // Show error toast
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
          console.log(data);

          try {
            const response = await axios.post(`${baseurl}/mark-attendance`, data);

            if (response.data?.message) {
              setStatus(response.data.message);
              toast.success(response.data.message); // Show success toast
              stopVideo();
              setCameraOn(true)// Stop the camera after marking attendance
            } else {
              setStatus('Error: Unable to process attendance.');
              toast.error('Error: Unable to process attendance.'); // Show error toast
            }
          } catch (error) {
            setStatus(`Failed to mark attendance: ${error.message}`);
            toast.error(`Failed to mark attendance: ${error.message}`); // Show error toast
          } finally {
            setIsSubmitting(false);
          }
        },
        (error) => {
          setStatus('Failed to retrieve location. Please enable location services.');
          toast.error('Failed to retrieve location. Please enable location services.'); // Show error toast
          setIsSubmitting(false);
        }
      );
    } else {
      setStatus('Geolocation is not supported by this browser.');
      toast.error('Geolocation is not supported by this browser.'); // Show error toast
    }
  };

  useEffect(() => {
    if (cameraOn) {
      const intervalId = setInterval(handleFaceDetection, 1000); // Check for face detection every second

      return () => clearInterval(intervalId); // Cleanup interval on unmount
    }
  }, [referenceDescriptor, cameraOn]);

  return (
    <>
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
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
            <div className="mt-4 flex gap-5 items-start'">
              <Tooltip title="Check In">
                <IconButton
                  onClick={cameraOn ? stopVideo : startVideo}
                  className={`px-4 py-2 rounded-md text-white ${cameraOn ? 'bg-red-500' : 'bg-green-500'}`}
                >
                  {cameraOn ? <NoPhotography /> : <CameraAlt />}
                </IconButton>
              </Tooltip>
              <Tooltip title="Check Out">
                <IconButton
                  onClick={handelCheckOut}
                  className={`px-4 py-2 rounded-md text-white ${cameraOn ? 'bg-red-500' : 'bg-green-500'}`}
                >
                  <Logout/>
                </IconButton>
              </Tooltip>
            </div>
          </div>


          <div className="relative">
            {loading && (
              <div className="absolute top-0 left-0 w-full h-full bg-gray-800 bg-opacity-75 flex items-center justify-center">
                <div className="loader"></div>
              </div>
            )}
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
