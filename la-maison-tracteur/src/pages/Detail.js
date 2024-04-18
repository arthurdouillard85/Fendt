import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function Detail() {
  const { idArticle } = useParams();
  const [detailTracteur, setData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [updatedTracteur, setUpdatedTracteur] = useState({
    name: "",
    cover: "",
    price: 0,
    confort: 0,
    taille: "",
  });

  useEffect(() => {
    fetch(`http://localhost:3001/${idArticle}`)
      .then((response) => response.json())
      .then((detailTracteur) => {
        setData(detailTracteur);
        setUpdatedTracteur(detailTracteur);
      })
      .catch((error) => {
        console.error(
          "Erreur lors de la récupération du détail tracteur:",
          error
        );
      });
  }, [idArticle]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedTracteur((prevTracteur) => ({
      ...prevTracteur,
      [name]: value,
    }));
  };

  const handleUpdateTracteur = () => {
    fetch(`http://localhost:3001/${idArticle}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedTracteur),
    })
      .then((response) => response.json())
      .then((data) => {
        setData(data);
        setIsEditing(false);
      })
      .catch((error) =>
        console.error("Erreur lors de la requête PUT :", error)
      );
  };

  return (
    <div>
      <h2>id Article {idArticle}</h2>
      {!isEditing ? (
        <div>
          <h1>{detailTracteur.name}</h1>
          <img
            src={detailTracteur.cover}
            alt={`${detailTracteur.name} cover`}
          />
          <h2>Prix : {detailTracteur.price} euros</h2>
          <h2>Consomation : {detailTracteur.fuel}</h2>
          <h2>Chevaux : {detailTracteur.chevaux}</h2>
          <h2>Category : {detailTracteur.category}</h2>
          <button onClick={() => setIsEditing(true)}>Modifier</button>
        </div>
      ) : (
        <div>
          <label>Nom:</label>
          <input
            type="text"
            name="name"
            value={updatedTracteur.name}
            onChange={handleInputChange}
          />
          {/* Ajoutez d'autres champs pour les autres propriétés */}
          <button onClick={handleUpdateTracteur}>Enregistrer</button>
          <button onClick={() => setIsEditing(false)}>Annuler</button>
        </div>
      )}
    </div>
  );
}

export default Detail;
