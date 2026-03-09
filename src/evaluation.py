"""
evaluation.py  Model Evaluation & Comparison

This module provides functions for intermediate-level model evaluation:
- Classification report as DataFrame
- Confusion matrix visualization
- ROC curve plotting
- Multi-model comparison charts
- Focus on Recall (minimize False Negatives for HR use case)
"""

import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.metrics import (
    classification_report, confusion_matrix, 
    roc_curve, auc, recall_score, f1_score, 
    precision_score, accuracy_score, roc_auc_score
)
import warnings
warnings.filterwarnings('ignore')

# Plot style
plt.style.use('seaborn-v0_8-whitegrid')
sns.set_palette("husl")


# 
# 1. CLASSIFICATION REPORT
# 

def classification_report_df(y_true, y_pred, model_name: str = "Model"):
    """
    Generate a classification report as a pandas DataFrame.
    
    Returns
    -------
    pd.DataFrame
        Classification report with precision, recall, f1-score.
    """
    report = classification_report(y_true, y_pred, output_dict=True)
    df = pd.DataFrame(report).transpose()
    df['model'] = model_name
    return df


def get_metrics(y_true, y_pred, y_proba=None) -> dict:
    """
    Calculate key classification metrics.
    
    Returns
    -------
    dict
        Dictionary with accuracy, precision, recall, f1, and roc_auc.
    """
    metrics = {
        'Accuracy': accuracy_score(y_true, y_pred),
        'Precision': precision_score(y_true, y_pred),
        'Recall': recall_score(y_true, y_pred),
        'F1-Score': f1_score(y_true, y_pred),
    }
    if y_proba is not None:
        metrics['ROC-AUC'] = roc_auc_score(y_true, y_proba)
    
    return metrics


# 
# 2. CONFUSION MATRIX
# 

def plot_confusion_matrix(y_true, y_pred, model_name: str = "Model",
                          figsize=(7, 5), save_path=None):
    """
    Plot an annotated confusion matrix heatmap.
    
    Highlights:
    - True Negative (top-left): Correctly predicted Stay
    - False Positive (top-right): Predicted Leave but actually Stay
    - False Negative (bottom-left): Predicted Stay but actually Leave 
    - True Positive (bottom-right): Correctly predicted Leave
    """
    cm = confusion_matrix(y_true, y_pred)
    
    fig, ax = plt.subplots(figsize=figsize)
    
    labels = ['Stay (0)', 'Leave (1)']
    sns.heatmap(cm, annot=True, fmt='d', cmap='Blues',
                xticklabels=labels, yticklabels=labels,
                annot_kws={'size': 14}, ax=ax)
    
    ax.set_xlabel('Predicted', fontsize=12, fontweight='bold')
    ax.set_ylabel('Actual', fontsize=12, fontweight='bold')
    ax.set_title(f'Confusion Matrix  {model_name}', fontsize=14, fontweight='bold')
    
    # Add FN warning annotation
    fn = cm[1][0]
    ax.text(0.5, -0.15, f" False Negatives (missed resignations): {fn}", 
            transform=ax.transAxes, fontsize=10, ha='center', color='red')
    
    plt.tight_layout()
    
    if save_path:
        plt.savefig(save_path, dpi=150, bbox_inches='tight')
        print(f" Confusion matrix saved to: {save_path}")
    
    plt.show()
    return cm


# 
# 3. ROC CURVE
# 

def plot_roc_curve(y_true, y_proba, model_name: str = "Model",
                   figsize=(7, 5), save_path=None):
    """
    Plot the ROC curve with AUC score annotation.
    """
    fpr, tpr, thresholds = roc_curve(y_true, y_proba)
    roc_auc = auc(fpr, tpr)
    
    fig, ax = plt.subplots(figsize=figsize)
    
    ax.plot(fpr, tpr, color='#2196F3', lw=2.5, 
            label=f'{model_name} (AUC = {roc_auc:.3f})')
    ax.plot([0, 1], [0, 1], color='gray', lw=1.5, linestyle='--', 
            label='Random Classifier')
    
    ax.fill_between(fpr, tpr, alpha=0.15, color='#2196F3')
    
    ax.set_xlabel('False Positive Rate', fontsize=12)
    ax.set_ylabel('True Positive Rate (Recall)', fontsize=12)
    ax.set_title(f'ROC Curve  {model_name}', fontsize=14, fontweight='bold')
    ax.legend(loc='lower right', fontsize=11)
    ax.grid(True, alpha=0.3)
    
    plt.tight_layout()
    
    if save_path:
        plt.savefig(save_path, dpi=150, bbox_inches='tight')
        print(f" ROC curve saved to: {save_path}")
    
    plt.show()
    return roc_auc


# 
# 4. MULTI-MODEL ROC COMPARISON
# 

def plot_roc_comparison(y_true, model_probas: dict, 
                        figsize=(8, 6), save_path=None):
    """
    Plot ROC curves for multiple models on the same chart.
    
    Parameters
    ----------
    y_true : array-like
        True labels.
    model_probas : dict
        {model_name: y_proba_array}
    """
    fig, ax = plt.subplots(figsize=figsize)
    
    colors = ['#2196F3', '#FF5722', '#4CAF50', '#9C27B0', '#FF9800']
    
    for i, (name, y_proba) in enumerate(model_probas.items()):
        fpr, tpr, _ = roc_curve(y_true, y_proba)
        roc_auc = auc(fpr, tpr)
        color = colors[i % len(colors)]
        ax.plot(fpr, tpr, color=color, lw=2.5, 
                label=f'{name} (AUC = {roc_auc:.3f})')
    
    ax.plot([0, 1], [0, 1], color='gray', lw=1.5, linestyle='--', 
            label='Random Classifier')
    
    ax.set_xlabel('False Positive Rate', fontsize=12)
    ax.set_ylabel('True Positive Rate (Recall)', fontsize=12)
    ax.set_title('ROC Curve Comparison  All Models', fontsize=14, fontweight='bold')
    ax.legend(loc='lower right', fontsize=10)
    ax.grid(True, alpha=0.3)
    
    plt.tight_layout()
    
    if save_path:
        plt.savefig(save_path, dpi=150, bbox_inches='tight')
        print(f" ROC comparison saved to: {save_path}")
    
    plt.show()


# 
# 5. MODEL COMPARISON BAR CHART
# 

def compare_models(y_true, model_predictions: dict, model_probas: dict = None,
                   figsize=(12, 5), save_path=None):
    """
    Create a side-by-side bar chart comparing metrics across models.
    
    Parameters
    ----------
    y_true : array-like
        True labels.
    model_predictions : dict
        {model_name: y_pred_array}
    model_probas : dict, optional
        {model_name: y_proba_array} for ROC-AUC calculation.
    """
    results = []
    
    for name, y_pred in model_predictions.items():
        y_proba = model_probas.get(name) if model_probas else None
        metrics = get_metrics(y_true, y_pred, y_proba)
        metrics['Model'] = name
        results.append(metrics)
    
    df = pd.DataFrame(results)
    
    # Melt for plotting
    metric_cols = [c for c in df.columns if c != 'Model']
    df_melted = df.melt(id_vars='Model', value_vars=metric_cols,
                        var_name='Metric', value_name='Score')
    
    fig, ax = plt.subplots(figsize=figsize)
    
    x = np.arange(len(metric_cols))
    width = 0.25
    n_models = len(model_predictions)
    
    colors = ['#2196F3', '#FF5722', '#4CAF50', '#9C27B0']
    
    for i, model_name in enumerate(model_predictions.keys()):
        model_scores = df[df['Model'] == model_name][metric_cols].values[0]
        offset = (i - n_models/2 + 0.5) * width
        bars = ax.bar(x + offset, model_scores, width, 
                      label=model_name, color=colors[i % len(colors)], alpha=0.85)
        
        # Add value labels on bars
        for bar, score in zip(bars, model_scores):
            ax.text(bar.get_x() + bar.get_width()/2., bar.get_height() + 0.01,
                    f'{score:.3f}', ha='center', va='bottom', fontsize=8, fontweight='bold')
    
    ax.set_xticks(x)
    ax.set_xticklabels(metric_cols, fontsize=11)
    ax.set_ylabel('Score', fontsize=12)
    ax.set_title('Model Performance Comparison', fontsize=14, fontweight='bold')
    ax.legend(fontsize=10)
    ax.set_ylim(0, 1.15)
    ax.grid(axis='y', alpha=0.3)
    
    plt.tight_layout()
    
    if save_path:
        plt.savefig(save_path, dpi=150, bbox_inches='tight')
        print(f" Comparison chart saved to: {save_path}")
    
    plt.show()
    
    # Print summary table
    print("\n Model Comparison Summary:")
    print("=" * 60)
    summary = df.set_index('Model')
    print(summary.round(4).to_string())
    print("=" * 60)
    
    # Highlight best model for Recall
    best_recall_model = df.loc[df['Recall'].idxmax(), 'Model']
    print(f"\n Best Recall: {best_recall_model} ({df['Recall'].max():.4f})")
    
    return df
