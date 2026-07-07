import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-banner">
      <h1>Welcome to ShopZone!</h1>
      <p>Check out all our products.</p>
      <button onClick={() => navigate("/shop")}>Go to Shop</button>
    </div>
  );
}

export default Home;
