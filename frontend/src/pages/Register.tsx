import { useState, useEffect } from 'react'
import Popup from '../components/Popup.tsx';
import { useNavigate, Link } from 'react-router-dom';
import '../index.css';
import '../App.css';

function Register() {
    const navigate = useNavigate();
    const [username, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
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

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setError('')
        if (!username || !email || !password || !confirmPassword) {
            setError('Please fill in all fields.')
            return
        }
        if (password !== confirmPassword) {
            setError('Passwords do not match.')
            return
        }
        // Prepare the data for the API call
        const requestData = {
            username,
            email,
            password
        };
        // send an api call to the backend
        try {
        // Send the POST request to the backend
        const response = await fetch('http://localhost:5000/register', {
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
        navigate('/login'); // Redirect to the login page
        localStorage.setItem('user-email', email);
        // localStorage.setItem('user-token', data.token); // save token to localStorage
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
            <div className="w-full max-w-sm">
                <form
                onSubmit={handleSubmit}
                className="bg-white p-6 rounded shadow-md space-y-4"
                >
                <h2 className="text-2xl font-bold text-center">Register</h2>
                {popupVisible && (
                    <Popup
                    message={errorPopup || messagePopup}
                    status={errorPopup ? 'error' : 'success'}
                    onClose={closePopup}
                    />
                )}
                <input
                    type="text"
                    placeholder="Name"
                    value={username}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-2 border rounded"
                    required
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                <input
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full p-2 border rounded"
                    required
                />
                <button
                    type="submit"
                    className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
                >
                    Register
                </button>
                </form>
                <Link to="/login" className="text-blue-600 hover:underline">Already have an account? Login</Link>
            </div>
        </div>
    )
}

export default Register
