import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../styles/Detail.css";
import Option from "../components/Option";

function Detail() {
  const { idArticle } = useParams();
  const [detailTracteur, setData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [image, setImage] = useState(null);
  const [role, setRole] = useState("");
  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };
  const [updatedTracteur, setUpdatedTracteur] = useState({
    name: "",
    cover: "",
    price: 0,
    fuel: 0,
    chevaux: "",
  });
  const handleImageUpload = () => {
    const formData = new FormData();
    formData.append("image", image);
    formData.append("tracteurId", idArticle);
    fetch("http://localhost:3001/upload", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        const imageUrl = data.imageUrl;
        // Mettre à jour l'URL de l'image dans le state
        setUpdatedTracteur({ ...updatedTracteur, cover: imageUrl });
        setIsEditing(false);
      })
      .catch((error) => {
        console.error("Erreur téléchargement image :", error);
      });
  };

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    // Requête pour récupérer le role de l'utilisateur à partir de l'ID de l'utilisateur
    fetch(`http://localhost:3001/profile/${userId}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.role) {
          setRole(data.role);
        } else {
          console.error("Impossible de récupérer le role de l'utilisateur.");
        }
      })
      .catch((error) =>
        console.error(
          "Une erreur s'est produite lors de la récupération de l'email de l'utilisateur :",
          error,
        ),
      );

    fetch(`http://localhost:3001/${idArticle}`)
      .then((response) => response.json())
      .then((detailTracteur) => {
        setData(detailTracteur);
        setUpdatedTracteur(detailTracteur);
      })
      .catch((error) => {
        console.error(
          "Erreur lors de la récupération du détail tracteur:",
          error,
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
        console.error("Erreur lors de la requête PUT :", error),
      );
  };

  return (
    <div className="modale-container">
      <Option id={idArticle} image={detailTracteur.cover} />
      <div style={{ alignSelf: "flex-start" }}>
        <h1>{detailTracteur.name}</h1>
      </div>
      {!isEditing ? (
        <>
          <img
            className="tracteur-cover"
            src={detailTracteur.cover}
            alt={`${detailTracteur.name} cover`}
          />
          {role === "admin" && (
            <button className="edit-button" onClick={() => setIsEditing(true)}>
              Modifier
            </button>
          )}
        </>
      ) : (
        <div className="edit-mode">
          <label className="name-label">Nom:</label>
          <input
            type="text"
            name="name"
            value={updatedTracteur.name}
            onChange={handleInputChange}
            className="name-input"
          />
          <input
            type="file"
            onChange={handleImageChange}
            className="file-input"
          />
          <div className="edit-mode-button">
            <button
              onClick={() => setIsEditing(false)}
              className="cancel-button"
            >
              Annuler
            </button>
            <button
              onClick={() => {
                handleUpdateTracteur();
                handleImageUpload();
              }}
              className="save-button"
            >
              Enregistrer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Detail;
