import { useEffect, useState } from "react";
import { Mail, RefreshCcw, Trash2, Clock, UserRound, Phone } from "lucide-react";

import {
  getMySalonEmployeesApi,
  resendEmployeeInvitationApi,
  removeEmployeeApi,
} from "../../api/SalonEmployeesApi";

import {
  showErrorToast,
  showSuccessToast,
} from "../../utils/appToast";

function MySalonEmployees() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadEmployees = async () => {
    try {
      setLoading(true);

      const response = await getMySalonEmployeesApi();

      if (response.success) {
        setEmployees(response.data || []);
      } else {
        showErrorToast(response.message || "Could not load employees.", "Loading failed");
      }
    } catch (error) {
      console.error(error);
      showErrorToast("Could not load employees.", "Loading failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  const handleResend = async (employeeId) => {
    try {
      const response = await resendEmployeeInvitationApi(employeeId);

      if (response.success) {
        showSuccessToast("Invitation sent again.", "Invitation sent");
        loadEmployees();
      } else {
        showErrorToast(response.message || "Could not resend invitation.", "Failed");
      }
    } catch (error) {
      console.error(error);
      showErrorToast("Could not resend invitation.", "Failed");
    }
  };

  const handleRemove = async (employeeId) => {
    const confirmRemove = window.confirm("Remove this employee from your salon?");

    if (!confirmRemove) return;

    try {
      const response = await removeEmployeeApi(employeeId);

      if (response.success) {
        showSuccessToast("Employee removed successfully.", "Removed");
        loadEmployees();
      } else {
        showErrorToast(response.message || "Could not remove employee.", "Failed");
      }
    } catch (error) {
      console.error(error);
      showErrorToast("Could not remove employee.", "Failed");
    }
  };

  if (loading) {
    return <div className="loading">Loading employees...</div>;
  }

  return (
    <section className="container section">
      <div className="profile-header">
        <div>
          <span className="eyebrow">Team management</span>
          <h1>My Salon Employees</h1>
          <p>Track invited and active employees for your salon.</p>
        </div>
      </div>

      {employees.length === 0 ? (
        <div className="empty-state">
          <h3>No employees yet</h3>
          <p>Add employees while creating your salon or add them later.</p>
        </div>
      ) : (
        <div className="owner-employees-grid">
          {employees.map((employee) => (
            <div className="owner-employee-card" key={employee.id}>
              <div className="owner-employee-top">
                <div className="owner-employee-avatar">
                  {employee.imageUrl ? (
                    <img src={employee.imageUrl} alt={employee.fullName} />
                  ) : (
                    <UserRound size={28} />
                  )}
                </div>

                <div>
                  <h3>{employee.fullName}</h3>
                  <p>{employee.specialty || "Salon employee"}</p>
                </div>

                <span className={`employee-status-pill status-${employee.status?.toLowerCase()}`}>
                  {employee.status}
                </span>
              </div>

              <div className="owner-employee-info">
                <p>
                  <Mail size={15} />
                  {employee.email}
                </p>

                <p>
                  <Phone size={15} />
                  {employee.phoneNumber}
                </p>

                <p>
                  <Clock size={15} />
                  {employee.startTime?.toString().slice(0, 5)} -{" "}
                  {employee.endTime?.toString().slice(0, 5)}
                </p>
              </div>

              <div className="service-actions">
                {employee.status === "INVITED" && (
                  <button
                    className="btn btn-secondary btn-small"
                    onClick={() => handleResend(employee.id)}
                  >
                    <RefreshCcw size={15} />
                    Resend Invite
                  </button>
                )}

                <button
                  className="btn btn-danger btn-small"
                  onClick={() => handleRemove(employee.id)}
                >
                  <Trash2 size={15} />
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default MySalonEmployees;