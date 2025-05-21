import { useEffect } from "react";

interface PopupProps {
    message: string;
    status: "success" | "error";
    onClose: () => void;
}

const Popup = ({ message, status, onClose }: PopupProps) => {
    useEffect(() => {
        const timer = setTimeout(() => {
        onClose?.();
        }, 2000);
        return () => clearTimeout(timer);
    }, [onClose]);

    if (!message) return null;

    const bgColor = status === 'error' ? 'bg-red-500' : 'bg-blue-500';

    return (
        <div className={`fixed top-5 left-1/2 transform -translate-x-1/2 z-[9999] min-w-[270px] max-w-[40%] ${bgColor} text-white px-4 py-3 rounded-lg shadow-lg flex justify-between items-center`}>
        <span>
            {message.split('\n').map((line, i) => (
            <span key={i}>
                {line}
                <br />
            </span>
            ))}
        </span>
        <button
            className="ml-4 text-white text-lg hover:text-gray-200 focus:outline-none"
            onClick={onClose}
        >
            ✕
        </button>
        </div>
    );
};

export default Popup;
