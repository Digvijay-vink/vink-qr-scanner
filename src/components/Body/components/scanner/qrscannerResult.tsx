import { useEffect, useState } from "react";
import { FiCopy } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

interface VCardName {
  first: string;
  last: string;
}

interface VCardAddress {
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

interface VCardPhone {
  number: string;
  type?: string;
}

interface VCardData {
  name?: VCardName;
  fullName?: string;
  organization?: string;
  title?: string;
  address?: VCardAddress;
  phones: VCardPhone[];
  email?: string;
  website?: string;
}

interface WiFiConfig {
  type: string;
  ssid: string;
  password?: string;
  hidden?: boolean;
  encryption?: string;
}

interface MeCardData {
  name?: string;
  reading?: string;
  tel?: string[];
  email?: string[];
  memo?: string;
  birthday?: string;
  address?: string;
  url?: string;
  nickname?: string;
}

interface CalendarEvent {
  summary: string;
  start?: string;
  end?: string;
  location?: string;
  description?: string;
}

interface DecodedResult {
  type: string;
  data: any;
  rawDecoded?: string;
}


const ScannerResult = () => {
  const [scannedCode, setScannedCode] = useState<string | null>(null);
  const [decodedValue, setDecodedValue] = useState<DecodedResult | null>(null);
  const [copySuccess, setCopySuccess] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const code = localStorage.getItem("scannedCode");
    if (!code) {
      navigate("/");
      return;
    }

    setScannedCode(code);
    const decoded = decodeScannedCode(code);
    setDecodedValue(decoded);
  }, [navigate]);

  const copyToClipboard = async () => {
    if (!scannedCode) return;
    try {
      await navigator.clipboard.writeText(scannedCode);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const goBack = () => {
    localStorage.removeItem("scannedCode");
    navigate("/");
  };

  const isUrl = (text: string) => {
    try {
      new URL(text);
      return true;
    } catch {
      return false;
    }
  };

 function parseVCard(vcard: string): VCardData {
   const lines = vcard.split(/\r?\n/);
   const result: VCardData = { phones: [] };

   for (const line of lines) {
     if (!line) continue;

     const [key, ...rest] = line.split(":");
     const value = rest.join(":").trim();
     if (!value) continue;

     if (key.startsWith("N")) {
       const [last, first] = value.split(";");
       result.name = { first, last };
     } else if (key === "FN") {
       result.fullName = value;
     } else if (key === "ORG") {
       result.organization = value;
     } else if (key === "TITLE") {
       result.title = value;
     } else if (key.startsWith("ADR")) {
       const [, , street, city, state, zip, country] = value.split(";");
       result.address = { street, city, state, zip, country };
     } else if (key.startsWith("TEL")) {
       // Improved phone type extraction
       let type = "default";
       if (key.includes("TYPE=")) {
         type = key
           .split("TYPE=")[1]
           .split(";")[0]
           .replace(/[;:]/g, "")
           .toLowerCase();
         // Remove any extra parameters or quotes
         type = type.replace(/"/g, "");
       }
       result.phones.push({ number: value, type });
     } else if (key.startsWith("EMAIL")) {
       result.email = value;
     } else if (key === "URL") {
       result.website = value;
     }
   }

   return result;
 }

  function parseMeCard(mecard: string): MeCardData {
    // Remove the "MECARD:" prefix
    const content = mecard.substring(7);
    const result: MeCardData = {};

    // Split by semicolons but prevent splitting within fields
    const fields = content.split(";");

    const telNumbers: string[] = [];
    const emails: string[] = [];

    for (const field of fields) {
      if (!field) continue;

      // Split by first colon to separate key and value
      const colonIndex = field.indexOf(":");
      if (colonIndex === -1) continue;

      const key = field.substring(0, colonIndex);
      const value = field.substring(colonIndex + 1);

      if (!value) continue;

      switch (key) {
        case "N":
          result.name = value;
          break;
        case "SOUND":
          result.reading = value;
          break;
        case "TEL":
          telNumbers.push(value);
          break;
        case "EMAIL":
          emails.push(value);
          break;
        case "NOTE":
          result.memo = value;
          break;
        case "BDAY":
          result.birthday = value;
          break;
        case "ADR":
          result.address = value;
          break;
        case "URL":
          result.url = value;
          break;
        case "NICKNAME":
          result.nickname = value;
          break;
      }
    }

    if (telNumbers.length > 0) result.tel = telNumbers;
    if (emails.length > 0) result.email = emails;

    return result;
  }

  function parseWiFiConfig(wifiString: string): WiFiConfig {
    // Remove "WIFI:" prefix
    const content = wifiString.substring(5);
    const result: WiFiConfig = { type: "WPA", ssid: "" };
    const fields = content.split(";");

    for (const field of fields) {
      if (!field) continue;

      if (field.startsWith("T:")) {
        result.encryption = field.substring(2);
      } else if (field.startsWith("S:")) {
        result.ssid = field.substring(2);
      } else if (field.startsWith("P:")) {
        result.password = field.substring(2);
      } else if (field.startsWith("H:")) {
        result.hidden = field.substring(2).toLowerCase() === "true";
      }
    }

    return result;
  }

  function parseCalendarEvent(calString: string): CalendarEvent {
    // Handle iCalendar format
    const result: CalendarEvent = { summary: "" };
    const lines = calString.split(/\r?\n/);

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (!line) continue;

      if (line.startsWith("SUMMARY:")) {
        result.summary = line.substring(8);
      } else if (line.startsWith("DTSTART:")) {
        result.start = formatICalDate(line.substring(8));
      } else if (line.startsWith("DTEND:")) {
        result.end = formatICalDate(line.substring(6));
      } else if (line.startsWith("LOCATION:")) {
        result.location = line.substring(9);
      } else if (line.startsWith("DESCRIPTION:")) {
        result.description = line.substring(12);
      }
    }

    return result;
  }

  function formatICalDate(dateStr: string): string {
    // Simple formatting for iCal dates
    try {
      // Handle dates with or without time
      if (dateStr.length === 8) {
        // YYYYMMDD format
        return `${dateStr.substring(0, 4)}-${dateStr.substring(
          4,
          6
        )}-${dateStr.substring(6, 8)}`;
      } else {
        // With time
        const year = dateStr.substring(0, 4);
        const month = dateStr.substring(4, 6);
        const day = dateStr.substring(6, 8);
        const hour = dateStr.substring(9, 11);
        const minute = dateStr.substring(11, 13);
        const second = dateStr.substring(13, 15);

        return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
      }
    } catch (e) {
      return dateStr; // Return original if parsing fails
    }
  }

//function to decode the qr code data
 function decodeScannedCode(raw: string): DecodedResult {
   // Removes extra spaces and newlines
   const cleaned = raw.trim();

   // Common QR code formats with specific prefixes
   const formatDetectors: {
     [prefix: string]: (input: string) => DecodedResult;
   } = {
     "BEGIN:VCARD": (input) => ({
       type: "vcard",
       data: parseVCard(input),
       rawDecoded: input,
     }),

     "MECARD:": (input) => ({
       type: "mecard",
       data: parseMeCard(input),
       rawDecoded: input,
     }),

     "WIFI:": (input) => ({
       type: "wifi",
       data: parseWiFiConfig(input),
       rawDecoded: input,
     }),

     "BEGIN:VCALENDAR": (input) => ({
       type: "calendar",
       data: parseCalendarEvent(input),
       rawDecoded: input,
     }),

     "BEGIN:VEVENT": (input) => ({
       type: "calendar",
       data: parseCalendarEvent(input),
       rawDecoded: input,
     }),

     "mailto:": (input) => ({
       type: "email",
       data: { email: input.substring(7) },
       rawDecoded: input,
     }),

     "tel:": (input) => ({
       type: "phone",
       data: { phoneNumber: input.substring(4) },
       rawDecoded: input,
     }),

     "sms:": (input) => {
       const parts = input.substring(4).split(":");
       return {
         type: "sms",
         data: {
           phoneNumber: parts[0],
           message: parts.length > 1 ? parts[1] : "",
         },
         rawDecoded: input,
       };
     },

     "geo:": (input) => {
       const coords = input.substring(4).split(",");
       return {
         type: "geo",
         data: {
           latitude: parseFloat(coords[0]),
           longitude: parseFloat(coords[1]),
         },
         rawDecoded: input,
       };
     },
   };

   // Check for prefixed formats
   for (const [prefix, handler] of Object.entries(formatDetectors)) {
     if (cleaned.startsWith(prefix)) {
       return handler(cleaned);
     }
   }

   // Try to detect data formats that don't have specific prefixes

   // JSON data
   try {
     const json = JSON.parse(cleaned);
     return { type: "json", data: json, rawDecoded: cleaned };
   } catch (e) {
     // Not JSON, continue to next format
   }

   // Base64 encoded data
   try {
     const base64Decoded = atob(cleaned);

     // Try to parse as JSON first
     try {
       const json = JSON.parse(base64Decoded);
       return { type: "base64-json", data: json, rawDecoded: base64Decoded };
     } catch (e) {
       // Not JSON, but still valid base64
       return {
         type: "base64-text",
         data: base64Decoded,
         rawDecoded: base64Decoded,
       };
     }
   } catch (e) {
     // Not base64, continue to next format
   }

   // URL encoded data
   try {
     const decoded = decodeURIComponent(cleaned);
     if (decoded !== cleaned) {
       return { type: "url-encoded", data: decoded, rawDecoded: decoded };
     }
   } catch (e) {
     // Not URL encoded, continue to next format
   }

   // Hexadecimal encoded data
   if (/^[0-9a-fA-F]+$/.test(cleaned) && cleaned.length % 2 === 0) {
     try {
       const hexDecoded =
         cleaned
           .match(/.{1,2}/g)
           ?.map((byte) => String.fromCharCode(parseInt(byte, 16)))
           .join("") || "";

       if (hexDecoded.length > 0 && /^[\x20-\x7E\s]*$/.test(hexDecoded)) {
         return { type: "hex", data: hexDecoded, rawDecoded: hexDecoded };
       }
     } catch (e) {
       //continue to next format, Not valid hex,
     }
   }

   // Check if it's a URL
   if (isUrl(cleaned)) {
     return { type: "url", data: cleaned, rawDecoded: cleaned };
   }

   // Fallback - treat as plain text
   return { type: "text", data: cleaned, rawDecoded: cleaned };
 }

  function getTypeLabel(type: string): string {
    const typeLabels: Record<string, string> = {
      vcard: "Contact Card (vCard)",
      mecard: "Contact Card (MeCard)",
      wifi: "WiFi Configuration",
      calendar: "Calendar Event",
      email: "Email Address",
      phone: "Phone Number",
      sms: "SMS Message",
      geo: "Geographic Location",
      json: "JSON Data",
      "base64-json": "Base64 Encoded JSON",
      "base64-text": "Base64 Encoded Text",
      "url-encoded": "URL Encoded Data",
      hex: "Hexadecimal Encoded Data",
      url: "URL",
      text: "Plain Text",
    };

    return typeLabels[type] || "Unknown Format";
  }

  const renderDecodedData = (decodedValue: DecodedResult) => {
    switch (decodedValue.type) {
      case "vcard":
        const vcard = decodedValue.data as VCardData;
        return (
          <div className="space-y-2">
            {vcard.fullName && (
              <div>
                <strong>Name:</strong> {vcard.fullName}
              </div>
            )}
            {vcard.organization && (
              <div>
                <strong>Organization:</strong> {vcard.organization}
              </div>
            )}
            {vcard.title && (
              <div>
                <strong>Title:</strong> {vcard.title}
              </div>
            )}
            {vcard.email && (
              <div>
                <strong>Email:</strong> {vcard.email}
              </div>
            )}
            {vcard.phones && vcard.phones.length > 0 && (
              <div>
                <strong>Phone:</strong>
                {vcard.phones.map((phone, i) => (
                  <div key={i} className="ml-2">
                    {phone.type}: {phone.number}
                  </div>
                ))}
              </div>
            )}
            {vcard.website && (
              <div>
                <strong>Website:</strong> {vcard.website}
              </div>
            )}
            {vcard.address && (
              <div>
                <strong>Address:</strong>
                <div className="ml-2">
                  {vcard.address.street && <div>{vcard.address.street}</div>}
                  {vcard.address.city && vcard.address.state && (
                    <div>
                      {vcard.address.city}, {vcard.address.state}{" "}
                      {vcard.address.zip}
                    </div>
                  )}
                  {vcard.address.country && <div>{vcard.address.country}</div>}
                </div>
              </div>
            )}
          </div>
        );

      case "wifi":
        const wifi = decodedValue.data as WiFiConfig;
        return (
          <div className="space-y-2">
            <div>
              <strong>Network:</strong> {wifi.ssid}
            </div>
            {wifi.encryption && (
              <div>
                <strong>Security:</strong> {wifi.encryption}
              </div>
            )}
            {wifi.password && (
              <div>
                <strong>Password:</strong> {wifi.password}
              </div>
            )}
            {wifi.hidden !== undefined && (
              <div>
                <strong>Hidden:</strong> {wifi.hidden ? "Yes" : "No"}
              </div>
            )}
          </div>
        );

      case "calendar":
        const event = decodedValue.data as CalendarEvent;
        return (
          <div className="space-y-2">
            <div>
              <strong>Event:</strong> {event.summary}
            </div>
            {event.start && (
              <div>
                <strong>Start:</strong> {event.start}
              </div>
            )}
            {event.end && (
              <div>
                <strong>End:</strong> {event.end}
              </div>
            )}
            {event.location && (
              <div>
                <strong>Location:</strong> {event.location}
              </div>
            )}
            {event.description && (
              <div>
                <strong>Description:</strong> {event.description}
              </div>
            )}
          </div>
        );

      case "mecard":
        const mecard = decodedValue.data as MeCardData;
        return (
          <div className="space-y-2">
            {mecard.name && (
              <div>
                <strong>Name:</strong> {mecard.name}
              </div>
            )}
            {mecard.tel && mecard.tel.length > 0 && (
              <div>
                <strong>Phone:</strong>
                {mecard.tel.map((phone, i) => (
                  <div key={i} className="ml-2">
                    {phone}
                  </div>
                ))}
              </div>
            )}
            {mecard.email && mecard.email.length > 0 && (
              <div>
                <strong>Email:</strong>
                {mecard.email.map((email, i) => (
                  <div key={i} className="ml-2">
                    {email}
                  </div>
                ))}
              </div>
            )}
            {mecard.address && (
              <div>
                <strong>Address:</strong> {mecard.address}
              </div>
            )}
            {mecard.url && (
              <div>
                <strong>Website:</strong> {mecard.url}
              </div>
            )}
            {mecard.birthday && (
              <div>
                <strong>Birthday:</strong> {mecard.birthday}
              </div>
            )}
            {mecard.memo && (
              <div>
                <strong>Note:</strong> {mecard.memo}
              </div>
            )}
          </div>
        );

      case "email":
        return (
          <div>
            <strong>Email Address:</strong> {decodedValue.data.email}
          </div>
        );

      case "phone":
        return (
          <div>
            <strong>Phone Number:</strong> {decodedValue.data.phoneNumber}
          </div>
        );

      case "sms":
        return (
          <div className="space-y-2">
            <div>
              <strong>Phone Number:</strong> {decodedValue.data.phoneNumber}
            </div>
            {decodedValue.data.message && (
              <div>
                <strong>Message:</strong> {decodedValue.data.message}
              </div>
            )}
          </div>
        );

      case "geo":
        return (
          <div className="space-y-2">
            <div>
              <strong>Latitude:</strong> {decodedValue.data.latitude}
            </div>
            <div>
              <strong>Longitude:</strong> {decodedValue.data.longitude}
            </div>
          </div>
        );

      case "url":
        return (
          <div>
            <a
              href={decodedValue.data}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline hover:text-blue-800"
            >
              {decodedValue.data}
            </a>
          </div>
        );

      default:
        // For json, base64, hex, and other formats
        return typeof decodedValue.data === "object" ? (
          <pre className="whitespace-pre-wrap">
            {JSON.stringify(decodedValue.data, null, 2)}
          </pre>
        ) : (
          <div>{decodedValue.data}</div>
        );
    }
  };

  if (!scannedCode) return null;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6 md:p-8 animate-fade-in">
        <h2 className="text-2xl font-bold text-center mb-6 text-qr-accent">
          Scanned QR Code
        </h2>

        {/* <div className="bg-gray-50 p-4 rounded-lg mb-6 max-h-[300px] overflow-auto">
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
        </div> */}

        {decodedValue && (
          <>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              {getTypeLabel(decodedValue.type)}:
            </h3>
            <div className="bg-gray-100 p-3 rounded mb-6 text-sm max-h-[300px] overflow-auto">
              {renderDecodedData(decodedValue)}
            </div>

           
            {/* {decodedValue.rawDecoded &&
              decodedValue.rawDecoded !== scannedCode && (
                <div className="mt-4">
                  <details>
                    <summary className="text-sm font-medium text-gray-600 cursor-pointer">
                      Show Raw Decoded Data
                    </summary>
                    <div className="mt-2 bg-gray-50 p-3 rounded text-xs overflow-auto max-h-[150px]">
                      {decodedValue.rawDecoded}
                    </div>
                  </details>
                </div>
              )} */}
          </>
        )}

        {copySuccess && (
          <div className="bg-green-100 text-green-700 p-2 rounded mb-4 text-center">
            Copied to clipboard!
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 mt-4">
          {/* <button
            className="flex items-center justify-center gap-2 border text-gray-900 py-2 px-4 rounded transition-colors"
            onClick={copyToClipboard}
          >
            <FiCopy className="h-4 w-4" />
            Copy to Clipboard
          </button> */}

          <button
            className="flex items-center justify-center gap-2 border text-gray-900 py-2 px-4 rounded transition-colors"
            onClick={copyToClipboard}
          >
            <FiCopy className="h-4 w-4" />
            Run Research
          </button>

          <button
            className="flex items-center justify-center gap-2 border text-gray-900 py-2 px-4 rounded transition-colors"
            onClick={goBack}
          >
            <FiCopy className="h-4 w-4" />
            Add to Environment
          </button>
          {/* <button
            className="flex-1 flex items-center justify-center gap-2 border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 py-2 px-4 rounded transition-colors"
            onClick={goBack}
          >
            <FiCamera className="h-4 w-4" />
            Scan New Code
          </button> */}
        </div>
      </div>
    </div>
  );
};

export default ScannerResult;