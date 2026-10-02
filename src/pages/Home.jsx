import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Fields, RoomCard, useTitle } from "../components.jsx";
import { areasFor, cities, faqs, featured, maxISO, photo, rooms, services, steps, stories, todayISO } from "../data.js";
import { useBooking } from "../store.jsx";

const SEARCH_KEY = "dada-search";

function readSearch() {
  try {
    return JSON.parse(sessionStorage.getItem(SEARCH_KEY) || "{}");
  } catch {
    return {};
  }
}

export default function Home() {
  useTitle("");
  const navigate = useNavigate();
  const { openCall } = useBooking();
  const saved = readSearch();
  const houseCity = cities[0].name;
  const savedCity = cities.some((item) => item.name === saved.city) ? saved.city : houseCity;
  const savedAreas = areasFor(savedCity);
  const [city, setCity] = useState(savedCity);
  const [location, setLocation] = useState(
    savedAreas.includes(saved.location) ? saved.location : savedAreas.length === 1 ? savedAreas[0] : "",
  );
  const [date, setDate] = useState(saved.date || "");
  const [occasion, setOccasion] = useState(saved.occasion || "Birthday");
  const [errors, setErrors] = useState({});

  function onChange(partial) {
    if ("city" in partial) setCity(partial.city);
    if ("location" in partial) setLocation(partial.location);
    if ("date" in partial) setDate(partial.date);
    if ("occasion" in partial) setOccasion(partial.occasion);
    setErrors((prev) => {
      const next = { ...prev };
      Object.keys(partial).forEach((key) => delete next[key]);
      return next;
    });
  }

  function submit(event) {
    event.preventDefault();
    const next = {};
    if (!city) next.city = "Choose a city";
    if (!location) next.location = "Choose a location";
    if (!date) next.date = "Choose a date";
    else if (date < todayISO()) next.date = "Choose today or a later date";
    else if (date > maxISO()) next.date = "Bookings open up to 180 days ahead";
    setErrors(next);
    if (Object.keys(next).length) return;
    const payload = { city, location, date, occasion };
    sessionStorage.setItem(SEARCH_KEY, JSON.stringify(payload));
    const params = new URLSearchParams();
    Object.entries(payload).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    navigate(`/rooms?${params}`);
  }

  return (
    <>
      <section className="hero wrap">
        <div className="hero-copy">
          <p className="eyebrow">Private celebration house</p>
          <h1>A room of your own for the day that matters.</h1>
          <p className="lede">
            Book Dada for a birthday, an anniversary, a date night, a proposal, or any gathering that should not share a hall.
            One room. Your people. A screen, a table, and the door closed.
          </p>
          <blockquote className="pull">
            Dada is what you call the person who gathers everyone. The house is named for that role.
          </blockquote>
          <dl className="stats">
            <div>
              <dt>{rooms.length}</dt>
              <dd>private rooms</dd>
            </div>
            <div>
              <dt>{cities[0].areas[0]}</dt>
              <dd>Bengaluru</dd>
            </div>
            <div>
              <dt>3 hr</dt>
              <dd>every slot</dd>
            </div>
          </dl>
        </div>

        <div className="hero-panel" id="reserve">
          <div className="hero-photos">
            <img src={photo("screen.jpg")} alt="Private cinema seats in deep red" />
            <img src={photo("balloons.jpg")} alt="Balloons arranged for a birthday" />
          </div>
          <form className="ticket" onSubmit={submit} noValidate>
            <div className="ticket-top">
              <p className="eyebrow">Reserve a room</p>
              <h2>When should Dada hold the night?</h2>
            </div>
            <Fields city={city} location={location} date={date} occasion={occasion} errors={errors} onChange={onChange} />
            <button className="btn" type="submit">
              Book now
            </button>
            <button className="btn btn-line call-btn" type="button" onClick={openCall}>
              <PhoneIcon /> Book on call
            </button>
            <p className="fine center">Pay at the room. The desk confirms the hour.</p>
          </form>
        </div>
      </section>

      <section className="section wrap">
        <div className="section-head">
          <div>
            <p className="eyebrow">The house rooms</p>
            <h2>Four ways the room can feel.</h2>
          </div>
          <Link className="text-link" to="/rooms?city=Bengaluru&location=Whitefield">
            Browse Whitefield
          </Link>
        </div>
        <div className="room-grid two">
          {featured.map((room) => (
            <RoomCard key={room.id} room={room} date="" occasion="Birthday" />
          ))}
        </div>
      </section>

      <section className="section wrap">
        <div className="section-head">
          <div>
            <p className="eyebrow">Occasions</p>
            <h2>Name the reason. The room follows.</h2>
          </div>
        </div>
        <div className="occasion-grid">
          {[
            ["Birthday", "Cake, colour, and a screen for the year in pictures.", photo("cake.jpg")],
            ["Anniversary", "A table, a second song, and no neighbouring party.", photo("salon.jpg")],
            ["Date night", "Low light, two seats or eight, the door shut.", photo("rose.jpg")],
            ["Proposal", "A line on the opening frame, then the rest of the hour.", photo("screen.jpg")],
            ["Farewell", "Enough room for the speech and the people who mean it.", photo("cheers.jpg")],
            ["Family gathering", "A private table so the evening stays in the family.", photo("gathering.jpg")],
          ].map(([name, text, image]) => (
            <Link key={name} className="occasion-card" to={`/rooms?occasion=${encodeURIComponent(name)}`}>
              <img src={image} alt="" />
              <span>
                <strong>{name}</strong>
                <em>{text}</em>
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="section band">
        <div className="wrap">
          <p className="eyebrow light">How a Dada night works</p>
          <ol className="steps">
            {steps.map((step) => (
              <li key={step.n}>
                <span>{step.n}</span>
                <h2>{step.title}</h2>
                <p>{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section wrap story-tease">
        <img src={stories[0].image} alt={stories[0].alt} />
        <div>
          <p className="eyebrow">From the house journal</p>
          <h2>{stories[0].title}</h2>
          <p className="lede">{stories[0].excerpt}</p>
          <Link className="text-link" to={`/stories/${stories[0].slug}`}>
            Read the night
          </Link>
        </div>
      </section>

      <section className="section wrap">
        <div className="section-head">
          <div>
            <p className="eyebrow">In the room</p>
            <h2>What the booking can include.</h2>
          </div>
          <Link className="text-link" to="/services">
            All services
          </Link>
        </div>
        <div className="service-row">
          {services.slice(0, 3).map((service) => (
            <article key={service.title}>
              <img src={service.image} alt={service.alt} />
              <h3>{service.title}</h3>
              <p>{service.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section wrap">
        <div className="section-head">
          <div>
            <p className="eyebrow">Whitefield</p>
            <h2>Every room is in Whitefield.</h2>
          </div>
          <Link className="text-link" to="/rooms?city=Bengaluru&location=Whitefield">
            See the rooms
          </Link>
        </div>
      </section>

      <section className="section wrap faq-tease">
        <div>
          <p className="eyebrow">Before you book</p>
          <h2>A few practical answers.</h2>
          <Link className="text-link" to="/learn#questions">
            All questions
          </Link>
        </div>
        <div className="faq-list">
          {faqs.slice(0, 3).map((item) => (
            <details key={item.q}>
              <summary>{item.q}</summary>
              <p>{item.a}</p>
            </details>
          ))}
        </div>
      </section>
    </>
  );
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="phone-icon">
      <path
        d="M7 3.5h3.2l1.2 3.2-2 1.2a12.5 12.5 0 0 0 6.7 6.7l1.2-2 3.2 1.2V17a2 2 0 0 1-2.2 2A15.5 15.5 0 0 1 5 5.7 2 2 0 0 1 7 3.5Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
      />
    </svg>
  );
}
