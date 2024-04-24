import { Link } from "react-router-dom";
import Banner from "./Banner";
import logo from "../assets/logo.png";
import "../styles/Header.css";

function Header() {
  return (
    <nav>
      <Link to="/">Accueil</Link>&nbsp;&nbsp;
      <Link to="/question/1">Questionnaire</Link>&nbsp;&nbsp;
      <Link to="/login">Se connecter</Link>&nbsp;&nbsp;
      <Link to="/profile">Profile</Link>&nbsp;&nbsp;
      <div className="lmt-container">
        <Banner>
          <img src={logo} alt="logo-la-maison-tracteur" className="lmt-logo" />
          <h1 className="lmt-title">Fendt</h1>
        </Banner>
      </div>
    </nav>
  );
}

export default Header;
