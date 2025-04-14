// import { useEffect, useRef, useState } from "react";
// import { Html5Qrcode } from "html5-qrcode";
// import { useNavigate } from "react-router-dom";



// const QRScanner = () => {
//   const navigate = useNavigate();
//   const scannerRef = useRef<Html5Qrcode | null>(null);
//   const containerRef = useRef<HTMLDivElement>(null);
//   const [isScanning, setIsScanning] = useState<boolean>(false);
//   const [scanError, setScanError] = useState<string | null>(null);

//   // Function to safely stop the scanner
//   const safelyStopScanner = async () => {
//     try {
//       if (scannerRef.current && isScanning) {
//         await scannerRef.current.stop();
//         setIsScanning(false);
//       }
//     } catch (error) {
//       console.error("Error stopping scanner (handled):", error);
//       // Don't show this error to the user, just log it
//     }
//   };

//   useEffect(() => {
//     // Function to start scanning
//     const startScanner = async () => {
//       try {
//         if (!containerRef.current) return;

//         const qrScanner = new Html5Qrcode("qr-reader");
//         scannerRef.current = qrScanner;

//         const qrCodeSuccessCallback = (decodedText: string) => {
//           // Safely stop scanning once we get a result
//           safelyStopScanner()
//             .then(() => {
//               // Store the result in local storage for the result page to access
//               localStorage.setItem("scannedCode", decodedText);
//               navigate("/result");
//             })
//             .catch((error) => {
//               console.error("Error after stopping scanner:", error);
//             });
//         };

//         const config = {
//           fps: 10,
//           qrbox: { width: 250, height: 250 },
//           aspectRatio: 1.0,
//         };

//         await qrScanner.start(
//           { facingMode: "environment" },
//           config,
//           qrCodeSuccessCallback,
//           undefined
//         );

//         setIsScanning(true);
//       } catch (error) {
//         console.error("Error starting scanner:", error);
//         setScanError("Could not access camera. Please check permissions.");
//       }
//     };

//     startScanner();

//     // Cleanup function to stop scanner when component unmounts
//     return () => {
//       safelyStopScanner();
//     };
//   }, [navigate]);

//   return (
//     <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
//       <div className="bg-white rounded-lg overflow-hidden max-w-md w-full shadow-xl">
//         <div className="p-4 bg-qr-primary text-white flex justify-between items-center">
//           <h3 className="text-lg font-semibold">Scan QR Code</h3>
//         </div>

//         <div className="p-6">
//           <div ref={containerRef} className="scanner-container">
//             <div id="qr-reader"></div>
//           </div>

//           {scanError && (
//             <div className="bg-red-100 text-red-700 p-2 mt-4 rounded text-center">
//               {scanError}
//             </div>
//           )}

//           <p className="text-center mt-4 text-sm text-gray-500">
//             Position the QR code within the scanner frame.
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default QRScanner;





import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { useNavigate } from "react-router-dom";

const QRScanner = () => {
  const navigate = useNavigate();
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanError, setScanError] = useState<string | null>(null);
const hasScannedRef = useRef(false);
  // Function to safely stop the scanner
  const safelyStopScanner = async () => {
    try {
      if (scannerRef.current && isScanning) {
        await scannerRef.current.stop();
        scannerRef.current = null;
        setIsScanning(false);
      }
    } catch (error) {
      console.error("Error stopping scanner (handled):", error);
      // Don't show this error to the user, just log it
    }
  };

  useEffect(() => {
    // Clear any existing instances of the scanner
    const existingElements = document.querySelectorAll("#qr-reader");
    if (existingElements.length > 1) {
      // Remove all except the first one
      for (let i = 1; i < existingElements.length; i++) {
        existingElements[i].remove();
      }
    }

    // Function to start scanning
    const startScanner = async () => {
      try {
        // First, make sure any existing scanner is stopped
        await safelyStopScanner();

        // Check if the element exists before creating a new scanner
        const qrReaderElement = document.getElementById("qr-reader");
        if (!qrReaderElement) {
          setScanError("QR reader element not found");
          return;
        }

        // Create new scanner
        const qrScanner = new Html5Qrcode("qr-reader");
        scannerRef.current = qrScanner;

     const qrCodeSuccessCallback = (decodedText: string) => {
       if (hasScannedRef.current) return; // 👈 Prevent re-entry
       hasScannedRef.current = true;

       safelyStopScanner()
         .then(() => {
           localStorage.setItem("scannedCode", decodedText);
           console.log("Scanned code:", decodedText);
           navigate("/scan-result");
         })
         .catch((error) => {
           console.error("Error after stopping scanner:", error);
         });
     };

        const config = {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0,
        };

        await qrScanner.start(
          { facingMode: "environment" },
          config,
          qrCodeSuccessCallback,
          undefined
        );

        setIsScanning(true);
      } catch (error) {
        console.error("Error starting scanner:", error);
        setScanError("Could not access camera. Please check permissions.");
      }
    };

    // Wait a brief moment before starting the scanner to ensure DOM is ready
    const timer = setTimeout(() => {
      startScanner();
    }, 100);

    // Cleanup function to stop scanner when component unmounts
    return () => {
      clearTimeout(timer);
      safelyStopScanner();
    };
  }, [navigate]);

  return (
    <div className="w-[300px] h-[350px] md:w-[350px] md:h-[410px] md:p-8 bg-white  space-y-4 mx-auto text-center">
      <div className="bg-white  overflow-hidden">
        <div className="">
          <h3 className="text-lg font-semibold">Scan QR Code</h3>
        </div>

        <div className="mt-10 flex flex-col items-center justify-center">
          <div className="scanner-container w-full h-[250px]">
            <div
              id="qr-reader"
              className=" h-full flex items-center justify-between"
            ></div>
          </div>

          {scanError && (
            <div className="bg-red-100 text-red-700 p-2 mt-4 rounded text-center">
              {scanError}
            </div>
          )}

          <p className="text-center mt-6 md:text-sm text-xs text-gray-500">
            Position the QR code within the scanner frame.
          </p>
        </div>
      </div>
    </div>
  );
};

export default QRScanner;