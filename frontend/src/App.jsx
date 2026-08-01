import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const API = "http://localhost:5000/api/pastes";

  const [title, setTitle] = useState("");
  const [code, setCode] = useState("");
  const [pastes, setPastes] = useState([]);
  const [selectedPaste, setSelectedPaste] = useState(null);
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState(null);

  // Fetch all pastes
  const fetchPastes = async () => {
    try {
      const res = await axios.get(API);
      setPastes(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchPastes();
  }, []);

  // Save or Update
  const savePaste = async () => {
    if (!title || !code) {
      alert("Please enter title and code");
      return;
    }

    try {
      if (editingId) {
        await axios.put(`${API}/${editingId}`, {
          title,
          code,
        });

        alert("Paste Updated Successfully");
        setEditingId(null);
      } else {
        await axios.post(API, {
          title,
          code,
        });

        alert("Paste Saved Successfully");
      }

      setTitle("");
      setCode("");
      fetchPastes();
    } catch (err) {
      console.log(err);
    }
  };

  // Delete
  const deletePaste = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this paste?"
    );

    if (!confirmDelete) return;

    try {
      await axios.delete(`${API}/${id}`);

      alert("Paste Deleted");

      fetchPastes();

      if (selectedPaste?._id === id) {
        setSelectedPaste(null);
      }
    } catch (err) {
      console.log(err);
    }
  };

  // Edit
  const editPaste = (paste) => {
    setTitle(paste.title);
    setCode(paste.code);
    setEditingId(paste._id);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Copy Code
  const copyCode = (text) => {
    navigator.clipboard.writeText(text);
    alert("Code Copied");
  };

  // Search
  const filteredPastes = pastes.filter((paste) =>
    paste.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container">

      <h1>🚀 PasteBin Clone</h1>

      <input
        type="text"
        placeholder="Paste Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <textarea
        rows="10"
        placeholder="Write your code here..."
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />

      <button onClick={savePaste}>
        {editingId ? "Update Paste" : "Save Paste"}
      </button>

      <hr />

      <h2>All Pastes</h2>

      <input
        type="text"
        placeholder="Search by title..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {filteredPastes.length === 0 ? (
        <p>No pastes found.</p>
      ) : (
        filteredPastes.map((paste) => (
          <div className="card" key={paste._id}>

            <h3>{paste.title}</h3>

            <small>
              Created:
              {" "}
              {new Date(paste.createdAt).toLocaleString()}
            </small>

            <br />
            <br />

            <div
              style={{
                display: "flex",
                gap: "10px",
                flexWrap: "wrap",
              }}
            >
              <button onClick={() => setSelectedPaste(paste)}>
                View
              </button>

              <button onClick={() => editPaste(paste)}>
                Edit
              </button>

              <button onClick={() => copyCode(paste.code)}>
                Copy
              </button>

              <button
                className="delete"
                onClick={() => deletePaste(paste._id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))
      )}

      {selectedPaste && (
        <div className="card">

          <h2>{selectedPaste.title}</h2>

          <pre>{selectedPaste.code}</pre>

          <button onClick={() => copyCode(selectedPaste.code)}>
            Copy Code
          </button>

        </div>
      )}
    </div>
  );
}

export default App;