import { useState } from "react";
import {
  showSuccessToast,
  showErrorToast,
  showInfoToast,
  showWarningToast,
} from "../../utils/appToast";
import { createMediaPostApi } from "../../api/mediaApi";

function CreateMediaPost() {
  const [form, setForm] = useState({
    caption: "",
    mediaUrl: "",
    mediaType: "IMAGE",
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
      const response = await createMediaPostApi(form);

      if (!response.success) {
        showErrorToast(response.message || "Failed to create media post");
        return;
      }

      showSuccessToast  ("Media posted successfully");
      setForm({ caption: "", mediaUrl: "", mediaType: "IMAGE" });
    } catch (error) {
      showErrorToast(error?.response?.data?.message || "Failed to create media post");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="form-page">
      <form className="form-card" onSubmit={handleSubmit}>
        <h1>Create Media Post</h1>
        <p className="muted">Post image or video URL to your salon profile.</p>

        <div className="form-group">
          <label>Caption</label>
          <input
            name="caption"
            value={form.caption}
            onChange={handleChange}
            placeholder="Fresh fade haircut transformation"
          />
        </div>

        <div className="form-group">
          <label>Media URL</label>
          <input
            name="mediaUrl"
            value={form.mediaUrl}
            onChange={handleChange}
            placeholder="https://example.com/video.mp4"
            required
          />
        </div>

        <div className="form-group">
          <label>Media Type</label>
          <select name="mediaType" value={form.mediaType} onChange={handleChange}>
            <option value="IMAGE">IMAGE</option>
            <option value="VIDEO">VIDEO</option>
          </select>
        </div>

        {form.mediaUrl && (
          <div className="preview-box">
            <p className="muted">Preview</p>
            {form.mediaType === "VIDEO" ? (
              <video src={form.mediaUrl} controls preload="metadata" />
            ) : (
              <img src={form.mediaUrl} alt="Preview" />
            )}
          </div>
        )}

        <button className="btn btn-primary full-width" disabled={loading}>
          {loading ? "Posting..." : "Post Media"}
        </button>
      </form>
    </section>
  );
}

export default CreateMediaPost;
