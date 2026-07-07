import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

function Cart() {
  const { cartItems, removeFromCart, cartTotal } = useCart();

  if (cartItems.length === 0) {
    return (
      <div className="cart-container">
        <h1>Your Cart</h1>
        <p>Your cart is empty. <Link to="/shop">Go to Shop</Link></p>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <h1>Your Cart</h1>

      <div className="cart-items">
        {cartItems.map((item) => (
          <div className="cart-item" key={item.id}>
            <img src={item.thumbnail} alt={item.title} />
            <div className="cart-item-info">
              <h3>{item.title}</h3>
              <p>₹{item.price.toLocaleString("en-IN")} x {item.quantity}</p>
            </div>
            <div className="cart-item-total">
              ₹{(item.price * item.quantity).toLocaleString("en-IN")}
            </div>
            <button onClick={() => removeFromCart(item.id)}>Remove</button>
          </div>
        ))}
      </div>

      <div className="cart-total">
        <h2>Total: ₹{cartTotal.toLocaleString("en-IN")}</h2>
      </div>
    </div>
  );
}

export default Cart;
