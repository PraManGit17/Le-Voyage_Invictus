import React, { createContext, useContext } from 'react';
import { useTripManager } from '../fetures/dashboard/hooks/useTripManager';

const TripContext = createContext();

export const TripProvider = ({ children }) => {
  const tripManager = useTripManager();

  return (
    <TripContext.Provider value={tripManager}>
      {children}
    </TripContext.Provider>
  );
};

export const useTrips = () => {
  const context = useContext(TripContext);
  if (!context) {
    throw new Error('useTrips must be used within a TripProvider.');
  }
  return context;
};