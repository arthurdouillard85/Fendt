import { useEffect, useState } from "react";
import logo from "../assets/logo.png";
import Banner from "../components/Banner";
import Cart from "../components/Cart";
import Footer from "../components/Footer";
import ShoppingList from "../components/ShoppingList";
import "../styles/Layout.css";

function Home() {
  const savedCart = localStorage.getItem("cart");
  const [cart, updateCart] = useState(savedCart ? JSON.parse(savedCart) : []);
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  return (
    <div>
      <div className="lmt-layout-inner">
        <Cart cart={cart} updateCart={updateCart} />
        <ShoppingList cart={cart} updateCart={updateCart} />
      </div>
      <Footer />
    </div>
  );
}

export default Home;
