import { createContext, useContext, useEffect, useMemo, useState } from "react";

const Ctx = createContext(null);
const KEY = "dada-bookings-v1";

function readBookings() {
  try {
    const parsed = JSON.parse(localStorage.getItem(KEY) || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function BookingProvider({ children }) {
  const [bookings, setBookings] = useState(readBookings);
  const [callOpen, setCallOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(bookings));
  }, [bookings]);

  const api = useMemo(
    () => ({
      bookings,
      callOpen,
      openCall: () => setCallOpen(true),
      closeCall: () => setCallOpen(false),
      addBooking(entry) {
        const id = `DADA-${Math.floor(1000 + Math.random() * 9000)}`;
        const next = { ...entry, id, createdAt: new Date().toISOString() };
        setBookings((prev) => [next, ...prev]);
        return next;
      },
      cancelBooking(id) {
        setBookings((prev) => prev.filter((item) => item.id !== id));
      },
      takenSlots(roomId, date) {
        return bookings.filter((item) => item.roomId === roomId && item.date === date).map((item) => item.slotId);
      },
    }),
    [bookings, callOpen],
  );

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}

export function useBooking() {
  return useContext(Ctx);
}
