import { useCallback, useEffect, useMemo, useState } from 'react';
import { tripService } from '../api/tripService';
import { buildTripPayload } from '../services/tripWorkspaceService';
import { useAuth } from '../../../context/AuthContext';

const DEFAULT_USER_ID = 'demo-user';

export const useTripManager = () => {
  const { token, user } = useAuth();
  const [trips, setTrips] = useState([]);
  const [activeTripId, setActiveTripId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState('');

  const storageUserId = user?._id || user?.id || DEFAULT_USER_ID;

  const loadTrips = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const storedTrips = await tripService.fetchAllTrips(storageUserId, token);
      setTrips(storedTrips);
      if (!activeTripId && storedTrips.length > 0) {
        setActiveTripId(storedTrips[0].id);
      }
    } catch (loadError) {
      setError('Unable to load trip workspaces.');
    } finally {
      setIsLoading(false);
    }
  }, [activeTripId, storageUserId, token]);

  useEffect(() => {
    loadTrips();
  }, [loadTrips]);

  const createTrip = useCallback(async (tripInput) => {
    setIsCreating(true);
    setError('');
    try {
      const payload = buildTripPayload(tripInput);
      const createdTrip = await tripService.createTrip(storageUserId, payload, token);
      setTrips((prevTrips) => [createdTrip, ...prevTrips]);
      setActiveTripId(createdTrip.id);
      return createdTrip;
    } catch (createError) {
      setError(createError.message || 'Unable to create trip workspace.');
      return null;
    } finally {
      setIsCreating(false);
    }
  }, [storageUserId, token]);

  const updateTripNotes = useCallback(async (tripId, notes) => {
    const updatedTrip = await tripService.updateTrip(storageUserId, tripId, { notes }, token);
    if (!updatedTrip) {
      return null;
    }
    setTrips((prevTrips) => prevTrips.map((trip) => (trip.id === tripId ? updatedTrip : trip)));
    return updatedTrip;
  }, [storageUserId, token]);

  const updateTripData = useCallback(async (tripId, partialUpdate) => {
    const updatedTrip = await tripService.updateTrip(storageUserId, tripId, partialUpdate, token);
    if (!updatedTrip) {
      return null;
    }
    setTrips((prevTrips) => prevTrips.map((trip) => (trip.id === tripId ? updatedTrip : trip)));
    return updatedTrip;
  }, [storageUserId, token]);

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