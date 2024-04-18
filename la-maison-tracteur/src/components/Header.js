import { Link } from "react-router-dom";
function Header() {
  return (
    <nav>
      <Link to="/">Accueil</Link>&nbsp;&nbsp;
      <Link to="/question/1">Questionnaire</Link>&nbsp;&nbsp;
      <Link to="/login">Se connecter</Link>&nbsp;&nbsp;
      <Link to="/profile">Profile</Link>&nbsp;&nbsp;
    </nav>
  );
}
export default Header;
