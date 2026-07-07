import ProductCard from "../components/ProductCard";
import products from "../data/products";

function Shop() {
  return (
    <div className="shop-container">
      <div className="shop-header">
        <h1>Our Products</h1>
        <p>{products.length} handpicked Indian products, just for you.</p>
      </div>

      <div className="product-grid">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

export default Shop;
