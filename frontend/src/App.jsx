import { Navigate, Route, Routes } from "react-router-dom";
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
import CollegeDetailsPage from "./Admin/page/CollegeDetailsPage";
import CreateReward from "./Admin/page/CreateReward";
import AdminEventsPage from "./pages/AdminEventsPage";
import EditEventPage from "./Admin/page/EditEventPage";
import ManageRewards from "./Admin/page/ManageRewards";
function App() {
  const { isCheckingAuth, checkAuth, isAuthenticated, user } = useAuthStore();
  const navigate = useNavigate();
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        await checkAuth();
      } finally {
        setIsDataLoaded(true);
      }
    };

    initializeAuth();
  }, [checkAuth]);

  // Don't allow authenticated users to access login/signup pages
  const RedirectAuthenticatedUser = ({ children }) => {
    // Only redirect if we're certain about authentication state
    if (isDataLoaded && isAuthenticated && user) {
      return <Navigate to="/" replace />;
    }

    // Only show login/signup when we're sure user is not authenticated
    if (isDataLoaded) {
      return children;
    }

    return <LoadingSpinner />;
  };

  // Protect routes that require authentication
  // Protect routes that require authentication
  const ProtectedRoutes = ({ children }) => {
    useEffect(() => {
      if (isDataLoaded && !isCheckingAuth) {
        if (!isAuthenticated) {
          navigate("/login", { replace: true });
        } else if (user?.isVerified === false) {
          navigate("/verify-email", { replace: true });
        } else if (user?.isProfileComplete === false) {
          if (user?.role === "admin") {
            navigate("/admin/collgedetails", { replace: true });
          } else if (user?.role === "student") {
            navigate("/settings", { replace: true });
          }
        } else if (user?.role === "admin") {
          navigate("/admin", { replace: true });
        }
      }
    }, [isDataLoaded, isCheckingAuth, isAuthenticated, user]);
    return children;
  };

  // Protect admin routes
  const ProtectIsAdminRoute = ({ children }) => {
    useEffect(() => {
      if (isDataLoaded && !isCheckingAuth && user?.role !== "admin") {
        navigate("/", { replace: true });
      }
    }, [isDataLoaded, isCheckingAuth, user]);

    if (isCheckingAuth || !isDataLoaded) {
      return <LoadingSpinner />;
    }

    if (user?.role !== "admin") {
      return <div>You're not authorized to access this page</div>;
    }

    return children;
  };

  // Show loading spinner while checking authentication
  if (isCheckingAuth && !isDataLoaded) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <ToastContainer position="top-center" autoClose={3000} />
      {user?.role === "admin" ? <AdminNavbar /> : <Navbar />}
      <main className="flex-grow pt-20">
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
          <Route path="/settings" element={<ProfilePage />} />
          <Route path="/admin/collgedetails" element={<CollegeDetailsPage />} />
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
                {/* <AdminDashboard /> */}
                <AdminEventsPage />
              </ProtectIsAdminRoute>
            }
          />
          <Route
            path="/admin/manage_event_attendence"
            element={
              <ProtectIsAdminRoute>
                <AdminDashboard />
              </ProtectIsAdminRoute>
            }
          />
          <Route path="/events/:domain" element={<EventPage />} />
          <Route path="/event/:event-id" element={<EventDetailPage />} />
          <Route path="/edit-event/:eventId" element={<EditEventPage />} />
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
          <Route
            path="/admin/addrewards"
            element={
              <ProtectIsAdminRoute>
                <CreateReward />
              </ProtectIsAdminRoute>
            }
          />
          <Route
            path="/admin/managerewards"
            element={
              <ProtectIsAdminRoute>
                <ManageRewards />
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
