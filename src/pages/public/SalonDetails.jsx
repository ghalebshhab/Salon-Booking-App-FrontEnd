import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  CalendarCheck,
  Clock,
  Mail,
  MapPin,
  Phone,
  UsersRound,
  Image as ImageIcon,
  Sparkles,
  Scissors,
} from "lucide-react";

import { showErrorToast } from "../../utils/appToast";

import ReviewsList from "../../components/reviews/ReviewsList";
import SalonTeamOrbit from "../../components/salons/SalonTeamOrbit";
import SalonMediaGrid from "../../components/media/SalonMediaGrid";
import SalonStatusBadge from "../../components/salons/SalonStatusBadge";
import SalonServicesList from "../../components/Services/SalonServicesList";

import { getSalonByIdApi } from "../../api/salonApi";
import { getSalonEmployeesApi } from "../../api/SalonEmployeesApi";
import { getSalonMediaApi } from "../../api/mediaApi";

function SalonDetails() {
  const { salonId } = useParams();

  const [salon, setSalon] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [mediaPosts, setMediaPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const getImages = (salonData) => {
    return salonData?.Images || salonData?.images || [];
  };

  const formatTime = (time) => {
    if (!time) return "-";
    return time.toString().slice(0, 5);
  };

  const loadSalonProfile = async () => {
    try {
      setLoading(true);

      const salonResponse = await getSalonByIdApi(salonId);

      if (!salonResponse.success) {
        showErrorToast(salonResponse.message || "Salon not found", "Loading failed");
        return;
      }

      setSalon(salonResponse.data);

      try {
        const employeesResponse = await getSalonEmployeesApi(salonId);

        if (employeesResponse.success) {
          setEmployees(employeesResponse.data || []);
        }
      } catch (error) {
        console.warn("Employees endpoint error:", error);
      }

      try {
        const mediaResponse = await getSalonMediaApi(salonId);

        if (mediaResponse.success) {
          setMediaPosts(mediaResponse.data || []);
        }
      } catch (error) {
        console.warn("Media endpoint error:", error);
      }
    } catch (error) {
      showErrorToast("Failed to load salon profile", "Loading failed");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSalonProfile();
  }, [salonId]);

  if (loading) {
    return (
      <div className="loading">
        Loading salon profile...
      </div>
    );
  }

  if (!salon) {
    return (
      <section className="container section">
        <div className="empty-state">
          <h3>Salon not found</h3>
          <p>Please check the salon ID.</p>
        </div>
      </section>
    );
  }

  const images = getImages(salon);
  const coverImage = images[0];
  const galleryImages = images.slice(1);
  const currentEmployees = salon.currentNumOfEmployees ?? employees.length;
  const maxEmployees = salon.maxNumOfEmployees ?? 0;
  const availableEmployees = Math.max(maxEmployees - currentEmployees, 0);

  return (
    <section className="salon-profile-page">
      <div className="container section">
        <div className="salon-profile-hero">
          <div className="salon-hero-image">
            {coverImage ? (
              <img src={coverImage} alt={salon.name} />
            ) : (
              <div className="salon-hero-placeholder">
                <Scissors size={44} />
                <span>{salon.name?.charAt(0)?.toUpperCase() || "S"}</span>
              </div>
            )}

            <div className="salon-hero-overlay"></div>

            <div className="salon-hero-badge">
              <Sparkles size={16} />
              Featured Salon
            </div>
          </div>

          <div className="salon-hero-content">
            <div className="salon-hero-title-row">
              <div>
                <span className="eyebrow">Salon profile</span>
                <h1>{salon.name}</h1>
                <p>
                  <MapPin size={17} />
                  {salon.city} • {salon.address}
                </p>
              </div>

              <SalonStatusBadge state={salon.state} />
            </div>

            <div className="salon-hero-actions">
              <Link className="btn btn-primary" to={`/salons/${salonId}/book`}>
                <CalendarCheck size={18} />
                Book Appointment
              </Link>

              <a className="btn btn-secondary" href={`tel:${salon.phoneNumber}`}>
                <Phone size={18} />
                Call Salon
              </a>
            </div>

            <div className="salon-profile-stats">
              <div className="salon-stat-card">
                <Clock size={22} />
                <strong>{formatTime(salon.openTime)} - {formatTime(salon.closeTime)}</strong>
                <span>Working hours</span>
              </div>

              <div className="salon-stat-card">
                <UsersRound size={22} />
                <strong>{currentEmployees}/{maxEmployees || "-"}</strong>
                <span>Employees</span>
              </div>

              <div className="salon-stat-card">
                <ImageIcon size={22} />
                <strong>{mediaPosts.length}</strong>
                <span>Work posts</span>
              </div>

              <div className="salon-stat-card">
                <Scissors size={22} />
                <strong>{availableEmployees}</strong>
                <span>Available capacity</span>
              </div>
            </div>
          </div>
        </div>

        <div className="salon-profile-layout">
          <aside className="salon-profile-sidebar">
            <div className="salon-side-card">
              <h3>Contact</h3>

              <p>
                <Phone size={16} />
                {salon.phoneNumber || "Not provided"}
              </p>

              <p>
                <Mail size={16} />
                {salon.email || "Not provided"}
              </p>

              <p>
                <MapPin size={16} />
                {salon.address || "Not provided"}
              </p>
            </div>

            <div className="salon-side-card owner-side-card">
              <h3>Owner</h3>

              <div className="owner-mini-profile">
                <div className="owner-mini-avatar">
                  {salon.ownerName?.charAt(0)?.toUpperCase() || "O"}
                </div>

                <div>
                  <strong>{salon.ownerName || "Salon Owner"}</strong>
                  <span>{salon.ownerEmail || "No email"}</span>
                </div>
              </div>

              <p>
                <Phone size={16} />
                {salon.ownerPhoneNumber || "Not provided"}
              </p>
            </div>
          </aside>

          <main className="salon-profile-content">
            <section className="salon-content-section">
              <div className="salon-section-heading">
                <span className="eyebrow">Book your style</span>
                <h2>Services</h2>
                <p>Choose a service from this salon and send an appointment request.</p>
              </div>

              <SalonServicesList salonId={salonId} />
            </section>

            <section className="salon-content-section">
              <SalonTeamOrbit salon={salon} employees={employees} />
            </section>

            <section className="salon-content-section">
              <div className="salon-section-heading">
                <span className="eyebrow">Customer trust</span>
                <h2>Reviews</h2>
                <p>Real reviews from completed appointments.</p>
              </div>

              <ReviewsList salonId={salonId} />
            </section>

            {(galleryImages.length > 0 || mediaPosts.length > 0) && (
              <section className="salon-content-section">
                <div className="salon-section-heading">
                  <span className="eyebrow">Salon gallery</span>
                  <h2>Work & Media</h2>
                  <p>Explore salon photos, videos, and posted work.</p>
                </div>

                {galleryImages.length > 0 && (
                  <div className="salon-modern-gallery">
                    {galleryImages.map((imageUrl, index) => (
                      <img
                        key={imageUrl + index}
                        src={imageUrl}
                        alt={`${salon.name} gallery ${index + 1}`}
                      />
                    ))}
                  </div>
                )}

                <SalonMediaGrid mediaPosts={mediaPosts} />
              </section>
            )}
          </main>
        </div>
      </div>
    </section>
  );
}

export default SalonDetails;
