import { useState, useEffect, createContext, useContext } from "react";

const AuthContext = createContext(null);
const useAuth = () => useContext(AuthContext);
const API = "http://localhost:5000/api";

async function apiFetch(path, opts = {}) {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API}${path}`, {
    headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    ...opts,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Error");
  return data;
}

const G = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=Instrument+Serif:ital@0;1&family=DM+Mono:wght@400;500&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    :root {
      --cream: #F5F0E8; --ink: #1A1612; --rust: #C4451C;
      --sand: #E8DFD0; --muted: #8A7E72; --line: #D4C9B8;
    }
    body { background: var(--cream); color: var(--ink); font-family: 'Syne', sans-serif; min-height: 100vh; }
    ::selection { background: var(--ink); color: var(--cream); }
    button { cursor: pointer; font-family: 'Syne', sans-serif; }
    input, textarea, select { font-family: 'DM Mono', monospace; }
    ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-thumb { background: var(--line); }
    option { background: var(--cream); }
  `}</style>
);

const TYPE_COLORS = {
  "Full-time": { bg: "#2D5016", text: "#D4E8B8" },
  "Part-time": { bg: "#5C3A1E", text: "#F0D4B0" },
  "Remote": { bg: "#1A2E5C", text: "#B0C4F0" },
  "Internship": { bg: "#4A1628", text: "#F0B0C4" },
  "Contract": { bg: "#2E2A1A", text: "#E8DFB0" },
};

function Navbar({ page, setPage }) {
  const { user, logout } = useAuth();
  const pageName = typeof page === "string" ? page : page?.name;
  return (
    <nav style={{ background: "var(--ink)", color: "var(--cream)", borderBottom: "2px solid var(--rust)", position: "sticky", top: 0, zIndex: 100 }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 32px", display: "flex", alignItems: "stretch", height: 56 }}>
        <button onClick={() => setPage("home")} style={{ background: "none", border: "none", color: "var(--cream)", fontFamily: "'Syne',sans-serif", fontSize: 20, fontWeight: 800, letterSpacing: "-0.5px", paddingRight: 32, borderRight: "1px solid #333", marginRight: 32, whiteSpace: "nowrap" }}>
          HIRE<span style={{ color: "var(--rust)" }}>NEST</span>
        </button>
        <div style={{ display: "flex", flex: 1, alignItems: "stretch" }}>
          {[["Jobs", "jobs"], ...(user?.role === "employer" ? [["Dashboard", "employer-dash"], ["+ Post Job", "post-job"]] : []), ...(user?.role === "candidate" ? [["My Applications", "candidate-dash"]] : [])].map(([label, pg]) => (
            <button key={pg} onClick={() => setPage(pg)} style={{ background: pageName === pg ? "var(--rust)" : "none", border: "none", borderRight: "1px solid #333", color: "var(--cream)", padding: "0 20px", fontFamily: "'Syne',sans-serif", fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>
              {label}
            </button>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "stretch", borderLeft: "1px solid #333" }}>
          {user ? (
            <>
              <span style={{ display: "flex", alignItems: "center", padding: "0 16px", fontSize: 12, color: "var(--muted)", fontFamily: "'DM Mono',monospace", borderRight: "1px solid #333" }}>{user.name}</span>
              <button onClick={logout} style={{ background: "none", border: "none", color: "var(--muted)", padding: "0 16px", fontSize: 11, letterSpacing: "0.1em", fontWeight: 700, textTransform: "uppercase" }}>Exit ↗</button>
            </>
          ) : (
            <>
              <button onClick={() => setPage("login")} style={{ background: "none", border: "none", borderRight: "1px solid #333", color: "var(--cream)", padding: "0 20px", fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>Login</button>
              <button onClick={() => setPage("register")} style={{ background: "var(--rust)", border: "none", color: "var(--cream)", padding: "0 20px", fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>Join Free</button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

function JobCard({ job, setPage, index = 0 }) {
  const col = TYPE_COLORS[job.type] || { bg: "#2E2A1A", text: "#E8DFB0" };
  return (
    <article onClick={() => setPage({ name: "job-detail", id: job._id || job.id })}
      style={{ background: "var(--cream)", border: "1px solid var(--line)", borderLeft: "3px solid var(--rust)", padding: "24px 28px", cursor: "pointer", transition: "transform 0.15s, box-shadow 0.15s", position: "relative" }}
      onMouseEnter={e => { e.currentTarget.style.transform = "translate(-2px,-2px)"; e.currentTarget.style.boxShadow = "4px 4px 0 var(--ink)"; }}
      onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}
    >
      <span style={{ position: "absolute", top: 20, right: 20, fontFamily: "'DM Mono',monospace", fontSize: 11, color: "var(--line)" }}>{String(index + 1).padStart(2, "0")}</span>
      <span style={{ display: "inline-block", background: col.bg, color: col.text, fontFamily: "'DM Mono',monospace", fontSize: 10, fontWeight: 500, letterSpacing: "0.12em", padding: "3px 10px", marginBottom: 14, textTransform: "uppercase" }}>{job.type}</span>
      <h3 style={{ fontFamily: "'Instrument Serif',serif", fontSize: 22, fontWeight: 400, lineHeight: 1.2, marginBottom: 6, paddingRight: 32 }}>{job.title}</h3>
      <p style={{ fontFamily: "'Syne',sans-serif", fontSize: 13, fontWeight: 700, color: "var(--rust)", marginBottom: 16 }}>{job.company}</p>
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", borderTop: "1px solid var(--line)", paddingTop: 14 }}>
        {[job.location, job.salary, job.experience].filter(Boolean).map((v, i) => (
          <span key={i} style={{ fontFamily: "'DM Mono',monospace", fontSize: 11, color: "var(--muted)" }}>{v}</span>
        ))}
      </div>
      {job.tags?.length > 0 && (
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 12 }}>
          {job.tags.slice(0, 4).map(t => <span key={t} style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, color: "var(--muted)", border: "1px solid var(--line)", padding: "2px 8px" }}>{t}</span>)}
        </div>
      )}
    </article>
  );
}

function HomePage({ setPage }) {
  const [search, setSearch] = useState("");
  const [featured, setFeatured] = useState([]);
  const ticker = ["React Developer", "UI Designer", "Node.js Engineer", "Product Manager", "DevOps", "Data Scientist"];
  useEffect(() => { apiFetch("/jobs?limit=6").then(d => setFeatured(d.jobs || [])).catch(() => setFeatured(DEMO_JOBS.slice(0, 6))); }, []);

  return (
    <div>
      <section style={{ background: "var(--ink)", color: "var(--cream)", overflow: "hidden", borderBottom: "2px solid var(--rust)" }}>
        <div style={{ borderBottom: "1px solid #2A2A2A", display: "flex", justifyContent: "space-between", padding: "10px 48px", fontSize: 11, fontFamily: "'DM Mono',monospace", color: "var(--muted)", letterSpacing: "0.08em" }}>
          <span>EST. 2024 — ISSUE NO. 001</span>
          <span>CONNECTING TALENT & OPPORTUNITY</span>
          <span>INDIA'S JOB BOARD</span>
        </div>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "60px 48px 0", display: "grid", gridTemplateColumns: "1fr 1px 380px", gap: 0 }}>
          <div style={{ paddingRight: 48, paddingBottom: 60 }}>
            <p style={{ fontFamily: "'DM Mono',monospace", fontSize: 11, color: "var(--rust)", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 20 }}>★ Featured Opportunity</p>
            <h1 style={{ fontFamily: "'Instrument Serif',serif", fontSize: "clamp(48px,5.5vw,84px)", lineHeight: 0.95, letterSpacing: "-2px", marginBottom: 32, fontStyle: "italic" }}>
              Your Next<br />
              <span style={{ fontStyle: "normal", WebkitTextStroke: "1px var(--cream)", color: "transparent" }}>Great</span><br />
              Career Move
            </h1>
            <p style={{ fontFamily: "'Syne',sans-serif", fontSize: 15, color: "#888", lineHeight: 1.7, maxWidth: 440, marginBottom: 40 }}>
              2,400+ verified openings from India's most innovative companies. No noise. Just opportunities.
            </p>
            <div style={{ display: "flex", border: "1px solid #444", maxWidth: 520 }}>
              <input value={search} onChange={e => setSearch(e.target.value)} onKeyDown={e => e.key === "Enter" && setPage({ name: "jobs", q: search })}
                placeholder="Search title, skill, company..."
                style={{ flex: 1, background: "none", border: "none", padding: "14px 20px", color: "var(--cream)", fontSize: 13, outline: "none" }} />
              <button onClick={() => setPage({ name: "jobs", q: search })} style={{ background: "var(--rust)", border: "none", color: "var(--cream)", padding: "14px 24px", fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                Search →
              </button>
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 16, flexWrap: "wrap" }}>
              {["Remote", "Full-time", "Internship", "₹10L+"].map(t => (
                <button key={t} onClick={() => setPage({ name: "jobs", type: t })} style={{ background: "none", border: "1px solid #444", color: "#888", padding: "6px 14px", fontFamily: "'DM Mono',monospace", fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase" }}>{t}</button>
              ))}
            </div>
          </div>
          <div style={{ background: "#2A2A2A" }} />
          <div style={{ paddingLeft: 48, paddingBottom: 60 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1, background: "#2A2A2A", border: "1px solid #2A2A2A", marginBottom: 32 }}>
              {[["2,400+", "Active Jobs"], ["800+", "Companies"], ["50K+", "Candidates"], ["95%", "Hire Rate"]].map(([n, l]) => (
                <div key={l} style={{ background: "var(--ink)", padding: "24px 20px" }}>
                  <div style={{ fontFamily: "'Instrument Serif',serif", fontSize: 36, fontStyle: "italic", color: "var(--cream)", lineHeight: 1 }}>{n}</div>
                  <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, color: "var(--muted)", marginTop: 6, letterSpacing: "0.08em", textTransform: "uppercase" }}>{l}</div>
                </div>
              ))}
            </div>
            <p style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, color: "var(--rust)", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 12 }}>— Trending Now</p>
            {ticker.map((t, i) => (
              <div key={t} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderTop: "1px solid #2A2A2A" }}>
                <span style={{ fontFamily: "'Syne',sans-serif", fontSize: 13, color: "var(--cream)" }}>{t}</span>
                <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, color: "var(--muted)" }}>#{i + 1}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ maxWidth: 1280, margin: "0 auto", padding: "60px 48px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 32, paddingBottom: 16, borderBottom: "2px solid var(--ink)" }}>
          <div>
            <p style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, color: "var(--rust)", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 6 }}>Section A</p>
            <h2 style={{ fontFamily: "'Instrument Serif',serif", fontSize: 36, fontStyle: "italic", letterSpacing: "-1px" }}>Featured Jobs</h2>
          </div>
          <button onClick={() => setPage("jobs")} style={{ background: "var(--ink)", border: "none", color: "var(--cream)", fontFamily: "'Syne',sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", padding: "10px 20px" }}>All Jobs →</button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 1, background: "var(--line)" }}>
          {(featured.length ? featured : DEMO_JOBS.slice(0, 6)).map((job, i) => (
            <div key={job._id || job.id} style={{ background: "var(--cream)" }}><JobCard job={job} setPage={setPage} index={i} /></div>
          ))}
        </div>
      </section>

      <section style={{ background: "var(--rust)", color: "var(--cream)", padding: "72px 48px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 32 }}>
          <div>
            <p style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", opacity: 0.7, marginBottom: 12 }}>For Employers</p>
            <h2 style={{ fontFamily: "'Instrument Serif',serif", fontSize: "clamp(32px,4vw,56px)", fontStyle: "italic", lineHeight: 1.1, letterSpacing: "-1px" }}>Find your next<br />hire today.</h2>
          </div>
          <div>
            <p style={{ fontFamily: "'Syne',sans-serif", fontSize: 14, opacity: 0.8, maxWidth: 360, lineHeight: 1.6, marginBottom: 20 }}>Post openings and reach thousands of qualified candidates. Fast, simple, effective.</p>
            <button onClick={() => setPage("register")} style={{ background: "var(--cream)", color: "var(--rust)", border: "none", padding: "14px 32px", fontFamily: "'Syne',sans-serif", fontSize: 12, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase" }}>
              Post a Job — Free →
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

function JobsPage({ initial, setPage }) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(initial?.q || "");
  const [typeFilter, setTypeFilter] = useState(initial?.type || "");
  const [page, setPg] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const q = new URLSearchParams({ page, limit: 12, ...(search && { q: search }), ...(typeFilter && { type: typeFilter }) }).toString();
      const d = await apiFetch(`/jobs?${q}`);
      setJobs(d.jobs || []); setTotal(d.total || 0);
    } catch { setJobs(DEMO_JOBS); setTotal(DEMO_JOBS.length); }
    setLoading(false);
  };
  useEffect(() => { fetchJobs(); }, [page, typeFilter]);

  return (
    <div style={{ maxWidth: 1280, margin: "0 auto", padding: "48px 48px" }}>
      <div style={{ borderBottom: "2px solid var(--ink)", paddingBottom: 24, marginBottom: 40 }}>
        <p style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, color: "var(--rust)", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 8 }}>Browse</p>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 24 }}>
          <h1 style={{ fontFamily: "'Instrument Serif',serif", fontSize: 48, fontStyle: "italic", letterSpacing: "-2px", lineHeight: 1 }}>{total} Open Positions</h1>
          <div style={{ display: "flex", gap: 0, border: "1px solid var(--line)" }}>
            <input value={search} onChange={e => setSearch(e.target.value)} onKeyDown={e => e.key === "Enter" && fetchJobs()}
              placeholder="Search..." style={{ background: "none", border: "none", borderRight: "1px solid var(--line)", padding: "10px 16px", fontSize: 12, outline: "none", width: 200 }} />
            <select value={typeFilter} onChange={e => { setTypeFilter(e.target.value); setPg(1); }} style={{ background: "none", border: "none", borderRight: "1px solid var(--line)", padding: "10px 16px", fontSize: 12, outline: "none", cursor: "pointer" }}>
              <option value="">All Types</option>
              {["Full-time", "Part-time", "Remote", "Internship", "Contract"].map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            <button onClick={fetchJobs} style={{ background: "var(--ink)", color: "var(--cream)", border: "none", padding: "10px 20px", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>Go</button>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 20, flexWrap: "wrap" }}>
          {["", "Full-time", "Part-time", "Remote", "Internship", "Contract"].map(t => (
            <button key={t} onClick={() => { setTypeFilter(t); setPg(1); }} style={{ background: typeFilter === t ? "var(--ink)" : "none", border: "1px solid var(--line)", color: typeFilter === t ? "var(--cream)" : "var(--muted)", fontFamily: "'DM Mono',monospace", fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", padding: "5px 14px" }}>
              {t || "All"}
            </button>
          ))}
        </div>
      </div>

      {loading ? <p style={{ fontFamily: "'DM Mono',monospace", fontSize: 12, color: "var(--muted)", padding: "60px 0" }}>Loading positions...</p> : (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px,1fr))", gap: 1, background: "var(--line)" }}>
            {jobs.map((job, i) => <div key={job._id || job.id} style={{ background: "var(--cream)" }}><JobCard job={job} setPage={setPage} index={i} /></div>)}
          </div>
          {jobs.length === 0 && (
            <div style={{ padding: "80px 0", textAlign: "center" }}>
              <p style={{ fontFamily: "'Instrument Serif',serif", fontSize: 32, fontStyle: "italic", color: "var(--muted)" }}>No positions found.</p>
            </div>
          )}
          <div style={{ display: "flex", gap: 4, justifyContent: "center", marginTop: 48, paddingTop: 24, borderTop: "1px solid var(--line)" }}>
            {Array.from({ length: Math.ceil(total / 12) }, (_, i) => (
              <button key={i} onClick={() => setPg(i + 1)} style={{ background: page === i + 1 ? "var(--ink)" : "none", border: "1px solid var(--line)", color: page === i + 1 ? "var(--cream)" : "var(--muted)", width: 36, height: 36, fontFamily: "'DM Mono',monospace", fontSize: 12 }}>{i + 1}</button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function JobDetailPage({ jobId, setPage }) {
  const { user } = useAuth();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ coverLetter: "", resumeUrl: "" });
  const [msg, setMsg] = useState(null);
  const [applying, setApplying] = useState(false);

  useEffect(() => { apiFetch(`/jobs/${jobId}`).then(setJob).catch(() => setJob(DEMO_JOBS.find(j => j.id === jobId) || DEMO_JOBS[0])).finally(() => setLoading(false)); }, [jobId]);

  const apply = async () => {
    if (!user) { setPage("login"); return; }
    if (user.role !== "candidate") { setMsg({ type: "error", text: "Only candidates can apply." }); return; }
    setApplying(true);
    try { await apiFetch(`/jobs/${jobId}/apply`, { method: "POST", body: JSON.stringify(form) }); setMsg({ type: "success", text: "Application submitted." }); setShowForm(false); }
    catch (e) { setMsg({ type: "error", text: e.message }); }
    setApplying(false);
  };

  if (loading) return <div style={{ padding: "120px 48px", fontFamily: "'DM Mono',monospace", fontSize: 12, color: "var(--muted)" }}>Loading...</div>;
  if (!job) return null;

  const col = TYPE_COLORS[job.type] || { bg: "#2E2A1A", text: "#E8DFB0" };

  return (
    <div style={{ maxWidth: 1280, margin: "0 auto", padding: "48px 48px", display: "grid", gridTemplateColumns: "1fr 340px", gap: 48, alignItems: "start" }}>
      <div>
        <button onClick={() => setPage("jobs")} style={{ background: "none", border: "none", fontFamily: "'DM Mono',monospace", fontSize: 11, color: "var(--muted)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 32 }}>← Back</button>
        {msg && <div style={{ background: msg.type === "success" ? "#2D5016" : "#4A0C08", color: msg.type === "success" ? "#D4E8B8" : "#F0B0B0", padding: "14px 20px", marginBottom: 24, fontFamily: "'DM Mono',monospace", fontSize: 12 }}>{msg.text}</div>}
        <span style={{ display: "inline-block", background: col.bg, color: col.text, fontFamily: "'DM Mono',monospace", fontSize: 10, letterSpacing: "0.12em", padding: "4px 12px", marginBottom: 16, textTransform: "uppercase" }}>{job.type}</span>
        <h1 style={{ fontFamily: "'Instrument Serif',serif", fontSize: "clamp(36px,4vw,56px)", fontStyle: "italic", lineHeight: 1.05, letterSpacing: "-1.5px", marginBottom: 8 }}>{job.title}</h1>
        <p style={{ fontFamily: "'Syne',sans-serif", fontSize: 16, fontWeight: 700, color: "var(--rust)", marginBottom: 32 }}>{job.company}</p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))", gap: 1, background: "var(--line)", marginBottom: 40, border: "1px solid var(--line)" }}>
          {[["Location", job.location], ["Salary", job.salary], ["Experience", job.experience], ["Type", job.type]].filter(([, v]) => v).map(([label, val]) => (
            <div key={label} style={{ background: "var(--cream)", padding: "18px 20px" }}>
              <p style={{ fontFamily: "'DM Mono',monospace", fontSize: 9, color: "var(--muted)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 6 }}>{label}</p>
              <p style={{ fontFamily: "'Syne',sans-serif", fontSize: 13, fontWeight: 700 }}>{val}</p>
            </div>
          ))}
        </div>

        <div style={{ borderTop: "2px solid var(--ink)", paddingTop: 28, marginBottom: 32 }}>
          <p style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, color: "var(--rust)", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 16 }}>About the Role</p>
          <p style={{ fontFamily: "'Instrument Serif',serif", fontSize: 18, lineHeight: 1.75 }}>{job.description}</p>
        </div>

        {job.requirements?.length > 0 && (
          <div style={{ borderTop: "1px solid var(--line)", paddingTop: 28 }}>
            <p style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, color: "var(--rust)", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 16 }}>Requirements</p>
            {job.requirements.map((r, i) => (
              <div key={i} style={{ display: "flex", gap: 12, marginBottom: 10, paddingBottom: 10, borderBottom: "1px solid var(--sand)" }}>
                <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 11, color: "var(--rust)", paddingTop: 1 }}>→</span>
                <p style={{ fontFamily: "'Syne',sans-serif", fontSize: 14, lineHeight: 1.6 }}>{r}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ position: "sticky", top: 80 }}>
        <div style={{ border: "2px solid var(--ink)" }}>
          <div style={{ background: "var(--ink)", color: "var(--cream)", padding: "20px 24px" }}>
            <p style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", opacity: 0.6, marginBottom: 4 }}>Apply for this role</p>
            <p style={{ fontFamily: "'Instrument Serif',serif", fontSize: 18, fontStyle: "italic" }}>{job.title}</p>
          </div>
          <div style={{ padding: 24, background: "var(--cream)" }}>
            {!showForm ? (
              <button onClick={() => user ? setShowForm(true) : setPage("login")} style={{ width: "100%", background: "var(--rust)", color: "var(--cream)", border: "none", padding: "16px", fontFamily: "'Syne',sans-serif", fontSize: 13, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase" }}>Apply Now →</button>
            ) : (
              <div>
                <label style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, color: "var(--muted)", letterSpacing: "0.1em", textTransform: "uppercase", display: "block", marginBottom: 6 }}>Resume / Portfolio URL</label>
                <input value={form.resumeUrl} onChange={e => setForm(f => ({ ...f, resumeUrl: e.target.value }))} placeholder="https://..."
                  style={{ width: "100%", border: "1px solid var(--line)", borderBottom: "2px solid var(--ink)", background: "none", padding: "10px 12px", fontSize: 12, marginBottom: 16, outline: "none" }} />
                <label style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, color: "var(--muted)", letterSpacing: "0.1em", textTransform: "uppercase", display: "block", marginBottom: 6 }}>Cover Letter</label>
                <textarea value={form.coverLetter} onChange={e => setForm(f => ({ ...f, coverLetter: e.target.value }))} rows={5} placeholder="Why are you the right fit?"
                  style={{ width: "100%", border: "1px solid var(--line)", borderBottom: "2px solid var(--ink)", background: "none", padding: "10px 12px", fontSize: 12, marginBottom: 16, outline: "none", resize: "vertical" }} />
                <button onClick={apply} disabled={applying} style={{ width: "100%", background: "var(--rust)", color: "var(--cream)", border: "none", padding: "14px", fontFamily: "'Syne',sans-serif", fontSize: 12, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8 }}>{applying ? "Submitting..." : "Submit Application"}</button>
                <button onClick={() => setShowForm(false)} style={{ width: "100%", background: "none", border: "1px solid var(--line)", padding: "10px", fontFamily: "'DM Mono',monospace", fontSize: 10, color: "var(--muted)", letterSpacing: "0.08em", textTransform: "uppercase" }}>Cancel</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function AuthPage({ mode, setPage, onAuth }) {
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "candidate" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async () => {
    setLoading(true); setError("");
    try {
      const data = await apiFetch(`/auth/${mode}`, { method: "POST", body: JSON.stringify(form) });
      localStorage.setItem("token", data.token); onAuth(data.user);
      setPage(data.user.role === "employer" ? "employer-dash" : "candidate-dash");
    } catch (e) { setError(e.message); }
    setLoading(false);
  };

  const FI = (label, key, type = "text", placeholder = "") => (
    <div style={{ marginBottom: 20 }}>
      <label style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, color: "var(--muted)", letterSpacing: "0.1em", textTransform: "uppercase", display: "block", marginBottom: 6 }}>{label}</label>
      <input type={type} value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} placeholder={placeholder}
        style={{ width: "100%", border: "1px solid var(--line)", borderBottom: "2px solid var(--ink)", background: "none", padding: "12px 14px", fontSize: 14, outline: "none" }}
        onFocus={e => e.target.style.borderBottomColor = "var(--rust)"} onBlur={e => e.target.style.borderBottomColor = "var(--ink)"} />
    </div>
  );

  return (
    <div style={{ minHeight: "85vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, background: "var(--sand)" }}>
      <div style={{ background: "var(--cream)", border: "2px solid var(--ink)", width: "100%", maxWidth: 420, overflow: "hidden" }}>
        <div style={{ background: "var(--ink)", color: "var(--cream)", padding: "32px 36px" }}>
          <p style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, color: "var(--rust)", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 8 }}>{mode === "login" ? "Sign In" : "Register"}</p>
          <h2 style={{ fontFamily: "'Instrument Serif',serif", fontSize: 36, fontStyle: "italic", letterSpacing: "-1px", lineHeight: 1.1 }}>{mode === "login" ? "Welcome back." : "Join HireNest."}</h2>
        </div>
        <div style={{ padding: "36px" }}>
          {error && <div style={{ background: "#4A0C08", color: "#F0B0B0", padding: "10px 14px", fontFamily: "'DM Mono',monospace", fontSize: 11, marginBottom: 20 }}>{error}</div>}
          {mode === "register" && (
            <>
              {FI("Full Name", "name", "text", "John Doe")}
              <div style={{ marginBottom: 20 }}>
                <label style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, color: "var(--muted)", letterSpacing: "0.1em", textTransform: "uppercase", display: "block", marginBottom: 8 }}>I am a</label>
                <div style={{ display: "flex", gap: 1, background: "var(--line)" }}>
                  {["candidate", "employer"].map(r => (
                    <button key={r} onClick={() => setForm(f => ({ ...f, role: r }))} style={{ flex: 1, background: form.role === r ? "var(--ink)" : "var(--cream)", color: form.role === r ? "var(--cream)" : "var(--muted)", border: "none", padding: "12px", fontFamily: "'Syne',sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>{r}</button>
                  ))}
                </div>
              </div>
            </>
          )}
          {FI("Email", "email", "email", "you@example.com")}
          {FI("Password", "password", "password", "••••••••")}
          <button onClick={submit} disabled={loading} style={{ width: "100%", background: "var(--rust)", color: "var(--cream)", border: "none", padding: "15px", fontFamily: "'Syne',sans-serif", fontSize: 12, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 20 }}>
            {loading ? "Please wait..." : mode === "login" ? "Sign In →" : "Create Account →"}
          </button>
          <p style={{ fontFamily: "'DM Mono',monospace", fontSize: 11, color: "var(--muted)", textAlign: "center" }}>
            {mode === "login" ? "No account? " : "Have an account? "}
            <button onClick={() => setPage(mode === "login" ? "register" : "login")} style={{ background: "none", border: "none", color: "var(--rust)", fontFamily: "'DM Mono',monospace", fontSize: 11, textDecoration: "underline", cursor: "pointer" }}>{mode === "login" ? "Register" : "Sign in"}</button>
          </p>
        </div>
      </div>
    </div>
  );
}

function EmployerDash({ setPage }) {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [apps, setApps] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([apiFetch("/employer/jobs"), apiFetch("/employer/applications")])
      .then(([j, a]) => { setJobs(j.jobs || []); const map = {}; (a.applications || []).forEach(app => { map[app.job] = (map[app.job] || 0) + 1; }); setApps(map); })
      .catch(() => setJobs(DEMO_JOBS.slice(0, 4))).finally(() => setLoading(false));
  }, []);

  const deleteJob = async (id) => {
    if (!window.confirm("Delete this job posting?")) return;
    try { await apiFetch(`/jobs/${id}`, { method: "DELETE" }); setJobs(j => j.filter(x => (x._id || x.id) !== id)); } catch (e) { alert(e.message); }
  };

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "48px 48px" }}>
      <div style={{ borderBottom: "2px solid var(--ink)", paddingBottom: 24, marginBottom: 40, display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 16 }}>
        <div>
          <p style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, color: "var(--rust)", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 8 }}>Employer HQ</p>
          <h1 style={{ fontFamily: "'Instrument Serif',serif", fontSize: 40, fontStyle: "italic", letterSpacing: "-1px" }}>Hello, {user?.name}.</h1>
        </div>
        <button onClick={() => setPage("post-job")} style={{ background: "var(--rust)", color: "var(--cream)", border: "none", padding: "14px 28px", fontFamily: "'Syne',sans-serif", fontSize: 12, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase" }}>+ Post New Job</button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 1, background: "var(--line)", marginBottom: 40, border: "1px solid var(--line)" }}>
        {[["Total Jobs", jobs.length], ["Applications", Object.values(apps).reduce((a, b) => a + b, 0)], ["Active", jobs.filter(j => j.status !== "closed").length], ["Closed", jobs.filter(j => j.status === "closed").length]].map(([l, v]) => (
          <div key={l} style={{ background: "var(--cream)", padding: "24px 20px" }}>
            <p style={{ fontFamily: "'DM Mono',monospace", fontSize: 9, color: "var(--muted)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 8 }}>{l}</p>
            <p style={{ fontFamily: "'Instrument Serif',serif", fontSize: 40, fontStyle: "italic", lineHeight: 1 }}>{v}</p>
          </div>
        ))}
      </div>

      <p style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, color: "var(--rust)", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 16 }}>Your Postings</p>
      {loading ? <p style={{ fontFamily: "'DM Mono',monospace", fontSize: 12, color: "var(--muted)" }}>Loading...</p> : jobs.length === 0 ? (
        <div style={{ border: "1px dashed var(--line)", padding: "48px 32px", textAlign: "center" }}>
          <p style={{ fontFamily: "'Instrument Serif',serif", fontSize: 24, fontStyle: "italic", color: "var(--muted)", marginBottom: 12 }}>No postings yet.</p>
          <button onClick={() => setPage("post-job")} style={{ background: "var(--ink)", color: "var(--cream)", border: "none", padding: "12px 24px", fontFamily: "'Syne',sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>Post First Job →</button>
        </div>
      ) : (
        <div style={{ border: "1px solid var(--line)" }}>
          {jobs.map((job, i) => (
            <div key={job._id || job.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 24px", borderBottom: i < jobs.length - 1 ? "1px solid var(--line)" : "none", flexWrap: "wrap", gap: 12 }}>
              <div>
                <p style={{ fontFamily: "'Syne',sans-serif", fontSize: 15, fontWeight: 700, marginBottom: 4 }}>{job.title}</p>
                <div style={{ display: "flex", gap: 20 }}>
                  <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 11, color: "var(--muted)" }}>{job.location}</span>
                  <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 11, color: "var(--muted)" }}>{job.type}</span>
                  <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 11, color: "var(--rust)" }}>{apps[job._id || job.id] || 0} applicants</span>
                </div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => setPage({ name: "post-job", editJob: job })} style={{ background: "none", border: "1px solid var(--line)", color: "var(--muted)", padding: "8px 16px", fontFamily: "'DM Mono',monospace", fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase" }}>Edit</button>
                <button onClick={() => deleteJob(job._id || job.id)} style={{ background: "none", border: "1px solid #C44444", color: "#C44444", padding: "8px 16px", fontFamily: "'DM Mono',monospace", fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase" }}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function PostJobPage({ editJob, setPage }) {
  const [form, setForm] = useState({ title: editJob?.title || "", company: editJob?.company || "", location: editJob?.location || "", type: editJob?.type || "Full-time", salary: editJob?.salary || "", experience: editJob?.experience || "", description: editJob?.description || "", requirements: editJob?.requirements?.join("\n") || "", tags: editJob?.tags?.join(", ") || "" });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);

  const submit = async () => {
    setLoading(true); setMsg(null);
    try {
      const payload = { ...form, requirements: form.requirements.split("\n").filter(Boolean), tags: form.tags.split(",").map(t => t.trim()).filter(Boolean) };
      if (editJob) { await apiFetch(`/jobs/${editJob._id || editJob.id}`, { method: "PUT", body: JSON.stringify(payload) }); setMsg({ type: "success", text: "Job updated." }); }
      else { await apiFetch("/jobs", { method: "POST", body: JSON.stringify(payload) }); setMsg({ type: "success", text: "Job posted." }); setForm({ title: "", company: "", location: "", type: "Full-time", salary: "", experience: "", description: "", requirements: "", tags: "" }); }
    } catch (e) { setMsg({ type: "error", text: e.message }); }
    setLoading(false);
  };

  const FI = (label, key, opts = {}) => (
    <div style={{ marginBottom: 20 }}>
      <label style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, color: "var(--muted)", letterSpacing: "0.1em", textTransform: "uppercase", display: "block", marginBottom: 6 }}>{label}</label>
      {opts.textarea ? (
        <textarea value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} rows={opts.rows || 4} placeholder={opts.placeholder || ""}
          style={{ width: "100%", border: "1px solid var(--line)", borderBottom: "2px solid var(--ink)", background: "none", padding: "12px 14px", fontSize: 13, outline: "none", resize: "vertical", fontFamily: "'DM Mono',monospace" }} />
      ) : opts.select ? (
        <select value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} style={{ width: "100%", border: "1px solid var(--line)", borderBottom: "2px solid var(--ink)", background: "var(--cream)", padding: "12px 14px", fontSize: 13, outline: "none", cursor: "pointer" }}>
          {opts.options.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
      ) : (
        <input value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} placeholder={opts.placeholder || ""}
          style={{ width: "100%", border: "1px solid var(--line)", borderBottom: "2px solid var(--ink)", background: "none", padding: "12px 14px", fontSize: 13, outline: "none" }} />
      )}
    </div>
  );

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "48px 48px" }}>
      <div style={{ borderBottom: "2px solid var(--ink)", paddingBottom: 24, marginBottom: 40 }}>
        <p style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, color: "var(--rust)", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 8 }}>{editJob ? "Edit" : "Post"} a Job</p>
        <h1 style={{ fontFamily: "'Instrument Serif',serif", fontSize: 40, fontStyle: "italic", letterSpacing: "-1px" }}>{editJob ? "Update Listing" : "New Listing"}</h1>
      </div>
      {msg && <div style={{ background: msg.type === "success" ? "#2D5016" : "#4A0C08", color: msg.type === "success" ? "#D4E8B8" : "#F0B0B0", padding: "14px 20px", marginBottom: 24, fontFamily: "'DM Mono',monospace", fontSize: 12 }}>{msg.text}</div>}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 32px" }}>
        {FI("Job Title", "title", { placeholder: "e.g. Senior React Developer" })}
        {FI("Company Name", "company", { placeholder: "e.g. Acme Corp" })}
        {FI("Location", "location", { placeholder: "Delhi / Remote" })}
        {FI("Job Type", "type", { select: true, options: ["Full-time", "Part-time", "Remote", "Internship", "Contract"] })}
        {FI("Salary Range", "salary", { placeholder: "₹8–12 LPA" })}
        {FI("Experience", "experience", { placeholder: "2–4 years" })}
      </div>
      {FI("Job Description", "description", { textarea: true, rows: 6, placeholder: "Describe the role and responsibilities..." })}
      {FI("Requirements", "requirements", { textarea: true, rows: 4, placeholder: "One requirement per line" })}
      {FI("Skills / Tags", "tags", { placeholder: "React, Node.js, MongoDB" })}
      <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
        <button onClick={submit} disabled={loading} style={{ background: "var(--rust)", color: "var(--cream)", border: "none", padding: "15px 36px", fontFamily: "'Syne',sans-serif", fontSize: 12, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase" }}>
          {loading ? "Saving..." : editJob ? "Update →" : "Publish Job →"}
        </button>
        <button onClick={() => setPage("employer-dash")} style={{ background: "none", border: "1px solid var(--line)", padding: "15px 20px", fontFamily: "'DM Mono',monospace", fontSize: 11, color: "var(--muted)", letterSpacing: "0.08em", textTransform: "uppercase" }}>Cancel</button>
      </div>
    </div>
  );
}

function CandidateDash({ setPage }) {
  const { user } = useAuth();
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const STATUS_STYLE = { pending: { bg: "#5C3A1E", text: "#F0D4B0" }, reviewed: { bg: "#1A2E5C", text: "#B0C4F0" }, accepted: { bg: "#2D5016", text: "#D4E8B8" }, rejected: { bg: "#4A1628", text: "#F0B0C4" } };
  useEffect(() => { apiFetch("/candidate/applications").then(d => setApps(d.applications || [])).catch(() => setApps(DEMO_APPS)).finally(() => setLoading(false)); }, []);

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto", padding: "48px 48px" }}>
      <div style={{ borderBottom: "2px solid var(--ink)", paddingBottom: 24, marginBottom: 40, display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 16 }}>
        <div>
          <p style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, color: "var(--rust)", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 8 }}>Your Career</p>
          <h1 style={{ fontFamily: "'Instrument Serif',serif", fontSize: 40, fontStyle: "italic", letterSpacing: "-1px" }}>Hello, {user?.name}.</h1>
        </div>
        <button onClick={() => setPage("jobs")} style={{ background: "var(--ink)", color: "var(--cream)", border: "none", padding: "14px 24px", fontFamily: "'Syne',sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>Browse Jobs →</button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 1, background: "var(--line)", marginBottom: 40, border: "1px solid var(--line)" }}>
        {[["Applied", apps.length], ["Pending", apps.filter(a => a.status === "pending").length], ["Accepted", apps.filter(a => a.status === "accepted").length], ["Rejected", apps.filter(a => a.status === "rejected").length]].map(([l, v]) => (
          <div key={l} style={{ background: "var(--cream)", padding: "24px 20px" }}>
            <p style={{ fontFamily: "'DM Mono',monospace", fontSize: 9, color: "var(--muted)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 8 }}>{l}</p>
            <p style={{ fontFamily: "'Instrument Serif',serif", fontSize: 40, fontStyle: "italic", lineHeight: 1 }}>{v}</p>
          </div>
        ))}
      </div>
      <p style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, color: "var(--rust)", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 16 }}>Application History</p>
      {loading ? <p style={{ fontFamily: "'DM Mono',monospace", fontSize: 12, color: "var(--muted)" }}>Loading...</p> : apps.length === 0 ? (
        <div style={{ border: "1px dashed var(--line)", padding: "48px 32px", textAlign: "center" }}>
          <p style={{ fontFamily: "'Instrument Serif',serif", fontSize: 24, fontStyle: "italic", color: "var(--muted)" }}>No applications yet.</p>
        </div>
      ) : (
        <div style={{ border: "1px solid var(--line)" }}>
          {apps.map((app, i) => {
            const s = STATUS_STYLE[app.status] || STATUS_STYLE.pending;
            return (
              <div key={app._id || i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 24px", borderBottom: i < apps.length - 1 ? "1px solid var(--line)" : "none", flexWrap: "wrap", gap: 12 }}>
                <div>
                  <p style={{ fontFamily: "'Syne',sans-serif", fontSize: 15, fontWeight: 700, marginBottom: 4 }}>{app.jobTitle}</p>
                  <p style={{ fontFamily: "'DM Mono',monospace", fontSize: 11, color: "var(--muted)" }}>{app.company} · {new Date(app.createdAt || Date.now()).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p>
                </div>
                <span style={{ background: s.bg, color: s.text, fontFamily: "'DM Mono',monospace", fontSize: 9, fontWeight: 500, letterSpacing: "0.12em", padding: "5px 14px", textTransform: "uppercase" }}>{app.status || "pending"}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

const DEMO_JOBS = [
  { id: "1", title: "Senior React Developer", company: "TechCorp India", location: "Bangalore / Remote", type: "Full-time", salary: "₹18–25 LPA", experience: "3–5 years", tags: ["React", "TypeScript", "Redux"], description: "Join our growing frontend team to build world-class web applications.", requirements: ["3+ years of React experience", "Strong TypeScript skills", "Experience with state management"] },
  { id: "2", title: "Node.js Backend Engineer", company: "StartupXYZ", location: "Delhi", type: "Full-time", salary: "₹12–18 LPA", experience: "2–4 years", tags: ["Node.js", "MongoDB", "Express"], description: "Build scalable backend services for our B2B SaaS platform." },
  { id: "3", title: "UI/UX Designer", company: "DesignStudio", location: "Remote", type: "Remote", salary: "₹8–14 LPA", experience: "1–3 years", tags: ["Figma", "UI/UX", "Prototyping"], description: "Create beautiful and intuitive user experiences." },
  { id: "4", title: "Full Stack Intern", company: "InnovateTech", location: "Hyderabad", type: "Internship", salary: "₹15–25k/mo", experience: "Fresher", tags: ["React", "Node.js"], description: "6-month internship with pre-placement offer." },
  { id: "5", title: "DevOps Engineer", company: "CloudBase", location: "Mumbai", type: "Full-time", salary: "₹20–30 LPA", experience: "4–6 years", tags: ["AWS", "Docker", "Kubernetes"], description: "Manage and scale our cloud infrastructure." },
  { id: "6", title: "Product Manager", company: "GrowthCo", location: "Pune / Remote", type: "Full-time", salary: "₹22–32 LPA", experience: "3–6 years", tags: ["Product", "Agile"], description: "Lead product strategy and roadmap for our flagship product." },
];
const DEMO_APPS = [
  { jobTitle: "Senior React Developer", company: "TechCorp India", status: "reviewed", createdAt: new Date(Date.now() - 5 * 86400000) },
  { jobTitle: "Full Stack Intern", company: "InnovateTech", status: "accepted", createdAt: new Date(Date.now() - 10 * 86400000) },
  { jobTitle: "UI/UX Designer", company: "DesignStudio", status: "pending", createdAt: new Date(Date.now() - 2 * 86400000) },
];

export default function App() {
  const [page, setPage] = useState("home");
  const [user, setUser] = useState(() => { try { return JSON.parse(localStorage.getItem("user")); } catch { return null; } });
  const login = u => { setUser(u); localStorage.setItem("user", JSON.stringify(u)); };
  const logout = () => { setUser(null); localStorage.removeItem("user"); localStorage.removeItem("token"); setPage("home"); };
  const pageName = typeof page === "string" ? page : page?.name;

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      <G />
      <Navbar page={page} setPage={setPage} />
      {pageName === "home" && <HomePage setPage={setPage} />}
      {pageName === "jobs" && <JobsPage initial={typeof page === "object" ? page : {}} setPage={setPage} />}
      {pageName === "job-detail" && <JobDetailPage jobId={page.id} setPage={setPage} />}
      {pageName === "login" && <AuthPage mode="login" setPage={setPage} onAuth={login} />}
      {pageName === "register" && <AuthPage mode="register" setPage={setPage} onAuth={login} />}
      {pageName === "employer-dash" && <EmployerDash setPage={setPage} />}
      {pageName === "candidate-dash" && <CandidateDash setPage={setPage} />}
      {pageName === "post-job" && <PostJobPage editJob={page?.editJob} setPage={setPage} />}
    </AuthContext.Provider>
  );
}
