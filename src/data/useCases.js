// Use cases organized by business domain, written for a non-technical audience.
// Each category groups scenarios that AI / ML / Statistics can solve.

const BASE_USE_CASE_CATEGORIES = [
  {
    id: "sales-marketing",
    icon: "📣",
    name: "Sales & Marketing",
    description: "Find better leads, personalize campaigns, and understand what makes customers buy.",
    useCases: [
      {
        id: "lead-scoring",
        name: "Lead Scoring & Prioritisation",
        description: "Automatically rank every incoming lead by how likely they are to become a paying customer, so your sales team spends time on the prospects that matter most instead of cold-calling a random list.",
        examples: [
          "A B2B SaaS company scores website visitors based on pages viewed, company size, and email engagement — reps only call leads above 70 / 100.",
          "An auto dealership predicts which online enquiries are most likely to visit the showroom within a week.",
        ],
        poweredBy: "Classification models look at past deals (won vs. lost) and learn which patterns predict a sale. The system studies hundreds of signals — like company size, website visits, and email opens — and figures out which combination of traits the best customers share. Each new lead gets a score based on how closely it matches those winning patterns, so your sales team always knows who to call first.",
        relatedMethods: [
          { methodId: "logistic", topicId: "classification", name: "Logistic Regression" },
          { methodId: "gbm-clf", topicId: "classification", name: "Gradient Boosting (Classifier)" },
          { methodId: "rf-clf", topicId: "classification", name: "Random Forest (Classifier)" },
          { methodId: "shap", topicId: "modeleval", name: "SHAP (Shapley Values)" },
        ],
      },
      {
        id: "customer-segmentation",
        name: "Customer Segmentation",
        description: "Group your customers into meaningful segments — like 'budget-conscious families' or 'premium early adopters' — so you can tailor messaging, pricing, and product features to each group.",
        examples: [
          "An e-commerce retailer discovers five distinct buyer personas and designs separate email campaigns for each.",
          "A telecom provider identifies a segment of high-value users who are at risk of switching carriers.",
        ],
        poweredBy: "Clustering algorithms find natural groupings in purchase behavior, demographics, and engagement data. Think of it like sorting a deck of cards by suit and rank — the system examines every customer's habits and automatically discovers groups that behave alike. These segments update as behavior changes, so your marketing always targets the right audience with the right message.",
        relatedMethods: [
          { methodId: "kmeans", topicId: "clustering", name: "k-Means Clustering" },
          { methodId: "gmm", topicId: "clustering", name: "Gaussian Mixture Models" },
          { methodId: "pca", topicId: "dimred", name: "PCA" },
        ],
      },
      {
        id: "churn-prediction",
        name: "Customer Churn Prediction",
        description: "Predict which customers are about to leave so you can intervene with a targeted offer, a personal call, or a product fix before it's too late.",
        examples: [
          "A streaming service flags subscribers who haven't watched anything in 14 days and sends a personalized 'we miss you' recommendation.",
          "A gym chain predicts members likely to cancel and proactively offers a discounted personal-training session.",
        ],
        poweredBy: "Models learn from historical cancellation patterns — usage frequency drop-offs, support complaints, payment failures. The system reviews what past churners did in the weeks before leaving and spots the same warning signs in current customers. Each customer receives a risk score that updates regularly, giving your retention team a prioritized action list before it's too late.",
        relatedMethods: [
          { methodId: "gbm-clf", topicId: "classification", name: "Gradient Boosting (Classifier)" },
          { methodId: "rf-clf", topicId: "classification", name: "Random Forest (Classifier)" },
          { methodId: "cox", topicId: "survival", name: "Cox Proportional Hazards" },
          { methodId: "shap", topicId: "modeleval", name: "SHAP (Shapley Values)" },
        ],
      },
      {
        id: "recommendation-engines",
        name: "Product & Content Recommendations",
        description: "Show every customer the products, articles, or videos they're most likely to enjoy — the same technology behind 'You might also like' on Amazon and Netflix.",
        examples: [
          "An online bookstore suggests titles based on a customer's reading history and what similar readers enjoyed.",
          "A news app personalizes the homepage so each reader sees the stories most relevant to their interests.",
        ],
        poweredBy: "Collaborative filtering and content-based algorithms compare user behavior and item features to predict preferences. The system notices that people who liked the same things you liked also enjoyed something you haven't seen yet, and surfaces it. It also looks at the characteristics of items you already love — genre, price, style — and finds similar options, producing a personalized shortlist that feels hand-picked.",
        relatedMethods: [
          { methodId: "collab", topicId: "recommenders", name: "Collaborative Filtering" },
          { methodId: "two-tower", topicId: "recommenders", name: "Two-Tower Neural Network" },
          { methodId: "collab", topicId: "recommenders", name: "Collaborative Filtering" },
          { methodId: "contextual-bandit", topicId: "recommenders", name: "Contextual Bandit" },
        ],
      },
      {
        id: "dynamic-pricing",
        name: "Dynamic Pricing",
        description: "Adjust prices in real time based on demand, competition, seasonality, and inventory levels — maximising revenue without turning customers away.",
        examples: [
          "An airline changes seat prices thousands of times per day based on how full each flight is and how soon it departs.",
          "A ride-share app raises fares during peak hours and events to balance supply and demand.",
        ],
        poweredBy: "Regression and reinforcement learning models optimize prices using historical demand curves and real-time signals. The system continuously watches how demand shifts with price, time of day, competitor moves, and inventory levels. It then tests small price adjustments, learns what works, and fine-tunes automatically — like a seasoned trader who never sleeps.",
        relatedMethods: [
          { methodId: "rl", topicId: "optimization", name: "Reinforcement Learning (RL)" },
          { methodId: "gbm-reg", topicId: "regression", name: "Gradient Boosting Regressor" },
          { methodId: "arima", topicId: "timeseries", name: "ARIMA / SARIMA" },
        ],
      },
      {
        id: "marketing-attribution",
        name: "Marketing Attribution & ROI",
        description: "Figure out which marketing channels actually drive sales — was it the Google ad, the Instagram post, or the email newsletter? Stop guessing and allocate budget to what works.",
        examples: [
          "A D2C brand discovers that podcast sponsorships drive 3× more conversions per dollar than paid search.",
          "A retailer learns that TV ads increase next-day website traffic by 40 %, justifying the ad spend.",
        ],
        poweredBy: "Multi-touch attribution models and marketing mix modeling use statistics to untangle the contribution of each channel. The system tracks every customer touchpoint — ad click, email open, store visit — and assigns a fair share of credit to each one. This lets you see which channels actually move the needle and shift budget toward what's working.",
        relatedMethods: [
          { methodId: "ab", topicId: "causal", name: "A/B Testing" },
          { methodId: "did", topicId: "causal", name: "Difference-in-Differences" },
          { methodId: "psm", topicId: "causal", name: "Propensity Score Matching" },
        ],
      },
      {
        id: "sentiment-analysis",
        name: "Brand & Sentiment Monitoring",
        description: "Automatically scan social media, reviews, and support tickets to gauge how people feel about your brand, products, or campaigns — in real time.",
        examples: [
          "A restaurant chain tracks Yelp and Twitter mentions to catch PR issues before they go viral.",
          "A product launch team monitors Reddit and X sentiment hour-by-hour to gauge public reaction.",
        ],
        poweredBy: "Natural language processing reads text and classifies it as positive, negative, or neutral — at scale. The system scans thousands of reviews, tweets, or support tickets in minutes, picking up on word choice and context to gauge mood. It then aggregates the results into a clear dashboard so you can spot trends, react to crises, and track how sentiment changes over time.",
        relatedMethods: [
          { methodId: "sentiment", topicId: "nlp", name: "Sentiment Analysis" },
          { methodId: "bert", topicId: "nlp", name: "BERT / Transformer Embeddings" },
          { methodId: "llm", topicId: "genai", name: "Large Language Models (LLMs)" },
        ],
      },
      {
        id: "ab-testing",
        name: "A / B Testing & Experimentation",
        description: "Run controlled experiments to measure whether a new headline, button color, or pricing page actually improves results — rather than relying on opinion or gut feel.",
        examples: [
          "An e-commerce site tests two checkout flows and finds the shorter one lifts conversions by 12 %.",
          "A SaaS company experiments with a free-trial length of 7 vs. 14 days and measures activation rates.",
        ],
        poweredBy: "Statistical hypothesis testing determines whether observed differences are real or just noise. The system splits your audience randomly into groups, shows each group a different version, and measures the outcomes. It then calculates the probability that one version truly outperforms the other, so you make decisions based on evidence, not hunches.",
        relatedMethods: [
          { methodId: "ab", topicId: "causal", name: "A/B Testing" },
          { methodId: "calibration", topicId: "modeleval", name: "Calibration" },
          { methodId: "bayes-inf", topicId: "bayesian", name: "Bayesian Inference" },
        ],
      },
      {
        id: "customer-lifetime-value",
        name: "Customer Lifetime Value Prediction",
        description: "Estimate how much revenue each customer will generate over their entire relationship with you — so you know how much you can afford to spend acquiring and retaining them.",
        examples: [
          "A subscription box company calculates that the average customer is worth $480 over two years, justifying a $60 acquisition cost.",
          "A mobile game publisher identifies 'whale' players early and tailors VIP in-game offers for them.",
        ],
        poweredBy: "Survival analysis and regression models project future purchase behavior based on early engagement signals. The system looks at how similar past customers spent over time and uses those patterns to forecast each current customer's total value. This helps you decide how much to invest in acquiring or retaining each customer, ensuring your spending always pays off.",
        relatedMethods: [
          { methodId: "cox", topicId: "survival", name: "Cox Proportional Hazards" },
          { methodId: "gbm-reg", topicId: "regression", name: "Gradient Boosting Regressor" },
          { methodId: "aft", topicId: "survival", name: "Accelerated Failure Time (AFT)" },
        ],
      },
      {
        id: "content-generation",
        name: "Automated Content & Copy Generation",
        description: "Use AI to draft product descriptions, ad copy, blog posts, social media captions, and email subject lines — getting a strong first draft in seconds rather than hours.",
        examples: [
          "An e-commerce marketplace auto-generates unique SEO-friendly descriptions for 50,000 products.",
          "A marketing team uses AI to produce 20 headline variations for a Facebook ad and tests the top performers.",
        ],
        poweredBy: "Large language models (generative AI) produce fluent text given a brief or template. You provide a topic, tone, and key points, and the system drafts copy in seconds — much like giving a brief to a junior writer who works instantly. The output can be reviewed, refined, and published, cutting content production time dramatically.",
        relatedMethods: [
          { methodId: "llm", topicId: "genai", name: "Large Language Models (LLMs)" },
          { methodId: "finetuning", topicId: "genai", name: "Fine-Tuning LLMs" },
          { methodId: "rag", topicId: "genai", name: "Retrieval-Augmented Generation (RAG)" },
        ],
      },
    ],
  },
  {
    id: "finance-accounting",
    icon: "💰",
    name: "Finance & Accounting",
    description: "Detect fraud, forecast revenue, manage risk, and automate financial workflows.",
    useCases: [
      {
        id: "fraud-detection",
        name: "Fraud Detection",
        description: "Flag suspicious transactions — like a credit-card purchase in a foreign country minutes after one at home — in real time, before money is lost.",
        examples: [
          "A bank blocks a card the instant it detects three rapid purchases in different countries.",
          "An insurance company spots staged accidents by finding patterns across thousands of claims.",
        ],
        poweredBy: "Anomaly detection and classification models learn what 'normal' looks like and raise alarms when something doesn't fit. The system builds a profile of typical transaction patterns for each account and continuously compares new activity against it. When a transaction deviates — wrong location, unusual amount, odd timing — it's flagged instantly so your team can act before damage is done.",
        relatedMethods: [
          { methodId: "isoforest", topicId: "anomaly", name: "Isolation Forest" },
          { methodId: "ae-anom", topicId: "anomaly", name: "Autoencoder Anomaly Detection" },
          { methodId: "gbm-clf", topicId: "classification", name: "Gradient Boosting (Classifier)" },
          { methodId: "zscore", topicId: "anomaly", name: "Z-Score / σ-Rule" },
        ],
      },
      {
        id: "revenue-forecasting",
        name: "Revenue & Sales Forecasting",
        description: "Predict next quarter's revenue, monthly recurring revenue, or daily sales with enough accuracy to plan hiring, inventory, and budgets confidently.",
        examples: [
          "A CFO uses a 12-month rolling forecast to decide whether to open a new office.",
          "A retail chain predicts Black Friday sales to ensure enough staff and stock.",
        ],
        poweredBy: "Time-series models analyze historical trends, seasonality, and external factors like economic indicators. The system looks at your past revenue, identifies repeating patterns like holiday spikes or summer dips, and factors in outside influences. It then produces a forward-looking projection so finance teams can plan budgets, hiring, and investments with confidence.",
        relatedMethods: [
          { methodId: "prophet", topicId: "timeseries", name: "Prophet" },
          { methodId: "arima", topicId: "timeseries", name: "ARIMA / SARIMA" },
          { methodId: "lstm-ts", topicId: "timeseries", name: "LSTM / Temporal Fusion Transformer" },
          { methodId: "rf-reg", topicId: "regression", name: "Random Forest Regressor" },
        ],
      },
      {
        id: "credit-scoring",
        name: "Credit Scoring & Underwriting",
        description: "Assess how risky it is to lend money to an individual or business — faster and more consistently than a human reviewer.",
        examples: [
          "A fintech lender approves small-business loans in minutes by scoring applicants using cash-flow data.",
          "A credit-card issuer adjusts credit limits quarterly based on updated risk scores.",
        ],
        poweredBy: "Classification and regression models weigh factors like income, payment history, and debt-to-income ratio. The system reviews each applicant's financial profile against thousands of past outcomes to estimate repayment likelihood. This produces a consistent, objective score in seconds — replacing weeks of manual review and reducing human bias.",
        relatedMethods: [
          { methodId: "logistic", topicId: "classification", name: "Logistic Regression" },
          { methodId: "gbm-clf", topicId: "classification", name: "Gradient Boosting (Classifier)" },
          { methodId: "shap", topicId: "modeleval", name: "SHAP (Shapley Values)" },
        ],
      },
      {
        id: "expense-categorisation",
        name: "Expense Categorisation & Audit",
        description: "Automatically sort every transaction into the right budget category and flag items that look out of policy — saving hours of manual review.",
        examples: [
          "An accounting team auto-categorises 10,000 monthly credit-card transactions into GL codes.",
          "A compliance team catches employees booking personal meals as business expenses.",
        ],
        poweredBy: "Text classification and rule-based models read merchant names and descriptions to assign categories. The system looks at each transaction's details — store name, amount, description — and maps it to the correct budget line, like an experienced bookkeeper who never gets tired. Unusual items are flagged for review, keeping your books clean with minimal manual effort.",
        relatedMethods: [
          { methodId: "bert", topicId: "nlp", name: "BERT / Transformer Embeddings" },
          { methodId: "tfidf", topicId: "nlp", name: "TF-IDF" },
          { methodId: "logistic", topicId: "classification", name: "Logistic Regression" },
        ],
      },
      {
        id: "risk-management",
        name: "Portfolio & Risk Management",
        description: "Quantify the risk of investment portfolios, model worst-case scenarios, and decide how to diversify assets to protect against downturns.",
        examples: [
          "A hedge fund simulates 10,000 market scenarios to estimate how much they could lose in a crash.",
          "A pension fund rebalances quarterly based on risk-adjusted return forecasts.",
        ],
        poweredBy: "Monte Carlo simulations, Value-at-Risk models, and optimization algorithms quantify and minimize risk. The system runs thousands of 'what if' scenarios — market crashes, interest-rate swings, currency moves — to estimate potential losses. It then recommends how to rebalance your portfolio to reduce exposure while still pursuing returns.",
        relatedMethods: [
          { methodId: "garch", topicId: "timeseries", name: "GARCH (Volatility Modeling)" },
          { methodId: "bayes-inf", topicId: "bayesian", name: "Bayesian Inference" },
          { methodId: "milp", topicId: "optimization", name: "Mixed-Integer Linear Programming (MILP)" },
          { methodId: "mcmc", topicId: "bayesian", name: "Markov Chain Monte Carlo (MCMC)" },
        ],
      },
      {
        id: "invoice-processing",
        name: "Intelligent Invoice & Document Processing",
        description: "Extract key information — vendor, amount, date, line items — from scanned invoices, receipts, and contracts automatically, eliminating manual data entry.",
        examples: [
          "An accounts-payable department processes 500 invoices a day without anyone typing a number.",
          "A law firm extracts key clauses from thousands of contracts during due diligence.",
        ],
        poweredBy: "Optical character recognition (OCR) and natural language processing read and structure unstructured documents. The system scans a paper or PDF invoice, identifies fields like vendor name, date, and line items, and enters them into your system automatically. Think of it as a tireless data-entry clerk who reads every document in seconds and rarely makes a mistake.",
        relatedMethods: [
          { methodId: "ner", topicId: "nlp", name: "Named Entity Recognition (NER)" },
          { methodId: "bert", topicId: "nlp", name: "BERT / Transformer Embeddings" },
          { methodId: "llm", topicId: "genai", name: "Large Language Models (LLMs)" },
        ],
      },
      {
        id: "aml",
        name: "Anti–Money Laundering (AML) Monitoring",
        description: "Monitor transactions for patterns that suggest money laundering — layering, structuring, or sudden spikes — and generate suspicious-activity reports automatically.",
        examples: [
          "A bank flags a small business that suddenly receives ten times its usual wire-transfer volume.",
          "An exchange detects a pattern of many small deposits just below the reporting threshold.",
        ],
        poweredBy: "Graph analytics and anomaly detection trace money flows and find suspicious networks. The system maps every transaction as a connection between accounts, building a web of relationships. When it spots unusual patterns — like money circling through shell companies or rapid transfers across borders — it alerts your compliance team for investigation.",
        relatedMethods: [
          { methodId: "isoforest", topicId: "anomaly", name: "Isolation Forest" },
          { methodId: "ae-anom", topicId: "anomaly", name: "Autoencoder Anomaly Detection" },
          { methodId: "gbm-clf", topicId: "classification", name: "Gradient Boosting (Classifier)" },
          { methodId: "zscore", topicId: "anomaly", name: "Z-Score / σ-Rule" },
        ],
      },
    ],
  },
  {
    id: "operations-supply-chain",
    icon: "🏭",
    name: "Operations & Supply Chain",
    description: "Optimize logistics, predict equipment failures, and run leaner operations.",
    useCases: [
      {
        id: "demand-forecasting",
        name: "Demand Forecasting",
        description: "Predict how much of each product you'll sell next week, month, or quarter — so you order the right amount and avoid both stockouts and overstocks.",
        examples: [
          "A grocery chain forecasts demand for fresh produce store-by-store to minimize spoilage.",
          "A fashion retailer predicts which styles and sizes will trend next season.",
        ],
        poweredBy: "Time-series forecasting models learn from historical sales, promotions, weather, and holidays. The system examines how your sales have moved in the past under similar conditions and projects what's coming next. It factors in upcoming promotions, local events, and even weather forecasts to give you an accurate picture of future demand.",
        relatedMethods: [
          { methodId: "prophet", topicId: "timeseries", name: "Prophet" },
          { methodId: "arima", topicId: "timeseries", name: "ARIMA / SARIMA" },
          { methodId: "lstm-ts", topicId: "timeseries", name: "LSTM / Temporal Fusion Transformer" },
        ],
      },
      {
        id: "predictive-maintenance",
        name: "Predictive Maintenance",
        description: "Know when a machine is about to break before it actually does — so you can schedule repairs during planned downtime instead of dealing with expensive emergency shutdowns.",
        examples: [
          "A wind-farm operator replaces a gearbox bearing two weeks before sensors predict it will fail.",
          "An airline swaps an engine component during a scheduled layover, avoiding a mid-route cancellation.",
        ],
        poweredBy: "Sensor data and survival models learn the signatures that precede equipment failure. The system continuously monitors readings like temperature, vibration, and pressure, comparing them to patterns seen before past breakdowns. When it detects a familiar warning sign, it alerts your maintenance team so they can fix the issue before it causes costly downtime.",
        relatedMethods: [
          { methodId: "isoforest", topicId: "anomaly", name: "Isolation Forest" },
          { methodId: "rf-clf", topicId: "classification", name: "Random Forest (Classifier)" },
          { methodId: "cox", topicId: "survival", name: "Cox Proportional Hazards" },
          { methodId: "ae-anom", topicId: "anomaly", name: "Autoencoder Anomaly Detection" },
        ],
      },
      {
        id: "route-optimization",
        name: "Route & Delivery Optimization",
        description: "Find the fastest, cheapest, or most fuel-efficient delivery routes for a fleet of vehicles — even when there are thousands of stops and changing traffic conditions.",
        examples: [
          "A courier company reduces fuel costs by 15 % by recalculating driver routes every morning.",
          "A food-delivery app estimates arrival times within 2 minutes and dynamically reassigns orders.",
        ],
        poweredBy: "Optimization algorithms solve complex routing problems considering distance, time windows, and vehicle capacity. The system evaluates millions of possible routes simultaneously and picks the combination that minimizes fuel, time, or cost. As new orders come in or conditions change, it recalculates on the fly — like having a master dispatcher who never tires.",
        relatedMethods: [
          { methodId: "milp", topicId: "optimization", name: "Mixed-Integer Linear Programming (MILP)" },
          { methodId: "network", topicId: "optimization", name: "Network Flow Optimization" },
          { methodId: "cp", topicId: "optimization", name: "Constraint Programming" },
        ],
      },
      {
        id: "inventory-optimization",
        name: "Inventory Optimization",
        description: "Decide how much stock to hold, where to store it, and when to reorder — balancing the cost of holding inventory against the risk of running out.",
        examples: [
          "An auto-parts distributor reduces warehouse costs by 20 % while maintaining 99 % fill rates.",
          "A hospital pharmacy keeps the right stock of critical medications across 50 locations.",
        ],
        poweredBy: "Stochastic models and optimization algorithms balance holding costs against service-level requirements. The system calculates the ideal stock level for each product by weighing the cost of holding extra inventory against the risk of running out. It continuously adjusts reorder points and quantities as demand patterns shift, so you carry just enough — never too much or too little.",
        relatedMethods: [
          { methodId: "milp", topicId: "optimization", name: "Mixed-Integer Linear Programming (MILP)" },
          { methodId: "prophet", topicId: "timeseries", name: "Prophet" },
          { methodId: "cp", topicId: "optimization", name: "Constraint Programming" },
        ],
      },
      {
        id: "quality-control",
        name: "Automated Quality Control",
        description: "Use cameras and sensors on the production line to catch defects — scratches, misalignments, wrong colors — faster and more reliably than the human eye.",
        examples: [
          "A semiconductor fab detects microscopic chip defects at 99.9 % accuracy using computer vision.",
          "A food-packaging plant rejects containers that are under-filled or mislabelled.",
        ],
        poweredBy: "Computer vision models are trained on images of good vs. defective products. The system examines every item on the production line through a camera, comparing it against thousands of examples of acceptable and flawed products. Defects are flagged in milliseconds — faster and more consistently than a human inspector — so bad units never reach the customer.",
        relatedMethods: [
          { methodId: "cnn", topicId: "deeplearning", name: "CNN (Image Classification)" },
          { methodId: "zscore", topicId: "anomaly", name: "Z-Score / σ-Rule" },
          { methodId: "isoforest", topicId: "anomaly", name: "Isolation Forest" },
        ],
      },
      {
        id: "workforce-scheduling",
        name: "Workforce & Shift Scheduling",
        description: "Create optimal staff schedules that meet demand, respect labor laws, and account for employee preferences — a puzzle that's nearly impossible to solve well by hand.",
        examples: [
          "A call center forecasts hourly call volumes and schedules agents to hit a 30-second average wait time.",
          "A hospital uses predicted patient admissions to staff the right number of nurses per shift.",
        ],
        poweredBy: "Demand forecasting combined with constraint optimization balances coverage, cost, and fairness. The system first predicts how busy each shift will be, then builds schedules that ensure enough staff without overspending. It also respects rules like maximum hours, skill requirements, and fair rotation, producing a balanced schedule in minutes rather than days.",
        relatedMethods: [
          { methodId: "milp", topicId: "optimization", name: "Mixed-Integer Linear Programming (MILP)" },
          { methodId: "cp", topicId: "optimization", name: "Constraint Programming" },
          { methodId: "sa", topicId: "optimization", name: "Simulated Annealing" },
        ],
      },
      {
        id: "energy-optimization",
        name: "Energy & Utility Optimization",
        description: "Reduce energy consumption and costs in buildings, factories, and data centers by predicting load and adjusting systems in real time.",
        examples: [
          "A data center adjusts cooling dynamically based on predicted server load, cutting energy bills by 30 %.",
          "A smart building lowers heating before occupants leave, using occupancy and weather predictions.",
        ],
        poweredBy: "Time-series forecasting and reinforcement learning optimize energy consumption in real time. The system predicts upcoming demand for heating, cooling, or power, and adjusts settings proactively to avoid waste. It learns from every adjustment, continuously improving — like a building manager who gets smarter every day and never forgets a lesson.",
        relatedMethods: [
          { methodId: "mpc", topicId: "optimization", name: "Model Predictive Control (MPC)" },
          { methodId: "rl", topicId: "optimization", name: "Reinforcement Learning (RL)" },
          { methodId: "arima", topicId: "timeseries", name: "ARIMA / SARIMA" },
        ],
      },
    ],
  },
  {
    id: "healthcare-life-sciences",
    icon: "🏥",
    name: "Healthcare & Life Sciences",
    description: "Improve diagnoses, accelerate drug discovery, and personalize patient care.",
    useCases: [
      {
        id: "medical-imaging",
        name: "Medical Image Analysis",
        description: "Help radiologists read X-rays, MRIs, and CT scans faster and more accurately — catching tumours, fractures, and diseases that a tired human eye might miss.",
        examples: [
          "An AI flags potential lung nodules on chest CTs so radiologists can prioritize urgent cases.",
          "A dermatology app screens moles for melanoma risk using a smartphone photo.",
        ],
        poweredBy: "Deep-learning vision models trained on millions of labeled medical images. The system studies vast libraries of scans where experts have already marked what's healthy and what's not. When a new scan arrives, it highlights areas of concern and provides a confidence level, giving doctors a reliable second opinion that speeds up diagnosis.",
        relatedMethods: [
          { methodId: "cnn", topicId: "deeplearning", name: "CNN (Image Classification)" },
          { methodId: "rcnn", topicId: "deeplearning", name: "R-CNN / Object Detection" },
          { methodId: "segmentation", topicId: "deeplearning", name: "Image Segmentation" },
        ],
      },
      {
        id: "drug-discovery",
        name: "Drug Discovery & Molecule Design",
        description: "Screen millions of potential drug compounds in silico (on a computer) in weeks instead of years, dramatically shortening the path from idea to clinical trial.",
        examples: [
          "A biotech startup identifies a promising cancer-drug candidate in 3 months instead of 3 years.",
          "An AI designs a novel antibiotic molecule that lab tests confirm kills resistant bacteria.",
        ],
        poweredBy: "Generative chemistry models and molecular simulations explore vast chemical spaces. The system proposes new molecular structures likely to interact with a disease target, then simulates how they'd behave in the body. This dramatically narrows the search, turning years of lab trial-and-error into weeks of focused experimentation.",
        relatedMethods: [
          { methodId: "gnn", topicId: "deeplearning", name: "Graph Neural Network (GNN)" },
          { methodId: "vae", topicId: "deeplearning", name: "Variational Autoencoder (VAE)" },
          { methodId: "rf-clf", topicId: "classification", name: "Random Forest (Classifier)" },
        ],
      },
      {
        id: "clinical-trial-optimization",
        name: "Clinical Trial Optimization",
        description: "Find the right patients for clinical trials faster, predict dropout risk, and optimize dosing schedules — reducing the time and cost of bringing a drug to market.",
        examples: [
          "A pharma company identifies eligible trial participants from electronic health records in days instead of months.",
          "A trial team predicts which sites will under-enrol and shifts resources early.",
        ],
        poweredBy: "NLP extracts criteria from medical records; predictive models forecast enrolment and dropout. The system reads patient files to find eligible candidates automatically, then predicts how likely each is to complete the trial. This accelerates recruitment and reduces the risk of trials stalling due to insufficient participants.",
        relatedMethods: [
          { methodId: "ab", topicId: "causal", name: "A/B Testing" },
          { methodId: "did", topicId: "causal", name: "Difference-in-Differences" },
          { methodId: "km", topicId: "survival", name: "Kaplan–Meier" },
        ],
      },
      {
        id: "patient-readmission",
        name: "Patient Readmission Prediction",
        description: "Predict which patients are likely to bounce back to the hospital within 30 days — so care teams can provide extra support before discharge.",
        examples: [
          "A hospital reduces heart-failure readmissions by 18 % by targeting high-risk patients with home nursing visits.",
          "A health insurer identifies members likely to need emergency care and offers proactive wellness coaching.",
        ],
        poweredBy: "Classification models analyze diagnoses, lab results, medications, and social determinants of health. The system reviews a patient's full profile at discharge and estimates the likelihood they'll return within 30 days. High-risk patients are flagged so care teams can arrange follow-ups, reducing avoidable readmissions and improving outcomes.",
        relatedMethods: [
          { methodId: "cox", topicId: "survival", name: "Cox Proportional Hazards" },
          { methodId: "rf-clf", topicId: "classification", name: "Random Forest (Classifier)" },
          { methodId: "logistic", topicId: "classification", name: "Logistic Regression" },
        ],
      },
      {
        id: "personalized-treatment",
        name: "Personalized Treatment Plans",
        description: "Tailor treatments to individual patients based on their genetics, medical history, and lifestyle — moving from 'one-size-fits-all' to precision medicine.",
        examples: [
          "An oncologist selects a chemotherapy regimen based on a tumour's genetic profile rather than broad guidelines.",
          "A diabetes management app adjusts insulin recommendations based on a patient's continuous glucose-monitor data.",
        ],
        poweredBy: "Machine-learning models combine genomic, clinical, and wearable data to recommend treatments. The system cross-references a patient's unique profile — genetics, medical history, lifestyle — with outcomes from similar patients to suggest the most effective therapy. It's like matching each patient to the treatment plan that worked best for people just like them.",
        relatedMethods: [
          { methodId: "rl", topicId: "optimization", name: "Reinforcement Learning (RL)" },
          { methodId: "gpr", topicId: "regression", name: "Gaussian Process Regression" },
          { methodId: "bayes-inf", topicId: "bayesian", name: "Bayesian Inference" },
        ],
      },
      {
        id: "epidemic-forecasting",
        name: "Epidemic & Public-Health Forecasting",
        description: "Predict the spread of infectious diseases, plan hospital capacity, and decide where to deploy vaccines and resources.",
        examples: [
          "A public-health agency forecasts flu-season severity two months ahead to pre-position vaccines.",
          "A city models COVID-19 scenarios to decide whether to expand ICU capacity.",
        ],
        poweredBy: "Compartmental models (SIR), time-series forecasting, and agent-based simulations model disease spread. The system divides a population into groups — such as susceptible, infected, and recovered — and simulates how diseases move between them. By factoring in travel patterns, vaccination rates, and social behavior, it projects how an outbreak may unfold so authorities can act early.",
        relatedMethods: [
          { methodId: "arima", topicId: "timeseries", name: "ARIMA / SARIMA" },
          { methodId: "var", topicId: "timeseries", name: "Vector Autoregression (VAR)" },
          { methodId: "prophet", topicId: "timeseries", name: "Prophet" },
        ],
      },
    ],
  },
  {
    id: "hr-people",
    icon: "👥",
    name: "Human Resources & People",
    description: "Hire smarter, retain talent, and make data-driven workforce decisions.",
    useCases: [
      {
        id: "resume-screening",
        name: "Résumé Screening & Candidate Matching",
        description: "Automatically read hundreds of résumés and surface the candidates who best match the job requirements — giving recruiters a shortlist in minutes instead of days.",
        examples: [
          "A recruiting team reduces time-to-shortlist from 5 days to 4 hours for a role with 800 applicants.",
          "A staffing agency matches contract nurses to hospital needs based on skills, certifications, and availability.",
        ],
        poweredBy: "NLP models parse résumés and match them against job descriptions using semantic similarity. The system reads each résumé, understands the skills and experience described, and compares them to what the role requires — not by matching exact keywords but by understanding meaning. This gives recruiters a ranked shortlist in minutes instead of hours of manual reading.",
        relatedMethods: [
          { methodId: "bert", topicId: "nlp", name: "BERT / Transformer Embeddings" },
          { methodId: "llm", topicId: "genai", name: "Large Language Models (LLMs)" },
          { methodId: "tfidf", topicId: "nlp", name: "TF-IDF" },
        ],
      },
      {
        id: "attrition-prediction",
        name: "Employee Attrition Prediction",
        description: "Identify employees who are at risk of leaving before they hand in their notice — so managers can have timely conversations and address concerns.",
        examples: [
          "An HR team discovers that employees who haven't been promoted in 3+ years are 4× more likely to resign.",
          "A tech company spots flight risk in engineering teams after org restructures and offers retention bonuses.",
        ],
        poweredBy: "Classification models learn from historical turnover data, engagement surveys, and career progression. The system spots the patterns that preceded past departures — stalled promotions, declining survey scores, reduced activity — and identifies current employees showing the same signs. HR can then intervene early with retention strategies targeted at those most likely to leave.",
        relatedMethods: [
          { methodId: "gbm-clf", topicId: "classification", name: "Gradient Boosting (Classifier)" },
          { methodId: "cox", topicId: "survival", name: "Cox Proportional Hazards" },
          { methodId: "shap", topicId: "modeleval", name: "SHAP (Shapley Values)" },
        ],
      },
      {
        id: "compensation-benchmarking",
        name: "Compensation & Benefits Benchmarking",
        description: "Analyze market data to ensure your pay and benefits are competitive — avoiding overpaying while keeping your offer attractive enough to retain talent.",
        examples: [
          "A startup benchmarks engineering salaries against 200 comparable companies to set fair band ranges.",
          "A large employer discovers its benefits package is 15 % below market for a critical role and adjusts.",
        ],
        poweredBy: "Regression models and market surveys normalize compensation data across geographies, experience levels, and industries. The system adjusts for differences like cost of living, job title variations, and company size to produce apples-to-apples comparisons. This helps you set pay bands that are competitive enough to attract talent without overspending.",
        relatedMethods: [
          { methodId: "ols", topicId: "regression", name: "OLS Linear Regression" },
          { methodId: "ridge", topicId: "regression", name: "Ridge Regression" },
          { methodId: "rf-reg", topicId: "regression", name: "Random Forest Regressor" },
        ],
      },
      {
        id: "dei-analytics",
        name: "Diversity, Equity & Inclusion Analytics",
        description: "Measure representation, pay equity, and promotion rates across demographics — turning DEI goals from aspirational into measurable.",
        examples: [
          "A company finds a statistically significant gender pay gap in one department and corrects it.",
          "An HR team tracks promotion rates by ethnicity year over year to ensure equitable advancement.",
        ],
        poweredBy: "Statistical analysis and regression models identify and quantify gaps while controlling for legitimate factors. The system compares outcomes — hiring, promotion, pay — across demographic groups, adjusting for experience, role, and performance. This isolates genuine disparities from expected differences, giving leadership clear, defensible data to guide equity initiatives.",
        relatedMethods: [
          { methodId: "bias-audit", topicId: "modeleval", name: "Fairness / Bias Auditing" },
          { methodId: "logistic", topicId: "classification", name: "Logistic Regression" },
          { methodId: "did", topicId: "causal", name: "Difference-in-Differences" },
        ],
      },
      {
        id: "engagement-surveys",
        name: "Employee Engagement & Pulse Analysis",
        description: "Go beyond simple satisfaction scores — use AI to read open-ended survey responses at scale and surface the themes, frustrations, and suggestions that matter most.",
        examples: [
          "An organization discovers 'lack of career growth' is the #1 theme in 5,000 anonymous comments.",
          "A retail chain identifies that store-level engagement scores predict customer satisfaction two months later.",
        ],
        poweredBy: "Topic modeling and sentiment analysis extract themes and emotions from free-text responses. The system reads thousands of open-ended comments, groups them by topic — like 'career growth' or 'work-life balance' — and gauges whether the tone is positive or negative. Leaders get an at-a-glance summary of what employees care about most and how they feel about it.",
        relatedMethods: [
          { methodId: "lda", topicId: "nlp", name: "LDA (Topic Modeling)" },
          { methodId: "sentiment", topicId: "nlp", name: "Sentiment Analysis" },
          { methodId: "kmeans", topicId: "clustering", name: "k-Means Clustering" },
        ],
      },
    ],
  },
  {
    id: "customer-service",
    icon: "🎧",
    name: "Customer Service & Support",
    description: "Resolve issues faster, reduce costs, and improve customer satisfaction.",
    useCases: [
      {
        id: "chatbots",
        name: "AI Chatbots & Virtual Assistants",
        description: "Provide instant answers to common questions 24 / 7 — handling password resets, order tracking, and FAQs so human agents can focus on complex issues.",
        examples: [
          "A bank's chatbot resolves 70 % of customer enquiries without a human agent.",
          "An airline's virtual assistant rebooks flights during weather disruptions in seconds.",
        ],
        poweredBy: "Large language models and intent-recognition systems understand questions and retrieve or generate answers. When a customer types a question, the system figures out what they're really asking, searches your knowledge base for the best answer, and replies in natural, conversational language. It handles common queries instantly, freeing your human agents for complex issues.",
        relatedMethods: [
          { methodId: "llm", topicId: "genai", name: "Large Language Models (LLMs)" },
          { methodId: "rag", topicId: "genai", name: "Retrieval-Augmented Generation (RAG)" },
          { methodId: "finetuning", topicId: "genai", name: "Fine-Tuning LLMs" },
        ],
      },
      {
        id: "ticket-routing",
        name: "Smart Ticket Routing & Prioritisation",
        description: "Automatically read an incoming support ticket, categorise it, assess its urgency, and route it to the right team — cutting resolution time and avoiding mis-routes.",
        examples: [
          "A software company cuts average ticket resolution time by 35 % by routing to the right specialist immediately.",
          "An IT help desk auto-escalates tickets mentioning 'security breach' to the incident-response team.",
        ],
        poweredBy: "Text classification models read ticket content and predict category, urgency, and the best-equipped team. The system scans each incoming ticket, understands the issue described, and instantly assigns it to the right department with an urgency level. This eliminates manual triage, cuts response times, and ensures experts handle the problems they're best at solving.",
        relatedMethods: [
          { methodId: "bert", topicId: "nlp", name: "BERT / Transformer Embeddings" },
          { methodId: "logistic", topicId: "classification", name: "Logistic Regression" },
          { methodId: "ner", topicId: "nlp", name: "Named Entity Recognition (NER)" },
        ],
      },
      {
        id: "call-center-analytics",
        name: "Call-Center Speech & Text Analytics",
        description: "Analyze every customer call and chat transcript to identify common complaints, agent performance issues, and emerging trends — without anyone listening to every recording.",
        examples: [
          "A telecom discovers that 40 % of calls are about one confusing billing change and fixes the UI.",
          "A quality-assurance team auto-scores agent empathy and compliance from call transcripts.",
        ],
        poweredBy: "Speech-to-text, sentiment analysis, and topic modeling process conversations at scale. The system converts every phone call into text, detects the customer's emotional tone, and identifies the topics discussed. Managers get a bird's-eye view of call quality, common complaints, and agent performance without having to listen to recordings one by one.",
        relatedMethods: [
          { methodId: "sentiment", topicId: "nlp", name: "Sentiment Analysis" },
          { methodId: "bert", topicId: "nlp", name: "BERT / Transformer Embeddings" },
          { methodId: "lda", topicId: "nlp", name: "LDA (Topic Modeling)" },
          { methodId: "arima", topicId: "timeseries", name: "ARIMA / SARIMA" },
        ],
      },
      {
        id: "self-service-search",
        name: "Intelligent Self-Service & Knowledge Search",
        description: "Let customers and agents find the right help article, FAQ, or troubleshooting guide instantly — even when their search terms don't match the exact wording in the docs.",
        examples: [
          "A SaaS company's help center understands 'my dashboard is blank' and surfaces the right article about browser cache.",
          "An internal knowledge base lets support agents search with natural questions instead of keywords.",
        ],
        poweredBy: "Semantic search and retrieval-augmented generation match meaning, not just keywords. The system understands the intent behind a customer's question — even if they don't use the exact right terms — and pulls the most relevant help articles. It can also generate a concise, direct answer, so customers solve their own problems without waiting for an agent.",
        relatedMethods: [
          { methodId: "rag", topicId: "genai", name: "Retrieval-Augmented Generation (RAG)" },
          { methodId: "llm", topicId: "genai", name: "Large Language Models (LLMs)" },
          { methodId: "bert", topicId: "nlp", name: "BERT / Transformer Embeddings" },
        ],
      },
    ],
  },
  {
    id: "product-engineering",
    icon: "⚙️",
    name: "Product & Engineering",
    description: "Build smarter products, find bugs faster, and personalize user experiences.",
    useCases: [
      {
        id: "search-ranking",
        name: "Search & Ranking",
        description: "Make your product's search box actually useful — return the most relevant results, even when users type vague or misspelled queries.",
        examples: [
          "An e-commerce site surfaces the most-purchased items for vague queries like 'gift for dad'.",
          "A job board ranks listings by relevance to the candidate's profile, not just keyword match.",
        ],
        poweredBy: "Learning-to-rank models combine text relevance, user behavior signals, and business rules. The system watches which results users actually click and engage with, then uses that feedback to reorder future results. It also blends in business priorities — like promoting high-margin products — so the top results are both helpful and strategically valuable.",
        relatedMethods: [
          { methodId: "bert", topicId: "nlp", name: "BERT / Transformer Embeddings" },
          { methodId: "tfidf", topicId: "nlp", name: "TF-IDF" },
          { methodId: "gbm-clf", topicId: "classification", name: "Gradient Boosting (Classifier)" },
        ],
      },
      {
        id: "personalization",
        name: "User-Experience Personalization",
        description: "Customise what each user sees — homepage layout, feature highlights, onboarding flow — based on who they are and how they behave.",
        examples: [
          "A music app creates a unique daily playlist for each listener based on their mood and history.",
          "A news app rearranges story order for each reader based on topics they spend time on.",
        ],
        poweredBy: "Recommendation algorithms and contextual bandits learn each user's preferences in real time. The system tracks what a user clicks, reads, or buys, and continuously updates a profile of their interests. It then tailors what they see next — layouts, offers, content — so each visit feels custom-made, increasing engagement and conversion.",
        relatedMethods: [
          { methodId: "collab", topicId: "recommenders", name: "Collaborative Filtering" },
          { methodId: "contextual-bandit", topicId: "recommenders", name: "Contextual Bandit" },
          { methodId: "two-tower", topicId: "recommenders", name: "Two-Tower Neural Network" },
        ],
      },
      {
        id: "anomaly-detection-ops",
        name: "Application Monitoring & Anomaly Detection",
        description: "Automatically detect when something is wrong with your software — a spike in error rates, a slowdown in response times, or unusual traffic patterns — before users complain.",
        examples: [
          "A DevOps team gets an alert within 2 minutes of a database slowdown, before any customer notices.",
          "A payment platform detects a 300 % surge in failed transactions and pages the on-call engineer.",
        ],
        poweredBy: "Statistical process control and unsupervised anomaly detection learn normal system behavior. The system builds a baseline of what 'healthy' looks like — response times, error rates, traffic patterns — and watches for deviations. When something unusual happens, it alerts your team immediately, often before users even notice a problem.",
        relatedMethods: [
          { methodId: "zscore", topicId: "anomaly", name: "Z-Score / σ-Rule" },
          { methodId: "isoforest", topicId: "anomaly", name: "Isolation Forest" },
          { methodId: "spectral-anom", topicId: "anomaly", name: "Spectral Residual" },
        ],
      },
      {
        id: "code-assistance",
        name: "AI-Assisted Software Development",
        description: "Help developers write, review, debug, and document code faster — like having a knowledgeable pair-programming partner available 24 / 7.",
        examples: [
          "A developer uses Copilot to generate boilerplate code and unit tests, saving 2 hours a day.",
          "A code-review bot catches a security vulnerability before the pull request is merged.",
        ],
        poweredBy: "Large language models trained on code understand programming patterns and best practices. The system reads the code your developers are writing, suggests completions, catches potential bugs, and even generates boilerplate. Think of it as a knowledgeable pair-programming partner who's always available, helping your team ship faster with fewer mistakes.",
        relatedMethods: [
          { methodId: "llm", topicId: "genai", name: "Large Language Models (LLMs)" },
          { methodId: "finetuning", topicId: "genai", name: "Fine-Tuning LLMs" },
          { methodId: "rag", topicId: "genai", name: "Retrieval-Augmented Generation (RAG)" },
        ],
      },
      {
        id: "feature-flagging-ml",
        name: "Intelligent Feature Rollouts",
        description: "Decide which users get a new feature based on predicted impact — rolling out to segments where it's likely to succeed and holding back where it might hurt metrics.",
        examples: [
          "A social network rolls out a new feed algorithm to users predicted to engage more, monitoring impact before full launch.",
          "A fintech gradually enables a new credit product for customer segments with the best predicted outcomes.",
        ],
        poweredBy: "Causal inference and uplift models estimate the incremental effect of a feature on each user segment. The system goes beyond 'did users like it?' to answer 'did the feature actually cause the improvement?' It isolates the true impact from background noise, so product teams can confidently decide which features to roll out widely and which to drop.",
        relatedMethods: [
          { methodId: "ab", topicId: "causal", name: "A/B Testing" },
          { methodId: "shap", topicId: "modeleval", name: "SHAP (Shapley Values)" },
          { methodId: "did", topicId: "causal", name: "Difference-in-Differences" },
        ],
      },
    ],
  },
  {
    id: "legal-compliance",
    icon: "⚖️",
    name: "Legal & Compliance",
    description: "Reduce risk, automate document review, and stay ahead of regulatory requirements.",
    useCases: [
      {
        id: "contract-analysis",
        name: "Contract Review & Analysis",
        description: "Read, extract, and compare key clauses across hundreds of contracts in minutes — finding risky terms, missing clauses, or inconsistencies that a human reviewer might miss after hour six.",
        examples: [
          "A legal team reviews 500 vendor contracts during an acquisition in days instead of months.",
          "A real-estate firm auto-flags lease agreements missing a required insurance clause.",
        ],
        poweredBy: "NLP models extract entities (dates, parties, amounts) and classify clause types. The system reads contracts the way a paralegal would — identifying key terms, obligations, deadlines, and risks — but does it in seconds across thousands of documents. This accelerates due diligence, renewals, and compliance reviews dramatically.",
        relatedMethods: [
          { methodId: "llm", topicId: "genai", name: "Large Language Models (LLMs)" },
          { methodId: "ner", topicId: "nlp", name: "Named Entity Recognition (NER)" },
          { methodId: "bert", topicId: "nlp", name: "BERT / Transformer Embeddings" },
        ],
      },
      {
        id: "regulatory-monitoring",
        name: "Regulatory Change Monitoring",
        description: "Automatically track new laws, regulations, and guidance documents relevant to your business and alert compliance teams to changes they need to act on.",
        examples: [
          "A global bank monitors regulatory updates across 30 jurisdictions and flags relevant changes to local compliance officers.",
          "A pharmaceutical company is alerted the day a new FDA labelling requirement is published.",
        ],
        poweredBy: "NLP classifies and matches regulatory documents to the company's product and jurisdiction taxonomy. The system continuously scans new rules, guidelines, and policy updates, then maps each one to the parts of your business it affects. Your compliance team gets targeted alerts instead of wading through hundreds of irrelevant documents.",
        relatedMethods: [
          { methodId: "bert", topicId: "nlp", name: "BERT / Transformer Embeddings" },
          { methodId: "ner", topicId: "nlp", name: "Named Entity Recognition (NER)" },
          { methodId: "isoforest", topicId: "anomaly", name: "Isolation Forest" },
        ],
      },
      {
        id: "ediscovery",
        name: "E-Discovery & Document Review",
        description: "During litigation, sift through millions of emails and documents to find the relevant ones — reducing what used to take dozens of paralegals weeks to a fraction of the time.",
        examples: [
          "A law firm reduces document review from 3 million documents to 80,000 relevant ones in a week.",
          "An investigation team finds key evidence in employee chat logs using concept-based search, not just keywords.",
        ],
        poweredBy: "Active-learning classification and semantic search find relevant documents while continuously learning from reviewer feedback. The system starts by surfacing documents that look most relevant, then refines its understanding each time a reviewer marks one as relevant or not. This feedback loop dramatically speeds up review, cutting through millions of documents to find the ones that matter.",
        relatedMethods: [
          { methodId: "llm", topicId: "genai", name: "Large Language Models (LLMs)" },
          { methodId: "rag", topicId: "genai", name: "Retrieval-Augmented Generation (RAG)" },
          { methodId: "ner", topicId: "nlp", name: "Named Entity Recognition (NER)" },
        ],
      },
    ],
  },
  {
    id: "retail-ecommerce",
    icon: "🛒",
    name: "Retail & E-Commerce",
    description: "Optimize assortment, pricing, and the shopping experience from browse to delivery.",
    useCases: [
      {
        id: "visual-search",
        name: "Visual Search & Image Recognition",
        description: "Let shoppers take a photo of something they like — a dress, a chair, a pair of shoes — and instantly find similar products in your catalogue.",
        examples: [
          "A furniture retailer lets customers photograph a friend's couch and find similar styles online.",
          "A fashion app identifies the brand and style of a celebrity's outfit from a paparazzi photo.",
        ],
        poweredBy: "Computer vision models compare visual features of images to product catalogue images. The system analyses the colors, shapes, textures, and patterns in a photo and finds the closest matches in your inventory. Customers can snap a picture of something they like and instantly find similar products to buy — no words needed.",
        relatedMethods: [
          { methodId: "cnn", topicId: "deeplearning", name: "CNN (Image Classification)" },
          { methodId: "rcnn", topicId: "deeplearning", name: "R-CNN / Object Detection" },
          { methodId: "ae-dim", topicId: "dimred", name: "Autoencoder (Dimensionality Reduction)" },
        ],
      },
      {
        id: "assortment-planning",
        name: "Assortment & Merchandise Planning",
        description: "Decide which products to carry in which stores and how much shelf space to give each — matching local tastes and demand patterns.",
        examples: [
          "A national retailer stocks different snack brands in different regions based on local preference data.",
          "A fashion chain predicts which colors and sizes to order for each store based on last year's sell-through.",
        ],
        poweredBy: "Clustering, forecasting, and optimization models balance variety, demand, and supply constraints. The system groups products by how they compete with each other, forecasts demand for each group, and selects the assortment that maximizes sales while keeping inventory manageable. It's like having a merchandising expert who can test thousands of product mixes before committing.",
        relatedMethods: [
          { methodId: "kmeans", topicId: "clustering", name: "k-Means Clustering" },
          { methodId: "prophet", topicId: "timeseries", name: "Prophet" },
          { methodId: "milp", topicId: "optimization", name: "Mixed-Integer Linear Programming (MILP)" },
        ],
      },
      {
        id: "returns-prediction",
        name: "Returns Prediction & Prevention",
        description: "Predict which purchases are most likely to be returned — and take proactive steps like better sizing guides, honest product descriptions, or risk-based return policies.",
        examples: [
          "An online clothing retailer adds a size-recommendation widget that cuts returns by 22 %.",
          "A marketplace adjusts its return policy for categories with extremely high predicted return rates.",
        ],
        poweredBy: "Classification models learn from product attributes, customer history, and past return reasons. The system scores each order at checkout by how likely it is to be returned, based on patterns like sizing issues, frequent returners, or product categories with high return rates. This lets you take proactive steps — like better size guides — to reduce returns before they happen.",
        relatedMethods: [
          { methodId: "gbm-clf", topicId: "classification", name: "Gradient Boosting (Classifier)" },
          { methodId: "logistic", topicId: "classification", name: "Logistic Regression" },
          { methodId: "rf-clf", topicId: "classification", name: "Random Forest (Classifier)" },
        ],
      },
      {
        id: "cart-abandonment-recovery",
        name: "Cart Abandonment Recovery",
        description: "Predict when shoppers are likely to leave without buying and trigger the right reminder, offer, or follow-up to win the sale back.",
        examples: [
          "An e-commerce site sends a one-click reminder email when a high-value cart is abandoned before checkout is completed.",
          "A beauty retailer identifies shoppers who usually respond to free-shipping nudges and targets only those carts instead of discounting everyone.",
        ],
        poweredBy: "Propensity and next-best-action models estimate which carts are likely to be abandoned and which recovery tactic is most likely to work. The system watches signals like basket value, browsing history, returning visits, device type, and past campaign response, then triggers the most effective recovery touchpoint without overusing discounts on shoppers who would have purchased anyway.",
        relatedMethods: [
          { methodId: "gbm-clf", topicId: "classification", name: "Gradient Boosting (Classifier)" },
          { methodId: "contextual-bandit", topicId: "recommenders", name: "Contextual Bandit" },
          { methodId: "ab", topicId: "causal", name: "A/B Testing" },
        ],
      },
      {
        id: "checkout-optimization",
        name: "Checkout Flow Optimization",
        description: "Reduce friction during checkout by identifying where shoppers get stuck and improving the form, payment, shipping, and mobile experience.",
        examples: [
          "A marketplace discovers that requiring account creation on mobile causes a major drop-off and switches to guest checkout.",
          "An online retailer reorders payment options by customer segment so shoppers see their preferred method first and complete purchases faster.",
        ],
        poweredBy: "Funnel analysis, experimentation, and predictive models identify where shoppers hesitate or drop off during checkout. The system compares different flows, form designs, payment methods, and shipping options to find which changes meaningfully improve completion rate, helping teams optimize the buying experience instead of guessing which part of checkout feels broken.",
        relatedMethods: [
          { methodId: "ab", topicId: "causal", name: "A/B Testing" },
          { methodId: "gbm-clf", topicId: "classification", name: "Gradient Boosting (Classifier)" },
          { methodId: "shap", topicId: "modeleval", name: "SHAP (Shapley Values)" },
        ],
      },
    ],
  },
  {
    id: "real-estate-construction",
    icon: "🏗️",
    name: "Real Estate & Construction",
    description: "Value properties, manage projects, and reduce construction risk with data.",
    useCases: [
      {
        id: "property-valuation",
        name: "Automated Property Valuation",
        description: "Estimate the market value of a property instantly using data on comparable sales, location, features, and market trends — the technology behind Zillow's Zestimate.",
        examples: [
          "A mortgage lender pre-qualifies borrowers in minutes by using automated valuations for low-risk loans.",
          "A real-estate investor screens 500 potential acquisitions overnight using automated price estimates.",
        ],
        poweredBy: "Regression models analyze comparable sales, property attributes, and location data. The system examines recent sales of similar properties in the area, adjusts for differences like size, condition, and amenities, and produces a fair-market estimate. It's like having an experienced appraiser who can instantly consider thousands of comparable properties at once.",
        relatedMethods: [
          { methodId: "rf-reg", topicId: "regression", name: "Random Forest Regressor" },
          { methodId: "gbm-reg", topicId: "regression", name: "Gradient Boosting Regressor" },
          { methodId: "ols", topicId: "regression", name: "OLS Linear Regression" },
        ],
      },
      {
        id: "construction-risk",
        name: "Construction Project Risk & Delay Prediction",
        description: "Predict which construction projects are likely to go over budget or behind schedule — so project managers can intervene early.",
        examples: [
          "A general contractor predicts weather-related delays and pre-orders materials to avoid supply bottlenecks.",
          "A project owner flags subcontractors whose past projects have a pattern of cost overruns.",
        ],
        poweredBy: "Regression and survival models learn from historical project data, weather, and supply-chain signals. The system reviews past projects to identify what caused delays and cost overruns, then applies those lessons to your current plans. It flags high-risk phases early, so project managers can add contingency before problems arise.",
        relatedMethods: [
          { methodId: "gbm-reg", topicId: "regression", name: "Gradient Boosting Regressor" },
          { methodId: "isoforest", topicId: "anomaly", name: "Isolation Forest" },
          { methodId: "cox", topicId: "survival", name: "Cox Proportional Hazards" },
        ],
      },
      {
        id: "site-selection",
        name: "Site Selection & Location Intelligence",
        description: "Choose the best location for a new store, warehouse, or office by analyzing foot traffic, demographics, competitor proximity, and accessibility data.",
        examples: [
          "A coffee chain identifies the ideal neighborhood for its next café based on foot-traffic and income data.",
          "A logistics company selects a warehouse location that minimizes average delivery distance to customers.",
        ],
        poweredBy: "Geospatial analytics and optimization models score locations against business criteria. The system layers foot traffic, demographics, competitor proximity, rent costs, and accessibility data onto a map and scores each potential site. Decision-makers get a ranked shortlist backed by data instead of relying solely on intuition or broker recommendations.",
        relatedMethods: [
          { methodId: "milp", topicId: "optimization", name: "Mixed-Integer Linear Programming (MILP)" },
          { methodId: "kmeans", topicId: "clustering", name: "k-Means Clustering" },
          { methodId: "network", topicId: "optimization", name: "Network Flow Optimization" },
        ],
      },
    ],
  },
  {
    id: "education",
    icon: "🎓",
    name: "Education & Training",
    description: "Personalize learning, identify struggling students, and measure outcomes.",
    useCases: [
      {
        id: "adaptive-learning",
        name: "Adaptive Learning Platforms",
        description: "Adjust the difficulty, pace, and content of lessons in real time based on how each student is performing — like having a private tutor for every learner.",
        examples: [
          "A math app detects a student struggling with fractions and serves extra practice before moving on.",
          "A corporate training platform skips modules an employee has already mastered, saving 40 % of training time.",
        ],
        poweredBy: "Knowledge-tracing models estimate what each learner knows and recommend the optimal next activity. The system tracks every answer a student gives and builds a real-time map of their strengths and gaps. It then serves the lesson or practice problem that will help them progress fastest — like a private tutor who always knows exactly what to teach next.",
        relatedMethods: [
          { methodId: "rl", topicId: "optimization", name: "Reinforcement Learning (RL)" },
          { methodId: "collab", topicId: "recommenders", name: "Collaborative Filtering" },
          { methodId: "mab", topicId: "bayesian", name: "Multi-Armed Bandit" },
        ],
      },
      {
        id: "dropout-prediction",
        name: "Student Dropout & At-Risk Prediction",
        description: "Identify students who are at risk of dropping out early enough to intervene — with tutoring, mentoring, or financial support.",
        examples: [
          "A university flags first-year students whose engagement patterns match past dropouts and assigns mentors.",
          "A coding bootcamp predicts which students need extra support after the first two weeks of coursework.",
        ],
        poweredBy: "Classification models use attendance, grades, engagement, and demographic data to predict risk. The system identifies students showing early warning signs — falling grades, missed classes, declining participation — and flags them for intervention. Counsellors and advisors can then reach out proactively, improving retention and graduation rates.",
        relatedMethods: [
          { methodId: "cox", topicId: "survival", name: "Cox Proportional Hazards" },
          { methodId: "gbm-clf", topicId: "classification", name: "Gradient Boosting (Classifier)" },
          { methodId: "logistic", topicId: "classification", name: "Logistic Regression" },
        ],
      },
      {
        id: "automated-grading",
        name: "Automated Essay & Assignment Grading",
        description: "Grade written assignments, short answers, and even code submissions automatically — providing immediate feedback and freeing up instructor time for teaching.",
        examples: [
          "A MOOC platform grades 50,000 essays per week using rubric-aligned AI scoring.",
          "A computer-science course auto-grades programming assignments by running test suites and checking code quality.",
        ],
        poweredBy: "NLP models score text for coherence, argument quality, and rubric alignment; test harnesses evaluate code. The system reads essays or checks code submissions against a rubric, providing consistent scores and instant feedback. Students get results in seconds, and instructors are freed from hours of repetitive grading to focus on teaching.",
        relatedMethods: [
          { methodId: "llm", topicId: "genai", name: "Large Language Models (LLMs)" },
          { methodId: "bert", topicId: "nlp", name: "BERT / Transformer Embeddings" },
          { methodId: "tfidf", topicId: "nlp", name: "TF-IDF" },
        ],
      },
    ],
  },
  {
    id: "media-entertainment",
    icon: "🎬",
    name: "Media & Entertainment",
    description: "Create content, understand audiences, and monetise attention.",
    useCases: [
      {
        id: "content-moderation",
        name: "Content Moderation",
        description: "Automatically detect and remove harmful content — hate speech, violence, spam, misinformation — across millions of posts, comments, and images per day.",
        examples: [
          "A social platform flags 95 % of hate speech before any user reports it.",
          "A video-sharing site detects and blurs graphic content in uploaded videos within seconds.",
        ],
        poweredBy: "Text and image classification models trained on labeled examples of policy-violating content. The system scans every post, comment, or image uploaded to your platform and checks it against your policies. Violations are flagged or removed automatically, keeping your community safe while reducing the burden on human moderators.",
        relatedMethods: [
          { methodId: "bert", topicId: "nlp", name: "BERT / Transformer Embeddings" },
          { methodId: "cnn", topicId: "deeplearning", name: "CNN (Image Classification)" },
          { methodId: "llm", topicId: "genai", name: "Large Language Models (LLMs)" },
        ],
      },
      {
        id: "audience-analytics",
        name: "Audience & Viewership Analytics",
        description: "Understand who is watching, reading, or listening to your content — when, where, and for how long — so you can programme schedules, set ad rates, and develop new content.",
        examples: [
          "A streaming service discovers that a niche true-crime docuseries has a surprisingly high completion rate and greenlights season two.",
          "A podcast network identifies listener drop-off points and advises hosts to shorten intros.",
        ],
        poweredBy: "Behavioral analytics and clustering models segment audiences by consumption patterns. The system tracks what content each user watches, reads, or listens to, and groups them into meaningful segments like 'binge-watchers' or 'news grazers.' These insights help programming, advertising, and marketing teams tailor their strategies to each audience type.",
        relatedMethods: [
          { methodId: "kmeans", topicId: "clustering", name: "k-Means Clustering" },
          { methodId: "gmm", topicId: "clustering", name: "Gaussian Mixture Models" },
          { methodId: "pca", topicId: "dimred", name: "PCA" },
        ],
      },
      {
        id: "ai-content-creation",
        name: "AI-Assisted Creative Production",
        description: "Generate first-draft scripts, music, visual effects, or game assets with AI — giving creative teams a starting point to refine rather than a blank canvas.",
        examples: [
          "A game studio generates thousands of unique NPC dialogue lines using a fine-tuned language model.",
          "A film studio uses AI to generate concept art for set designs, accelerating pre-production.",
        ],
        poweredBy: "Generative AI models produce text, images, audio, and 3D assets from creative prompts. You describe what you want — a blog post, an illustration, a voice-over — and the system generates a polished draft in seconds. Creative teams can iterate faster, exploring more ideas in less time and reducing production costs.",
        relatedMethods: [
          { methodId: "llm", topicId: "genai", name: "Large Language Models (LLMs)" },
          { methodId: "diffusion", topicId: "genai", name: "Diffusion Models" },
          { methodId: "finetuning", topicId: "genai", name: "Fine-Tuning LLMs" },
        ],
      },
      {
        id: "ad-targeting",
        name: "Ad Targeting & Yield Optimization",
        description: "Show each user the ads they're most likely to engage with — maximising revenue for the publisher and return on ad spend for the advertiser.",
        examples: [
          "A mobile game shows in-game ads for products the player is statistically most likely to click.",
          "A news website's ad exchange selects the highest-bidding ad that matches the reader's profile in under 100 milliseconds.",
        ],
        poweredBy: "Real-time prediction models estimate click-through and conversion probability for each ad-user pair. The system evaluates each user's interests, browsing history, and context at the moment an ad slot appears, then picks the ad most likely to resonate. This means higher returns on ad spend because every impression is aimed at someone likely to engage.",
        relatedMethods: [
          { methodId: "rl", topicId: "optimization", name: "Reinforcement Learning (RL)" },
          { methodId: "contextual-bandit", topicId: "recommenders", name: "Contextual Bandit" },
          { methodId: "two-tower", topicId: "recommenders", name: "Two-Tower Neural Network" },
        ],
      },
    ],
  },
  {
    id: "agriculture-environment",
    icon: "🌱",
    name: "Agriculture & Environment",
    description: "Grow more with less, monitor ecosystems, and respond to climate change.",
    useCases: [
      {
        id: "precision-agriculture",
        name: "Precision Agriculture",
        description: "Use satellite images, drones, and sensor data to manage crops field-by-field or even plant-by-plant — applying water, fertilizer, and pesticides only where needed.",
        examples: [
          "A farmer uses drone imagery to spot a fungal infection in one corner of a 500-acre field before it spreads.",
          "An irrigation system waters each zone differently based on soil-moisture sensor readings.",
        ],
        poweredBy: "Computer vision analyses aerial images; regression models predict yield; optimization decides inputs. Drones or satellites photograph fields, and the system identifies areas of stress, disease, or nutrient deficiency. It then recommends exactly how much water, fertilizer, or pesticide each zone needs, reducing waste and increasing harvest quality.",
        relatedMethods: [
          { methodId: "cnn", topicId: "deeplearning", name: "CNN (Image Classification)" },
          { methodId: "rf-reg", topicId: "regression", name: "Random Forest Regressor" },
          { methodId: "mpc", topicId: "optimization", name: "Model Predictive Control (MPC)" },
        ],
      },
      {
        id: "weather-prediction",
        name: "Hyper-Local Weather Forecasting",
        description: "Get weather forecasts down to the neighborhood level for the next few hours — critical for farming, construction, logistics, and event planning.",
        examples: [
          "A construction crew gets a 2-hour rain warning specific to their job site and covers fresh concrete in time.",
          "A delivery fleet reroutes around a predicted flash-flood zone.",
        ],
        poweredBy: "Neural weather models ingest radar, satellite, and ground-station data to produce fine-grained forecasts. The system processes millions of atmospheric measurements every hour, identifies emerging patterns, and projects conditions forward — sometimes days ahead. Businesses get hyper-local, frequently updated forecasts that help with logistics, events, and resource planning.",
        relatedMethods: [
          { methodId: "lstm-ts", topicId: "timeseries", name: "LSTM (Time Series)" },
          { methodId: "arima", topicId: "timeseries", name: "ARIMA / SARIMA" },
          { methodId: "nbeats", topicId: "timeseries", name: "N-BEATS" },
        ],
      },
      {
        id: "deforestation-monitoring",
        name: "Deforestation & Land-Use Monitoring",
        description: "Track changes in forest cover, urban sprawl, and land use from satellite imagery — alerting authorities to illegal logging or environmental degradation in near-real time.",
        examples: [
          "A conservation NGO detects new logging roads in the Amazon within 48 hours using satellite change detection.",
          "A government tracks compliance with reforestation commitments using annual satellite surveys.",
        ],
        poweredBy: "Remote-sensing models compare satellite images over time to detect land-cover changes. The system regularly scans satellite photos of forests and highlights any areas where tree cover has shrunk since the last image. Alerts can be generated within days of a change, enabling rapid response from conservation teams or regulators.",
        relatedMethods: [
          { methodId: "cnn", topicId: "deeplearning", name: "CNN (Image Classification)" },
          { methodId: "segmentation", topicId: "deeplearning", name: "Image Segmentation" },
          { methodId: "isoforest", topicId: "anomaly", name: "Isolation Forest" },
        ],
      },
      {
        id: "carbon-footprint",
        name: "Carbon Footprint & ESG Measurement",
        description: "Measure, report, and forecast your organization's carbon emissions and environmental impact — turning sustainability goals into auditable numbers.",
        examples: [
          "A manufacturer calculates Scope 3 emissions across its supply chain using supplier data and estimation models.",
          "An investment fund screens portfolio companies by predicted ESG scores.",
        ],
        poweredBy: "Emission-factor databases, regression models, and NLP extract and estimate environmental metrics from reports and operational data. The system reads utility bills, supplier reports, and logistics records to calculate your carbon output across the entire value chain. It then identifies the biggest sources of emissions so you can prioritize reduction efforts effectively.",
        relatedMethods: [
          { methodId: "rf-reg", topicId: "regression", name: "Random Forest Regressor" },
          { methodId: "ols", topicId: "regression", name: "OLS Linear Regression" },
          { methodId: "ner", topicId: "nlp", name: "Named Entity Recognition (NER)" },
        ],
      },
    ],
  },
  {
    id: "government-public-sector",
    icon: "🏛️",
    name: "Government & Public Sector",
    description: "Improve public services, allocate resources, and serve citizens better.",
    useCases: [
      {
        id: "tax-fraud",
        name: "Tax Fraud & Evasion Detection",
        description: "Identify suspicious tax returns and businesses that may be under-reporting income — so auditors focus on cases most likely to yield results.",
        examples: [
          "A revenue agency flags returns where claimed deductions are far outside the norm for that income bracket.",
          "A customs authority detects import under-valuation by comparing declared prices against market data.",
        ],
        poweredBy: "Anomaly detection and classification models score returns by fraud likelihood. The system reviews each filing against patterns seen in confirmed fraudulent returns — unusual deductions, mismatched income sources, or suspicious refund amounts. High-risk returns are flagged for auditors, helping agencies focus limited resources where fraud is most likely.",
        relatedMethods: [
          { methodId: "isoforest", topicId: "anomaly", name: "Isolation Forest" },
          { methodId: "gbm-clf", topicId: "classification", name: "Gradient Boosting (Classifier)" },
          { methodId: "ae-anom", topicId: "anomaly", name: "Autoencoder Anomaly Detection" },
        ],
      },
      {
        id: "urban-planning",
        name: "Urban Planning & Traffic Management",
        description: "Use mobility data, simulations, and predictions to plan roads, public transit, and zoning — reducing congestion and improving quality of life.",
        examples: [
          "A city times traffic lights using real-time vehicle counts, reducing average commute times by 12 %.",
          "A transit authority uses ridership predictions to decide where to add new bus routes.",
        ],
        poweredBy: "Simulation models, time-series forecasting, and optimization algorithms plan and manage infrastructure. The system projects population growth, traffic patterns, and utility demand years into the future, then tests different development scenarios virtually. Planners can see the likely impact of a new transit line or housing development before breaking ground.",
        relatedMethods: [
          { methodId: "rl", topicId: "optimization", name: "Reinforcement Learning (RL)" },
          { methodId: "mpc", topicId: "optimization", name: "Model Predictive Control (MPC)" },
          { methodId: "arima", topicId: "timeseries", name: "ARIMA / SARIMA" },
        ],
      },
      {
        id: "disaster-response",
        name: "Disaster Response & Resource Allocation",
        description: "Predict the impact of natural disasters, optimize evacuation routes, and allocate emergency supplies where they're needed most.",
        examples: [
          "A hurricane model predicts storm-surge zones and triggers pre-positioning of emergency shelters and water.",
          "An earthquake response team uses building-damage predictions to prioritize search-and-rescue locations.",
        ],
        poweredBy: "Physical models, satellite image analysis, and optimization algorithms coordinate disaster response. The system predicts a disaster's path and impact using physics and weather data, then assesses damage from satellite images in near-real time. It also optimizes the deployment of rescue teams, supplies, and shelters to reach those in need as quickly as possible.",
        relatedMethods: [
          { methodId: "milp", topicId: "optimization", name: "Mixed-Integer Linear Programming (MILP)" },
          { methodId: "cp", topicId: "optimization", name: "Constraint Programming" },
          { methodId: "network", topicId: "optimization", name: "Network Flow Optimization" },
        ],
      },
      {
        id: "benefits-eligibility",
        name: "Benefits Eligibility & Case Management",
        description: "Help citizens determine which government programmes they qualify for and streamline the application process — reducing paperwork and wait times.",
        examples: [
          "A social-services portal asks a citizen five questions and recommends the eight programmes they're eligible for.",
          "A caseworker dashboard prioritizes families with the most urgent needs based on predictive risk scores.",
        ],
        poweredBy: "Rule engines, NLP, and classification models match citizen profiles to programme criteria. The system reads a citizen's application, understands their circumstances, and checks them against complex eligibility rules across multiple programmes. Eligible benefits are surfaced instantly, reducing wait times and ensuring people don't miss programmes they qualify for.",
        relatedMethods: [
          { methodId: "gbm-clf", topicId: "classification", name: "Gradient Boosting (Classifier)" },
          { methodId: "psm", topicId: "causal", name: "Propensity Score Matching" },
          { methodId: "logistic", topicId: "classification", name: "Logistic Regression" },
        ],
      },
    ],
  },
  {
    id: "general-business",
    icon: "📊",
    name: "General Business Intelligence",
    description: "Turn raw data into actionable insights, automate reporting, and make better decisions.",
    useCases: [
      {
        id: "natural-language-bi",
        name: "Ask-Your-Data / Natural-Language BI",
        description: "Ask business questions in plain English — 'What were our top 10 products last quarter?' — and get instant charts and answers without writing SQL or waiting for an analyst.",
        examples: [
          "A VP of Sales asks a dashboard 'Which region grew fastest in Q3?' and gets an instant chart.",
          "A store manager types 'Show me returns by category this month' and gets a table in seconds.",
        ],
        poweredBy: "NLP-to-SQL models translate natural-language questions into database queries and visualisations. You simply type a question like 'What were last quarter's sales by region?' and the system converts it into a database query, runs it, and returns a chart or table. No technical skills needed — anyone in the business can get answers from data in seconds.",
        relatedMethods: [
          { methodId: "llm", topicId: "genai", name: "Large Language Models (LLMs)" },
          { methodId: "rag", topicId: "genai", name: "Retrieval-Augmented Generation (RAG)" },
          { methodId: "shap", topicId: "modeleval", name: "SHAP (Shapley Values)" },
        ],
      },
      {
        id: "forecasting-general",
        name: "Business Metric Forecasting",
        description: "Forecast any key metric — website traffic, support ticket volume, app downloads, utility consumption — using historical patterns and external signals.",
        examples: [
          "An ops team forecasts next month's support ticket volume to staff appropriately.",
          "A SaaS company predicts monthly active users for the next quarter to set OKRs.",
        ],
        poweredBy: "Time-series models (ARIMA, Prophet, neural forecasters) learn patterns from historical data. The system studies your past numbers — spotting trends, cycles, and seasonal effects — and projects them forward. It continuously refines its predictions as new data arrives, giving you an always-up-to-date forecast without manual spreadsheet work.",
        relatedMethods: [
          { methodId: "prophet", topicId: "timeseries", name: "Prophet" },
          { methodId: "arima", topicId: "timeseries", name: "ARIMA / SARIMA" },
          { methodId: "lstm-ts", topicId: "timeseries", name: "LSTM / Temporal Fusion Transformer" },
          { methodId: "rf-reg", topicId: "regression", name: "Random Forest Regressor" },
        ],
      },
      {
        id: "document-summarisation",
        name: "Automated Document Summarisation",
        description: "Condense long reports, meeting transcripts, research papers, and emails into concise summaries — so busy executives can get the key points in seconds.",
        examples: [
          "A manager receives a one-paragraph summary of a 90-minute meeting with action items highlighted.",
          "A research team gets a two-page digest of 50 academic papers on a topic.",
        ],
        poweredBy: "Large language models extract key information and generate concise summaries. The system reads lengthy documents — reports, meeting transcripts, legal filings — and distils them into clear, brief summaries highlighting the essential points. Decision-makers can absorb the key takeaways in minutes instead of spending hours reading full documents.",
        relatedMethods: [
          { methodId: "llm", topicId: "genai", name: "Large Language Models (LLMs)" },
          { methodId: "rag", topicId: "genai", name: "Retrieval-Augmented Generation (RAG)" },
          { methodId: "finetuning", topicId: "genai", name: "Fine-Tuning LLMs" },
        ],
      },
      {
        id: "knowledge-management",
        name: "Enterprise Knowledge Management",
        description: "Make your company's scattered knowledge — in wikis, Slack, email, drives — searchable and accessible through a single intelligent interface.",
        examples: [
          "A new hire asks the company AI 'What's our refund policy for enterprise clients?' and gets an answer with source links.",
          "An engineer searches for past incident reports mentioning a specific error code across three different systems.",
        ],
        poweredBy: "Semantic search and retrieval-augmented generation find and synthesize information across knowledge silos. The system understands the meaning behind your question and searches across wikis, documents, and databases to assemble a complete answer. Instead of hunting through dozens of folders, employees get a single, well-sourced response in seconds.",
        relatedMethods: [
          { methodId: "rag", topicId: "genai", name: "Retrieval-Augmented Generation (RAG)" },
          { methodId: "llm", topicId: "genai", name: "Large Language Models (LLMs)" },
          { methodId: "bert", topicId: "nlp", name: "BERT / Transformer Embeddings" },
        ],
      },
      {
        id: "process-mining",
        name: "Process Mining & Automation",
        description: "Discover how business processes actually work (not how they're supposed to work) by analyzing system logs — then find bottlenecks, redundancies, and automation opportunities.",
        examples: [
          "A company discovers that 30 % of purchase orders loop back through an unnecessary approval step.",
          "An insurer finds that claims with more than 4 hand-offs take 3× longer and redesigns the workflow.",
        ],
        poweredBy: "Process mining algorithms reconstruct workflows from event logs; ML identifies anomalies and bottlenecks. The system reads the digital footprints your business processes leave behind — timestamps, approvals, handoffs — and builds a visual map of how work actually flows. It then highlights where delays, rework, or deviations occur, so you can streamline operations based on facts, not assumptions.",
        relatedMethods: [
          { methodId: "zscore", topicId: "anomaly", name: "Z-Score / σ-Rule" },
          { methodId: "isoforest", topicId: "anomaly", name: "Isolation Forest" },
          { methodId: "spectral-anom", topicId: "anomaly", name: "Spectral Residual" },
        ],
      },
      {
        id: "translation",
        name: "Real-Time Language Translation",
        description: "Translate documents, emails, chat messages, and even live speech between languages instantly — enabling global teams and customers to communicate without language barriers.",
        examples: [
          "A customer-support team handles inquiries in 15 languages using real-time chat translation.",
          "A multinational company auto-translates internal announcements into each office's local language.",
        ],
        poweredBy: "Neural machine translation models (Transformer-based) trained on parallel text corpora produce accurate translations. The system has studied millions of translated documents and learned how to convert meaning — not just words — from one language to another. It handles context, idioms, and tone, delivering translations that read naturally and can be refined by human reviewers for final polish.",
        relatedMethods: [
          { methodId: "seq2seq", topicId: "nlp", name: "Seq2Seq / Machine Translation" },
          { methodId: "llm", topicId: "genai", name: "Large Language Models (LLMs)" },
          { methodId: "finetuning", topicId: "genai", name: "Fine-Tuning LLMs" },
        ],
      },
    ],
  },
];

const ADDITIONAL_USE_CASES_BY_CATEGORY = {
  "sales-marketing": [
    {
      id: "next-best-offer",
      name: "Next-Best-Offer Targeting",
      description: "Decide which product, discount, or message to show each customer next so every campaign feels more relevant and converts better.",
      examples: [
        "A telecom provider chooses whether each customer should see an upgrade offer, a retention discount, or a device bundle based on recent behavior.",
        "A bank personalizes credit-card cross-sell offers so high-income customers see premium products while students see no-fee cards.",
      ],
      poweredBy: "Propensity models estimate how likely each customer is to respond to each possible offer, while bandit-style policies keep learning which option works best. The system looks at behavior, purchase history, channel preference, and timing, then picks the offer most likely to drive action without wasting discounts on people who would have converted anyway.",
      relatedMethods: [
        { methodId: "gbm-clf", topicId: "classification", name: "Gradient Boosting (Classifier)" },
        { methodId: "contextual-bandit", topicId: "recommenders", name: "Contextual Bandit" },
        { methodId: "shap", topicId: "modeleval", name: "SHAP (Shapley Values)" },
      ],
    },
  ],
  "finance-accounting": [
    {
      id: "cash-flow-forecasting",
      name: "Cash Flow Forecasting",
      description: "Project incoming and outgoing cash so finance teams can avoid shortfalls, time borrowing correctly, and plan spending with confidence.",
      examples: [
        "A CFO forecasts weekly cash balances to decide whether a short-term credit facility will be needed before payroll.",
        "A manufacturing firm predicts when large supplier payments will hit so it can delay non-essential spend without missing obligations.",
      ],
      poweredBy: "Time-series and regression models learn patterns in receivables, payables, seasonality, payroll cycles, and one-off events. The system combines historical cash movements with upcoming invoices and payment behavior to estimate how much money will be available on each future date, giving finance a forward-looking view instead of a backward-looking ledger.",
      relatedMethods: [
        { methodId: "prophet", topicId: "timeseries", name: "Prophet" },
        { methodId: "arima", topicId: "timeseries", name: "ARIMA / SARIMA" },
        { methodId: "rf-reg", topicId: "regression", name: "Random Forest Regressor" },
      ],
    },
  ],
  "operations-supply-chain": [
    {
      id: "supplier-delay-risk",
      name: "Supplier Delay Risk",
      description: "Predict which suppliers, shipments, or purchase orders are likely to arrive late so planners can react before production or service levels are hit.",
      examples: [
        "A manufacturer flags component orders that are likely to miss promised dates and lines up backup vendors before assembly is affected.",
        "A retailer identifies inbound shipments at risk from port congestion and rebalances inventory before stores run short.",
      ],
      poweredBy: "Delay-risk models combine supplier history, lead-time variability, route conditions, customs patterns, weather, and order characteristics to estimate whether a delivery is likely to slip. The system gives planners an early-warning view of supply risk so they can expedite alternatives, adjust schedules, or rebalance stock before a late shipment becomes a bigger operational problem.",
      relatedMethods: [
        { methodId: "gbm-clf", topicId: "classification", name: "Gradient Boosting (Classifier)" },
        { methodId: "rf-clf", topicId: "classification", name: "Random Forest (Classifier)" },
        { methodId: "shap", topicId: "modeleval", name: "SHAP (Shapley Values)" },
      ],
    },
  ],
  "healthcare-life-sciences": [
    {
      id: "readmission-risk",
      name: "Hospital Readmission Risk",
      description: "Predict which patients are most likely to return soon after discharge so clinicians can intervene with follow-ups, medication checks, or care coordination.",
      examples: [
        "A hospital flags high-risk heart-failure patients for a nurse call within 48 hours of discharge.",
        "A care-management team assigns extra support to patients whose history suggests they are likely to return to the emergency department.",
      ],
      poweredBy: "Classification models combine diagnoses, lab results, prior admissions, medications, and social factors to estimate post-discharge risk. The system looks for patterns shared by patients who were readmitted in the past and produces a risk score for each new discharge, helping providers focus limited follow-up resources where they can prevent avoidable returns.",
      relatedMethods: [
        { methodId: "logistic", topicId: "classification", name: "Logistic Regression" },
        { methodId: "gbm-clf", topicId: "classification", name: "Gradient Boosting (Classifier)" },
        { methodId: "shap", topicId: "modeleval", name: "SHAP (Shapley Values)" },
      ],
    },
  ],
  "hr-people": [
    {
      id: "employee-attrition-risk",
      name: "Employee Attrition Risk",
      description: "Estimate which employees are most likely to leave so managers can act early with better support, compensation, or career planning.",
      examples: [
        "A people-analytics team identifies flight-risk engineers after compensation reviews, manager changes, and drops in engagement scores.",
        "A retailer spots stores where attrition risk is rising and intervenes before staffing gaps hurt customer service.",
      ],
      poweredBy: "Attrition models learn from historical resignation patterns using tenure, pay progression, performance reviews, commute, internal mobility, and engagement data. The system turns many weak signals into a practical risk score, helping HR focus retention efforts on the teams and individuals where intervention is most likely to make a difference.",
      relatedMethods: [
        { methodId: "logistic", topicId: "classification", name: "Logistic Regression" },
        { methodId: "gbm-clf", topicId: "classification", name: "Gradient Boosting (Classifier)" },
        { methodId: "shap", topicId: "modeleval", name: "SHAP (Shapley Values)" },
      ],
    },
  ],
  "customer-service": [
    {
      id: "ticket-triage-routing",
      name: "Ticket Triage & Routing",
      description: "Automatically read incoming support requests and send each one to the right queue, team, or urgency level without manual sorting.",
      examples: [
        "A software company routes billing questions, bug reports, and feature requests to different queues within seconds of ticket creation.",
        "An enterprise support team flags tickets mentioning outages or security incidents for immediate escalation.",
      ],
      poweredBy: "Text-classification models and LLMs read the content of emails, chats, and forms to infer intent, product area, urgency, and required skills. The system acts like a highly consistent first-line triage specialist, reducing back-and-forth, shortening first-response times, and making sure the right expert sees the issue first.",
      relatedMethods: [
        { methodId: "bert", topicId: "nlp", name: "BERT / Transformer Embeddings" },
        { methodId: "llm", topicId: "genai", name: "Large Language Models (LLMs)" },
        { methodId: "gbm-clf", topicId: "classification", name: "Gradient Boosting (Classifier)" },
      ],
    },
  ],
  "product-engineering": [
    {
      id: "bug-triage-prioritisation",
      name: "Bug Triage & Prioritisation",
      description: "Rank incoming bugs by likely severity, user impact, and engineering urgency so teams fix the most important issues first.",
      examples: [
        "A SaaS team predicts which bug reports are likely to affect paying customers and pushes them to the top of the queue.",
        "A mobile app team groups duplicate crash reports and highlights the issues most likely to damage App Store ratings.",
      ],
      poweredBy: "Classification models and language models read bug reports, logs, affected components, and historical resolution patterns to estimate priority. Instead of every issue starting in the same pile, the system surfaces the reports most likely to be real, severe, and broadly impactful, helping engineering spend time where it matters most.",
      relatedMethods: [
        { methodId: "bert", topicId: "nlp", name: "BERT / Transformer Embeddings" },
        { methodId: "llm", topicId: "genai", name: "Large Language Models (LLMs)" },
        { methodId: "gbm-clf", topicId: "classification", name: "Gradient Boosting (Classifier)" },
      ],
    },
  ],
  "legal-compliance": [
    {
      id: "contract-clause-extraction",
      name: "Contract Clause Extraction",
      description: "Automatically pull out key clauses such as renewal terms, liability caps, notice periods, and governing law from large contract sets.",
      examples: [
        "A legal ops team scans 5,000 vendor contracts to find which ones allow automatic renewal within the next quarter.",
        "A procurement team identifies all agreements missing a data-processing clause before a compliance audit.",
      ],
      poweredBy: "Entity extraction and LLM-based document understanding models read long legal documents and tag the sections that matter. The system turns dense contract language into structured fields you can filter, compare, and review, saving lawyers from manually hunting through hundreds of pages just to answer a simple operational question.",
      relatedMethods: [
        { methodId: "ner", topicId: "nlp", name: "Named Entity Recognition (NER)" },
        { methodId: "llm", topicId: "genai", name: "Large Language Models (LLMs)" },
        { methodId: "rag", topicId: "genai", name: "Retrieval-Augmented Generation (RAG)" },
      ],
    },
  ],
  "retail-ecommerce": [
    {
      id: "return-fraud-detection",
      name: "Return Fraud Detection",
      description: "Flag suspicious return behavior such as serial wardrobing, receipt fraud, or unusually high-value refund patterns before money is lost.",
      examples: [
        "A fashion retailer identifies customers repeatedly returning worn items after major events and blocks instant refunds for review.",
        "An electronics store spots coordinated refund abuse across multiple accounts using the same devices and addresses.",
      ],
      poweredBy: "Anomaly detection and fraud-classification models learn what normal return behavior looks like across products, customers, stores, and timing. The system notices when patterns drift into suspicious territory - too frequent, too costly, too coordinated - and sends those cases for review while letting normal returns flow through quickly.",
      relatedMethods: [
        { methodId: "isoforest", topicId: "anomaly", name: "Isolation Forest" },
        { methodId: "gbm-clf", topicId: "classification", name: "Gradient Boosting (Classifier)" },
        { methodId: "rf-clf", topicId: "classification", name: "Random Forest (Classifier)" },
      ],
    },
  ],
  "real-estate-construction": [
    {
      id: "construction-delay-forecasting",
      name: "Construction Delay Forecasting",
      description: "Predict which projects or milestones are likely to slip so teams can reallocate crews, materials, or subcontractors before deadlines are missed.",
      examples: [
        "A builder flags apartment projects likely to miss handover because inspections, weather delays, and supplier lead times are stacking up.",
        "An infrastructure contractor predicts which work packages are at highest risk of overrunning the baseline schedule next month.",
      ],
      poweredBy: "Forecasting and risk models combine schedule history, weather, labor availability, permit timelines, inspection results, and supplier performance to estimate delay probability. The system acts like an early-warning layer on top of the project plan, highlighting which milestones are drifting and which controllable factors are driving the risk.",
      relatedMethods: [
        { methodId: "gbm-reg", topicId: "regression", name: "Gradient Boosting Regressor" },
        { methodId: "cox", topicId: "survival", name: "Cox Proportional Hazards" },
        { methodId: "rf-reg", topicId: "regression", name: "Random Forest Regressor" },
      ],
    },
  ],
  education: [
    {
      id: "student-dropout-risk",
      name: "Student Dropout Risk",
      description: "Identify students who are likely to disengage or drop out so institutions can intervene with tutoring, outreach, or financial support.",
      examples: [
        "A university flags first-year students whose attendance and LMS usage suddenly fall after midterms.",
        "An online course platform identifies learners who are likely to abandon a certification program unless nudged back quickly.",
      ],
      poweredBy: "Retention models combine attendance, grades, assignment completion, engagement data, and support history to estimate dropout risk. The system spots the same early warning signs seen in past departures and turns them into a practical action list for advisors, instructors, and student-success teams.",
      relatedMethods: [
        { methodId: "logistic", topicId: "classification", name: "Logistic Regression" },
        { methodId: "gbm-clf", topicId: "classification", name: "Gradient Boosting (Classifier)" },
        { methodId: "shap", topicId: "modeleval", name: "SHAP (Shapley Values)" },
      ],
    },
  ],
  "media-entertainment": [
    {
      id: "subscriber-churn-prevention",
      name: "Subscriber Churn Prevention",
      description: "Predict which viewers, listeners, or readers are about to cancel so retention teams can intervene before subscriptions disappear.",
      examples: [
        "A streaming platform targets subscribers whose watch time has collapsed with content recommendations and retention offers.",
        "A digital publisher spots premium readers who have stopped opening newsletters and sends tailored win-back campaigns.",
      ],
      poweredBy: "Churn models learn from consumption frequency, content preferences, device changes, support contacts, payment issues, and pricing sensitivity. The system translates subtle engagement decline into a risk score, allowing teams to deliver the right retention action before a quiet user disappears for good.",
      relatedMethods: [
        { methodId: "gbm-clf", topicId: "classification", name: "Gradient Boosting (Classifier)" },
        { methodId: "cox", topicId: "survival", name: "Cox Proportional Hazards" },
        { methodId: "contextual-bandit", topicId: "recommenders", name: "Contextual Bandit" },
      ],
    },
  ],
  "agriculture-environment": [
    {
      id: "crop-disease-detection",
      name: "Crop Disease Detection",
      description: "Detect plant disease early from leaf images or drone footage so farmers can act before infection spreads across a field.",
      examples: [
        "A greenhouse operator uses phone photos to catch mildew in cucumbers before an entire section needs to be discarded.",
        "A vineyard uses drone imagery to identify stressed vines and treat only the affected rows instead of spraying the whole property.",
      ],
      poweredBy: "Computer-vision models learn visual patterns associated with healthy and diseased plants, often from thousands of labeled images. The system turns ordinary images into fast field diagnostics, helping growers move from blanket treatment to targeted intervention that saves both crop yield and chemical cost.",
      relatedMethods: [
        { methodId: "cnn", topicId: "deeplearning", name: "Convolutional Neural Network (CNN)" },
        { methodId: "transfer", topicId: "deeplearning", name: "Transfer Learning / Fine-Tuning" },
        { methodId: "segmentation", topicId: "deeplearning", name: "Image Segmentation" },
      ],
    },
  ],
  "government-public-sector": [
    {
      id: "benefits-fraud-detection",
      name: "Benefits Fraud Detection",
      description: "Flag suspicious claims or applications so investigators can focus on the cases most likely to involve misuse of public funds.",
      examples: [
        "A benefits agency identifies clusters of claims using shared addresses, phone numbers, and bank details for manual review.",
        "A municipality spots unusual reimbursement patterns that suggest duplicate submissions across multiple programs.",
      ],
      poweredBy: "Fraud models compare each application or claim against normal behavior using transaction history, identity links, timing, and network patterns. The system helps investigators separate rare but valid cases from truly suspicious ones, reducing manual workload while improving the odds of catching organized abuse.",
      relatedMethods: [
        { methodId: "isoforest", topicId: "anomaly", name: "Isolation Forest" },
        { methodId: "gbm-clf", topicId: "classification", name: "Gradient Boosting (Classifier)" },
        { methodId: "shap", topicId: "modeleval", name: "SHAP (Shapley Values)" },
      ],
    },
  ],
  "general-business": [
    {
      id: "kpi-anomaly-alerts",
      name: "KPI Anomaly Alerts",
      description: "Automatically detect when an important metric suddenly moves in an unusual way so leaders can investigate before a small issue turns into a big one.",
      examples: [
        "An executive team gets an alert when conversion rate drops sharply in one region even though traffic looks normal.",
        "An operations dashboard flags an unusual spike in refund requests before the weekly business review catches it.",
      ],
      poweredBy: "Anomaly-detection methods learn the normal range and rhythm of key metrics, then alert when values break the expected pattern. Instead of waiting for someone to notice a chart drift in a dashboard, the system continuously watches for meaningful deviations and points teams toward the metrics that deserve immediate attention.",
      relatedMethods: [
        { methodId: "zscore", topicId: "anomaly", name: "Z-Score / σ-Rule" },
        { methodId: "isoforest", topicId: "anomaly", name: "Isolation Forest" },
        { methodId: "spectral-anom", topicId: "anomaly", name: "Spectral Residual" },
      ],
    },
  ],
};


const MINIMUM_USE_CASE_TOP_UPS_BY_CATEGORY = {
  "hr-people": [
    {
      id: "offer-acceptance-forecasting",
      name: "Offer Acceptance Forecasting",
      description: "Predict which candidates are likely to reject an offer so recruiters can intervene earlier with compensation, timing, or manager outreach.",
      examples: [
        "A startup flags engineering candidates who are likely to decline unless the hiring manager calls within 24 hours.",
        "A hospital system identifies nursing candidates who may reject offers because competing employers are moving faster.",
      ],
      poweredBy: "Classification models learn from past offers using compensation gaps, interview feedback, role demand, time-to-offer, location, and competing-market conditions. The system converts those signals into a practical risk score so recruiters know which offers need extra attention before strong candidates disappear from the pipeline.",
      relatedMethods: [
        { methodId: "logistic", topicId: "classification", name: "Logistic Regression" },
        { methodId: "gbm-clf", topicId: "classification", name: "Gradient Boosting (Classifier)" },
        { methodId: "shap", topicId: "modeleval", name: "SHAP (Shapley Values)" },
      ],
    },
  ],
  "customer-service": [
    {
      id: "customer-escalation-risk",
      name: "Customer Escalation Risk",
      description: "Predict which support conversations are likely to escalate into complaints, churn threats, or executive attention so teams can step in earlier.",
      examples: [
        "A SaaS company flags support threads mentioning cancellation, repeated outages, and unresolved billing issues before the account manager gets surprised.",
        "An airline identifies service interactions that are likely to spill into public social complaints unless a supervisor intervenes quickly.",
      ],
      poweredBy: "Text and behavior models combine message content, sentiment shifts, wait times, issue history, and customer value to estimate escalation risk. The system acts like an early-warning layer on top of the support queue, helping experienced agents and supervisors focus on the conversations most likely to become expensive or reputationally damaging.",
      relatedMethods: [
        { methodId: "bert", topicId: "nlp", name: "BERT / Transformer Embeddings" },
        { methodId: "gbm-clf", topicId: "classification", name: "Gradient Boosting (Classifier)" },
        { methodId: "shap", topicId: "modeleval", name: "SHAP (Shapley Values)" },
      ],
    },
    {
      id: "knowledge-base-gap-detection",
      name: "Knowledge Base Gap Detection",
      description: "Find recurring issues that customers keep asking about but that your help center does not explain clearly enough.",
      examples: [
        "An e-commerce brand notices thousands of repeat questions about refund timing and writes a clearer self-service article before peak season.",
        "A B2B software team spots a pattern of setup mistakes that support agents explain manually every week because the documentation is still too shallow.",
      ],
      poweredBy: "NLP and retrieval models cluster incoming tickets, compare them with existing documentation, and highlight where customer demand is not matched by usable help content. The system shows which unanswered themes are driving avoidable support volume so documentation teams can create the articles, FAQs, and guided flows with the biggest deflection payoff.",
      relatedMethods: [
        { methodId: "bert", topicId: "nlp", name: "BERT / Transformer Embeddings" },
        { methodId: "llm", topicId: "genai", name: "Large Language Models (LLMs)" },
        { methodId: "rag", topicId: "genai", name: "Retrieval-Augmented Generation (RAG)" },
      ],
    },
  ],
  "product-engineering": [
    {
      id: "release-regression-risk",
      name: "Release Regression Risk",
      description: "Estimate whether an upcoming release is likely to introduce bugs, performance problems, or outages before it reaches users.",
      examples: [
        "A platform team scores each Friday release based on code churn, failed tests, and component history before deciding whether to hold the rollout.",
        "A mobile team flags builds that are more likely to trigger app crashes after launch because they touch historically fragile modules.",
      ],
      poweredBy: "Risk models learn from historical deployments using change size, affected services, test coverage, defect history, incident patterns, and review signals. The system helps engineering leaders focus release reviews on the builds that deserve extra caution instead of treating every deployment as equally safe.",
      relatedMethods: [
        { methodId: "gbm-clf", topicId: "classification", name: "Gradient Boosting (Classifier)" },
        { methodId: "isoforest", topicId: "anomaly", name: "Isolation Forest" },
        { methodId: "shap", topicId: "modeleval", name: "SHAP (Shapley Values)" },
      ],
    },
  ],
  "legal-compliance": [
    {
      id: "third-party-compliance-risk",
      name: "Third-Party Compliance Risk Scoring",
      description: "Score vendors, partners, and suppliers by likely compliance risk before onboarding, renewal, or deeper due diligence.",
      examples: [
        "A financial-services firm prioritizes vendor reviews by identifying partners with elevated privacy, security, or sanctions exposure.",
        "A manufacturer flags suppliers whose audit history and public disclosures suggest a higher chance of labor or environmental compliance issues.",
      ],
      poweredBy: "Risk models combine questionnaires, audit findings, news signals, contract details, and historical incidents to estimate third-party exposure. The system gives legal and compliance teams a faster way to separate low-risk vendors from the relationships that deserve deeper scrutiny before they create operational or regulatory headaches.",
      relatedMethods: [
        { methodId: "gbm-clf", topicId: "classification", name: "Gradient Boosting (Classifier)" },
        { methodId: "llm", topicId: "genai", name: "Large Language Models (LLMs)" },
        { methodId: "rag", topicId: "genai", name: "Retrieval-Augmented Generation (RAG)" },
      ],
    },
    {
      id: "policy-violation-monitoring",
      name: "Policy Violation Monitoring",
      description: "Flag potential internal-policy breaches in communications, transactions, or case records so compliance teams can review the highest-risk activity first.",
      examples: [
        "A bank highlights employee communications that may involve off-channel conduct or inappropriate sharing of client information.",
        "A healthcare organization flags case notes and access patterns that may indicate policy violations around protected data handling.",
      ],
      poweredBy: "NLP and classification models read structured and unstructured records for patterns associated with past policy breaches. The system acts like a tireless first-pass reviewer, surfacing the communications and events most likely to matter so compliance teams can focus on investigation instead of trawling through huge volumes of low-value material.",
      relatedMethods: [
        { methodId: "bert", topicId: "nlp", name: "BERT / Transformer Embeddings" },
        { methodId: "llm", topicId: "genai", name: "Large Language Models (LLMs)" },
        { methodId: "gbm-clf", topicId: "classification", name: "Gradient Boosting (Classifier)" },
      ],
    },
    {
      id: "privacy-request-triage",
      name: "Privacy Request Triage",
      description: "Automatically sort data-access, deletion, correction, and portability requests so privacy teams can meet deadlines with less manual sorting.",
      examples: [
        "A consumer brand routes incoming requests into access, deletion, and identity-verification queues within seconds instead of relying on manual inbox review.",
        "A SaaS company flags requests referencing legal deadlines or multiple jurisdictions so privacy counsel can review them sooner.",
      ],
      poweredBy: "Entity extraction and intent-classification models identify what the requester wants, which systems may be involved, and how urgent the case appears. The system turns a noisy inbox into a structured workflow, helping privacy teams respond faster and reduce the risk of missing regulated response windows.",
      relatedMethods: [
        { methodId: "ner", topicId: "nlp", name: "Named Entity Recognition (NER)" },
        { methodId: "bert", topicId: "nlp", name: "BERT / Transformer Embeddings" },
        { methodId: "llm", topicId: "genai", name: "Large Language Models (LLMs)" },
      ],
    },
  ],
  "retail-ecommerce": [
    {
      id: "dynamic-markdown-optimization",
      name: "Dynamic Markdown Optimization",
      description: "Decide when and how much to discount aging inventory so stock clears faster without giving away more margin than necessary.",
      examples: [
        "A fashion retailer adjusts markdown timing by store and product family instead of running the same discount everywhere.",
        "An electronics marketplace identifies when slower-moving accessories need a price cut to clear before the next product launch.",
      ],
      poweredBy: "Pricing and demand models learn how sales respond to timing, discount depth, seasonality, inventory age, and local demand. The system helps merchants balance sell-through and margin by recommending the markdown strategy most likely to move stock without training customers to wait for unnecessary discounts.",
      relatedMethods: [
        { methodId: "gbm-reg", topicId: "regression", name: "Gradient Boosting Regressor" },
        { methodId: "contextual-bandit", topicId: "recommenders", name: "Contextual Bandit" },
        { methodId: "rf-reg", topicId: "regression", name: "Random Forest Regressor" },
      ],
    },
    {
      id: "shelf-availability-monitoring",
      name: "Shelf Availability Monitoring",
      description: "Detect empty shelves, misplaced products, or poor in-store execution from images so teams can fix lost sales opportunities faster.",
      examples: [
        "A grocery chain uses aisle photos to spot fast-moving products that have gone out of stock before store staff notice.",
        "A consumer-goods brand checks whether promotional displays were actually set up correctly across retail locations.",
      ],
      poweredBy: "Computer-vision models inspect shelf images for gaps, facings, placement errors, and planogram drift. The system turns store imagery into a real-time picture of what shoppers can actually buy, helping retail teams close the gap between inventory on paper and products physically available to customers.",
      relatedMethods: [
        { methodId: "cnn", topicId: "deeplearning", name: "Convolutional Neural Network (CNN)" },
        { methodId: "segmentation", topicId: "deeplearning", name: "Image Segmentation" },
        { methodId: "isoforest", topicId: "anomaly", name: "Isolation Forest" },
      ],
    },
  ],
  "real-estate-construction": [
    {
      id: "lease-renewal-risk",
      name: "Lease Renewal Risk",
      description: "Predict which tenants are unlikely to renew so leasing teams can act before vacancy risk turns into lost revenue.",
      examples: [
        "A commercial landlord flags tenants whose foot traffic and payment behavior suggest they may downsize or leave at renewal.",
        "A residential operator identifies renters who are likely to move out unless maintenance issues and pricing concerns are addressed early.",
      ],
      poweredBy: "Renewal-risk models learn from payment history, maintenance issues, local market conditions, occupancy patterns, and past lease outcomes. The system gives asset managers an early warning on likely churn so they can prioritize outreach, incentives, and pricing strategy before units or suites sit empty.",
      relatedMethods: [
        { methodId: "logistic", topicId: "classification", name: "Logistic Regression" },
        { methodId: "gbm-clf", topicId: "classification", name: "Gradient Boosting (Classifier)" },
        { methodId: "shap", topicId: "modeleval", name: "SHAP (Shapley Values)" },
      ],
    },
    {
      id: "maintenance-work-order-prioritisation",
      name: "Maintenance Work Order Prioritisation",
      description: "Rank building issues by urgency, likely tenant impact, and failure risk so limited maintenance teams work the right jobs first.",
      examples: [
        "A property manager prioritizes water leaks affecting multiple units over cosmetic requests that can wait another day.",
        "A facilities team routes elevator, HVAC, and security issues to the top of the queue when the wording suggests high operational impact.",
      ],
      poweredBy: "Text and risk models classify incoming work orders using problem descriptions, asset history, past repair outcomes, and tenant impact. The system helps operations teams move beyond first-come, first-served maintenance by identifying which tickets are most likely to escalate into safety issues, downtime, or resident dissatisfaction.",
      relatedMethods: [
        { methodId: "bert", topicId: "nlp", name: "BERT / Transformer Embeddings" },
        { methodId: "gbm-clf", topicId: "classification", name: "Gradient Boosting (Classifier)" },
        { methodId: "shap", topicId: "modeleval", name: "SHAP (Shapley Values)" },
      ],
    },
    {
      id: "site-safety-incident-prevention",
      name: "Site Safety Incident Prevention",
      description: "Flag projects, crews, or conditions associated with a rising chance of safety incidents so supervisors can intervene earlier.",
      examples: [
        "A contractor identifies sites where overtime, weather, and prior near misses are creating elevated accident risk this week.",
        "A developer spots subcontractor combinations that historically correlate with more safety events and adds extra oversight.",
      ],
      poweredBy: "Anomaly and risk models combine site logs, weather, inspection findings, overtime patterns, equipment usage, and incident history to estimate safety exposure. The system turns fragmented project data into an actionable risk view so safety leaders can focus training, inspections, and supervision before an accident occurs.",
      relatedMethods: [
        { methodId: "isoforest", topicId: "anomaly", name: "Isolation Forest" },
        { methodId: "gbm-clf", topicId: "classification", name: "Gradient Boosting (Classifier)" },
        { methodId: "cox", topicId: "survival", name: "Cox Proportional Hazards" },
      ],
    },
  ],
  education: [
    {
      id: "enrollment-yield-prediction",
      name: "Enrollment Yield Prediction",
      description: "Predict which admitted students are most likely to enroll so institutions can focus outreach and scholarship spend where it will matter most.",
      examples: [
        "A university identifies admitted students who are on the fence and sends targeted counselor outreach before decision deadlines.",
        "A business school estimates which applicants are likely to accept without extra scholarship support and reserves aid for more uncertain admits.",
      ],
      poweredBy: "Yield models learn from application history, demographics, scholarship offers, geography, engagement, and prior admission cycles. The system gives enrollment teams a sharper view of who is likely to say yes, helping them plan class mix, outreach, and financial-aid strategy with less guesswork.",
      relatedMethods: [
        { methodId: "logistic", topicId: "classification", name: "Logistic Regression" },
        { methodId: "gbm-clf", topicId: "classification", name: "Gradient Boosting (Classifier)" },
        { methodId: "shap", topicId: "modeleval", name: "SHAP (Shapley Values)" },
      ],
    },
    {
      id: "course-demand-forecasting",
      name: "Course Demand Forecasting",
      description: "Forecast future enrollment by course, section, or campus so timetables, instructors, and classroom capacity can be planned more accurately.",
      examples: [
        "A university predicts unusually high demand for introductory data courses and opens extra sections before registration week.",
        "A training provider forecasts demand for certification modules by quarter so it can staff instructors before waitlists build up.",
      ],
      poweredBy: "Forecasting models learn from registration history, prerequisites, academic calendars, seasonality, marketing activity, and degree requirements. The system helps academic planners match supply with actual student demand, reducing overcrowded classes, underfilled sections, and last-minute scheduling chaos.",
      relatedMethods: [
        { methodId: "prophet", topicId: "timeseries", name: "Prophet" },
        { methodId: "arima", topicId: "timeseries", name: "ARIMA / SARIMA" },
        { methodId: "rf-reg", topicId: "regression", name: "Random Forest Regressor" },
      ],
    },
    {
      id: "student-support-case-triage",
      name: "Student Support Case Triage",
      description: "Route advising, financial-aid, wellness, and administrative requests to the right team faster so students get help without bouncing between offices.",
      examples: [
        "A university sorts student emails into bursar, registrar, advising, and counseling queues within seconds of receipt.",
        "An online education provider flags support cases that involve deadlines, accessibility issues, or mental-health concerns for faster review.",
      ],
      poweredBy: "Language models classify request intent, urgency, and likely destination based on message content and prior support patterns. The system works like a smart intake desk, reducing routing mistakes and helping institutions respond faster during peak periods such as registration, exams, and aid deadlines.",
      relatedMethods: [
        { methodId: "bert", topicId: "nlp", name: "BERT / Transformer Embeddings" },
        { methodId: "llm", topicId: "genai", name: "Large Language Models (LLMs)" },
        { methodId: "gbm-clf", topicId: "classification", name: "Gradient Boosting (Classifier)" },
      ],
    },
  ],
  "media-entertainment": [
    {
      id: "content-performance-forecasting",
      name: "Content Performance Forecasting",
      description: "Forecast the likely audience for upcoming shows, articles, videos, or podcasts so teams can plan promotion and inventory more effectively.",
      examples: [
        "A streaming service predicts which new releases are likely to overperform and allocates homepage promotion accordingly.",
        "A publisher estimates expected traffic for upcoming investigations so the advertising team can plan inventory and sponsorships.",
      ],
      poweredBy: "Forecasting and regression models learn from historical audience behavior, creator popularity, release timing, topic trends, and promotional support. The system helps content teams estimate likely reach before launch, making marketing and scheduling decisions less subjective.",
      relatedMethods: [
        { methodId: "prophet", topicId: "timeseries", name: "Prophet" },
        { methodId: "gbm-reg", topicId: "regression", name: "Gradient Boosting Regressor" },
        { methodId: "shap", topicId: "modeleval", name: "SHAP (Shapley Values)" },
      ],
    },
    {
      id: "thumbnail-creative-optimization",
      name: "Thumbnail & Creative Optimization",
      description: "Choose the thumbnail, headline, or promo creative most likely to win attention from each audience segment.",
      examples: [
        "A streaming platform serves different artwork variants for the same title depending on what similar viewers have responded to before.",
        "A podcast network tests multiple cover images and episode titles to improve click-through without relying only on manual editor judgment.",
      ],
      poweredBy: "Bandit policies and vision models learn which creative variants perform best for different audiences and contexts. The system keeps improving as it sees more impressions, balancing experimentation with performance so marketing teams can find stronger creative combinations faster than static A/B testing alone.",
      relatedMethods: [
        { methodId: "contextual-bandit", topicId: "recommenders", name: "Contextual Bandit" },
        { methodId: "cnn", topicId: "deeplearning", name: "Convolutional Neural Network (CNN)" },
        { methodId: "gbm-clf", topicId: "classification", name: "Gradient Boosting (Classifier)" },
      ],
    },
  ],
  "agriculture-environment": [
    {
      id: "yield-forecasting",
      name: "Yield Forecasting",
      description: "Predict expected crop output by field, variety, or season so growers can plan labor, storage, and sales commitments more confidently.",
      examples: [
        "A grain producer estimates harvest volume by field before combine crews are scheduled and storage contracts are finalized.",
        "A fruit grower forecasts likely output by orchard block so sales teams can set expectations with buyers earlier.",
      ],
      poweredBy: "Forecasting and regression models combine weather history, satellite imagery, soil conditions, crop stage, and management practices to estimate future yield. The system helps farms replace rough intuition with a more reliable production outlook, which improves both operational planning and commercial decisions.",
      relatedMethods: [
        { methodId: "prophet", topicId: "timeseries", name: "Prophet" },
        { methodId: "gbm-reg", topicId: "regression", name: "Gradient Boosting Regressor" },
        { methodId: "rf-reg", topicId: "regression", name: "Random Forest Regressor" },
      ],
    },
    {
      id: "irrigation-need-prediction",
      name: "Irrigation Need Prediction",
      description: "Estimate when and how much to irrigate so crops stay healthy without wasting water or energy.",
      examples: [
        "A vineyard predicts which blocks need irrigation tomorrow based on weather, soil moisture, and vine stress signals.",
        "A large farm reduces overwatering by using field-level forecasts instead of applying the same schedule everywhere.",
      ],
      poweredBy: "Regression and forecasting models combine soil moisture, weather forecasts, crop stage, evapotranspiration, and historical irrigation outcomes to estimate water need. The system helps growers move from fixed schedules to targeted irrigation decisions that improve resilience and reduce resource use.",
      relatedMethods: [
        { methodId: "gbm-reg", topicId: "regression", name: "Gradient Boosting Regressor" },
        { methodId: "rf-reg", topicId: "regression", name: "Random Forest Regressor" },
        { methodId: "prophet", topicId: "timeseries", name: "Prophet" },
      ],
    },
  ],
  "government-public-sector": [
    {
      id: "permit-review-triage",
      name: "Permit Review Triage",
      description: "Route permit and license applications by complexity, urgency, and likely review path so straightforward cases move faster.",
      examples: [
        "A city sorts building permits into standard, high-risk, and specialist-review queues instead of treating every submission the same way.",
        "A business-licensing office flags applications likely to be delayed by missing documents before they sit untouched in a backlog.",
      ],
      poweredBy: "Language and risk models read application text, forms, attachments, and historical review outcomes to estimate complexity and required expertise. The system helps agencies reduce backlog and citizen wait times by sending simpler cases down faster paths while reserving senior review capacity for the most complex submissions.",
      relatedMethods: [
        { methodId: "bert", topicId: "nlp", name: "BERT / Transformer Embeddings" },
        { methodId: "llm", topicId: "genai", name: "Large Language Models (LLMs)" },
        { methodId: "gbm-clf", topicId: "classification", name: "Gradient Boosting (Classifier)" },
      ],
    },
    {
      id: "infrastructure-maintenance-prioritisation",
      name: "Infrastructure Maintenance Prioritisation",
      description: "Rank roads, bridges, pipes, and public assets by failure risk and service impact so limited budgets go to the most urgent work first.",
      examples: [
        "A municipality prioritizes pipe replacements in neighborhoods where break risk and service disruption are both rising.",
        "A transport agency identifies bridge inspections that should be accelerated because deterioration patterns suggest elevated structural risk.",
      ],
      poweredBy: "Risk models combine inspection history, age, repair records, sensor data, usage intensity, and environmental conditions to estimate where failure is most likely and most costly. The system gives public-sector asset managers a clearer, more defensible basis for maintenance planning than intuition or age alone.",
      relatedMethods: [
        { methodId: "gbm-clf", topicId: "classification", name: "Gradient Boosting (Classifier)" },
        { methodId: "cox", topicId: "survival", name: "Cox Proportional Hazards" },
        { methodId: "isoforest", topicId: "anomaly", name: "Isolation Forest" },
      ],
    },
  ],
};


export const USE_CASE_CATEGORIES = BASE_USE_CASE_CATEGORIES.map((category) => ({
  ...category,
  useCases: [
    ...category.useCases,
    ...(ADDITIONAL_USE_CASES_BY_CATEGORY[category.id] ?? []),
    ...(MINIMUM_USE_CASE_TOP_UPS_BY_CATEGORY[category.id] ?? []),
  ],
}));
