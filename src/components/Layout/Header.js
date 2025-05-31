import { useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Supprimer les informations de session
    sessionStorage.clear();
    // Rediriger vers la page de connexion
    navigate('/');
  };

  return (
    <div className="p-4 text-white flex justify-between">
      <h1 className="text-xl"></h1>
      <button onClick={handleLogout} className="bg-red-500 py-1 px-3 rounded">Logout</button>
    </div>
  );
};

export default Header;