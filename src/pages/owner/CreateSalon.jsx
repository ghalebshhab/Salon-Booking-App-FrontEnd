import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { createSalonApi } from "../../api/salonApi";

function CreateSalon() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
    phoneNumber: "",
    openTime: "09:00:00",
    closeTime: "18:00:00",
    city: "",
    state: "OPEN",
    maxNumOfEmployees: 5,
    Images: "",
  });

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  };

  const buildPayload = () => {
    const imageUrls = form.Images
      ? form.Images.split(",").map((url) => url.trim()).filter(Boolean)
      : [];

    return {
      name: form.name,
      email: form.email,
      address: form.address,
      phoneNumber: form.phoneNumber,
      openTime: form.openTime,
      closeTime: form.closeTime,
      city: form.city,
      state: form.state,
      maxNumOfEmployees: Number(form.maxNumOfEmployees),
      Images: imageUrls,
    };
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);
      const response = await createSalonApi(buildPayload());

      if (!response.success) {
        toast.error(response.message || "Failed to create salon");
        return;
      }

      toast.success("Salon created successfully!");
      navigate("/owner/my-salon");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to create salon");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="form-page">
      <form className="form-card" onSubmit={handleSubmit}>
        <h1>Create Salon</h1>
        <p className="muted">Owner token will be used automatically from login.</p>

        <div className="form-row">
          <div className="form-group">
            <label>Salon Name</label>
            <input name="name" value={form.name} onChange={handleChange} placeholder="Royal Beauty Salon" required />
          </div>

          <div className="form-group">
            <label>Salon Email</label>
            <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="salon@test.com" required />
          </div>
        </div>

        <div className="form-group">
          <label>Address</label>
          <input name="address" value={form.address} onChange={handleChange} placeholder="University Street" required />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Phone Number</label>
            <input name="phoneNumber" value={form.phoneNumber} onChange={handleChange} placeholder="+962791111111" required />
          </div>

          <div className="form-group">
            <label>City</label>
            <input name="city" value={form.city} onChange={handleChange} placeholder="Irbid" required />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Open Time</label>
            <input name="openTime" type="time" value={form.openTime.slice(0, 5)} onChange={(e) => setForm({ ...form, openTime: `${e.target.value}:00` })} />
          </div>

          <div className="form-group">
            <label>Close Time</label>
            <input name="closeTime" type="time" value={form.closeTime.slice(0, 5)} onChange={(e) => setForm({ ...form, closeTime: `${e.target.value}:00` })} />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>State</label>
            <select name="state" value={form.state} onChange={handleChange}>
              <option value="OPEN">OPEN</option>
              <option value="CLOSED">CLOSED</option>
            </select>
          </div>

          <div className="form-group">
            <label>Max Employees</label>
            <input name="maxNumOfEmployees" type="number" min="1" value={form.maxNumOfEmployees} onChange={handleChange} />
          </div>
        </div>

        <div className="form-group">
          <label>Image URLs separated by comma</label>
          <textarea name="Images" value={form.Images} onChange={handleChange} placeholder="https://example.com/1.jpg, https://example.com/2.jpg" rows="3" />
        </div>

        <button className="btn btn-primary full-width" disabled={loading}>
          {loading ? "Creating..." : "Create Salon"}
        </button>
      </form>
    </section>
  );
}

export default CreateSalon;
