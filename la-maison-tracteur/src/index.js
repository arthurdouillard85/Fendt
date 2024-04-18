import React from "react";
import ReactDOM from "react-dom";
import Header from "./components/Header";
import Detail from "./pages/Detail";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Questionnaire from "./pages/Questionnaire";

import { Route, BrowserRouter as Router } from "react-router-dom";

import "./styles/index.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Router>
      <Header />
      <Route exact path="/">
        <Home />
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
    </Router>
  </React.StrictMode>
);
