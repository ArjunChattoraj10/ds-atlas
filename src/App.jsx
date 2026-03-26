import { useEffect, useMemo, useRef, useState } from "react";
import { DOMAINS } from "./data/domains";
import { TOPICS } from "./data/topics";
import { USE_CASE_CATEGORIES } from "./data/useCases";
import { prepareSearchDocuments, runSmartSearch } from "./search/smartSearch";

const THEME_STORAGE_KEY = "ds-atlas-theme";
const HERO_TITLE = "The Data Science Atlas";
const HERO_SUBTITLE = (
  <>
    A Gallery of Use Cases and Methods
  </>
);

function getInitialActiveTab() {
  return "usecases";
}

function getHeaderOffset() {
  if (typeof window === "undefined") return 0;
  const header = window.document.querySelector(".header");
  return (header?.getBoundingClientRect().height ?? 0) + 8;
}

function scrollToSectionTop(element) {
  if (typeof window === "undefined") return;
  if (!element) {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    return;
  }
  const targetTop = element.getBoundingClientRect().top + window.scrollY - getHeaderOffset();
  window.scrollTo({ top: Math.max(0, targetTop), left: 0, behavior: "auto" });
}

const METHOD_SEARCH_INDEX = prepareSearchDocuments(
  TOPICS.flatMap((topic) =>
    topic.methods.map((method) => {
      const domainLabels = method.domains
        .map((domain) => DOMAINS[domain]?.label ?? domain)
        .join(" ");
      const methodDetails = [
        method.what,
        method.inputs,
        method.outputs,
        method.assumptions,
        method.notes,
      ]
        .filter(Boolean)
        .join(" ");

      return {
        id: `${topic.id}:${method.id}`,
        payload: { topic, method },
        fields: [
          { label: "Method name", text: method.name, weight: 12 },
          { label: "Topic", text: [topic.name, topic.summary].filter(Boolean).join(" "), weight: 8 },
          { label: "Domain", text: domainLabels, weight: 8 },
          { label: "In plain English", text: method.description, weight: 7 },
          { label: "Method details", text: methodDetails, weight: 5 },
          { label: "Pros and cons", text: [...(method.pros ?? []), ...(method.cons ?? [])].join(" "), weight: 3 },
          {
            label: "Related methods",
            text: (method.seeAlso ?? []).map((item) => item.label).join(" "),
            weight: 3,
          },
        ],
      };
    }),
  ),
);

const USE_CASE_SEARCH_INDEX = prepareSearchDocuments(
  USE_CASE_CATEGORIES.flatMap((category, categoryIndex) =>
    category.useCases.map((useCase) => ({
      id: `${category.id}:${useCase.id}`,
      payload: { category, categoryIndex, useCase },
      fields: [
        { label: "Use case", text: useCase.name, weight: 12 },
        {
          label: "Business domain",
          text: [category.name, category.description].filter(Boolean).join(" "),
          weight: 8,
        },
        { label: "Problem", text: useCase.description, weight: 7 },
        { label: "How it works", text: useCase.poweredBy, weight: 5 },
        { label: "Examples", text: (useCase.examples ?? []).join(" "), weight: 4 },
        {
          label: "Related methods",
          text: (useCase.relatedMethods ?? []).map((item) => item.name).join(" "),
          weight: 6,
        },
      ],
    })),
  ),
);

function getUrlForView(view) {
  const params = new URLSearchParams();
  params.set("tab", "models");

  if (view.type === "topic") {
    params.set("topic", view.topic.id);
    if (view.jumpTo) {
      params.set("method", view.jumpTo);
    }
    return `/?${params.toString()}`;
  }
  if (view.type === "search" && view.query?.trim().length > 0) {
    params.set("q", view.query);
    return `/?${params.toString()}`;
  }
  return `/?${params.toString()}`;
}

function getViewFromLocation(location) {
  if (!location) {
    return { type: "home" };
  }
  const url = new URL(location.href);
  if (url.searchParams.get("tab") !== "models") {
    return { type: "home" };
  }

  const topicFromQuery = url.searchParams.get("topic");
  if (topicFromQuery) {
    const topic = TOPICS.find((t) => t.id === topicFromQuery);
    if (topic) {
      const jumpTo = url.searchParams.get("method") ?? undefined;
      return { type: "topic", topic, jumpTo };
    }
  }
  const topicMatch = url.pathname.match(/^\/topic\/([^/]+)(?:\/|$)/);
  if (topicMatch) {
    const topic = TOPICS.find((t) => t.id === topicMatch[1]);
    if (topic) {
      const jumpTo = url.searchParams.get("method") ?? undefined;
      return { type: "topic", topic, jumpTo };
    }
  }
  const query = url.searchParams.get("q") ?? "";
  if (query.trim().length > 1) {
    return { type: "search", query };
  }
  return { type: "home" };
}

function getUseCasesRouteStateFromLocation(location) {
  if (!location) {
    return null;
  }
  const url = new URL(location.href);
  const tab = url.searchParams.get("tab");
  if (tab && tab !== "usecases") {
    return null;
  }

  const query = url.searchParams.get("q") ?? "";
  const categoryId = url.searchParams.get("category");
  const openUseCaseId = url.searchParams.get("usecase");

  if (!categoryId) {
    return {
      ucView: { type: "home" },
      search: query,
    };
  }

  const categoryIndex = USE_CASE_CATEGORIES.findIndex((category) => category.id === categoryId);
  if (categoryIndex < 0) {
    return {
      ucView: { type: "home" },
      search: query,
    };
  }

  const category = USE_CASE_CATEGORIES[categoryIndex];
  const openId = category.useCases.some((item) => item.id === openUseCaseId) ? openUseCaseId : null;

  return {
    ucView: { type: "category", category, categoryIndex, openUseCaseId: openId },
    search: query,
  };
}

function getUrlForAppState({ view, activeTab, ucView, search }) {
  if (activeTab === "usecases") {
    const params = new URLSearchParams();
    params.set("tab", "usecases");

    if (ucView?.type === "category" && ucView.category?.id) {
      params.set("category", ucView.category.id);
      if (ucView.openUseCaseId) {
        params.set("usecase", ucView.openUseCaseId);
      }
    }

    if ((search ?? "").trim().length > 1) {
      params.set("q", search);
    }

    return `/?${params.toString()}`;
  }

  return getUrlForView(view);
}

function serializeUcViewForHistory(ucView) {
  if (!ucView || ucView.type !== "category") {
    return { type: "home" };
  }
  return {
    type: "category",
    categoryId: ucView.category?.id ?? null,
    categoryIndex: ucView.categoryIndex ?? -1,
    openUseCaseId: ucView.openUseCaseId ?? null,
  };
}

function restoreUcViewFromHistory(historyUcView) {
  if (!historyUcView || historyUcView.type !== "category") {
    return { type: "home" };
  }
  const categoryById = historyUcView.categoryId
    ? USE_CASE_CATEGORIES.find((category) => category.id === historyUcView.categoryId)
    : undefined;
  const categoryByIndex = Number.isInteger(historyUcView.categoryIndex)
    ? USE_CASE_CATEGORIES[historyUcView.categoryIndex]
    : undefined;
  const category = categoryById ?? categoryByIndex;
  if (!category) {
    return { type: "home" };
  }
  const categoryIndex = USE_CASE_CATEGORIES.findIndex((item) => item.id === category.id);
  const openUseCaseId = category.useCases.some((item) => item.id === historyUcView.openUseCaseId)
    ? historyUcView.openUseCaseId
    : null;
  return { type: "category", category, categoryIndex, openUseCaseId };
}

function buildAppHistoryState({ view, activeTab, ucView, search, domainFilter }) {
  return {
    __dsAtlasState: true,
    view,
    activeTab: activeTab === "models" ? "models" : "usecases",
    ucView: serializeUcViewForHistory(ucView),
    search: typeof search === "string" ? search : "",
    domainFilter: typeof domainFilter === "string" ? domainFilter : "all",
    historyIndex: 0,
  };
}

function parseAppHistoryState(state, location) {
  if (!state || state.__dsAtlasState !== true) {
    return null;
  }
  const view = state.view && typeof state.view.type === "string"
    ? state.view
    : getViewFromLocation(location);
  return {
    view,
    activeTab: state.activeTab === "models" ? "models" : "usecases",
    ucView: restoreUcViewFromHistory(state.ucView),
    search: typeof state.search === "string"
      ? state.search
      : view.type === "search"
        ? view.query ?? ""
        : "",
    domainFilter: typeof state.domainFilter === "string" ? state.domainFilter : "all",
    historyIndex:
      Number.isInteger(state.historyIndex) && state.historyIndex >= 0 ? state.historyIndex : 0,
  };
}

function getInitialAppState() {
  if (typeof window === "undefined") {
    return {
      view: { type: "home" },
      activeTab: "usecases",
      ucView: { type: "home" },
      search: "",
      domainFilter: "all",
      historyIndex: 0,
    };
  }
  const parsed = parseAppHistoryState(window.history.state, window.location);
  if (parsed) {
    if ((window.history.state?.historyIndex ?? 0) <= 0) {
      parsed.historyIndex = 1;
    }
    return parsed;
  }
  const useCasesRoute = getUseCasesRouteStateFromLocation(window.location);
  if (useCasesRoute) {
    return {
      view: { type: "home" },
      activeTab: "usecases",
      ucView: useCasesRoute.ucView,
      search: useCasesRoute.search,
      domainFilter: "all",
      historyIndex: 1,
    };
  }

  const view = getViewFromLocation(window.location);
  return {
    view,
    activeTab: view.type === "home" ? getInitialActiveTab() : "models",
    ucView: { type: "home" },
    search: view.type === "search" ? view.query : "",
    domainFilter: "all",
    historyIndex: 1,
  };
}

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

function AtlasHero({ className = "hero" }) {
  return (
    <div className={className}>
      <div className="hero-content">
        <h1 className="hero-title">{HERO_TITLE}</h1>
        <p className="hero-subtitle">{HERO_SUBTITLE}</p>
      </div>
    </div>
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
function MethodDetail({ method, onNavigateTopic }) {
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
      {method.seeAlso && method.seeAlso.length > 0 && onNavigateTopic && (
        <div className="info-block" style={{ borderLeftColor: "#a78bfa" }}>
          <div className="info-label" style={{ color: "#a78bfa" }}>🔗 SEE ALSO</div>
          <div className="uc-related-methods">
            {method.seeAlso.map((ref) => (
              <span
                key={ref.topicId}
                className="uc-method-link method-see-also-link"
                onClick={() => onNavigateTopic(ref.topicId)}
              >
                {ref.label}<span className="uc-method-link-arrow">→</span>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Topic Page Component ─────────────────────────────────────────────────────
function TopicPage({
  topic,
  onBack,
  domainFilter,
  setDomainFilter,
  defaultOpenId,
  onNavigateTopic,
  onToggleMethod,
}) {
  const [openId, setOpenId] = useState(defaultOpenId ?? null);
  const topicPageRef = useRef(null);
  const previousTopicIdRef = useRef(null);
  const methods =
    domainFilter === "all"
      ? topic.methods
      : topic.methods.filter((m) => m.domains.includes(domainFilter));
  const usedDomains = [...new Set(topic.methods.flatMap((m) => m.domains))];

  useEffect(() => {
    if (typeof window === "undefined") return;
    const topicChanged = previousTopicIdRef.current !== topic.id;
    previousTopicIdRef.current = topic.id;

    if (!topicChanged && !defaultOpenId) {
      return;
    }

    if (defaultOpenId) {
      requestAnimationFrame(() => {
        const methodNode = topicPageRef.current?.querySelector(`[data-method-id="${defaultOpenId}"]`);
        scrollToSectionTop(methodNode ?? topicPageRef.current);
      });
      return;
    }
    requestAnimationFrame(() => {
      scrollToSectionTop(topicPageRef.current);
    });
  }, [topic.id, defaultOpenId]);

  return (
    <div className="topic-page page-enter" ref={topicPageRef}>
      <div className="back" onClick={onBack}>
        <span style={{ fontSize: 17 }}>←</span> Back
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
              data-method-id={m.id}
              className="method-item"
              style={{
                borderColor: isOpen ? primary + "45" : "var(--method-item-border)",
              }}
            >
              <div
                className="method-header method-row"
                onClick={() => {
                  const nextOpenId = isOpen ? null : m.id;
                  setOpenId(nextOpenId);
                  onToggleMethod?.(nextOpenId);
                }}
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
              {isOpen && <MethodDetail method={m} onNavigateTopic={onNavigateTopic} />}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Search Results Component ─────────────────────────────────────────────────
const MODEL_SEARCH_SUGGESTIONS = [
  "predict customer churn",
  "detect fraud transactions",
  "explain model predictions",
  "summarize long text",
  "time series forecasting",
];

const USE_CASE_SEARCH_SUGGESTIONS = [
  "reduce customer churn",
  "find fraudulent payments",
  "improve marketing ROI",
  "forecast sales revenue",
  "automate support tickets",
];

function SearchResults({ query, onSelectMethod, onApplySuggestion }) {
  const searchResultsRef = useRef(null);
  const results = useMemo(() => {
    return runSmartSearch(METHOD_SEARCH_INDEX, query, { limit: 30, minScore: 5 });
  }, [query]);
  const topResult = results[0];
  const confidence = topResult ? Math.min(99, Math.round(topResult.matchCoverage * 100)) : 0;

  useEffect(() => {
    if (typeof window === "undefined") return;
    requestAnimationFrame(() => {
      scrollToSectionTop(searchResultsRef.current);
    });
  }, [query]);

  return (
    <div className="search-results-page page-enter" ref={searchResultsRef}>
      <div className="search-results-header">
        <span className="search-results-count">
          {results.length} RANKED RESULT{results.length !== 1 ? "S" : ""} FOR "{query.toUpperCase()}"
        </span>
        <p className="search-results-subtitle">
          Smart search is using intent, synonyms, and typo-tolerance.
          {topResult ? ` Best match confidence: ${confidence}%.` : ""}
        </p>
      </div>
      {results.length === 0 && (
        <>
          <div className="empty-state">
            No strong match yet. Try describing your goal in plain English.
          </div>
          <div className="search-suggestion-row">
            {MODEL_SEARCH_SUGGESTIONS.map((suggestion) => (
              <button
                key={suggestion}
                className="search-suggestion-chip"
                onClick={() => onApplySuggestion(suggestion)}
              >
                {suggestion}
              </button>
            ))}
          </div>
        </>
      )}
      <div className="search-results-list">
        {results.map(({ topic, method, score, reasons }, index) => (
          <div
            key={`${method.id}-${topic.id}`}
            className="search-result-item search-row"
            onClick={() => onSelectMethod(topic, method)}
          >
            <div className="search-result-header">
              <div className="search-result-title-group">
                <span className="search-result-rank">#{index + 1}</span>
                <span className="search-result-method-name">{method.name}</span>
              </div>
              <div className="search-result-meta-group">
                <span className="search-result-topic">
                  {topic.icon} {topic.name}
                </span>
                <span className="search-result-score">
                  Match {Math.min(99, Math.round((score / 30) * 100))}%
                </span>
              </div>
            </div>
            <div className="search-result-domains">
              {method.domains.map((d) => (
                <Chip key={d} domain={d} />
              ))}
            </div>
            {reasons.length > 0 && (
              <div className="search-result-reasons">
                {reasons.slice(0, 3).map((reason) => (
                  <span key={reason} className="search-result-reason">
                    {reason}
                  </span>
                ))}
              </div>
            )}
            <p className="search-result-excerpt">
              {(method.description ?? method.what).slice(0, 155)}…
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Use Case Category Colors ─────────────────────────────────────────────────
const UC_COLORS = [
  "#818cf8", "#60a5fa", "#4ade80", "#c084fc", "#f87171",
  "#fb923c", "#38bdf8", "#facc15", "#2dd4bf", "#f472b6",
  "#a78bfa", "#34d399", "#fbbf24", "#f97316", "#06b6d4",
];

function getUCColor(index) {
  return UC_COLORS[index % UC_COLORS.length];
}

// ─── Use Case Detail Card ─────────────────────────────────────────────────────
function UseCaseDetail({ useCase, onNavigateToMethod }) {
  return (
    <div className="uc-card-body">
      <p className="uc-card-description">{useCase.description}</p>
      <div className="uc-card-section" style={{ borderLeftColor: "#60a5fa" }}>
        <div className="uc-card-section-label" style={{ color: "#60a5fa" }}>
          📌 REAL-WORLD EXAMPLES
        </div>
        <ul className="uc-examples-list">
          {useCase.examples.map((ex, i) => (
            <li key={i}>{ex}</li>
          ))}
        </ul>
      </div>
      <div className="uc-card-section" style={{ borderLeftColor: "#c084fc" }}>
        <div className="uc-card-section-label" style={{ color: "#c084fc" }}>
          ⚡ HOW IT WORKS
        </div>
        <div className="uc-card-section-text">{useCase.poweredBy}</div>
      </div>
      {useCase.relatedMethods && useCase.relatedMethods.length > 0 && (
        <div className="uc-card-section" style={{ borderLeftColor: "#4ade80" }}>
          <div className="uc-card-section-label" style={{ color: "#4ade80" }}>
            🔗 APPLICABLE METHODS
          </div>
          <div className="uc-related-methods">
            {useCase.relatedMethods.map((rm) => (
              <button
                key={rm.methodId}
                className="uc-method-link"
                onClick={(e) => { e.stopPropagation(); onNavigateToMethod(rm.topicId, rm.methodId); }}
                title={`View ${rm.name} in Models`}
              >
                {rm.name}
                <span className="uc-method-link-arrow">↗</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Use Case Category Page ───────────────────────────────────────────────────
function UseCaseCategoryPage({
  category,
  categoryIndex,
  openUseCaseId,
  onBack,
  onNavigateToMethod,
  onToggleUseCase,
}) {
  const accent = getUCColor(categoryIndex);
  const categoryPageRef = useRef(null);
  const previousCategoryIdRef = useRef(category.id);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const categoryChanged = previousCategoryIdRef.current !== category.id;
    previousCategoryIdRef.current = category.id;

    if (!categoryChanged && !openUseCaseId) {
      return;
    }

    requestAnimationFrame(() => {
      if (openUseCaseId) {
        const useCaseNode =
          categoryPageRef.current?.querySelector(`[data-usecase-id="${openUseCaseId}"]`);
        scrollToSectionTop(useCaseNode ?? categoryPageRef.current);
        return;
      }
      scrollToSectionTop(categoryPageRef.current);
    });
  }, [category.id, openUseCaseId]);

  return (
    <div className="uc-detail-page page-enter" ref={categoryPageRef}>
      <div className="back" onClick={onBack}>
        <span style={{ fontSize: 17 }}>←</span> Back
      </div>

      <div className="uc-detail-header">
        <div className="uc-detail-icon">{category.icon}</div>
        <h1 className="uc-detail-title">{category.name}</h1>
        <p className="uc-detail-desc">{category.description}</p>
      </div>

      <div className="uc-list">
        {category.useCases.map((uc) => {
          const isOpen = openUseCaseId === uc.id;
          return (
            <div
              key={uc.id}
              data-usecase-id={uc.id}
              className="uc-card"
              style={{
                borderColor: isOpen ? accent + "45" : "var(--method-item-border)",
              }}
            >
              <div
                className="uc-card-header"
                onClick={() => onToggleUseCase(isOpen ? null : uc.id)}
                style={{
                  background: isOpen
                    ? "var(--method-header-open-bg)"
                    : "var(--method-header-closed-bg)",
                }}
              >
                <div className="uc-card-header-left">
                  <div
                    className="uc-card-dot"
                    style={{
                      background: accent,
                      opacity: isOpen ? 1 : 0.35,
                    }}
                  />
                  <span
                    className="uc-card-name"
                    style={{
                      color: isOpen ? "var(--method-name-open)" : "var(--method-name-closed)",
                    }}
                  >
                    {uc.name}
                  </span>
                </div>
                <span
                  className="uc-card-chevron"
                  style={{
                    transform: isOpen ? "rotate(90deg)" : "none",
                  }}
                >
                  ›
                </span>
              </div>
              {isOpen && <UseCaseDetail useCase={uc} onNavigateToMethod={onNavigateToMethod} />}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Use Cases Search Results ─────────────────────────────────────────────────
function UseCasesSearchResults({ query, onSelectUseCase, onApplySuggestion }) {
  const useCaseSearchResultsRef = useRef(null);
  const results = useMemo(() => {
    return runSmartSearch(USE_CASE_SEARCH_INDEX, query, { limit: 30, minScore: 5 });
  }, [query]);
  const topResult = results[0];
  const confidence = topResult ? Math.min(99, Math.round(topResult.matchCoverage * 100)) : 0;

  useEffect(() => {
    if (typeof window === "undefined") return;
    requestAnimationFrame(() => {
      scrollToSectionTop(useCaseSearchResultsRef.current);
    });
  }, [query]);

  return (
    <div className="uc-search-results-page page-enter" ref={useCaseSearchResultsRef}>
      <div className="search-results-header">
        <span className="search-results-count">
          {results.length} RANKED RESULT{results.length !== 1 ? "S" : ""} FOR "{query.toUpperCase()}"
        </span>
        <p className="search-results-subtitle">
          Matches include related methods, examples, and business context.
          {topResult ? ` Best match confidence: ${confidence}%.` : ""}
        </p>
      </div>
      {results.length === 0 && (
        <>
          <div className="empty-state">
            No strong match yet. Try stating the business problem you want to solve.
          </div>
          <div className="search-suggestion-row">
            {USE_CASE_SEARCH_SUGGESTIONS.map((suggestion) => (
              <button
                key={suggestion}
                className="search-suggestion-chip"
                onClick={() => onApplySuggestion(suggestion)}
              >
                {suggestion}
              </button>
            ))}
          </div>
        </>
      )}
      <div className="search-results-list">
        {results.map(({ category, categoryIndex, useCase, score, reasons }, index) => (
          <div
            key={useCase.id}
            className="search-result-item search-row"
            onClick={() => onSelectUseCase(category, categoryIndex)}
          >
            <div className="search-result-header">
              <div className="search-result-title-group">
                <span className="search-result-rank">#{index + 1}</span>
                <span className="search-result-method-name">{useCase.name}</span>
              </div>
              <div className="search-result-meta-group">
                <span className="search-result-topic">
                  {category.icon} {category.name}
                </span>
                <span className="search-result-score">
                  Match {Math.min(99, Math.round((score / 30) * 100))}%
                </span>
              </div>
            </div>
            {reasons.length > 0 && (
              <div className="search-result-reasons">
                {reasons.slice(0, 3).map((reason) => (
                  <span key={reason} className="search-result-reason">
                    {reason}
                  </span>
                ))}
              </div>
            )}
            <p className="search-result-excerpt">{useCase.description.slice(0, 155)}…</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Use Cases Home Page ──────────────────────────────────────────────────────
function UseCasesHomePage({ onSelectCategory, useCasesLayout, setUseCasesLayout }) {
  const useCasesHomeRef = useRef(null);
  const categoryCards = useMemo(
    () =>
      USE_CASE_CATEGORIES.map((cat, i) => ({
        category: cat,
        categoryIndex: i,
        accent: getUCColor(i),
        animationDelay: `${i * 0.03}s`,
      })),
    [], 
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    requestAnimationFrame(() => {
      scrollToSectionTop(useCasesHomeRef.current);
    });
  }, []);

  return (
    <div className="home-page page-enter" ref={useCasesHomeRef}>
      <AtlasHero className="uc-hero" />
      <div className="use-cases-home">
        <div className="home-controls">
          <div className="layout-toggle" aria-label="Choose use-cases layout">
            <button
              className={`layout-toggle-button${useCasesLayout === "grid" ? " active" : ""}`}
              onClick={() => setUseCasesLayout("grid")}
            >
              Tiles
            </button>
            <button
              className={`layout-toggle-button${useCasesLayout === "list" ? " active" : ""}`}
              onClick={() => setUseCasesLayout("list")}
            >
              List
            </button>
          </div>
        </div>
        {useCasesLayout === "list" ? (
          <div key="usecases-list" className="uc-category-list layout-switch">
            {categoryCards.map(({ category: cat, categoryIndex, accent, animationDelay }) => {
              return (
                <div
                  key={cat.id}
                  className="uc-category-list-item card-hover"
                  onClick={() => onSelectCategory(cat, categoryIndex)}
                  style={{
                    animationDelay,
                  }}
                >
                  <div className="uc-category-list-accent" style={{ background: accent }} />
                  <div className="uc-category-list-content">
                    <div className="uc-category-list-title-row">
                      <span className="uc-category-list-icon">{cat.icon}</span>
                      <h3 className="uc-category-list-title">{cat.name}</h3>
                      <span className="uc-category-list-count">{cat.useCases.length} use cases</span>
                    </div>
                    <p className="uc-category-list-desc">{cat.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div key="usecases-grid" className="uc-category-grid layout-switch">
            {categoryCards.map(({ category: cat, categoryIndex, accent, animationDelay }) => {
              return (
                <div
                  key={cat.id}
                  className="uc-category-card"
                  onClick={() => onSelectCategory(cat, categoryIndex)}
                  style={{ animationDelay }}
                >
                  <div
                    className="uc-category-card-bar"
                    style={{
                      background: `linear-gradient(90deg, ${accent}80, transparent)`,
                    }}
                  />
                  <div className="uc-category-card-header">
                    <span className="uc-category-card-icon">{cat.icon}</span>
                    <span className="uc-category-card-count">
                      {cat.useCases.length} use cases
                    </span>
                  </div>
                  <h3 className="uc-category-card-title">{cat.name}</h3>
                  <p className="uc-category-card-desc">{cat.description}</p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Home Page Component ──────────────────────────────────────────────────────
function HomePage({ onSelectTopic, homeLayout, setHomeLayout }) {
  const homePageRef = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    requestAnimationFrame(() => {
      scrollToSectionTop(homePageRef.current);
    });
  }, []);

  return (
    <div className="home-page page-enter" ref={homePageRef}>
      <AtlasHero />

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
          <div key="topics-list" className="topic-list layout-switch">
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
          <div key="topics-grid" className="topic-grid layout-switch">
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
  const initialAppState = useMemo(() => getInitialAppState(), []);
  const [view, setView] = useState(initialAppState.view);
  const [activeTab, setActiveTab] = useState(initialAppState.activeTab);
  const [theme, setTheme] = useState(() => {
    if (typeof window === "undefined") return "dark";
    const savedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
    return savedTheme === "light" || savedTheme === "dark" ? savedTheme : "dark";
  });
  const [homeLayout, setHomeLayout] = useState("grid");
  const [search, setSearch] = useState(initialAppState.search);
  const [domainFilter, setDomainFilter] = useState(initialAppState.domainFilter);
  const [historyIndex, setHistoryIndex] = useState(initialAppState.historyIndex ?? 0);
  const [useCasesLayout, setUseCasesLayout] = useState("grid");
  // Use-case state
  const [ucView, setUcView] = useState(initialAppState.ucView);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  const replaceHistoryState = (overrides = {}) => {
    if (typeof window === "undefined") return;
    const nextView = overrides.view ?? view;
    const nextTab = overrides.activeTab ?? activeTab;
    const nextUcView = overrides.ucView ?? ucView;
    const nextSearch = overrides.search ?? search;
    const nextDomainFilter = overrides.domainFilter ?? domainFilter;
    const nextHistoryIndex = overrides.historyIndex ?? historyIndex;
    const url = getUrlForAppState({
      view: nextView,
      activeTab: nextTab,
      ucView: nextUcView,
      search: nextSearch,
    });
    const state = buildAppHistoryState({
      view: nextView,
      activeTab: nextTab,
      ucView: nextUcView,
      search: nextSearch,
      domainFilter: nextDomainFilter,
      historyIndex: nextHistoryIndex,
    });
    window.history.replaceState(state, "", url);
    if (nextHistoryIndex !== historyIndex) {
      setHistoryIndex(nextHistoryIndex);
    }
  };

  const pushHistoryState = (overrides = {}) => {
    if (typeof window === "undefined") return;
    const nextView = overrides.view ?? view;
    const nextTab = overrides.activeTab ?? activeTab;
    const nextUcView = overrides.ucView ?? ucView;
    const nextSearch = overrides.search ?? search;
    const nextDomainFilter = overrides.domainFilter ?? domainFilter;
    const nextHistoryIndex =
      overrides.historyIndex ?? historyIndex + 1;
    const url = getUrlForAppState({
      view: nextView,
      activeTab: nextTab,
      ucView: nextUcView,
      search: nextSearch,
    });
    const state = buildAppHistoryState({
      view: nextView,
      activeTab: nextTab,
      ucView: nextUcView,
      search: nextSearch,
      domainFilter: nextDomainFilter,
      historyIndex: nextHistoryIndex,
    });
    window.history.pushState(state, "", url);
    setHistoryIndex(nextHistoryIndex);
  };

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.history.replaceState(
      buildAppHistoryState({
        view,
        activeTab,
        ucView,
        search,
        domainFilter,
        historyIndex,
      }),
      "",
      getUrlForAppState({ view, activeTab, ucView, search }),
    );
  }, [view, activeTab, ucView, search, domainFilter, historyIndex]);

  const navigate = (nextView, { replace = false, historyOverrides = {} } = {}) => {
    const nextHistory = { view: nextView, ...historyOverrides };
    if (replace) {
      replaceHistoryState(nextHistory);
    } else {
      pushHistoryState(nextHistory);
    }
    setView(nextView);
  };

  useEffect(() => {
    if (typeof window === "undefined") return;
    const handlePopState = (event) => {
      const parsed = parseAppHistoryState(event.state, window.location);
      if (parsed) {
        setView(parsed.view);
        setActiveTab(parsed.activeTab);
        setUcView(parsed.ucView);
        setSearch(parsed.search);
        setDomainFilter(parsed.domainFilter);
        setHistoryIndex(parsed.historyIndex ?? 0);
        return;
      }
      const useCasesRoute = getUseCasesRouteStateFromLocation(window.location);
      if (useCasesRoute) {
        setView({ type: "home" });
        setActiveTab("usecases");
        setUcView(useCasesRoute.ucView);
        setSearch(useCasesRoute.search);
        setDomainFilter("all");
        setHistoryIndex((idx) => (idx > 0 ? idx - 1 : 0));
        return;
      }
      const nextView = getViewFromLocation(window.location);
      setView(nextView);
      setActiveTab(nextView.type === "home" ? getInitialActiveTab() : "models");
      setUcView({ type: "home" });
      setSearch(nextView.type === "search" ? nextView.query ?? "" : "");
      setDomainFilter("all");
      setHistoryIndex(0);
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  function goHome(options = {}) {
    if (activeTab === "models") {
      if (view.type === "home" && !options.replace) {
        setSearch("");
        setDomainFilter("all");
        replaceHistoryState({ search: "", domainFilter: "all" });
        return;
      }
      setSearch("");
      setDomainFilter("all");
      navigate({ type: "home" }, options);
    } else {
      goUseCasesHome({ replace: options.replace });
    }
  }

  function goUseCasesHome({ replace = false, isActiveClick = false } = {}) {
    const nextUcView = { type: "home" };
    const alreadyUseCasesHome =
      activeTab === "usecases" &&
      view.type === "home" &&
      ucView.type === "home" &&
      search.trim().length === 0;

    setSearch("");
    setUcView(nextUcView);

    if (view.type !== "home") {
      navigate(
        { type: "home" },
        {
          replace,
          historyOverrides: {
            activeTab: "usecases",
            search: "",
            ucView: nextUcView,
          },
        },
      );
      return;
    }

    if (isActiveClick && alreadyUseCasesHome && !replace) {
      replaceHistoryState({ activeTab: "usecases", ucView: nextUcView, search: "" });
      return;
    }

    if (replace) {
      replaceHistoryState({ activeTab: "usecases", ucView: nextUcView, search: "" });
    } else {
      pushHistoryState({ activeTab: "usecases", ucView: nextUcView, search: "" });
    }
  }

  function handleBack() {
    if (typeof window !== "undefined" && historyIndex > 1) {
      window.history.back();
      return;
    }
    goHome();
  }

  function handleUseCasesBack() {
    if (typeof window !== "undefined" && historyIndex > 1) {
      window.history.back();
      return;
    }
    goUseCasesHome({ replace: true });
  }

  function handleToggleUseCase(openUseCaseId) {
    if (ucView.type !== "category") {
      return;
    }
    const nextUcView = { ...ucView, openUseCaseId };
    setUcView(nextUcView);
    replaceHistoryState({ activeTab: "usecases", ucView: nextUcView });
  }

  function handleSearch(val) {
    setSearch(val);
    const trimmed = val.trim();

    if (activeTab === "models") {
      replaceHistoryState({ search: val });
      if (trimmed.length > 1) {
        const nextView = { type: "search", query: val };
        navigate(nextView, { replace: view.type === "search", historyOverrides: { search: val } });
      } else if (view.type === "search") {
        goHome();
      }
      return;
    }

    if (trimmed.length > 1) {
      pushHistoryState({ activeTab: "usecases", search: val });
      return;
    }

    if (search.trim().length > 1) {
      goUseCasesHome();
      return;
    }

    replaceHistoryState({ activeTab: "usecases", search: val });
  }

  function handleSelectTopic(topic) {
    setSearch("");
    setDomainFilter("all");
    navigate({ type: "topic", topic });
  }

  function handleSelectMethod(topic, method) {
    setSearch("");
    setDomainFilter("all");
    navigate({ type: "topic", topic, jumpTo: method.id });
  }

  function handleToggleMethod(openMethodId) {
    if (activeTab !== "models" || view.type !== "topic") {
      return;
    }
    const nextView = { ...view, jumpTo: openMethodId ?? undefined };
    setView(nextView);
    replaceHistoryState({ view: nextView });
  }

  function handleSelectCategory(category, categoryIndex) {
    setSearch("");
    const nextUcView = { type: "category", category, categoryIndex, openUseCaseId: null };
    setUcView(nextUcView);
    setActiveTab("usecases");
    pushHistoryState({
      activeTab: "usecases",
      ucView: nextUcView,
      search: "",
    });
  }

  function handleNavigateToMethod(topicId, methodId) {
    const topic = TOPICS.find((t) => t.id === topicId);
    if (!topic) return;
    setSearch("");
    setDomainFilter("all");
    setActiveTab("models");
    navigate(
      { type: "topic", topic, jumpTo: methodId },
      {
        historyOverrides: {
          activeTab: "models",
          search: "",
          domainFilter: "all",
          ucView,
        },
      },
    );
  }

  function switchTab(tab) {
    if (tab === activeTab) {
      if (tab === "models") {
        goHome();
      } else {
        goUseCasesHome({ isActiveClick: true });
      }
      return;
    }

    setActiveTab(tab);
    setSearch("");

    if (tab === "models") {
      setUcView({ type: "home" });
      if (view.type !== "home") {
        navigate({ type: "home" }, { historyOverrides: { activeTab: "models", search: "" } });
      } else {
        pushHistoryState({
          activeTab: tab,
          search: "",
          ucView: { type: "home" },
        });
      }
    } else {
      goUseCasesHome();
    }
  }

  const searchPlaceholder = activeTab === "models"
    ? "Describe your goal (e.g., predict churn, detect fraud)…"
    : "Describe a business problem (e.g., improve retention)…";

  const tabButtons = (className) => (
    <div className={className} aria-label="Section">
      <button
        className={`nav-tab${activeTab === "usecases" ? " active" : ""}`}
        onClick={() => switchTab("usecases")}
      >
        Use Cases
      </button>
      <button
        className={`nav-tab${activeTab === "models" ? " active" : ""}`}
        onClick={() => switchTab("models")}
      >
        Models
      </button>
    </div>
  );

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

          {/* Nav Tabs */}
          {tabButtons("nav-tabs")}

          {/* Breadcrumb */}
          {activeTab === "models" && view.type === "topic" && (
            <div className="breadcrumb">{view.topic.icon} {view.topic.name}</div>
          )}
          {activeTab === "usecases" && ucView.type === "category" && (
            <div className="breadcrumb">{ucView.category.icon} {ucView.category.name}</div>
          )}

          {/* Search */}
          <div className="search-box">
            <span className="search-icon">⌕</span>
            <input
              className="search-box-input"
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder={searchPlaceholder}
            />
            {search && (
              <span
                className="search-clear"
                onClick={() => {
                  setSearch("");
                  if (activeTab === "models" && view.type === "search") {
                    goHome();
                  } else if (activeTab === "usecases" && search.trim().length > 1) {
                    goUseCasesHome();
                  }
                }}
              >
                ✕
              </span>
            )}
          </div>

          {/* Mobile Tab Toggle */}
          {tabButtons("nav-tabs-mobile")}

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

      {/* Models Tab Content */}
      {activeTab === "models" && (
        <>
          {view.type === "home" && (
            <HomePage
              onSelectTopic={handleSelectTopic}
              homeLayout={homeLayout}
              setHomeLayout={setHomeLayout}
            />
          )}
          {view.type === "search" && (
            <SearchResults
              query={search}
              onSelectMethod={handleSelectMethod}
              onApplySuggestion={handleSearch}
            />
          )}
          {view.type === "topic" && (
            <TopicPage
              key={`${view.topic.id}-${view.jumpTo ?? ""}`}
              topic={view.topic}
              onBack={handleBack}
              domainFilter={domainFilter}
              setDomainFilter={setDomainFilter}
              defaultOpenId={view.jumpTo}
              onToggleMethod={handleToggleMethod}
              onNavigateTopic={(topicId) => {
                const t = TOPICS.find((x) => x.id === topicId);
                if (t) handleSelectTopic(t);
              }}
            />
          )}
        </>
      )}

      {/* Use Cases Tab Content */}
      {activeTab === "usecases" && (
        <>
          {ucView.type === "home" && search.trim().length <= 1 && (
            <UseCasesHomePage
              onSelectCategory={handleSelectCategory}
              useCasesLayout={useCasesLayout}
              setUseCasesLayout={setUseCasesLayout}
            />
          )}
          {ucView.type === "home" && search.trim().length > 1 && (
            <UseCasesSearchResults
              query={search}
              onSelectUseCase={(cat, catIdx) => handleSelectCategory(cat, catIdx)}
              onApplySuggestion={handleSearch}
            />
          )}
          {ucView.type === "category" && (
            <UseCaseCategoryPage
              key={ucView.category.id}
              category={ucView.category}
              categoryIndex={ucView.categoryIndex}
              openUseCaseId={ucView.openUseCaseId ?? null}
              onBack={handleUseCasesBack}
              onNavigateToMethod={handleNavigateToMethod}
              onToggleUseCase={handleToggleUseCase}
            />
          )}
        </>
      )}

      {/* Footer */}
      <footer className="footer">
        <p>&copy; {new Date().getFullYear()} Arjun Chattoraj</p>
      </footer>
    </div>
  );
}
