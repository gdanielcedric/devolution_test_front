import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import axios from 'axios';
import * as XLSX from 'xlsx';

import Header from './Layout/Header';

import ErrorPopup from './ErrorPopup';
import LoadingSpinner from './LoadingSpinner';

const TableProduct = () => {
  const [data, setData] = useState([]); // État pour les données récupérées
  const [currentPage, setCurrentPage] = useState(1); // État pour la pagination
  const [itemsPerPage] = useState(50); // Nombre d'éléments par page

  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(50); // taille par défaut
  const [totalItems, setTotalItems] = useState(0);
  const [Filter, setFilter] = useState({
    name: ""
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const fetchData = async (token) => {

    //config
    const config = {
      headers: { Authorization: `Bearer ${token}` }
    };

    // data to send
    const dataSend = {pageIndex, pageSize, Filter};

    //endpoint
    const listEndpoint = `${process.env.REACT_APP_API_URL}${process.env.REACT_APP_PRODUCTS_ENDPOINT}/all`;

    try {
      const response = await axios.post(listEndpoint, dataSend, config); // Remplacer par ton endpoint
      console.log('Data à afficher (products)', response);
      setData(response.data.items); // Mettre à jour les données récupérées
      setTotalItems(response.data.totalItems); // Mettre à jour le nombre total d'éléments
    } catch (error) {
      console.error('Erreur lors de la récupération des données', error);
      setErrorMessage('Erreur lors du chargement des données.');
    }
    finally {
      setIsLoading(false);  // Désactiver le chargement
    }
  };

  // Récupérer les données depuis l'API au montage du composant
  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem('user'));
    if (user?.token) {
      setIsLoading(true);
      fetchData(user.token);
    }
  }, [pageIndex, pageSize]);

  // Fonction pour fermer le popup d'erreur
  const closeErrorPopup = () => {
    setErrorMessage('');
  };

  // Pagination : Calculer les données pour la page actuelle
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentData = data.slice(indexOfFirstItem, indexOfLastItem);

  // Export en CSV
  const exportCSV = () => {
    const csvRows = data.map(item => `${item.name},${item.garanties},${item.categories}`).join("\n");
    const blob = new Blob([csvRows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', 'export_products.csv');
    a.click();
  };

  // Export en Excel
  const exportExcel = () => {
    const filteredForExcel = data.map(({ name, garanties, categories, status}) => ({
      name,
      garanties,
      categories,
      status: status ? 'ACTIF' : 'INACTIF' // Convertir le statut en texte
    }));
    const ws = XLSX.utils.json_to_sheet(filteredForExcel); // Crée la feuille avec les champs filtrés
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Export");
    XLSX.writeFile(wb, "export_products.xlsx");
  };

  const handleFilterChange = (e) => {
    setFilter({
      ...Filter,
      [e.target.name]: e.target.value
    });
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    setPageIndex(0); // reset pagination
    const user = JSON.parse(sessionStorage.getItem('user'));
    if (user?.token) {
      fetchData(user.token);
    }
  };

  const totalPages = Math.ceil(totalItems / pageSize);

  return (
    <>
      <Header/>
      <div>
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            {/* Champ de recherche */}
            <form onSubmit={handleFilterSubmit} className="mb-4 flex flex-wrap gap-2">
              <input
                type="text"
                name="name"
                placeholder="Nom du produit"
                value={Filter.name}
                onChange={handleFilterChange}
                className="border p-2 rounded"
              />
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
                Filtrer
              </button>
            </form>

          <div className="flex justify-between mt-4">
            <button onClick={exportCSV} className="px-4 py-2 bg-blue-500 text-white rounded-lg">
              Exporter CSV
            </button>
            <button onClick={exportExcel} className="px-4 py-2 bg-green-500 text-white rounded-lg">
              Exporter Excel
            </button>
          </div>

        </div>

        {/* Affichage du Spinner pendant le chargement */}
        {isLoading && <LoadingSpinner />}

        {/* Affichage du Popup en cas d'erreur */}
        {errorMessage && <ErrorPopup message={errorMessage} onClose={closeErrorPopup} />}

        {/* Tableau */}
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-gray-800 text-white">
              <th className="px-3 py-2">Nom</th>
              <th className="px-3 py-2">Garanties</th>
              <th className="px-3 py-2">Categories</th>
              <th className="px-3 py-2">Statut</th>
            </tr>
          </thead>
          <tbody>
            {currentData.length > 0 ? (
              currentData.map((item, index) => (
                <tr key={index} className="bg-gray-100">
                  <td className="border px-3 py-2">{item.name}</td>
                  <td className="border px-3 py-2">{item.garanties}</td>
                  <td className="border px-3 py-2">{item.categories}</td>
                  <td className="border px-3 py-2">{item.status == true ? 'ACTIF' : 'INACTIF'}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="text-center py-4">
                  Aucun résultat trouvé
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-4">
          <div>
            Page {pageIndex + 1} / {totalPages || 1}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPageIndex(prev => Math.max(prev - 1, 0))}
              disabled={pageIndex === 0}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Précédent
            </button>
            <button
              onClick={() => setPageIndex(prev => (prev + 1 < totalPages ? prev + 1 : prev))}
              disabled={pageIndex + 1 >= totalPages}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Suivant
            </button>
          </div>
          <div>
            <label className="mr-2">Taille:</label>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(parseInt(e.target.value));
                setPageIndex(0);
              }}
              className="border p-1 rounded"
            >
              {[50, 100, 200].map(size => (
                <option key={size} value={size}>{size}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
      </div>
    </>
  );
};

export default TableProduct;