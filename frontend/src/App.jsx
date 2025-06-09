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
import EditRewardPage from "./Admin/page/EditRewardPage";
import StripePayment from "./components/StripePayment";
import StripeWrapper from "./components/StripeWrapper";
import PaymentCancelled from "./components/PaymentCancelled";
import PaymentSuccess from "./components/PaymentSuccess";

function App() {
  const { isCheckingAuth, checkAuth, isAuthenticated, user } = useAuthStore();
  const navigate = useNavigate();
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const timer = setTimeout(async () => {
          await checkAuth();
        }, 100);

        return () => clearTimeout(timer);
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
  const ProtectedRoutes = ({ children }) => {
    useEffect(() => {
      if (isDataLoaded && !isCheckingAuth) {
        // If not authenticated or user is undefined, redirect to login
        if (!isAuthenticated || !user) {
          navigate("/login", { replace: true });
          return;
        }

        // If user exists but email is not verified
        if (user.isVerified === false) {
          navigate("/verify-email", { replace: true });
          return;
        }

        // If user exists but profile is incomplete
        if (user.isProfileComplete === false) {
          if (user.role === "admin") {
            navigate("/admin/collgedetails", { replace: true });
          } else if (user.role === "student") {
            navigate("/settings", { replace: true });
          }
          return;
        }

        if (user.role === "admin" && window.location.pathname === "/") {
          navigate("/admin", { replace: true });
        }
      }
    }, [isDataLoaded, isCheckingAuth, isAuthenticated, user]);

    // Show loading while checking auth or data is not loaded
    if (isCheckingAuth || !isDataLoaded) {
      return <LoadingSpinner />;
    }

    // If not authenticated or user is undefined, don't render children
    if (!isAuthenticated || !user) {
      return <LoadingSpinner />;
    }

    return children;
  };

  // Protect admin routes
  const ProtectIsAdminRoute = ({ children }) => {
    useEffect(() => {
      if (isDataLoaded && !isCheckingAuth) {
        // If not authenticated, user is undefined, or user is not admin
        if (!isAuthenticated || !user || user.role !== "admin") {
          navigate("/", { replace: true });
        }
      }
    }, [isDataLoaded, isCheckingAuth, isAuthenticated, user]);

    if (isCheckingAuth || !isDataLoaded) {
      return <LoadingSpinner />;
    }

    if (!isAuthenticated || !user || user.role !== "admin") {
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
      <main className="flex-grow pt-20 px-4 sm:px-6 lg:px-8">
        <Routes>
          {/* Public Routes */}
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
          <Route path="/verify-email" element={<EmailVerificationPage />} />

          {/* Protected Routes */}
          <Route
            path="/"
            element={
              <ProtectedRoutes>
                <DashboardPage />
              </ProtectedRoutes>
            }
          />
          <Route path="/settings" element={<ProfilePage />} />
          <Route
            path="/store"
            element={
              <ProtectedRoutes>
                <StorePage />
              </ProtectedRoutes>
            }
          />
          <Route path="/events/:domain" element={<EventPage />} />
          <Route path="/event/:event-id" element={<EventDetailPage />} />
          <Route path="/:user_id/my-lists" element={<UserList />} />
          <Route path="/:user_id/submissions" element={<UserSubmissions />} />
          <Route path="/:userId/orders" element={<OrdersPage />} />

          {/* Payment Routes - Protected */}
          <Route
            path="/payment"
            element={
              <ProtectedRoutes>
                <StripeWrapper>
                  <StripePayment />
                </StripeWrapper>
              </ProtectedRoutes>
            }
          />
          <Route
            path="/placeorder"
            element={
              <ProtectedRoutes>
                <OrderDetail />
              </ProtectedRoutes>
            }
          />
          <Route
            path="/payment-success"
            element={
              <ProtectedRoutes>
                <PaymentSuccess />
              </ProtectedRoutes>
            }
          />
          <Route
            path="/payment-cancelled"
            element={
              <ProtectedRoutes>
                <PaymentCancelled />
              </ProtectedRoutes>
            }
          />

          {/* Admin Routes */}
          <Route path="/admin/collgedetails" element={<CollegeDetailsPage />} />
          <Route
            path="/admin"
            element={
              <ProtectIsAdminRoute>
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
          <Route
            path="/admin/create-event"
            element={
              <ProtectIsAdminRoute>
                <CreateEvent />
              </ProtectIsAdminRoute>
            }
          />
          <Route
            path="/admin/mange"
            element={
              <ProtectIsAdminRoute>
                <MangeUsers />
              </ProtectIsAdminRoute>
            }
          />
          <Route
            path="/admin/events/:eventId"
            element={
              <ProtectIsAdminRoute>
                <ManageEventAttendees />
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
          <Route
            path="/edit-event/:eventId"
            element={
              <ProtectIsAdminRoute>
                <EditEventPage />
              </ProtectIsAdminRoute>
            }
          />
          <Route
            path="/admin/edit-reward/:rewardId"
            element={
              <ProtectIsAdminRoute>
                <EditRewardPage />
              </ProtectIsAdminRoute>
            }
          />

          {/* Catch-all route - must be last */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
