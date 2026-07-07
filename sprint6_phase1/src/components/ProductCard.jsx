import { useNavigate } from "react-router-dom";

function ProductCard({ product }) {
  const navigate = useNavigate();

  function goToProduct() {
    navigate("/product/" + product.id);
  }

  return (
    <div className="product-card" onClick={goToProduct}>
      <img src={product.thumbnail} alt={product.title} />
      <h3>{product.title}</h3>
      <p className="card-price">₹{product.price.toLocaleString("en-IN")}</p>
    </div>
  );
}

export default ProductCard;
