import{ useEffect, useState } from "react";
import { FiCopy, FiCamera } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const ScannerResult = () => {
  const [scannedCode, setScannedCode] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Get the scanned code from localStorage
    const code = localStorage.getItem("scannedCode");
    if (!code) {
      // If no code is found, redirect to home
      navigate("/");
      return;
    }

    setScannedCode(code);
  }, [navigate]);

  // Function to copy the code to clipboard
  const copyToClipboard = async () => {
    if (!scannedCode) return;

    try {
      await navigator.clipboard.writeText(scannedCode);
      setCopySuccess(true);
      // Reset copy success message after 2 seconds
      setTimeout(() => {
        setCopySuccess(false);
      }, 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  // Navigate back to home page to scan another code
  const goBack = () => {
    // Clear the stored code
    localStorage.removeItem("scannedCode");
    navigate("/");
  };

  if (!scannedCode) {
    return null; // Component will redirect, no need to render anything
  }

  // Function to determine if the scanned text is a URL
  const isUrl = (text: string) => {
    try {
      new URL(text);
      return true;
    } catch {
      return false;
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6 md:p-8 animate-fade-in">
        <h2 className="text-2xl font-bold text-center mb-6 text-qr-accent">
          Scanned QR Code
        </h2>

        <div className="bg-gray-50 p-4 rounded-lg mb-6 max-h-[300px] overflow-auto">
          <div className="text-gray-800 break-words">
            {isUrl(scannedCode) ? (
              <a
                href={scannedCode}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline hover:text-blue-800"
              >
                {scannedCode}
              </a>
            ) : (
              <span>{scannedCode}</span>
            )}
          </div>
        </div>

        {copySuccess && (
          <div className="bg-green-100 text-green-700 p-2 rounded mb-4 text-center">
            Copied to clipboard!
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 mt-4">
          <button
            className="flex items-center justify-center gap-2 border text-gray-900 py-2 px-4 rounded transition-colors"
            onClick={copyToClipboard}
          >
            <FiCopy className="h-4 w-4" />
            Copy to Clipboard
          </button>

          <button
            className="flex-1 flex items-center justify-center gap-2 border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 py-2 px-4 rounded transition-colors"
            onClick={goBack}
          >
            <FiCamera className="h-4 w-4" />
            Scan New Code
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScannerResult;
