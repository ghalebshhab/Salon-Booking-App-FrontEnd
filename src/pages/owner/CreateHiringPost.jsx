import { useState } from "react";
import {
  showSuccessToast,
  showErrorToast,
  showInfoToast,
  showWarningToast,
} from "../../utils/appToast";
import { createHiringPostApi } from "../../api/hiringApi";

function CreateHiringPost() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    numOfEmps: 1,
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);

      const response = await createHiringPostApi({
        ...form,
        numOfEmps: Number(form.numOfEmps),
      });

      if (!response.success) {
        showErrorToast(response.message || "Failed to create hiring post");
        return;
      }

      showSuccessToast("Hiring post created successfully");
      setForm({ title: "", description: "", numOfEmps: 1 });
    } catch (error) {
      showErrorToast(error?.response?.data?.message || "Failed to create hiring post");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="form-page">
      <form className="form-card" onSubmit={handleSubmit}>
        <h1>Create Hiring Post</h1>
        <p className="muted">Your salon is selected from your owner token.</p>

        <div className="form-group">
          <label>Title</label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="We need professional barbers"
            required
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="We need 2 experienced barbers in Irbid..."
            rows="5"
            required
          />
        </div>

        <div className="form-group">
          <label>Number of employees needed</label>
          <input
            name="numOfEmps"
            type="number"
            min="1"
            value={form.numOfEmps}
            onChange={handleChange}
            required
          />
        </div>

        <button className="btn btn-primary full-width" disabled={loading}>
          {loading ? "Posting..." : "Create Hiring Post"}
        </button>
      </form>
    </section>
  );
}

export default CreateHiringPost;
