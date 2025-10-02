import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const API_BASE =
  process.env.REACT_APP_API_URL?.replace(/\/+$/, "") || "http://localhost:8800";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      // ✅ Force email to lowercase before sending
      const payload = {
        ...form,
        email: form.email.toLowerCase().trim(),
      };

      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");

      // ✅ Save user details
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.user.role);
      localStorage.setItem("email", data.user.email);
      localStorage.setItem("name", data.user.name);

      // ✅ Redirect depending on role
      if (data.user.role === "admin") {
        navigate("/"); // later replace with /admin when dashboard ready
      } else {
        navigate("/");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container px-4 py-5 mx-auto">
      <div className="card card0">
        <div className="d-flex flex-lg-row flex-column-reverse">
          <div className="card card1">
            <div className="row justify-content-center my-auto">
              <div className="col-md-8 col-10 my-4">
                <div className="row justify-content-center px-3 mb-3">
                  <img id="logo" src="/assets/images/logo.png" alt="Logo" />
                </div>
                <h3 className="mb-5 text-center heading">SIGN IN</h3>

                {error && <div style={{ color: "red" }}>{error}</div>}

                <form onSubmit={onSubmit}>
                  <div className="form-group">
                    <label className="form-control-label text-muted">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={onChange}
                      placeholder="Email"
                      className="form-control"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-control-label text-muted">Password</label>
                    <input
                      type="password"
                      name="password"
                      value={form.password}
                      onChange={onChange}
                      placeholder="Password"
                      className="form-control"
                      required
                    />
                  </div>

                  <div className="row justify-content-center my-3 px-3">
                    <button
                      type="submit"
                      className="btn-block btn-color"
                      disabled={loading}
                    >
                      {loading ? "Logging in..." : "Login"}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            <div className="bottom text-center mb-3">
              <p className="sm-text mx-auto mb-3">
                Don't have an account?
                <Link to="/register">
                  <button className="btn btn-white ml-2">Create new</button>
                </Link>
              </p>
            </div>
          </div>

          <div className="card card2">
            <div className="my-auto mx-md-5 px-md-5 right">
              <h1 className="text-white" style={{ fontSize: "40px" }}>
                Brewing Connections, Building Community
              </h1>
              <small
                className="text-black"
                style={{ fontSize: "20px", fontWeight: "bold" }}
              >
                At NovaScotiaAle, we believe in more than just business — we
                believe in people, stories, and experiences that bring us
                together.
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
