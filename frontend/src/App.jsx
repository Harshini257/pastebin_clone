import { useEffect, useState, useRef, useCallback } from "react";
import { Routes, Route, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import CodeViewer from "./components/CodeViewer";
import "./App.css";

function PasteManager({
  pastes,
  fetchPasteById,
  editPaste,
  deletePaste,
  copyCode,
  selectedPaste,
  setSelectedPaste,
  pasteError,
  setPasteError,
  setLoadingPaste,
  setLastAction,
  search,
  setSearch,
  language,
  theme,
}) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showLoading, setShowLoading] = useState(false);

  useEffect(() => {
    let timer = null;
    if (id) {
      setLoadingPaste(true);
      setShowLoading(false);
      setPasteError(null);
      timer = setTimeout(() => setShowLoading(true), 150);
      fetchPasteById(id)
        .then((paste) => {
          if (paste) {
            setSelectedPaste(paste);
          } else {
            setSelectedPaste(null);
            setPasteError("Paste not found.");
          }
        })
        .finally(() => {
          clearTimeout(timer);
          setShowLoading(false);
          setLoadingPaste(false);
        });
    } else {
      setSelectedPaste(null);
      setPasteError(null);
    }
    return () => clearTimeout(timer);
  }, [id, fetchPasteById, setLoadingPaste, setPasteError, setSelectedPaste]);

  const filteredPastes = pastes.filter((paste) =>
    paste.title.toLowerCase().includes(search.toLowerCase())
  );

  const handleView = (paste) => {
    setLastAction(`View ${paste._id}`);
    navigate(`/paste/${paste._id}`);
  };

  return (
    <>
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
            <small>Created: {new Date(paste.createdAt).toLocaleString()}</small>
            <br />
            <br />
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              <button
                type="button"
                onClick={() => {
                  console.log("View clicked", paste._id);
                  handleView(paste);
                }}
              >
                View
              </button>

              <button
                type="button"
                onClick={() => {
                  console.log("Edit clicked", paste._id);
                  editPaste(paste);
                }}
              >
                Edit
              </button>

              <button
                type="button"
                onClick={() => {
                  console.log("Copy clicked", paste._id);
                  copyCode(paste.code);
                }}
              >
                Copy
              </button>

              <button
                type="button"
                className="delete"
                onClick={() => {
                  console.log("Delete clicked", paste._id);
                  deletePaste(paste._id);
                }}
              >
                Delete
              </button>
            </div>
          </div>
        ))
      )}

      {pasteError && <p style={{ color: "var(--delete)" }}>{pasteError}</p>}
      {showLoading && <p>Loading paste...</p>}

      {selectedPaste && (
        <div className="card">
          <h2>{selectedPaste.title}</h2>
          <small>Created: {new Date(selectedPaste.createdAt).toLocaleString()}</small>
          <br />
          <br />
          <CodeViewer
            code={selectedPaste.code}
            theme={theme}
            language={selectedPaste.language || language}
          />
          <br />
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <button
              type="button"
              onClick={() => {
                console.log("SelectedPaste Copy clicked", selectedPaste._id);
                copyCode(selectedPaste.code);
              }}
            >
              📋 Copy Code
            </button>
            <button
              type="button"
              onClick={() => {
                console.log("Back clicked");
                navigate("/");
              }}
            >
              Back to list
            </button>
          </div>
        </div>
      )}
    </>
  );
}

function App() {
  const API = "http://localhost:5000/api/pastes";

  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "dark" || saved === "light") return saved;
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  });

  const [title, setTitle] = useState("");
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("javascript");
  const titleRef = useRef(null);
  const [pastes, setPastes] = useState([]);
  const [selectedPaste, setSelectedPaste] = useState(null);
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [loadingPaste, setLoadingPaste] = useState(false);
  const [pasteError, setPasteError] = useState(null);
  const [lastAction, setLastAction] = useState("");

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  // Fetch all pastes
  const fetchPastes = useCallback(async () => {
    try {
      const res = await axios.get(API);
      setPastes(res.data);
    } catch (err) {
      console.log(err);
    }
  }, [API]);

  const fetchPasteById = useCallback(async (id) => {
    try {
      const res = await axios.get(`${API}/${id}`);
      return res.data;
    } catch (err) {
      console.log(err);
      return null;
    }
  }, [API]);

  useEffect(() => {
    fetchPastes();
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Save / Update
  const savePaste = async () => {
    if (!title || !code) {
      alert("Please enter title and code");
      return;
    }

    try {
      if (editingId) {
        const res = await axios.put(`${API}/${editingId}`, {
          title,
          code,
          language,
        });

        // update local list
        setPastes((prev) => prev.map((p) => (p._id === res.data._id ? res.data : p)));

        alert("Paste Updated Successfully");
        setEditingId(null);
      } else {
        const res = await axios.post(API, {
          title,
          code,
          language,
        });

        // prepend new paste to local list
        setPastes((prev) => [res.data, ...prev]);

        alert("Paste Saved Successfully");
      }

      setTitle("");
      setCode("");
      setLanguage("javascript");
      // no full refetch needed; local state updated above
    } catch (err) {
      console.log(err);
    }
  };

  // Delete Paste
  const deletePaste = async (id) => {
    if (!window.confirm("Delete this paste?")) return;

    try {
      await axios.delete(`${API}/${id}`);

      alert("Paste Deleted");
      setLastAction(`Deleted ${id}`);

      // remove locally without full refetch
      setPastes((prev) => prev.filter((p) => p._id !== id));

      if (selectedPaste?._id === id) {
        setSelectedPaste(null);
      }
    } catch (err) {
      console.log(err);
    }
  };

  // Edit Paste
  const editPaste = (paste) => {
    setLastAction(`Edit ${paste._id}`);
    setTitle(paste.title);
    setCode(paste.code);
    setLanguage(paste.language || "javascript");
    setEditingId(paste._id);
    // scroll to form and focus the title input so user sees the edit form
    if (titleRef.current) {
      titleRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
      // focus after a short delay to allow scroll
      setTimeout(() => titleRef.current && titleRef.current.focus(), 250);
    } else {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  // Copy Code
  const copyCode = (text) => {
    navigator.clipboard.writeText(text);
    alert("Code Copied");
    setLastAction("Copied");
  };

  // Search
  const filteredPastes = pastes.filter((paste) =>
    paste.title.toLowerCase().includes(search.toLowerCase())
  );


  return (
    <div className="container">
      <div className="top-row">
        <h1>🚀 PasteBin Clone</h1>
        <button type="button" className="theme-toggle" onClick={() => { console.log('Theme toggle clicked', theme); toggleTheme(); }} aria-label="Toggle theme">
          {theme === "dark" ? "☀️ Light Mode" : "🌙 Dark Mode"}
        </button>
      </div>

      <input
        ref={titleRef}
        type="text"
        placeholder="Paste Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <label style={{ display: "block", marginBottom: 8 }}>
        Language:
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          style={{ marginLeft: 8, padding: 6, borderRadius: 6 }}
        >
          <option value="javascript">JavaScript</option>
          <option value="typescript">TypeScript</option>
          <option value="python">Python</option>
          <option value="java">Java</option>
          <option value="c">C</option>
          <option value="cpp">C++</option>
          <option value="csharp">C#</option>
          <option value="go">Go</option>
          <option value="ruby">Ruby</option>
          <option value="php">PHP</option>
          <option value="html">HTML</option>
          <option value="css">CSS</option>
          <option value="json">JSON</option>
          <option value="text">Plain Text</option>
        </select>
      </label>

      <textarea
        rows="10"
        placeholder="Write your code here..."
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />

      <button type="button" onClick={() => { console.log('Save clicked', { editingId, title }); savePaste(); }}>
        {editingId ? "Update Paste" : "Save Paste"}
      </button>

      <hr />

      <h2>All Pastes</h2>

      <Routes>
        <Route
          path="/"
          element={
            <PasteManager
              pastes={pastes}
              fetchPasteById={fetchPasteById}
              editPaste={editPaste}
              deletePaste={deletePaste}
              copyCode={copyCode}
              selectedPaste={selectedPaste}
              setSelectedPaste={setSelectedPaste}
              pasteError={pasteError}
              setPasteError={setPasteError}
              setLoadingPaste={setLoadingPaste}
              setLastAction={setLastAction}
              search={search}
              setSearch={setSearch}
              language={language}
              theme={theme}
            />
          }
        />
        <Route
          path="/paste/:id"
          element={
            <PasteManager
              pastes={pastes}
              fetchPasteById={fetchPasteById}
              editPaste={editPaste}
              deletePaste={deletePaste}
              copyCode={copyCode}
              selectedPaste={selectedPaste}
              setSelectedPaste={setSelectedPaste}
              pasteError={pasteError}
              setPasteError={setPasteError}
              setLoadingPaste={setLoadingPaste}
              setLastAction={setLastAction}
              search={search}
              setSearch={setSearch}
              language={language}
              theme={theme}
            />
          }
        />
      </Routes>
    </div>
  );
}

export default App;