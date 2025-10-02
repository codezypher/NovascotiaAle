import React, { useEffect, useState } from "react";

const API_BASE =
  process.env.REACT_APP_API_URL?.replace(/\/+$/, "") ||
  "http://localhost:8800";

export default function MyPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ title: "", descriptions: "", locations: "", price: "" });

  const token = localStorage.getItem("token");

  // Load posts
  useEffect(() => {
    if (!token) {
      setErr("You must be logged in to view your posts.");
      setLoading(false);
      return;
    }
    (async () => {
      setLoading(true);
      setErr("");
      try {
        const res = await fetch(`${API_BASE}/auth/myposts`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to fetch posts");
        setPosts(data);
      } catch (e) {
        setErr(e.message || "Error loading posts");
      } finally {
        setLoading(false);
      }
    })();
  }, [token]);

  // Handle delete
  const handleDelete = async (kind, id) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    try {
      const res = await fetch(`${API_BASE}/${kind}/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete");
      setPosts((prev) => prev.filter((p) => !(p.kind === kind && p.id === id)));
    } catch (e) {
      alert(e.message);
    }
  };

  // Handle edit click
  const startEdit = (post) => {
    setEditingId(`${post.kind}-${post.id}`);
    setEditForm({
      title: post.title,
      descriptions: post.descriptions || "",
      locations: post.locations || "",
      price: post.price || "",
    });
  };

  // Save edit
  const handleEditSave = async (kind, id) => {
    try {
      const res = await fetch(`${API_BASE}/${kind}/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editForm),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update");

      setPosts((prev) =>
        prev.map((p) =>
          p.kind === kind && p.id === id ? { ...p, ...editForm } : p
        )
      );
      setEditingId(null);
    } catch (e) {
      alert(e.message);
    }
  };

  return (
    <div className="container py-5">
      <h2 className="mb-4 innerheading">My Posts</h2>

      {loading && <div>Loading…</div>}
      {!loading && err && <div style={{ color: "crimson" }}>{err}</div>}
      {!loading && !err && posts.length === 0 && (
        <div>You have not posted anything yet.</div>
      )}

      {!loading && !err && posts.length > 0 && (
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Type</th>
              <th>Title</th>
              <th>Status</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((p) => {
              const isEditing = editingId === `${p.kind}-${p.id}`;
              return (
                <tr key={`${p.kind}-${p.id}`}>
                  <td style={{ textTransform: "capitalize" }}>{p.kind}</td>
                  <td>
                    {isEditing ? (
                      <input
                        className="form-control"
                        value={editForm.title}
                        onChange={(e) =>
                          setEditForm({ ...editForm, title: e.target.value })
                        }
                      />
                    ) : (
                      p.title
                    )}
                  </td>
                  <td>
                    <span
                      style={{
                        color:
                          p.status === "approved"
                            ? "green"
                            : p.status === "rejected"
                            ? "red"
                            : "orange",
                        fontWeight: "bold",
                      }}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td>{new Date(p.created_time || p.created_at).toLocaleString()}</td>
                  <td>
                    {isEditing ? (
                      <>
                        <button
                          className="btn btn-sm btn-success me-2"
                          onClick={() => handleEditSave(p.kind, p.id)}
                        >
                          Save
                        </button>
                        <button
                          className="btn btn-sm btn-secondary"
                          onClick={() => setEditingId(null)}
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          className="btn btn-sm btn-primary me-2"
                          onClick={() => startEdit(p)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDelete(p.kind, p.id)}
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}
