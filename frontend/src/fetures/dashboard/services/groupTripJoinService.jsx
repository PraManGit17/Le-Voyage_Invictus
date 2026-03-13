const GROUP_TRIP_LINK_KEY = 'joined_group_trip_links_demo_user';

const readLinks = () => {
  try {
    const raw = localStorage.getItem(GROUP_TRIP_LINK_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

const writeLinks = (links) => {
  localStorage.setItem(GROUP_TRIP_LINK_KEY, JSON.stringify(links));
};

export const getLinkedTripIdForGroup = (groupId) => {
  const links = readLinks();
  return links[groupId] || '';
};

export const saveLinkedTripForGroup = (groupId, tripId) => {
  const links = readLinks();
  const next = { ...links, [groupId]: tripId };
  writeLinks(next);
};

export const createTripPayloadFromGroup = (group, itinerary) => {
  const itineraryItems = (itinerary?.days || []).flatMap((day) =>
    (day.places || []).map((place) => ({
      id: `${day.day}-${place.id}`,
      day: Number(day.day) || 1,
      time: place.time || 'Flexible',
      title: place.name || 'Planned stop',
      type: 'Group Plan',
      cost: place.entryFee || 'Included',
      location: place.address || group.destination,
      duration: place.duration || 'Flexible',
      tips: Array.isArray(place.tips) ? place.tips.join(' ') : '',
    })),
  );

  const destinationMap = new Map();
  (itinerary?.days || []).forEach((day) => {
    (day.places || []).forEach((place) => {
      if (!destinationMap.has(place.id)) {
        destinationMap.set(place.id, {
          id: place.id,
          name: place.name,
          lat: place.lat,
          lng: place.lng,
        });
      }
    });
  });

  const collaborators = group.members.map((member) => member.name);
  const notes = [
    `Joined group trip: ${group.name}`,
    `Destination: ${group.destination}`,
    `Tags: ${(group.tags || []).join(', ')}`,
    `Guidelines: ${(group.guidelines || []).slice(0, 3).join(' | ')}`,
  ].join('\n');

  return {
    title: `${group.name} Workspace`,
    startDate: group.startDate,
    endDate: group.endDate,
    notes,
    groupName: group.name,
    groupId: group.id,
    collaborators,
    itinerary: itineraryItems,
    destinations: Array.from(destinationMap.values()),
    recommendedItineraryId: group.itineraryId,
    recommendedItineraryName: itinerary?.name || group.destination,
    budget: {
      total: group.budget?.total || 0,
      spent: group.budget?.spent || 0,
      estimated: group.budget?.total || 0,
    },
  };
};
