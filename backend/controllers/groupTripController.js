const GroupTrip = require("../models/GroupTrip");
const User = require("../models/User");

const safeNumber = (value, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const parseEmailList = (emails = []) =>
  Array.isArray(emails)
    ? emails
      .map((email) => String(email || "").trim().toLowerCase())
      .filter(Boolean)
    : [];

exports.createGroupTrip = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("name email");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const {
      name,
      destination,
      startDate,
      endDate,
      maxMembers,
      budgetTotal,
      creatorPool,
      tags,
      guidelines,
      itineraryId,
      tripData,
      generatedPlan,
      memberEmails,
    } = req.body;

    if (!name || !startDate || !endDate) {
      return res.status(400).json({ message: "name, startDate and endDate are required" });
    }

    const creatorEmail = String(user.email || "").toLowerCase();
    const invitedEmails = parseEmailList(memberEmails).filter((email) => email !== creatorEmail);

    const organizer = {
      user: user._id,
      name: user.name,
      email: creatorEmail,
      role: "organizer",
      poolContribution: safeNumber(creatorPool),
    };

    const invitedMembers = invitedEmails.map((email) => ({
      name: email.split("@")[0],
      email,
      role: "member",
      poolContribution: 0,
    }));

    const members = [organizer, ...invitedMembers];

    const groupTrip = await GroupTrip.create({
      name,
      destination: destination || "",
      startDate,
      endDate,
      maxMembers: safeNumber(maxMembers, 6),
      creator: user._id,
      members,
      tags: Array.isArray(tags) ? tags : [],
      guidelines: Array.isArray(guidelines) ? guidelines : [],
      itineraryId: itineraryId || "",
      budget: {
        total: safeNumber(budgetTotal),
        spent: 0,
        currency: "₹",
        poolRaised: safeNumber(creatorPool),
      },
      tripData: tripData || {},
      generatedPlan: generatedPlan || {},
    });

    return res.status(201).json({
      message: "Group trip created",
      groupTrip,
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to create group trip", error: error.message });
  }
};

exports.getMyGroupTrips = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("email");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const email = String(user.email || "").toLowerCase();
    const groupTrips = await GroupTrip.find({
      $or: [
        { creator: req.userId },
        { "members.email": email },
      ],
    }).sort({ createdAt: -1 });

    return res.json({ groupTrips });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch group trips", error: error.message });
  }
};

exports.joinGroupTrip = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("name email");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { groupId } = req.params;
    const { poolContribution = 0 } = req.body;

    const groupTrip = await GroupTrip.findById(groupId);
    if (!groupTrip) {
      return res.status(404).json({ message: "Group trip not found" });
    }

    const email = String(user.email || "").toLowerCase();
    const memberIndex = groupTrip.members.findIndex((member) => member.email === email);

    if (memberIndex < 0 && groupTrip.members.length >= groupTrip.maxMembers) {
      return res.status(400).json({ message: "Group is full" });
    }

    const increment = safeNumber(poolContribution, 0);

    if (memberIndex >= 0) {
      if (groupTrip.members[memberIndex].role === "organizer") {
        return res.status(400).json({ message: "Organizer cannot join again" });
      }
      groupTrip.members[memberIndex].poolContribution += increment;
    } else {
      groupTrip.members.push({
        user: user._id,
        name: user.name,
        email,
        role: "member",
        poolContribution: increment,
      });
    }

    groupTrip.budget.poolRaised = groupTrip.members.reduce(
      (sum, member) => sum + safeNumber(member.poolContribution, 0),
      0,
    );

    await groupTrip.save();

    return res.json({
      message: "Joined group trip successfully",
      groupTrip,
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to join group trip", error: error.message });
  }
};

exports.addPoolContribution = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("name email");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { groupId } = req.params;
    const { amount = 0 } = req.body;

    const groupTrip = await GroupTrip.findById(groupId);
    if (!groupTrip) {
      return res.status(404).json({ message: "Group trip not found" });
    }

    const email = String(user.email || "").toLowerCase();
    const memberIndex = groupTrip.members.findIndex((member) => member.email === email);
    const increment = safeNumber(amount, 0);

    if (memberIndex >= 0) {
      groupTrip.members[memberIndex].poolContribution += increment;
    } else {
      groupTrip.members.push({
        user: user._id,
        name: user.name,
        email,
        role: "member",
        poolContribution: increment,
      });
    }

    groupTrip.budget.poolRaised = groupTrip.members.reduce(
      (sum, member) => sum + safeNumber(member.poolContribution, 0),
      0,
    );

    await groupTrip.save();

    return res.json({ message: "Pool contribution updated", groupTrip });
  } catch (error) {
    return res.status(500).json({ message: "Failed to update pool", error: error.message });
  }
};
