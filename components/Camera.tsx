import { useState, useEffect, useRef } from "react";

const Camera = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null); // Canvas ref
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null); // Store the stream
  const [capturedImage, setCapturedImage] = useState<string | null>(null); // Store captured image
  const capturingRef = useRef(false); // Track if a capture is in progress

  // Function to start the camera
  const startCamera = async () => {
    try {
      const cameraStream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      if (videoRef.current) {
        videoRef.current.srcObject = cameraStream;
      }
      setStream(cameraStream);
      setIsCameraOn(true);
    } catch (err) {
      console.error("Error accessing camera: ", err);
      alert("Camera access is denied or not available.");
    }
  };

  // Function to stop the camera
  const stopCamera = () => {
    if (stream) {
      const tracks = stream.getTracks();
      tracks.forEach((track) => track.stop()); // Stop all media tracks
      setStream(null);
    }
    setIsCameraOn(false);
  };

  // Function to capture the image
  const captureImage = () => {
    // Prevent multiple captures if one is already in progress
    if (capturingRef.current) return;

    capturingRef.current = true; // Set capturing flag to true

    if (canvasRef.current && videoRef.current) {
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      if (
        context &&
        videoRef.current.videoWidth &&
        videoRef.current.videoHeight
      ) {
        // Set canvas size to match the video feed
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;

        // Draw the current frame from the video element onto the canvas
        context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

        // Get the image data from the canvas and convert it to a data URL
        const imageUrl = canvas.toDataURL("image/png");
        setCapturedImage(imageUrl); // Set captured image in state
      }
    }

    // Reset the capturing flag after a short delay to ensure capture happens once
    setTimeout(() => {
      capturingRef.current = false;
    }, 500); // You can adjust the timeout duration as necessary
  };

  // Cleanup the camera on component unmount
  useEffect(() => {
    return () => {
      if (stream) {
        stopCamera();
      }
    };
  }, [stream]);

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <h1 className="text-2xl font-semibold text-gray-800">
        {isCameraOn ? "Camera is On" : "Camera is Off"}
      </h1>

      <div className="relative w-full max-w-md">
        <video
          ref={videoRef}
          autoPlay
          className="w-full h-auto border-2 border-gray-300 rounded-lg shadow-lg"
        />
      </div>

      {/* Button to toggle camera */}
      <button
        onClick={() => {
          if (isCameraOn) {
            stopCamera();
          } else {
            startCamera();
          }
        }}
        className={`px-6 py-2 text-white rounded-lg ${
          isCameraOn
            ? "bg-red-600 hover:bg-red-700"
            : "bg-green-600 hover:bg-green-700"
        }`}
      >
        {isCameraOn ? "Turn Off Camera" : "Turn On Camera"}
      </button>

      {/* Button to capture image */}
      {isCameraOn && (
        <button
          onClick={captureImage}
          className="mt-4 px-6 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg"
        >
          Capture Image
        </button>
      )}

      {/* Display captured image */}
      {capturedImage && (
        <div className="mt-6 text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Captured Image
          </h2>
          <img
            src={capturedImage}
            alt="Captured"
            className="max-w-full rounded-lg border-2 border-gray-300 shadow-lg"
          />
        </div>
      )}

      {/* Hidden canvas for capturing image */}
      <canvas ref={canvasRef} style={{ display: "none" }} />
    </div>
  );
};

export default Camera;
