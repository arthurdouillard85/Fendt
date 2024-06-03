import React, { useContext, useState } from "react";
import ReactDOM from "react-dom/client";
import Header from "./components/Header";
import Detail from "./pages/Detail";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Logout from "./pages/Logout";
import Profile from "./pages/Profile";
import Questionnaire from "./pages/Questionnaire";
import Utilisateurs from "./pages/Utilisateurs";
import Commande from "./pages/Commande";
import Ajout from "./pages/Ajout";
import CartOpenContext from "./context/CartOpenContext";
import { CartContext } from "./context/CartContext";

import { Route, BrowserRouter as Router } from "react-router-dom";

import "./styles/index.css";
import Products from "./pages/Products";

const root = ReactDOM.createRoot(document.getElementById("root"));

function App() {
  const savedCart = localStorage.getItem("cart");
  const [cart, updateCart] = useState(savedCart ? JSON.parse(savedCart) : []);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const addToCart = (item) => {
    const newCart = [...cart, item];
    updateCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
  };

  return (
    <CartOpenContext.Provider value={{ isCartOpen, setIsCartOpen }}>
      <CartContext.Provider value={{ cart, addToCart }}>
        <React.StrictMode>
          <Router>
            <Header cart={cart} updateCart={updateCart} />
            <Route exact path="/">
              <Home />
            </Route>
            <Route exact path="/products">
              <Products />
            </Route>
            <Route path="/detail/:idArticle">
              <Detail />
            </Route>
            <Route path="/question/:questionNumber">
              <Questionnaire />
            </Route>
            <Route path="/login">
              <Login />
            </Route>
            <Route path="/profile">
              <Profile />
            </Route>
            <Route path="/users">
              <Utilisateurs />
            </Route>
            <Route path="/logout">
              <Logout />
            </Route>
            <Route path="/commande">
              <Commande />
            </Route>
            <Route path="/ajout">
              <Ajout />
            </Route>
          </Router>
        </React.StrictMode>
      </CartContext.Provider>{" "}
    </CartOpenContext.Provider>
  );
}

root.render(<App />);
