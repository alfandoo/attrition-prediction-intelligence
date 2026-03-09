"""
modeling.py  Model Training & Hyperparameter Tuning

This module provides functions to train and tune classification models
for the Attrition Prediction project:
- Logistic Regression (baseline)
- Random Forest
- XGBoost
- Optuna-based hyperparameter tuning
- Model persistence (save/load)
"""

import numpy as np
import pandas as pd
import joblib
import optuna
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from xgboost import XGBClassifier
from sklearn.model_selection import cross_val_score, StratifiedKFold
import warnings
warnings.filterwarnings('ignore')

# Suppress Optuna logs for cleaner output
optuna.logging.set_verbosity(optuna.logging.WARNING)


# 
# 1. MODEL TRAINING FUNCTIONS
# 

def train_logistic_regression(X_train, y_train, random_state=42):
    """
    Train a baseline Logistic Regression model.
    Uses L2 regularization with balanced class weights.
    """
    model = LogisticRegression(
        max_iter=1000,
        class_weight='balanced',
        random_state=random_state,
        solver='lbfgs'
    )
    model.fit(X_train, y_train)
    print("DONE: Logistic Regression trained successfully.")
    return model


def train_random_forest(X_train, y_train, random_state=42, **kwargs):
    """
    Train a Random Forest classifier with sensible defaults.
    """
    params = {
        'n_estimators': 200,
        'max_depth': 10,
        'min_samples_split': 5,
        'min_samples_leaf': 2,
        'class_weight': 'balanced',
        'random_state': random_state,
        'n_jobs': -1
    }
    params.update(kwargs)
    
    model = RandomForestClassifier(**params)
    model.fit(X_train, y_train)
    print("DONE: Random Forest trained successfully.")
    return model


def train_xgboost(X_train, y_train, random_state=42, **kwargs):
    """
    Train an XGBoost classifier.
    Automatically calculates scale_pos_weight for imbalanced data.
    """
    # Calculate class imbalance ratio
    neg_count = (y_train == 0).sum()
    pos_count = (y_train == 1).sum()
    scale_pos_weight = neg_count / pos_count if pos_count > 0 else 1
    
    params = {
        'n_estimators': 200,
        'max_depth': 6,
        'learning_rate': 0.1,
        'subsample': 0.8,
        'colsample_bytree': 0.8,
        'scale_pos_weight': scale_pos_weight,
        'random_state': random_state,
        'eval_metric': 'logloss',
        'use_label_encoder': False
    }
    params.update(kwargs)
    
    model = XGBClassifier(**params)
    model.fit(X_train, y_train)
    print("DONE: XGBoost trained successfully.")
    return model


# 
# 2. HYPERPARAMETER TUNING WITH OPTUNA
# 

def tune_with_optuna(model_type: str, X_train, y_train, 
                     n_trials: int = 50, random_state: int = 42,
                     scoring: str = 'recall'):
    """
    Perform hyperparameter tuning using Optuna with cross-validation.
    
    Parameters
    ----------
    model_type : str
        One of 'logistic_regression', 'random_forest' or 'xgboost'.
    X_train : array-like
        Training features.
    y_train : array-like
        Training labels.
    n_trials : int
        Number of Optuna trials.
    random_state : int
        Random seed.
    scoring : str
        Scoring metric to optimize (default: 'recall' for attrition).
    
    Returns
    -------
    dict
        {'best_params': dict, 'best_score': float, 'model': fitted_model}
    """
    cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=random_state)
    
    def objective(trial):
        if model_type == 'random_forest':
            params = {
                'n_estimators': trial.suggest_int('n_estimators', 100, 500),
                'max_depth': trial.suggest_int('max_depth', 3, 20),
                'min_samples_split': trial.suggest_int('min_samples_split', 2, 20),
                'min_samples_leaf': trial.suggest_int('min_samples_leaf', 1, 10),
                'max_features': trial.suggest_categorical('max_features', ['sqrt', 'log2', None]),
                'class_weight': 'balanced',
                'random_state': random_state,
                'n_jobs': -1
            }
            model = RandomForestClassifier(**params)
            
        elif model_type == 'logistic_regression':
            params = {
                'C': trial.suggest_float('C', 1e-4, 1e2, log=True),
                'solver': trial.suggest_categorical('solver', ['lbfgs', 'liblinear']),
                'max_iter': trial.suggest_int('max_iter', 100, 2000),
                'class_weight': 'balanced',
                'random_state': random_state
            }
            if params['solver'] == 'liblinear':
                params['penalty'] = trial.suggest_categorical('penalty', ['l1', 'l2'])
            else:
                params['penalty'] = 'l2'
                
            model = LogisticRegression(**params)
            
        elif model_type == 'xgboost':
            params = {
                'n_estimators': trial.suggest_int('n_estimators', 100, 500),
                'max_depth': trial.suggest_int('max_depth', 3, 12),
                'learning_rate': trial.suggest_float('learning_rate', 0.01, 0.3, log=True),
                'subsample': trial.suggest_float('subsample', 0.6, 1.0),
                'colsample_bytree': trial.suggest_float('colsample_bytree', 0.6, 1.0),
                'reg_alpha': trial.suggest_float('reg_alpha', 1e-8, 10.0, log=True),
                'reg_lambda': trial.suggest_float('reg_lambda', 1e-8, 10.0, log=True),
                'min_child_weight': trial.suggest_int('min_child_weight', 1, 10),
                'random_state': random_state,
                'eval_metric': 'logloss',
                'use_label_encoder': False
            }
            model = XGBClassifier(**params)
        else:
            raise ValueError(f"Unsupported model_type: {model_type}")
        
        scores = cross_val_score(model, X_train, y_train, cv=cv, 
                                  scoring=scoring, n_jobs=-1)
        return scores.mean()
    
    # Run optimization
    study = optuna.create_study(direction='maximize')
    study.optimize(objective, n_trials=n_trials, show_progress_bar=True)
    
    best_params = study.best_params
    best_score = study.best_value
    
    print(f"\n[BEST] {scoring} score: {best_score:.4f}")
    print(f"PARAMS: Best parameters: {best_params}")
    
    # Train final model with best parameters
    if model_type == 'random_forest':
        best_params['class_weight'] = 'balanced'
        best_params['random_state'] = random_state
        best_params['n_jobs'] = -1
        best_model = RandomForestClassifier(**best_params)
    elif model_type == 'logistic_regression':
        best_params['class_weight'] = 'balanced'
        best_params['random_state'] = random_state
        best_model = LogisticRegression(**best_params)
    else:
        best_params['random_state'] = random_state
        best_params['eval_metric'] = 'logloss'
        best_params['use_label_encoder'] = False
        best_model = XGBClassifier(**best_params)
    
    best_model.fit(X_train, y_train)
    
    return {
        'best_params': best_params,
        'best_score': best_score,
        'model': best_model,
        'study': study
    }


# 
# 3. MODEL PERSISTENCE
# 

def save_model(model, filepath: str):
    """Save a trained model to disk using joblib."""
    joblib.dump(model, filepath)
    print(f" Model saved to: {filepath}")


def load_model(filepath: str):
    """Load a trained model from disk."""
    model = joblib.load(filepath)
    print(f" Model loaded from: {filepath}")
    return model


# 
# 4. QUICK COMPARISON
# 

def train_all_models(X_train, y_train, random_state=42):
    """
    Train all three models and return them in a dictionary.
    
    Returns
    -------
    dict
        {'Logistic Regression': model, 'Random Forest': model, 'XGBoost': model}
    """
    models = {}
    
    print("=" * 50)
    print("Training all models...")
    print("=" * 50)
    
    models['Logistic Regression'] = train_logistic_regression(X_train, y_train, random_state)
    models['Random Forest'] = train_random_forest(X_train, y_train, random_state)
    models['XGBoost'] = train_xgboost(X_train, y_train, random_state)
    
    print("\nDONE: All models trained!")
    return models
