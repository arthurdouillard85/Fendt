import { useEffect } from "react";
import "../styles/Cart.css";
import { Link } from "react-router-dom";
import trash from "../assets/poubelle.png"; // Importez l'icône de poubelle

function Cart({ cart, updateCart, location }) {
  const total = cart.reduce(
    (acc, tracteurType) => acc + tracteurType.amount * tracteurType.price,
    0,
  );
  const isProfilePage = location.pathname === "/profile";

  useEffect(() => {
    document.title = `LMT: ${total}€ d'achats`;
  }, [total]);

  const handleQuantityChange = (id, event) => {
    const newQuantity = event.target.value;

    updateCart(
      cart.map((item) =>
        item.id === id ? { ...item, amount: Number(newQuantity) } : item,
      ),
    );
  };

  const handleRemoveItem = (id) => {
    // Ajoutez une fonction pour supprimer l'élément du panier
    updateCart(cart.filter((item) => item.id !== id));
  };

  return (
    <div className={isProfilePage ? "lmt-cart-profile" : "lmt-cart"}>
      <h2>Panier</h2>
      {cart.length > 0 ? (
        <div>
          <ul>
            {cart.map(({ id, name, price, amount, cover }, index) => (
              <div key={`${name}-${index}`}>
                <div className="info-produit">
                  <div className="option-produit">
                    <img src={cover} alt={name} />
                    <p>{price.toLocaleString("fr-FR")} € &nbsp;&nbsp;&nbsp;</p>
                    <Link to={`/detail/${id}`}>
                      <a
                        style={{
                          textDecoration: "underline",
                        }}
                      >
                        Option
                      </a>
                    </Link>
                  </div>
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
            ))}
            <h3>Total :{total.toLocaleString("fr-FR")}€</h3>
          </ul>
          {!isProfilePage ? (
            <div>
              <button onClick={() => updateCart([])}>Vider le panier</button>
              <button
                className="valider"
                onClick={() => alert("Merci pour votre achat")}
              >
                Valider le panier
              </button>
            </div>
          ) : (
            <button
              className="valider"
              onClick={() => alert("Merci pour votre achat")}
            >
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
