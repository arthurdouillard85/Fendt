import "../styles/Categories.css";

function Categories({ setActiveCategory, categories, activeCategory }) {
  return (
    <div className="lmt-categories">
      <select
        value={activeCategory}
        onChange={(e) => setActiveCategory(e.target.value)}
        className="lmt-categories-select"
      >
        <option value="">---</option>
        {categories.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>
      <button onClick={() => setActiveCategory("")}>Réinitialiser</button>
    </div>
  );
}

export default Categories;
