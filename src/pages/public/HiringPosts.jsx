import { useEffect, useState } from "react";
import {
  showSuccessToast,
  showErrorToast,
  showInfoToast,
  showWarningToast,
} from "../../utils/appToast";
import { getOpenHiringPostsApi } from "../../api/hiringApi";
import HiringPostCard from "../../components/hiring/HiringPostCard";
import Loading from "../../components/common/Loading";
import EmptyState from "../../components/common/EmptyState";

function HiringPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadPosts = async () => {
    try {
      setLoading(true);
      const response = await getOpenHiringPostsApi();

      if (!response.success) {
        showErrorToast(response.message || "Failed to load hiring posts");
        return;
      }

      setPosts(response.data || []);
    } catch (error) {
      showErrorToast("Failed to load hiring posts");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  return (
    <section className="container section">
      <div className="section-title left">
        <h1>Open Hiring Posts</h1>
        <p>Barbers can join salons from active hiring posts.</p>
      </div>

      {loading ? (
        <Loading />
      ) : posts.length === 0 ? (
        <EmptyState title="No open hiring posts" message="Check again later." />
      ) : (
        <div className="hiring-grid">
          {posts.map((post) => (
            <HiringPostCard key={post.id} post={post} onJoined={loadPosts} />
          ))}
        </div>
      )}
    </section>
  );
}

export default HiringPosts;
