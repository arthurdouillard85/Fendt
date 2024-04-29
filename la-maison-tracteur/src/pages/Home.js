import { useEffect, useState } from "react";
import "../styles/Home.css";
import backgroundVideo from "../assets/background.mp4";

function Home() {
  const savedCart = localStorage.getItem("cart");
  const [cart, updateCart] = useState(savedCart ? JSON.parse(savedCart) : []);
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  return (
    <div className="home-page">
      <div className="background-video">
        <video autoPlay loop muted>
          <source src={backgroundVideo} type="video/mp4" />
          Votre navigateur ne supporte pas la vidéo.
        </video>
      </div>
      <div className="additional-info">
        <h1>Informations supplémentaires</h1>
        <p>
          Ceci est un exemple de texte supplémentaire qui peut être ajouté sous
          la vidéo.
        </p>
        <h1>Informations supplémentaires</h1>
        <p>
          Ceci est un exemple de texte supplémentaire qui peut être ajouté sous
          la vidéo.
        </p>
        <h1>Informations supplémentaires</h1>
        <p>
          Ceci est un exemple de texte supplémentaire qui peut être ajouté sous
          la vidéo.
        </p>
        <h1>Informations supplémentaires</h1>
        <p>
          Ceci est un exemple de texte supplémentaire qui peut être ajouté sous
          la vidéo.
        </p>
        <h1>Informations supplémentaires</h1>
        <p>
          Ceci est un exemple de texte supplémentaire qui peut être ajouté sous
          la vidéo.
        </p>
        <h1>Informations supplémentaires</h1>
        <p>
          Ceci est un exemple de texte supplémentaire qui peut être ajouté sous
          la vidéo.
        </p>
        <h1>Informations supplémentaires</h1>
        <p>
          Ceci est un exemple de texte supplémentaire qui peut être ajouté sous
          la vidéo.
        </p>
        <h1>Informations supplémentaires</h1>
        <p>
          Ceci est un exemple de texte supplémentaire qui peut être ajouté sous
          la vidéo.
        </p>
        <h1>Informations supplémentaires</h1>
        <p>
          Ceci est un exemple de texte supplémentaire qui peut être ajouté sous
          la vidéo.
        </p>
        <h1>Informations supplémentaires</h1>
        <p>
          Ceci est un exemple de texte supplémentaire qui peut être ajouté sous
          la vidéo.
        </p>
        v v<h1>Informations supplémentaires</h1>
        <p>
          Ceci est un exemple de texte supplémentaire qui peut être ajouté sous
          la vidéo.
        </p>
        <h1>Informations supplémentaires</h1>
        <p>
          Ceci est un exemple de texte supplémentaire qui peut être ajouté sous
          la vidéo.
        </p>
        <h1>Informations supplémentaires</h1>
        <p>
          Ceci est un exemple de texte supplémentaire qui peut être ajouté sous
          la vidéo.
        </p>
      </div>
    </div>
  );
}

export default Home;
