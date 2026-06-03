import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getActiveSalonServicesApi } from "../../api/SalonServicesApi";

function SalonServicesList({ salonId }) {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadServices = async () => {
    try {
      setLoading(true);

      const response = await getActiveSalonServicesApi(salonId);

      if (response.success) {
        setServices(response.data || []);
      } else {
        toast.error(response.message || "Failed to load services");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load salon services");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (salonId) {
      loadServices();
    }
  }, [salonId]);

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

          <button className="btn btn-primary btn-small" disabled>
            Book Soon
          </button>
        </div>
      ))}
    </div>
  );
}

export default SalonServicesList;