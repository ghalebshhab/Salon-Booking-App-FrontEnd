import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MapPin, Clock, ArrowRight } from "lucide-react";
import {
  showSuccessToast,
  showErrorToast,
  showInfoToast,
  showWarningToast,
} from "../../utils/appToast";

import { getAllSalonsApi } from "../../api/salonApi";

function SalonShowcase() {
  const [salons, setSalons] = useState([]);
  const [loading, setLoading] = useState(true);

  const getImages = (salon) => {
    return salon?.Images || salon?.images || [];
  };

  const formatTime = (time) => {
    if (!time) return "—";
    return time.toString().slice(0, 5);
  };

  const loadSalons = async () => {
    try {
      setLoading(true);

      const response = await getAllSalonsApi();

      if (response.success) {
        setSalons(response.data || []);
      } else {
        showErrorToast(response.message || "Failed to load salons");
      }
    } catch (error) {
      console.error(error);
      showErrorToast("Failed to load salons");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSalons();
  }, []);

  if (loading) {
    return (
      <div className="loading">
        Loading salons...
      </div>
    );
  }

  if (salons.length === 0) {
    return (
      <div className="empty-state">
        <h3>No salons yet</h3>
        <p>Salon profiles will appear here when owners create them.</p>
      </div>
    );
  }

  return (
    <div className="salon-showcase-grid">
      {salons.map((salon) => {
        const images = getImages(salon);
        const coverImage = images[0];

        return (
          <Link
            to={`/salons/${salon.salonId}`}
            className="salon-showcase-card"
            key={salon.salonId}
          >
            <div className="salon-showcase-image">
              {coverImage ? (
                <img src={coverImage} alt={salon.name} />
              ) : (
                <div className="salon-showcase-placeholder">
                  {salon.name?.charAt(0)?.toUpperCase() || "S"}
                </div>
              )}

              <span
                className={
                  salon.state === "OPEN"
                    ? "salon-state-badge open"
                    : "salon-state-badge closed"
                }
              >
                {salon.state}
              </span>
            </div>

            <div className="salon-showcase-body">
              <h3>{salon.name}</h3>

              <p className="salon-location">
                <MapPin size={16} />
                {salon.city} • {salon.address}
              </p>

              <p className="salon-time">
                <Clock size={16} />
                {formatTime(salon.openTime)} - {formatTime(salon.closeTime)}
              </p>

              <div className="salon-showcase-footer">
                <span>View profile</span>
                <ArrowRight size={18} />
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

export default SalonShowcase;