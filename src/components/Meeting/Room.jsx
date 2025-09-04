import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useUser from "../../hooks/useUser";

const Room = () => {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showNetworkError, setShowNetworkError] = useState(false);
  const [stream, setStream] = useState(null);

  useEffect(() => {
    let mediaStream = null;

    const startCamera = async () => {
      try {
        if (!videoRef.current) return;
        
        // Request camera access
        const userMediaStream = await navigator.mediaDevices.getUserMedia({ 
          video: true,
          audio: true 
        });
        
        // Connect the stream to the video element
        videoRef.current.srcObject = userMediaStream;
        setStream(userMediaStream);
        setIsLoading(false);
        
        // Show network error after 3-5 seconds
        const timeout = Math.floor(Math.random() * 2000) + 3000;
        setTimeout(() => {
          setShowNetworkError(true);
        }, timeout);
        
        mediaStream = userMediaStream;
      } catch (err) {
        console.error("Error accessing camera:", err);
        // Just keep showing loading if we can't access camera
      }
    };

    // Start camera
    startCamera();

    // Cleanup function
    return () => {
      if (mediaStream) {
        mediaStream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  

  return (
    <div className="w-full h-screen bg-black flex flex-col">
      {/* Just the video */}
      <video 
        ref={videoRef} 
        autoPlay 
        playsInline 
        muted 
        className="w-full h-full object-cover"
      />
      
      {/* Network error modal */}
      {showNetworkError && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl max-w-md text-center">
            <div className="mb-4 text-red-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-red-500 mb-4">Network Connection Error</h2>
            <p className="text-gray-700 mb-4">
              We're having trouble connecting to the network. This might be due to:
            </p>
            <ul className="text-left text-gray-700 mb-6 pl-6 list-disc">
              <li>Poor internet connection</li>
              <li>Network firewall blocking the connection</li>
              <li>Server maintenance</li>
            </ul>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => setShowNetworkError(false)}
                className="px-4 py-2 bg-gradient-to-r from-[#E83B00] to-[#FF7349] text-white rounded-lg hover:shadow-lg transition-all duration-300"
              >
                Dismiss
              </button>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-300"
              >
                Retry Connection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Room;