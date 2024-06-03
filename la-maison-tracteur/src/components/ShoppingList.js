import { useContext, useEffect, useState } from "react";
import "../styles/ShoppingList.css";
import Categories from "./Categories";
import TracteurItem from "./TracteurItem";
import CartOpenContext from "../context/CartOpenContext";
import plus from "../assets/plus.png";

function ShoppingList() {
  const [tracteurList, setTracteurList] = useState([]);
  const [activeCategory, setActiveCategory] = useState("");
  const [role, setRole] = useState("");
  const [userId, setUserId] = useState("");
  const { isCartOpen } = useContext(CartOpenContext);

  useEffect(() => {
    fetch("http://localhost:3001/")
      .then((response) => response.json())
      .then((data) => {
        setTracteurList(data);
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des données :", error);
      });
    const userIdFromLocalStorage = localStorage.getItem("userId");
    setUserId(userIdFromLocalStorage);

    // Requête pour récupérer l'email, le téléphone et l'adresse de l'utilisateur à partir de l'ID de l'utilisateur
    fetch(`http://localhost:3001/profile/${userIdFromLocalStorage}`)
      .then((response) => response.json())
      .then((data) => {
        if (data) {
          setRole(data.role);
        } else {
          console.error("Impossible de récupérer l'email de l'utilisateur.");
        }
      })
      .catch((error) =>
        console.error(
          "Une erreur s'est produite lors de la récupération de l'email de l'utilisateur :",
          error,
        ),
      );
  }, []);

  const categories = Array.isArray(tracteurList)
    ? tracteurList.reduce(
        (acc, elem) =>
          acc.includes(elem.category) ? acc : acc.concat(elem.category),
        [],
      )
    : [];

  return (
    <div
      className={
        isCartOpen ? "lmt-shopping-list-with-cart" : "lmt-shopping-list"
      }
    >
      <Categories
        categories={categories}
        setActiveCategory={setActiveCategory}
        activeCategory={activeCategory}
      />

      <ul className="lmt-tracteur-list">
        {Array.isArray(tracteurList)
          ? tracteurList.map(
              ({ id, cover, name, fuel, chevaux, price, category }) =>
                !activeCategory || activeCategory === category ? (
                  <div key={id}>
                    <TracteurItem
                      id={id}
                      cover={cover}
                      name={name}
                      fuel={fuel}
                      chevaux={chevaux}
                      price={price}
                    />
                  </div>
                ) : null,
            )
          : []}
        {role === "admin" && (
          <div>
            <div key={tracteurList.length + 1}>
              <a href={`/ajout`}>
                <img className="lmt-tracteur-item-cover" src={plus} />
              </a>
            </div>
            Ajouter un engin
          </div>
        )}
      </ul>
    </div>
  );
}

export default ShoppingList;
