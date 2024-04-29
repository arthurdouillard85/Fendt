import { useEffect, useState, useContext } from "react";
import Cart from "../components/Cart";
import Footer from "../components/Footer";
import ShoppingList from "../components/ShoppingList";
import CartOpenContext from "../context/CartOpenContext";
import { useLocation } from "react-router-dom";
import "../styles/Layout.css";

function Home() {
  const savedCart = localStorage.getItem("cart");
  const [cart, updateCart] = useState(savedCart ? JSON.parse(savedCart) : []);
  const [userId, setUserId] = useState("");
  const [role, setRole] = useState("");
  const { isCartOpen } = useContext(CartOpenContext);
  const location = useLocation();

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));

    const userIdFromLocalStorage = localStorage.getItem("userId");
    setUserId(userIdFromLocalStorage);

    // Requête pour récupérer le role de l'utilisateur à partir de l'ID de l'utilisateur
    fetch(`http://localhost:3001/profile/${userIdFromLocalStorage}`)
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
  }, [cart]);

  return (
    <div>
      <div className="header" />
      <div className="lmt-layout-inner">
        <ShoppingList cart={cart} updateCart={updateCart} />
        {isCartOpen && (
          <Cart cart={cart} updateCart={updateCart} location={"/products"} />
        )}
      </div>
      <Footer />
    </div>
  );
}

export default Home;
