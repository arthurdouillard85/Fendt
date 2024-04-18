import "../styles/TracteurItem.css";
import CareScale from "./CareScale";

function handleClick(tracteurName) {
  alert(`Vous voulez acheter 1 ${tracteurName}?`);
}

function TracteurItem({ id, cover, name, fuel, chevaux, price }) {
  const idValue = id;
  return (
    <li className="lmt-tracteur-item" onClick={() => handleClick(name)}>
      <span className="lmt-tracteur-item-price">{price}€</span>
      <a href={`/detail/${idValue}`}>
        <img
          className="lmt-tracteur-item-cover"
          src={cover}
          alt={`${name} cover`}
        />
      </a>
      {name}
      <div>
        <CareScale careType="fuel" scaleValue={fuel} />
        <CareScale careType="chevaux" scaleValue={chevaux} />
      </div>
    </li>
  );
}

export default TracteurItem;
