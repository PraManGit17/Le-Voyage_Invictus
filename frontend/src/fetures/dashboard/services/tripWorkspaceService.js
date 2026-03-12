const MS_PER_DAY = 24 * 60 * 60 * 1000;

export const getDurationInDays = (startDate, endDate) => {
  if (!startDate || !endDate) {
    return 0;
  }
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diff = end.setHours(0, 0, 0, 0) - start.setHours(0, 0, 0, 0);
  if (Number.isNaN(diff) || diff < 0) {
    return 0;
  }
  return Math.floor(diff / MS_PER_DAY) + 1;
};

export const buildTripPayload = ({ title, startDate, endDate, notes, ...optionalFields }) => {
  const cleanedTitle = (title || "").trim();
  const cleanedNotes = (notes || "").trim();

  if (!cleanedTitle) {
    throw new Error("Trip title is required.");
  }
  if (!startDate || !endDate) {
    throw new Error("Start date and end date are required.");
  }

  const durationDays = getDurationInDays(startDate, endDate);
  if (durationDays <= 0) {
    throw new Error("End date must be the same as or after start date.");
  }

  return {
    title: cleanedTitle,
    startDate,
    endDate,
    durationDays,
    notes: cleanedNotes,
    destinations: [],
    itinerary: [],
    budget: {
      total: 0,
      spent: 0,
      estimated: 0,
    },
    collaborators: [],
    ...optionalFields,
  };
};
