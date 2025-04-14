import React from "react";
interface Props {
  image: string;
  onRetake: () => void;
}

const PhotoResult: React.FC<Props> = ({ image, onRetake }) => {
  const saveToLocal = () => {
    const link = document.createElement("a");
    link.href = image;
    link.download = "captured_photo.png";
    link.click();
  };

  return (
    <div className="space-y-4">
      <img src={image} alt="Captured" className="w-full rounded-md" />
      <div className="flex justify-center gap-4">
        <button
          onClick={saveToLocal}
          className="mt-4 bg-gradient-to-r from-[#ff8a8a] to-gray-100 text-black font-semibold py-2 px-4 rounded-md flex items-center justify-center gap-2 hover:opacity-90 transition"
        >
          Save to Local
        </button>
        <button
          onClick={onRetake}
          className="mt-4 bg-gradient-to-r from-gray-500 to-gray-100 text-black font-semibold py-2 px-4 rounded-md flex items-center justify-center gap-2 hover:opacity-90 transition"

        >
          Take Again
        </button>
      </div>
    </div>
  );
};

export default PhotoResult;
