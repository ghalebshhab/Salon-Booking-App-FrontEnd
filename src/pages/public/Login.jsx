import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  showSuccessToast,
  showErrorToast,
  showInfoToast,
  showWarningToast,
} from "../../utils/appToast";
import { loginApi } from "../../api/authApi";
import { saveToken, saveUser } from "../../utils/tokenStorage";

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
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
      const response = await loginApi(form);

      if (!response.success) {
        showErrorToast(response.message || "Login failed");
        return;
      }

      saveToken(response.data.token);
      saveUser(response.data);

     showSuccessToast("Welcome back to SalonHub ✨", "Logged in");
      navigate("/owner/dashboard");
    } catch (error) {
      showErrorToast(error?.response?.data?.message || "Login failed");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h1>Login</h1>
        <p className="muted">Welcome back to SalonHub.</p>

        <div className="form-group">
          <label>Email</label>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="owner@test.com"
            required
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="123456"
            required
          />
        </div>

        <button className="btn btn-primary full-width" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="auth-switch">
          Do not have an account? <Link to="/register">Register</Link>
        </p>
      </form>
    </section>
  );
}

export default Login;
