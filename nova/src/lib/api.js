// src/lib/api.js

// Support Vite and CRA; strip trailing slashes just in case
const API_BASE = (
  typeof import.meta !== "undefined" && import.meta.env && import.meta.env.VITE_API_BASE
    ? import.meta.env.VITE_API_BASE
    : process.env.REACT_APP_API_BASE || "http://localhost:8800"
).replace(/\/+$/, "");

const ENDPOINT = {
  rooms: "accomodation", // keep spelling to match backend route/table
  jobs: "jobs",
  rides: "rides",
};

function toImageUrl(v) {
  if (!v) return "/placeholder.png";                 // served by FRONTEND
  if (/^https?:\/\//i.test(v)) return v;             // already absolute
  const base = API_BASE.replace(/\/+$/, "");
  const cleaned = String(v).replace(/^\/+/, "").replace(/^uploads[\\/]/i, "");
  return `${base}/uploads/${cleaned}`;               // real uploaded files
}

export async function fetchList(kind = "rooms") {
  const ep = ENDPOINT[kind] || ENDPOINT.rooms;
  const res = await fetch(`${API_BASE}/${ep}`);
  if (!res.ok) throw new Error(`Failed to load ${kind}`);
  const data = await res.json();

  return (Array.isArray(data) ? data : []).map((it) => ({
    id: it.id,
    image: toImageUrl(it.photos || it.image),
    title: it.title || "",
    desc: it.descriptions || it.desc || "",
    price: it.price ?? 0,
    location: it.locations || it.location || "",
    contact_email: it.contact_email || "",
    created_at: it.created_time || it.created_at || null,
  }));
}

// Create a new item for a kind ('rooms' | 'jobs' | 'rides')
// values: { title, descriptions, locations, price, contact_email, photo?: File }
export async function createItem(kind, values) {
  const ep = ENDPOINT[kind] || ENDPOINT.rooms;
  const fd = new FormData();
  Object.entries(values).forEach(([k, v]) => {
    if (v !== undefined && v !== null) fd.append(k, v);
  });
  const res = await fetch(`${API_BASE}/${ep}`, { method: "POST", body: fd });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Create failed");
  return data; // { id, ... }
}
