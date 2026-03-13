const MOCK_DELAY = 350;

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

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

export const tripService = {
  fetchAllTrips: async (userId) => {
    await wait(MOCK_DELAY);
    return readTrips(userId);
  },

  createTrip: async (userId, tripData) => {
    await wait(MOCK_DELAY);
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

  updateTrip: async (userId, tripId, partialUpdate) => {
    await wait(MOCK_DELAY);
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