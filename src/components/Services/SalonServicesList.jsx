import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  showSuccessToast,
  showErrorToast,
  showInfoToast,
  showWarningToast,
} from "../../utils/appToast";
import { CalendarDays } from "lucide-react";

import { getActiveSalonServicesApi } from "../../api/SalonServicesApi";

function SalonServicesList({ salonId }) {
  const navigate = useNavigate();

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadServices = async () => {
    try {
      setLoading(true);

      const response = await getActiveSalonServicesApi(salonId);

      if (response.success) {
        setServices(response.data || []);
      } else {
        showErrorToast(response.message || "Failed to load services");
      }
    } catch (error) {
      console.error(error);
      showErrorToast("Failed to load salon services");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (salonId) {
      loadServices();
    }
  }, [salonId]);

  const handleBookNow = (service) => {
    navigate(`/salons/${salonId}/book`, {
      state: {
        selectedServiceId: service.id,
      },
    });
  };

  if (loading) {
    return <div className="loading">Loading services...</div>;
  }

  if (services.length === 0) {
    return (
      <div className="empty-state">
        <h3>No services yet</h3>
        <p>This salon has not added services yet.</p>
      </div>
    );
  }

  return (
    <div className="services-grid">
      {services.map((service) => (
        <div className="service-card" key={service.id}>
          <div>
            <h3>{service.name}</h3>
            <p>{service.description || "No description provided."}</p>
          </div>

          <div className="service-meta">
            <span>{service.price} JD</span>
            <span>{service.durationMinutes} min</span>
          </div>

          <button
            className="btn btn-primary btn-small"
            onClick={() => handleBookNow(service)}
          >
            <CalendarDays size={16} />
            Book Now
          </button>
        </div>
      ))}
    </div>
  );
}

export default SalonServicesList;