import { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { CallDialog, Footer, Header } from "./components.jsx";
import { Booked, Bookings, Gallery, Learn, Missing, Privacy, Services, Stories, Story } from "./pages/Other.jsx";
import Home from "./pages/Home.jsx";
import Room from "./pages/Room.jsx";
import Rooms from "./pages/Rooms.jsx";

function ScrollReset() {
  const location = useLocation();
  useEffect(() => {
    if (location.hash) {
      const target = document.getElementById(location.hash.slice(1));
      if (target) {
        target.scrollIntoView();
        return;
      }
    }
    window.scrollTo(0, 0);
  }, [location.pathname, location.search, location.hash]);
  return null;
}

export default function App() {
  return (
    <>
      <ScrollReset />
      <Header />
      <a className="skip" href="#content">Skip to content</a>
      <main id="content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/rooms" element={<Rooms />} />
          <Route path="/rooms/:id" element={<Room />} />
          <Route path="/services" element={<Services />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/stories" element={<Stories />} />
          <Route path="/stories/:slug" element={<Story />} />
          <Route path="/learn" element={<Learn />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/bookings" element={<Bookings />} />
          <Route path="/booked/:id" element={<Booked />} />
          <Route path="*" element={<Missing />} />
        </Routes>
      </main>
      <Footer />
      <CallDialog />
    </>
  );
}
