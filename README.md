# 🔭 Macroscope

### **A clearer lens on economic health.**

Macroscope turns a sea of economic numbers into something you can actually *read*.

Instead of looking at GDP, inflation, employment, trade, and financial indicators in isolation, Macroscope connects them into a **multidimensional picture of how an economy is performing.**

**Raw data → meaningful signals → economic dimensions → one bigger picture.**

---

## 🌍 Look Beyond the Numbers

An economy is never just *one* number.

Macroscope brings together indicators across:

`Labor` · `Consumption` · `Prices` · `Finance` · `Production` · `Growth` · `Trade` · `Markets`

Each indicator is interpreted according to its economic meaning, normalized onto a common scale, and incorporated into a broader analytical framework.

The result?

### **An Economy Health Score**

A single, intuitive signal that provides the *big picture* — while still allowing users to explore the economic factors behind it.

---

## 🧠 How It Thinks

Macroscope works through a layered scoring process:

```text
Economic Data
      ↓
Indicator Interpretation
      ↓
Normalization
      ↓
Indicator Scores
      ↓
Category Scores
      ↓
Economy Health Score
```

The objective isn't simply to calculate an average.

It's to transform fundamentally different economic measurements into **comparable signals** before combining them.

---

# 📐 Country Health Score — Methodology

The **Economy Health Score** is calculated through a three-stage aggregation process:

**Indicator → Category → Overall Economy**

### 1. Normalize Each Indicator

Every indicator has:

* A minimum reference value (L)
* A maximum reference value (U)
* A direction of preference
* Its observed value (x)

The resulting score is constrained to a **0–100 scale**.

### Higher is Better

For indicators where higher values represent stronger economic conditions:

[
S_i =
100 \times
\frac{x_i-L_i}{U_i-L_i}
]

### Lower is Better

For indicators where lower values represent stronger conditions:

[
S_i =
100 \times
\frac{U_i-x_i}{U_i-L_i}
]

### Neutral Indicators

Some indicators are not inherently better when they continuously increase or decrease.

For these, Macroscope rewards values closer to the midpoint:

[
M_i = \frac{L_i+U_i}{2}
]

[
R_i = \frac{U_i-L_i}{2}
]

[
S_i =
100 \times
\left(
1-\frac{|x_i-M_i|}{R_i}
\right)
]

This means the score is highest near the preferred midpoint and decreases as the observation moves away from it.

Finally:

[
S_i = \max(0,\min(100,S_i))
]

So every indicator ultimately contributes a value between **0 and 100**.

---

## 2. Calculate Economic Category Scores

Indicators are grouped into broader economic categories.

For category (c), containing (n_c) indicators:

[
C_c =
\frac{1}{n_c}
\sum_{i=1}^{n_c} S_i
]

Each category therefore receives its own **0–100 score**.

For example:

```text
Labor & Income       → 78
Consumer Activity    → 71
Prices & Stability   → 64
Production           → 82
Growth & Trade       → 76
```

This allows individual indicators to contribute to a broader economic dimension rather than directly dominating the final score.

---

## 3. Calculate the Economy Health Score

Once all category scores are calculated, Macroscope takes their arithmetic mean.

For (k) economic categories:

[
\boxed{
EHS =
\frac{1}{k}
\sum_{c=1}^{k} C_c
}
]

The final result is again constrained to the **0–100 range**.

In other words:

```text
Indicator Scores
       ↓
Average within each category
       ↓
Category Scores
       ↓
Average across categories
       ↓
╔══════════════════════╗
║  ECONOMY HEALTH SCORE ║
╚══════════════════════╝
```

This two-level aggregation prevents a category containing many indicators from automatically dominating the overall score simply because it has more metrics.

---

## 📊 What the Score Actually Means

The Economy Health Score is best understood as a **composite analytical signal**, not a conventional economic statistic.

A score of 80 does not mean that an economy is "80% healthy."

Instead, it means that the country's measured indicators, relative to their defined reference ranges and economic directions, collectively produce a stronger normalized position within Macroscope's analytical framework.

That distinction matters.

**The score summarizes the data — it does not replace the data.**

---

## ⏳ Historical Health

Macroscope applies the same scoring framework to historical observations.

For each historical year:

[
x_{i,t}
\rightarrow
S_{i,t}
\rightarrow
C_{c,t}
\rightarrow
EHS_t
]

This produces a time series of economy-health scores that can be used to observe changes in economic conditions over time.

The result makes it possible to distinguish between:

**Where an economy is**
and
**how its position has changed.**

---

## 🔎 From Score to Explanation

The overall score is only the starting point.

Macroscope lets users move down through the analytical hierarchy:

**Economy Health**
↓
**Economic Categories**
↓
**Individual Indicators**
↓
**Underlying Economic Observations**

This makes the score more interpretable and helps identify the economic signals contributing to changes in overall health.

---

# 🎯 Why This Approach?

Economic indicators operate on completely different scales.

GDP growth, unemployment, inflation, trade, interest rates, and market capitalization cannot meaningfully be combined using their raw values.

Macroscope solves this through:

**Normalization** → makes different indicators comparable.

**Directionality** → accounts for whether higher, lower, or middle-range values are preferable.

**Categorization** → groups related signals into meaningful economic dimensions.

**Aggregation** → converts those dimensions into a single interpretable health signal.

The philosophy is simple:

> **Don't simplify the economy. Simplify the way we see it.**

---

## ⚙️ Built With

**Next.js** · **React** · **TypeScript**
**Tailwind CSS** · **Recharts** · **Lucide React**
**World Bank Open Data** · **Vercel**

A modern web stack, structured economic data, custom mathematical scoring, and interactive visualization working together as one analytical system.

---

## 🚀 Explore Macroscope

**Live:** [macroscope-alpha.vercel.app](https://macroscope-alpha.vercel.app/)

**Code:** [github.com/hameem-codes/Macroscope](https://github.com/hameem-codes/Macroscope)

---

## 👤 Author

**Hameem**

[GitHub](https://github.com/hameem-codes)

---

<p align="center">
  <strong>Macroscope 🔭</strong><br>
  <sub>See the bigger economic picture.</sub>
</p>

