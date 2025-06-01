# devolution_test  

Outils :  
ReactJS  
Axios  
Github  

# I. Architecture

-	Frontend qui consomme l’api  

# II. Recupération du projet et configuraiton  

Saisir les commandes git suivantes pour récupérer les projets api et front :  
- gh repo clone gdanielcedric/devolution_test_front  
Ou les télécharger via les liens suivants :  
https://github.com/gdanielcedric/devolution_test_front.git  
Ensuite ouvrir le dossier : cd /frontend (selon le nom sur lequel vous l'avez enregistré en local)  
Saisir : npm install (pour installer les packages necessaires)  
Saisir : npm start (pour lancer le projet)  

# III. Connexion

Lorsque le projet a été téléchargé et bien configuré, le front est accessible via :  
http://localhost:3000  
Il faudra ensuite se connecter avec l'un des utilisateurs suivants, ou avec celui qui vous aurez créé sur keycloak    

Utilisateurs créés pour test  
gdanielcedric : P@ssword2025! (Admin)  
amazon : P@ssword2025! (Amazon)  

# V. Structure
b-	components  
Contient tous les composants ;  
c-	imgs  
Contient les images du projet, s'il y'en a ;  
d-	pages  
Toutes les pages (une page étant composée de un ou plusieurs composants) du projet  
e-	utility  
les fonctions utiles et réutilisables du projet s'il y'en a  