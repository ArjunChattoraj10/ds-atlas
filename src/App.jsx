import { useEffect, useMemo, useState } from "react";
import { DOMAINS } from "./data/domains";
import { TOPICS } from "./data/topics";

const THEME_STORAGE_KEY = "ds-atlas-theme";

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
      {method.description && (
        <div className="method-description">
          <span className="method-description-label">💡 In Plain English</span>
          <p className="method-description-text">{method.description}</p>
        </div>
      )}
      <p className="method-what">{method.what}</p>
      {(method.pros || method.cons) && (
        <div className="pros-cons-row">
          {method.pros && (
            <div className="info-block pros-block" style={{ borderLeftColor: "#4ade80" }}>
              <div className="info-label" style={{ color: "#4ade80" }}>✓ PROS</div>
              <ul className="pros-cons-list">
                {method.pros.map((p, i) => <li key={i}>{p}</li>)}
              </ul>
            </div>
          )}
          {method.cons && (
            <div className="info-block cons-block" style={{ borderLeftColor: "#f87171" }}>
              <div className="info-label" style={{ color: "#f87171" }}>✗ CONS</div>
              <ul className="pros-cons-list">
                {method.cons.map((c, i) => <li key={i}>{c}</li>)}
              </ul>
            </div>
          )}
        </div>
      )}
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
                    ? "var(--domain-filter-all-active-bg)"
                    : d.dim
                  : "transparent",
                color: active
                  ? isAll
                    ? "var(--domain-filter-all-active-text)"
                    : d.color
                  : "var(--domain-filter-inactive-text)",
                borderColor: active
                  ? isAll
                    ? "var(--domain-filter-all-active-border)"
                    : d.color
                  : "var(--domain-filter-inactive-border)",
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
                borderColor: isOpen ? primary + "45" : "var(--method-item-border)",
              }}
            >
              <div
                className="method-header method-row"
                onClick={() => setOpenId(isOpen ? null : m.id)}
                style={{
                  background: isOpen
                    ? "var(--method-header-open-bg)"
                    : "var(--method-header-closed-bg)",
                }}
              >
                <div className="method-header-left">
                  <div
                    className="method-dot"
                    style={{
                      background: primary,
                      opacity: isOpen ? 1 : 0.35,
                    }}
                  />
                  <div className="method-name-chips">
                    <span
                      className="method-name"
                      style={{
                        color: isOpen ? "var(--method-name-open)" : "var(--method-name-closed)",
                      }}
                    >
                      {m.name}
                    </span>
                    <div className="method-chips">
                      {m.domains.map((d) => (
                        <Chip key={d} domain={d} />
                      ))}
                    </div>
                  </div>
                </div>
                <span
                  className="method-chevron"
                  style={{
                    transform: isOpen ? "rotate(90deg)" : "none",
                  }}
                >
                  ›
                </span>
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
            <p className="search-result-excerpt">{method.what.slice(0, 130)}…</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Home Page Component ──────────────────────────────────────────────────────
function HomePage({ onSelectTopic, homeLayout, setHomeLayout }) {
  return (
    <div className="home-page page-enter">
      {/* Hero Section */}
      <div className="hero">
        <div className="hero-content">
          <h1 className="hero-title">The Data Science Atlas</h1>
          <p className="hero-subtitle">
            Pick a topic to explore the models
            and techniques inside it.
          </p>
        </div>
      </div>

      {/* Topic Grid/List */}
      <div className="grid-container">
        <div className="home-controls">
          <div className="layout-toggle" aria-label="Choose homepage layout">
            <button
              className={`layout-toggle-button${homeLayout === "grid" ? " active" : ""}`}
              onClick={() => setHomeLayout("grid")}
            >
              Tiles
            </button>
            <button
              className={`layout-toggle-button${homeLayout === "list" ? " active" : ""}`}
              onClick={() => setHomeLayout("list")}
            >
              List
            </button>
          </div>
        </div>
        {homeLayout === "list" ? (
          <div className="topic-list">
            {TOPICS.map((t, i) => {
              const accent = DOMAINS[t.methods[0]?.domains[0]]?.color ?? "#60a5fa";
              const chips = [...new Set(t.methods.flatMap((m) => m.domains))].slice(0, 4);
              return (
                <div
                  key={t.id}
                  className="topic-list-item card-hover"
                  onClick={() => onSelectTopic(t)}
                  style={{
                    animationDelay: `${i * 0.03}s`,
                  }}
                >
                  <div className="topic-list-accent" style={{ background: accent }} />
                  <div className="topic-list-content">
                    <div className="topic-list-main">
                      <div className="topic-list-title-row">
                        <span className="topic-list-icon">{t.icon}</span>
                        <h3 className="topic-list-title">{t.name}</h3>
                        <span className="topic-list-count">{t.methods.length} methods</span>
                      </div>
                      <p className="topic-list-summary">{t.summary}</p>
                    </div>
                    <div className="topic-list-chips">
                      {chips.map((d) => (
                        <Chip key={d} domain={d} />
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
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
        )}
      </div>
    </div>
  );
}

// ─── Main App Component ────────────────────────────────────────────────────────
export default function App() {
  const [view, setView] = useState({ type: "home" });
  const [theme, setTheme] = useState(() => {
    if (typeof window === "undefined") return "dark";
    const savedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
    return savedTheme === "light" || savedTheme === "dark" ? savedTheme : "dark";
  });
  const [homeLayout, setHomeLayout] = useState("grid");
  const [search, setSearch] = useState("");
  const [domainFilter, setDomainFilter] = useState("all");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

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
    <div className="app-shell">
      {/* Header */}
      <div className="header">
        <div className="header-content">
          {/* Wordmark */}
          <div className="wordmark" onClick={goHome}>
            <span className="wordmark-title">DS Atlas</span>
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

          <div className="theme-toggle" aria-label="Theme">
            <button
              className="theme-toggle-button"
              onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
              aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            >
              <span className="theme-toggle-icon" aria-hidden="true">
                {theme === "dark" ? "☀" : "☾"}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Page Content */}
      {view.type === "home" && (
        <HomePage
          onSelectTopic={handleSelectTopic}
          homeLayout={homeLayout}
          setHomeLayout={setHomeLayout}
        />
      )}
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
