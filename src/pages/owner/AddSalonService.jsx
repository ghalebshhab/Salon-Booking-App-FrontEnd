import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  showSuccessToast,
  showErrorToast,
  showInfoToast,
  showWarningToast,
} from "../../utils/appToast";

import { createSalonServiceApi } from "../../api/SalonServicesApi";

function CreateSalonService() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    durationMinutes: "",
  });

  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      showErrorToast("Service name is required");
      return false;
    }

    if (Number(formData.price) <= 0) {
      showErrorToast("Price must be greater than 0");
      return false;
    }

    if (Number(formData.durationMinutes) <= 0) {
      showErrorToast("Duration must be greater than 0");
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
    };

    try {
      setSubmitting(true);

      const response = await createSalonServiceApi(requestBody);

      if (response.success) {
        showSuccessToast("Service created successfully");
        navigate("/owner/services");
      } else {
        showErrorToast(response.message || "Failed to create service");
      }
    } catch (error) {
      console.error(error);
      showErrorToast(error?.response?.data?.message || "Failed to create service");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="container section">
      <div className="profile-header">
        <div>
          <span className="eyebrow">New service</span>
          <h1>Add Salon Service</h1>
          <p>Create a service that customers can see in your salon profile.</p>
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

        <button className="btn btn-primary" type="submit" disabled={submitting}>
          {submitting ? "Creating..." : "Create Service"}
        </button>
      </form>
    </section>
  );
}

export default CreateSalonService;