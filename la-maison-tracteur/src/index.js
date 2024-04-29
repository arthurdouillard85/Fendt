import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import Header from "./components/Header";
import Detail from "./pages/Detail";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Logout from "./pages/Logout";
import Profile from "./pages/Profile";
import Questionnaire from "./pages/Questionnaire";
import Utilisateurs from "./pages/Utilisateurs";
import CartOpenContext from "./context/CartOpenContext";

import { Route, BrowserRouter as Router } from "react-router-dom";

import "./styles/index.css";
import Products from "./pages/Products";

const root = ReactDOM.createRoot(document.getElementById("root"));

function App() {
  const savedCart = localStorage.getItem("cart");
  const [cart, updateCart] = useState(savedCart ? JSON.parse(savedCart) : []);
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <CartOpenContext.Provider value={{ isCartOpen, setIsCartOpen }}>
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
        </Router>
      </React.StrictMode>
    </CartOpenContext.Provider>
  );
}

root.render(<App />);
