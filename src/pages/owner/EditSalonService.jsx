import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams, Link } from "react-router-dom";
import { toast } from "react-toastify";

import {
  getMySalonServicesApi,
  updateSalonServiceApi,
} from "../../api/SalonServicesApi";

function EditSalonService() {
  const { serviceId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    durationMinutes: "",
    isActive: true,
  });

  const [loading, setLoading] = useState(!location.state?.service);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const serviceFromState = location.state?.service;

    if (serviceFromState) {
      setFormData({
        name: serviceFromState.name || "",
        description: serviceFromState.description || "",
        price: serviceFromState.price || "",
        durationMinutes: serviceFromState.durationMinutes || "",
        isActive: serviceFromState.isActive ?? true,
      });
      return;
    }

    const loadService = async () => {
      try {
        setLoading(true);

        const response = await getMySalonServicesApi();

        if (response.success) {
          const service = response.data?.find(
            (item) => String(item.id) === String(serviceId)
          );

          if (!service) {
            toast.error("Service not found");
            navigate("/owner/services");
            return;
          }

          setFormData({
            name: service.name || "",
            description: service.description || "",
            price: service.price || "",
            durationMinutes: service.durationMinutes || "",
            isActive: service.isActive ?? true,
          });
        } else {
          toast.error(response.message || "Failed to load service");
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to load service");
      } finally {
        setLoading(false);
      }
    };

    loadService();
  }, [serviceId, location.state, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast.error("Service name is required");
      return false;
    }

    if (Number(formData.price) <= 0) {
      toast.error("Price must be greater than 0");
      return false;
    }

    if (Number(formData.durationMinutes) <= 0) {
      toast.error("Duration must be greater than 0");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const requestBody = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      price: Number(formData.price),
      durationMinutes: Number(formData.durationMinutes),
      isActive: formData.isActive,
    };

    try {
      setSubmitting(true);

      const response = await updateSalonServiceApi(serviceId, requestBody);

      if (response.success) {
        toast.success("Service updated successfully");
        navigate("/owner/services");
      } else {
        toast.error(response.message || "Failed to update service");
      }
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Failed to update service");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading service...</div>;
  }

  return (
    <section className="container section">
      <div className="profile-header">
        <div>
          <span className="eyebrow">Edit service</span>
          <h1>Update Salon Service</h1>
          <p>Edit service information shown in your salon profile.</p>
        </div>

        <Link className="btn btn-secondary" to="/owner/services">
          Back to Services
        </Link>
      </div>

      <form className="form-card" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Service Name</label>
          <input
            type="text"
            name="name"
            placeholder="Example: Haircut"
            value={formData.name}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            name="description"
            placeholder="Describe this service..."
            value={formData.description}
            onChange={handleChange}
            rows="4"
          />
        </div>

        <div className="form-grid-two">
          <div className="form-group">
            <label>Price JD</label>
            <input
              type="number"
              name="price"
              placeholder="5"
              value={formData.price}
              onChange={handleChange}
              min="0"
              step="0.1"
            />
          </div>

          <div className="form-group">
            <label>Duration Minutes</label>
            <input
              type="number"
              name="durationMinutes"
              placeholder="30"
              value={formData.durationMinutes}
              onChange={handleChange}
              min="1"
            />
          </div>
        </div>

        <label className="checkbox-row">
          <input
            type="checkbox"
            name="isActive"
            checked={formData.isActive}
            onChange={handleChange}
          />
          Active service
        </label>

        <button className="btn btn-primary" type="submit" disabled={submitting}>
          {submitting ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </section>
  );
}

export default EditSalonService;