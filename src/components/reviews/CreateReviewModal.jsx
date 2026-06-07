import { useState } from "react";
import { MessageSquareText, X } from "lucide-react";

import { createReviewApi } from "../../api/reviewApi";
import {
  showErrorToast,
  showSuccessToast,
  showWarningToast,
} from "../../utils/appToast";
import RatingStars from "./RatingStars";

function CreateReviewModal({ booking, onClose, onReviewCreated }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submitReview = async () => {
    if (!booking?.id) {
      showErrorToast("Booking was not found.", "Review failed");
      return;
    }

    if (rating < 1 || rating > 5) {
      showWarningToast("Please choose a rating between 1 and 5.", "Invalid rating");
      return;
    }

    try {
      setSubmitting(true);

      const response = await createReviewApi({
        bookingId: booking.id,
        rating,
        comment: comment.trim(),
      });

      if (response.success) {
        showSuccessToast("Thank you for sharing your experience.", "Review added");

        if (onReviewCreated) {
          onReviewCreated(response.data);
        }

        onClose();
      } else {
        showErrorToast(response.message || "Could not add review.", "Review failed");
      }
    } catch (error) {
      console.error(error);
      showErrorToast(
        error?.response?.data?.message || "Could not add review.",
        "Review failed"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="review-modal-overlay">
      <div className="review-modal">
        <button className="review-modal-close" type="button" onClick={onClose}>
          <X size={20} />
        </button>

        <div className="review-modal-icon">
          <MessageSquareText size={28} />
        </div>

        <span className="eyebrow">Salon review</span>
        <h2>How was your appointment?</h2>

        <p className="review-modal-subtitle">
          Your review helps other customers choose the right salon.
        </p>

        <div className="review-booking-summary">
          <div>
            <strong>Salon</strong>
            <span>{booking?.salonName}</span>
          </div>

          <div>
            <strong>Appointment</strong>
            <span>
              {booking?.bookingDate} • {booking?.bookingTime?.toString().slice(0, 5)}
            </span>
          </div>
        </div>

        <div className="review-input-group">
          <label>Your rating</label>
          <RatingStars rating={rating} onChange={setRating} size={32} />
        </div>

        <div className="review-input-group">
          <label>Your comment</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Example: The service was clean, fast, and professional..."
          />
        </div>

        <div className="review-modal-actions">
          <button className="btn btn-secondary" type="button" onClick={onClose}>
            Cancel
          </button>

          <button
            className="btn btn-primary"
            type="button"
            onClick={submitReview}
            disabled={submitting}
          >
            {submitting ? "Sending..." : "Submit Review"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreateReviewModal;