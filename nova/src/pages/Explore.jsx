// src/pages/Explore.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./cards.css";

// Map route param → title labels
const TITLES = { rooms: "Rooms", jobs: "Jobs", rides: "Rides" };
const PRICE_LABEL = { rooms: "Price", jobs: "Salary", rides: "Fare" };

// Use environment variable (from Vercel or .env.local)
// fallback to localhost for dev
const API_BASE =
  process.env.REACT_APP_API_URL?.replace(/\/+$/, "") ||
  "https://novascotiaale.onrender.com";

// Convert backend row → UI-friendly object
function normalize(raw) {
  const title = raw.title ?? raw.name ?? "Untitled";
  const desc = raw.desc ?? raw.descriptions ?? raw.description ?? "";
  const price = raw.price ?? raw.salary ?? raw.fare ?? 0;
  const location = raw.location ?? raw.locations ?? "";
  const contact_email = raw.contact_email ?? raw.email ?? "";

  const rawImage =
    raw.photos ?? raw.image ?? raw.image_url ?? raw.photo ?? raw.img ?? "";

  const imgSrc = (() => {
    if (!rawImage) return "/placeholder.png"; // must exist in /public
    if (/^https?:\/\//i.test(rawImage)) return rawImage;
    const cleaned = String(rawImage).replace(/^\/+/, "");
    const withoutPrefix = cleaned.replace(/^uploads[\\/]/i, "");
    return `${API_BASE}/uploads/${withoutPrefix}`;
  })();

  return { id: raw.id, title, desc, price, location, contact_email, imgSrc };
}

export default function Explore() {
  const { kind = "rooms" } = useParams();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const label = TITLES[kind] || "Explore";

  useEffect(() => {
    (async () => {
      setLoading(true);
      setErr("");
      try {
        // map "rooms" → "accomodation", otherwise use API path directly
        const endpoint =
          kind === "rooms" ? "accomodation" : kind === "jobs" ? "jobs" : "rides";

        const res = await fetch(`${API_BASE}/${endpoint}`);
        if (!res.ok) throw new Error(`Failed to fetch ${endpoint}`);
        const list = await res.json();
        setItems(Array.isArray(list) ? list.map(normalize) : []);
      } catch (e) {
        setErr(e.message || "Failed to load");
        setItems([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [kind]);

  return (
    <div className="container py-5">
      <h2 className="mb-4">{label}</h2>

      {loading && <div>Loading…</div>}
      {!loading && err && <div style={{ color: "crimson" }}>{err}</div>}
      {!loading && !err && items.length === 0 && (
        <div>No {label.toLowerCase()} found.</div>
      )}

      <div className="cards-grid">
        {items.map((it) => (
          <article className="square" key={it.id}>
            <img
              src={it.imgSrc}
              alt={it.title}
              className="mask"
              loading="lazy"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = "/placeholder.png";
              }}
            />
            <div className="h1">{it.title}</div>
            <p>{it.desc}</p>
            <div className="meta">
              {PRICE_LABEL[kind]}:{" "}
              <strong>${Number(it.price || 0).toFixed(2)}</strong>
              {it.location ? <> • {it.location}</> : null}
              {it.contact_email ? <> • {it.contact_email}</> : null}
            </div>
            <a href="#" className="button">
              Read More
            </a>
          </article>
        ))}
      </div>
    </div>
  );
}
