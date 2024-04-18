import { useEffect, useState } from "react";
import "../styles/ShoppingList.css";
import Categories from "./Categories";
import TracteurItem from "./TracteurItem";

function ShoppingList({ cart, updateCart }) {
  const [tracteurList, setTracteurList] = useState([]);
  const [activeCategory, setActiveCategory] = useState("");

  useEffect(() => {
    fetch("http://localhost:3001/")
      .then((response) => response.json())
      .then((data) => {
        setTracteurList(data);
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des données :", error);
      });
  }, []);

  const categories = tracteurList.reduce(
    (acc, elem) =>
      acc.includes(elem.category) ? acc : acc.concat(elem.category),
    []
  );

  function addToCart(name, price) {
    const currentTracteurAdded = cart.find(
      (tracteur) => tracteur.name === name
    );
    if (currentTracteurAdded) {
      const cartFilteredCurrentTracteur = cart.filter(
        (tracteur) => tracteur.name !== name
      );
      updateCart([
        ...cartFilteredCurrentTracteur,
        { name, price, amount: currentTracteurAdded.amount + 1 },
      ]);
    } else {
      updateCart([...cart, { name, price, amount: 1 }]);
    }
  }

  return (
    <div className="lmt-shopping-list">
      <Categories
        categories={categories}
        setActiveCategory={setActiveCategory}
        activeCategory={activeCategory}
      />

      <ul className="lmt-tracteur-list">
        {tracteurList.map(
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
                <button onClick={() => addToCart(name, price)}>Ajouter</button>
              </div>
            ) : null
        )}
      </ul>
    </div>
  );
}

export default ShoppingList;
