import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import ProtectedRoute from "../components/layout/ProtectedRoute";

import Home from "../pages/public/Home";
import Login from "../pages/public/Login";
import Register from "../pages/public/Register";
import SalonDetails from "../pages/public/SalonDetails";
import HiringPosts from "../pages/public/HiringPosts";

import OwnerDashboard from "../pages/owner/OwnerDashboard";
import CreateSalon from "../pages/owner/CreateSalon";
import CreateHiringPost from "../pages/owner/CreateHiringPost";
import CreateMediaPost from "../pages/owner/CreateMediaPost";
import MySalon from "../pages/owner/MySalon";
import MySalonServices from "../pages/owner/MySalonServices";
import CreateSalonService from "../pages/owner/AddSalonService";
import EditSalonService from "../pages/owner/EditSalonService";

import CreateBooking from "../pages/public/CreateBooking";
import MyBookings from "../pages/public/MyBookings";
import SalonBookings from "../pages/owner/SalonBookings";
import MySalonEmployees from "../pages/owner/MySalonEmployees";

import EmployeeBookings from "../pages/employee/EmployeeBookings";
function AppRoutes() {
  return (
    <BrowserRouter>
      <Navbar />

      <main className="page-main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/salons/:salonId" element={<SalonDetails />} />
          <Route path="/hiring-posts" element={<HiringPosts />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
  path="/salons/:salonId/book"
  element={
    <ProtectedRoute>
      <CreateBooking />
    </ProtectedRoute>
  }
/>

<Route
  path="/my-bookings"
  element={
    <ProtectedRoute>
      <MyBookings />
    </ProtectedRoute>
  }
/>
<Route
  path="/employee/bookings"
  element={
    <ProtectedRoute>
      <EmployeeBookings />
    </ProtectedRoute>
  }
/>
<Route
  path="/owner/bookings"
  element={
    <ProtectedRoute>
      <SalonBookings />
    </ProtectedRoute>
  }
/>
        

          <Route
            path="/owner/dashboard"
            element={
              <ProtectedRoute>
                <OwnerDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/owner/create-salon"
            element={
              <ProtectedRoute>
                <CreateSalon />
              </ProtectedRoute>
            }
          />

          <Route
            path="/owner/my-salon"
            element={
              <ProtectedRoute>
                <MySalon />
              </ProtectedRoute>
            }
          />

          <Route
            path="/owner/create-hiring-post"
            element={
              <ProtectedRoute>
                <CreateHiringPost />
              </ProtectedRoute>
            }
          />

          <Route
            path="/owner/create-media-post"
            element={
              <ProtectedRoute>
                <CreateMediaPost />
              </ProtectedRoute>
            }
          />
          <Route
  path="/owner/services"
  element={
    <ProtectedRoute>
      <MySalonServices />
    </ProtectedRoute>
  }
/>

<Route
  path="/owner/create-service"
  element={
    <ProtectedRoute>
      <CreateSalonService />
    </ProtectedRoute>
  }
/>

<Route
  path="/owner/services/:serviceId/edit"
  element={
    <ProtectedRoute>
      <EditSalonService />
    </ProtectedRoute>
  }
/>
<Route
  path="/owner/employees"
  element={
    <ProtectedRoute>
      <MySalonEmployees />
    </ProtectedRoute>
  }
/>
        </Routes>
      </main>

      <Footer />
    </BrowserRouter>
  );
}

export default AppRoutes;
