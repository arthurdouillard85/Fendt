import { useEffect, useState } from "react";
import "../styles/Utilisateurs.css";

export default function Utilisateurs() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:3001/users`)
      .then((response) => response.json())
      .then((data) => {
        if (data.users) {
          setUsers(data.users);
        } else {
          console.error("Impossible de récupérer les utilisateurs.");
        }
      })
      .catch((error) => {
        console.error(
          "Erreur lors de la récupération des données des utilisateurs:",
          error,
        );
      });
  }, []);

  const handleRoleChange = (userId, newRole) => {
    fetch(`http://localhost:3001/users/${userId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: newRole }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            "Erreur lors de la mise à jour du rôle de l'utilisateur.",
          );
        }
        return response.json();
      })
      .then((data) => {
        console.log(data.user);
        if (data.user) {
          setUsers((prevUsers) =>
            prevUsers.map((user) => (user.id === userId ? data.user : user)),
          );
        } else {
          throw new Error(
            "Impossible de mettre à jour le rôle de l'utilisateur.",
          );
        }
      })
      .catch((error) => {
        console.error(
          "Une erreur s'est produite lors de la mise à jour du rôle de l'utilisateur :",
          error,
        );
      });
  };

  return (
    <div className="container utilisateurs-container">
      <h1 className="utilisateurs-title">Liste des utilisateurs</h1>
      <table className="utilisateurs-table">
        <thead>
          <tr>
            <th>Prénom</th>
            <th>Nom</th>
            <th>Email</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>
          {users && users.length > 0 ? (
            users.map((user) => (
              <tr key={user.id}>
                <td>{user.nom}</td>
                <td>{user.prenom}</td>
                <td>{user.email}</td>
                <td>
                  Admin &nbsp;
                  <label
                    className="slider-checkbox"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <input
                      type="checkbox"
                      checked={user.role === "admin"}
                      onChange={(e) => {
                        const newRole = e.target.checked
                          ? "admin"
                          : "utilisateur";
                        handleRoleChange(user.id, newRole);
                      }}
                    />
                    <span className="slider"></span>
                  </label>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3">Aucun utilisateur trouvé</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
