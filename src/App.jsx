import { useState, useMemo } from "react";

// ─── Styles ───────────────────────────────────────────────────────────────────
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,600;9..144,800&family=Outfit:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #070d1b; }
  ::-webkit-scrollbar { width: 5px; } ::-webkit-scrollbar-track { background: transparent; } ::-webkit-scrollbar-thumb { background: #1a2d4a; border-radius: 3px; }
  input::placeholder { color: #2a3f5c; }
  input:focus { outline: none; }
  @keyframes fadeUp { from { opacity:0; transform:translateY(12px);} to {opacity:1; transform:translateY(0);} }
  @keyframes expandDown { from { opacity:0; transform:translateY(-6px); } to { opacity:1; transform:translateY(0); } }
  .page-enter { animation: fadeUp 0.24s ease both; }
  .card-hover { transition: border-color 0.16s, background 0.16s, transform 0.16s, box-shadow 0.16s; cursor: pointer; }
  .card-hover:hover { transform: translateY(-2px); border-color: #1e3a5f !important; box-shadow: 0 8px 28px rgba(0,0,0,0.5) !important; }
  .method-row { transition: background 0.13s, border-color 0.13s; cursor: pointer; }
  .method-row:hover { background: #0e1b30 !important; }
  .detail-enter { animation: expandDown 0.2s ease both; }
  .chip { display: inline-flex; align-items: center; padding: 2px 8px; border-radius: 4px; font-size: 10px; font-family: 'JetBrains Mono', monospace; font-weight: 500; letter-spacing: 0.05em; }
  .tag { display: inline-flex; align-items: center; padding: 3px 10px; border-radius: 20px; font-size: 11px; cursor: pointer; transition: all 0.13s; border: 1px solid transparent; font-family: 'Outfit', sans-serif; }
  .tag:hover { filter: brightness(1.15); }
  .back { display: inline-flex; align-items: center; gap: 6px; cursor: pointer; transition: color 0.13s; font-size: 13px; font-family: 'Outfit', sans-serif; color: #3a5270; padding: 6px 0; }
  .back:hover { color: #94a3b8; }
  .search-row { transition: background 0.13s; cursor: pointer; }
  .search-row:hover { background: #0e1b30 !important; }
`;

// ─── Domain Taxonomy ──────────────────────────────────────────────────────────
const D = {
  ml:    { label: "ML",            color: "#60a5fa", dim: "rgba(96,165,250,0.13)"  },
  stats: { label: "Stats",         color: "#4ade80", dim: "rgba(74,222,128,0.13)"  },
  econ:  { label: "Econometrics",  color: "#c084fc", dim: "rgba(192,132,252,0.13)" },
  dl:    { label: "Deep Learning", color: "#f87171", dim: "rgba(248,113,113,0.13)" },
  nlp:   { label: "NLP",           color: "#fb923c", dim: "rgba(251,146,60,0.13)"  },
  bayes: { label: "Bayesian",      color: "#38bdf8", dim: "rgba(56,189,248,0.13)"  },
  ts:    { label: "Time Series",   color: "#facc15", dim: "rgba(250,204,21,0.13)"  },
  causal:{ label: "Causal",        color: "#2dd4bf", dim: "rgba(45,212,191,0.13)"  },
  optim: { label: "Optimization",  color: "#f472b6", dim: "rgba(244,114,182,0.13)" },
};

// ─── Data ─────────────────────────────────────────────────────────────────────
const TOPICS = [
  {
    id:"regression", icon:"📈", name:"Predict a Continuous Outcome",
    summary:"Estimate a numeric target from input features — from simple linear models to complex ensembles.",
    methods:[
      { id:"ols", name:"OLS Linear Regression", domains:["stats","econ"],
        what:"Estimates linear relationships by minimizing squared residuals. The gold standard for interpretable regression with full inferential machinery.",
        inputs:"Numeric / encoded features · Continuous target",
        outputs:"Coefficients · Standard errors · p-values · R² · Predictions",
        assumptions:"Linearity · Homoscedasticity · No multicollinearity · Normal residuals",
        notes:"Use robust SEs (HC3) when variance is non-constant. Highly sensitive to outliers. Best when interpretability is paramount." },
      { id:"ridge", name:"Ridge Regression (L2)", domains:["ml","stats"],
        what:"Adds an L2 penalty that shrinks all coefficients toward zero. Handles multicollinearity and reduces overfitting without eliminating any variable.",
        inputs:"Standardized numeric features · Continuous target",
        outputs:"Shrunken coefficients · Predictions",
        assumptions:"Linear relationship · Features should be standardized",
        notes:"Ideal when many small effects exist. Tune λ via cross-validation. Does not perform feature selection — use Lasso for sparsity." },
      { id:"lasso", name:"Lasso Regression (L1)", domains:["ml","stats"],
        what:"L1 penalty forces some coefficients to exactly zero, performing automatic feature selection and producing sparse, interpretable models.",
        inputs:"Standardized numeric features · Continuous target",
        outputs:"Sparse coefficients · Selected feature set · Predictions",
        assumptions:"Linear relationship · Features standardized",
        notes:"Best when you suspect few features matter. Unstable with correlated features — use Elastic Net. Tune λ via cross-validation." },
      { id:"elasticnet", name:"Elastic Net", domains:["ml","stats"],
        what:"Combines L1 + L2 penalties. Handles correlated features better than pure Lasso while still producing sparse models.",
        inputs:"Numeric features · Continuous target",
        outputs:"Semi-sparse coefficients · Predictions",
        assumptions:"Linear relationship",
        notes:"Two hyperparameters (α mix, λ strength). Default choice when feature correlations are unknown. Useful in genomics, text, and high-p data." },
      { id:"gbm-reg", name:"Gradient Boosting (XGBoost / LightGBM / CatBoost)", domains:["ml"],
        what:"Sequentially trained tree ensembles minimizing residual errors. Extremely flexible — handles non-linearity, interactions, and missing values natively.",
        inputs:"Mixed feature types (numeric + categorical) · Continuous target · Handles NaN",
        outputs:"Predictions · Feature importances · SHAP values",
        assumptions:"None (non-parametric)",
        notes:"State-of-the-art on tabular data. Tune n_estimators, learning_rate, max_depth. Use early stopping. LightGBM is fastest on large datasets." },
      { id:"rf-reg", name:"Random Forest Regression", domains:["ml"],
        what:"Bootstrap-aggregated ensemble of decision trees. Robust to outliers and overfitting through variance reduction by averaging many diverse trees.",
        inputs:"Mixed feature types · Continuous target",
        outputs:"Predictions · Feature importances · OOB error",
        assumptions:"None",
        notes:"Solid general-purpose baseline. Out-of-bag error provides a free validation estimate. Less prone to overfitting than boosting." },
      { id:"gpr", name:"Gaussian Process Regression", domains:["bayes","ml"],
        what:"Non-parametric Bayesian approach providing full predictive distributions with calibrated uncertainty — not just a point estimate.",
        inputs:"Numeric features (≤10k rows) · Continuous target · Kernel choice",
        outputs:"Predictive mean + variance · Credible intervals",
        assumptions:"Data is a realization of a GP; kernel encodes prior beliefs",
        notes:"Excellent for small datasets needing uncertainty quantification. Computationally expensive O(n³). Kernel selection is the key modeling decision." },
    ]
  },
  {
    id:"classification", icon:"🎯", name:"Classify Into Categories",
    summary:"Assign observations to discrete classes based on their features.",
    methods:[
      { id:"logistic", name:"Logistic Regression", domains:["stats","ml"],
        what:"Models log-odds of class membership as a linear function of features. Produces calibrated probabilities and interpretable odds-ratio coefficients.",
        inputs:"Numeric / encoded features · Binary or multi-class target",
        outputs:"Class probabilities · Coefficient estimates · Predictions",
        assumptions:"Log-linear relationship · No severe multicollinearity",
        notes:"Excellent interpretable baseline. Use regularization (C parameter). Multinomial or one-vs-rest for multi-class. Interpret via odds ratios." },
      { id:"gbm-clf", name:"Gradient Boosting Classifier", domains:["ml"],
        what:"Boosted tree ensemble iteratively minimizing classification loss. Consistently the top-performing model on structured / tabular data.",
        inputs:"Mixed feature types · Categorical target · Handles missing values",
        outputs:"Class predictions · Probabilities · SHAP values",
        assumptions:"None",
        notes:"Use scale_pos_weight for class imbalance. LightGBM is faster on large datasets. Almost always worth trying as the primary model." },
      { id:"rf-clf", name:"Random Forest Classifier", domains:["ml"],
        what:"Bootstrap-aggregated ensemble of decision trees. Robust, handles high-dimensional data, produces interpretable feature importances.",
        inputs:"Mixed feature types · Categorical target",
        outputs:"Class predictions · Probabilities · Feature importances",
        assumptions:"None",
        notes:"Strong general-purpose classifier. Probabilities may be miscalibrated — apply Platt scaling if needed downstream." },
      { id:"svm", name:"Support Vector Machine (SVM)", domains:["ml"],
        what:"Finds the maximum-margin hyperplane separating classes. Kernel trick enables non-linear decision boundaries in high-dimensional spaces.",
        inputs:"Standardized numeric features · Binary / multi-class target",
        outputs:"Class predictions · Decision function scores",
        assumptions:"Features should be scaled; margin separation is meaningful",
        notes:"Strong on high-dimensional data (text, genomics). RBF kernel is a good default; linear kernel for text classification." },
      { id:"nb", name:"Naive Bayes", domains:["stats","ml"],
        what:"Applies Bayes' theorem with conditional independence between features. Surprisingly effective despite the strong assumption.",
        inputs:"Feature counts or numeric features · Categorical target",
        outputs:"Class predictions · Posterior probabilities",
        assumptions:"Conditional independence of features given class",
        notes:"Gold standard for text and spam classification. Gaussian NB for continuous features; Multinomial NB for counts. Extremely fast to train." },
    ]
  },
  {
    id:"clustering", icon:"🔵", name:"Find Natural Groups in Data",
    summary:"Discover structure and segment unlabeled data without predefined classes.",
    methods:[
      { id:"kmeans", name:"K-Means", domains:["ml"],
        what:"Partitions data into k clusters by iteratively assigning points to the nearest centroid and updating centroids. Simple, scalable, and widely used.",
        inputs:"Standardized numeric features · k must be specified",
        outputs:"Cluster labels · Centroid coordinates · Inertia",
        assumptions:"Convex, roughly equal-sized clusters; Euclidean distance is meaningful",
        notes:"Use Elbow method or Silhouette score to choose k. Use k-means++ initialization. Fails on non-convex shapes — use DBSCAN instead." },
      { id:"dbscan", name:"DBSCAN", domains:["ml"],
        what:"Density-based algorithm grouping core points within radius ε. Naturally identifies noise / outlier points and handles arbitrary cluster shapes.",
        inputs:"Numeric features · ε (radius) and min_samples hyperparameters",
        outputs:"Cluster labels (−1 = noise) · No predefined k needed",
        assumptions:"Clusters have similar densities",
        notes:"Great for irregular shapes and outlier detection. Tune ε via k-distance elbow plot. Prefer HDBSCAN when densities vary significantly." },
      { id:"hdbscan", name:"HDBSCAN", domains:["ml"],
        what:"Hierarchical extension of DBSCAN that handles variable-density clusters. More robust and requires fewer parameter choices.",
        inputs:"Numeric features · Only min_cluster_size required",
        outputs:"Cluster labels · Soft membership probabilities · Cluster hierarchy",
        assumptions:"Fewer assumptions than DBSCAN; more general density model",
        notes:"Generally preferred over DBSCAN. Deterministic with default settings. Provides soft (probabilistic) cluster assignments." },
      { id:"gmm", name:"Gaussian Mixture Model (GMM)", domains:["stats","bayes"],
        what:"Models data as a mixture of Gaussians fitted via EM. Probabilistic — each point has soft membership probability across all components.",
        inputs:"Numeric features · Number of components to specify",
        outputs:"Soft cluster assignments · Component means and covariances",
        assumptions:"Data generated from a mixture of Gaussians",
        notes:"Use BIC/AIC to select number of components. More flexible than K-Means — handles elliptical clusters. Also useful for density estimation." },
      { id:"hier", name:"Hierarchical / Agglomerative Clustering", domains:["stats","ml"],
        what:"Builds a dendrogram by successively merging the two most similar clusters. Visualizing the tree reveals natural structure without fixing k in advance.",
        inputs:"Distance matrix or numeric features · Linkage criterion (Ward, complete, average)",
        outputs:"Dendrogram · Cluster labels at any cut height",
        assumptions:"Meaningful pairwise distances",
        notes:"Ward linkage usually best. Computationally expensive O(n²) — impractical for large n. Visualize dendrogram to select k." },
    ]
  },
  {
    id:"dimred", icon:"🔻", name:"Reduce Dimensionality",
    summary:"Compress high-dimensional data while preserving the structure that matters.",
    methods:[
      { id:"pca", name:"PCA", domains:["stats","ml"],
        what:"Linear transformation onto orthogonal axes of maximum variance. The foundational tool for dimensionality reduction, noise removal, and visualization.",
        inputs:"Standardized numeric features",
        outputs:"Principal components · Explained variance ratios · Loadings matrix",
        assumptions:"Linear structure; features should be standardized",
        notes:"Retain components explaining 80–95% of variance. Loadings reveal feature contributions. Use before ML to handle high-dimensional or noisy data." },
      { id:"umap", name:"UMAP", domains:["ml"],
        what:"Uniform Manifold Approximation and Projection — fast, preserves both local and global structure via topological analysis. The modern default for visualization.",
        inputs:"High-dimensional numeric features",
        outputs:"Low-dimensional embedding (usable for downstream tasks too)",
        assumptions:"Data lies on a lower-dimensional Riemannian manifold",
        notes:"Generally preferred over t-SNE. Deterministic with fixed seed. Tune n_neighbors (15) and min_dist (0.1)." },
      { id:"tsne", name:"t-SNE", domains:["ml"],
        what:"Non-linear method optimized for 2D / 3D visualization of high-dimensional data. Preserves local neighborhood structure.",
        inputs:"High-dimensional features (apply PCA to ≤50D first for speed)",
        outputs:"2D / 3D coordinates — for visualization only",
        assumptions:"Local structure is meaningful",
        notes:"For visualization ONLY — do not use embedding for downstream ML. Non-deterministic between runs. Use UMAP for most use cases." },
      { id:"factor", name:"Factor Analysis", domains:["stats"],
        what:"Models observed variables as linear combinations of latent factors plus unique noise. Explicitly separates common from unique variance — unlike PCA.",
        inputs:"Correlated numeric variables (scales, surveys, returns)",
        outputs:"Factor loadings · Factor scores · Communalities · Uniquenesses",
        assumptions:"Linear factor structure; common factors explain inter-variable correlations",
        notes:"Use for latent constructs (psychometrics, finance). Rotations (Varimax=orthogonal, Oblimin=correlated) aid interpretation. Select factors via parallel analysis." },
    ]
  },
  {
    id:"timeseries", icon:"📅", name:"Forecast or Model Time Series",
    summary:"Model sequential data with temporal dependencies, trends, and seasonality.",
    methods:[
      { id:"arima", name:"ARIMA / SARIMA", domains:["ts","stats"],
        what:"AutoRegressive Integrated Moving Average model capturing autocorrelation, trend via differencing, and moving average errors. SARIMA adds seasonal cycles.",
        inputs:"Univariate time series (stationary or differenced to stationarity)",
        outputs:"Forecasts with confidence intervals · Model diagnostics · Residuals",
        assumptions:"Stationarity after differencing · Linear autocorrelation structure",
        notes:"Use ADF/KPSS test for stationarity. auto_arima (pmdarima) selects (p,d,q) via AIC. Check residuals with Ljung-Box test." },
      { id:"prophet", name:"Prophet (Meta)", domains:["ts","ml"],
        what:"Additive decomposable model with piecewise trend, Fourier-series seasonality, and holiday effects. Robust to missing data and outliers.",
        inputs:"DataFrame with ds (timestamp) and y columns · Optional holiday/regressor columns",
        outputs:"Forecasts with uncertainty intervals · Trend, seasonal, holiday decomposition",
        assumptions:"Additive or multiplicative structure; trend changepoints are sparse",
        notes:"Excellent for business metrics with strong weekly/yearly seasonality. Interpretable components. Less flexible than ML for complex patterns." },
      { id:"ets", name:"Exponential Smoothing (ETS / Holt-Winters)", domains:["ts","stats"],
        what:"Weights recent observations more heavily via exponential decay. Holt adds trend; Holt-Winters adds seasonality. ETS is the full state-space framework.",
        inputs:"Univariate time series with possible trend and seasonality",
        outputs:"Forecasts · Prediction intervals · Smoothed components",
        assumptions:"Error, Trend, Seasonal components — additive or multiplicative",
        notes:"Simple and effective for business forecasting. ETS model selection via AIC. Interpretable components." },
      { id:"var", name:"Vector Autoregression (VAR)", domains:["ts","econ"],
        what:"Multivariate time series model where each variable is regressed on its own lags and all other variables' lags. Captures cross-variable dynamics.",
        inputs:"Multiple stationary time series · Lag order via AIC/BIC",
        outputs:"Multi-variable forecasts · Impulse response functions · Granger causality tests",
        assumptions:"Stationarity of all series · Linear cross-variable relationships",
        notes:"Use Granger causality to assess predictive relationships. Cointegrated series need VECM. Good for macroeconomic and financial data." },
      { id:"lstm-ts", name:"LSTM / Temporal Fusion Transformer", domains:["dl","ts"],
        what:"LSTM captures long-range temporal dependencies via gating. TFT adds multi-head attention for interpretable multi-horizon probabilistic forecasting at scale.",
        inputs:"Multivariate sequences · Large training datasets · Covariates",
        outputs:"Multi-step forecasts · Quantile predictions · Attention weights",
        assumptions:"Sufficient data to train; meaningful temporal structure",
        notes:"Best for complex non-linear patterns with large datasets. TFT provides variable-selection attention. Use PyTorch Forecasting." },
    ]
  },
  {
    id:"hypothesis", icon:"⚖️", name:"Test Statistical Hypotheses",
    summary:"Assess the strength of statistical evidence for or against a specific claim.",
    methods:[
      { id:"ttest", name:"t-Test (One / Two Sample / Paired)", domains:["stats"],
        what:"Tests whether a mean or difference in means equals a specified value. Welch's handles unequal variances; paired t-test exploits within-subject correlation.",
        inputs:"Continuous values · One or two groups (independent or paired)",
        outputs:"t-statistic · p-value · Confidence interval for mean difference",
        assumptions:"Approximate normality (CLT covers large n) · Equal or unequal variances",
        notes:"Welch's t-test is safer by default. Always report effect size (Cohen's d) alongside p-value. Non-parametric alternative: Mann-Whitney U." },
      { id:"anova", name:"ANOVA (One-Way / Two-Way)", domains:["stats"],
        what:"Partitions total variance into between-group and within-group components via F-test. Tests whether any group means differ across 3+ groups simultaneously.",
        inputs:"Continuous outcome · Categorical grouping variable (3+ levels)",
        outputs:"F-statistic · p-value · η² effect size · Post-hoc comparisons",
        assumptions:"Normality within groups · Homoscedasticity · Independence",
        notes:"Significant ANOVA means at least one group differs — use Tukey HSD for pairwise. Non-parametric: Kruskal-Wallis. Two-way ANOVA tests interaction effects." },
      { id:"chisq", name:"Chi-Squared / Fisher's Exact", domains:["stats"],
        what:"Tests association between two categorical variables or goodness-of-fit vs. expected frequencies. Fisher's Exact is for small 2×2 tables.",
        inputs:"Contingency table of counts",
        outputs:"χ² statistic · p-value · Cramér's V (association strength)",
        assumptions:"Expected cell counts ≥ 5 (use Fisher's Exact if violated) · Independent observations",
        notes:"Cramér's V measures association strength. Does not indicate direction. McNemar's test for paired categorical data." },
      { id:"mann-whitney", name:"Mann-Whitney U / Wilcoxon", domains:["stats"],
        what:"Non-parametric tests comparing distributions of two groups without normality assumptions. Mann-Whitney for independent; Wilcoxon signed-rank for paired.",
        inputs:"Ordinal or continuous data · Two groups",
        outputs:"U or W statistic · p-value · Rank-biserial correlation",
        assumptions:"Independent observations · Similar distribution shapes",
        notes:"Use when normality is untenable or data is ordinal. Less powerful than t-test when normality holds. Kruskal-Wallis for 3+ groups." },
      { id:"permutation", name:"Permutation Tests / Bootstrap", domains:["stats","ml"],
        what:"Compute null distributions empirically — shuffling labels (permutation) or resampling with replacement (bootstrap). No distributional assumptions.",
        inputs:"Any data with a well-defined test statistic",
        outputs:"Empirical p-value · Null distribution · Bootstrap CIs",
        assumptions:"Exchangeability under null (permutation); IID samples (bootstrap)",
        notes:"Gold standard when distributional assumptions are unclear. Computationally expensive. Bootstrap CIs are widely applicable for any statistic." },
      { id:"fdr", name:"Multiple Testing Correction (Bonferroni / BH FDR)", domains:["stats"],
        what:"Adjusts significance thresholds when testing many hypotheses simultaneously to control family-wise error rate (Bonferroni) or false discovery rate (BH).",
        inputs:"Set of raw p-values from multiple tests",
        outputs:"Adjusted p-values · Corrected significance decisions",
        assumptions:"Independence between tests (Bonferroni); exchangeability (BH)",
        notes:"Bonferroni is conservative. Benjamini-Hochberg controls FDR and has more power. Never optional when conducting 3+ related tests." },
    ]
  },
  {
    id:"causal", icon:"🔗", name:"Estimate Causal Effects",
    summary:"Move beyond correlation to identify and quantify cause-and-effect relationships.",
    methods:[
      { id:"did", name:"Difference-in-Differences (DiD)", domains:["causal","econ"],
        what:"Compares change over time in a treated vs. control group. Differences out both time trends and fixed group characteristics under parallel trends.",
        inputs:"Panel data · Treatment/control groups · Pre/post periods",
        outputs:"ATT estimate · Event study estimates",
        assumptions:"Parallel trends · No spillovers · SUTVA",
        notes:"Test pre-trends with event study plots — the key validity check. Standard 2×2 DiD fails with staggered rollout; use Callaway-Sant'Anna or Sun-Abraham." },
      { id:"iv", name:"Instrumental Variables (IV) / 2SLS", domains:["causal","econ"],
        what:"Uses an instrument (affects treatment but not outcome directly) to isolate exogenous variation, correcting for endogeneity and omitted variable bias.",
        inputs:"Outcome · Endogenous treatment · Valid instrument(s) · Controls",
        outputs:"IV/2SLS coefficient estimates (LATE) · First-stage F-statistic",
        assumptions:"Relevance (F>10) · Exclusion restriction · Monotonicity",
        notes:"Weak instruments (F<10) bias estimates toward OLS. Exclusion restriction is untestable — requires strong theoretical argument." },
      { id:"rdd", name:"Regression Discontinuity (RDD)", domains:["causal","econ"],
        what:"Exploits a deterministic threshold in a running variable determining treatment. Compares units just above vs. below — quasi-experimental variation.",
        inputs:"Outcome · Running variable · Treatment cutoff",
        outputs:"Local Average Treatment Effect at threshold · Bandwidth",
        assumptions:"Continuity of potential outcomes at cutoff · No manipulation",
        notes:"Test for manipulation with McCrary density test. Fuzzy RDD uses threshold as an instrument. External validity is local to the threshold." },
      { id:"psm", name:"Propensity Score Matching / IPW", domains:["causal","stats"],
        what:"Matches treated and control units on their estimated treatment probability to reduce observed selection bias.",
        inputs:"Treatment indicator · Outcome · Observed confounders",
        outputs:"ATE or ATT estimate · Matched dataset · Balance diagnostics (SMD)",
        assumptions:"Conditional independence given observables · Common support",
        notes:"Always check covariate balance (SMD<0.1) after matching. Does NOT handle unobserved confounders. Doubly-robust AIPW combines PS and outcome models." },
      { id:"synth", name:"Synthetic Control", domains:["causal","econ"],
        what:"Constructs a weighted combination of untreated units mirroring the treated unit's pre-treatment trajectory — a data-driven counterfactual.",
        inputs:"Panel outcome data · One treated unit · Many untreated donors · Long pre-period",
        outputs:"Synthetic counterfactual path · Treatment effect estimates · Placebo tests",
        assumptions:"Synthetic control can reproduce pre-treatment trend · No spillovers",
        notes:"Ideal for single treated unit. Inference via permutation / placebo tests. Requires substantial pre-treatment data." },
      { id:"cf", name:"Causal Forest / Heterogeneous Treatment Effects", domains:["causal","ml"],
        what:"ML approach estimating Conditional Average Treatment Effect (CATE) for each individual or subgroup. Identifies who benefits most from treatment.",
        inputs:"Outcome · Treatment assignment · Feature covariates",
        outputs:"CATE per observation · Confidence intervals · Best linear projection",
        assumptions:"Unconfoundedness · Overlap/positivity",
        notes:"Use doubly-robust (DR) scores for robustness. EconML (Python) or grf (R). Use with randomized experiments or strong unconfoundedness assumption." },
    ]
  },
  {
    id:"panel", icon:"📊", name:"Analyze Panel / Longitudinal Data",
    summary:"Model repeated observations across units over time, controlling for unobserved heterogeneity.",
    methods:[
      { id:"fe", name:"Fixed Effects (FE) Model", domains:["econ"],
        what:"Controls for all time-invariant unit unobservables by within-unit demeaning. Identifies effects from variation over time within each unit.",
        inputs:"Panel data · Outcome · Time-varying covariates",
        outputs:"Within-unit coefficients · Clustered standard errors",
        assumptions:"Fixed effects capture all time-invariant confounders · Strict exogeneity",
        notes:"Cannot estimate time-invariant variable effects. Cluster SEs at unit level. Use Hausman test to choose FE vs. RE. fixest in R is extremely fast." },
      { id:"re", name:"Random Effects (RE) Model", domains:["econ","stats"],
        what:"Treats unit unobservables as random variables uncorrelated with covariates. More efficient than FE and allows time-invariant variable coefficients.",
        inputs:"Panel data · Outcome · Time-varying and time-invariant covariates",
        outputs:"Coefficient estimates including time-invariant variables · GLS SEs",
        assumptions:"Random effects uncorrelated with all regressors (Hausman test)",
        notes:"If Hausman test rejects, use FE. Consider Mundlak device as compromise. plm (R); xtreg (Stata)." },
      { id:"qr", name:"Quantile Regression", domains:["econ","stats"],
        what:"Estimates conditional quantiles (median, 90th percentile) of the outcome rather than the mean. Reveals heterogeneous effects across the distribution.",
        inputs:"Numeric/encoded features · Continuous outcome",
        outputs:"Quantile-specific coefficients · Distributional effect picture",
        assumptions:"Fewer than OLS; no homoscedasticity required",
        notes:"Use when distribution tails matter (wages, risk). Bootstrapped SEs recommended. quantreg (R); statsmodels (Python)." },
      { id:"heckman", name:"Heckman Selection Model", domains:["econ"],
        what:"Two-stage correction for sample selection bias. Stage 1: probit for selection. Stage 2: outcome regression with inverse Mills ratio correcting the bias.",
        inputs:"Partially observed outcome · Selection equation with exclusion restriction",
        outputs:"Selection-corrected coefficients · Lambda (inverse Mills ratio) coefficient",
        assumptions:"Bivariate normality · Valid exclusion restriction",
        notes:"Exclusion restriction is critical — must predict selection but not the outcome directly. Used for wages, credit, program participation." },
    ]
  },
  {
    id:"anomaly", icon:"🚨", name:"Detect Anomalies and Outliers",
    summary:"Identify unusual observations that deviate significantly from expected patterns.",
    methods:[
      { id:"isoforest", name:"Isolation Forest", domains:["ml"],
        what:"Anomaly detection via random trees that isolate points with random splits. Anomalies require fewer splits and receive low anomaly scores.",
        inputs:"Numeric features · No labels required",
        outputs:"Anomaly scores · Binary labels (normal / anomaly)",
        assumptions:"Anomalies are rare, few, and meaningfully different",
        notes:"Fast, scalable default for tabular anomaly detection. Key parameter: contamination (expected fraction of anomalies). Works well in high dimensions." },
      { id:"lof", name:"Local Outlier Factor (LOF)", domains:["ml"],
        what:"Measures local density deviation relative to k neighbors. Points in lower-density regions than their neighborhood score as outliers.",
        inputs:"Standardized numeric features",
        outputs:"LOF scores · Binary anomaly labels",
        assumptions:"Normal points exist in dense compact regions; meaningful distance metric",
        notes:"Effective for local anomalies that global methods miss. O(n²) — expensive for large datasets. Good for spatial or clustered data." },
      { id:"zscore", name:"Statistical Thresholds (Z-Score / IQR / Mahalanobis)", domains:["stats"],
        what:"Flags observations beyond statistical thresholds. IQR is robust; Z-score assumes normality; Mahalanobis handles multivariate outlier detection.",
        inputs:"Univariate or multivariate numeric data",
        outputs:"Binary outlier flags · Distance scores",
        assumptions:"Z-score: normality; IQR: unimodal; Mahalanobis: multivariate normal",
        notes:"Simple, fast, interpretable first pass. Mahalanobis accounts for correlations between variables — use for multivariate detection." },
      { id:"ae-anom", name:"Autoencoder-Based Detection", domains:["dl"],
        what:"Train an autoencoder on normal data only. High reconstruction error on new data flags anomalies — unusual patterns are harder to compress.",
        inputs:"Numeric or image data · Labeled normal training data only",
        outputs:"Reconstruction errors · Anomaly labels via threshold",
        assumptions:"Normal data is compressible; anomalies have high reconstruction error",
        notes:"Best for complex/image/time-series data. LSTM autoencoders for temporal anomaly detection. Threshold requires tuning on held-out normal data." },
    ]
  },
  {
    id:"bayesian", icon:"🎲", name:"Perform Bayesian Inference",
    summary:"Update beliefs probabilistically using data and prior knowledge to obtain full posterior distributions.",
    methods:[
      { id:"mcmc", name:"MCMC (NUTS / HMC / Gibbs / Metropolis)", domains:["bayes"],
        what:"Sampling algorithms drawing from the posterior distribution when it cannot be computed analytically. NUTS/HMC is the gold standard for modern Bayesian modeling.",
        inputs:"Likelihood + prior specification · Observed data · Model in Stan/PyMC",
        outputs:"Posterior samples · Credible intervals · Trace plots · R̂ convergence diagnostics",
        assumptions:"Well-specified model · Chains must converge (R̂ < 1.01)",
        notes:"Always check convergence. Computationally expensive for large models. Consider Variational Inference for scalability." },
      { id:"vi", name:"Variational Inference (VI / ADVI)", domains:["bayes","dl"],
        what:"Approximates the posterior with a simpler distribution by minimizing KL divergence via optimization (ELBO maximization). Much faster than MCMC.",
        inputs:"Model specification · Data",
        outputs:"Approximate posterior · ELBO objective",
        assumptions:"True posterior well-approximated by chosen variational family",
        notes:"Faster than MCMC but may underestimate posterior variance. Used in Bayesian neural networks and VAEs. Mean-field VI assumes independent parameters." },
      { id:"hier-bayes", name:"Hierarchical Bayesian Models", domains:["bayes","stats"],
        what:"Multi-level models where group parameters are drawn from a population distribution estimated simultaneously. Enables partial pooling — groups inform each other.",
        inputs:"Grouped/nested data · Group-level and observation-level predictors",
        outputs:"Group-level + population-level posteriors · Partial-pooled estimates",
        assumptions:"Groups are exchangeable · Hierarchical structure is theoretically justified",
        notes:"Solves the small-group problem via shrinkage. Better than no-pooling or full-pooling. Implement in PyMC, Stan, or brms (R)." },
      { id:"bayes-ab", name:"Bayesian A/B Testing", domains:["bayes","stats"],
        what:"Computes posterior probability that one variant beats another. Provides direct probability statements and expected loss — avoiding p-value threshold issues.",
        inputs:"Conversion counts or metric values per variant · Prior encoding historical baseline",
        outputs:"P(B > A) · Expected loss · Credible intervals for lift",
        assumptions:"Beta-Binomial or Normal-Normal conjugate model; prior is justified",
        notes:"Allows principled early stopping. Expected loss framework is decision-theoretically sound. Requires explicit prior choice." },
    ]
  },
  {
    id:"nlp", icon:"📝", name:"Process and Understand Text",
    summary:"Extract meaning, structure, and insights from natural language data.",
    methods:[
      { id:"tfidf", name:"TF-IDF / Bag-of-Words", domains:["nlp","stats"],
        what:"Represents documents as weighted term-frequency vectors. TF-IDF down-weights common words and up-weights discriminative terms.",
        inputs:"Raw text documents",
        outputs:"Sparse document-term matrix for downstream ML",
        assumptions:"Word order unimportant; local frequency encodes relevance",
        notes:"Combine with Logistic Regression or SVM for a strong text baseline. N-grams capture phrase-level information. Fast at any scale." },
      { id:"bert", name:"BERT / Transformer Fine-Tuning", domains:["nlp","dl"],
        what:"Pre-trained bidirectional transformers fine-tuned on downstream tasks. Contextual embeddings capture word meaning in context, not one fixed vector per word.",
        inputs:"Tokenized text · Small labeled fine-tuning dataset (transfer learning)",
        outputs:"Contextual embeddings · Classification logits · Token-level predictions",
        assumptions:"Pre-training domain reasonably related to target domain",
        notes:"State-of-the-art for most NLP tasks. Use HuggingFace Transformers. DistilBERT for speed; RoBERTa for accuracy. Domain-specific models (BioBERT, FinBERT) for specialized fields." },
      { id:"lda", name:"LDA Topic Modeling", domains:["nlp","stats","bayes"],
        what:"Generative probabilistic model discovering K latent topics as distributions over words, with documents represented as mixtures of topics.",
        inputs:"Tokenized corpus (stopwords removed, lemmatized) · K number of topics",
        outputs:"K topics as word distributions · Document-topic proportions",
        assumptions:"Documents are mixtures of topics; topics are distributions over vocabulary",
        notes:"Choose K via topic coherence score. BERTopic is a modern neural alternative using BERT embeddings for far better topics." },
      { id:"ner", name:"Named Entity Recognition (NER)", domains:["nlp","dl"],
        what:"Sequence labeling identifying and classifying named entities (persons, organizations, locations, dates) in text via BIO tagging.",
        inputs:"Raw text · Optional labeled training data for fine-tuning",
        outputs:"Entity spans with type labels (PER, ORG, LOC…) · Entity-level F1",
        assumptions:"Entity patterns are learnable from lexical and contextual features",
        notes:"spaCy and HuggingFace offer excellent pre-trained models. Fine-tune on domain data for clinical, legal, or other specialized entities." },
    ]
  },
  {
    id:"deeplearning", icon:"🧠", name:"Apply Deep Learning Architectures",
    summary:"Leverage neural networks for complex pattern recognition, generation, and representation learning.",
    methods:[
      { id:"cnn", name:"Convolutional Neural Network (CNN)", domains:["dl"],
        what:"Hierarchical feature extraction via learned convolutional filters capturing spatial locality and translation invariance. Foundation of computer vision.",
        inputs:"Image tensors (H×W×C) · Any grid-structured data",
        outputs:"Class predictions · Feature maps · Object detections / segmentations",
        assumptions:"Spatial locality of features; translation equivariance is appropriate",
        notes:"Use pre-trained models (ResNet, EfficientNet, ConvNeXt) + fine-tuning. ViT is a strong alternative. Data augmentation is critical. Never train from scratch on small data." },
      { id:"transformer", name:"Transformer / Self-Attention", domains:["dl","nlp"],
        what:"Self-attention mechanism directly models pairwise relationships between all sequence positions. Foundation of every modern LLM, BERT, GPT, ViT, and diffusion model.",
        inputs:"Tokenized sequences or image patches · Massive pre-training data",
        outputs:"Contextual representations · Generated sequences · Classification outputs",
        assumptions:"Self-attention captures relevant dependencies; positional encoding handles order",
        notes:"Attention is O(n²) in sequence length — use Flash Attention for long contexts. Fine-tune with LoRA/PEFT for efficiency on consumer hardware." },
      { id:"vae", name:"Variational Autoencoder (VAE)", domains:["dl","bayes"],
        what:"Probabilistic autoencoder imposing a Gaussian prior on the latent space. Enables principled generation, interpolation, and density modeling.",
        inputs:"Images, tabular data, or sequences",
        outputs:"Latent representations (μ, σ) · Generated samples · Reconstruction + KL loss",
        assumptions:"Data explained by a low-dimensional Gaussian latent variable",
        notes:"More stable training than GANs. Useful for anomaly detection, data augmentation, and disentangled representations." },
      { id:"transfer", name:"Transfer Learning / Fine-Tuning", domains:["dl"],
        what:"Initialize with pre-trained weights then adapt to a target task with limited labeled data. Almost always outperforms training from scratch.",
        inputs:"Pre-trained model weights · Small target task dataset",
        outputs:"Fine-tuned model for target task · Adapted representations",
        assumptions:"Source and target domains share useful features",
        notes:"The default approach for modern DL. LoRA / PEFT for efficient LLM fine-tuning. Freeze lower layers initially; unfreeze progressively." },
    ]
  },
  {
    id:"optimization", icon:"⚙️", name:"Optimize Decisions and Schedules",
    summary:"Find the best allocation, schedule, or policy subject to real-world constraints.",
    methods:[
      { id:"lp", name:"Linear Programming (LP)", domains:["optim","econ"],
        what:"Maximizes or minimizes a linear objective subject to linear constraints. The foundational OR model, solved efficiently by Simplex or interior-point algorithms.",
        inputs:"Objective coefficients · Constraint matrix (A) · RHS bounds (b) · Variable bounds",
        outputs:"Optimal variable values · Objective value · Shadow prices (dual variables) · Reduced costs",
        assumptions:"Linearity of objective and constraints · Continuous decision variables · Feasible and bounded",
        notes:"Shadow prices reveal the marginal value of relaxing each constraint — key for economic interpretation. Use PuLP, CVXPY, or scipy. Duality is essential: every LP has a dual that is often an economic pricing problem." },
      { id:"milp", name:"Mixed-Integer Programming (MIP / ILP)", domains:["optim"],
        what:"Extends LP by requiring some variables to be integer or binary. Enables scheduling, routing, assignment, and combinatorial decisions.",
        inputs:"Objective · Linear constraints · Integrality / binary constraints",
        outputs:"Optimal integer solution · Optimality gap · LP relaxation bound",
        assumptions:"Problem structure expressible as MIP; computational budget sufficient",
        notes:"Binary variables model yes/no decisions (assign worker i to shift j). Use Gurobi, CPLEX, or open-source CBC/HiGHS via PuLP or Pyomo. NP-hard in general — formulation quality matters enormously." },
      { id:"dp", name:"Dynamic Programming (DP)", domains:["optim","econ"],
        what:"Solves multi-stage decision problems by decomposing into overlapping subproblems via Bellman's principle of optimality. Foundational to optimal control and structural econometrics.",
        inputs:"State space · Action space · Transition function · Reward/cost · Discount factor",
        outputs:"Value function V(s) · Optimal policy π*(s) for each state",
        assumptions:"Markov property · Finite or discretized state-action space for tabular DP",
        notes:"Value Iteration and Policy Iteration are the core algorithms. Curse of dimensionality limits exact DP — use approximate DP or reinforcement learning in high dimensions. The Rust (1987) bus engine model is the canonical econometrics example." },
      { id:"convex", name:"Convex Optimization (QP / SOCP / SDP)", domains:["optim","stats","ml"],
        what:"A subclass of NLP where both objective and feasible region are convex, guaranteeing any local minimum is global. Includes QPs, SOCPs, and SDPs.",
        inputs:"Convex objective · Convex constraints (DCP-compatible form)",
        outputs:"Globally optimal solution · Dual variables · Certificate of optimality",
        assumptions:"Problem is convex — DCP rules in CVXPY verify this automatically",
        notes:"Use CVXPY with DCP rules. Portfolio optimization (Markowitz) is a QP. Lasso/Ridge are convex. SOCP handles norms; SDP handles matrix constraints. Solvable in polynomial time." },
      { id:"stochastic", name:"Stochastic Programming (Two-Stage / SAA)", domains:["optim","econ"],
        what:"Optimization under uncertainty where some parameters are random. Two-stage: first-stage decisions before uncertainty resolves; recourse decisions after.",
        inputs:"First-stage variables · Uncertainty scenarios · Recourse structure",
        outputs:"Here-and-now decisions · Expected second-stage cost · EVPI · VSS",
        assumptions:"Uncertainty well-represented by scenarios; recourse is complete",
        notes:"EVPI and VSS quantify the cost of uncertainty. Applications: energy dispatch, supply chain, financial planning. Use PySP or Pyomo." },
      { id:"network", name:"Network Flow & Graph Optimization", domains:["optim"],
        what:"Optimizes flows through networks: shortest path, minimum spanning tree, maximum flow, min-cost flow, and transportation/assignment problems.",
        inputs:"Graph (nodes + edges) · Capacities · Costs · Supply/demand at nodes",
        outputs:"Optimal flow on each arc · Minimum cost / maximum flow · Shortest paths",
        assumptions:"Network structure; cost and capacity data on edges",
        notes:"Min-cost flow generalizes transport, assignment, and shortest-path problems. Ubiquitous in logistics and scheduling. Use NetworkX for prototyping; OR-Tools for production." },
      { id:"cp", name:"Constraint Programming (CP-SAT)", domains:["optim"],
        what:"Declarative framework solving combinatorial problems via constraint propagation and intelligent search. Natural for scheduling, rostering, and assignment.",
        inputs:"Decision variables with domains · Constraint expressions (AllDifferent, cumulative, no-overlap…)",
        outputs:"Feasible or optimal solution satisfying all constraints",
        assumptions:"Problem expressible via discrete variables and combinatorial constraints",
        notes:"CP-SAT solver (Google OR-Tools) is state-of-the-art for scheduling. Better than MIP for highly constrained problems. Classic applications: nurse rostering, job-shop scheduling, vehicle routing." },
      { id:"mpc", name:"Model Predictive Control (MPC)", domains:["optim","ts"],
        what:"Solves a finite-horizon optimization at each time step, executes the first decision, observes new information, and re-optimizes — handling real-time uncertainty naturally.",
        inputs:"System dynamics model · Objective function · State constraints · Disturbance forecast",
        outputs:"Optimal control sequence · First action · Predicted state trajectory",
        assumptions:"System model is accurate; optimization tractable within each control time step",
        notes:"Gold standard in process control, energy management, and autonomous systems. Explicitly trades off multiple objectives over time. CVXPY or CasADi for implementation." },
    ]
  },
  {
    id:"survival", icon:"⏱️", name:"Model Time-to-Event Data",
    summary:"Analyze duration until an event occurs, correctly handling censored observations.",
    methods:[
      { id:"km", name:"Kaplan-Meier Estimator", domains:["stats"],
        what:"Non-parametric estimator of the survival function S(t). Correctly handles censored observations. The universal first step for any survival analysis.",
        inputs:"Time-to-event · Event indicator (1=event, 0=censored)",
        outputs:"Survival curve S(t) · Median survival time · Log-rank test for group comparison",
        assumptions:"Non-informative censoring (censoring independent of event probability)",
        notes:"First step in every survival analysis. Compare groups with log-rank test. RMST avoids proportional hazards assumption for group comparisons." },
      { id:"cox", name:"Cox Proportional Hazards Model", domains:["stats"],
        what:"Semi-parametric regression for the hazard rate. Does not require specifying the baseline hazard — partial likelihood handles it non-parametrically.",
        inputs:"Time-to-event · Event indicator · Covariates",
        outputs:"Hazard ratios (exp(β)) · Survival curves · Model diagnostics",
        assumptions:"Proportional hazards (test with Schoenfeld residuals) · Log-linear covariate effects",
        notes:"Most widely used survival model. HR > 1 increases risk; HR < 1 is protective. Use time-varying coefficients or stratification if PH assumption is violated." },
      { id:"aft", name:"Accelerated Failure Time (AFT) Model", domains:["stats"],
        what:"Parametric survival model relating log(survival time) linearly to covariates. An often more interpretable framing than the hazard ratio.",
        inputs:"Time-to-event · Event indicator · Covariates · Distribution choice",
        outputs:"Time ratios · Parametric survival curve · Predictions",
        assumptions:"Specified parametric distribution for survival time",
        notes:"More interpretable when PH assumption is violated. Time ratio: 'Treatment multiplies survival time by TR.' Use AIC to select distribution." },
    ]
  },
  {
    id:"recommenders", icon:"⭐", name:"Build Recommendation Systems",
    summary:"Predict user preferences and surface relevant items at scale.",
    methods:[
      { id:"collab", name:"Collaborative Filtering (ALS / Matrix Factorization)", domains:["ml"],
        what:"Decomposes the user-item interaction matrix into low-rank user and item latent factors. Predicts preferences from patterns of similar users and items.",
        inputs:"User-item interaction matrix (ratings / purchases / clicks) · Sparse data is fine",
        outputs:"Predicted scores for all user-item pairs · Top-N recommendations",
        assumptions:"Preferences are representable in a low-dimensional latent space",
        notes:"ALS scales well to implicit feedback. Cold start problem for new users/items. Use ALS in Spark for large-scale deployments." },
      { id:"content", name:"Content-Based Filtering", domains:["ml","nlp"],
        what:"Recommends items similar to those a user previously liked, based on item feature similarity. User profile built from features of historically interacted items.",
        inputs:"Item features (text, metadata, images) · User interaction history",
        outputs:"Item similarity scores · Personalized top-N recommendations",
        assumptions:"User preferences are stable and reflected in past interactions",
        notes:"No cold start for new items — only features needed. Prone to filter bubbles. TF-IDF or embeddings for text; cosine similarity for matching." },
      { id:"two-tower", name:"Two-Tower / Neural Collaborative Filtering", domains:["dl","ml"],
        what:"Dual-encoder architecture embedding users and items separately, trained via contrastive loss. Powers YouTube, Pinterest, and most large-scale industrial recommenders.",
        inputs:"User and item features/IDs · Interaction labels",
        outputs:"User and item embeddings for ANN retrieval · Ranked recommendations",
        assumptions:"User and item representations can be separated; sufficient training data",
        notes:"Fast inference via approximate nearest neighbor (FAISS, ScaNN). Use for retrieval stage; a ranker refines the candidates. Train with in-batch negatives." },
    ]
  },
  {
    id:"modeleval", icon:"✅", name:"Evaluate and Validate Models",
    summary:"Rigorously assess model performance, reliability, calibration, and interpretability.",
    methods:[
      { id:"cv", name:"Cross-Validation (k-Fold / Stratified / TimeSeriesSplit)", domains:["ml","stats"],
        what:"Estimates generalization performance via multiple non-overlapping train/eval splits. Reduces variance of performance estimates vs. a single hold-out.",
        inputs:"Dataset · Model · k folds",
        outputs:"Mean ± std of evaluation metric across k folds",
        assumptions:"IID observations (use Stratified for class imbalance; TimeSeriesSplit for temporal data)",
        notes:"5 or 10 folds is standard. Use nested CV for hyperparameter tuning to avoid optimistic bias. Always stratify for classification." },
      { id:"shap", name:"SHAP Values / Feature Importance", domains:["ml"],
        what:"Assigns each feature a fair contribution to each prediction via cooperative game theory. Consistent and locally accurate — the gold standard for interpretability.",
        inputs:"Trained model · Dataset",
        outputs:"Per-feature per-observation SHAP values · Global importance · Dependence plots",
        assumptions:"Shapley axioms; TreeSHAP is exact for tree models",
        notes:"TreeSHAP is exact and fast for gradient boosting/RF. KernelSHAP is model-agnostic but slow. Required for many ML fairness and compliance audits." },
      { id:"calibration", name:"Calibration (Reliability Diagram / Brier Score)", domains:["stats","ml"],
        what:"Tests whether predicted probabilities match observed event frequencies. A model with P(Y=1 | p̂=0.7) ≈ 0.7 is well-calibrated.",
        inputs:"Predicted probabilities · True binary labels",
        outputs:"Reliability diagram · Brier score · Expected Calibration Error (ECE)",
        assumptions:"Sufficient data in each probability bin",
        notes:"Post-hoc calibration via Platt scaling or Isotonic Regression. Gradient boosting and RF often need calibration. Critical for medicine, credit, and fraud." },
      { id:"roc", name:"ROC-AUC / PR-AUC / Classification Metrics", domains:["ml","stats"],
        what:"ROC-AUC measures discrimination across all thresholds. PR-AUC is preferred for imbalanced classes. F1, precision, and recall at a fixed threshold.",
        inputs:"Predicted probabilities or scores · True class labels",
        outputs:"ROC curve · AUC · PR curve · F1 · Confusion matrix",
        assumptions:"Threshold-invariant (AUC); threshold-specific (precision/recall/F1)",
        notes:"Prefer PR-AUC over ROC-AUC for imbalanced datasets. Accuracy alone is misleading. For multi-class: macro/micro/weighted averaging." },
    ]
  },
];

// ─── Components ───────────────────────────────────────────────────────────────

function Chip({ domain }) {
  const d = D[domain];
  if (!d) return null;
  return <span className="chip" style={{ background: d.dim, color: d.color, border: `1px solid ${d.color}28` }}>{d.label}</span>;
}

function InfoBlock({ icon, label, value, color }) {
  return (
    <div style={{ borderLeft: `3px solid ${color}45`, paddingLeft: 12, marginBottom: 12 }}>
      <div style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", color, letterSpacing: "0.08em", marginBottom: 4 }}>{icon} {label}</div>
      <div style={{ fontSize: 12.5, color: "#7a95b5", lineHeight: 1.6 }}>{value}</div>
    </div>
  );
}

function MethodDetail({ method }) {
  const primaryColor = D[method.domains[0]]?.color ?? "#60a5fa";
  return (
    <div className="detail-enter" style={{ padding: "16px 20px 20px", borderTop: "1px solid #0d1e38", background: "#06101e" }}>
      <p style={{ fontSize: 13, color: "#8ba5c4", lineHeight: 1.7, marginBottom: 18 }}>{method.what}</p>
      <InfoBlock icon="→" label="INPUTS"      color="#38bdf8" value={method.inputs} />
      <InfoBlock icon="←" label="OUTPUTS"     color="#4ade80" value={method.outputs} />
      <InfoBlock icon="△" label="ASSUMPTIONS" color="#facc15" value={method.assumptions} />
      <InfoBlock icon="◆" label="NOTES"       color={primaryColor} value={method.notes} />
    </div>
  );
}

function TopicPage({ topic, onBack, domainFilter, setDomainFilter }) {
  const [openId, setOpenId] = useState(null);
  const methods = domainFilter === "all" ? topic.methods : topic.methods.filter(m => m.domains.includes(domainFilter));
  const usedDomains = [...new Set(topic.methods.flatMap(m => m.domains))];

  return (
    <div className="page-enter" style={{ maxWidth: 740, margin: "0 auto", padding: "28px 20px 60px" }}>
      <div className="back" onClick={onBack}>
        <span style={{ fontSize: 17 }}>←</span> All Topics
      </div>

      <div style={{ margin: "18px 0 22px" }}>
        <div style={{ fontSize: 34, marginBottom: 8 }}>{topic.icon}</div>
        <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(20px,4vw,30px)", fontWeight: 800, color: "#f1f5f9", letterSpacing: "-0.02em", marginBottom: 8 }}>
          {topic.name}
        </h1>
        <p style={{ fontSize: 13.5, color: "#4a6580", lineHeight: 1.65 }}>{topic.summary}</p>
      </div>

      {/* Domain filter pills */}
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 20 }}>
        {["all", ...usedDomains].map(key => {
          const isAll = key === "all";
          const active = domainFilter === key;
          const d = D[key];
          return (
            <button key={key} className="tag" onClick={() => setDomainFilter(key)} style={{
              background: active ? (isAll ? "rgba(148,163,184,0.15)" : d.dim) : "transparent",
              color: active ? (isAll ? "#94a3b8" : d.color) : "#3a5270",
              borderColor: active ? (isAll ? "#475569" : d.color) : "#0f1e38",
            }}>
              {isAll ? "All" : d.label}
            </button>
          );
        })}
      </div>

      {/* Methods */}
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {methods.length === 0 && <div style={{ color: "#2d4060", fontSize: 13, padding: "16px 0", fontFamily: "'JetBrains Mono', monospace" }}>No methods match this filter.</div>}
        {methods.map((m, i) => {
          const isOpen = openId === m.id;
          const primary = D[m.domains[0]]?.color ?? "#60a5fa";
          return (
            <div key={m.id} style={{ borderRadius: 10, border: `1px solid ${isOpen ? primary + "45" : "#0d1e38"}`, overflow: "hidden" }}>
              <div className="method-row"
                onClick={() => setOpenId(isOpen ? null : m.id)}
                style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "13px 16px", background: isOpen ? "#091525" : "#07101e", gap: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: primary, flexShrink: 0, opacity: isOpen ? 1 : 0.35 }} />
                  <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 600, fontSize: 14, color: isOpen ? "#e2e8f0" : "#7a95b5" }}>{m.name}</span>
                </div>
                <div style={{ display: "flex", gap: 5, alignItems: "center", flexShrink: 0 }}>
                  {m.domains.map(d => <Chip key={d} domain={d} />)}
                  <span style={{ color: "#2a3f5c", fontSize: 15, marginLeft: 4, display: "inline-block", transform: isOpen ? "rotate(90deg)" : "none", transition: "transform 0.18s" }}>›</span>
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

function SearchResults({ query, onSelectMethod }) {
  const results = useMemo(() => {
    const q = query.toLowerCase();
    return TOPICS.flatMap(t => t.methods
      .filter(m => [m.name, m.what, m.inputs, m.outputs, m.notes, t.name].some(s => s?.toLowerCase().includes(q)))
      .map(m => ({ topic: t, method: m }))
    ).slice(0, 24);
  }, [query]);

  return (
    <div className="page-enter" style={{ maxWidth: 740, margin: "0 auto", padding: "24px 20px 60px" }}>
      <div style={{ marginBottom: 18 }}>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "#2a3f5c", letterSpacing: "0.08em" }}>
          {results.length} RESULT{results.length !== 1 ? "S" : ""} FOR "{query.toUpperCase()}"
        </span>
      </div>
      {results.length === 0 && <div style={{ color: "#2d4060", fontSize: 13, fontFamily: "'JetBrains Mono', monospace" }}>Nothing found. Try a different term.</div>}
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {results.map(({ topic, method }) => {
          const primary = D[method.domains[0]]?.color ?? "#60a5fa";
          return (
            <div key={method.id} className="search-row"
              onClick={() => onSelectMethod(topic, method)}
              style={{ padding: "14px 16px", borderRadius: 10, border: "1px solid #0d1e38", background: "#07101e" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8, marginBottom: 5 }}>
                <div>
                  <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 600, fontSize: 14, color: "#c4d8f0" }}>{method.name}</span>
                  <span style={{ fontSize: 11, color: "#2d4060", marginLeft: 8 }}>{topic.icon} {topic.name}</span>
                </div>
                <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>{method.domains.map(d => <Chip key={d} domain={d} />)}</div>
              </div>
              <p style={{ fontSize: 12, color: "#4a6580", lineHeight: 1.5 }}>{method.what.slice(0, 130)}…</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function HomePage({ onSelectTopic }) {
  const totalMethods = TOPICS.reduce((s, t) => s + t.methods.length, 0);
  return (
    <div className="page-enter">
      {/* Hero */}
      <div style={{ borderBottom: "1px solid #0a1628", padding: "44px 20px 36px", background: "linear-gradient(180deg, #080f22 0%, #070d1b 100%)" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(56,189,248,0.07)", border: "1px solid rgba(56,189,248,0.14)", borderRadius: 20, padding: "3px 12px", marginBottom: 14 }}>
            <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#38bdf8" }} />
            <span style={{ fontSize: 10, color: "#38bdf8", fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.1em" }}>DATA SCIENCE REFERENCE</span>
          </div>
          <h1 style={{ fontFamily: "'Fraunces', serif", fontWeight: 800, fontSize: "clamp(28px,5vw,50px)", color: "#f1f5f9", letterSpacing: "-0.025em", lineHeight: 1.1, marginBottom: 10 }}>
            The Data Science Atlas
          </h1>
          <p style={{ fontSize: 14, color: "#3d5575", maxWidth: 500, lineHeight: 1.7 }}>
            {TOPICS.length} topics · {totalMethods} methods. Pick a topic to explore the models and techniques inside it.
          </p>
        </div>
      </div>

      {/* Topic grid */}
      <div style={{ maxWidth: 860, margin: "0 auto", padding: "28px 20px 60px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 10 }}>
          {TOPICS.map((t, i) => {
            const accent = D[t.methods[0]?.domains[0]]?.color ?? "#60a5fa";
            const chips = [...new Set(t.methods.flatMap(m => m.domains))].slice(0, 3);
            return (
              <div key={t.id} className="card-hover"
                onClick={() => onSelectTopic(t)}
                style={{ background: "#07101e", border: "1px solid #0d1e38", borderRadius: 12, padding: "18px 18px 16px", animationDelay: `${i * 0.03}s` }}>
                <div style={{ height: 2, background: `linear-gradient(90deg, ${accent}80, transparent)`, borderRadius: 2, marginBottom: 14 }} />
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                  <span style={{ fontSize: 24 }}>{t.icon}</span>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, color: "#1e3050", letterSpacing: "0.04em" }}>{t.methods.length} methods</span>
                </div>
                <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: 15, fontWeight: 600, color: "#b8d0ea", lineHeight: 1.35, marginBottom: 8 }}>{t.name}</h3>
                <p style={{ fontSize: 11.5, color: "#354f6a", lineHeight: 1.6, marginBottom: 12 }}>{t.summary}</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                  {chips.map(d => <Chip key={d} domain={d} />)}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [view, setView] = useState({ type: "home" });
  const [search, setSearch] = useState("");
  const [domainFilter, setDomainFilter] = useState("all");

  function goHome() { setView({ type: "home" }); setSearch(""); setDomainFilter("all"); }

  function handleSearch(val) {
    setSearch(val);
    if (val.trim().length > 1) setView({ type: "search" });
    else if (!val) setView(v => v.type === "search" ? { type: "home" } : v);
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

  const totalMethods = TOPICS.reduce((s, t) => s + t.methods.length, 0);

  return (
    <div style={{ background: "#070d1b", minHeight: "100vh", fontFamily: "'Outfit', sans-serif", color: "#e2e8f0" }}>
      <style>{STYLES}</style>

      {/* ── Sticky header ── */}
      <div style={{ position: "sticky", top: 0, zIndex: 100, background: "rgba(7,13,27,0.95)", backdropFilter: "blur(10px)", borderBottom: "1px solid #0a1628" }}>
        <div style={{ maxWidth: 860, margin: "0 auto", padding: "0 20px", display: "flex", alignItems: "center", gap: 14, height: 56 }}>

          {/* Wordmark */}
          <div onClick={goHome} style={{ cursor: "pointer", flexShrink: 0, display: "flex", alignItems: "baseline", gap: 7 }}>
            <span style={{ fontFamily: "'Fraunces', serif", fontWeight: 800, fontSize: 17, color: "#e2e8f0", letterSpacing: "-0.02em" }}>DS Atlas</span>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: "#1e3050", letterSpacing: "0.05em" }}>{totalMethods} methods</span>
          </div>

          <div style={{ width: 1, height: 20, background: "#0d1e38", flexShrink: 0 }} />

          {/* Breadcrumb */}
          {view.type === "topic" && (
            <div style={{ fontSize: 12, color: "#2d4a6a", fontFamily: "'Outfit', sans-serif", flexShrink: 0, maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {view.topic.icon} {view.topic.name}
            </div>
          )}

          {/* Search */}
          <div style={{ flex: 1, position: "relative" }}>
            <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#1a2f50", fontSize: 14, pointerEvents: "none" }}>⌕</span>
            <input
              value={search}
              onChange={e => handleSearch(e.target.value)}
              placeholder="Search any method or concept…"
              style={{ width: "100%", background: "#09141f", border: "1px solid #0d1e38", borderRadius: 8, padding: "7px 30px 7px 30px", color: "#c4d8f0", fontSize: 13, fontFamily: "'Outfit', sans-serif" }}
            />
            {search && (
              <span onClick={() => { setSearch(""); if (view.type === "search") goHome(); }}
                style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", color: "#2a3f5c", cursor: "pointer", fontSize: 12 }}>✕</span>
            )}
          </div>
        </div>
      </div>

      {/* ── Page ── */}
      {view.type === "home"   && <HomePage onSelectTopic={handleSelectTopic} />}
      {view.type === "search" && <SearchResults query={search} onSelectMethod={handleSelectMethod} />}
      {view.type === "topic"  && <TopicPage topic={view.topic} onBack={goHome} domainFilter={domainFilter} setDomainFilter={setDomainFilter} />}
    </div>
  );
}