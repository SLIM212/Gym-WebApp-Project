import dapImage from "../assets/dap.jpg";
import { useNavigate, Link } from 'react-router-dom'
import { LogOut } from 'lucide-react';
import './pages.css';
import backIcon from '../assets/back.png';
import chestIcon from '../assets/chest.png';
import legsIcon from '../assets/legs.png';
import armsIcon from '../assets/arms.png';

const items = [
  { name: 'Back', path: '/exercise/back', color: 'border-pink-500', icon: backIcon },
  { name: 'Chest', path: '/exercise/chest', color: 'border-purple-500', icon: chestIcon },
  { name: 'Legs', path: '/exercise/legs', color: 'border-blue-500', icon: legsIcon },
  { name: 'Arms', path: '/exercise/arms', color: 'border-green-500', icon: armsIcon }
];

export default function DashBoard() {
    const navigate = useNavigate();
    const Logout = () => {
        localStorage.removeItem('user-token');
        localStorage.removeItem('user-email');
        navigate('/login');
    }
return (
    <div className="App">
        <div className="page-header text-center dashboard-header" style={{color:"#fffffe"}}>
            Gym Progress Tracker
        </div>
        <img
            src={dapImage}
            alt="dap-img"
            className="
                mx-auto 
                w-[90%]          /* mobile: 90% width */
                sm:w-[80%]       /* small screens: 80% */
                md:w-[70%]       /* medium screens: 70% */
                lg:w-[60%]       /* large screens: 60% */
                xl:w-[50%]       /* extra-large: 50% */
                max-w-[700px]    /* cap size so it doesn’t get huge on wide monitors */
                rounded-xl
                transition-transform
                duration-300
                hover:scale-105
            "
        />
        <br></br>
        {/* use flex box to make 4 boxes that hover when mouse is over and has text on bottom left in white */}
        <div className="flex flex-wrap gap-4 justify-center p-4">
            {items.map(({ name, path, color, icon }) => (
                <Link
                key={name}
                to={path}
                className={`
                    w-35 h-35 bg-gray-900 rounded-xl border-t-4 ${color} relative overflow-hidden
                    transform transition-all duration-300
                    hover:scale-105 hover:shadow-lg hover:shadow-${color.replace('border-', '')}/50
                    group
                `}
                >
                {/* Background Image fills the box */}
                <img
                    src={icon}
                    alt={`${name} icon`}
                    className="w-full h-full object-contain opacity-90 transition-opacity duration-300 group-hover:opacity-100"
                />

                {/* exercise text name */}
                <span className="absolute bottom-2 left-2 text-white text-sm font-semibold bg-black/50 px-1 rounded">
                    {name}
                </span>
                </Link>
            ))}
        </div>
        <div className="w-full flex justify-end p-4">
            <button
                onClick={Logout}
                style={{ backgroundColor: '#e53170' }}
                className="hover:brightness-110 text-white font-semibold py-2 px-4 rounded inline-flex items-center"
            >
                Logout
                <LogOut className="w-5 h-5 ml-2" />
            </button>
        </div>
    </div>
);
}

