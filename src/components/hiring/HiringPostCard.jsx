import { toast } from "react-toastify";
import { joinHiringPostApi } from "../../api/hiringApi";
import { isLoggedIn } from "../../utils/tokenStorage";
import { formatDateTime } from "../../utils/formatTime";

function HiringPostCard({ post, onJoined }) {
  const handleJoin = async () => {
    if (!isLoggedIn()) {
      toast.error("Please login first to join a salon.");
      return;
    }

    try {
      const response = await joinHiringPostApi(post.id);

      if (!response.success) {
        toast.error(response.message);
        return;
      }

      toast.success(response.message || "Joined successfully");
      if (onJoined) onJoined();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to join salon");
      console.error(error);
    }
  };

  return (
    <article className="hiring-card">
      <div className="hiring-top">
        <div>
          <h3>{post.title}</h3>
          <p className="muted">{post.salonName} • {post.salonCity}</p>
        </div>
        <span className="badge badge-open">{post.status}</span>
      </div>

      <p className="hiring-description">{post.description}</p>

      <div className="hiring-meta">
        <span>Needed employees: <strong>{post.neededEmployees}</strong></span>
        <span>{formatDateTime(post.createdAt)}</span>
      </div>

      <button className="btn btn-primary full-width" onClick={handleJoin}>
        Join Salon
      </button>
    </article>
  );
}

export default HiringPostCard;
