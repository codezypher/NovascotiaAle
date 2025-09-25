import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Alert from "react-bootstrap/Alert";
import "../components/AlertFade.css";
import HomeCarousel from "../components/HomeCarousel";
import ReactDOM from "react-dom/client";


 
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
  // valid: "accomodation" | "jobs" | "rides"

  // ✅ UPDATE ON TYPING
  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  useEffect(() => {
    if (!status.message) return;

    // show immediately
    setFade(true);

    // start fade-out a bit before we clear the message
    const t1 = setTimeout(() => setFade(false), 2500); // start fading at 2.5s
    const t2 = setTimeout(
      () => setStatus({ message: "", variant: "" }),
      3000 // fully cleared at 3s
    );

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
      // Use env var for production, fallback to localhost for dev
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

      const res = await fetch(endpoint, { method: "POST", body: fd });
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
      {/*header*/}
      <div className="super_container">
        {/*Header */}
        <div className="menu trans_500">
          <div className="menu_content d-flex flex-column align-items-center justify-content-center text-center">
            <div className="menu_close_container">
              <div className="menu_close" />
            </div>
            <div className="logo menu_logo">
              <Link to="/">
                <img src="/assets/images/logo.png" alt="Logo" />
              </Link>
            </div>
            <ul>
              <li className="menu_item">
                <a href="/">home</a>
              </li>
              <li className="menu_item">
                <a href="about.html">about us</a>
              </li>
              <li className="menu_item">
                <a href="offers.html">offers</a>
              </li>
              <li className="menu_item">
                <a href="blog.html">news</a>
              </li>
              <li className="menu_item">
                <a href="contact.html">contact</a>
              </li>
            </ul>
          </div>
        </div>
        {/*Home */}
        <div className="home">
          {"{"}/*Home Slider */{"}"}
          <div className="home_slider_container">
                <HomeCarousel />
            <div className="owl-carousel owl-theme home_slider">
              <div className="owl-item home_slider_item">
                <div
                  className="home_slider_background"
                  style={{
                    backgroundImage: "url(/assets/images/home_slider.jpg)",
                  }}
                />
                <div className="home_slider_content text-center">
                  <div
                    className="home_slider_content_inner"
                    data-animation-in="flipInX"
                    data-animation-out="animate-out fadeOut"
                  >
                    <h1>Find or Share </h1>
                    <h1>in Halifax</h1>
                    {/*
              <div className="button home_slider_button">
                <div className="button_bcg" />
                <a href="#">
                  explore now
                  <span />
                  <span />
                  <span />
                </a>
              </div>{" "}
  */}
                  </div>
                </div>
              </div>
              {/*Slider Item */}
              {/*
        <div className="owl-item home_slider_item">
          <div
            className="home_slider_background"
            style={{ backgroundImage: "url(assets/images/home_slider.jpg)" }}
          />
          <div className="home_slider_content text-center">
            <div
              className="home_slider_content_inner"
              data-animation-in="flipInX"
              data-animation-out="animate-out fadeOut"
            >
              <h1>discover</h1>
              <h1>the world</h1>
              <div className="button home_slider_button">
                <div className="button_bcg" />
                <a href="#">
                  explore now
                  <span />
                  <span />
                  <span />
                </a>
              </div>
            </div>
          </div>
        </div>
        {/*Slider Item*/}
              {/*
        <div className="owl-item home_slider_item">
          <div
            className="home_slider_background"
            style={{ backgroundImage: "url(assets/images/home_slider.jpg)" }}
          />
          <div className="home_slider_content text-center">
            <div
              className="home_slider_content_inner"
              data-animation-in="flipInX"
              data-animation-out="animate-out fadeOut"
            >
              <h1>discover</h1>
              <h1>the world</h1>
              <div className="button home_slider_button">
                <div className="button_bcg" />
                <a href="#">
                  explore now
                  <span />
                  <span />
                  <span />
                </a>
              </div>
            </div>
          </div>
</div>*/}
            </div>
            {/*Home Slider Nav - Prev */}
            <div className="home_slider_nav home_slider_prev">
              <svg
                version="1.1"
                id="Layer_2"
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                x="0px"
                y="0px"
                width="28px"
                height="33px"
                viewBox="0 0 28 33"
                enableBackground="new 0 0 28 33"
                xmlSpace="preserve"
              >
                <defs>
                  <linearGradient id="home_grad_prev">
                    <stop offset="0%" stopColor="#fa9e1b" />
                    <stop offset="100%" stopColor="#8d4fff" />
                  </linearGradient>
                </defs>
                <path
                  className="nav_path"
                  fill="#F3F6F9"
                  d="M19,0H9C4.029,0,0,4.029,0,9v15c0,4.971,4.029,9,9,9h10c4.97,0,9-4.029,9-9V9C28,4.029,23.97,0,19,0z
					M26,23.091C26,27.459,22.545,31,18.285,31H9.714C5.454,31,2,27.459,2,23.091V9.909C2,5.541,5.454,2,9.714,2h8.571
					C22.545,2,26,5.541,26,9.909V23.091z"
                />
                <polygon
                  className="nav_arrow"
                  fill="#F3F6F9"
                  points="15.044,22.222 16.377,20.888 12.374,16.885 16.377,12.882 15.044,11.55 9.708,16.885 11.04,18.219 
					11.042,18.219 "
                />
              </svg>
            </div>
            {/*Home Slider Nav - Next */}
            <div className="home_slider_nav home_slider_next">
              <svg
                version="1.1"
                id="Layer_3"
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                x="0px"
                y="0px"
                width="28px"
                height="33px"
                viewBox="0 0 28 33"
                enableBackground="new 0 0 28 33"
                xmlSpace="preserve"
              >
                <defs>
                  <linearGradient id="home_grad_next">
                    <stop offset="0%" stopColor="#fa9e1b" />
                    <stop offset="100%" stopColor="#8d4fff" />
                  </linearGradient>
                </defs>
                <path
                  className="nav_path"
                  fill="#F3F6F9"
                  d="M19,0H9C4.029,0,0,4.029,0,9v15c0,4.971,4.029,9,9,9h10c4.97,0,9-4.029,9-9V9C28,4.029,23.97,0,19,0z
				M26,23.091C26,27.459,22.545,31,18.285,31H9.714C5.454,31,2,27.459,2,23.091V9.909C2,5.541,5.454,2,9.714,2h8.571
				C22.545,2,26,5.541,26,9.909V23.091z"
                />
                <polygon
                  className="nav_arrow"
                  fill="#F3F6F9"
                  points="13.044,11.551 11.71,12.885 15.714,16.888 11.71,20.891 13.044,22.224 18.379,16.888 17.048,15.554 
				17.046,15.554 "
                />
              </svg>
            </div>
            {/*Home Slider Dots */}
            {/* <div className="home_slider_dots">
              <ul
                id="home_slider_custom_dots"
                className="home_slider_custom_dots"
              >
                <li className="home_slider_custom_dot active">
                  <div />
                  01.
                </li>
                <li className="home_slider_custom_dot">
                  <div />
                  02.
                </li>
                <li className="home_slider_custom_dot">
                  <div />
                  03.
                </li>
              </ul>
            </div> */}
          </div>
        </div>
      </div>
      {/*header*/}
      {/*search*/}

      <div className="search">
        {/* Search Contents */}
        <div className="container fill_height">
          <div className="row fill_height">
            <div className="col fill_height">
              {/* Search Tabs */}
              <div className="search_tabs_container">
                <div className="search_tabs d-flex flex-lg-row flex-column align-items-lg-center align-items-start justify-content-lg-between justify-content-start">
                  <div
                    role="button"
                    className={`search_tab d-flex flex-row align-items-center justify-content-lg-center justify-content-start ${
                      activeTab === "accomodation" ? "active" : ""
                    }`}
                    onClick={() => setActiveTab("accomodation")}
                    tabIndex={0}
                  >
                    <img src="images/suitcase.png" alt="" />
                    <span>Accomodation</span>
                  </div>

                  <div
                    role="button"
                    className={`search_tab d-flex flex-row align-items-center justify-content-lg-center justify-content-start ${
                      activeTab === "jobs" ? "active" : ""
                    }`}
                    onClick={() => setActiveTab("jobs")}
                    tabIndex={0}
                  >
                    <img src="images/cruise.png" alt="" />
                    Jobs
                  </div>

                  <div
                    role="button"
                    className={`search_tab d-flex flex-row align-items-center justify-content-lg-center justify-content-start ${
                      activeTab === "rides" ? "active" : ""
                    }`}
                    onClick={() => setActiveTab("rides")}
                    tabIndex={0}
                  >
                    <img src="images/diving.png" alt="" />
                    Rides
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
              {/* Search Panel */}
              {/* ACCOMMODATION PANEL */}
              <div
                className={`search_panel ${
                  activeTab === "accomodation" ? "active" : ""
                }`}
              >
                <form
                  onSubmit={onSubmit}
                  id="search_form_accomodation"
                  className="search_panel_content d-flex flex-lg-row flex-column align-items-lg-center align-items-start justify-content-start"
                >
                  <div className="row">
                    <div className="col-lg-4">
                      <div className="search_item">
                        <div>Title</div>
                        <input
                          name="title"
                          value={form.title}
                          onChange={onChange}
                          type="text"
                          className="destination search_input"
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
                          className="destination search_input"
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
                          className="destination search_input"
                          required
                        />
                      </div>
                    </div>

                    <div className="col-lg-4 mt-2">
                      <div className="search_item">
                        <div>Price</div>
                        <input
                          name="price"
                          value={form.price}
                          onChange={onChange}
                          type="number"
                          className="destination search_input"
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
                          className="destination search_input"
                          onChange={(e) =>
                            setPhoto(e.target.files?.[0] || null)
                          }
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
                          className="destination search_input"
                          required
                        />
                      </div>
                    </div>

                    <div className="col-lg-12 mt-2" style={{display:"flex",justifyContent:"end"}}>
                      <button className="button search_button" type="submit">
                        Post <span />
                        <span />
                        <span />
                      </button>
                      <div className="mt-2"></div>
                    </div>
                  </div>
                </form>
              </div>

              {/* JOBS PANEL */}
              <div
                className={`search_panel ${
                  activeTab === "jobs" ? "active" : ""
                }`}
              >
                <form
                  onSubmit={onSubmit}
                  id="search_form_jobs"
                  className="search_panel_content d-flex flex-lg-row flex-column align-items-lg-center align-items-start justify-content-start"
                >
                  <div className="row">
                    {/* same inputs, only the label text differs */}
                    <div className="col-lg-4">
                      <div className="search_item">
                        <div>Title</div>
                        <input
                          name="title"
                          value={form.title}
                          onChange={onChange}
                          type="text"
                          className="destination search_input"
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
                          className="destination search_input"
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
                          className="destination search_input"
                          required
                        />
                      </div>
                    </div>

                    <div className="col-lg-4 mt-2">
                      <div className="search_item">
                        <div>Salary</div>
                        <input
                          name="price"
                          value={form.price}
                          onChange={onChange}
                          type="number"
                          className="destination search_input"
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
                          className="destination search_input"
                          onChange={(e) =>
                            setPhoto(e.target.files?.[0] || null)
                          }
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
                          className="destination search_input"
                          required
                        />
                      </div>
                    </div>

                    <div className="col-lg-12 mt-2" style={{display:"flex",justifyContent:"end"}}>
                      <button className="button search_button" type="submit">
                        Post <span />
                        <span />
                        <span />
                      </button>
                      <div className="mt-2"></div>
                    </div>
                  </div>
                </form>
              </div>

              {/* RIDES PANEL */}
              <div
                className={`search_panel ${
                  activeTab === "rides" ? "active" : ""
                }`}
              >
                <form
                  onSubmit={onSubmit}
                  id="search_form_rides"
                  className="search_panel_content d-flex flex-lg-row flex-column align-items-lg-center align-items-start justify-content-start"
                >
                  <div className="row">
                    {/* same inputs, only the label text differs */}
                    <div className="col-lg-4">
                      <div className="search_item">
                        <div>Title</div>
                        <input
                          name="title"
                          value={form.title}
                          onChange={onChange}
                          type="text"
                          className="destination search_input"
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
                          className="destination search_input"
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
                          className="destination search_input"
                          required
                        />
                      </div>
                    </div>

                    <div className="col-lg-4 mt-2">
                      <div className="search_item">
                        <div>Fare</div>
                        <input
                          name="price"
                          value={form.price}
                          onChange={onChange}
                          type="number"
                          className="destination search_input"
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
                          className="destination search_input"
                          onChange={(e) =>
                            setPhoto(e.target.files?.[0] || null)
                          }
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
                          className="destination search_input"
                          required
                        />
                      </div>
                    </div>

                    <div className="col-lg-12 mt-2" style={{display:"flex",justifyContent:"end"}}>
                      <button className="button search_button" type="submit">
                        Post <span />
                        <span />
                        <span />
                      </button>
                      <div className="mt-2"></div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/*search*/}
      {/*intro*/}
      <div className="intro">
        <div className="container">
          <div className="row">
            <div className="col">
              <h2 className="intro_title text-center">
                Find Rooms, Jobs, and Rides
              </h2>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-10 offset-lg-1">
              <div className="intro_text text-center">
                <p>
                  Explore the best rooms, jobs, and rides available across
                  various provinces. Find what you need for your journey.
                </p>
              </div>
            </div>
          </div>
          <div className="row intro_items">
            {/* Room Item */}
            <div className="col-lg-4 intro_col">
              <div className="intro_item">
                <div className="intro_item_overlay" />
                <div
                  className="intro_item_background"
                  style={{ backgroundImage: "url(images/room.jpg)" }}
                />
                <div className="intro_item_content d-flex flex-column align-items-center justify-content-center">
                  <div className="intro_date">Available Now</div>
                  
                  <div className="intro_center text-center">
                    <h1>Find a Rooms</h1>
                    <div className="intro_price">From $500 per month</div>
                    <div className="rating rating_4">
                      <i className="fa fa-star" />
                      <i className="fa fa-star" />
                      <i className="fa fa-star" />
                      <i className="fa fa-star" />
                      <i className="fa fa-star" />
                    </div>
                  </div>
                  <div className="button intro_button mt-5">
                    <div className="button_bcg" />
                    <Link to="/explore/rooms">
                      Explore Rooms
                      <span /> <span /> <span />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            {/* Job Item */}
            <div className="col-lg-4 intro_col">
              <div className="intro_item">
                <div className="intro_item_overlay" />
                <div
                  className="intro_item_background"
                  style={{ backgroundImage: "url(images/job.jpg)" }}
                />
                <div className="intro_item_content d-flex flex-column align-items-center justify-content-center">
                  <div className="intro_date">Hiring Now</div>
                 
                  <div className="intro_center text-center">
                    <h1>Find a Job</h1>
                    <div className="intro_price">Various Roles</div>
                    <div className="rating rating_4">
                      <i className="fa fa-star" />
                      <i className="fa fa-star" />
                      <i className="fa fa-star" />
                      <i className="fa fa-star" />
                      <i className="fa fa-star" />
                    </div>
                  </div>
                   <div className="button intro_button mt-5">
                    <div className="button_bcg" />
                    <Link to="/explore/jobs">
                      Explore Jobs
                      <span /> <span /> <span />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            {/* Ride Item */}
            <div className="col-lg-4 intro_col">
              <div className="intro_item">
                <div className="intro_item_overlay" />
                <div
                  className="intro_item_background"
                  style={{ backgroundImage: "url(images/ride.jpg)" }}
                />
                <div className="intro_item_content d-flex flex-column align-items-center justify-content-center">
                  <div className="intro_date">Available Now</div>
                 
                  <div className="intro_center text-center">
                    <h1>Find a Ride</h1>
                    <div className="intro_price">Shared or Private</div>
                    <div className="rating rating_4">
                      <i className="fa fa-star" />
                      <i className="fa fa-star" />
                      <i className="fa fa-star" />
                      <i className="fa fa-star" />
                      <i className="fa fa-star" />
                    </div>
                  </div>
                   <div className="button intro_button mt-5">
                    <div className="button_bcg" />
                    <Link to="/explore/rides">
                      Explore Rides
                      <span /> <span /> <span />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/*intro*/}

      {/*Testimonials*/}
      <div className="testimonials">
        <div className="test_border" />
        <div className="container">
          <div className="row">
            <div className="col text-center">
              <h2 className="section_title">what our clients say about us</h2>
            </div>
          </div>
          <div className="row">
            <div className="col">
              {/* Testimonials Slider */}
              <div className="test_slider_container">
                <div className="owl-carousel owl-theme test_slider">
                  {/* Testimonial Item */}
                  <div className="owl-item">
                    <div className="test_item">
                      <div className="test_image">
                        <img
                          src="/assets/images/test_1.jpg"
                          alt="https://unsplash.com/@anniegray"
                        />
                      </div>
                      <div className="test_icon">
                        <img src="/assets/images/backpack.png" alt="" />
                      </div>
                      <div className="test_content_container">
                        <div className="test_content">
                          <div className="test_item_info">
                            <div className="test_name">carla smith</div>
                            <div className="test_date">May 24, 2017</div>
                          </div>
                          <div className="test_quote_title">
                            " Best holliday ever "
                          </div>
                          <p className="test_quote_text">
                            Nullam eu convallis tortor. Suspendisse potenti. In
                            faucibus massa arcu, vitae cursus mi hendrerit nec.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Testimonial Item */}
                  <div className="owl-item">
                    <div className="test_item">
                      <div className="test_image">
                        <img
                          src="/assets/images/test_2.jpg"
                          alt="https://unsplash.com/@tschax"
                        />
                      </div>
                      <div className="test_icon">
                        <img src="/assets/images/island_t.png" alt="" />
                      </div>
                      <div className="test_content_container">
                        <div className="test_content">
                          <div className="test_item_info">
                            <div className="test_name">carla smith</div>
                            <div className="test_date">May 24, 2017</div>
                          </div>
                          <div className="test_quote_title">
                            " Best holliday ever "
                          </div>
                          <p className="test_quote_text">
                            Nullam eu convallis tortor. Suspendisse potenti. In
                            faucibus massa arcu, vitae cursus mi hendrerit nec.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Testimonial Item */}
                  <div className="owl-item">
                    <div className="test_item">
                      <div className="test_image">
                        <img
                          src="/assets/images/test_3.jpg"
                          alt="https://unsplash.com/@seefromthesky"
                        />
                      </div>
                      <div className="test_icon">
                        <img src="/assets/images/kayak.png" alt="" />
                      </div>
                      <div className="test_content_container">
                        <div className="test_content">
                          <div className="test_item_info">
                            <div className="test_name">carla smith</div>
                            <div className="test_date">May 24, 2017</div>
                          </div>
                          <div className="test_quote_title">
                            " Best holliday ever "
                          </div>
                          <p className="test_quote_text">
                            Nullam eu convallis tortor. Suspendisse potenti. In
                            faucibus massa arcu, vitae cursus mi hendrerit nec.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Testimonial Item */}
                  <div className="owl-item">
                    <div className="test_item">
                      <div className="test_image">
                        <img src="/assets/images/test_2.jpg" alt="" />
                      </div>
                      <div className="test_icon">
                        <img src="/assets/images/island_t.png" alt="" />
                      </div>
                      <div className="test_content_container">
                        <div className="test_content">
                          <div className="test_item_info">
                            <div className="test_name">carla smith</div>
                            <div className="test_date">May 24, 2017</div>
                          </div>
                          <div className="test_quote_title">
                            " Best holliday ever "
                          </div>
                          <p className="test_quote_text">
                            Nullam eu convallis tortor. Suspendisse potenti. In
                            faucibus massa arcu, vitae cursus mi hendrerit nec.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Testimonial Item */}
                  <div className="owl-item">
                    <div className="test_item">
                      <div className="test_image">
                        <img src="/assets/images/test_1.jpg" alt="" />
                      </div>
                      <div className="test_icon">
                        <img src="/assets/images/backpack.png" alt="" />
                      </div>
                      <div className="test_content_container">
                        <div className="test_content">
                          <div className="test_item_info">
                            <div className="test_name">carla smith</div>
                            <div className="test_date">May 24, 2017</div>
                          </div>
                          <div className="test_quote_title">
                            " Best holliday ever "
                          </div>
                          <p className="test_quote_text">
                            Nullam eu convallis tortor. Suspendisse potenti. In
                            faucibus massa arcu, vitae cursus mi hendrerit nec.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Testimonial Item */}
                  <div className="owl-item">
                    <div className="test_item">
                      <div className="test_image">
                        <img src="/assets/images/test_3.jpg" alt="" />
                      </div>
                      <div className="test_icon">
                        <img src="/assets/images/kayak.png" alt="" />
                      </div>
                      <div className="test_content_container">
                        <div className="test_content">
                          <div className="test_item_info">
                            <div className="test_name">carla smith</div>
                            <div className="test_date">May 24, 2017</div>
                          </div>
                          <div className="test_quote_title">
                            " Best holliday ever "
                          </div>
                          <p className="test_quote_text">
                            Nullam eu convallis tortor. Suspendisse potenti. In
                            faucibus massa arcu, vitae cursus mi hendrerit nec.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Testimonials Slider Nav - Prev */}
                <div className="test_slider_nav test_slider_prev">
                  <svg
                    version="1.1"
                    id="Layer_6"
                    xmlns="http://www.w3.org/2000/svg"
                    xmlnsXlink="http://www.w3.org/1999/xlink"
                    x="0px"
                    y="0px"
                    width="28px"
                    height="33px"
                    viewBox="0 0 28 33"
                    enableBackground="new 0 0 28 33"
                    xmlSpace="preserve"
                  >
                    <defs>
                      <linearGradient id="test_grad_prev">
                        <stop offset="0%" stopColor="#fa9e1b" />
                        <stop offset="100%" stopColor="#8d4fff" />
                      </linearGradient>
                    </defs>
                    <path
                      className="nav_path"
                      fill="#F3F6F9"
                      d="M19,0H9C4.029,0,0,4.029,0,9v15c0,4.971,4.029,9,9,9h10c4.97,0,9-4.029,9-9V9C28,4.029,23.97,0,19,0z
								M26,23.091C26,27.459,22.545,31,18.285,31H9.714C5.454,31,2,27.459,2,23.091V9.909C2,5.541,5.454,2,9.714,2h8.571
								C22.545,2,26,5.541,26,9.909V23.091z"
                    />
                    <polygon
                      className="nav_arrow"
                      fill="#F3F6F9"
                      points="15.044,22.222 16.377,20.888 12.374,16.885 16.377,12.882 15.044,11.55 9.708,16.885 11.04,18.219 
								11.042,18.219 "
                    />
                  </svg>
                </div>
                {/* Testimonials Slider Nav - Next */}
                <div className="test_slider_nav test_slider_next">
                  <svg
                    version="1.1"
                    id="Layer_7"
                    xmlns="http://www.w3.org/2000/svg"
                    xmlnsXlink="http://www.w3.org/1999/xlink"
                    x="0px"
                    y="0px"
                    width="28px"
                    height="33px"
                    viewBox="0 0 28 33"
                    enableBackground="new 0 0 28 33"
                    xmlSpace="preserve"
                  >
                    <defs>
                      <linearGradient id="test_grad_next">
                        <stop offset="0%" stopColor="#fa9e1b" />
                        <stop offset="100%" stopColor="#8d4fff" />
                      </linearGradient>
                    </defs>
                    <path
                      className="nav_path"
                      fill="#F3F6F9"
                      d="M19,0H9C4.029,0,0,4.029,0,9v15c0,4.971,4.029,9,9,9h10c4.97,0,9-4.029,9-9V9C28,4.029,23.97,0,19,0z
							M26,23.091C26,27.459,22.545,31,18.285,31H9.714C5.454,31,2,27.459,2,23.091V9.909C2,5.541,5.454,2,9.714,2h8.571
							C22.545,2,26,5.541,26,9.909V23.091z"
                    />
                    <polygon
                      className="nav_arrow"
                      fill="#F3F6F9"
                      points="13.044,11.551 11.71,12.885 15.714,16.888 11.71,20.891 13.044,22.224 18.379,16.888 17.048,15.554 
							17.046,15.554 "
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/*Testimonials*/}

      {/*trending*/}

      <div className="trending">
        <div className="container">
          <div className="row">
            <div className="col text-center">
              <h2 className="section_title">trending now</h2>
            </div>
          </div>
          <div className="row trending_container">
            {/* Trending Item */}
            <div className="col-lg-3 col-sm-6">
              <div className="trending_item clearfix">
                <div className="trending_image">
                  <img
                    src="/assets/images/trend_1.png"
                    alt="https://unsplash.com/@fransaraco"
                  />
                </div>
                <div className="trending_content">
                  <div className="trending_title">
                    <a href="#">grand hotel</a>
                  </div>
                  <div className="trending_price">From $182</div>
                  <div className="trending_location">madrid, spain</div>
                </div>
              </div>
            </div>
            {/* Trending Item */}
            <div className="col-lg-3 col-sm-6">
              <div className="trending_item clearfix">
                <div className="trending_image">
                  <img
                    src="/assets/images/trend_2.png"
                    alt="https://unsplash.com/@grovemade"
                  />
                </div>
                <div className="trending_content">
                  <div className="trending_title">
                    <a href="#">mars hotel</a>
                  </div>
                  <div className="trending_price">From $182</div>
                  <div className="trending_location">madrid, spain</div>
                </div>
              </div>
            </div>
            {/* Trending Item */}
            <div className="col-lg-3 col-sm-6">
              <div className="trending_item clearfix">
                <div className="trending_image">
                  <img
                    src="/assets/images/trend_3.png"
                    alt="https://unsplash.com/@jbriscoe"
                  />
                </div>
                <div className="trending_content">
                  <div className="trending_title">
                    <a href="#">queen hotel</a>
                  </div>
                  <div className="trending_price">From $182</div>
                  <div className="trending_location">madrid, spain</div>
                </div>
              </div>
            </div>
            {/* Trending Item */}
            <div className="col-lg-3 col-sm-6">
              <div className="trending_item clearfix">
                <div className="trending_image">
                  <img
                    src="/assets/images/trend_4.png"
                    alt="https://unsplash.com/@oowgnuj"
                  />
                </div>
                <div className="trending_content">
                  <div className="trending_title">
                    <a href="#">mars hotel</a>
                  </div>
                  <div className="trending_price">From $182</div>
                  <div className="trending_location">madrid, spain</div>
                </div>
              </div>
            </div>
            {/* Trending Item */}
            <div className="col-lg-3 col-sm-6">
              <div className="trending_item clearfix">
                <div className="trending_image">
                  <img
                    src="/assets/images/trend_5.png"
                    alt="https://unsplash.com/@mindaugas"
                  />
                </div>
                <div className="trending_content">
                  <div className="trending_title">
                    <a href="#">grand hotel</a>
                  </div>
                  <div className="trending_price">From $182</div>
                  <div className="trending_location">madrid, spain</div>
                </div>
              </div>
            </div>
            {/* Trending Item */}
            <div className="col-lg-3 col-sm-6">
              <div className="trending_item clearfix">
                <div className="trending_image">
                  <img
                    src="/assets/images/trend_6.png"
                    alt="https://unsplash.com/@itsnwa"
                  />
                </div>
                <div className="trending_content">
                  <div className="trending_title">
                    <a href="#">mars hotel</a>
                  </div>
                  <div className="trending_price">From $182</div>
                  <div className="trending_location">madrid, spain</div>
                </div>
              </div>
            </div>
            {/* Trending Item */}
            <div className="col-lg-3 col-sm-6">
              <div className="trending_item clearfix">
                <div className="trending_image">
                  <img
                    src="/assets/images/trend_7.png"
                    alt="https://unsplash.com/@rktkn"
                  />
                </div>
                <div className="trending_content">
                  <div className="trending_title">
                    <a href="#">queen hotel</a>
                  </div>
                  <div className="trending_price">From $182</div>
                  <div className="trending_location">madrid, spain</div>
                </div>
              </div>
            </div>
            {/* Trending Item */}
            <div className="col-lg-3 col-sm-6">
              <div className="trending_item clearfix">
                <div className="trending_image">
                  <img
                    src="assets/images/trend_8.png"
                    alt="https://unsplash.com/@thoughtcatalog"
                  />
                </div>
                <div className="trending_content">
                  <div className="trending_title">
                    <a href="#">mars hotel</a>
                  </div>
                  <div className="trending_price">From $182</div>
                  <div className="trending_location">madrid, spain</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/*trending*/}

      {/*contact*/}

      <div className="contact">
        <div
          className="contact_background"
          style={{ backgroundImage: "url(/assets/images/contact.png)" }}
        />
        <div className="container">
          <div className="row">
            <div className="col-lg-5">
              <div className="contact_image"></div>
            </div>
            <div className="col-lg-7">
              <div className="contact_form_container">
                <div className="contact_title">get in touch</div>
                <form action="#" id="contact_form" className="contact_form">
                  <input
                    type="text"
                    id="contact_form_name"
                    className="contact_form_name input_field"
                    placeholder="Name"
                    required="required"
                    data-error="Name is required."
                  />
                  <input
                    type="text"
                    id="contact_form_email"
                    className="contact_form_email input_field"
                    placeholder="E-mail"
                    required="required"
                    data-error="Email is required."
                  />
                  <input
                    type="text"
                    id="contact_form_subject"
                    className="contact_form_subject input_field"
                    placeholder="Subject"
                    required="required"
                    data-error="Subject is required."
                  />
                  <textarea
                    id="contact_form_message"
                    className="text_field contact_form_message"
                    name="message"
                    rows={4}
                    placeholder="Message"
                    required="required"
                    data-error="Please, write us a message."
                    defaultValue={""}
                  />
                  <button
                    type="submit"
                    id="form_submit_button"
                    className="form_submit_button button"
                  >
                    send message
                    <span />
                    <span />
                    <span />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/*contact*/}
    </div>
  );
}

export default Index;
