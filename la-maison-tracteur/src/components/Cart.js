import { useEffect, useState } from "react";
import "../styles/Cart.css";
import { Link, useLocation } from "react-router-dom";
import trash from "../assets/poubelle.png";
import { useHistory } from "react-router-dom";

function Cart({ updateCart, location }) {
  const [cart, setCart] = useState([]);
  const currentLocation = useLocation;

  const total_achat = cart.reduce(
    (acc, item) => acc + parseInt(item.price) * parseInt(item.amount),
    0,
  );

  const isProfilePage = location.pathname === "/profile";
  const history = useHistory();

  const handleCheckout = () => {
    alert("Vous allez être redirigé vers la page de commande");
    history.push("/commande");
  };

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    // Envoyez une requête GET à votre API pour récupérer les données du panier
    fetch(`http://localhost:3001/panier/${userId}`)
      .then((response) => response.json())
      .then((data) => {
        // Mettez à jour l'état du panier avec les données récupérées
        setCart(data);
      })
      .catch((error) =>
        console.error("Erreur lors de la récupération du panier :", error),
      );
  }, []);

  const handleQuantityChange = (id, event) => {
    const newQuantity = event.target.value;

    // Envoyez une requête PUT à votre API pour modifier la quantité de l'élément dans le panier
    fetch(`http://localhost:3001/panier/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ amount: newQuantity }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            "Erreur lors de la modification de la quantité de l'élément dans le panier",
          );
        }
        // Si la requête a réussi, mettez à jour la quantité de l'élément dans l'état local
        updateCart(cart.filter((item) => item.id !== id));

        const userId = localStorage.getItem("userId");
        fetch(`http://localhost:3001/panier/${userId}`)
          .then((response) => response.json())
          .then((data) => {
            // Mettez à jour l'état du panier avec les données récupérées
            setCart(data);
          })
          .catch((error) =>
            console.error("Erreur lors de la récupération du panier :", error),
          );
      })
      .catch((error) =>
        console.error(
          "Erreur lors de la modification de la quantité de l'élément dans le panier :",
          error,
        ),
      );
  };

  const handleRemoveItem = (id) => {
    // Envoyez une requête DELETE à votre API pour supprimer l'élément du panier
    fetch(`http://localhost:3001/panier/${id}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            "Erreur lors de la suppression de l'élément du panier",
          );
        }
        // Si la requête a réussi, supprimez l'élément du panier dans l'état local
        updateCart(cart.filter((item) => item.id !== id));

        const userId = localStorage.getItem("userId");
        fetch(`http://localhost:3001/panier/${userId}`)
          .then((response) => response.json())
          .then((data) => {
            // Mettez à jour l'état du panier avec les données récupérées
            setCart(data);
          })
          .catch((error) =>
            console.error("Erreur lors de la récupération du panier :", error),
          );
      })
      .catch((error) =>
        console.error(
          "Erreur lors de la suppression de l'élément du panier :",
          error,
        ),
      );
  };

  return (
    <div className={isProfilePage ? "lmt-cart-profile" : "lmt-cart"}>
      <h2>Panier</h2>
      {cart.length > 0 ? (
        <div>
          <ul>
            {cart.map(
              (
                {
                  id,
                  id_produit,
                  name,
                  option_ligne,
                  couleur,
                  price,
                  amount,
                  cover,
                },
                index,
              ) => (
                <div key={`${name}-${index}`}>
                  <div className="info-produit">
                    <div className="option-produit">
                      <img src={cover} alt={name} />
                      <p>
                        {parseInt(price).toLocaleString("fr-FR")} €
                        &nbsp;&nbsp;&nbsp;
                      </p>
                      <Link to={`/detail/${id_produit}`}>
                        <a
                          style={{
                            textDecoration: "underline",
                          }}
                        >
                          Option
                        </a>
                      </Link>
                    </div>
                    <p>
                      {name} {option_ligne} {couleur}
                    </p>
                    <div>
                      <input
                        type="number"
                        min="1"
                        value={amount}
                        onChange={(event) => handleQuantityChange(id, event)}
                      />
                      <img
                        src={trash}
                        alt={"Supprimer"}
                        className="trash-logo"
                        onClick={() => handleRemoveItem(id)}
                      />{" "}
                    </div>
                  </div>
                </div>
              ),
            )}
            <h3>Total :{total_achat.toLocaleString("fr-FR")}€</h3>
          </ul>
          {currentLocation().pathname !== "/commande" && (
            <button className="valider" onClick={handleCheckout}>
              Valider le panier
            </button>
          )}
        </div>
      ) : (
        <div>Votre panier est vide</div>
      )}
    </div>
  );
}

export default Cart;
