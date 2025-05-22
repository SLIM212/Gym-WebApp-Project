import { useState, useEffect } from 'react'
import Popup from "../components/Popup";
import { useNavigate, Link } from 'react-router-dom';
import '../index.css';

function Login() {
    const navigate = useNavigate();
    const [usernameOrEmail, setEmailorUserName] = useState('')
    const [password, setPassword] = useState('')
    const [errorPopup, setError] = useState('')
    const [messagePopup, setMessage] = useState('')
    const [popupVisible, setMessageVisible] = useState(false);

    // to prevent users from navigating to login page if they are already logged in via the search bar
    useEffect(() => {
        if (localStorage.getItem('user-token')) {
            navigate('/dashboard');
        }
    }, [navigate]);

    // Trigger the popup visibility when either errorPopup or messagePopup changes
    useEffect(() => {
        if (errorPopup || messagePopup) {
            setMessageVisible(true);  // Show popup if there's an error or message
        }
    }, [errorPopup, messagePopup]);

    // Handle popup close action
    const closePopup = () => {
        setMessageVisible(false);
        setError('');  // Clear error message
        setMessage('');  // Clear general message
    };
        
    // // submitting login info
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setError('')
        if (!usernameOrEmail || !password) {
            setError('Please enter both email and password.')
        return
        }
        // Prepare the data for the API call
        const requestData = {
            usernameOrEmail,
            password,
        };
        // send an api call to the backend
        try {
        // Send the POST request to the backend
        const response = await fetch(`${import.meta.env.VITE_API_URL}/login`, {
            method: 'POST', // Specify the HTTP method
            headers: {
            'Content-Type': 'application/json', // Send data as JSON
            },
            body: JSON.stringify(requestData), // Convert the request data to a JSON string
        });
        // Handle successful registration
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error);
        }
        navigate('/dashboard'); // Redirect to the Dashboard page
        localStorage.setItem('user-token', data.token); // save token to localStorage
        // to use for creating games
        localStorage.setItem('user-email', usernameOrEmail);
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError("An unknown error occurred");
            }
        }
            
    }
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4 py-6">
            <div className="flex flex-col">
                <form
                    onSubmit={handleSubmit}
                    className="bg-white p-6 rounded shadow-md w-full max-w-sm space-y-4"
                >
                <h2 className="text-2xl font-bold text-center">Login</h2>
                {/* Show the popup if it's visible */}
                {popupVisible && (
                    <Popup
                        message={errorPopup || messagePopup}  // Display either errorPopup or messagePopup
                        status={errorPopup ? 'error' : 'success'}  // Choose status based on errorPopup
                        onClose={closePopup}  // Close the popup
                    />
                )}
                <input
                    type="text"
                    placeholder="Email or Username"
                    value={usernameOrEmail}
                    onChange={(e) => setEmailorUserName(e.target.value)}
                    className="w-full p-2 border rounded"
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-2 border rounded"
                    required
                />
                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                >
                    Log In
                </button>
                </form>
                <Link to="/register" className="text-blue-600 hover:underline">{`Don't have an account? Register`}</Link>
            </div>
        </div>
    )
}

export default Login
