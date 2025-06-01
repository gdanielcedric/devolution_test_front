import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import axios from 'axios';

import Header from './Layout/Header';

import ErrorPopup from './ErrorPopup';
import LoadingSpinner from './LoadingSpinner';

const AddSubscription = () => {
  const navigate = useNavigate(); // Pour rediriger après la soumission

  // get list of products
  const [products, setProducts] = useState([]);
  // get id product
  const [idAssurProduct, setIdAssurProduct] = useState('');
    // get list of vehicles category
  const [categories, setCategories] = useState([]);
  // form step
  const [step, setStep] = useState(1);
  // form vehicle
  const [formVehicle, setFormVehicle] = useState({
    couleur: "",
    idCategoryVehicle: "",
    dateFirstUse: Date.now(),
    siegeNumber: 0,
    porteNumber: 0,
    immatriculation: "",
    valueNeuve: 0,
    valueVenale: 0,
    fiscalPower: 0
  });
    // form suscriber
  const [formSuscriber, setFormSuscriber] = useState({
    address: "",
    cni: "",
    nom: "",
    prenom: "",
    ville: "",
    telephone: ""
  });

  // quote reference
  const [quoteReference, setQuoteReference] = useState('');
  // prime
  const [prime, setPrime] = useState(0);
  // endDate
  const [endDate, setEndDate] = useState('');

  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(100); // taille par défaut
  // filtre pour les produits
  const [FilterProduct, setFilterProduct] = useState({
    name: ""
  });
  // filtre pour les catégories
  const [FilterCat, setFilterCat] = useState({
    code: "",
    libelle: ""
  });
  
  const [loading, setLoading] = useState(false); // État de chargement
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Démarrer le spinner
    setIsLoading(true);  // Activer le chargement

    // get token from session storage
    const user = JSON.parse(sessionStorage.getItem('user'));
    const token = user?.token;

    //endpoint
    const createEndpoint = `${process.env.REACT_APP_API_URL}${process.env.REACT_APP_SUBSCRIPTIONS_ENDPOINT}`;

    try {
      // format data for the subscription
      const SubscriptionDTO = {
        idAssurProduct: idAssurProduct,
        vehicle: formVehicle,
        suscriber: formSuscriber
      }

      // send data to the API
      const response = await axios.post(
        createEndpoint,
        SubscriptionDTO,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        }
      );

      console.log('Subscription ajouté avec succès', response.data);
      setStep(4); // Afficher le résumé
      setQuoteReference(response.data.quoteReference);
      setPrime(response.data.price);
      setEndDate(response.data.endDate);
    } catch (error) {
      console.error('Erreur lors de la création de la Subscription', error);
      setErrorMessage('Erreur lors de la création de la Subscription');
    }
    finally {
      setLoading(false); // Arrêter le spinner
      setIsLoading(false);  // Désactiver le chargement
    }
  };

  const handleChange = (e) => {
    setFormVehicle({
      ...formVehicle,
      [e.target.name]: e.target.value
    });
  };

  const handleChangeSus = (e) => {
    setFormSuscriber({
      ...formSuscriber,
      [e.target.name]: e.target.value
    });
  };

  const closeErrorPopup = () => {
    setErrorMessage('');
  };

  // load products from API
  const fetchDataProducts = async (token) => {
    //config
    const config = {
      headers: { Authorization: `Bearer ${token}` }
    };
    // data to send
    const dataSend = {pageIndex, pageSize, FilterProduct};
    //endpoint
    const listEndpoint = `${process.env.REACT_APP_API_URL}${process.env.REACT_APP_PRODUCTS_ENDPOINT}/all`;

    try {
      const response = await axios.post(listEndpoint, dataSend, config); // Remplacer par ton endpoint
      console.log('Data à afficher (Products)', response);
      setProducts(response.data.items); // Mettre à jour les données récupérées
    } catch (error) {
      console.error('Erreur lors de la récupération des données', error);
      setErrorMessage('Erreur lors du chargement des données.');
    }
    finally {
      setIsLoading(false);  // Désactiver le chargement
    }
  };

    // load categories from API
  const fetchDataCategories = async (token) => {
    //config
    const config = {
      headers: { Authorization: `Bearer ${token}` }
    };
    // data to send
    const dataSend = {pageIndex, pageSize, FilterCat};
    //endpoint
    const listEndpoint = `${process.env.REACT_APP_API_URL}${process.env.REACT_APP_CATEGORIES_ENDPOINT}/all`;

    try {
      const response = await axios.post(listEndpoint, dataSend, config); // Remplacer par ton endpoint
      console.log('Data à afficher (Categories)', response);
      setCategories(response.data.items); // Mettre à jour les données récupérées
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
      fetchDataProducts(user.token);
      fetchDataCategories(user.token);
    }
  }, []);
  
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
                <h2 className="text-2xl font-bold mb-6 text-center">Faire une souscription</h2>
                
                {/* Progress bar */}
                <div className="flex justify-between mb-8">
                  <div className={`w-1/4 h-4 rounded-md transition-all ${step >= 1 ? 'bg-green-600' : 'bg-gray-300'} mr-4`} />
                  <div className={`w-1/4 h-4 rounded-md transition-all ${step >= 2 ? 'bg-green-600' : 'bg-gray-300'} mr-3`} />
                  <div className={`w-1/4 h-4 rounded-md transition-all ${step >= 3 ? 'bg-green-600' : 'bg-gray-300'} mr-2`} />
                  <div className={`w-1/4 h-4 rounded-md transition-all ${step >= 4 ? 'bg-green-600' : 'bg-gray-300'} mr`} />
                </div>
                
                {step === 1 && (
                  <div className="animate-fade-in">
                    <div className="mb-4">
                      <label className="block font-semibold">Produit d'assurance</label>
                      <select
                        name="idAssurProduct"
                        value={idAssurProduct}
                        onChange={e => setIdAssurProduct(e.target.value)}
                        className="w-full border rounded p-2"
                        required
                      >
                        <option value="">-- Choisir un produit --</option>
                        {products.map((product) => (
                          <option key={product.id} value={product.id}>{product.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="mb-4">
                      <label className="block font-semibold">Catégorie du véhicule</label>
                      <select
                        name="idCategoryVehicle"
                        value={formVehicle.idCategoryVehicle}
                        onChange={handleChange}
                        className="w-full border rounded p-2"
                        required
                      >
                        <option value="">-- Choisir une catégorie --</option>
                        {categories.map((category) => (
                          <option key={category.id} value={category.id}>{category.code} - {category.libelle}</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex justify-end">
                      <button type="button" onClick={() => setStep(2)}
                        className="bg-green-600 text-white px-6 py-2 rounded-lg font-bold hover:opacity-90 transition">Suivant
                      </button>
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="animate-fade-in">
                    <div className="mb-4">
                      <label className="block text-gray-700">Couleur du véhicule</label>
                      <input
                        type="text" value={formVehicle.couleur} name='couleur' placeholder='noire, rouge, etc.'
                        onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" required />
                    </div>
                    <div className="mb-4">
                      <label className="block text-gray-700">Date 1ere utilisation</label>
                      <input
                        type="date" value={formVehicle.dateFirstUse} name='dateFirstUse' placeholder='01/01/2023'
                        onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" required />
                    </div>
                    <div className="mb-4">
                      <label className="block text-gray-700">Nombre de sièges</label>
                      <input
                        type="text" value={formVehicle.siegeNumber} name='siegeNumber' placeholder='5'
                        onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" required />
                    </div>
                    <div className="mb-4">
                      <label className="block text-gray-700">Nombre de porières</label>
                      <input
                        type="text" value={formVehicle.porteNumber} name='porteNumber' placeholder='3'
                        onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" required />
                    </div>
                    <div className="mb-4">
                      <label className="block text-gray-700">immatriculation</label>
                      <input
                        type="text" value={formVehicle.immatriculation} name='immatriculation' placeholder='ABCD 2023'
                        onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" required />
                    </div>
                    <div className="mb-4">
                      <label className="block text-gray-700">Valeur Neuve</label>
                      <input
                        type="text" value={formVehicle.valueNeuve} name='valueNeuve' placeholder='0'
                        onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" required />
                    </div>
                    <div className="mb-4">
                      <label className="block text-gray-700">Valeur Venale</label>
                      <input
                        type="text" value={formVehicle.valueVenale} name='valueVenale' placeholder='0'
                        onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" required />
                    </div>
                    <div className="mb-4">
                      <label className="block text-gray-700">Puissance fiscale</label>
                      <input
                        type="text" value={formVehicle.fiscalPower} name='fiscalPower' placeholder='0'
                        onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" required />
                    </div>
                    <div className="flex justify-end">
                      <button type="button" onClick={() => setStep(1)}
                        className="bg-red-600 text-white px-6 py-2 rounded-lg font-bold hover:opacity-90 transition">Précédent
                      </button>
                      <button type="button" onClick={() => setStep(3)}
                        className="bg-green-600 text-white px-6 py-2 rounded-lg font-bold hover:opacity-90 transition">Suivant
                      </button>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="animate-fade-in">
                    <div className="mb-4">
                      <label className="block text-gray-700">Nom</label>
                      <input
                        type="text" value={formSuscriber.nom} name='nom' placeholder='Doe'
                        onChange={handleChangeSus} className="w-full px-4 py-2 border rounded-lg" required />
                    </div>
                    <div className="mb-4">
                      <label className="block text-gray-700">Prenom(s)</label>
                      <input
                        type="text" value={formSuscriber.prenom} name='prenom' placeholder='John'
                        onChange={handleChangeSus} className="w-full px-4 py-2 border rounded-lg" required />
                    </div>
                    <div className="mb-4">
                      <label className="block text-gray-700">Telephone</label>
                      <input
                        type="phone" value={formSuscriber.telephone} name='telephone' placeholder='0102030405'
                        onChange={handleChangeSus} className="w-full px-4 py-2 border rounded-lg" required />
                    </div>
                    <div className="mb-4">
                      <label className="block text-gray-700">CNI</label>
                      <input
                        type="text" value={formSuscriber.cni} name='cni' placeholder='CNI123456789'
                        onChange={handleChangeSus} className="w-full px-4 py-2 border rounded-lg" required />
                    </div>
                    <div className="mb-4">
                      <label className="block text-gray-700">Adresse</label>
                      <input
                        type="text" value={formSuscriber.address} name='address' placeholder='Abidjan, Cocody, etc.'
                        onChange={handleChangeSus} className="w-full px-4 py-2 border rounded-lg" required />
                    </div>
                    <div className="mb-4">
                      <label className="block text-gray-700">Ville</label>
                      <input
                        type="text" value={formSuscriber.ville} name='ville' placeholder='Abidjan'
                        onChange={handleChangeSus} className="w-full px-4 py-2 border rounded-lg" required />
                    </div>
                    <div className="flex justify-end">
                      <button type="button" onClick={() => setStep(2)}
                        className="bg-red-600 text-white px-6 py-2 rounded-lg font-bold hover:opacity-90 transition">Précédent
                      </button>
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
                          'Traitement'
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {/* Étape 3 : Résumé */}
                {step === 4 && (
                  <div>
                    <h2 className="text-xl font-semibold mb-4 text-blue-600">Résumé</h2>
                    <div className="bg-gray-50 p-4 rounded shadow-inner space-y-2">
                      <p><strong>Produit choisi :</strong> {idAssurProduct}</p>
                      <p><strong>Valeur à neuve :</strong> {formVehicle.valueNeuve} XOF</p>
                      <p><strong>Valeur vénale :</strong> {formVehicle.valueVenale} XOF</p>
                      <p><strong>Puissance fiscale :</strong> {formVehicle.fiscalPower} CV</p>

                      <hr className="my-3" />

                      <p><strong>Référence du devis :</strong> {quoteReference}</p>
                      <p><strong>Date de fin de validité :</strong> {endDate}</p>
                      <p><strong>Montant de la prime :</strong> {prime} XOF</p>
                    </div>
                    <div className="mt-4 text-right">
                      <button onClick={() => navigate('/subscriptions')} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                        Terminer
                      </button>
                    </div>
                  </div>
                )}
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddSubscription;