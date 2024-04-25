import { useEffect } from "react";
import { useHistory } from "react-router-dom";

export default function Logout() {
  const history = useHistory();

  useEffect(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    history.push("/login");
    window.location.reload();
  }, [history]);

  return null;
}
