import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  showSuccessToast,
  showErrorToast,
  showInfoToast,
  showWarningToast,
} from "../../utils/appToast";
import { Edit, Trash2, Users, Image, Scissors } from "lucide-react";

import { getMySalonApi, getSalonEmployeesApi } from "../../api/salonApi";
import { getSalonMediaApi } from "../../api/mediaApi";

import SalonEmployees from "../../components/salons/SalonEmployees";
import SalonMediaGrid from "../../components/media/SalonMediaGrid";
import SalonStatusBadge from "../../components/salons/SalonStatusBadge";
import Loading from "../../components/common/Loading";
import EmptyState from "../../components/common/EmptyState";

function MySalon() {
  const [salon, setSalon] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [mediaPosts, setMediaPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const formatTime = (time) => {
    if (!time) return "—";
    return time.toString().slice(0, 5);
  };

  const getImages = (salonData) => {
    // Backend DTO field is Images (capital I)
    return salonData?.Images || salonData?.images || [];
  };

  const loadMySalon = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await getMySalonApi();

      if (!response.success) {
        setError(response.message || "Could not load your salon.");
        return;
      }

      const salonData = response.data;
      setSalon(salonData);

      // Load employees
      try {
        const empResponse = await getSalonEmployeesApi(salonData.salonId);
        if (empResponse.success) {
          setEmployees(empResponse.data || []);
        }
      } catch {
        // non-critical
      }

      // Load media
      try {
        const mediaResponse = await getSalonMediaApi(salonData.salonId);
        if (mediaResponse.success) {
          setMediaPosts(mediaResponse.data || []);
        }
      } catch {
        // non-critical
      }
    } catch (err) {
      const msg =
        err?.response?.status === 404
          ? "You haven't created a salon yet."
          : err?.response?.data?.message || "Failed to load your salon.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMySalon();
  }, []);

  if (loading) {
    return <Loading />;
  }

  if (error || !salon) {
    return (
      <section className="container section">
        <EmptyState
          title="No salon found"
          message={error || "You haven't created a salon yet. Create one to get started."}
        />
        <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
          <Link className="btn btn-primary" to="/owner/create-salon">
            Create My Salon
          </Link>
        </div>
      </section>
    );
  }

  const images = getImages(salon);
  const coverImage = images[0];

  return (
    <section className="container section">
      {/* Cover */}
      <div className="salon-cover">
        {coverImage ? (
          <img src={coverImage} alt={salon.name} />
        ) : (
          <div className="salon-cover-placeholder">
            <span>{salon.name?.charAt(0)?.toUpperCase() || "S"}</span>
          </div>
        )}
      </div>

      {/* Header */}
      <div className="profile-header profile-header-overlap">
        <div>
          <span className="eyebrow">My salon</span>
          <h1>{salon.name}</h1>
          <p>{salon.city} • {salon.address}</p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <SalonStatusBadge state={salon.state} />
          <Link
            className="btn btn-secondary btn-small"
            to={`/salons/${salon.salonId}`}
          >
            Public View
          </Link>
        </div>
      </div>

      {/* Quick actions */}
      <div className="dashboard-grid" style={{ marginBottom: "2rem" }}>
        <Link className="dashboard-card" to="/owner/create-hiring-post">
          <Users size={24} />
          <h3>Post Hiring</h3>
          <p>Create a new hiring post for your salon.</p>
        </Link>

        <Link className="dashboard-card" to="/owner/create-media-post">
          <Image size={24} />
          <h3>Post Media</h3>
          <p>Share images and videos of your work.</p>
        </Link>

        <Link className="dashboard-card" to="/owner/services">
  <Scissors size={24} />
  <h3>Manage Services</h3>
  <p>Add, update, and disable services for your salon.</p>
</Link>
      </div>

      {/* Salon info grid */}
      <div className="profile-info-grid">
        <div className="info-card">
          <h3>Contact</h3>
          <p><strong>Phone:</strong> {salon.phoneNumber || "—"}</p>
          <p><strong>Email:</strong> {salon.email || "—"}</p>
          <p><strong>Address:</strong> {salon.address || "—"}</p>
          <p><strong>City:</strong> {salon.city || "—"}</p>
        </div>

        <div className="info-card">
          <h3>Working Hours</h3>
          <p><strong>Open:</strong> {formatTime(salon.openTime)}</p>
          <p><strong>Close:</strong> {formatTime(salon.closeTime)}</p>
          <p><strong>Status:</strong> {salon.state}</p>
        </div>

        <div className="info-card">
          <h3>Employees Capacity</h3>
          <p><strong>Current:</strong> {salon.currentNumOfEmployees ?? employees.length}</p>
          <p><strong>Max:</strong> {salon.maxNumOfEmployees ?? "—"}</p>
          <p>
            <strong>Available slots:</strong>{" "}
            {(salon.maxNumOfEmployees ?? 0) - (salon.currentNumOfEmployees ?? employees.length)}
          </p>
        </div>

        <div className="info-card">
          <h3>Owner Info</h3>
          <p><strong>Name:</strong> {salon.ownerName || "—"}</p>
          <p><strong>Email:</strong> {salon.ownerEmail || "—"}</p>
          <p><strong>Phone:</strong> {salon.ownerPhoneNumber || "—"}</p>
        </div>
      </div>

      {/* Gallery */}
      {images.length > 0 && (
        <>
          <div className="section-title left">
            <h2>Salon Images</h2>
            <p>Photos you uploaded for your salon profile.</p>
          </div>
          <div className="simple-gallery">
            {images.map((imageUrl, index) => (
              <img
                key={imageUrl + index}
                src={imageUrl}
                alt={`Salon image ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}

      {/* Employees */}
      <div className="section-title left">
        <h2>Employees</h2>
        <p>Active employees currently in your salon.</p>
      </div>
      <SalonEmployees employees={employees} />

      {/* Media posts */}
      <div className="section-title left">
        <h2>Media Posts</h2>
        <p>Images and videos you've shared from your salon.</p>
      </div>
      <SalonMediaGrid mediaPosts={mediaPosts} />
    </section>
  );
}

export default MySalon;
