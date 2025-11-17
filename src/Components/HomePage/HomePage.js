import "./HomePage.css";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import { Link } from "react-router-dom";


function HomePage() {
  return (
    <>
      <title>Warehouse Management System</title>
      <Header />

      <main className="home-container">
        <section className="welcome-card">
          <h1>MSIPL Warehouse Software</h1>
          <p>
            Streamline your inventory, and manage operations
            efficiently.
          </p>
          <div className="cta-buttons">
            <Link to="/login" className="primary-btn">
              Sign In
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

export default HomePage;
