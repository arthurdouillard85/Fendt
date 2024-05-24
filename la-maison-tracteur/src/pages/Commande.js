import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/Commande.css";
import Cart from "../components/Cart";
import { useLocation } from "react-router-dom";

function Commande() {
  const [userId, setUserId] = useState("");
  const [role, setRole] = useState("");
  const [userInfo, setUserInfo] = useState({});
  const savedCart = localStorage.getItem("cart");
  const [cart, updateCart] = useState(savedCart ? JSON.parse(savedCart) : []);
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      // Si un token est présent, redirigez l'utilisateur vers la page de profil
      window.location.href = "/products";
    }
    const userIdFromLocalStorage = localStorage.getItem("userId");
    setUserId(userIdFromLocalStorage);

    // Requête pour récupérer le role de l'utilisateur à partir de l'ID de l'utilisateur
    fetch(`http://localhost:3001/profile/${userIdFromLocalStorage}`)
      .then((response) => response.json())
      .then((data) => setUserInfo(data))
      .catch((error) => console.error("Error fetching user info:", error));
  }, [userId]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUserInfo({ ...userInfo, [name]: value });
  };

  const handleOrder = async () => {
    try {
      // Mettre à jour l'adresse
      await axios.post("http://localhost:3001/change-adresse", {
        userId: userId,
        adresse: userInfo.adresse,
      });

      // Mettre à jour le numéro de téléphone
      await axios.post("http://localhost:3001/change-telephone", {
        userId: userId,
        telephone: userInfo.telephone,
      });

      // Mettre à jour la colonne "payer" de tous les articles dans le panier
      await axios.put("http://localhost:3001/payer-panier", {
        userId: parseInt(userId),
      });

      alert("Commande passée avec succès !");
    } catch (error) {
      console.error("Erreur lors de la passation de la commande :", error);
      alert("Erreur lors de la passation de la commande.");
    }
    window.location.href = "/products";
  };

  return (
    <div className="modale-container">
      <div className="commande-page">
        <div className="commande-form">
          <h2>Informations de livraison</h2>
          <form>
            <label>
              Nom:
              <input type="text" name="nom" value={userInfo.nom} readOnly />
            </label>
            <label>
              Prénom:
              <input
                type="text"
                name="prenom"
                value={userInfo.prenom}
                readOnly
              />
            </label>
            <label>
              Adresse:
              <input
                type="text"
                name="adresse"
                value={userInfo.adresse}
                onChange={handleInputChange}
              />
            </label>
            <label>
              Numéro de téléphone:
              <input
                type="text"
                name="telephone"
                value={userInfo.telephone}
                onChange={handleInputChange}
              />
            </label>
            {/* Add more fields as needed */}
          </form>
        </div>
        {<Cart cart={cart} updateCart={updateCart} location={location} />}
        <button onClick={handleOrder}>Passer la commande</button>
      </div>
    </div>
  );
}

export default Commande;
