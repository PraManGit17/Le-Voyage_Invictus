const Trip = require("../models/Trip");

const mapTrip = (trip) => ({
  id: String(trip._id),
  title: trip.title,
  startDate: trip.startDate,
  endDate: trip.endDate,
  durationDays: trip.durationDays,
  notes: trip.notes,
  destinations: trip.destinations || [],
  itinerary: trip.itinerary || [],
  budget: trip.budget || { total: 0, spent: 0, estimated: 0 },
  collaborators: trip.collaborators || [],
  recommendedItineraryId: trip.recommendedItineraryId || "",
  recommendedItineraryName: trip.recommendedItineraryName || "",
  generatedPlan: trip.generatedPlan || {},
  groupName: trip.groupName || "",
  groupId: trip.groupId || "",
  memoryBook: trip.memoryBook || {},
  createdAt: trip.createdAt,
  updatedAt: trip.updatedAt,
});

exports.getMyTrips = async (req, res) => {
  try {
    const trips = await Trip.find({ owner: req.userId }).sort({ updatedAt: -1 });
    return res.json({ trips: trips.map(mapTrip) });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch trips", error: error.message });
  }
};

exports.createTrip = async (req, res) => {
  try {
    const {
      title,
      startDate,
      endDate,
      durationDays,
      notes,
      destinations,
      itinerary,
      budget,
      collaborators,
      recommendedItineraryId,
      recommendedItineraryName,
      generatedPlan,
      groupName,
      groupId,
      memoryBook,
    } = req.body;

    if (!title || !startDate || !endDate) {
      return res.status(400).json({ message: "title, startDate and endDate are required" });
    }

    const trip = await Trip.create({
      owner: req.userId,
      title,
      startDate,
      endDate,
      durationDays: Number(durationDays) || 1,
      notes: notes || "",
      destinations: destinations || [],
      itinerary: itinerary || [],
      budget: {
        total: Number(budget?.total || 0),
        spent: Number(budget?.spent || 0),
        estimated: Number(budget?.estimated || 0),
      },
      collaborators: collaborators || [],
      recommendedItineraryId: recommendedItineraryId || "",
      recommendedItineraryName: recommendedItineraryName || "",
      generatedPlan: generatedPlan || {},
      groupName: groupName || "",
      groupId: groupId || "",
      memoryBook: memoryBook || {},
    });

    return res.status(201).json({ trip: mapTrip(trip) });
  } catch (error) {
    return res.status(500).json({ message: "Failed to create trip", error: error.message });
  }
};

exports.updateTrip = async (req, res) => {
  try {
    const { tripId } = req.params;
    const updates = { ...req.body };

    delete updates.id;
    delete updates.owner;
    delete updates._id;
    delete updates.createdAt;
    delete updates.updatedAt;

    const trip = await Trip.findOneAndUpdate(
      { _id: tripId, owner: req.userId },
      { $set: updates },
      { new: true, runValidators: true },
    );

    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    return res.json({ trip: mapTrip(trip) });
  } catch (error) {
    return res.status(500).json({ message: "Failed to update trip", error: error.message });
  }
};