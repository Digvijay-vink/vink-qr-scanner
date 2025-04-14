import React, { useState, useEffect } from "react";
import { IoMail } from "react-icons/io5";
import { FaCamera } from "react-icons/fa";
import { IoQrCode } from "react-icons/io5";
import EmailForm from "./components/Email/email";
import PhotoCapture from "./components/capturePhoto/capturePhoto";
import QRScanner from "./components/scanner/qrscan";


type Tab = "email" | "photo" | "scan";

const Body: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>("email");

  // Cleanup when switching tabs
  useEffect(() => {
    // If we're not on the scan tab, ensure any existing scanner is destroyed
    if (activeTab !== "scan") {
      // Clean up any existing scanner instances
      const qrReader = document.getElementById("qr-reader");
      if (qrReader) {
        // Remove any child elements to force scanner to reinitialize when tab is selected again
        qrReader.innerHTML = "";
      }
    }
  }, [activeTab]);

  const renderTab = () => {
    switch (activeTab) {
      case "email":
        return <EmailForm />;
      case "photo":
        return <PhotoCapture />;
      case "scan":
        // Only render QRScanner when the scan tab is active
        return <QRScanner />;
      default:
        return null;
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-4.3rem)] md:min-h-[calc(100vh-5.5rem)] px-4">
      <div className="mx-auto flex flex-col items-center justify-around p-4 bg-white rounded-lg shadow-md overflow-hidden">
        {/* Tab Navigation */}
        <div className="flex mb-4">
          <button
            onClick={() => setActiveTab("email")}
            className={`flex items-center gap-1 px-4 py-2 ${
              activeTab === "email"
                ? "border-b-2 border-[#ff8a8a] text-[#ff8a8a]"
                : "text-gray-800"
            }`}
          >
            <IoMail />
            <span>Email</span>
          </button>

          <button
            onClick={() => setActiveTab("photo")}
            className={`flex items-center gap-1 px-4 py-2 ${
              activeTab === "photo"
                ? "border-b-2 border-[#ff8a8a] text-[#ff8a8a]"
                : "text-gray-800"
            }`}
          >
            <FaCamera />
            <span>Photo</span>
          </button>

          <button
            onClick={() => setActiveTab("scan")}
            className={`flex items-center gap-1 px-4 py-2 ${
              activeTab === "scan"
                ? "border-b-2 border-[#ff8a8a] text-[#ff8a8a]"
                : "text-gray-800"
            }`}
          >
            <IoQrCode />
            <span>Scan</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-2 max-h-[70vh] overflow-y-auto">{renderTab()}</div>
      </div>
    </div>
  );
};

export default Body;
