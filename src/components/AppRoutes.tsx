import { Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import LoadingSpinner from "@/components/ui/loading-spinner";

// Lazy load components for better performance
const UserOnboarding = lazy(() => import("@/components/UserOnboarding"));
const Welcome = lazy(() => import("@/components/Welcome"));
const AuthForm = lazy(() => import("@/components/auth/AuthForm"));
const Index = lazy(() => import("@/pages/Index"));
const WeatherPatterns = lazy(() => import("@/pages/WeatherPatterns"));
const Explanation = lazy(() => import("@/pages/Explanation"));
const PrivacyPolicy = lazy(() => import("@/pages/PrivacyPolicy"));
const TermsOfService = lazy(() => import("@/pages/TermsOfService"));
const DeviceConnection = lazy(() => import("@/pages/DeviceConnection"));
const AdminSetup = lazy(() => import("@/pages/AdminSetup"));
const NotFound = lazy(() => import("@/pages/NotFound"));

const AppRoutes = () => {
  console.log("🔍 AppRoutes: Rendering application routes");

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<UserOnboarding />} />
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/auth" element={<AuthForm />} />
        <Route path="/explanation" element={<Explanation />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-of-service" element={<TermsOfService />} />
        <Route path="/connect" element={<DeviceConnection />} />
        <Route path="/admin-setup" element={<AdminSetup />} />
        
        {/* Protected Routes */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Index />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/patterns" 
          element={
            <ProtectedRoute>
              <WeatherPatterns />
            </ProtectedRoute>
          } 
        />
        
        {/* Catch-all route for 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;