import { useParams, Link } from "react-router-dom";
import products from "../data/products";

function ProductDetail() {
  const { id } = useParams();

  const product = products.find((p) => p.id === Number(id));

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
      </div>
    </div>
  );
}

export default ProductDetail;
