import React, { useState, useEffect } from "react";
import Cart from "../components/Cart";
import { useLocation } from "react-router-dom";
import "../styles/Profile.css";
import Informations from "../components/Informations";

function Profile() {
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [userId, setUserId] = useState("");
  const [telephone, setTelephone] = useState("");
  const savedCart = localStorage.getItem("cart");
  const [adresse, setAdresse] = useState("");
  const [cart, updateCart] = useState(savedCart ? JSON.parse(savedCart) : []);
  const location = useLocation();
  const client = {
    nom: nom,
    prenom: prenom,
    email: email,
    telephone: telephone,
    adresse: adresse,
    // autres informations...
  };

  useEffect(() => {
    const userIdFromLocalStorage = localStorage.getItem("userId");
    setUserId(userIdFromLocalStorage);

    // Requête pour récupérer l'email, le téléphone et l'adresse de l'utilisateur à partir de l'ID de l'utilisateur
    fetch(`http://localhost:3001/profile/${userIdFromLocalStorage}`)
      .then((response) => response.json())
      .then((data) => {
        if (data) {
          setNom(data.nom);
          setPrenom(data.prenom);
          setEmail(data.email);
          setTelephone(data.telephone);
          setAdresse(data.adresse);
          setRole(data.role);
        } else {
          console.error("Impossible de récupérer l'email de l'utilisateur.");
        }
      })
      .catch((error) =>
        console.error(
          "Une erreur s'est produite lors de la récupération de l'email de l'utilisateur :",
          error,
        ),
      );
  }, []);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [newTelephone, setNewTelephone] = useState("");
  const [newAdresse, setNewAdresse] = useState("");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    window.location.href = "/login";
  };

  const handleChangePassword = async () => {
    // Vérifier si les champs sont vides
    if (!oldPassword || !newPassword || !confirmPassword) {
      setErrorMessage("Veuillez remplir tous les champs.");
      return;
    }
    // Vérifier si le nouveau mot de passe correspond à la confirmation
    if (newPassword !== confirmPassword) {
      setErrorMessage("Les nouveaux mots de passe ne correspondent pas.");
      return;
    }
    try {
      const url = "http://localhost:3001/change-password";
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userId,
          oldPassword: oldPassword,
          newPassword: newPassword,
        }),
      });
      if (response.ok) {
        console.log("Mot de passe changé avec succès !");
        setErrorMessage("");
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.message);
      }
    } catch (error) {
      console.error(
        "Une erreur s'est produite lors du changement de mot de passe :",
        error,
      );
      setErrorMessage(
        "Une erreur s'est produite lors du changement de mot de passe.",
      );
    }
  };

  const handleChangeTelephone = async () => {
    // Vérifier si les champs sont vides
    if (!newTelephone) {
      setErrorMessage("Veuillez remplir tous les champs.");
      return;
    }
    try {
      const url = "http://localhost:3001/change-telephone";
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userId,
          telephone: newTelephone,
        }),
      });
      if (response.ok) {
        console.log("Numéro de téléphone changé avec succès !");
        setErrorMessage("");
        setTelephone(newTelephone);
        setNewTelephone("");
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.message);
      }
    } catch (error) {
      console.error(
        "Une erreur s'est produite lors du changement du numéro de téléphone :",
        error,
      );
      setErrorMessage(
        "Une erreur s'est produite lors du changement du numéro de téléphone.",
      );
    }
    window.location.reload();
  };

  const handleChangeAdresse = async () => {
    // Vérifier si les champs sont vides
    if (!newAdresse) {
      setErrorMessage("Veuillez remplir tous les champs.");
      return;
    }
    try {
      const url = "http://localhost:3001/change-adresse";
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userId,
          adresse: newAdresse,
        }),
      });
      if (response.ok) {
        console.log("Adresse changée avec succès !");
        setErrorMessage("");
        setAdresse(newAdresse);
        setNewAdresse("");
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.message);
      }
    } catch (error) {
      console.error(
        "Une erreur s'est produite lors du changement de l'adresse :",
        error,
      );
      setErrorMessage(
        "Une erreur s'est produite lors du changement de l'adresse.",
      );
    }
    window.location.reload();
  };

  return (
    <div className="profile-page">
      <div className="profile-header">
        <Informations client={client} />
        <div className="profile-container">
          <h2>Profil Utilisateur</h2>
          <div className="profile-details-container">
            {/* Changer le mot de passe */}
            <div className="password-change">
              <h3>Changer le mot de passe</h3>
              <input
                className="password-input"
                type="password"
                placeholder="Ancien mot de passe"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
              />
              <input
                className="password-input"
                type="password"
                placeholder="Nouveau mot de passe"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <input
                className="password-input"
                type="password"
                placeholder="Confirmer le nouveau mot de passe"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <button
                className="password-change-btn"
                onClick={handleChangePassword}
              >
                Changer le mot de passe
              </button>
              {errorMessage && <p className="error-message">{errorMessage}</p>}
            </div>
            <div className="contact-change">
              <div className="telephone-change">
                <h3>Changer le numéro de téléphone</h3>
                <input
                  className="telephone-input"
                  type="text"
                  placeholder="Nouveau numéro de téléphone"
                  onChange={(e) => setNewTelephone(e.target.value)}
                />
                <button
                  className="telephone-change-btn"
                  onClick={handleChangeTelephone}
                >
                  Changer le numéro de téléphone
                </button>
              </div>
              <div className="adresse-change">
                <h3>Changer l'adresse</h3>
                <input
                  className="adresse-input"
                  type="text"
                  placeholder="Nouvelle adresse"
                  onChange={(e) => setNewAdresse(e.target.value)}
                />
                <button
                  className="adresse-change-btn"
                  onClick={handleChangeAdresse}
                >
                  Changer l'adresse
                </button>
              </div>
            </div>
          </div>
          {/* Déconnexion */}
          <button className="logout-btn" onClick={handleLogout}>
            Déconnexion
          </button>
        </div>
      </div>
      {role === "utilisateur" && (
        <Cart cart={cart} updateCart={updateCart} location={location} />
      )}
    </div>
  );
}

export default Profile;
