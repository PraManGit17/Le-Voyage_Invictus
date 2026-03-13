const MOCK_DELAY = 350;

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const API_BASE = 'http://localhost:5000/api/trips';

const getStorageKey = (userId) => `trips_${userId}`;

const readTrips = (userId) => {
  const raw = localStorage.getItem(getStorageKey(userId));
  return raw ? JSON.parse(raw) : [];
};

const writeTrips = (userId, trips) => {
  try {
    localStorage.setItem(getStorageKey(userId), JSON.stringify(trips));
  } catch (error) {
    if (error?.name === 'QuotaExceededError') {
      throw new Error('Browser storage is full. Large trip assets are being moved out of local storage. Please retry this action.');
    }
    throw error;
  }
};

const authHeaders = (token) => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${token}`,
});

const buildTripFingerprint = (trip) => [
  trip?.title || '',
  trip?.startDate || '',
  trip?.endDate || '',
  trip?.recommendedItineraryName || '',
  trip?.groupId || '',
].join('::').toLowerCase();

const createRemoteTrip = async (token, tripData) => {
  const response = await fetch(API_BASE, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify(tripData),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to create trip');
  }

  return data.trip;
};

const updateRemoteTrip = async (token, tripId, partialUpdate) => {
  const response = await fetch(`${API_BASE}/${tripId}`, {
    method: 'PATCH',
    headers: authHeaders(token),
    body: JSON.stringify(partialUpdate),
  });

  const data = await response.json();
  if (!response.ok) {
    const error = new Error(data.message || 'Failed to update trip');
    error.status = response.status;
    throw error;
  }

  return data.trip;
};

const mergeTrips = (localTrips, remoteTrips) => {
  const tripMap = new Map();

  [...localTrips, ...remoteTrips].forEach((trip) => {
    if (trip?.id) {
      tripMap.set(trip.id, trip);
    }
  });

  return Array.from(tripMap.values()).sort(
    (left, right) => new Date(right.updatedAt || right.createdAt || 0).getTime() - new Date(left.updatedAt || left.createdAt || 0).getTime(),
  );
};

export const tripService = {
  fetchAllTrips: async (userId, token) => {
    await wait(MOCK_DELAY);

    if (!token) {
      return readTrips(userId);
    }

    try {
      const localTrips = readTrips(userId);
      const response = await fetch(API_BASE, {
        headers: authHeaders(token),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to load trips');
      }

      let remoteTrips = data.trips || [];
      const remoteFingerprints = new Set(remoteTrips.map((trip) => buildTripFingerprint(trip)));
      const tripsToMigrate = localTrips.filter((trip) => !remoteFingerprints.has(buildTripFingerprint(trip)));

      if (tripsToMigrate.length > 0) {
        const migratedTrips = [];

        for (const trip of tripsToMigrate) {
          try {
            migratedTrips.push(await createRemoteTrip(token, trip));
          } catch {
            // Keep the local copy if migration fails for a specific trip.
          }
        }

        if (migratedTrips.length > 0) {
          remoteTrips = [...migratedTrips, ...remoteTrips];
        }
      }

      const mergedTrips = mergeTrips(localTrips, remoteTrips);
      writeTrips(userId, mergedTrips);
      return mergedTrips;
    } catch {
      return readTrips(userId);
    }
  },

  createTrip: async (userId, tripData, token) => {
    await wait(MOCK_DELAY);

    if (token) {
      const createdTrip = await createRemoteTrip(token, tripData);
      const updatedTrips = mergeTrips(readTrips(userId), [createdTrip]);
      writeTrips(userId, updatedTrips);
      return createdTrip;
    }

    const existingTrips = readTrips(userId);
    const createdTrip = {
      ...tripData,
      id: String(Date.now()),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const updatedTrips = [createdTrip, ...existingTrips];
    writeTrips(userId, updatedTrips);
    return createdTrip;
  },

  updateTrip: async (userId, tripId, partialUpdate, token) => {
    await wait(MOCK_DELAY);

    if (token) {
      try {
        const updatedTrip = await updateRemoteTrip(token, tripId, partialUpdate);
        const existingTrips = readTrips(userId).filter((trip) => trip.id !== tripId);
        writeTrips(userId, mergeTrips(existingTrips, [updatedTrip]));
        return updatedTrip;
      } catch (error) {
        if (error.status !== 404) {
          throw error;
        }

        const localTrip = readTrips(userId).find((trip) => trip.id === tripId);
        if (!localTrip) {
          throw error;
        }

        const migratedTrip = await createRemoteTrip(token, {
          ...localTrip,
          ...partialUpdate,
        });

        const existingTrips = readTrips(userId).filter((trip) => trip.id !== tripId);
        writeTrips(userId, mergeTrips(existingTrips, [migratedTrip]));
        return migratedTrip;
      }
    }

    const existingTrips = readTrips(userId);
    const updatedTrips = existingTrips.map((trip) => {
      if (trip.id !== tripId) {
        return trip;
      }
      return {
        ...trip,
        ...partialUpdate,
        updatedAt: new Date().toISOString(),
      };
    });
    writeTrips(userId, updatedTrips);
    return updatedTrips.find((trip) => trip.id === tripId) || null;
  },

  askAgent: async (prompt) => {
    await wait(900);
    return {
      message: `Agent suggestion: ${prompt}. Start with high-priority locations first and keep one flexible evening slot for weather changes.`,
      suggestedChanges: [],
    };
  },
};