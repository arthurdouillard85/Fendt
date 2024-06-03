import React, { useEffect, useState } from "react";
import "../styles/Ajout.css";
import { useParams } from "react-router-dom";
import Categories from "../components/Categories";

function Ajout() {
  const { idArticle } = useParams();
  const [name, setName] = useState("");
  const [fuel, setFuel] = useState("");
  const [chevaux, setChevaux] = useState("");
  const [price, setPrice] = useState("");
  const [cover, setCover] = useState(null);
  const [activeCategory, setActiveCategory] = useState("");
  const [tracteurList, setTracteurList] = useState([]);

  const [categoryError, setCategoryError] = useState(false);

  const handleImageChange = (e) => {
    setCover(e.target.files[0]);
  };

  const categories = Array.isArray(tracteurList)
    ? tracteurList.reduce(
        (acc, elem) =>
          acc.includes(elem.category) ? acc : acc.concat(elem.category),
        [],
      )
    : [];

  const handleSubmit = async (event) => {
    event.preventDefault();

    console.log("activeCategory:", activeCategory); // Ajoutez ce log

    if (!activeCategory) {
      setCategoryError(true);
      console.log("categoryError after set to true:", categoryError); // Ajoutez ce log
      return;
    }

    setCategoryError(false);
    console.log("categoryError after set to false:", categoryError); // Ajoutez ce log

    const formData = new FormData();
    formData.append("image", cover);
    formData.append("tracteurId", idArticle);
    fetch("http://localhost:3001/upload", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        const imageUrl = data.imageUrl;

        return fetch("http://localhost:3001/ajout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            fuel: parseInt(fuel),
            chevaux: parseInt(chevaux),
            price: parseInt(price),
            category: activeCategory,
            cover: imageUrl,
            bestSale: 0,
          }),
        });
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
  };

  useEffect(() => {
    fetch("http://localhost:3001/")
      .then((response) => response.json())
      .then((data) => {
        setTracteurList(data);
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des données :", error);
      });
  }, []);

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
            Carburant:
            <input
              type="text"
              value={fuel}
              onChange={(e) => setFuel(e.target.value)}
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
            Image:
            <input
              type="file"
              onChange={handleImageChange}
              className="file-input ajout-input"
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
          <Categories
            categories={categories}
            setActiveCategory={setActiveCategory}
            activeCategory={activeCategory}
          />

          {categoryError && (
            <p className="error-message">
              Veuillez sélectionner une catégorie.
            </p>
          )}

          <button type="submit" className="ajout-button">
            Ajouter
          </button>
        </form>
      </div>
    </div>
  );
}

export default Ajout;
