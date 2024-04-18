import Chevaux from "../assets/cheval.png";
import Fuel from "../assets/fuel.png";

// Ici, il s'agit d'une manière de faire.
//Vous auriez aussi pu utiliser une fonction qui retourne l'élément souhaité, ou bien faire directement des conditions
const quantityLabel = {
  1: "peu",
  2: "peu",
  3: "peu",
  4: "modérément",
  5: "modérément",
  6: "modérément",
  7: "beaucoup",
  8: "beaucoup",
  9: "beaucoup",
  10: "beaucoup",
};

function CareScale({ scaleValue, careType }) {
  const range = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const scaleType =
    careType === "chevaux" ? (
      <img src={Chevaux} alt="cheval-icon" />
    ) : (
      <img src={Fuel} alt="fuel-icon" />
    );

  return (
    <div
      onClick={() =>
        alert(
          `Cette tracteur à ${quantityLabel[scaleValue]} ${
            careType === "chevaux" ? "de chevaux" : " de consommation"
          }`
        )
      }
    >
      {range.map((rangeElem) =>
        scaleValue >= rangeElem ? (
          <span key={rangeElem.toString()}>{scaleType}</span>
        ) : null
      )}
    </div>
  );
}

export default CareScale;
