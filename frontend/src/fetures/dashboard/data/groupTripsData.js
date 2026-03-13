export const groupTripsData = [
  {
    id: 'grp-rajasthan-royal',
    name: 'Royal Rajasthan Explorers',
    itineraryId: 'rajasthan-heritage',
    destination: 'Rajasthan, India',
    image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&q=80',
    startDate: '2026-04-10',
    endDate: '2026-04-13',
    members: [
      { id: 'm1', name: 'Priya Sharma', avatar: 'PS', role: 'organizer', online: true },
      { id: 'm2', name: 'Arjun Mehta', avatar: 'AM', role: 'member', online: true },
      { id: 'm3', name: 'Sneha Verma', avatar: 'SV', role: 'member', online: false },
      { id: 'm4', name: 'Rahul Nair', avatar: 'RN', role: 'member', online: true },
    ],
    maxMembers: 8,
    budget: { total: 45000, spent: 12000, currency: '₹' },
    guidelines: [
      'All members meet at Jaipur Railway Station by 7:30 AM on Day 1',
      'Carry comfortable walking shoes — we cover 8-10 km daily',
      'Group dinner every night at 8 PM — vote for restaurant in chat',
      'Everyone contributes equally to the shared budget fund',
      'Share photos in the group album, not individually',
      'Emergency contact: Priya (+91 98765 43210)',
    ],
    status: 'upcoming',
    tags: ['Heritage', 'Culture', 'Photography'],
  },
  {
    id: 'grp-kerala-backwaters',
    name: 'Kerala Monsoon Squad',
    itineraryId: 'kerala-backwaters',
    destination: 'Kerala, India',
    image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&q=80',
    startDate: '2026-05-15',
    endDate: '2026-05-18',
    members: [
      { id: 'm5', name: 'Deepak Kumar', avatar: 'DK', role: 'organizer', online: true },
      { id: 'm6', name: 'Ananya Pillai', avatar: 'AP', role: 'member', online: false },
      { id: 'm7', name: 'Vikram Singh', avatar: 'VS', role: 'member', online: true },
    ],
    maxMembers: 6,
    budget: { total: 35000, spent: 8000, currency: '₹' },
    guidelines: [
      'Pack rain gear — monsoon season means sudden showers',
      'Houseboat booking confirmed for Day 2 — no changes',
      'Spice garden tour on Day 3 morning — be ready by 6 AM',
      'Deepak manages the group fund — Gpay/UPI accepted',
      'Respect local customs at temples — dress modestly',
    ],
    status: 'upcoming',
    tags: ['Nature', 'Backwaters', 'Spice Tour'],
  },
  {
    id: 'grp-himachal-trek',
    name: 'Himachal Trekkers United',
    itineraryId: 'himachal-adventure',
    destination: 'Himachal Pradesh, India',
    image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&q=80',
    startDate: '2026-06-01',
    endDate: '2026-06-05',
    members: [
      { id: 'm8', name: 'Kavya Reddy', avatar: 'KR', role: 'organizer', online: true },
      { id: 'm9', name: 'Ishaan Gupta', avatar: 'IG', role: 'member', online: true },
      { id: 'm10', name: 'Meera Joshi', avatar: 'MJ', role: 'member', online: true },
      { id: 'm11', name: 'Rohan Das', avatar: 'RD', role: 'member', online: false },
      { id: 'm12', name: 'Tanya Bhat', avatar: 'TB', role: 'member', online: true },
      { id: 'm13', name: 'Aditya Rao', avatar: 'AR', role: 'member', online: false },
    ],
    maxMembers: 10,
    budget: { total: 55000, spent: 20000, currency: '₹' },
    guidelines: [
      'Altitude sickness precaution: acclimatize Day 1, no heavy trek',
      'Carry personal first-aid kit + altitude medication',
      'Trek lead: Kavya. Follow her pace and route decisions.',
      'No littering on trails — carry a trash bag',
      'Campfire at 7 PM each evening — mandatory bonding time!',
      'Pack layers — temperature drops to 5°C at night',
    ],
    status: 'active',
    tags: ['Trekking', 'Adventure', 'Mountains'],
  },
  {
    id: 'grp-goa-party',
    name: 'Goa Beach Vibes 🌊',
    itineraryId: 'goa-coastal-bliss',
    destination: 'Goa, India',
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&q=80',
    startDate: '2026-03-20',
    endDate: '2026-03-23',
    members: [
      { id: 'm14', name: 'Nisha Kapoor', avatar: 'NK', role: 'organizer', online: true },
      { id: 'm15', name: 'Sameer Ali', avatar: 'SA', role: 'member', online: true },
    ],
    maxMembers: 5,
    budget: { total: 30000, spent: 5000, currency: '₹' },
    guidelines: [
      'Sunscreen is non-negotiable — SPF 50+',
      'Scooter rentals on Day 1 — bring your license',
      'Beach cleanup on last morning — leave it better than we found it',
      'No phones during sunset hour (6-7 PM) — be present!',
    ],
    status: 'upcoming',
    tags: ['Beach', 'Nightlife', 'Water Sports'],
  },
];

const CHAT_STORAGE_KEY = 'group_chat_';

export const getGroupById = (groupId) =>
  groupTripsData.find((g) => g.id === groupId) || null;

export const getGroupChatMessages = (groupId) => {
  const raw = localStorage.getItem(`${CHAT_STORAGE_KEY}${groupId}`);
  if (raw) return JSON.parse(raw);

  const defaults = {
    'grp-rajasthan-royal': [
      { id: 1, user: 'Priya Sharma', avatar: 'PS', text: 'Hey everyone! Excited for the Rajasthan trip 🏰', time: '10:30 AM', date: '2026-03-10' },
      { id: 2, user: 'Arjun Mehta', avatar: 'AM', text: 'Same here! Should we book the Amber Fort guided tour in advance?', time: '10:45 AM', date: '2026-03-10' },
      { id: 3, user: 'Sneha Verma', avatar: 'SV', text: 'Yes! Also, I found a great haveli restaurant for Day 1 dinner', time: '11:02 AM', date: '2026-03-10' },
      { id: 4, user: 'Rahul Nair', avatar: 'RN', text: 'I\'m bringing my DSLR — sunrise at Mehrangarh Fort is going to be epic 📸', time: '11:15 AM', date: '2026-03-10' },
    ],
    'grp-kerala-backwaters': [
      { id: 1, user: 'Deepak Kumar', avatar: 'DK', text: 'Houseboat is confirmed for Day 2! 🛶', time: '09:00 AM', date: '2026-03-08' },
      { id: 2, user: 'Ananya Pillai', avatar: 'AP', text: 'Can we stop at a tea estate on Day 3?', time: '09:30 AM', date: '2026-03-08' },
      { id: 3, user: 'Vikram Singh', avatar: 'VS', text: 'Absolutely! Kanan Devan Hills is on our route', time: '09:45 AM', date: '2026-03-08' },
    ],
    'grp-himachal-trek': [
      { id: 1, user: 'Kavya Reddy', avatar: 'KR', text: 'Gear check! Everyone pack warm layers and a headlamp', time: '08:00 AM', date: '2026-03-12' },
      { id: 2, user: 'Ishaan Gupta', avatar: 'IG', text: 'Do we need crampons for the Rohtang Pass section?', time: '08:20 AM', date: '2026-03-12' },
      { id: 3, user: 'Meera Joshi', avatar: 'MJ', text: 'Not this time of year, but good trekking boots are a must', time: '08:35 AM', date: '2026-03-12' },
      { id: 4, user: 'Rohan Das', avatar: 'RD', text: 'I\'ll bring the portable stove for campfire cooking 🔥', time: '09:00 AM', date: '2026-03-12' },
      { id: 5, user: 'Tanya Bhat', avatar: 'TB', text: 'This is going to be the best trek ever!', time: '09:15 AM', date: '2026-03-12' },
    ],
    'grp-goa-party': [
      { id: 1, user: 'Nisha Kapoor', avatar: 'NK', text: 'Goa here we come! 🌊🎉', time: '07:00 PM', date: '2026-03-11' },
      { id: 2, user: 'Sameer Ali', avatar: 'SA', text: 'Let\'s rent scooters on Day 1 and explore North Goa beaches', time: '07:15 PM', date: '2026-03-11' },
    ],
  };
  return defaults[groupId] || [];
};

export const saveGroupChatMessages = (groupId, messages) => {
  localStorage.setItem(`${CHAT_STORAGE_KEY}${groupId}`, JSON.stringify(messages));
};
