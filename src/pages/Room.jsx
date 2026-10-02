import { useEffect, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useTitle } from "../components.jsx";
import { addons, formatDate, formatINR, getRoom, maxISO, slotsFor, todayISO } from "../data.js";
import { useBooking } from "../store.jsx";

export default function Room() {
  const { id } = useParams();
  const room = getRoom(id);
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const { addBooking, takenSlots, openCall } = useBooking();
  const date = params.get("date") || "";
  const occasion = params.get("occasion") || "Birthday";
  const [photo, setPhoto] = useState(0);
  const [slot, setSlot] = useState(params.get("slot") || "");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [guests, setGuests] = useState(4);
  const [note, setNote] = useState("");
  const [pickedAddons, setPickedAddons] = useState([]);
  const [errors, setErrors] = useState({});

  useTitle(room ? room.name : "Room");

  const taken = room && date ? takenSlots(room.id, date) : [];
  const slots = room ? slotsFor(room, date, taken) : [];

  useEffect(() => {
    const requested = params.get("slot");
    if (requested && slots.some((item) => item.id === requested && !item.held)) setSlot(requested);
  }, [date, id]);

  if (!room) {
    return (
      <div className="wrap page">
        <h1>That room is not on the board.</h1>
        <Link className="text-link" to="/rooms">
          Back to rooms
        </Link>
      </div>
    );
  }

  const chosen = slots.find((item) => item.id === slot);
  const addonTotal = addons.filter((item) => pickedAddons.includes(item.id)).reduce((sum, item) => sum + item.price, 0);
  const total = (chosen?.price || room.base) + addonTotal;

  function setDate(value) {
    const next = new URLSearchParams(params);
    if (value) next.set("date", value);
    else next.delete("date");
    next.delete("slot");
    setSlot("");
    setParams(next, { replace: true });
  }

  function toggleAddon(addonId) {
    setPickedAddons((current) =>
      current.includes(addonId) ? current.filter((item) => item !== addonId) : [...current, addonId],
    );
  }

  function submit(event) {
    event.preventDefault();
    const next = {};
    if (!date) next.date = "Choose a date";
    else if (date < todayISO()) next.date = "Choose today or a later date";
    else if (date > maxISO()) next.date = "Bookings open up to 180 days ahead";
    if (!chosen || chosen.held) next.slot = "Choose an open hour";
    if (name.trim().length < 2) next.name = "Add the name for the booking";
    if (!/^[6-9]\d{9}$/.test(phone)) next.phone = "Enter a 10-digit mobile number";
    const count = Number(guests);
    if (!count || count < 1) next.guests = "Add the number of guests";
    else if (count > room.capacity) next.guests = `This room holds ${room.capacity}`;
    setErrors(next);
    if (Object.keys(next).length) return;

    const selectedAddons = addons.filter((item) => pickedAddons.includes(item.id));
    const booking = addBooking({
      roomId: room.id,
      roomName: room.name,
      city: room.city,
      area: room.area,
      image: room.images[0],
      date,
      slotId: chosen.id,
      slotLabel: `${chosen.label} – ${chosen.ends}`,
      occasion: occasion || "Celebration",
      guests: count,
      name: name.trim(),
      phone,
      note: note.trim(),
      addons: selectedAddons,
      total: chosen.price + selectedAddons.reduce((sum, item) => sum + item.price, 0),
    });
    navigate(`/booked/${booking.id}`);
  }

  return (
    <div className="page wrap room-page">
      <p className="crumbs">
        <Link to="/">Home</Link>
        <span>/</span>
        <Link to={`/rooms?city=${encodeURIComponent(room.city)}`}>{room.city}</Link>
        <span>/</span>
        <Link to={`/rooms?city=${encodeURIComponent(room.city)}&location=${encodeURIComponent(room.area)}`}>{room.area}</Link>
      </p>

      <div className="room-layout">
        <div>
          <div className="gallery-main">
            <img src={room.images[photo]} alt={room.imageAlt} />
          </div>
          <div className="thumbs">
            {room.images.map((src, index) => (
              <button key={src} type="button" className={index === photo ? "on" : ""} onClick={() => setPhoto(index)} aria-label={`Photo ${index + 1}`}>
                <img src={src} alt="" />
              </button>
            ))}
          </div>

          <header className="room-heading">
            <p className="eyebrow">{room.area} · {room.city}</p>
            <h1>{room.name}</h1>
            <p className="lede">{room.line}</p>
          </header>

          <ul className="fact-row">
            <li><span>Fits</span><strong>{room.capacity} guests</strong></li>
            <li><span>Screen</span><strong>{room.screen}</strong></li>
            <li><span>Slot</span><strong>3 hours</strong></li>
            <li><span>From</span><strong>{formatINR(room.base)}</strong></li>
          </ul>

          <h2>In the room</h2>
          <ul className="include-list">
            {room.includes.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="best-for">Suited to {room.bestFor.join(", ")}.</p>
          <p>
            The host meets you at the door, points out the lights and the screen, and leaves the hour to you. Décor is set before arrival.
          </p>
        </div>

        <form className="reserve" onSubmit={submit} noValidate>
          <p className="eyebrow">Hold this room</p>
          <h2>{formatINR(total)}</h2>
          <p className="fine">{chosen ? "Selected hour plus extras." : "From the morning rate, before extras."}</p>

          <label className="field" htmlFor="room-date">
            <span>Date</span>
            <input id="room-date" type="date" value={date} min={todayISO()} max={maxISO()} aria-invalid={Boolean(errors.date)} onChange={(event) => setDate(event.target.value)} />
            {date && <em className="date-hint">{formatDate(date)}</em>}
            {errors.date && <em className="field-error">{errors.date}</em>}
          </label>

          <fieldset className="slot-pick">
            <legend>Hour</legend>
            {slots.map((item) => (
              <button
                key={item.id}
                type="button"
                className="slot"
                disabled={item.held}
                aria-pressed={slot === item.id}
                onClick={() => setSlot(item.id)}
              >
                <strong>{item.held ? "Held" : `${item.label} – ${item.ends}`}</strong>
                <small>{item.held ? "Unavailable" : formatINR(item.price)}</small>
              </button>
            ))}
            {errors.slot && <em className="field-error">{errors.slot}</em>}
          </fieldset>

          <label className="field" htmlFor="occasion">
            <span>Occasion</span>
            <select
              id="occasion"
              value={occasion}
              onChange={(event) => {
                const next = new URLSearchParams(params);
                next.set("occasion", event.target.value);
                setParams(next, { replace: true });
              }}
            >
              {["Birthday", "Anniversary", "Date night", "Proposal", "Farewell", "Family gathering"].map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>

          <fieldset className="addon-pick">
            <legend>Add to the room</legend>
            {addons.map((item) => (
              <label key={item.id} className={pickedAddons.includes(item.id) ? "addon on" : "addon"}>
                <input
                  type="checkbox"
                  checked={pickedAddons.includes(item.id)}
                  onChange={() => toggleAddon(item.id)}
                />
                <span>
                  <strong>{item.name}</strong>
                  <em>{item.detail}</em>
                </span>
                <b>{formatINR(item.price)}</b>
              </label>
            ))}
          </fieldset>

          <label className="field" htmlFor="guest-name">
            <span>Name</span>
            <input id="guest-name" value={name} autoComplete="name" maxLength={60} aria-invalid={Boolean(errors.name)} onChange={(event) => setName(event.target.value)} />
            {errors.name && <em className="field-error">{errors.name}</em>}
          </label>

          <div className="pair">
            <label className="field" htmlFor="guest-phone">
              <span>Mobile</span>
              <input
                id="guest-phone"
                inputMode="numeric"
                autoComplete="tel"
                placeholder="98XXXXXXXX"
                value={phone}
                aria-invalid={Boolean(errors.phone)}
                onChange={(event) => setPhone(event.target.value.replace(/\D/g, "").slice(0, 10))}
              />
              {errors.phone && <em className="field-error">{errors.phone}</em>}
            </label>
            <label className="field" htmlFor="guest-count">
              <span>Guests</span>
              <input
                id="guest-count"
                type="number"
                min="1"
                max={room.capacity}
                value={guests}
                aria-invalid={Boolean(errors.guests)}
                onChange={(event) => setGuests(event.target.value)}
              />
              {errors.guests && <em className="field-error">{errors.guests}</em>}
            </label>
          </div>

          <label className="field" htmlFor="guest-note">
            <span>Note for the host</span>
            <textarea id="guest-note" maxLength={240} value={note} onChange={(event) => setNote(event.target.value)} placeholder="Name on the cake, a song, a colour." />
          </label>

          <button className="btn" type="submit">
            Confirm this hold
          </button>
          <button className="btn btn-line call-btn" type="button" onClick={openCall}>
            Book on call
          </button>
          <p className="fine">No payment on this page. You pay at the room after the desk confirms.</p>
        </form>
      </div>
    </div>
  );
}
