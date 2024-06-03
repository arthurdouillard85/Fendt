import React, { useState, useEffect, useContext } from "react";
import "../styles/Option.css";
import { CartContext } from "../context/CartContext";
import { useHistory } from "react-router-dom";

function Option({ id, image, category }) {
  const [tracteurs, setTracteurs] = useState([]);
  const [selectedTracteur, setSelectedTracteur] = useState("");
  const [option, setOption] = useState([]); // Nouvel état pour suivre l'étape actuelle
  const [selectedOption, setSelectedOption] = useState("");
  const [step, setStep] = useState(1); // Nouvel état pour suivre l'étape actuelle
  const { addToCart } = useContext(CartContext);
  const [selectedColor, setSelectedColor] = useState("Vert");

  const handleColorChange = (event) => {
    setSelectedColor(event.target.value);
  };

  const history = useHistory();

  const handleAddToCartClick = () => {
    const selectedTracteurItem = tracteurs.find(
      (t) => t.nom === selectedTracteur,
    );
    const selectedOptionItem = option.find((o) => o.nom === selectedOption);
    const totalPrice = selectedTracteurItem.prix + selectedOptionItem.prix;

    const cartItem = {
      tracteurId: category === "tracteur" ? selectedTracteurItem.id : null,
      moissonneuseId:
        category === "moissonneuse" ? selectedTracteurItem.id : null,
      ensileuseId: category === "ensileuse" ? selectedTracteurItem.id : null,
      userId: parseInt(localStorage.getItem("userId")), // Remplacez ceci par l'ID de l'utilisateur actuel
      optionId: selectedOptionItem.id,
      price: totalPrice,
      date: new Date().toISOString().slice(0, 19).replace("T", " "),
      couleur: selectedColor,
    };

    fetch("http://localhost:3001/panier", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(cartItem),
    })
      .then((response) => response.json())
      .then((data) => {
        addToCart(data);
        history.push("/products");
      })
      .catch((error) => {
        console.error("Erreur lors de l'ajout au panier :", error);
      });

    alert("Votre tracteur a bien été ajouté au panier !");
  };

  useEffect(() => {
    let url = "";
    if (category === "tracteur") {
      url = `http://localhost:3001/tracteur/${id}`;
    } else if (category === "ensileuse") {
      url = `http://localhost:3001/ensileuse/${id}`;
    } else if (category === "moissonneuse") {
      url = `http://localhost:3001/moissonneuse/${id}`;
    }
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setTracteurs(data);
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des données :", error);
      });
    fetch(`http://localhost:3001/option`)
      .then((response) => response.json())
      .then((data) => {
        setOption(data);
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des options :", error);
      });
  }, [id, step]); // Ajoutez step comme dépendance pour refaire la requête lorsque l'étape change

  const handleRadioChangeTracteur = (event) => {
    setSelectedTracteur(event.target.value);
  };

  const handleRadioChangeOption = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleNextClick = () => {
    setStep(step + 1); // Incrémentez l'étape lorsque l'utilisateur clique sur "Suivant"
  };

  return (
    <div className="option">
      {step === 1 ? (
        <>
          {tracteurs.length > 0 ? (
            <>
              <h2>Liste des tracteurs</h2>
              <form>
                {tracteurs.map((tracteur, index) => (
                  <label key={index} className="tracteur-card">
                    <input
                      type="radio"
                      name="tracteur"
                      value={tracteur.nom}
                      checked={selectedTracteur === tracteur.nom}
                      onChange={handleRadioChangeTracteur}
                    />
                    <h3>{tracteur.nom}</h3>
                    <img
                      src={image}
                      alt={tracteur.nom}
                      className="tracteur-image"
                    />
                    <p>
                      {tracteur.chevaux} ch / {tracteur.Nm} Nm
                    </p>
                    <p>{tracteur.prix.toLocaleString("fr-FR")} €</p>
                  </label>
                ))}
                <button
                  type="button"
                  onClick={handleNextClick}
                  disabled={!selectedTracteur}
                  className="next-button"
                >
                  Suivant
                </button>
              </form>
            </>
          ) : (
            <p>Chargement...</p>
          )}
        </>
      ) : (
        <>
          {option.length > 0 ? (
            <>
              <h2>Liste des Options</h2>
              <form>
                {option.map((option, index) => (
                  <label key={index} className="tracteur-card">
                    <input
                      type="radio"
                      name="option"
                      value={option.nom}
                      checked={selectedOption === option.nom}
                      onChange={handleRadioChangeOption}
                    />
                    <h3>{option.nom}</h3>
                    <p>{option.description}</p>
                    <p> + {option.prix.toLocaleString("fr-FR")} €</p>
                  </label>
                ))}
                <h2>Choix de la couleur</h2>
                <div className="color-selection">
                  {["Vert", "Jaune", "Noir"].map((color, index) => (
                    <label key={index}>
                      <input
                        type="radio"
                        name="color"
                        value={color}
                        checked={selectedColor === color}
                        onChange={handleColorChange}
                      />
                      <div
                        className={`color-circle ${color.toLowerCase()}`}
                      ></div>
                    </label>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={handleAddToCartClick}
                  disabled={!selectedOption || !selectedColor}
                  className="add-to-cart-button"
                >
                  Ajouter au panier
                </button>
              </form>
            </>
          ) : (
            <p>Chargement...</p>
          )}
        </>
      )}
    </div>
  );
}

export default Option;
