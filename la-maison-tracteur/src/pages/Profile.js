import React, { useState, useEffect } from "react";
import "../styles/Profile.css"

function Profile() {
  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState("");

  useEffect(() => {
      const userIdFromLocalStorage = localStorage.getItem("userId");
      setUserId(userIdFromLocalStorage);

      // Requête pour récupérer l'email de l'utilisateur à partir de l'ID de l'utilisateur
      fetch(`http://localhost:3001/profile/${userIdFromLocalStorage}`)
        .then(response => response.json())
        .then(data => {
          if (data.email) {
            setEmail(data.email);
          } else {
            console.error("Impossible de récupérer l'email de l'utilisateur.");
          }
        })
        .catch(error => console.error("Une erreur s'est produite lors de la récupération de l'email de l'utilisateur :", error));
    }, []);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

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
      console.error("Une erreur s'est produite lors du changement de mot de passe :", error);
      setErrorMessage("Une erreur s'est produite lors du changement de mot de passe.");
    }
  };

  return (
    <div className="modale-container">
        <div className="profile-container">
          <h2>Profil Utilisateur</h2>
          <p className="email-label">Email : {email}</p>
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
            <button className="password-change-btn" onClick={handleChangePassword}>Changer le mot de passe</button>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
          </div>
          {/* Déconnexion */}
          <button className="logout-btn" onClick={handleLogout}>Déconnexion</button>
        </div>
    </div>
  );
}

export default Profile;
