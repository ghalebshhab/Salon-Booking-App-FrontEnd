import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  showSuccessToast,
  showErrorToast,
  showInfoToast,
  showWarningToast,
} from "../../utils/appToast";
import { Edit, Trash2, Plus } from "lucide-react";

import {
  getMySalonServicesApi,
  deleteSalonServiceApi,
} from "../../api/SalonServicesApi";

function MySalonServices() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadServices = async () => {
    try {
      setLoading(true);

      const response = await getMySalonServicesApi();

      if (response.success) {
        setServices(response.data || []);
      } else {
        showErrorToast(response.message || "Failed to load services");
      }
    } catch (error) {
      console.error(error);
      showErrorToast("Failed to load your salon services");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

  const handleDelete = async (serviceId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to disable this service?"
    );

    if (!confirmDelete) return;

    try {
      const response = await deleteSalonServiceApi(serviceId);

      if (response.success) {
        showSuccessToast("Service disabled successfully");
        loadServices();
      } else {
        showErrorToast(response.message || "Failed to disable service");
      }
    } catch (error) {
      console.error(error);
      showErrorToast("Failed to disable service");
    }
  };

  if (loading) {
    return <div className="loading">Loading services...</div>;
  }

  return (
    <section className="container section">
      <div className="profile-header">
        <div>
          <span className="eyebrow">Salon services</span>
          <h1>Manage Services</h1>
          <p>Add, update, or disable the services that your salon provides.</p>
        </div>

        <Link className="btn btn-primary" to="/owner/create-service">
          <Plus size={18} />
          Add Service
        </Link>
      </div>

      {services.length === 0 ? (
        <div className="empty-state">
          <h3>No services found</h3>
          <p>You have not added any salon services yet.</p>

          <Link className="btn btn-primary" to="/owner/create-service">
            Add First Service
          </Link>
        </div>
      ) : (
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
                <span className={service.isActive ? "active-tag" : "inactive-tag"}>
                  {service.isActive ? "Active" : "Inactive"}
                </span>
              </div>

              <div className="service-actions">
                <Link
                  className="btn btn-secondary btn-small"
                  to={`/owner/services/${service.id}/edit`}
                  state={{ service }}
                >
                  <Edit size={16} />
                  Edit
                </Link>

                <button
                  className="btn btn-danger btn-small"
                  onClick={() => handleDelete(service.id)}
                >
                  <Trash2 size={16} />
                  Disable
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default MySalonServices;