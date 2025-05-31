import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import axios from 'axios';

import Header from './Layout/Header';

import ErrorPopup from './ErrorPopup';
import LoadingSpinner from './LoadingSpinner';

const AddSubscription = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState(''); // Valeur par défaut
  const [name, setName] = useState('');

  const navigate = useNavigate(); // Pour rediriger après la soumission
  
  const [loading, setLoading] = useState(false); // État de chargement
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Démarrer le spinner
    setIsLoading(true);  // Activer le chargement

    const user = JSON.parse(sessionStorage.getItem('user'));
    const token = user?.token;

    //endpoint
    const createEndpoint = `${process.env.REACT_APP_API_URL}${process.env.REACT_APP_LIST_USER_ENDPOINT}`;

    try {
      const response = await axios.post(
        createEndpoint,
        { email, password, role, name },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log('Utilisateur ajouté avec succès', response.data);
      navigate('/users'); // Redirige vers la liste des utilisateurs
    } catch (error) {
      console.error('Erreur lors de l\'ajout de l\'utilisateur', error);
      setErrorMessage('Erreur lors de l\'ajout de l\'utilisateur');
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
    <>
      <Header/>
      <div>
        <div className="p-4">
          <div className="flex justify-center">
            {/* Affichage du Spinner pendant le chargement */}
            {isLoading && <LoadingSpinner />}

            {/* Affichage du Popup en cas d'erreur */}
            {errorMessage && <ErrorPopup message={errorMessage} onClose={closeErrorPopup} />}

            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center">Créer une simulation</h2>

                <div className="mb-4">
                <label className="block text-gray-700">Nom</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg"
                    required
                />
                </div>

                <div className="mb-4">
                <label className="block text-gray-700">Email</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg"
                    required
                />
                </div>

                <div className="mb-4">
                <label className="block text-gray-700">Mot de passe</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg"
                    required
                />
                </div>

                <div className="mb-4">
                <label className="block text-gray-700">Rôle</label>
                <select
                    name="selectedRole"
                    onChange={(e) => setRole(e.target.value)}
                    defaultValue={""}
                    className="w-full px-4 py-2 border rounded-lg"
                >
                    <option value=""></option>
                    <option value="User">User</option>
                    <option value="Admin">Admin</option>
                    <option value="IT">IT</option>
                    <option value="DCM">DCM</option>
                    <option value="SuperAdmin">SuperAdmin</option>
                </select>
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
                      En cours...
                    </div>
                  ) : (
                    'Créer Simulation'
                  )}
                </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddSubscription;