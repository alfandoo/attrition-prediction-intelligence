---
title: Employee Attrition Intelligence
emoji: 🏢
colorFrom: blue
colorTo: indigo
sdk: docker
pinned: false
---

# 🏢 Enterprise HR Intelligence: Employee Attrition Prediction 💎🛡️

> A high-performance, end-to-end predictive analytics ecosystem designed to mitigate employee turnover through Machine Learning, Explainable AI (XAI), and Real-time MLOps monitoring.

[![Python](https://img.shields.io/badge/Python-3.9+-blue?style=for-the-badge&logo=python)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-009688?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![Docker](https://img.shields.io/badge/Docker-Enabled-2496ED?style=for-the-badge&logo=docker)](https://www.docker.com/)

---

## 🏛️ Project Methodology: CRISP-DM Framework

This project follows the **CRISP-DM** (CRoss Industry Standard Process for Data Mining) methodology to ensure data-driven decisions translate into measurable business value.

### 📊 1. Business Understanding
*   **The Problem**: High employee attrition causes significant financial strain, with replacement costs ranging from **$15,000 to $30,000 per employee** (recruitment, onboarding, productivity loss).
*   **Objective**: Develop a "Predictive Empathy" system—identifying high-risk employees before they resign to allow for proactive HR intervention.
*   **Success Metric**: **Recall (Target > 70%)**. In retention, the cost of a "False Negative" (missing an employee who leaves) is far higher than a "False Positive" (interviewing someone who stays).

### 🔍 2. Data Understanding
*   **Source**: IBM HR Analytics Dataset (1,470 employees, 35 attributes).
*   **Key Exploratory Findings**:
    *   **Burnout Indicator**: Employees with consistent **Overtime** have a **3.2x higher** risk of attrition.
    *   **The Tenure "Danger Zone"**: Peak turnover occurs during the **first 0-3 years**, suggesting a need for better early-stage cultural integration.
    *   **Income Alignment**: Attrition is strongly correlated with **Salary Disparity** relative to industry standards for specific roles like *Laboratory Technicians*.

### 🧪 3. Data Preparation
*   **Synthetic Feature Engineering**: Developed advanced features to capture hidden signals:
    *   `Income_per_Age`: Proxy for perceived financial success.
    *   `Years_per_Promotion`: Measure of career stagnation.
    *   `Satisfaction_Score`: Aggregated sentiment across environment, relationships, and job roles.
*   **Class Imbalance Handling**: Applied **SMOTE** (Synthetic Minority Over-sampling Technique) to ensure the model learns effectively from high-churn patterns.
*   **Feature Selection**: Implemented a **Hybrid Selection Pipeline** using **Boruta** (all-relevant selection) and **Recursive Feature Elimination (RFE)** to isolate the most impactful variables.

### 🤖 4. Modeling & Science
*   **Algorithm**: **Logistic Regression (Fine-Tuned)**. Selected for its high transparency and reliability in enterprise settings.
*   **Optimization**: Used **Optuna** for Bayesian hyperparameter tuning, specifically optimizing for the **F1-Score/Recall** tradeoff.
*   **Explainable AI (XAI)**: Integrated **SHAP (SHapley Additive exPlanations)** to transform "black-box" predictions into actionable insights. Every prediction comes with a visual breakdown of *why* an employee is at risk.

### 📈 5. Evaluation & Validation
*   **Performance Metrics**:
    *   **ROC-AUC**: **0.8246**, indicating robust discriminative power.
    *   **Recall**: **0.70**, successfully identifying 7 out of 10 employees who actually left.
*   **Business Validation**: The model effectively segments the workforce into risk tiers (Low, Medium, High), allowing HR to prioritize high-value assets.

### 🚀 6. Deployment & MLOps
*   **Backend Architecture**: **FastAPI** provides a high-performance, asynchronous interface for real-time inference.
*   **Frontend Ecosystem**: **React.js** with a premium *Glassmorphism* dashboard, providing stakeholders with an executive-level summary of organizational health.
*   **System Integrity**: 
    *   **ML Monitoring**: Real-time tracking of **Prediction Drift** and **Feature Drift (PSI)**.
    *   **Hardware Telemetry**: Integrated `psutil` to monitor server latency and resource utilization.

---

## 🚀 Key Differentiators

| Feature | Description |
| :--- | :--- |
| **Executive Dashboard** | Premium state-of-the-art UI for HR stakeholders to visualize workforce stability. |
| **XAI SHAP Reports** | Individualized risk factor analysis—no more "guesswork" in retention. |
| **Scenario Simulator** | A "What-If" tool to test how salary changes or overtime reduction affects risk. |
| **Automated Pipeline** | Fully Dockerized environment for consistent deployment across staging and production. |

---

## 🛠️ Strategic Business Recommendations

Based on empirical data and model findings, the following interventions are recommended:
1.  **Retention Alert Systems**: Trigger mandatory 1-on-1s when an employee crosses the **15% Overtime Threshold** for two consecutive months.
2.  **Market Calibration**: Perform semi-annual salary audits for *Sales Executives* and *Lab Technicians* to address the income disparity drivers.
3.  **Tenure Support**: Enhance the **12-month Mentorship Program** specifically for employees in years 1-3 to bridge the "Danger Zone" gap.

---

## 🎯 Conclusion

This project demonstrates that employee attrition is not a random occurrence but a pattern-driven phenomenon that can be managed with high precision. By leveraging **Explainable AI (SHAP)** alongside a robust **CRISP-DM** workflow, we transition HR from a "reactive" stance to a **"predictive" strategic partner**. 

The system's ability to achieve a **70% Recall rate** ensures that the majority of attrition risks are addressed before they impact the bottom line, potentially saving the organization hundreds of thousands of dollars in annual turnover costs. This repository serves as a blueprint for enterprise-grade ML applications where transparency, business ROI, and MLOps integrity are non-negotiable.

---

## 💻 Setup & Installation

### 1. Backend & ML Environment
```bash
python -m venv venv
source venv/Scripts/activate # or venv\Scripts\activate on Windows
pip install -r requirements.txt
python app/app.py
```

### 2. Frontend Dashboard
```bash
cd frontend
npm install
npm run dev
```

---
<p align="center">
  <b>Designed & Built by Alfando — Attrition Prediction Intelligence</b>
</p>
