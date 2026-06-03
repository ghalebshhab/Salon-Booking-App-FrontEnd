import { Link } from "react-router-dom";
import { Scissors, Users, CalendarCheck, Image } from "lucide-react";
import BarberAnimation from "../../components/common/BarberAnimation";
import SalonShowcase from "../../components/salons/SalonShowcase";
function Home() {
  return (
    <div>
      <section className="hero">
        <div className="container hero-grid">
          <div>
            <span className="eyebrow">Salon community in Jordan</span>
            <h1>Discover salons, watch their work, and join their teams.</h1>
            <p>
              SalonHub helps salons create profiles, share images and videos,
              post hiring needs, and let customers reserve services.
            </p>

            <div className="hero-actions">
              <Link className="btn btn-primary" to="/hiring-posts">
                View Hiring Posts
              </Link>
              <Link className="btn btn-secondary" to="/register">
                Create Account
              </Link>
            </div>
          </div>

       <div className="hero-card hero-animation-card">
  <BarberAnimation />
</div>
        </div>
      </section>
      <section className="container section">
  <div className="section-title">
    <span className="eyebrow">Explore salons</span>
    <h2>Discover salon work</h2>
    <p>
      Browse salons, view their photos, check their services, and open their profile.
    </p>
  </div>

  <SalonShowcase />
</section>

      <section className="container section">
        <div className="section-title">
          <h2>What the platform supports</h2>
          <p>Start with the backend features you already built, then grow later.</p>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <Scissors />
            <h3>Salon Profiles</h3>
            <p>Display salon information, city, address, phone, owner, and work gallery.</p>
          </div>

          <div className="feature-card">
            <Image />
            <h3>Images & Videos</h3>
            <p>Salons can post videos and images of haircuts and styling work.</p>
          </div>

          <div className="feature-card">
            <Users />
            <h3>Hiring Posts</h3>
            <p>Salon owners can post employee needs and barbers can join if allowed.</p>
          </div>

          <div className="feature-card">
            <CalendarCheck />
            <h3>Reservations Later</h3>
            <p>Customers will be able to book appointments in salons in the future.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
