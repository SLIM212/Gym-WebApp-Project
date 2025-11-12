import { useState, useEffect } from 'react';
import Popup from "../components/Popup";
import { useNavigate, Link } from 'react-router-dom';
import '../index.css';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorPopup, setError] = useState('');
  const [messagePopup, setMessage] = useState('');
  const [popupVisible, setMessageVisible] = useState(false);

  // Redirect user if already logged in
  useEffect(() => {
    if (localStorage.getItem('user-token')) {
      navigate('/dashboard');
    }
  }, [navigate]);

  // Show popup when error or message changes
  useEffect(() => {
    if (errorPopup || messagePopup) {
      setMessageVisible(true);
    }
  }, [errorPopup, messagePopup]);

  // Close popup handler
  const closePopup = () => {
    setMessageVisible(false);
    setError('');
    setMessage('');
  };

  // Handle login form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const token = await userCredential.user.getIdToken();
      localStorage.setItem('user-token', token);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4 py-6">
      <div className="flex flex-col">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded shadow-md w-full max-w-sm space-y-4"
        >
          <h2 className="text-2xl font-bold text-center">Login</h2>

          {popupVisible && (
            <Popup
              message={errorPopup || messagePopup}
              status={errorPopup ? 'error' : 'success'}
              onClose={closePopup}
            />
          )}

          <input
            type="text"
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
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Log In
          </button>
        </form>

        <Link
          to="/register"
          className="text-blue-600 hover:underline mt-2 text-center"
        >
          Don't have an account? Register
        </Link>
      </div>
    </div>
  );
}

export default Login;
