const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const app = express();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
app.use("/images", express.static("images"));

app.use(bodyParser.json());
// Activez CORS pour toutes les routes
app.use(cors());
// Connexion à MySQL
const connection = mysql.createConnection({
  host: "localhost",
  port: 8889,
  user: "root",
  password: "root",
  database: "la-maison-tracteur",
});
connection.connect((err) => {
  if (err) {
    console.error("Erreur de connexion à MySQL :", err);
  } else {
    console.log("Connexion à MySQL réussie !");
  }
});
// Exemple de requête SELECT à partir de votre table vêtement
app.get("/", (req, res, next) => {
  connection.query("SELECT * FROM tracteur", (error, results) => {
    if (error) {
      console.error("Erreur lors de la requête SELECT :", error);
      res
        .status(500)
        .json({ error: "Erreur serveur lors de la requête SELECT." });
    } else {
      res.status(200).json(results);
    }
  });
});
//je récupère un seul tracteur en fonction de son id
app.get("/:id", (req, res, next) => {
  const tracteurId = req.params.id;
  connection.query(
    "SELECT * FROM tracteur WHERE id = ?",
    [tracteurId],
    (error, results) => {
      if (error) {
        console.error("Erreur lors de la requête SELECT :", error);
        res
          .status(500)
          .json({ error: "Erreur serveur lors de la requête SELECT." });
      } else {
        if (results.length > 0) {
          // Si des résultats sont trouvés, renvoyer le premier élément (le vêtement trouvé)
          res.status(200).json(results[0]);
        } else {
          // Si aucun résultat n'est trouvé, renvoyer une réponse 404
          res.status(404).json({ error: "Aucun tracteur trouvé avec cet ID." });
        }
      }
    }
  );
});

//on modifie un seul tracteur en fonction de son id
app.put("/:id", (req, res, next) => {
  const tracteurId = req.params.id;
  const updatedTracteurData = req.body;
  connection.query(
    "UPDATE tracteur SET ? WHERE id = ?",
    [updatedTracteurData, tracteurId],
    (error, results) => {
      if (error) {
        console.error("Erreur lors de la requête UPDATE :", error);
        res
          .status(500)
          .json({ error: "Erreur serveur lors de la requête UPDATE." });
      } else {
        // Après la mise à jour, récupérez à nouveau les données mises à jour
        const selectQuery = "SELECT * FROM tracteur WHERE id = ?";
        connection.query(
          selectQuery,
          [tracteurId],
          (selectError, selectResults) => {
            if (selectError) {
              console.error(
                "Erreur lors récupération données mises à jour :",
                selectError
              );
              res.status(500).json({
                error: "Erreur serveur récupération données mises à jour.",
              });
            } else {
              if (selectResults.length > 0) {
                res.status(200).json(selectResults[0]); // Renvoyez données mises à jour en réponse
              } else {
                res.status(404).json({ error: "L'objet n'existe pas." });
              }
            }
          }
        );
      }
    }
  );
});

// bcrypt : Ajouter un nouvel utilisateur
app.post("/signup", (req, res, next) => {
  const { email, password } = req.body;
  // Vérifier si l'email et le mot de passe sont présents dans la requête
  if (email && password) {
    // Hasher le mot de passe avant de l'enregistrer dans la base de données
    bcrypt.hash(password, 10, (hashError, hashedPassword) => {
      if (hashError) {
        console.error("Erreur lors du hachage du mot de passe :", hashError);
        res
          .status(500)
          .json({ error: "Erreur serveur lors création utilisateur." });
      } else {
        connection.query(
          "INSERT INTO utilisateur (email, password) VALUES (?, ?)",
          [email, hashedPassword],
          (error, results) => {
            if (error) {
              console.error(
                "Erreur insertion utilisateur dans la base de données :",
                error
              );
              res
                .status(500)
                .json({ error: "Erreur serveur lors création utilisateur." });
            } else {
              const userId = results.insertId; // Récupére ID utilisateur nouvellement créé
              res.status(201).json({
                message: "Utilisateur créé avec succès.",
                userId: userId,
              });
            }
          }
        );
      }
    });
  } else {
    res
      .status(400)
      .json({ error: "Email et mot de passe requis pour inscription." });
  }
});
// Route pour gérer l'authentification de l'utilisateur
app.post("/login", (req, res, next) => {
  const { email, password } = req.body;
  // Récupérer le mot de passe haché de l'utilisateur depuis la base de données
  connection.query(
    "SELECT * FROM utilisateur WHERE email = ?",
    [email],
    (error, results) => {
      if (error) {
        console.error(
          "Erreur lors recherche utilisateur dans base de données :",
          error
        );
        res
          .status(500)
          .json({ error: "Erreur serveur lors authentification." });
      } else {
        if (results.length > 0) {
          const hashedPasswordFromDB = results[0].password;
          // Comparer le mot de passe fourni avec le mot de passe haché stocké dans MySQL
          bcrypt.compare(
            password,
            hashedPasswordFromDB,
            (compareError, match) => {
              if (compareError) {
                console.error(
                  "Erreur lors comparaison des mots de passe :",
                  compareError
                );
                res
                  .status(500)
                  .json({ error: "Erreur serveur lors authentification." });
              } else {
                if (match) {
                  const userId = results[0].id; // 'id' est la colonne contenant l'ID utilisateur

                  // Générer un token JWT
                  const token = jwt.sign({ userId }, "votre_clé_secrète", {
                    expiresIn: "24h",
                  });

                  res.status(200).json({
                    message: "Authentification réussie.",
                    userId: userId,
                    token: token,
                  });
                } else {
                  res.status(401).json({ error: "Identifiants i<<ncorrects." });
                }
              }
            }
          );
        } else {
          res.status(401).json({ error: "Identifiants incorrects." });
        }
      }
    }
  );
});
module.exports = app;
