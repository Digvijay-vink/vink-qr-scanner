import React, { useEffect, useState } from "react";
import { useCamera } from "../../../../hooks/useCamera";
import PhotoResult from "./photoResult";


const PhotoCapture: React.FC = () => {
  const { videoRef, startCamera, stopCamera, takeSnapshot } = useCamera();
  const [image, setImage] = useState<string | null>(null);

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  const handleCapture = () => {
    const snapshot = takeSnapshot();
    if (snapshot) setImage(snapshot);
  };

  const handleRetake = () => {
    setImage(null);
    startCamera();
  };

  return (
    <div className="w-[300px] h-[450px] md:w-[350px] md:h-[410px] md:p-8 bg-white  space-y-4 mx-auto text-center">
      <h2 className="text-xl font-semibold">Take Photo</h2>
      {!image ? (
        <>
          <video ref={videoRef} className="w-full h-full rounded-md" />
          <button
            onClick={handleCapture}
            className="mt-4 bg-gradient-to-r from-[#ff8a8a] to-gray-100 text-black px-6 py-2 rounded-md hover:opacity-90 transition hover:cursor-pointer"
          >
            Take Picture
          </button>
        </>
      ) : (
        <PhotoResult image={image} onRetake={handleRetake} />
      )}
    </div>
  );
};

export default PhotoCapture;
