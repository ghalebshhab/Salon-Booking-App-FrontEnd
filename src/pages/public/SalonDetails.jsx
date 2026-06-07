import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  showSuccessToast,
  showErrorToast,
  showInfoToast,
  showWarningToast,
} from "../../utils/appToast";

import { getSalonByIdApi, getSalonEmployeesApi } from "../../api/salonApi";
import { getSalonMediaApi } from "../../api/mediaApi";

import SalonEmployees from "../../components/salons/SalonEmployees";
import SalonMediaGrid from "../../components/media/SalonMediaGrid";
import SalonStatusBadge from "../../components/salons/SalonStatusBadge";
import SalonServicesList from "../../components/services/SalonServicesList";
function SalonDetails() {
  const { salonId } = useParams();

  const [salon, setSalon] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [mediaPosts, setMediaPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const getImages = (salonData) => {
    // Backend returns Images (capital I) from Java DTO field name
    return salonData?.Images || salonData?.images || [];
  };

  const formatTime = (time) => {
    if (!time) return "";
    return time.toString().slice(0, 5);
  };

  const loadSalonProfile = async () => {
    try {
      setLoading(true);

      const salonResponse = await getSalonByIdApi(salonId);

      if (!salonResponse.success) {
        showErrorToast(salonResponse.message || "Salon not found");
        return;
      }

      setSalon(salonResponse.data);

      try {
        const employeesResponse = await getSalonEmployeesApi(salonId);

        if (employeesResponse.success) {
          setEmployees(employeesResponse.data || []);
        }
      } catch (error) {
        console.warn("Employees endpoint error:", error);
      }

      try {
        const mediaResponse = await getSalonMediaApi(salonId);

        if (mediaResponse.success) {
          setMediaPosts(mediaResponse.data || []);
        }
      } catch (error) {
        console.warn("Media endpoint error:", error);
      }
    } catch (error) {
      showErrorToast("Failed to load salon profile");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSalonProfile();
  }, [salonId]);

  if (loading) {
    return (
      <div className="loading">
        Loading salon profile...
      </div>
    );
  }

  if (!salon) {
    return (
      <section className="container section">
        <div className="empty-state">
          <h3>Salon not found</h3>
          <p>Please check the salon ID.</p>
        </div>
      </section>
    );
  }

  const images = getImages(salon);
  const coverImage = images[0];

  return (
    <section className="container section">
      <div className="salon-cover">
        {coverImage ? (
          <img src={coverImage} alt={salon.name} />
        ) : (
          <div className="salon-cover-placeholder">
            <span>{salon.name?.charAt(0)?.toUpperCase() || "S"}</span>
          </div>
        )}
      </div>

      <div className="profile-header profile-header-overlap">
        <div>
          <span className="eyebrow">Salon profile</span>
          <h1>{salon.name}</h1>
          <p>{salon.city} • {salon.address}</p>
        </div>

        <SalonStatusBadge state={salon.state} />
      </div>

      <div className="profile-info-grid">
        <div className="info-card">
          <h3>Owner</h3>
          <p>
            <strong>Name:</strong> {salon.ownerName || "Not provided"}
          </p>
          <p>
            <strong>Email:</strong> {salon.ownerEmail || "Not provided"}
          </p>
          <p>
            <strong>Phone:</strong> {salon.ownerPhoneNumber || "Not provided"}
          </p>
        </div>

        <div className="info-card">
          <h3>Salon Contact</h3>
          <p>
            <strong>Phone:</strong> {salon.phoneNumber}
          </p>
          <p>
            <strong>Email:</strong> {salon.email}
          </p>
          <p>
            <strong>Address:</strong> {salon.address}
          </p>
        </div>

        <div className="info-card">
          <h3>Working Hours</h3>
          <p>
            <strong>Open:</strong> {formatTime(salon.openTime)}
          </p>
          <p>
            <strong>Close:</strong> {formatTime(salon.closeTime)}
          </p>
          <p>
            <strong>State:</strong> {salon.state}
          </p>
        </div>

        <div className="info-card">
          <h3>Employees Capacity</h3>
          <p>
            <strong>Current:</strong>{" "}
            {salon.currentNumOfEmployees ?? employees.length}
          </p>
          <p>
            <strong>Max:</strong> {salon.maxNumOfEmployees ?? "-"}
          </p>
          <p>
            <strong>Available:</strong>{" "}
            {(salon.maxNumOfEmployees ?? 0) -
              (salon.currentNumOfEmployees ?? employees.length)}
          </p>
        </div>
      </div>
      <div className="section-title left">
  <h2>Services</h2>
  <p>Choose a service from this salon. Booking will be available soon.</p>
</div>

<SalonServicesList salonId={salonId} />

      {images.length > 1 && (
        <>
          <div className="section-title left">
            <h2>Salon Images</h2>
            <p>Profile images added by the salon owner.</p>
          </div>

          <div className="simple-gallery">
            {images.map((imageUrl, index) => (
              <img
                key={imageUrl + index}
                src={imageUrl}
                alt={`Salon ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}

      <div className="section-title left">
        <h2>Owner & Employees</h2>
        <p>The owner details are above. Active employees are listed below.</p>
      </div>

      <SalonEmployees employees={employees} />

      <div className="section-title left">
        <h2>Salon Work</h2>
        <p>Images and videos posted by this salon.</p>
      </div>

      <SalonMediaGrid mediaPosts={mediaPosts} />
    </section>
  );
}

export default SalonDetails;
