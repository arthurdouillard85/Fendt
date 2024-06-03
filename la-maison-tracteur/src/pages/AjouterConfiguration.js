import React, { useEffect, useState } from "react";
import "../styles/Ajout.css";
import { useParams } from "react-router-dom";
import Categories from "../components/Categories";

function Ajout() {
  const { idArticle } = useParams();
  const [name, setName] = useState("");
  const [Nm, setNm] = useState("");
  const [chevaux, setChevaux] = useState("");
  const [price, setPrice] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    await fetch(`http://localhost:3001/${idArticle}`, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((data) => {
        let url = "";
        if (data.category === "tracteur") {
          url = "http://localhost:3001/ajouter-configuration-tracteur";
        } else if (data.category === "ensileuse") {
          url = "http://localhost:3001/ajouter-configuration-ensileuse";
        } else if (data.category === "moissonneuse") {
          url = "http://localhost:3001/ajouter-configuration-moissonneuse";
        }
        return fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            produitId: parseInt(idArticle),
            name,
            price: parseInt(price),
            chevaux: parseInt(chevaux),
            Nm: parseInt(Nm),
          }),
        })
          .then((response) => {
            if (!response.ok) {
              // Si la réponse n'est pas OK, gérer l'erreur
              throw new Error("Erreur lors de l'ajout du tracteur");
            }
          })
          .then(() => {
            // Si tout s'est bien passé, rediriger l'utilisateur vers la page d'accueil
            window.location = "/products";
          })
          .catch((error) => {
            console.error("Erreur lors de la connexion :", error);
          });
      });
  };

  return (
    <div className="ajout-page">
      <div className="ajout-container">
        <h1 className="ajout-title">Ajout</h1>
        <form onSubmit={handleSubmit} className="ajout-form">
          <label className="ajout-label">
            Nom:
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="ajout-input"
            />
          </label>
          <label className="ajout-label">
            Newton-mètre de couple:
            <input
              type="text"
              value={Nm}
              onChange={(e) => setNm(e.target.value)}
              required
              className="ajout-input"
            />
          </label>
          <label className="ajout-label">
            Chevaux:
            <input
              type="text"
              value={chevaux}
              onChange={(e) => setChevaux(e.target.value)}
              required
              className="ajout-input"
            />
          </label>
          <label className="ajout-label">
            Prix:
            <input
              type="text"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
              className="ajout-input"
            />
          </label>
          <button type="submit" className="ajout-button">
            Ajouter
          </button>
        </form>
      </div>
    </div>
  );
}

export default Ajout;
