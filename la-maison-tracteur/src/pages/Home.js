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
          Fendt GmbH est une entreprise allemande de construction de machines
          agricoles fondée en Bavière en 1930. Spécialisée à l'origine dans des
          modèles de faible puissance, elle produit aujourd'hui des tracteurs et
          des ensileuses automotrices, et commercialise aussi des
          moissonneuses-batteuses et des presses à balles à chambre variable
          depuis son intégration au groupe AGCO Corporation en 1997. Depuis
          2016, la marque commercialise également du matériel de fenaison Fella
          sous les couleurs Fendt.
        </p>
      </div>
    </div>
  );
}

export default Home;
