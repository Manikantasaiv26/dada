import { useEffect, useId, useRef, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { areasFor, cities, formatDate, formatINR, maxISO, occasions, PHONE_DISPLAY, PHONE_TEL, slotsFor, todayISO } from "./data.js";
import { useBooking } from "./store.jsx";

export function useTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} · Dada` : "Dada — Private rooms for birthdays and gatherings";
  }, [title]);
}

function DoorMark() {
  return (
    <svg className="mark" viewBox="0 0 32 32" aria-hidden="true">
      <path d="M7 27V14C7 7.5 25 7.5 25 14V27" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path d="M16 27V16" stroke="#e25b2a" strokeWidth="1.8" />
    </svg>
  );
}

export function Header() {
  const { bookings, openCall } = useBooking();
  const location = useLocation();
  const [open, setOpen] = useState(null);
  const barRef = useRef(null);

  useEffect(() => {
    setOpen(null);
  }, [location.pathname, location.search]);

  useEffect(() => {
    function onPointer(event) {
      if (!barRef.current?.contains(event.target)) setOpen(null);
    }
    function onKey(event) {
      if (event.key === "Escape") setOpen(null);
    }
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  function reserve(event) {
    if (location.pathname === "/") {
      event.preventDefault();
      document.getElementById("reserve")?.scrollIntoView({ behavior: "smooth", block: "center" });
      setOpen(null);
    }
  }

  return (
    <header className="nav-bar" ref={barRef}>
      <div className="wrap nav">
        <Link to="/" className="brand">
          <DoorMark />
          <span>
            <strong>Dada</strong>
            <small>Celebration house</small>
          </span>
        </Link>

        <button
          className="nav-toggle"
          type="button"
          aria-expanded={open === "mobile"}
          aria-label={open === "mobile" ? "Close menu" : "Open menu"}
          onClick={() => setOpen(open === "mobile" ? null : "mobile")}
        >
          <span />
          <span />
        </button>

        <nav className={open === "mobile" ? "nav-links open" : "nav-links"}>
          <NavLink to="/" end>
            Home
          </NavLink>
          <NavLink to="/rooms?city=Bengaluru&location=Whitefield">Whitefield</NavLink>
          <NavLink to="/services">Services</NavLink>
          <NavLink to="/gallery">Gallery</NavLink>
          <NavLink to="/stories">Stories</NavLink>
          <div className={open === "learn" ? "drop on" : "drop"}>
            <button type="button" aria-expanded={open === "learn"} onClick={() => setOpen(open === "learn" ? null : "learn")}>
              Learn
              <Caret />
            </button>
            <div className="drop-panel" role="menu">
              <Link to="/learn#how">How a night works</Link>
              <Link to="/learn#questions">Questions</Link>
              <Link to="/learn#rules">House rules</Link>
            </div>
          </div>
          <NavLink to="/bookings" className="bookings-link">
            My bookings
            {bookings.length > 0 && <span className="count">{bookings.length}</span>}
          </NavLink>
          <div className="nav-actions">
            <button className="btn btn-line btn-small" type="button" onClick={openCall}>
              Book on call
            </button>
            <Link className="btn btn-small" to="/#reserve" onClick={reserve}>
              Book now
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}

function Caret() {
  return (
    <svg viewBox="0 0 12 8" aria-hidden="true" className="caret">
      <path d="M1 1.5 L6 6.5 L11 1.5" fill="none" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

export function Footer() {
  const { openCall } = useBooking();
  return (
    <footer className="footer">
      <div className="wrap footer-grid">
        <div>
          <p className="brand footer-brand">
            <DoorMark />
            <span>
              <strong>Dada</strong>
              <small>Celebration house</small>
            </span>
          </p>
          <p className="footer-lead">
            Private rooms for birthdays, anniversaries, date nights, proposals, and the gatherings in between.
          </p>
        </div>
        <div>
          <h2>Visit</h2>
          <ul>
            <li>
              <Link to="/rooms?city=Bengaluru&location=Whitefield">Whitefield</Link>
            </li>
          </ul>
        </div>
        <div>
          <h2>House</h2>
          <ul>
            <li><Link to="/services">Services</Link></li>
            <li><Link to="/gallery">Gallery</Link></li>
            <li><Link to="/stories">Stories</Link></li>
            <li><Link to="/learn">How it works</Link></li>
            <li><Link to="/bookings">My bookings</Link></li>
            <li><Link to="/privacy">Privacy</Link></li>
          </ul>
        </div>
        <div>
          <h2>Desk</h2>
          <p>Open 9:00 AM – 11:00 PM</p>
          <button className="text-link" type="button" onClick={openCall}>
            {PHONE_DISPLAY}
          </button>
          <p className="fine">Holds made here stay in this browser until you release them. Pay at the room.</p>
        </div>
      </div>
      <div className="wrap footer-base">
        <span>© {new Date().getFullYear()} Dada Celebration House</span>
        <span>Room photographs are stock images standing in for the house moods.</span>
      </div>
    </footer>
  );
}

export function CallDialog() {
  const { callOpen, closeCall } = useBooking();
  const ref = useRef(null);

  useEffect(() => {
    if (!callOpen) return undefined;
    const previous = document.activeElement;
    ref.current?.focus();
    function onKey(event) {
      if (event.key === "Escape") closeCall();
    }
    document.addEventListener("keydown", onKey);
    document.body.classList.add("lock");
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.classList.remove("lock");
      previous?.focus?.();
    };
  }, [callOpen, closeCall]);

  if (!callOpen) return null;

  return (
    <div className="modal-back" role="presentation" onMouseDown={closeCall}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="call-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <p className="eyebrow">House desk</p>
        <h2 id="call-title">Book on a call</h2>
        <p>
          Tell the desk the Whitefield room and the hour. They will check it and hold it while you decide.
        </p>
        <a className="phone" href={`tel:${PHONE_TEL}`}>
          {PHONE_DISPLAY}
        </a>
        <p className="fine">Open every day, 9:00 AM to 11:00 PM. Payment is taken at the room, not on the call.</p>
        <button ref={ref} className="btn" type="button" onClick={closeCall}>
          Close
        </button>
      </div>
    </div>
  );
}

export function Fields({ city, location, date, occasion, errors = {}, onChange, layout = "ticket" }) {
  const areas = areasFor(city);
  const cityId = useId();
  const areaId = useId();
  const dateId = useId();
  const occasionId = useId();

  function changeCity(value) {
    onChange({ city: value, location: "" });
  }

  const singleCity = cities.length === 1;
  const singleArea = areas.length === 1;

  return (
    <div className={layout === "bar" ? `fields fields-bar${singleCity ? " no-city" : ""}${singleArea ? " no-area" : ""}` : "fields"}>
      {layout === "ticket" && !singleCity && (
        <div className="city-line" role="group" aria-label="Cities">
          {cities.map((item) => (
            <button
              key={item.name}
              type="button"
              className={item.name === city ? "on" : ""}
              aria-pressed={item.name === city}
              onClick={() => changeCity(item.name)}
            >
              {item.name}
            </button>
          ))}
        </div>
      )}

      {!singleCity && (
        <label className="field" htmlFor={cityId}>
          <span>City</span>
          <select id={cityId} value={city} aria-invalid={Boolean(errors.city)} onChange={(event) => changeCity(event.target.value)}>
            <option value="">Select from {cities.length} cities</option>
            {cities.map((item) => (
              <option key={item.name} value={item.name}>
                {item.name}
              </option>
            ))}
          </select>
          {errors.city && <em className="field-error">{errors.city}</em>}
        </label>
      )}

      {!singleArea && (
        <label className="field" htmlFor={areaId}>
          <span>Location</span>
          <select
            id={areaId}
            value={location}
            disabled={!city}
            aria-invalid={Boolean(errors.location)}
            onChange={(event) => onChange({ location: event.target.value })}
          >
            <option value="">{city ? "Choose a location" : "Choose a city first"}</option>
            {areas.map((area) => (
              <option key={area} value={area}>
                {area}
              </option>
            ))}
          </select>
          {errors.location && <em className="field-error">{errors.location}</em>}
        </label>
      )}

      <label className="field" htmlFor={dateId}>
        <span>Date</span>
        <input
          id={dateId}
          type="date"
          value={date}
          min={todayISO()}
          max={maxISO()}
          aria-invalid={Boolean(errors.date)}
          onChange={(event) => onChange({ date: event.target.value })}
        />
        {layout !== "bar" && date && <em className="date-hint">{formatDate(date)}</em>}
        {errors.date && <em className="field-error">{errors.date}</em>}
      </label>

      {layout === "bar" ? (
        <label className="field" htmlFor={occasionId}>
          <span>Occasion</span>
          <select id={occasionId} value={occasion} onChange={(event) => onChange({ occasion: event.target.value })}>
            <option value="">Any occasion</option>
            {occasions.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>
      ) : (
        <div className="field">
          <span id={occasionId}>Occasion</span>
          <div className="chips" role="group" aria-labelledby={occasionId}>
            {occasions.map((item) => (
              <button
                key={item}
                type="button"
                className={item === occasion ? "chip on" : "chip"}
                aria-pressed={item === occasion}
                onClick={() => onChange({ occasion: item === occasion ? "" : item })}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function RoomCard({ room, date, occasion }) {
  const navigate = useNavigate();
  const { takenSlots } = useBooking();
  const slots = slotsFor(room, date, date ? takenSlots(room.id, date) : []);
  const query = new URLSearchParams();
  if (date) query.set("date", date);
  if (occasion) query.set("occasion", occasion);
  const base = `/rooms/${room.id}${query.toString() ? `?${query}` : ""}`;

  function openSlot(slotId) {
    const next = new URLSearchParams(query);
    next.set("slot", slotId);
    navigate(`/rooms/${room.id}?${next}`);
  }

  return (
    <article className="room-card">
      <Link to={base} className="room-photo">
        <img src={room.images[0]} alt={room.imageAlt} />
        <span>{room.screen}</span>
      </Link>
      <div className="room-body">
        <div className="room-title">
          <h3>
            <Link to={base}>{room.name}</Link>
          </h3>
          <p>
            {room.area}, {room.city}
          </p>
          {occasion && room.bestFor.includes(occasion) && <p className="fit-flag">Suited to {occasion.toLowerCase()}</p>}
        </div>
        <p className="room-line">{room.line}</p>
        <p className="room-meta">
          <span>Fits {room.capacity}</span>
          <span>From {formatINR(room.base)}</span>
        </p>
        <div className="slot-row" aria-label={`Hours for ${room.name}`}>
          {(slots || []).map((slot) => (
            <button key={slot.id} type="button" className="slot" disabled={slot.held} onClick={() => openSlot(slot.id)}>
              <strong>{slot.held ? "Held" : slot.label}</strong>
              <small>{slot.held ? "Unavailable" : formatINR(slot.price)}</small>
            </button>
          ))}
        </div>
        <Link className="text-link" to={base}>
          See this room
        </Link>
      </div>
    </article>
  );
}

export function PageIntro({ eyebrow, title, lede }) {
  return (
    <header className="page-intro wrap">
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h1>{title}</h1>
      {lede && <p className="lede">{lede}</p>}
    </header>
  );
}
