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
const WeatherTools = lazy(() => import("@/pages/WeatherTools"));
const BreathingExercise = lazy(() => import("@/pages/BreathingExercise"));
const StormShelter = lazy(() => import("@/pages/StormShelter"));
const Settings = lazy(() => import("@/pages/Settings"));
const Explanation = lazy(() => import("@/pages/Explanation"));
const PrivacyPolicy = lazy(() => import("@/pages/PrivacyPolicy"));
const TermsOfService = lazy(() => import("@/pages/TermsOfService"));
const DeviceConnection = lazy(() => import("@/pages/DeviceConnection"));
const AdminSetup = lazy(() => import("@/pages/AdminSetup"));
const NotFound = lazy(() => import("@/pages/NotFound"));

// Weather Tools
const SoundShelter = lazy(() => import("@/pages/SoundShelter"));
const BodyScan = lazy(() => import("@/pages/BodyScan"));
const TemperatureControl = lazy(() => import("@/pages/TemperatureControl"));
const PressureTherapy = lazy(() => import("@/pages/PressureTherapy"));
const GroundAnchor = lazy(() => import("@/pages/GroundAnchor"));

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
        <Route 
          path="/tools" 
          element={
            <ProtectedRoute>
              <WeatherTools />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/breathing" 
          element={
            <ProtectedRoute>
              <BreathingExercise />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/storm-shelter" 
          element={
            <ProtectedRoute>
              <StormShelter />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/settings" 
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          } 
        />

        {/* Weather Tools Routes */}
        <Route 
          path="/sound-shelter" 
          element={
            <ProtectedRoute>
              <SoundShelter />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/body-scan" 
          element={
            <ProtectedRoute>
              <BodyScan />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/temperature" 
          element={
            <ProtectedRoute>
              <TemperatureControl />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/pressure" 
          element={
            <ProtectedRoute>
              <PressureTherapy />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/ground-anchor" 
          element={
            <ProtectedRoute>
              <GroundAnchor />
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