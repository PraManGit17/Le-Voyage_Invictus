import { useCallback, useEffect, useMemo, useState } from 'react';
import { tripService } from '../api/tripService';
import { buildTripPayload } from '../services/tripWorkspaceService';

const DEFAULT_USER_ID = 'demo-user';

export const useTripManager = () => {
  const [trips, setTrips] = useState([]);
  const [activeTripId, setActiveTripId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState('');

  const loadTrips = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const storedTrips = await tripService.fetchAllTrips(DEFAULT_USER_ID);
      setTrips(storedTrips);
      if (!activeTripId && storedTrips.length > 0) {
        setActiveTripId(storedTrips[0].id);
      }
    } catch (loadError) {
      setError('Unable to load trip workspaces.');
    } finally {
      setIsLoading(false);
    }
  }, [activeTripId]);

  useEffect(() => {
    loadTrips();
  }, [loadTrips]);

  const createTrip = useCallback(async (tripInput) => {
    setIsCreating(true);
    setError('');
    try {
      const payload = buildTripPayload(tripInput);
      const createdTrip = await tripService.createTrip(DEFAULT_USER_ID, payload);
      setTrips((prevTrips) => [createdTrip, ...prevTrips]);
      setActiveTripId(createdTrip.id);
      return createdTrip;
    } catch (createError) {
      setError(createError.message || 'Unable to create trip workspace.');
      return null;
    } finally {
      setIsCreating(false);
    }
  }, []);

  const updateTripNotes = useCallback(async (tripId, notes) => {
    const updatedTrip = await tripService.updateTrip(DEFAULT_USER_ID, tripId, { notes });
    if (!updatedTrip) {
      return null;
    }
    setTrips((prevTrips) => prevTrips.map((trip) => (trip.id === tripId ? updatedTrip : trip)));
    return updatedTrip;
  }, []);

  const updateTripData = useCallback(async (tripId, partialUpdate) => {
    const updatedTrip = await tripService.updateTrip(DEFAULT_USER_ID, tripId, partialUpdate);
    if (!updatedTrip) {
      return null;
    }
    setTrips((prevTrips) => prevTrips.map((trip) => (trip.id === tripId ? updatedTrip : trip)));
    return updatedTrip;
  }, []);

  const activeTrip = useMemo(
    () => trips.find((trip) => trip.id === activeTripId) || null,
    [activeTripId, trips],
  );

  const getTripById = useCallback(
    (tripId) => trips.find((trip) => trip.id === tripId) || null,
    [trips],
  );

  return {
    trips,
    activeTrip,
    activeTripId,
    setActiveTripId,
    getTripById,
    isLoading,
    isCreating,
    error,
    createTrip,
    updateTripNotes,
    updateTripData,
    reloadTrips: loadTrips,
  };
};