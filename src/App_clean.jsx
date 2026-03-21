import { useState, useMemo } from "react";
import { DOMAINS } from "./data/domains";
import { TOPICS } from "./data/topics";

// ─── Chip Component ───────────────────────────────────────────────────────────
function Chip({ domain }) {
  const d = DOMAINS[domain];
  if (!d) return null;
  return (
    <span
      className="chip"
      style={{ background: d.dim, color: d.color, border: `1px solid ${d.color}28` }}
    >
      {d.label}
    </span>
  );
}

// ─── Info Block Component ─────────────────────────────────────────────────────
function InfoBlock({ icon, label, value, color }) {
  return (
    <div className="info-block" style={{ borderLeftColor: color }}>
      <div className="info-label" style={{ color }}>
        {icon} {label}
      </div>
      <div className="info-value">{value}</div>
    </div>
  );
}

// ─── Method Detail Component ──────────────────────────────────────────────────
function MethodDetail({ method }) {
  const primaryColor = DOMAINS[method.domains[0]]?.color ?? "#60a5fa";
  return (
    <div className="method-detail detail-enter">
      <p className="method-what">{method.what}</p>
      <InfoBlock icon="→" label="INPUTS" color="#38bdf8" value={method.inputs} />
      <InfoBlock icon="←" label="OUTPUTS" color="#4ade80" value={method.outputs} />
      <InfoBlock icon="△" label="ASSUMPTIONS" color="#facc15" value={method.assumptions} />
      <InfoBlock icon="◆" label="NOTES" color={primaryColor} value={method.notes} />
    </div>
  );
}

// ─── Topic Page Component ─────────────────────────────────────────────────────
function TopicPage({ topic, onBack, domainFilter, setDomainFilter }) {
  const [openId, setOpenId] = useState(null);
  const methods =
    domainFilter === "all"
      ? topic.methods
      : topic.methods.filter((m) => m.domains.includes(domainFilter));
  const usedDomains = [...new Set(topic.methods.flatMap((m) => m.domains))];

  return (
    <div className="topic-page page-enter">
      <div className="back" onClick={onBack}>
        <span style={{ fontSize: 17 }}>←</span> All Topics
      </div>

      <div className="topic-header">
        <div className="topic-icon">{topic.icon}</div>
        <h1 className="topic-title">{topic.name}</h1>
        <p className="topic-summary">{topic.summary}</p>
      </div>

      {/* Domain Filter */}
      <div className="domain-filter">
        {["all", ...usedDomains].map((key) => {
          const isAll = key === "all";
          const active = domainFilter === key;
          const d = DOMAINS[key];
          return (
            <button
              key={key}
              className="domain-filter-button"
              onClick={() => setDomainFilter(key)}
              style={{
                background: active
                  ? isAll
                    ? "rgba(148,163,184,0.15)"
                    : d.dim
                  : "transparent",
                color: active ? (isAll ? "#94a3b8" : d.color) : "#3a5270",
                borderColor: active ? (isAll ? "#475569" : d.color) : "#0f1e38",
              }}
            >
              {isAll ? "All" : d.label}
            </button>
          );
        })}
      </div>

      {/* Methods List */}
      <div className="methods-list">
        {methods.length === 0 && (
          <div className="empty-state">No methods match this filter.</div>
        )}
        {methods.map((m) => {
          const isOpen = openId === m.id;
          const primary = DOMAINS[m.domains[0]]?.color ?? "#60a5fa";
          return (
            <div
              key={m.id}
              className="method-item"
              style={{
                borderColor: isOpen ? primary + "45" : "#0d1e38",
              }}
            >
              <div
                className="method-header method-row"
                onClick={() => setOpenId(isOpen ? null : m.id)}
                style={{ background: isOpen ? "#091525" : "#07101e" }}
              >
                <div className="method-header-left">
                  <div
                    className="method-dot"
                    style={{
                      background: primary,
                      opacity: isOpen ? 1 : 0.35,
                    }}
                  />
                  <span className="method-name" style={{ color: isOpen ? "#e2e8f0" : "#7a95b5" }}>
                    {m.name}
                  </span>
                </div>
                <div className="method-header-right">
                  {m.domains.map((d) => (
                    <Chip key={d} domain={d} />
                  ))}
                  <span
                    className="method-chevron"
                    style={{
                      transform: isOpen ? "rotate(90deg)" : "none",
                    }}
                  >
                    ›
                  </span>
                </div>
              </div>
              {isOpen && <MethodDetail method={m} />}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Search Results Component ─────────────────────────────────────────────────
function SearchResults({ query, onSelectMethod }) {
  const results = useMemo(() => {
    const q = query.toLowerCase();
    return TOPICS.flatMap((t) =>
      t.methods
        .filter((m) =>
          [m.name, m.what, m.inputs, m.outputs, m.notes, t.name].some(
            (s) => s?.toLowerCase().includes(q),
          ),
        )
        .map((m) => ({ topic: t, method: m })),
    ).slice(0, 24);
  }, [query]);

  return (
    <div className="search-results-page page-enter">
      <div className="search-results-header">
        <span className="search-results-count">
          {results.length} RESULT{results.length !== 1 ? "S" : ""} FOR "{query.toUpperCase()}"
        </span>
      </div>
      {results.length === 0 && (
        <div className="empty-state">Nothing found. Try a different term.</div>
      )}
      <div className="search-results-list">
        {results.map(({ topic, method }) => (
          <div
            key={method.id}
            className="search-result-item search-row"
            onClick={() => onSelectMethod(topic, method)}
          >
            <div className="search-result-header">
              <div className="search-result-title-container">
                <span className="search-result-method-name">{method.name}</span>
                <span className="search-result-topic">
                  {topic.icon} {topic.name}
                </span>
              </div>
              <div className="search-result-domains">
                {method.domains.map((d) => (
                  <Chip key={d} domain={d} />
                ))}
              </div>
            </div>
            <p className="search-result-excerpt">{method.what.slice(0, 130)}…</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Home Page Component ──────────────────────────────────────────────────────
function HomePage({ onSelectTopic }) {
  const totalMethods = TOPICS.reduce((s, t) => s + t.methods.length, 0);
  return (
    <div className="home-page page-enter">
      {/* Hero Section */}
      <div className="hero">
        <div className="hero-content">
          <div className="hero-badge">
            <div className="hero-badge-dot" />
            <span className="hero-badge-text">DATA SCIENCE REFERENCE</span>
          </div>
          <h1 className="hero-title">The Data Science Atlas</h1>
          <p className="hero-subtitle">
            {TOPICS.length} topics · {totalMethods} methods. Pick a topic to explore the models
            and techniques inside it.
          </p>
        </div>
      </div>

      {/* Topic Grid */}
      <div className="grid-container">
        <div className="topic-grid">
          {TOPICS.map((t, i) => {
            const accent = DOMAINS[t.methods[0]?.domains[0]]?.color ?? "#60a5fa";
            const chips = [...new Set(t.methods.flatMap((m) => m.domains))].slice(0, 3);
            return (
              <div
                key={t.id}
                className="topic-card card-hover"
                onClick={() => onSelectTopic(t)}
                style={{
                  animationDelay: `${i * 0.03}s`,
                }}
              >
                <div
                  className="topic-card-bar"
                  style={{
                    background: `linear-gradient(90deg, ${accent}80, transparent)`,
                  }}
                />
                <div className="topic-card-header">
                  <span className="topic-card-icon">{t.icon}</span>
                  <span className="topic-card-count">{t.methods.length} methods</span>
                </div>
                <h3 className="topic-card-title">{t.name}</h3>
                <p className="topic-card-summary">{t.summary}</p>
                <div className="topic-card-chips">
                  {chips.map((d) => (
                    <Chip key={d} domain={d} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Main App Component ────────────────────────────────────────────────────────
export default function App() {
  const [view, setView] = useState({ type: "home" });
  const [search, setSearch] = useState("");
  const [domainFilter, setDomainFilter] = useState("all");

  const totalMethods = TOPICS.reduce((s, t) => s + t.methods.length, 0);

  function goHome() {
    setView({ type: "home" });
    setSearch("");
    setDomainFilter("all");
  }

  function handleSearch(val) {
    setSearch(val);
    if (val.trim().length > 1) {
      setView({ type: "search" });
    } else if (!val) {
      setView((v) => (v.type === "search" ? { type: "home" } : v));
    }
  }

  function handleSelectTopic(topic) {
    setView({ type: "topic", topic });
    setSearch("");
    setDomainFilter("all");
  }

  function handleSelectMethod(topic, method) {
    setView({ type: "topic", topic, jumpTo: method.id });
    setSearch("");
    setDomainFilter("all");
  }

  return (
    <div style={{ background: "#070d1b", minHeight: "100vh" }}>
      {/* Header */}
      <div className="header">
        <div className="header-content">
          {/* Wordmark */}
          <div className="wordmark" onClick={goHome}>
            <span className="wordmark-title">DS Atlas</span>
            <span className="wordmark-count">{totalMethods} methods</span>
          </div>

          <div className="header-divider" />

          {/* Breadcrumb */}
          {view.type === "topic" && <div className="breadcrumb">{view.topic.icon} {view.topic.name}</div>}

          {/* Search */}
          <div className="search-box">
            <span className="search-icon">⌕</span>
            <input
              className="search-box-input"
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search any method or concept…"
            />
            {search && (
              <span
                className="search-clear"
                onClick={() => {
                  setSearch("");
                  if (view.type === "search") goHome();
                }}
              >
                ✕
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Page Content */}
      {view.type === "home" && <HomePage onSelectTopic={handleSelectTopic} />}
      {view.type === "search" && (
        <SearchResults query={search} onSelectMethod={handleSelectMethod} />
      )}
      {view.type === "topic" && (
        <TopicPage
          topic={view.topic}
          onBack={goHome}
          domainFilter={domainFilter}
          setDomainFilter={setDomainFilter}
        />
      )}
    </div>
  );
}
