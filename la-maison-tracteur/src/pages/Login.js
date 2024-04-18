import React, { useEffect, useState } from "react";
import "../styles/Login.css";

function Login() {
  const [email, setEmail] = useState(""); // Etat qui Stocke l'email de l'utilisateur
  const [password, setPassword] = useState(""); // Etat qui Stocke le mot de passe de l'utilisateur.
  const [isSignup, setIsSignup] = useState(true);
  const [errorMessage, setErrorMessage] = useState(""); // Stocke les messages d'erreur à afficher.

  useEffect(() => {
    // Vérifiez si un token est déjà stocké localement
    const token = localStorage.getItem("token");
    if (token) {
      // Si un token est présent, redirigez l'utilisateur vers la page de profil
      window.location.href = "/profile";
    }
    const modaleContainer = document.querySelector(".modale-container");
    const inputSignup = modaleContainer.querySelector(
      ".signup-section .mdp input"
    );
    const showBtnSignup = modaleContainer.querySelector(
      ".signup-section .mdp i"
    );
    const inputLogin = modaleContainer.querySelector(
      ".login-section .mdp input"
    );
    const showBtnLogin = modaleContainer.querySelector(".login-section .mdp i");

    const container = document.querySelector(".container");
    const signupButton = document.querySelector(".signup-section header");
    const loginButton = document.querySelector(".login-section header");

    showBtnSignup.addEventListener("click", () => {
      if (inputSignup.type === "password") {
        inputSignup.type = "text";
        showBtnSignup.classList.remove("bxs-show");
        showBtnSignup.classList.add("bxs-hide");
      } else {
        inputSignup.type = "password";
        showBtnSignup.classList.remove("bxs-hide");
        showBtnSignup.classList.add("bxs-show");
      }
    });

    showBtnLogin.addEventListener("click", () => {
      if (inputLogin.type === "password") {
        inputLogin.type = "text";
        showBtnLogin.classList.remove("bxs-show");
        showBtnLogin.classList.add("bxs-hide");
      } else {
        inputLogin.type = "password";
        showBtnLogin.classList.remove("bxs-hide");
        showBtnLogin.classList.add("bxs-show");
      }
    });

    loginButton.addEventListener("click", () => {
      setIsSignup(false);
      container.classList.add("active");
    });

    signupButton.addEventListener("click", () => {
      setIsSignup(true);
      container.classList.remove("active");
    });
  }, []);

  const handleSubmit = async (e) => {
    //Lorsque l'utilisateur soumet le formulaire, la fonction handleSubmit envoie une requête POST au backend (soit /signup pour l'inscription, soit /login pour la connexion) avec les données email et password.
    e.preventDefault();
    try {
      const url = isSignup
        ? "http://localhost:3001/signup"
        : "http://localhost:3001/login";
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
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
          <header>Sign up</header>

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
          <form onSubmit={handleSubmit}>
            <div className="custom-input">
              <input
                type="email"
                id="email"
                name="email"
                className="form-control"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="off"
              />
              <i className="bx bx-at"></i>
            </div>
            <div className="mdp">
              <input
                type="password"
                id="loginPassword"
                name="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mot de passe"
                required
              />
              <i className="bx bxs-show"></i>
            </div>
            <button type="submit" className="btn">
              Sign up
            </button>
          </form>
        </div>

        <div className="login-section">
          <header>Login</header>

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
          <form onSubmit={handleSubmit}>
            <div className="custom-input">
              <input
                type="email"
                id="email"
                name="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
              />
              <i className="bx bx-at"></i>
            </div>
            <div className="mdp">
              <input
                type="password"
                id="password"
                name="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mot de passe"
                required
              />
              <i className="bx bxs-show"></i>
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
