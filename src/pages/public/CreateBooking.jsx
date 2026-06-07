import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  showSuccessToast,
  showErrorToast,
  showInfoToast,
  showWarningToast,
} from "../../utils/appToast";
import {
  CalendarDays,
  Clock,
  MapPin,
  Phone,
  Scissors,
  StickyNote,
} from "lucide-react";

import { getSalonByIdApi } from "../../api/salonApi";
import { getActiveSalonServicesApi } from "../../api/SalonServicesApi";
import { createBookingApi } from "../../api/bookingApi";

function CreateBooking() {
  const { salonId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const selectedServiceIdFromState = location.state?.selectedServiceId;

  const [salon, setSalon] = useState(null);
  const [services, setServices] = useState([]);

  const [selectedServiceIds, setSelectedServiceIds] = useState([]);
  const [customerPhoneNumber, setCustomerPhoneNumber] = useState("");
  const [customerLocation, setCustomerLocation] = useState("");
  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState("");
  const [note, setNote] = useState("");

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const loadBookingData = async () => {
    try {
      setLoading(true);

      const salonResponse = await getSalonByIdApi(salonId);

      if (!salonResponse.success) {
        showErrorToast(salonResponse.message || "Salon not found");
        return;
      }

      setSalon(salonResponse.data);

      const servicesResponse = await getActiveSalonServicesApi(salonId);

      if (servicesResponse.success) {
        const activeServices = servicesResponse.data || [];
        setServices(activeServices);

        if (selectedServiceIdFromState) {
          setSelectedServiceIds([Number(selectedServiceIdFromState)]);
        }
      } else {
        showErrorToast(servicesResponse.message || "Failed to load services");
      }
    } catch (error) {
      console.error(error);
      showErrorToast("Failed to load booking page");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookingData();
  }, [salonId]);

  const selectedServices = useMemo(() => {
    return services.filter((service) =>
      selectedServiceIds.includes(Number(service.id))
    );
  }, [services, selectedServiceIds]);

  const totalPrice = useMemo(() => {
    return selectedServices.reduce(
      (total, service) => total + Number(service.price || 0),
      0
    );
  }, [selectedServices]);

  const totalDuration = useMemo(() => {
    return selectedServices.reduce(
      (total, service) => total + Number(service.durationMinutes || 0),
      0
    );
  }, [selectedServices]);

  const handleServiceToggle = (serviceId) => {
    const id = Number(serviceId);

    setSelectedServiceIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      }

      return [...prev, id];
    });
  };

  const getTodayDate = () => {
    return new Date().toISOString().split("T")[0];
  };

  const validateForm = () => {
    if (selectedServiceIds.length === 0) {
      showErrorToast("Please choose at least one service");
      return false;
    }

    if (!customerPhoneNumber.trim()) {
      showErrorToast("Phone number is required");
      return false;
    }

    if (!customerLocation.trim()) {
      showErrorToast("Location is required");
      return false;
    }

    if (!bookingDate) {
      showErrorToast("Booking date is required");
      return false;
    }

    if (!bookingTime) {
      showErrorToast("Booking time is required");
      return false;
    }

    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) return;

    try {
      setSubmitting(true);

      const bookingData = {
        salonId: Number(salonId),
        serviceIds: selectedServiceIds,
        customerPhoneNumber: customerPhoneNumber.trim(),
        customerLocation: customerLocation.trim(),
        bookingDate,
        bookingTime,
        note: note.trim(),
      };

      const response = await createBookingApi(bookingData);

      if (response.success) {
        showSuccessToast(response.message || "Booking created successfully");
        navigate("/my-bookings");
      } else {
        showErrorToast(response.message || "Failed to create booking");
      }
    } catch (error) {
      console.error(error);
      showErrorToast(error?.response?.data?.message || "Failed to create booking");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading booking page...</div>;
  }

  if (!salon) {
    return (
      <section className="container section">
        <div className="empty-state">
          <h3>Salon not found</h3>
          <p>Please go back and choose another salon.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="container section">
      <div className="profile-header">
        <div>
          <span className="eyebrow">Appointment request</span>
          <h1>Book {salon.name}</h1>
          <p>
            Choose your services, date, and time. The salon owner will confirm
            your request.
          </p>
        </div>
      </div>

      <div className="booking-page-layout">
        <form className="booking-form-panel" onSubmit={handleSubmit}>
          <div className="booking-section-box">
            <h2>
              <Scissors size={22} />
              Choose Services
            </h2>
            <p>Select one or more services for this appointment.</p>

            {services.length === 0 ? (
              <div className="empty-state">
                <h3>No services available</h3>
                <p>This salon has no active services right now.</p>
              </div>
            ) : (
              <div className="booking-services-select-grid">
                {services.map((service) => {
                  const selected = selectedServiceIds.includes(Number(service.id));

                  return (
                    <label
                      className={
                        selected
                          ? "booking-service-option selected"
                          : "booking-service-option"
                      }
                      key={service.id}
                    >
                      <input
                        type="checkbox"
                        checked={selected}
                        onChange={() => handleServiceToggle(service.id)}
                      />

                      <h3>{service.name}</h3>
                      <p>{service.description || "No description provided."}</p>

                      <div className="booking-service-meta">
                        <span>{service.price} JD</span>
                        <span>{service.durationMinutes} min</span>
                      </div>
                    </label>
                  );
                })}
              </div>
            )}
          </div>

          <div className="booking-section-box">
            <h2>
              <CalendarDays size={22} />
              Appointment Details
            </h2>
            <p>Add your contact details and preferred appointment time.</p>

            <div className="booking-input-grid">
              <div className="booking-input-group">
                <label>
                  <Phone size={16} />
                  Phone Number
                </label>
                <input
                  type="text"
                  value={customerPhoneNumber}
                  onChange={(e) => setCustomerPhoneNumber(e.target.value)}
                  placeholder="Example: 0790000000"
                />
              </div>

              <div className="booking-input-group">
                <label>
                  <MapPin size={16} />
                  Your Location
                </label>
                <input
                  type="text"
                  value={customerLocation}
                  onChange={(e) => setCustomerLocation(e.target.value)}
                  placeholder="Example: Amman - Jordan"
                />
              </div>

              <div className="booking-input-group">
                <label>
                  <CalendarDays size={16} />
                  Booking Date
                </label>
                <input
                  type="date"
                  value={bookingDate}
                  min={getTodayDate()}
                  onChange={(e) => setBookingDate(e.target.value)}
                />
              </div>

              <div className="booking-input-group">
                <label>
                  <Clock size={16} />
                  Booking Time
                </label>
                <input
                  type="time"
                  value={bookingTime}
                  onChange={(e) => setBookingTime(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="booking-section-box">
            <h2>
              <StickyNote size={22} />
              Extra Note
            </h2>
            <p>You can write anything the salon owner should know.</p>

            <div className="booking-input-group">
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Example: I prefer a quiet time, or I need hair and beard together..."
              />
            </div>
          </div>

          <div className="booking-submit-row">
            <button className="btn btn-primary" type="submit" disabled={submitting}>
              {submitting ? "Sending Request..." : "Confirm Booking"}
            </button>
          </div>
        </form>

        <aside className="booking-side-panel">
          <span className="eyebrow">Summary</span>
          <h3>{salon.name}</h3>
          <p>{salon.city} • {salon.address}</p>
          <p>
            Working hours: {salon.openTime?.toString().slice(0, 5)} -{" "}
            {salon.closeTime?.toString().slice(0, 5)}
          </p>

          <div className="booking-summary-total">
            <p>Selected services: {selectedServices.length}</p>
            <p>Total duration: {totalDuration} min</p>
            <span>Total price</span>
            <strong>{totalPrice} JD</strong>
          </div>
        </aside>
      </div>
    </section>
  );
}

export default CreateBooking;