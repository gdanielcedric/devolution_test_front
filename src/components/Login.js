import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import axios from 'axios';

import ErrorPopup from './ErrorPopup';
import LoadingSpinner from './LoadingSpinner';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  const [loading, setLoading] = useState(false); // État de chargement
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true); // Démarrer le spinner
    setIsLoading(true); 

    const loginEndpoint = `${process.env.REACT_APP_API_URL}${process.env.REACT_APP_AUTH_ENDPOINT}`;
    try {
      const response = await axios.post(loginEndpoint, {
        username: username,
        password: password
      });

      if (response.status === 200) {
        // Stocker les informations de l'utilisateur dans sessionStorage
        sessionStorage.setItem('user', JSON.stringify({
          token: response.data.access_token,
          role: 'user', 
          expiration: response.data.expires_in
        }));

        // Rediriger vers le dashboard
        navigate('/simulations');
      } else {
        console.error("Login failed");
        setErrorMessage('Erreur lors du login !');
      }
    } catch (error) {
      console.error("Login failed", error);
      setErrorMessage('Erreur lors du login !');
    }
    finally {
      setLoading(false); // Arrêter le spinner
      setIsLoading(false);  // Désactiver le chargement
    }
  };

  const closeErrorPopup = () => {
    setErrorMessage('');
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Formulaire à gauche */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8">
        <div className="bg-white p-8 rounded-lg shadow-lg shadow-zinc-950 w-full max-w-md">
          <h2 className="text-2xl font-bold mb-6 text-center text-red-500">Login</h2>
          {/* Affichage du Spinner pendant le chargement */}
          {isLoading && <LoadingSpinner />}

          {/* Affichage du Popup en cas d'erreur */}
          {errorMessage && <ErrorPopup message={errorMessage} onClose={closeErrorPopup} />}
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block text-gray-700">Username</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-red-500 rounded-lg"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700">Password</label>
              <input
                type="password"
                className="w-full px-3 py-2 border border-red-500 rounded-lg"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className={`w-full py-2 rounded-lg text-white bg-green-500 hover:bg-green-700 transition-all duration-300 ${
                loading ? 'cursor-not-allowed opacity-50' : ''
              }`}
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  {/* Spinner */}
                  <svg
                    className="animate-spin h-5 w-5 text-white mr-2"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8z"
                    ></path>
                  </svg>
                  Connecting...
                </div>
              ) : (
                'Login'
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Image à droite, masquée sur les petits écrans */}
      <div className="hidden md:block md:w-1/2">
        <img
          src="https://sayaspora.com/wp-content/uploads/2021/11/IMG_0582-thegem-blog-default.jpg"
          alt="Login Illustration"
          className="object-cover h-full w-full"
        />
      </div>
    </div>
  );
};

export default Login;