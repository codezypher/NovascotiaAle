import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Alert from "react-bootstrap/Alert";
import "../components/AlertFade.css";
import HomeCarousel from "../components/HomeCarousel";

function Index() {
  // ✅ STATE
  const [form, setForm] = useState({
    title: "",
    descriptions: "",
    locations: "",
    price: "",
    contact_email: "",
  });

  const [fade, setFade] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [status, setStatus] = useState({ message: "", variant: "" });
  const [activeTab, setActiveTab] = useState("accomodation");

  // ✅ Auth token
  const token = localStorage.getItem("token");

  // ✅ UPDATE ON TYPING
  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  useEffect(() => {
    if (!status.message) return;
    setFade(true);
    const t1 = setTimeout(() => setFade(false), 2500);
    const t2 = setTimeout(() => setStatus({ message: "", variant: "" }), 3000);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [status.message]);

  // ✅ SUBMIT TO BACKEND (text + file)
  const onSubmit = async (e) => {
    e.preventDefault();
    setStatus({ message: "Posting...", variant: "info" });

    try {
      const API_BASE =
        (process.env.REACT_APP_API_URL || "http://localhost:8800").replace(/\/+$/, "");

      const endpoint =
        activeTab === "accomodation"
          ? `${API_BASE}/accomodation`
          : activeTab === "jobs"
          ? `${API_BASE}/jobs`
          : `${API_BASE}/rides`;

      const fd = new FormData();
      fd.append("title", form.title);
      fd.append("descriptions", form.descriptions);
      fd.append("locations", form.locations);
      fd.append("price", form.price);
      fd.append("contact_email", form.contact_email);
      if (photo) fd.append("photo", photo);

      const headers = {};
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const res = await fetch(endpoint, { method: "POST", headers, body: fd });
      const data = await res.json();

      if (res.ok) {
        const label = activeTab[0].toUpperCase() + activeTab.slice(1);
        setStatus({
          message: `${label} saved ✅ (id ${data.id})`,
          variant: "success",
        });

        setForm({
          title: "",
          descriptions: "",
          locations: "",
          price: "",
          contact_email: "",
        });
        setPhoto(null);
      } else {
        setStatus({
          message: data.error || "Failed to post",
          variant: "danger",
        });
      }
    } catch (err) {
      setStatus({ message: err.message, variant: "danger" });
    }
  };

  return (
    <div>
      {/* Header + Carousel */}
      <div className="super_container">
        <div className="home">
          <div className="home_slider_container">
            <HomeCarousel />
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="search">
        <div className="container fill_height">
          <div className="row fill_height">
            <div className="col fill_height">
              <div className="search_tabs_container">
                <div className="search_tabs d-flex flex-lg-row flex-column">
                  <div
                    role="button"
                    className={`search_tab ${activeTab === "accomodation" ? "active" : ""}`}
                    onClick={() => setActiveTab("accomodation")}
                  >
                    🏠 Accomodation
                  </div>
                  <div
                    role="button"
                    className={`search_tab ${activeTab === "jobs" ? "active" : ""}`}
                    onClick={() => setActiveTab("jobs")}
                  >
                    💼 Jobs
                  </div>
                  <div
                    role="button"
                    className={`search_tab ${activeTab === "rides" ? "active" : ""}`}
                    onClick={() => setActiveTab("rides")}
                  >
                    🚗 Rides
                  </div>
                </div>
              </div>

              {status.message && (
                <Alert
                  variant={status.variant}
                  className={`mt-3 fade-alert ${fade ? "show" : "hide"}`}
                >
                  {status.message}
                </Alert>
              )}

              {/* POST FORM */}
              <div className="search_panel active">
                <form onSubmit={onSubmit} className="search_panel_content row">
                  <div className="col-lg-4">
                    <div className="search_item">
                      <div>Title</div>
                      <input
                        name="title"
                        value={form.title}
                        onChange={onChange}
                        type="text"
                        className="search_input"
                        required
                      />
                    </div>
                  </div>

                  <div className="col-lg-4">
                    <div className="search_item">
                      <div>Description</div>
                      <input
                        name="descriptions"
                        value={form.descriptions}
                        onChange={onChange}
                        type="text"
                        className="search_input"
                        required
                      />
                    </div>
                  </div>

                  <div className="col-lg-4">
                    <div className="search_item">
                      <div>Location</div>
                      <input
                        name="locations"
                        value={form.locations}
                        onChange={onChange}
                        type="text"
                        className="search_input"
                        required
                      />
                    </div>
                  </div>

                  <div className="col-lg-4 mt-2">
                    <div className="search_item">
                      <div>{activeTab === "jobs" ? "Salary" : activeTab === "rides" ? "Fare" : "Price"}</div>
                      <input
                        name="price"
                        value={form.price}
                        onChange={onChange}
                        type="number"
                        className="search_input"
                        required
                      />
                    </div>
                  </div>

                  <div className="col-lg-4 mt-2">
                    <div className="search_item">
                      <div>File</div>
                      <input
                        type="file"
                        accept="image/*"
                        className="search_input"
                        onChange={(e) => setPhoto(e.target.files?.[0] || null)}
                      />
                    </div>
                  </div>

                  <div className="col-lg-4 mt-2">
                    <div className="search_item">
                      <div>Contact Email</div>
                      <input
                        name="contact_email"
                        value={form.contact_email}
                        onChange={onChange}
                        type="email"
                        className="search_input"
                        required
                      />
                    </div>
                  </div>

                  <div className="col-lg-12 mt-2" style={{ display: "flex", justifyContent: "end" }}>
                    <button className="button search_button" type="submit">
                      Post <span />
                      <span />
                      <span />
                    </button>
                  </div>
                </form>
              </div>

              {!token && (
                <div className="alert alert-warning mt-3">
                  ⚠️ You are posting without logging in. Your post will still appear,
                  but it won’t be linked to your account.{" "}
                  <Link to="/login" className="ms-2">Login</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ✅ KEEPING YOUR ORIGINAL INTRO, TESTIMONIALS, TRENDING, CONTACT SECTIONS */}
      {/* Paste all your previous frontend sections here unchanged */}
      {/* intro ... */}
      {/* testimonials ... */}
      {/* trending ... */}
      {/* contact ... */}

    </div>
  );
}

export default Index;
