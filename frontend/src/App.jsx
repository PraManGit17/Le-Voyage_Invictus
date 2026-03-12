import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './fetures/landingpage/pages/LandingPage';
import OnboardingPage from './fetures/landingpage/pages/OnboardingPage';
import Dashboard from './fetures/dashboard/pages/Dashboard';
import Discovery from './fetures/dashboard/pages/Discovery';
import TripWorkspace from './fetures/dashboard/pages/TripWorkspace';
import ItineraryDetails from './fetures/dashboard/pages/ItineraryDetails';
import GroupTrips from './fetures/dashboard/pages/GroupTrips';
import GroupTripDetail from './fetures/dashboard/pages/GroupTripDetail';
import DashboardLayout from './fetures/dashboard/layouts/DashboardLayout';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/onboarding" element={<OnboardingPage />} />

      <Route 
        path="/dashboard" 
        element={
          <DashboardLayout>
            <Dashboard />
          </DashboardLayout>
        } 
      />

      <Route 
        path="/discovery" 
        element={
          <DashboardLayout>
            <Discovery />
          </DashboardLayout>
        } 
      />

      <Route
        path="/discovery/:itineraryId"
        element={
          <DashboardLayout>
            <ItineraryDetails />
          </DashboardLayout>
        }
      />

      <Route 
        path="/trip/:tripId" 
        element={
          <DashboardLayout>
            <TripWorkspace />
          </DashboardLayout>
        } 
      />

      <Route
        path="/groups"
        element={
          <DashboardLayout>
            <GroupTrips />
          </DashboardLayout>
        }
      />

      <Route
        path="/group/:groupId"
        element={
          <DashboardLayout>
            <GroupTripDetail />
          </DashboardLayout>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;