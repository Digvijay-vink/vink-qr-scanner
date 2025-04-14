// components/EmailForm.tsx
import React, { useState } from "react";
import { IoIosSend } from "react-icons/io";
import { useNavigate } from "react-router-dom";

const EmailForm: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();
//   console.log(navigate)

  const validateEmail = (email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleContinue = () => {
    if (validateEmail(email)) {
      setError("");
      navigate("/email-redirect", { state: { email } });
    } else {
      setError("Please enter a valid email address.");
    }
  };

  const handelEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError("");
    setEmail(e.target.value);   
    };
  return (
    <div className=" w-[300px] h-[350px] md:w-[350px] md:h-[410px] md:p-8 bg-white rounded-lg  space-y-4">
      <div className="">
        <h3 className="text-lg text-center font-semibold">Enter Email Id</h3>
      </div>
      <div className="space-y-2">
        <input
          type="email"
          value={email}
          onChange={handelEmailChange}
          placeholder="your.email@example.com"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-200"
        />
        {error && <p className="text-red-400 text-sm">{error}</p>}
      </div>
      <button
        className="w-full mt-4 bg-gradient-to-r from-[#ff8a8a] to-gray-100 text-black font-semibold py-2 px-4 rounded-md flex items-center justify-center gap-2 hover:opacity-90 transition"
        onClick={handleContinue}
      >
        <IoIosSend size={18} /> Continue
      </button>
    </div>
  );
};

export default EmailForm;
