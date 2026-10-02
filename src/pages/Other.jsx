import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { PageIntro, useTitle } from "../components.jsx";
import { faqs, formatDate, formatINR, gallery, rules, services, steps, stories } from "../data.js";
import { useBooking } from "../store.jsx";

export function Privacy() {
  useTitle("Privacy");
  return (
    <div className="page">
      <PageIntro
        eyebrow="Privacy"
        title="What stays on this phone."
        lede="A Dada hold is kept on the device where you made it. The house does not collect those details on a server."
      />
      <div className="wrap prose">
        <h2>What you enter</h2>
        <p>
          To hold a room you give a name, a 10-digit mobile number, a date, an occasion, a guest count, and an optional note.
          The room, the Whitefield neighbourhood, the time slot, and any extras you add are stored with that hold.
        </p>
        <h2>Where it is kept</h2>
        <p>
          The hold is saved in this app, or in this browser if you used the website. It is not sent to Dada. Clearing the app
          data, or releasing the hold under My bookings, removes it from the device.
        </p>
        <h2>The desk</h2>
        <p>
          Book on call opens your phone’s dialler for 85559 09192. Payment is taken at the room, not in the app. The desk can
          answer a question about this page on that number, every day from 9:00 AM to 11:00 PM.
        </p>
        <h2>Photographs</h2>
        <p>Room photographs in the app are stock images standing in for the house. They are not pictures of guests.</p>
      </div>
    </div>
  );
}

export function Services() {
  useTitle("Services");
  return (
    <div className="page">
      <PageIntro
        eyebrow="Services"
        title="Everything that can be waiting in the room."
        lede="The screen and the seating are part of every booking. Cake, décor, food, and a photographer are added when you hold the hour."
      />
      <div className="wrap service-list">
        {services.map((service, index) => (
          <article key={service.title} className={index % 2 ? "flip" : ""}>
            <img src={service.image} alt={service.alt} />
            <div>
              <p className="eyebrow">0{index + 1}</p>
              <h2>{service.title}</h2>
              <p>{service.text}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

export function Gallery() {
  useTitle("Gallery");
  const tags = ["All", ...new Set(gallery.map((item) => item.tag))];
  const [tag, setTag] = useState("All");
  const shown = gallery.filter((item) => tag === "All" || item.tag === tag);

  return (
    <div className="page">
      <PageIntro
        eyebrow="Gallery"
        title="The moods the rooms are dressed in."
        lede="Screens, cakes, tables, and the small details that change with the occasion."
      />
      <div className="wrap">
        <div className="chips" role="group" aria-label="Filter gallery">
          {tags.map((item) => (
            <button key={item} type="button" className={item === tag ? "chip on" : "chip"} aria-pressed={item === tag} onClick={() => setTag(item)}>
              {item}
            </button>
          ))}
        </div>
        <div className="masonry">
          {shown.map((item) => (
            <figure key={item.src}>
              <img src={item.src} alt={item.alt} />
              <figcaption>{item.tag}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </div>
  );
}

export function Stories() {
  useTitle("Stories");
  return (
    <div className="page">
      <PageIntro
        eyebrow="Stories"
        title="Nights that stayed in the room."
        lede="A few gatherings at Dada, told after the lights came back up."
      />
      <div className="wrap story-list">
        {stories.map((story) => (
          <article key={story.slug}>
            <Link to={`/stories/${story.slug}`}>
              <img src={story.image} alt={story.alt} />
            </Link>
            <div>
              <p className="eyebrow">{story.occasion} · {story.place}</p>
              <h2>
                <Link to={`/stories/${story.slug}`}>{story.title}</Link>
              </h2>
              <p>{story.excerpt}</p>
              <Link className="text-link" to={`/stories/${story.slug}`}>
                Read
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

export function Story() {
  const { slug } = useParams();
  const story = stories.find((item) => item.slug === slug);
  useTitle(story ? story.title : "Story");
  if (!story) {
    return (
      <div className="wrap page">
        <h1>That story has left the journal.</h1>
        <Link className="text-link" to="/stories">All stories</Link>
      </div>
    );
  }
  return (
    <article className="page wrap story-article">
      <p className="eyebrow">{story.occasion} · {story.place}</p>
      <h1>{story.title}</h1>
      <img src={story.image} alt={story.alt} />
      {story.paragraphs.map((paragraph) => (
        <p key={paragraph}>{paragraph}</p>
      ))}
      <Link className="text-link" to="/stories">All stories</Link>
    </article>
  );
}

export function Learn() {
  useTitle("Learn");
  return (
    <div className="page">
      <PageIntro
        eyebrow="Learn"
        title="How the house keeps a night private."
        lede="A short guide to slots, payment, and what the room will and will not allow."
      />
      <div className="wrap learn-grid">
        <section id="how">
          <h2>How a night works</h2>
          <ol className="steps plain">
            {steps.map((step) => (
              <li key={step.n}>
                <span>{step.n}</span>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </li>
            ))}
          </ol>
        </section>
        <section id="questions">
          <h2>Questions</h2>
          <div className="faq-list">
            {faqs.map((item) => (
              <details key={item.q}>
                <summary>{item.q}</summary>
                <p>{item.a}</p>
              </details>
            ))}
          </div>
        </section>
        <section id="rules">
          <h2>House rules</h2>
          <ul className="rules">
            {rules.map((rule) => (
              <li key={rule}>{rule}</li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}

export function Bookings() {
  useTitle("My bookings");
  const { bookings, cancelBooking } = useBooking();
  const [pending, setPending] = useState(null);

  return (
    <div className="page">
      <PageIntro
        eyebrow="My bookings"
        title={bookings.length ? "Hours you are holding." : "No hours held yet."}
        lede="Holds live in this browser. Releasing one puts the hour back on the board."
      />
      <div className="wrap booking-list">
        {bookings.length === 0 && (
          <Link className="btn inline" to="/#reserve">
            Book a room
          </Link>
        )}
        {bookings.map((booking) => (
          <article key={booking.id} className="pass">
            <div>
              <p className="eyebrow">{booking.id}</p>
              <h2>{booking.roomName}</h2>
              <p>
                {booking.area}, {booking.city}
              </p>
              <p>
                {formatDate(booking.date)} · {booking.slotLabel}
              </p>
              <p>
                {booking.occasion} · {booking.guests} guests · {booking.name}
              </p>
              {booking.addons?.length > 0 && <p>Extras: {booking.addons.map((item) => item.name).join(", ")}</p>}
            </div>
            <div className="pass-side">
              <strong>{formatINR(booking.total)}</strong>
              <span>Pay at the room</span>
              {pending === booking.id ? (
                <div className="confirm-cancel">
                  <p>Release this hold?</p>
                  <button className="btn btn-small" type="button" onClick={() => { cancelBooking(booking.id); setPending(null); }}>
                    Release
                  </button>
                  <button className="btn btn-line btn-small" type="button" onClick={() => setPending(null)}>
                    Keep
                  </button>
                </div>
              ) : (
                <button className="text-link" type="button" onClick={() => setPending(booking.id)}>
                  Cancel hold
                </button>
              )}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

export function Booked() {
  const { id } = useParams();
  const { bookings } = useBooking();
  const booking = bookings.find((item) => item.id === id);
  useTitle(booking ? "Hold confirmed" : "Hold");

  if (!booking) {
    return (
      <div className="wrap page">
        <h1>That hold is not in this browser.</h1>
        <Link className="text-link" to="/bookings">My bookings</Link>
      </div>
    );
  }

  return (
    <div className="page wrap booked">
      <p className="eyebrow">Hold confirmed</p>
      <h1>The room is kept for you.</h1>
      <article className="pass pass-large">
        <div>
          <p className="eyebrow">Dada Celebration House</p>
          <h2>{booking.roomName}</h2>
          <p>
            {booking.area}, {booking.city}
          </p>
          <dl>
            <div><dt>When</dt><dd>{formatDate(booking.date)}</dd></div>
            <div><dt>Hour</dt><dd>{booking.slotLabel}</dd></div>
            <div><dt>For</dt><dd>{booking.occasion}</dd></div>
            <div><dt>Guests</dt><dd>{booking.guests}</dd></div>
            <div><dt>Name</dt><dd>{booking.name}</dd></div>
            <div><dt>Mobile</dt><dd>{booking.phone}</dd></div>
          </dl>
          {booking.note && <p className="note">“{booking.note}”</p>}
          {booking.addons?.length > 0 && (
            <ul>
              {booking.addons.map((item) => (
                <li key={item.id}>{item.name}</li>
              ))}
            </ul>
          )}
        </div>
        <div className="pass-side">
          <span>Reference</span>
          <strong className="code">{booking.id}</strong>
          <b>{formatINR(booking.total)}</b>
          <em>Pay at the room</em>
        </div>
      </article>
      <div className="booked-actions no-print">
        <button className="btn btn-line inline" type="button" onClick={() => window.print()}>
          Print this hold
        </button>
        <Link className="text-link" to="/bookings">
          All my bookings
        </Link>
      </div>
    </div>
  );
}

export function Missing() {
  useTitle("Not found");
  return (
    <div className="wrap page">
      <p className="eyebrow">404</p>
      <h1>This page is not in the house.</h1>
      <Link className="text-link" to="/">Return home</Link>
    </div>
  );
}
