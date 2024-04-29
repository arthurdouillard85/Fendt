import { useEffect } from "react";
import "../styles/Cart.css";

function Cart({ cart, updateCart, location }) {
  const total = cart.reduce(
    (acc, tracteurType) => acc + tracteurType.amount * tracteurType.price,
    0,
  );
  const isProfilePage = location.pathname === "/profile";

  useEffect(() => {
    document.title = `LMT: ${total}€ d'achats`;
  }, [total]);

  return (
    <div className={isProfilePage ? "lmt-cart-profile" : "lmt-cart"}>
      <h2>Panier</h2>
      {cart.length > 0 ? (
        <div>
          <ul>
            {cart.map(({ name, price, amount, cover }, index) => (
              <div key={`${name}-${index}`}>
                <img src={cover} alt={name} /> {/* Ajout de l'image */}
                {price}€ x {amount}
              </div>
            ))}
          </ul>
          <h3>Total :{total}€</h3>
          {!isProfilePage ? (
            <button onClick={() => updateCart([])}>Vider le panier</button>
          ) : (
            <button onClick={() => alert("Merci pour votre achat")}>
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
