export const PHONE_DISPLAY = "080 4567 8901";
export const PHONE_TEL = "+918045678901";

export const occasions = [
  "Birthday",
  "Anniversary",
  "Date night",
  "Proposal",
  "Farewell",
  "Family gathering",
];

export const cities = [
  { name: "Bengaluru", areas: ["Whitefield", "Indiranagar", "Koramangala", "Jayanagar"] },
  { name: "Mumbai", areas: ["Andheri", "Bandra", "Powai"] },
  { name: "Delhi NCR", areas: ["Gurugram", "Noida", "Saket"] },
  { name: "Chennai", areas: ["Anna Nagar", "T. Nagar"] },
  { name: "Hyderabad", areas: ["Banjara Hills", "Gachibowli"] },
  { name: "Pune", areas: ["Koregaon Park", "Hinjewadi"] },
  { name: "Ahmedabad", areas: ["Satellite", "Navrangpura"] },
  { name: "Lucknow", areas: ["Gomti Nagar"] },
  { name: "Visakhapatnam", areas: ["MVP Colony"] },
];

export const addons = [
  { id: "cake", name: "Signature cake", price: 699, detail: "Chocolate or vanilla, with a name on top" },
  { id: "arch", name: "Balloon arch", price: 1499, detail: "Fitted to the room, in the colours you pick" },
  { id: "photo", name: "Photographer, one hour", price: 1999, detail: "An edited set arrives the next day" },
  { id: "platter", name: "Snack platter", price: 499, detail: "Vegetarian, sized for the group" },
];

const periods = [
  { id: "morning", label: "10:30 AM", ends: "1:30 PM", bump: 0 },
  { id: "afternoon", label: "1:30 PM", ends: "4:30 PM", bump: 200 },
  { id: "evening", label: "5:00 PM", ends: "8:00 PM", bump: 400 },
  { id: "night", label: "8:30 PM", ends: "11:30 PM", bump: 600 },
];

const kinds = [
  {
    key: "screen",
    name: "Red Screen",
    line: "Two short rows, a 120-inch screen, and the lights kept low.",
    capacity: 10,
    screen: "120 inch",
    base: 1599,
    images: ["/photos/screen.jpg", "/photos/sofa.jpg", "/photos/confetti.jpg"],
    imageAlt: "A private cinema with deep red seats",
    includes: ["Private screen", "Room sound", "Dimmer lights", "Cake table"],
    bestFor: ["Birthday", "Date night", "Farewell", "Proposal"],
  },
  {
    key: "balloon",
    name: "Balloon Room",
    line: "Colour overhead, a screen at the front, and space to stand for the song.",
    capacity: 12,
    screen: "100 inch",
    base: 1299,
    images: ["/photos/balloons.jpg", "/photos/candles-cake.jpg", "/photos/dessert.jpg"],
    imageAlt: "Balloons gathered for a birthday",
    includes: ["Birthday décor", "Private screen", "Speaker", "Cake table"],
    bestFor: ["Birthday", "Family gathering", "Farewell"],
  },
  {
    key: "emerald",
    name: "Emerald Table",
    line: "A seated table for eight, with the screen where a toast can land.",
    capacity: 8,
    screen: "100 inch",
    base: 1799,
    images: ["/photos/salon.jpg", "/photos/table.jpg", "/photos/rose.jpg"],
    imageAlt: "A private dining table with green velvet chairs",
    includes: ["Seated table", "Private screen", "Soft lighting", "Host on arrival"],
    bestFor: ["Anniversary", "Date night", "Family gathering"],
  },
  {
    key: "cake",
    name: "Cake Alcove",
    line: "A smaller room built around the cake, the candles, and one good speech.",
    capacity: 8,
    screen: "85 inch",
    base: 1399,
    images: ["/photos/cake.jpg", "/photos/dessert.jpg", "/photos/candles-cake.jpg"],
    imageAlt: "A chocolate celebration cake",
    includes: ["Cake table", "Private screen", "Candle kit", "Playlist hookup"],
    bestFor: ["Birthday", "Anniversary", "Proposal"],
  },
];

function slugify(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function hash(value) {
  let h = 0;
  for (let i = 0; i < value.length; i += 1) h = (h * 31 + value.charCodeAt(i)) >>> 0;
  return h;
}

export const rooms = [];
let cursor = 0;
cities.forEach((city) => {
  city.areas.forEach((area) => {
    const picked = [0, 1, 2].map((offset) => kinds[(cursor + offset) % kinds.length]);
    cursor += 1;
    picked.forEach((kind) => {
      rooms.push({
        ...kind,
        id: `${kind.key}-${slugify(city.name)}-${slugify(area)}`,
        city: city.name,
        area,
      });
    });
  });
});

export const featured = kinds.map((kind) => rooms.find((room) => room.key === kind.key));

export function areasFor(cityName) {
  return cities.find((city) => city.name === cityName)?.areas ?? [];
}

export function getRoom(id) {
  return rooms.find((room) => room.id === id) ?? null;
}

export function filterRooms({ city, location, occasion }) {
  const list = rooms.filter((room) => {
    if (city && room.city !== city) return false;
    if (location && room.area !== location) return false;
    return true;
  });
  if (!occasion) return list;
  return [...list].sort(
    (a, b) => Number(b.bestFor.includes(occasion)) - Number(a.bestFor.includes(occasion)),
  );
}

export function slotsFor(room, date, taken = []) {
  return periods.map((period) => {
    const takenNow = taken.includes(period.id);
    const held = takenNow || (Boolean(date) && hash(`${room.id}|${date}|${period.id}`) % 11 === 0);
    return {
      id: period.id,
      label: period.label,
      ends: period.ends,
      price: room.base + period.bump,
      held,
    };
  });
}

export function formatINR(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(iso) {
  if (!iso) return "";
  const [year, month, day] = iso.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function isoFromDate(date) {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

export function todayISO() {
  return isoFromDate(new Date());
}

export function maxISO() {
  const date = new Date();
  date.setDate(date.getDate() + 180);
  return isoFromDate(date);
}

export const services = [
  {
    title: "A screen that is only yours",
    text: "Every Dada room has a private screen and sound that stays in the room. Play a film, a photo reel, or a message written for one person.",
    image: "/photos/screen.jpg",
    alt: "Red seats facing a private screen",
  },
  {
    title: "Décor before you arrive",
    text: "Balloons, a floral note, or a quiet table — set for the occasion and cleared when the slot ends. You do not decorate, and you do not clean up.",
    image: "/photos/balloons.jpg",
    alt: "Colourful balloons for a birthday room",
  },
  {
    title: "Cake with a name on it",
    text: "Add the signature cake when you book. Candles stay in the room if you want the lights down for the song.",
    image: "/photos/cake.jpg",
    alt: "Chocolate cake on a stand",
  },
  {
    title: "Food for the people in the room",
    text: "A vegetarian platter for the group, or a seated supper in Emerald Table. Nothing is shared with another booking.",
    image: "/photos/table.jpg",
    alt: "A plated dish at a celebration table",
  },
  {
    title: "An hour with a photographer",
    text: "Book the camera when the room is for a proposal, a farewell, or a birthday you will want to look at later. The edited set comes the next day.",
    image: "/photos/gathering.jpg",
    alt: "Glasses raised at a warmly lit gathering",
  },
  {
    title: "A desk that can hold the hour",
    text: "If you would rather talk it through, call the house desk. They can check a neighbourhood and keep a slot while you decide.",
    image: "/photos/salon.jpg",
    alt: "A private table set for a small group",
  },
];

export const gallery = [
  { src: "/photos/screen.jpg", alt: "Private cinema with red seats", tag: "Screen" },
  { src: "/photos/sofa.jpg", alt: "Green velvet sofa in a quiet room", tag: "Screen" },
  { src: "/photos/balloons.jpg", alt: "Balloons in many colours", tag: "Birthday" },
  { src: "/photos/cake.jpg", alt: "Chocolate celebration cake", tag: "Birthday" },
  { src: "/photos/candles-cake.jpg", alt: "Birthday candles on a cake", tag: "Birthday" },
  { src: "/photos/dessert.jpg", alt: "A birthday note plated in chocolate", tag: "Birthday" },
  { src: "/photos/confetti.jpg", alt: "Confetti hanging in the air", tag: "Birthday" },
  { src: "/photos/salon.jpg", alt: "Emerald chairs around a private table", tag: "Gathering" },
  { src: "/photos/table.jpg", alt: "Supper served at the room table", tag: "Gathering" },
  { src: "/photos/gathering.jpg", alt: "A toast under string lights", tag: "Gathering" },
  { src: "/photos/cheers.jpg", alt: "A small group raising glasses", tag: "Gathering" },
  { src: "/photos/rose.jpg", alt: "A red rose for an anniversary", tag: "Date night" },
  { src: "/photos/terrace.jpg", alt: "Candles set for two at dusk", tag: "Date night" },
];

export const stories = [
  {
    slug: "whitefield-thirtieth",
    title: "A thirtieth that never reached a restaurant",
    place: "Balloon Room · Whitefield",
    occasion: "Birthday",
    image: "/photos/balloons.jpg",
    alt: "Balloons filling the top of the frame",
    excerpt: "Twelve people, one cake, and a screen that played the year back in nine minutes.",
    paragraphs: [
      "They had booked restaurants twice and cancelled both. The birthday person disliked a room full of strangers singing on cue. Whitefield was closer to the office than to anyone’s childhood, which turned out to be the point.",
      "The Balloon Room was already up when they arrived: colour at the ceiling, the cake on the side table, the screen waiting on a black frame. Nobody had to find a plug. The host pointed at the dimmer and left.",
      "The reel was short. School, a bad haircut, a train platform, the new flat. When it ended, the room stayed theirs for another hour. They ate the cake sitting on the floor, which the chairs allowed, and which a restaurant would not have.",
      "That is the shape of a Dada booking. The neighbourhood is ordinary. The hour is not shared. The person who gathered everyone gets to be a guest, not the organiser of chairs.",
    ],
  },
  {
    slug: "the-second-song",
    title: "An anniversary with the second song",
    place: "Emerald Table · Bandra",
    occasion: "Anniversary",
    image: "/photos/salon.jpg",
    alt: "A dining table dressed in green and gold",
    excerpt: "They asked for the lights one step above dark, and for no one to open the door during the toast.",
    paragraphs: [
      "Eight years is an awkward number for a party and a good number for a table. Emerald Table in Bandra seats eight, which meant the couple and the six people who had been there the first time.",
      "The screen faced the table. They did not play a film. They played one song at the start and, much later, a second one. In between there was food, a short speech that forgot its ending, and the relief of not splitting a bill with a neighbouring birthday.",
      "Dada’s anniversary rooms are built for that middle stretch: long enough to talk, private enough that a speech can fail and still be fine.",
    ],
  },
  {
    slug: "the-screen-said-yes",
    title: "The screen said it before he did",
    place: "Red Screen · Anna Nagar",
    occasion: "Proposal",
    image: "/photos/screen.jpg",
    alt: "Empty red cinema seats in a dark room",
    excerpt: "A three-hour slot, two people, and a line written on the opening frame.",
    paragraphs: [
      "He did not want a crowd, a violin, or a restaurant that already knew. He wanted a dark room and a sentence she would read before either of them spoke.",
      "Red Screen in Anna Nagar is the quietest of the house rooms: short rows, a large screen, a door that closes properly. The line was on the first frame. The rest of the slot was a film she had picked months ago, which he had pretended not to remember.",
      "Proposals at Dada stay small on purpose. The room holds the moment. It does not perform it back to a dining room.",
    ],
  },
];

export const steps = [
  {
    n: "01",
    title: "Pick the neighbourhood",
    text: "Choose a city and the area that is easy for your people. Each neighbourhood keeps its own rooms.",
  },
  {
    n: "02",
    title: "Hold an hour",
    text: "Slots run three hours: morning, afternoon, evening, or night. The room is not shared during that window.",
  },
  {
    n: "03",
    title: "Arrive to it ready",
    text: "Décor, cake, and the screen are set before you walk in. You pay at the room. The desk confirms by phone.",
  },
];

export const faqs = [
  {
    q: "What is a Dada room?",
    a: "A private room for one group. It has a screen, seating, and décor chosen for the occasion. Another booking does not enter during your slot.",
  },
  {
    q: "How long is a slot?",
    a: "Three hours. Morning begins at 10:30, afternoon at 1:30, evening at 5:00, and night at 8:30. The room is reset in the gap.",
  },
  {
    q: "Do I pay on this website?",
    a: "No. Reserving holds the hour in this browser and with the desk. You pay at the room, or arrange it when you call.",
  },
  {
    q: "Can I bring my own cake?",
    a: "Yes. You can also add Dada’s signature cake while booking. Candles are kept in every room.",
  },
  {
    q: "How many people can come?",
    a: "It depends on the room. Cake Alcove and Emerald Table hold 8. Red Screen holds 10. Balloon Room holds 12. The page will not let you book above that.",
  },
  {
    q: "What if I need to cancel?",
    a: "Open My bookings and release the hold. If you have already spoken to the desk, call them as well so the hour can go back on the board.",
  },
];

export const rules = [
  "The slot is three hours, including entry and the last photograph.",
  "Décor that marks the walls or ceiling is not allowed. The house décor is already in the room.",
  "Outside food is fine. Outside sound equipment is not needed — the room has its own.",
  "Smoke, sparklers, and confetti cannons stay outside. The house confetti, if you asked for it, is cleared by the host.",
  "The screen is for your group. A film you have the right to play is welcome.",
  "Children are welcome in every room when they are part of your guest count.",
];
