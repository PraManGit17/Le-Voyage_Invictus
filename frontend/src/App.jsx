import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './fetures/landingpage/pages/LandingPage';
import AuthPage from './fetures/landingpage/pages/AuthPage';
import OnboardingPage from './fetures/landingpage/pages/OnboardingPage';
import Dashboard from './fetures/dashboard/pages/Dashboard';
import Discovery from './fetures/dashboard/pages/Discovery';
import TripWorkspace from './fetures/dashboard/pages/TripWorkspace';
import ItineraryDetails from './fetures/dashboard/pages/ItineraryDetails';
import GroupTrips from './fetures/dashboard/pages/GroupTrips';
import GroupTripDetail from './fetures/dashboard/pages/GroupTripDetail';
import SavedPlaces from './fetures/dashboard/pages/SavedPlaces';
import MemoryBook from './fetures/dashboard/pages/MemoryBook';
// import DashboardLayout from './fetures/dashboard/layouts/DashboardLayout';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './fetures/dashboard/layouts/DashboardLayout';
import Workspace from './fetures/dashboard/pages/Workspace';

const App = () => {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/auth" element={<AuthPage />} />

      {/* Protected */}
      <Route path="/onboarding" element={<ProtectedRoute><OnboardingPage /></ProtectedRoute>} />
      <Route path="/" element={<LandingPage />} />
      <Route path="/onboarding" element={<OnboardingPage />} />

      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <Dashboard />
            </DashboardLayout>
          </ProtectedRoute>
        } 
      />

      <Route 
        path="/discovery" 
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <Discovery />
            </DashboardLayout>
          </ProtectedRoute>
        } 
      />

      <Route
        path="/discovery/:itineraryId"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <ItineraryDetails />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route 
        path="/trip/:tripId" 
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <TripWorkspace />
            </DashboardLayout>
          </ProtectedRoute>

        } 
      />

      <Route
        path="/workspace"
        element={
          <DashboardLayout>
            <Workspace />
          </DashboardLayout>
        }
      />

      <Route
        path="/group/:groupId"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <GroupTripDetail />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/saved-places"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <SavedPlaces />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/memory-book"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <MemoryBook />
            </DashboardLayout>
          </ProtectedRoute>

        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;