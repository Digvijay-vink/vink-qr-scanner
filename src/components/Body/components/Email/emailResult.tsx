import { useLocation, useNavigate } from "react-router-dom";

const EmailRedirect: React.FC = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const email = state?.email || "Guest";

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center space-y-4 bg-white">
      <h1 className="text-2xl font-bold">Hi {email},</h1>
      <p className="text-gray-600">Hope you are doing well!</p>
      <button
        onClick={() => navigate("/")}
        className="mt-4 bg-white text-black border-2 px-6 py-2 rounded-md hover:bg-gray-400 transition hover:cursor-pointer"
      >
        Go Back Home
      </button>
    </div>
  );
};

export default EmailRedirect;
