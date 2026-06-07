import { useEffect, useState } from "react";
import { Star } from "lucide-react";

import {
  getSalonReviewsApi,
  getSalonReviewSummaryApi,
} from "../../api/reviewApi";
import ReviewCard from "./ReviewCard";
import RatingStars from "./RatingStars";
import { showErrorToast } from "../../utils/appToast";

function ReviewsList({ salonId }) {
  const [reviews, setReviews] = useState([]);
  const [summary, setSummary] = useState({
    averageRating: 0,
    totalReviews: 0,
  });
  const [loading, setLoading] = useState(true);

  const loadReviews = async () => {
    try {
      setLoading(true);

      const summaryResponse = await getSalonReviewSummaryApi(salonId);

      if (summaryResponse.success) {
        setSummary(summaryResponse.data || {
          averageRating: 0,
          totalReviews: 0,
        });
      }

      const reviewsResponse = await getSalonReviewsApi(salonId);

      if (reviewsResponse.success) {
        setReviews(reviewsResponse.data || []);
      } else {
        showErrorToast(
          reviewsResponse.message || "Could not load reviews.",
          "Reviews failed"
        );
      }
    } catch (error) {
      console.error(error);
      showErrorToast("Could not load salon reviews.", "Reviews failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (salonId) {
      loadReviews();
    }
  }, [salonId]);

  if (loading) {
    return <div className="loading">Loading reviews...</div>;
  }

  return (
    <div className="reviews-section">
      <div className="reviews-summary-card">
        <div className="reviews-summary-icon">
          <Star size={28} fill="currentColor" />
        </div>

        <div>
          <span className="eyebrow">Customer rating</span>
          <h2>{summary.averageRating || 0}/5</h2>
          <RatingStars rating={Math.round(summary.averageRating || 0)} readonly />
          <p>{summary.totalReviews || 0} customer reviews</p>
        </div>
      </div>

      {reviews.length === 0 ? (
        <div className="empty-state">
          <h3>No reviews yet</h3>
          <p>Completed customer reviews will appear here.</p>
        </div>
      ) : (
        <div className="reviews-grid">
          {reviews.map((review) => (
            <ReviewCard review={review} key={review.id} />
          ))}
        </div>
      )}
    </div>
  );
}

export default ReviewsList;