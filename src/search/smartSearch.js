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

const SEMANTIC_CONCEPTS = {
  forecasting: {
    aliases: [
      "forecast",
      "forecasting",
      "predict future",
      "time series",
      "trend projection",
      "revenue forecasting",
      "demand forecasting",
    ],
  },
  anomaly_detection: {
    aliases: [
      "anomaly",
      "outlier",
      "fraud",
      "suspicious transaction",
      "abnormal behavior",
      "risk detection",
    ],
  },
  classification: {
    aliases: [
      "classification",
      "classify",
      "binary outcome",
      "yes no",
      "label prediction",
      "probability score",
    ],
  },
  regression: {
    aliases: [
      "regression",
      "continuous value",
      "numeric prediction",
      "estimate amount",
      "predict price",
      "predict value",
    ],
  },
  churn_retention: {
    aliases: [
      "churn",
      "retention",
      "customer leaving",
      "prevent cancellation",
      "reduce churn",
      "save customers",
    ],
  },
  recommendation: {
    aliases: [
      "recommend",
      "recommendation",
      "personalization",
      "next best product",
      "suggestion engine",
      "recommender",
    ],
  },
  segmentation: {
    aliases: [
      "segment",
      "segmentation",
      "group customers",
      "clustering",
      "persona",
      "cohort",
    ],
  },
  explainability: {
    aliases: [
      "explain model",
      "feature importance",
      "interpretability",
      "why prediction",
      "shap",
      "model transparency",
    ],
  },
  causality: {
    aliases: [
      "causal",
      "impact",
      "effect",
      "counterfactual",
      "ab testing",
      "experimentation",
    ],
  },
  generation: {
    aliases: [
      "generate",
      "content generation",
      "text generation",
      "llm",
      "chatbot",
      "prompting",
      "rag",
    ],
  },
  optimization: {
    aliases: [
      "optimize",
      "optimization",
      "maximize",
      "minimize",
      "dynamic pricing",
      "decision policy",
    ],
  },
  vision: {
    aliases: [
      "image",
      "video",
      "computer vision",
      "object detection",
      "segmentation image",
      "visual recognition",
    ],
  },
  nlp: {
    aliases: [
      "language",
      "text",
      "nlp",
      "sentiment",
      "summarization",
      "entity extraction",
      "topic modeling",
    ],
  },
};

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

const SEMANTIC_CONCEPT_ENTRIES = Object.entries(SEMANTIC_CONCEPTS).map(([concept, value]) => ({
  concept,
  aliases: value.aliases.map((alias) => normalizeText(alias)).filter(Boolean),
}));

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

function addToVector(vector, concept, amount) {
  vector[concept] = (vector[concept] ?? 0) + amount;
}

function buildSemanticVectorFromText(text, weight = 1) {
  const normalized = normalizeText(text);
  if (!normalized) return {};
  const tokenSet = createTokenSetFromText(normalized);
  const vector = {};

  for (const { concept, aliases } of SEMANTIC_CONCEPT_ENTRIES) {
    let conceptScore = 0;
    for (const alias of aliases) {
      if (!alias) continue;
      const aliasTokens = alias.split(" ").filter(Boolean);
      if (aliasTokens.length === 0) continue;

      const wholeAliasMatch = normalized.includes(alias);
      if (wholeAliasMatch) {
        conceptScore += aliasTokens.length > 1 ? 1.15 : 0.9;
        continue;
      }

      const covered = aliasTokens.reduce((count, token) => {
        const stemmed = stemToken(token);
        return count + (tokenSet.has(token) || tokenSet.has(stemmed) ? 1 : 0);
      }, 0);
      if (covered > 0) {
        conceptScore += covered / aliasTokens.length;
      }
    }

    if (conceptScore > 0) {
      addToVector(vector, concept, conceptScore * weight);
    }
  }

  return vector;
}

function mergeSemanticVectors(vectors) {
  const merged = {};
  for (const vector of vectors) {
    for (const [concept, value] of Object.entries(vector)) {
      addToVector(merged, concept, value);
    }
  }
  return merged;
}

function cosineSimilarity(a, b) {
  const aKeys = Object.keys(a);
  const bKeys = Object.keys(b);
  if (aKeys.length === 0 || bKeys.length === 0) return 0;

  let dot = 0;
  for (const key of aKeys) {
    if (b[key]) {
      dot += a[key] * b[key];
    }
  }
  if (dot <= 0) return 0;

  const magA = Math.sqrt(aKeys.reduce((sum, key) => sum + a[key] * a[key], 0));
  const magB = Math.sqrt(bKeys.reduce((sum, key) => sum + b[key] * b[key], 0));
  if (magA === 0 || magB === 0) return 0;

  return dot / (magA * magB);
}

function topConcepts(vector, count = 3) {
  return Object.entries(vector)
    .sort((a, b) => b[1] - a[1])
    .slice(0, count)
    .map(([concept]) => concept.replace(/_/g, " "));
}

export function prepareSearchDocuments(items) {
  return items.map((item) => {
    const fields = item.fields.map((field) => ({
      ...field,
      text: field.text ?? "",
      tokens: createTokenSetFromText(field.text),
    }));
    const semanticVector = mergeSemanticVectors(
      fields.map((field) => buildSemanticVectorFromText(field.text, field.weight)),
    );
    const semanticConcepts = topConcepts(semanticVector, 4);

    return {
      ...item,
      fields,
      semanticVector,
      semanticConcepts,
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
  const querySemanticVector = buildSemanticVectorFromText(boostedQuery, 1);
  const queryConcepts = topConcepts(querySemanticVector, 3);

  const results = [];
  for (const item of index) {
    let lexicalScore = 0;
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
        lexicalScore += bestForToken.score;
        coveredRootTokens.add(stemToken(queryToken));
        if (reasons.length < 3) {
          reasons.push(`${bestForToken.fieldLabel} matched "${queryToken}"`);
        }
      }
    }

    const tokenCoverageBoost = coveredRootTokens.size / Math.max(1, Math.min(queryTokens.length, 6));
    lexicalScore += tokenCoverageBoost * 4;
    const semanticSimilarity = cosineSimilarity(querySemanticVector, item.semanticVector ?? {});
    const semanticScore = semanticSimilarity * 14;
    const score = lexicalScore + semanticScore;
    const hasSemanticOnlySignal = lexicalScore <= 0 && semanticSimilarity >= 0.24;
    if (lexicalScore <= 0 && !hasSemanticOnlySignal) continue;

    if (score < minScore) continue;
    const matchCoverage = coveredRootTokens.size / Math.max(1, rootQueryTokens.size);
    const semanticConceptOverlap = queryConcepts.filter((concept) =>
      (item.semanticConcepts ?? []).includes(concept),
    );

    results.push({
      ...item.payload,
      score,
      reasons: [
        ...reasons,
        ...(semanticConceptOverlap.slice(0, 2).map(
          (concept) => `Semantic intent match: ${concept}`,
        )),
      ].slice(0, 4),
      matchedTokens: [...coveredRootTokens],
      matchCoverage,
      semanticSimilarity,
      lexicalScore,
    });
  }

  return results
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return (b.matchedTokens?.length ?? 0) - (a.matchedTokens?.length ?? 0);
    })
    .slice(0, limit);
}
