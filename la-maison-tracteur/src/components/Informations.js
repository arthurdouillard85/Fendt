import "../styles/Informations.css";

export default function Informations({ client }) {
  return (
    <div className="lmt-informations">
      <h2>Informations du client</h2>
      <div className="information">
        <label>Nom:</label>
        <p>{client.nom}</p>
      </div>
      <div className="information">
        <label>Prénom:</label>
        <p>{client.prenom}</p>
      </div>
      <div className="information">
        <label>Email:</label>
        <p>{client.email}</p>
      </div>
      <div className="information">
        <label>Numéro de téléphone:</label>
        <p>{client.telephone}</p>
      </div>
      <div className="information">
        <label>Adresse:</label>
        <p>{client.adresse}</p>
      </div>
    </div>
  );
}
