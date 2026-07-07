import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import products from "../data/products";

function ProductDetail() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const product = products.find((p) => p.id === Number(id));

  function handleAddToCart() {
    addToCart(product);
    setAdded(true);
  }

  if (!product) {
    return (
      <div className="product-detail">
        <p>
          Product not found. <Link to="/shop">Back to shop</Link>
        </p>
      </div>
    );
  }

  return (
    <div className="product-detail">
      <img src={product.thumbnail} alt={product.title} />
      <div className="product-info">
        <h1>{product.title}</h1>
        <p className="price">₹{product.price.toLocaleString("en-IN")}</p>
        <p className="stock">{product.stock} in stock &middot; ⭐ {product.rating}</p>
        <p className="description">{product.description}</p>
        <button onClick={handleAddToCart}>
          {added ? "Added to Cart!" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}

export default ProductDetail;
