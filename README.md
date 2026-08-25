# Macroscope

### Economic Intelligence, Structured for Decisions.

**Macroscope** is an economic intelligence dashboard designed to turn complex macroeconomic data into a clear, comparable view of economic health.

It brings together country-level indicators, standardized scoring, category-level analysis, historical trends, and AI-generated executive summaries into a single analytical interface.

> **Explore the live application:** [macroscope-alpha.vercel.app](https://macroscope-alpha.vercel.app/)

---

## Why Macroscope?

Macroeconomic information is abundant, but transforming raw indicators into something decision-ready is the difficult part.

Macroscope approaches that problem as an analytical pipeline:

**Raw economic data → standardized indicators → category scores → economy health score → trends & interpretation**

Rather than presenting isolated statistics, the platform provides a structured framework for understanding how multiple economic dimensions contribute to an overall picture of economic health.

---

## What It Does

### 🌍 Country Economic Intelligence

Select a country and examine its economic condition across a broad set of macroeconomic indicators.

The dashboard currently works with World Bank indicators covering areas such as:

* Labor & Income
* Consumer Activity
* Prices & Stability
* Policy & Financial
* Production & Business
* Housing & Wealth
* Growth & Global Flows
* Sentiment & Valuation

The indicator framework is defined centrally through a provider mapping layer, making it easier to extend the system with additional data sources and metrics.

---

### 📊 Economy Health Score

Macroscope converts individual indicators into normalized **0–100 scores** using configurable ranges and directionality.

Depending on the metric, the scoring model can treat:

* Higher values as better
* Lower values as better
* Mid-range values as preferable

Category scores are then calculated from their constituent indicators, followed by an overall **Economy Health Score**.

This creates a common analytical scale across fundamentally different economic measures.

---

### 📈 Historical Trend Analysis

The platform calculates historical economy-health scores across multiple years, allowing users to see whether an economy is improving, weakening, or remaining relatively stable over time.

Category-level historical scores are also generated, making it possible to identify which dimensions of an economy are driving broader changes.

---

### 🔎 Indicator-Level Exploration

Macroscope does not stop at the headline score.

Users can inspect individual indicators, compare their current and previous observations, identify trends, filter metrics, and explore the underlying economic categories.

The interface also surfaces **top improving and deteriorating indicators**, helping users move quickly from an overall signal to the metrics behind it.

---

### 🤖 AI Executive Summary

Macroscope includes an AI-powered interpretation layer built with the Groq SDK.

Instead of asking an LLM to independently research the economy, the system provides it with the structured economic data already calculated by the application and instructs it to produce a concise three-part executive summary:

1. Overall economic condition
2. Most important positive or negative driver
3. Most important trend, risk, or opportunity

The prompt explicitly constrains the model from inventing statistics, changing numerical values, introducing unsupported external facts, or treating correlation as causation.

This makes the AI layer an **interpretation interface over structured data**, rather than the underlying source of truth.

---

## Data & Analytical Architecture

At a high level, Macroscope follows this flow:

```text
World Bank API
      │
      ▼
Country & Indicator Data
      │
      ▼
Indicator Mapping
      │
      ▼
Normalization & Directionality
      │
      ▼
Indicator Scores (0–100)
      │
      ▼
Category Scores
      │
      ▼
Economy Health Score
      │
      ├── Historical Trends
      ├── Top Movers
      ├── Indicator Analysis
      └── AI Executive Summary
```

The application retrieves country and indicator data through the World Bank API and caches country metadata for a day and indicator requests for roughly an hour.

---

## Technology Stack

| Layer         | Technology     |
| ------------- | -------------- |
| Framework     | Next.js 14     |
| Language      | TypeScript     |
| UI            | React 18       |
| Styling       | Tailwind CSS   |
| Visualization | Recharts       |
| Icons         | Lucide React   |
| Economic Data | World Bank API |
| AI Layer      | Groq SDK       |
| Deployment    | Vercel         |

The current dependency stack is defined in the project's `package.json`.

---

## Project Structure

```text
Macroscope/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── countries/
│   │   │   └── services/
│   │   ├── category/
│   │   ├── compare/
│   │   ├── global/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   │
│   ├── components/
│   │   ├── barometer/
│   │   ├── cards/
│   │   ├── charts/
│   │   ├── dashboard/
│   │   ├── filters/
│   │   ├── layout/
│   │   └── modals/
│   │
│   ├── context/
│   ├── data/
│   └── lib/
│
├── .env.example
├── next.config.js
├── package.json
├── postcss.config.js
└── tailwind.config.js
```

The backend is organized around country-specific API routes and reusable services for data retrieval, indicator mapping, scoring, and AI generation.

---

## Scoring Methodology

Macroscope uses configurable normalization rather than comparing raw values directly.

For a **higher-is-better** indicator:

```text
Score = ((Value - Min) / (Max - Min)) × 100
```

For a **lower-is-better** indicator:

```text
Score = ((Max - Value) / (Max - Min)) × 100
```

For a **neutral** indicator, the score rewards proximity to the midpoint of the configured range.

Scores are constrained to the **0–100** range before being aggregated.

### Why normalize?

Economic indicators operate on radically different scales and units.

For example:

* unemployment is measured in %
* market capitalization can be expressed as % of GDP
* GDP growth is a yearly growth rate
* real interest rates can be positive or negative

Normalization creates a shared analytical language that allows these metrics to contribute to a common framework.

---

## API Capabilities

The application exposes backend routes for:

```text
GET /api/countries
GET /api/countries/compare
GET /api/countries/{countryCode}/overview
GET /api/countries/{countryCode}/metrics
GET /api/countries/{countryCode}/ai-summary
GET /api/countries/{countryCode}/correlations
```

These endpoints support country discovery, country analysis, comparison workflows, metric retrieval, AI summaries, and analytical extensions.

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/hameem-codes/Macroscope.git
cd Macroscope
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env.local` file based on `.env.example`.

```env
GROQ_API_KEY=your_groq_api_key
GROQ_MODEL=openai/gpt-oss-20b
```

The AI summary service reads the Groq credentials from environment variables and falls back gracefully when the API key is unavailable.

### 4. Start the development server

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

### 5. Production build

```bash
npm run build
npm start
```

---

## Available Scripts

```bash
npm run dev        # Start development server
npm run build      # Create production build
npm start          # Start production server
npm run typecheck  # Run TypeScript checks
npm run lint       # Run linting
```

---

## Analytical Principles

Macroscope is built around a few important principles:

### Data first

The application treats structured economic observations as the foundation of the analysis. The AI layer operates on application-generated economic data rather than replacing it.

### Comparable signals

Normalization allows heterogeneous indicators to be interpreted on a common 0–100 scale.

### Multi-dimensional analysis

A single economic metric rarely tells the full story. Macroscope therefore groups indicators into broader economic dimensions before generating an overall health score.

### Explainable aggregation

The overall score can be traced back through:

```text
Economy Health Score
        ↓
Category Scores
        ↓
Indicator Scores
        ↓
Underlying Data
```

This structure helps users understand **why** a score looks the way it does instead of treating the headline number as a black box.

---

## Current Limitations

Macroscope is an evolving analytical platform, and some functionality is intentionally still at MVP/scaffold stage.

Most notably, the current correlations endpoint contains a placeholder implementation and does **not yet calculate correlations from a complete historical series**. The endpoint currently returns a simulated coefficient and includes a correlation-versus-causation disclaimer.

The scoring framework is also dependent on configured indicator ranges, meaning the quality of the resulting score depends partly on how those ranges and directionality assumptions are defined.

These limitations are useful areas for future methodological refinement.

---

## Roadmap

Potential next steps include:

* Expand beyond the current World Bank indicator set
* Add additional providers such as IMF and OECD
* Introduce richer historical time-series analysis
* Replace the correlation scaffold with true historical correlation calculations
* Add statistical significance and confidence information
* Improve cross-country benchmarking
* Introduce configurable scoring methodologies
* Add data provenance and methodology views
* Support downloadable analytical reports
* Add more advanced forecasting and scenario analysis

---

## Vision

Macroscope is built around a simple idea:

> **Economic data becomes more valuable when it becomes easier to interpret.**

The long-term goal is to evolve from a dashboard of indicators into a broader **economic intelligence platform** where data retrieval, statistical analysis, contextual interpretation, and decision support work together in one system.

---

## Live Demo

**Web App:**
https://macroscope-alpha.vercel.app/

**Repository:**
https://github.com/hameem-codes/Macroscope

---

## Author

Built by **Hameem**.

[GitHub](https://github.com/hameem-codes)

---

## License

This project currently does not specify a repository license.

---

<p align="center">
  <sub>Macroscope — turning macroeconomic data into structured intelligence.</sub>
</p>
