const API_BASE = "http://localhost:5000/api/group-trips";

const authHeaders = (token) => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${token}`,
});

export const groupTripService = {
  create: async (token, payload) => {
    const response = await fetch(API_BASE, {
      method: "POST",
      headers: authHeaders(token),
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to create group trip");
    }
    return data.groupTrip;
  },

  fetchMine: async (token) => {
    const response = await fetch(`${API_BASE}/mine`, {
      headers: authHeaders(token),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to load group trips");
    }
    return data.groupTrips || [];
  },

  join: async (token, groupId, poolContribution = 0) => {
    const response = await fetch(`${API_BASE}/${groupId}/join`, {
      method: "POST",
      headers: authHeaders(token),
      body: JSON.stringify({ poolContribution }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to join group trip");
    }
    return data.groupTrip;
  },

  addPool: async (token, groupId, amount) => {
    const response = await fetch(`${API_BASE}/${groupId}/pool`, {
      method: "POST",
      headers: authHeaders(token),
      body: JSON.stringify({ amount }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to add pool contribution");
    }
    return data.groupTrip;
  },
};
