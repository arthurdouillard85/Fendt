const express = require("express");
const multer = require("multer");
const cors = require("cors");
const mysql = require("mysql2");
const app = express();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    const uploadDir = "./images";
    callback(null, uploadDir);
  },
  filename: (req, file, callback) => {
    const fileName = `${Date.now()}-${file.originalname}`;
    callback(null, fileName);
  },
});
const upload = multer({ storage: storage });

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

// Route pour gérer la récupération des utilisateurs
app.get("/users", (req, res) => {
  connection.query("SELECT * FROM utilisateur", (error, results) => {
    if (error) {
      console.error("Erreur lors de la récupération des utilisateurs :", error);
      res.status(500).json({
        error: "Erreur serveur lors de la récupération des utilisateurs.",
      });
    } else {
      res.status(200).json({ users: results });
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
    },
  );
});

app.put("/users/:id", (req, res) => {
  const userId = req.params.id;
  const { role } = req.body;
  connection.query(
    "UPDATE utilisateur SET role = ? WHERE id = ?",
    [role, userId],
    (error, updateResults) => {
      if (error) {
        console.error(
          "Erreur lors de la mise à jour du rôle de l'utilisateur :",
          error,
        );
        res.status(500).json({
          error:
            "Erreur serveur lors de la mise à jour du rôle de l'utilisateur.",
        });
      } else {
        if (updateResults.affectedRows > 0) {
          // Si la mise à jour a réussi, récupérez les détails de l'utilisateur mis à jour
          connection.query(
            "SELECT * FROM utilisateur WHERE id = ?",
            [userId],
            (selectError, selectResults) => {
              if (selectError) {
                console.error(
                  "Erreur lors de la récupération de l'utilisateur mis à jour :",
                  selectError,
                );
                res.status(500).json({
                  error:
                    "Erreur serveur lors de la récupération de l'utilisateur mis à jour.",
                });
              } else {
                if (selectResults.length > 0) {
                  const updatedUser = selectResults[0];
                  res.status(200).json({ user: updatedUser }); // Renvoyer l'utilisateur mis à jour
                } else {
                  res
                    .status(404)
                    .json({ error: "L'utilisateur n'existe pas." });
                }
              }
            },
          );
        } else {
          res.status(404).json({ error: "L'utilisateur n'existe pas." });
        }
      }
    },
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
                selectError,
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
          },
        );
      }
    },
  );
});

// Route pour gérer le téléchargement d'images
app.post("/upload", upload.single("image"), async (req, res) => {
  try {
    // req.file contient les informations sur le fichier téléchargé
    if (req.file) {
      // Si true, le fichier a été téléchargé avec succès
      const imageUrl = `http://localhost:3001/images/${req.file.filename}`;
      // Mise à jour du champ 'cover' dans MySQL avec la nouvelle URL de l'image
      const tracteurId = req.body.tracteurId; // Assurez-vous d'envoyer l'ID du vêtement avec la requête POST (côté Front)
      const updateQuery = "UPDATE tracteur SET cover = ? WHERE id = ?";
      connection.query(
        updateQuery,
        [imageUrl, tracteurId],
        (error, results) => {
          if (error) {
            console.error(
              "Erreur mise à jour du champ cover dans MySQL :",
              error,
            );
            res
              .status(500)
              .json({ error: "Erreur serveur lors mise à jour image." });
          } else {
            // Après la MAJ image, on peut renvoyer l'URL de l'image comme réponse si besoin
            res.status(200).json({ imageUrl: imageUrl });
          }
        },
      );
    } else {
      res.status(400).json({ error: "Aucun fichier téléchargé." });
    }
  } catch (error) {
    console.error("Erreur mise à jour du champ cover dans MySQL :", error);
    res.status(500).json({ error: "Erreur serveur lors mise à jour image." });
  }
});

// bcrypt : Ajouter un nouvel utilisateur
app.post("/signup", (req, res, next) => {
  const { email, password, nom, prenom } = req.body;
  // Vérifier si l'email et le mot de passe sont présents dans la requête
  if (email && password && nom && prenom) {
    // Hasher le mot de passe avant de l'enregistrer dans la base de données
    bcrypt.hash(password, 10, (hashError, hashedPassword) => {
      if (hashError) {
        console.error("Erreur lors du hachage du mot de passe :", hashError);
        res
          .status(500)
          .json({ error: "Erreur serveur lors du hashage du mot de passe." });
      } else {
        connection.query(
          "INSERT INTO utilisateur (email, password, nom, prenom) VALUES (?, ?, ?, ?)",
          [email, hashedPassword, nom, prenom],
          (error, results) => {
            if (error) {
              console.error(
                "Erreur insertion utilisateur dans la base de données :",
                error,
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
          },
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
          error,
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
                  compareError,
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
                  res.status(401).json({ error: "Identifiants incorrects." });
                }
              }
            },
          );
        } else {
          res.status(401).json({ error: "Identifiants incorrects." });
        }
      }
    },
  );
});

// Fonction de route pour récupérer le profil de l'utilisateur
const getUserProfile = (req, res) => {
  try {
    // Récupérer l'ID de l'utilisateur depuis les paramètres de requête
    const userId = req.params.userId;

    // Requête pour récupérer l'email de l'utilisateur depuis la base de données
    const selectQuery = "SELECT email,role FROM utilisateur WHERE id = ?";
    connection.query(selectQuery, [userId], (error, results) => {
      if (error) {
        console.error(
          "Une erreur s'est produite lors de la récupération de l'email de l'utilisateur :",
          error,
        );
        return res.status(500).json({
          message:
            "Une erreur s'est produite lors de la récupération de l'email de l'utilisateur.",
        });
      }
      if (results.length === 0) {
        return res.status(404).json({ message: "L'utilisateur n'existe pas." });
      }

      // Récupérer l'email de l'utilisateur à partir des résultats de la requête
      const userEmail = results[0].email;
      const userRole = results[0].role;

      // Renvoyer l'email de l'utilisateur en tant que réponse
      res.json({ email: userEmail, role: userRole });
    });
  } catch (error) {
    // Gérer les erreurs et renvoyer un message d'erreur approprié
    console.error(
      "Une erreur s'est produite lors de la récupération de l'email de l'utilisateur :",
      error,
    );
    res.status(500).json({
      message:
        "Une erreur s'est produite lors de la récupération de l'email de l'utilisateur.",
    });
  }
};

// Définir la route pour /profile/:userId
app.get("/profile/:userId", getUserProfile);

// Définir la route pour /detail/:userId
app.get("/detail/:userId", getUserProfile);

app.post("/change-password", async (req, res) => {
  // Récupérer les données du corps de la requête
  const { userId, oldPassword, newPassword } = req.body;

  try {
    // Requête pour récupérer le mot de passe haché de l'utilisateur
    const selectQuery = "SELECT password FROM utilisateur WHERE id = ?";
    connection.query(selectQuery, [userId], async (error, results) => {
      if (error) {
        throw error;
      }
      if (results.length === 0) {
        return res.status(404).json({ message: "L'utilisateur n'existe pas." });
      }

      // Vérifier si l'ancien mot de passe correspond au mot de passe stocké dans la base de données
      const hashedPasswordFromDatabase = results[0].password;
      const passwordMatch = await bcrypt.compare(
        oldPassword,
        hashedPasswordFromDatabase,
      );
      if (!passwordMatch) {
        return res
          .status(400)
          .json({ message: "L'ancien mot de passe est incorrect." });
      }

      // Hasher le nouveau mot de passe
      const hashedNewPassword = await bcrypt.hash(newPassword, 10);

      // Requête pour mettre à jour le mot de passe dans la base de données
      const updateQuery = "UPDATE utilisateur SET password = ? WHERE id = ?";
      connection.query(
        updateQuery,
        [hashedNewPassword, userId],
        (updateError, updateResults) => {
          if (updateError) {
            throw updateError;
          }
          console.log("Mot de passe changé avec succès.");
          res.json({ message: "Mot de passe changé avec succès." });
        },
      );
    });
  } catch (error) {
    // Gérer les erreurs
    console.error(
      "Une erreur s'est produite lors du changement de mot de passe :",
      error,
    );
    res.status(500).json({
      message: "Une erreur s'est produite lors du changement de mot de passe.",
    });
  }
});

module.exports = app;
