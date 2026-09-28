# Attrition Prediction Intelligence

An end-to-end machine learning application for exploring and predicting employee attrition using the IBM HR Analytics dataset.

The project covers the full workflow from **data analysis and feature engineering to model training, explainability, API serving, dashboard development, and basic model monitoring**.

**Live Demo:** [Hugging Face Spaces](https://huggingface.co/spaces/alfando/attrition-prediction-intelligence)

---

## Overview

Employee attrition is treated as a binary classification problem:

- **0 — Stay**
- **1 — Leave**

The main modeling goal is to identify employees with higher attrition risk while keeping the model interpretable enough to understand which factors contribute to each prediction.

The project uses **Recall** as an important evaluation metric because false negatives represent employees who leave but are classified as likely to stay.

---

## What This Project Covers

```text
Raw HR Data
    ↓
Data Cleaning & Feature Engineering
    ↓
Train / Test Preparation
    ↓
Model Comparison
    ├── Logistic Regression
    ├── Random Forest
    └── XGBoost
    ↓
Hyperparameter Tuning
    ↓
Model Evaluation
    ↓
SHAP Explanation
    ↓
FastAPI Inference API
    ↓
React Dashboard
    ↓
Prediction & Feature Monitoring
```

---

## Dataset

This project uses the **IBM HR Analytics Employee Attrition & Performance** dataset.

- **1,470 employees**
- **35 original attributes**
- Binary target: `Attrition`
- The dataset is imbalanced, with significantly fewer attrition cases than non-attrition cases.

Features include employee information related to:

- Age
- Monthly income
- Total working years
- Years at company
- Overtime
- Job satisfaction
- Work-life balance
- Distance from home
- Stock option level
- Years with current manager

---

## Data Preparation

The preprocessing pipeline includes data cleaning, encoding, scaling, and feature engineering.

Examples of engineered features used in the project include:

- `Income_per_Age`
- `TotalSatisfaction`
- `Overtime_Flag`
- `Experience_Company_Ratio`
- `Years_per_Promotion`

The project also handles class imbalance during model development and uses feature selection before final model training.

---

## Modeling

Three classification algorithms are implemented:

| Model | Purpose |
| --- | --- |
| Logistic Regression | Interpretable baseline and final deployed model |
| Random Forest | Non-linear tree-based comparison |
| XGBoost | Gradient-boosting comparison |

Hyperparameter optimization is implemented with **Optuna** and stratified 5-fold cross-validation.

The tuning pipeline can optimize metrics such as Recall depending on the modeling objective.

---

## Model Evaluation

The project evaluates models using:

- Accuracy
- Precision
- Recall
- F1-score
- ROC-AUC
- Confusion Matrix
- ROC Curve

### Deployed model

The current application uses a tuned **Logistic Regression** model.

During model-selection experiments, the tuned Logistic Regression recorded a cross-validation ROC-AUC of approximately **0.8246**.

The stored held-out evaluation artifact reports:

| Metric | Result |
| --- | ---: |
| ROC-AUC | **0.7744** |
| Attrition Recall | **0.7021** |
| Attrition Precision | **0.3084** |
| Attrition F1-score | **0.4286** |
| Accuracy | **0.7007** |

### Confusion Matrix

| | Predicted Stay | Predicted Leave |
| --- | ---: | ---: |
| Actual Stay | 173 | 74 |
| Actual Leave | 14 | 33 |

The model identifies approximately **70% of employees who left** in the held-out evaluation set.

The relatively lower precision reflects the trade-off of prioritizing recall in an imbalanced attrition problem.

---

## Explainable Predictions

Predictions are accompanied by **SHAP-based feature explanations**.

Instead of returning only an attrition probability, the application identifies factors that contributed most strongly to the prediction.

Examples of influential features in the saved evaluation artifact include:

- Total Working Years
- Years at Company
- Overtime
- Stock Option Level
- Satisfaction
- Years with Current Manager
- Age

This allows users to inspect why a specific employee received a higher or lower predicted attrition risk.

---

## Application

The trained model is exposed through a **FastAPI** backend and consumed by a **React** dashboard.

### Prediction flow

```text
User Input
    ↓
React Dashboard
    ↓
FastAPI /api/predict
    ↓
Preprocessing Pipeline
    ↓
Logistic Regression
    ↓
Attrition Probability
    ↓
SHAP Explanation
    ↓
Risk Factors & Recommendations
```

The API accepts employee information such as income, age, work experience, tenure, overtime, job satisfaction, and work-life balance.

---

## Dashboard

The frontend is built with:

- React 19
- Vite
- Recharts
- Lucide React

The dashboard provides views for:

- Employee attrition prediction
- Attrition probability
- Risk factors
- Model comparison
- Exploratory data analysis
- Monitoring information

---

## Monitoring

Each prediction request records selected serving information including:

- Timestamp
- Prediction probability
- Prediction class
- Inference latency
- Monthly income
- Age
- Overtime

The monitoring endpoint uses these logs to provide basic indicators for:

### Prediction distribution

Compares the proportion of predicted attrition and non-attrition cases.

### Feature drift

Tracks changes in selected serving features:

- Monthly Income
- Age
- Overtime

### System telemetry

Uses `psutil` to expose CPU and memory usage.

This monitoring implementation is intended as a portfolio demonstration of serving-time observability rather than a full production MLOps platform.

---

## Tech Stack

### Machine Learning

- Python
- Pandas
- NumPy
- Scikit-learn
- XGBoost
- Optuna
- SHAP

### Backend

- FastAPI
- Uvicorn
- Pydantic

### Frontend

- React 19
- Vite
- Recharts

### Engineering

- Docker
- Docker Compose
- Joblib
- Pytest
- Hugging Face Spaces

---

## Project Structure

```text
attrition-prediction-intelligence/
│
├── app/
│   ├── app.py
│   └── utils.py
│
├── data/
│
├── frontend/
│   └── React + Vite application
│
├── models/
│   └── trained model and evaluation artifacts
│
├── notebooks/
│   └── experimentation and analysis
│
├── src/
│   ├── preprocessing.py
│   ├── modeling.py
│   └── evaluation.py
│
├── tests/
│   └── test_pipeline.py
│
├── Dockerfile
├── docker-compose.yml
├── requirements.txt
└── README.md
```

---

## Testing

The repository includes tests for key ML pipeline behavior, including:

- Risk-level mapping
- Input preprocessing
- Expected feature structure

Run the tests with:

```bash
pytest
```

---
## Key Takeaways

This project demonstrates an end-to-end ML workflow beyond model training:

- Structuring a classification problem around a business objective
- Handling imbalanced data
- Comparing multiple machine learning models
- Hyperparameter tuning with cross-validation
- Evaluating classification trade-offs
- Explaining individual predictions with SHAP
- Serving a model through FastAPI
- Building a React interface around the model
- Recording inference activity for basic monitoring
- Packaging and deploying the application with Docker

---

## Limitations

- The IBM HR dataset is small and intended primarily for analytics and learning use cases.
- Predictions should not be interpreted as real HR decisions.
- The monitoring implementation uses local prediction logs and simple baseline comparisons rather than a dedicated production monitoring platform.
- The probability transformation used by the application is designed for the interface and should not be treated as formally calibrated probability without additional calibration validation.

---

## Author

**Alfando**

Junior Data Scientist · AI/ML Engineer · Software Engineer
