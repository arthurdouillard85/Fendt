import React, { useEffect, useState } from "react";
import "../styles/Login.css";

function Login() {
  const [isSignup, setIsSignup] = useState(true);
  const [errorMessage, setErrorMessage] = useState(""); // Stocke les messages d'erreur à afficher.
  // Etats pour le formulaire d'inscription
  const [signupNom, setSignupNom] = useState(""); // Ajout de l'état pour le nom
  const [signupPrenom, setSignupPrenom] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");

  // Etats pour le formulaire de connexion
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  useEffect(() => {
    // Vérifiez si un token est déjà stocké localement
    const token = localStorage.getItem("token");
    if (token) {
      // Si un token est présent, redirigez l'utilisateur vers la page de profil
      window.location.href = "/profile";
    }

    const container = document.querySelector(".container");
    const signupButton = document.querySelector(".signup-section header");
    const loginButton = document.querySelector(".login-section header");

    loginButton.addEventListener("click", () => {
      container.classList.add("active");
    });

    signupButton.addEventListener("click", () => {
      container.classList.remove("active");
    });

    const showSignupPasswordButton =
      document.getElementById("showSignupPassword");
    const showLoginPasswordButton =
      document.getElementById("showLoginPassword");

    if (showSignupPasswordButton && showLoginPasswordButton) {
      showSignupPasswordButton.addEventListener(
        "click",
        togglePasswordVisibility,
      );
      showLoginPasswordButton.addEventListener(
        "click",
        togglePasswordVisibility,
      );
    }
  }, []);

  function togglePasswordVisibility(e) {
    const passwordInput = e.target.previousElementSibling;
    if (passwordInput.type === "password") {
      passwordInput.type = "text";
      e.target.classList.remove("bxs-show");
      e.target.classList.add("bxs-hide");
    } else {
      passwordInput.type = "password";
      e.target.classList.remove("bxs-hide");
      e.target.classList.add("bxs-show");
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = isSignup ? signupEmail : loginEmail;
    const password = isSignup ? signupPassword : loginPassword;
    const nom = isSignup ? signupNom : null;
    const prenom = isSignup ? signupPrenom : null;
    try {
      const url = isSignup
        ? "http://localhost:3001/signup"
        : "http://localhost:3001/login";
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, nom, prenom }),
      });
      if (!response.ok) {
        // Si la réponse n'est pas OK, gérer l'erreur
        const errorMessage = await response.text();
        setErrorMessage(errorMessage);
        throw new Error(errorMessage);
      }
      const data = await response.json(); // on récupère les données du json si ok
      const token = data.token;
      // Stocker le token d'authentification dans le stockage local
      localStorage.setItem("token", token);
      const userId = data.userId; // on récupère le userId
      localStorage.setItem("userId", userId); // Stocke ID de l'utilisateur dans le stockage local
      window.location.href = "/profile"; // Redirection vers une page de gestion du profil ck
    } catch (error) {
      console.error("Erreur lors de la connexion :", error);
      setErrorMessage("Identifiants incorrects. Veuillez réessayer."); // Affiche message erreur à utilisateur
    }
  };
  return (
    <div className="modale-container">
      <div className="container">
        <div className="signup-section">
          <header onClick={() => setIsSignup(true)}>Sign up</header>

          <div className="social-buttons">
            <button>
              <i className="bx bxl-google"></i> Use Google
            </button>
            <button>
              <i className="bx bxl-apple"></i> Use Apple
            </button>
          </div>
          <div className="separator">
            <div className="line"></div>
            <p>Or</p>
            <div className="line"></div>
          </div>
          <form onSubmit={(e) => handleSubmit(e)}>
            <div className="custom-input">
              <input
                type="text"
                id="signupNom"
                name="nom"
                className="form-control"
                placeholder="Nom"
                value={signupNom}
                onChange={(e) => setSignupNom(e.target.value)}
                autoComplete="off"
              />
              <i className="bx bx-user"></i>
            </div>
            <div className="custom-input">
              <input
                type="text"
                id="signupPrenom"
                name="prenom"
                className="form-control"
                placeholder="Prenom"
                value={signupPrenom}
                onChange={(e) => setSignupPrenom(e.target.value)}
                autoComplete="off"
              />
              <i className="bx bx-user"></i>
            </div>
            <div className="custom-input">
              <input
                type="email"
                id="signupEmail"
                name="email"
                className="form-control"
                placeholder="Email"
                value={signupEmail}
                onChange={(e) => setSignupEmail(e.target.value)}
                autoComplete="off"
              />
              <i className="bx bx-at"></i>
            </div>
            <div className="mdp">
              <input
                type="password"
                id="signupPassword"
                name="password"
                className="form-control"
                value={signupPassword}
                onChange={(e) => setSignupPassword(e.target.value)}
                placeholder="Mot de passe"
                required
              />
              <i id="showSignupPassword" className="bx bxs-show"></i>
            </div>
            <button type="submit" className="btn">
              Sign up
            </button>
          </form>
        </div>

        <div className="login-section">
          <header onClick={() => setIsSignup(false)}>Login</header>

          <div className="social-buttons">
            <button>
              <i className="bx bxl-google"></i> Use Google
            </button>
            <button>
              <i className="bx bxl-apple"></i> Use Apple
            </button>
          </div>

          <div className="separator">
            <div className="line"></div>
            <p>Or</p>
            <div className="line"></div>
          </div>
          {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
          <form onSubmit={(e) => handleSubmit(e)}>
            <div className="custom-input">
              <input
                type="email"
                id="loginEmail"
                name="email"
                className="form-control"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="Email"
                required
              />
              <i className="bx bx-at"></i>
            </div>
            <div className="mdp">
              <input
                type="password"
                id="loginPassword"
                name="loginPassword"
                className="form-control"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="Mot de passe"
                required
              />
              <i id="showLoginPassword" className="bx bxs-show"></i>
            </div>

            <button type="submit" className="btn">
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
export default Login;
