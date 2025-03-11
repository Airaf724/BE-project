import { Navigate, replace, Route, Router, Routes } from "react-router-dom";
import SignUpPage from "./pages/SignUpPage";
import Loginpage from "./pages/Loginpage";
import EmailVerificationPage from "./pages/EmailVerificationPage";
import { useAuthStore } from "./store/authStore";
import { useEffect, useState } from "react";
import DashboardPage from "./pages/DashboardPage";
import LoadingSpinner from "./components/LoadingSpinner";
import AdminDashboard from "./Admin/AdminDashboard";
import CreateEvent from "./Admin/page/CreateEvent";
import AdminNavbar from "./Admin/AdminNavbar";
import Navbar from "./components/Navbar";
import { useNavigate } from "react-router-dom";
import EventPage from "./pages/EventPage";
import Footer from "./components/Footer";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import ForgotPasswordPage from "./pages/ForgetPasswordPage";
import UserList from "./pages/UserList";
import UserSubmissions from "./pages/UserSubmissions";
import StorePage from "./pages/StorePage";
import EventDetailPage from "./pages/EventDetailPage";
import MangeUsers from "./Admin/page/MangeUsers";
import ManageEventAttendees from "./Admin/page/ManageEventAttendees";
import ProfilePage from "./pages/ProfilePage";
import OrderDetail from "./pages/OrderDetail";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ManageOrders from "./Admin/page/ManageOrders";
import OrdersPage from "./pages/OrdersPage";

function App() {
  const { isCheckingAuth, checkAuth, isAuthenticated, user } = useAuthStore();
  const navigate = useNavigate();
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  useEffect(() => {
    const initializeAuth = async () => {
      await checkAuth();
      setIsDataLoaded(true);
    };

    initializeAuth();
  }, [checkAuth]);
  // protected routes

  const RedirectAuthenticatedUser = ({ children }) => {
    if (isAuthenticated) {
      return <Navigate to="/" replace />;
    }

    return children;
  };
  // console.log("user is adim", user.isAdmin);
  const ProtectedRoutes = ({ children }) => {
    useEffect(() => {
      if (!isCheckingAuth && !isDataLoaded) {
        if (!isAuthenticated) {
          navigate("/login", { replace: true });
        } else if (user?.isAdmin) {
          navigate("/admin", { replace: true });
        } else if (user?.isVerified === false) {
          navigate("/verify-email", { replace: true });
        }
      }
    }, [isCheckingAuth, isAuthenticated, user, navigate, isDataLoaded]);

    if (isCheckingAuth || !isDataLoaded) {
      return <LoadingSpinner />;
    }
    return children;
  };

  const ProtectIsAdminRoute = ({ children }) => {
    if (!user?.isAdmin) {
      return <div>Your not authorized to access this page </div>;
    }

    return children;
  };

  if (isCheckingAuth) return <LoadingSpinner />;

  return (
    //min-h-screen flex
    <div className="min-h-screen flex flex-col">
      <ToastContainer position="top-center" autoClose={3000} />
      {user?.isAdmin ? <AdminNavbar /> : <Navbar />}
      <main className="flex-grow pt-20">
        {" "}
        {/* Add top padding to account for fixed navbar */}
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoutes>
                <DashboardPage />
              </ProtectedRoutes>
            }
          />
          <Route
            path="/signup"
            element={
              <RedirectAuthenticatedUser>
                <SignUpPage />
              </RedirectAuthenticatedUser>
            }
          />
          <Route
            path="/login"
            element={
              <RedirectAuthenticatedUser>
                <Loginpage />
              </RedirectAuthenticatedUser>
            }
          />
          <Route path="/verify-email" element={<EmailVerificationPage />} />

          <Route
            path="/forgot-password"
            element={
              <RedirectAuthenticatedUser>
                <ForgotPasswordPage />
              </RedirectAuthenticatedUser>
            }
          />
          <Route
            path="/reset-password/:token"
            element={
              <RedirectAuthenticatedUser>
                <ResetPasswordPage />
              </RedirectAuthenticatedUser>
            }
          />

          <Route
            path="/store"
            element={
              <ProtectedRoutes>
                <StorePage />
              </ProtectedRoutes>
            }
          />

          {/* Admin routes */}
          <Route
            path="/admin"
            element={
              <ProtectIsAdminRoute>
                <AdminDashboard />
              </ProtectIsAdminRoute>
            }
          />
          <Route path="/events/:domain" element={<EventPage />} />
          <Route path="/event/:event-id" element={<EventDetailPage />} />
          {/* Admin routes */}
          <Route path="/:user_id/my-lists" element={<UserList />} />
          <Route path="/:user_id/submissions" element={<UserSubmissions />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/admin/create-event" element={<CreateEvent />} />
          <Route path="/admin/mange" element={<MangeUsers />} />
          <Route
            path="/admin/events/:eventId"
            element={<ManageEventAttendees />}
          />
          <Route path="/settings" element={<ProfilePage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
          <Route
            path="/admin/*"
            element={
              <ProtectIsAdminRoute>
                <AdminDashboard />
              </ProtectIsAdminRoute>
            }
          />
          <Route
            path="/admin/orders"
            element={
              <ProtectIsAdminRoute>
                <ManageOrders />
              </ProtectIsAdminRoute>
            }
          />
          <Route path="/placeorder" element={<OrderDetail />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
