import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

import LoginPage from './pages/LoginPage';
import AddSimulationPage from './pages/AddSimulationPage';
import AddSubscriptionPage from './pages/AddSubscriptionPage';
import SimulationPage from './pages/SimulationPage';
import SubscriptionPage from './pages/SubscriptionPage';
import SuscriberPage from './pages/SuscriberPage';
import ProductPage from './pages/ProductPage';

import PrivateRoute from "./PrivateRoute";

function App() {
  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem('user'));

    if (user && user.expiration) {
      const expirationTime = user.expiration;

      // Vérifie immédiatement si le token est déjà expiré
      if (Date.now() > expirationTime) {
        handleLogout();
      } else {
        // Déconnecte après le temps restant jusqu'à l'expiration
        const timeRemaining = expirationTime - Date.now();
        setTimeout(() => {
          handleLogout();
        }, timeRemaining);
      }
    }
  }, []);

  const handleLogout = () => {
    // Nettoyer les informations de session et rediriger vers la page de connexion
    sessionStorage.clear();
    alert('Votre session a expiré. Vous avez été déconnecté.');
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route element={<PrivateRoute />}>
            <Route path="/products" element={<ProductPage />} />
        </Route>
        <Route element={<PrivateRoute />}>
            <Route path="/subscriptions" element={<SubscriptionPage />} />
        </Route>
        <Route element={<PrivateRoute />}>
            <Route path="/simulations" element={<SimulationPage />} />
        </Route>
        <Route element={<PrivateRoute />}>
            <Route path="/suscribers" element={<SuscriberPage />} />
        </Route>
        <Route element={<PrivateRoute />}>
            <Route path="/add-simulation" element={<AddSimulationPage />} />
        </Route>
        <Route element={<PrivateRoute />}>
            <Route path="/add-subscription" element={<AddSubscriptionPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;