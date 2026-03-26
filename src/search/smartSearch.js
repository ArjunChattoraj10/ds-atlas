const STOPWORDS = new Set([
  "a",
  "an",
  "and",
  "are",
  "as",
  "at",
  "be",
  "by",
  "for",
  "from",
  "how",
  "in",
  "is",
  "it",
  "of",
  "on",
  "or",
  "that",
  "the",
  "this",
  "to",
  "with",
]);

const TOKEN_SYNONYMS = {
  ai: ["artificial", "intelligence", "machine", "learning", "model", "models"],
  ml: ["machine", "learning", "predictive", "model", "models"],
  llm: ["large", "language", "model", "models", "chatbot", "gpt", "claude", "gemini"],
  genai: ["generative", "generation", "generate", "ai", "content"],
  nlp: ["language", "text", "natural", "processing", "sentiment", "chatbot"],
  vision: ["image", "images", "video", "computer", "detection", "segmentation"],
  classify: ["classification", "categorize", "categorization", "predict", "label"],
  classifyer: ["classifier"],
  classifier: ["classification", "classify", "predict"],
  prediction: ["predict", "forecast", "estimate"],
  forecast: ["forecasting", "prediction", "time", "series"],
  cluster: ["clustering", "segment", "segmentation", "group"],
  segment: ["segmentation", "cluster", "clustering", "grouping"],
  anomaly: ["outlier", "fraud", "abnormal", "rare"],
  optimize: ["optimization", "improve", "maximize", "minimize"],
  summarise: ["summarize", "summary"],
  summarization: ["summary", "summarize"],
  recommend: ["recommendation", "recommender", "suggest", "suggestion"],
  churn: ["retention", "cancel", "drop", "unsubscribe"],
  causal: ["cause", "impact", "effect", "counterfactual"],
  regression: ["continuous", "numeric", "value", "prediction"],
  explainability: ["explain", "interpretability", "shap", "feature", "importance"],
  customers: ["customer", "client", "user", "users"],
};

function normalizeText(value) {
  return String(value ?? "")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function stemToken(token) {
  if (token.length <= 3) return token;
  const rules = [
    [/ies$/u, "y"],
    [/sses$/u, "ss"],
    [/ing$/u, ""],
    [/ed$/u, ""],
    [/es$/u, ""],
    [/s$/u, ""],
    [/tion$/u, "te"],
    [/ization$/u, "ize"],
    [/isation$/u, "ize"],
  ];
  for (const [pattern, replacement] of rules) {
    if (pattern.test(token) && token.length - replacement.length >= 3) {
      return token.replace(pattern, replacement);
    }
  }
  return token;
}

function createTokenSetFromText(text) {
  const normalized = normalizeText(text);
  if (!normalized) return new Set();
  const tokens = normalized.split(" ").filter((token) => token && !STOPWORDS.has(token));
  const tokenSet = new Set();
  for (const token of tokens) {
    tokenSet.add(token);
    tokenSet.add(stemToken(token));
  }
  return tokenSet;
}

function getSynonyms(token) {
  const direct = TOKEN_SYNONYMS[token] ?? [];
  const stemmed = TOKEN_SYNONYMS[stemToken(token)] ?? [];
  return [...new Set([...direct, ...stemmed].map(normalizeText).filter(Boolean))];
}

function buildExpandedQueryTokens(query) {
  const baseTokens = [...createTokenSetFromText(query)];
  const expanded = new Set(baseTokens);
  for (const token of baseTokens) {
    for (const synonym of getSynonyms(token)) {
      expanded.add(synonym);
      expanded.add(stemToken(synonym));
    }
  }
  return [...expanded].filter(Boolean);
}

function tokenEditDistanceWithin(a, b, maxDistance = 1) {
  if (!a || !b) return false;
  const aLen = a.length;
  const bLen = b.length;
  if (Math.abs(aLen - bLen) > maxDistance) return false;
  if (a === b) return true;

  const prev = new Array(bLen + 1);
  const curr = new Array(bLen + 1);
  for (let j = 0; j <= bLen; j += 1) prev[j] = j;

  for (let i = 1; i <= aLen; i += 1) {
    curr[0] = i;
    for (let j = 1; j <= bLen; j += 1) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      curr[j] = Math.min(
        prev[j] + 1,
        curr[j - 1] + 1,
        prev[j - 1] + cost,
      );
    }
    for (let j = 0; j <= bLen; j += 1) {
      prev[j] = curr[j];
    }
  }
  return prev[bLen] <= maxDistance;
}

function scoreFieldMatch(field, queryToken) {
  const normalized = normalizeText(field.text);
  if (!normalized) {
    return null;
  }

  const directWholeWordMatch = field.tokens.has(queryToken);
  const prefixMatch = !directWholeWordMatch && [...field.tokens].some((token) => token.startsWith(queryToken));
  const containsMatch = !directWholeWordMatch && !prefixMatch && normalized.includes(queryToken);
  const fuzzyMatch = !directWholeWordMatch && !prefixMatch && !containsMatch
    && [...field.tokens].some((token) => tokenEditDistanceWithin(token, queryToken, 1));

  if (!directWholeWordMatch && !prefixMatch && !containsMatch && !fuzzyMatch) {
    return null;
  }

  const matchStrength = directWholeWordMatch
    ? 1
    : prefixMatch
      ? 0.72
      : containsMatch
        ? 0.55
        : 0.38;

  return {
    fieldLabel: field.label,
    score: field.weight * matchStrength,
  };
}

export function prepareSearchDocuments(items) {
  return items.map((item) => {
    const fields = item.fields.map((field) => ({
      ...field,
      text: field.text ?? "",
      tokens: createTokenSetFromText(field.text),
    }));

    return {
      ...item,
      fields,
    };
  });
}

export function runSmartSearch(index, query, options = {}) {
  const limit = options.limit ?? 24;
  const minScore = options.minScore ?? 2.8;
  const boostedQuery = normalizeText(query);
  if (boostedQuery.length < 2) return [];

  const queryTokens = buildExpandedQueryTokens(boostedQuery);
  if (queryTokens.length === 0) return [];
  const rootQueryTokens = new Set(queryTokens.map(stemToken));

  const results = [];
  for (const item of index) {
    let score = 0;
    const reasons = [];
    const coveredRootTokens = new Set();

    for (const queryToken of queryTokens) {
      let bestForToken = null;
      for (const field of item.fields) {
        const fieldMatch = scoreFieldMatch(field, queryToken);
        if (!fieldMatch) continue;
        if (!bestForToken || fieldMatch.score > bestForToken.score) {
          bestForToken = fieldMatch;
        }
      }

      if (bestForToken) {
        score += bestForToken.score;
        coveredRootTokens.add(stemToken(queryToken));
        if (reasons.length < 3) {
          reasons.push(`${bestForToken.fieldLabel} matched "${queryToken}"`);
        }
      }
    }

    if (score <= 0) continue;

    const tokenCoverageBoost = coveredRootTokens.size / Math.max(1, Math.min(queryTokens.length, 6));
    score += tokenCoverageBoost * 4;

    if (score < minScore) continue;
    const matchCoverage = coveredRootTokens.size / Math.max(1, rootQueryTokens.size);

    results.push({
      ...item.payload,
      score,
      reasons,
      matchedTokens: [...coveredRootTokens],
      matchCoverage,
    });
  }

  return results
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return (b.matchedTokens?.length ?? 0) - (a.matchedTokens?.length ?? 0);
    })
    .slice(0, limit);
}
