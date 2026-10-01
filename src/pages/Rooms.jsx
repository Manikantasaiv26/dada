import { Link, useSearchParams } from "react-router-dom";
import { Fields, RoomCard, useTitle } from "../components.jsx";
import { areasFor, cities, filterRooms, formatDate } from "../data.js";

export default function Rooms() {
  const [params, setParams] = useSearchParams();
  const city = params.get("city") || "";
  const location = params.get("location") || "";
  const date = params.get("date") || "";
  const occasion = params.get("occasion") || "";

  useTitle(location ? `Rooms in ${location}` : city ? `Rooms in ${city}` : "Choose a city");

  function onChange(partial) {
    const next = new URLSearchParams(params);
    if ("city" in partial) {
      if (partial.city) next.set("city", partial.city);
      else next.delete("city");
      next.delete("location");
    }
    ["location", "date", "occasion"].forEach((key) => {
      if (!(key in partial)) return;
      if (partial[key]) next.set(key, partial[key]);
      else next.delete(key);
    });
    sessionStorage.setItem(
      "dada-search",
      JSON.stringify({
        city: next.get("city") || "",
        location: next.get("location") || "",
        date: next.get("date") || "",
        occasion: next.get("occasion") || "",
      }),
    );
    setParams(next);
  }

  const list = city ? filterRooms({ city, location, occasion }) : [];
  const siblings = city ? areasFor(city).filter((area) => area !== location) : [];

  function cityHref(name) {
    const next = new URLSearchParams(params);
    next.set("city", name);
    next.delete("location");
    return `/rooms?${next}`;
  }

  let heading = "Choose a city";
  let note = "Dada keeps rooms in nine cities. Pick one to see what is open.";
  if (location) {
    heading = `${list.length} private ${list.length === 1 ? "room" : "rooms"} in ${location}`;
    note = `${city}${date ? ` · ${formatDate(date)}` : ""}${occasion ? ` · rooms for a ${occasion.toLowerCase()} are listed first` : ""}`;
  } else if (city) {
    heading = `${list.length} private ${list.length === 1 ? "room" : "rooms"} in ${city}`;
    note = occasion ? `Rooms for a ${occasion.toLowerCase()} are listed first.` : "Every neighbourhood in the city is listed together.";
  } else if (occasion) {
    heading = `Rooms for a ${occasion.toLowerCase()}`;
    note = "Choose the city your people can reach.";
  }

  return (
    <div className="page">
      <div className="wrap">
        <form className="finder" onSubmit={(event) => event.preventDefault()}>
          <Fields layout="bar" city={city} location={location} date={date} occasion={occasion} onChange={onChange} />
        </form>

        <header className="results-head">
          <div>
            <p className="eyebrow">Rooms</p>
            <h1>{heading}</h1>
            <p className="lede">{note}</p>
          </div>
        </header>

        {!city && (
          <div className="city-grid">
            {cities.map((item, index) => (
              <Link key={item.name} to={cityHref(item.name)}>
                <span>0{index + 1}</span>
                <strong>{item.name}</strong>
                <em>{item.areas.join(" · ")}</em>
              </Link>
            ))}
          </div>
        )}

        {list.length > 0 && (
          <div className="room-grid">
            {list.map((room) => (
              <RoomCard key={room.id} room={room} date={date} occasion={occasion} />
            ))}
          </div>
        )}

        {city && list.length === 0 && (
          <p className="empty">
            Nothing matches that combination. Try another location, or clear the occasion to see every room.
          </p>
        )}

        {location && siblings.length > 0 && (
          <p className="elsewhere">
            Other neighbourhoods in {city}:{" "}
            {siblings.map((area, index) => {
              const next = new URLSearchParams(params);
              next.set("location", area);
              return (
                <span key={area}>
                  {index > 0 && " · "}
                  <Link to={`/rooms?${next}`}>{area}</Link>
                </span>
              );
            })}
          </p>
        )}
      </div>
    </div>
  );
}
