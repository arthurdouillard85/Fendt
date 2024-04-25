import { Link, useLocation } from "react-router-dom";
import logo from "../assets/logo.png";
import "../styles/Header.css";
import { useEffect, useState } from "react";

function Header() {
  const [userId, setUserId] = useState("");
  const [role, setRole] = useState("");
  const [navbar, setNavbar] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (localStorage.getItem("userId") === null) {
      return;
    }
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
  }, [userId]);

  const changeBackground = () => {
    if (window.scrollY >= 80) {
      setNavbar(true);
    } else {
      setNavbar(false);
    }
  };

  window.addEventListener("scroll", changeBackground);

  return (
    <div className={location.pathname === "/" ? "header home" : "header"}>
      <nav className={navbar ? "navbar active" : "navbar"}>
        <Link to="/">
          <img src={logo} alt="logo-la-maison-tracteur" className="lmt-logo" />
        </Link>
        &nbsp;&nbsp;
        <Link to="/products">PRODUCTS</Link>&nbsp;&nbsp;
        <Link to="/question/1">REVIEW</Link>&nbsp;&nbsp;
        {localStorage.getItem("userId") !== null && (
          <Link to="/profile">ACCOUNT</Link>
        )}
        {localStorage.getItem("userId") !== null ? (
          <Link to="/logout">LOGOUT</Link>
        ) : (
          <Link to="/login">LOGIN</Link>
        )}
        {role === "admin" && <Link to="/users">ADMIN</Link>}&nbsp;&nbsp;
      </nav>
    </div>
  );
}

export default Header;
