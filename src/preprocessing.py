"""
preprocessing.py  Data Preprocessing & Feature Engineering Pipeline

This module provides reusable functions for the Attrition Prediction project:
- Data loading & cleaning
- Categorical encoding (OneHot + Label)
- Feature engineering (composite & ratio features)
- Feature scaling (StandardScaler)
- Class imbalance handling (SMOTE)
- Full pipeline builder
"""

import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.feature_selection import mutual_info_classif
from sklearn.ensemble import RandomForestClassifier
from imblearn.over_sampling import SMOTE
from statsmodels.stats.outliers_influence import variance_inflation_factor
from boruta import BorutaPy
import warnings
warnings.filterwarnings('ignore')


# 
# 1. DATA LOADING & CLEANING
# 

def load_data(filepath: str) -> pd.DataFrame:
    """
    Load the IBM HR Attrition CSV and drop irrelevant constant columns.
    
    Parameters
    ----------
    filepath : str
        Path to the CSV file.
    
    Returns
    -------
    pd.DataFrame
        Cleaned DataFrame with useless columns removed.
    """
    df = pd.read_csv(filepath)
    
    # These columns have a single unique value  no predictive power
    drop_cols = ['EmployeeNumber', 'Over18', 'StandardHours', 'EmployeeCount']
    existing_drops = [c for c in drop_cols if c in df.columns]
    df.drop(columns=existing_drops, inplace=True)
    
    return df


# 
# 2. ENCODE TARGET VARIABLE
# 

def encode_target(df: pd.DataFrame, target_col: str = 'Attrition') -> pd.DataFrame:
    """
    Convert target column from Yes/No to 1/0.
    """
    df = df.copy()
    df[target_col] = df[target_col].map({'Yes': 1, 'No': 0})
    return df


# 
# 3. CATEGORICAL ENCODING
# 

def encode_features(df: pd.DataFrame) -> pd.DataFrame:
    """
    Encode categorical features:
    - LabelEncoding for ordinal: BusinessTravel
    - OneHotEncoding for nominal: Department, EducationField, 
      Gender, JobRole, MaritalStatus
    
    Returns
    -------
    pd.DataFrame
        DataFrame with all categorical columns encoded.
    """
    df = df.copy()
    
    # --- Ordinal: BusinessTravel ---
    travel_map = {
        'Non-Travel': 0,
        'Travel_Rarely': 1,
        'Travel_Frequently': 2
    }
    if 'BusinessTravel' in df.columns:
        df['BusinessTravel'] = df['BusinessTravel'].map(travel_map)
    
    # --- Nominal: OneHotEncoding ---
    nominal_cols = ['Department', 'EducationField', 'Gender', 'JobRole', 'MaritalStatus']
    existing_nominal = [c for c in nominal_cols if c in df.columns]
    
    df = pd.get_dummies(df, columns=existing_nominal, drop_first=True, dtype=int)
    
    return df


# 
# 4. FEATURE ENGINEERING
# 

def create_features(df: pd.DataFrame) -> pd.DataFrame:
    """
    Create intermediate-level engineered features:
    
    - Income_per_Age: Monthly income relative to age (compensation fairness proxy)
    - Years_per_Promotion: Avg years between promotions (career growth speed)
    - Satisfaction_Score: Composite of JobSatisfaction, EnvironmentSatisfaction, 
      RelationshipSatisfaction (overall happiness index)
    - Overtime_Flag: Binary encoding of OverTime column
    - TotalSatisfaction: Sum of all satisfaction-related columns
    - Experience_Company_Ratio: Proportion of total career spent at this company
    """
    df = df.copy()
    
    # Income relative to age  are they paid fairly for their experience?
    if 'MonthlyIncome' in df.columns and 'Age' in df.columns:
        # Safety: avoid division by zero or negative age
        safe_age = df['Age'].apply(lambda x: max(x, 1))
        df['Income_per_Age'] = df['MonthlyIncome'] / safe_age
    
    # Career velocity  fewer years per promotion = faster growth
    if 'YearsSinceLastPromotion' in df.columns and 'YearsAtCompany' in df.columns:
        df['Years_per_Promotion'] = df['YearsSinceLastPromotion'] / (df['YearsAtCompany'] + 1)
    
    # Composite satisfaction score
    sat_cols = ['JobSatisfaction', 'EnvironmentSatisfaction', 'RelationshipSatisfaction']
    existing_sat = [c for c in sat_cols if c in df.columns]
    if existing_sat:
        df['Satisfaction_Score'] = df[existing_sat].mean(axis=1)
        df['TotalSatisfaction'] = df[existing_sat].sum(axis=1)
    
    # Binary overtime flag
    if 'OverTime' in df.columns:
        df['Overtime_Flag'] = (df['OverTime'] == 'Yes').astype(int)
        df.drop(columns=['OverTime'], inplace=True)
    
    # What proportion of their career has been at this company?
    if 'TotalWorkingYears' in df.columns and 'YearsAtCompany' in df.columns:
        df['Experience_Company_Ratio'] = df['YearsAtCompany'] / (df['TotalWorkingYears'] + 1)
    
    return df


# 
# 5. FEATURE SCALING
# 

def scale_features(X_train: pd.DataFrame, X_test: pd.DataFrame):
    """
    Apply StandardScaler to all numeric features.
    Fitted on training data only to prevent data leakage.
    
    Returns
    -------
    tuple
        (X_train_scaled, X_test_scaled, scaler)
    """
    scaler = StandardScaler()
    
    feature_names = X_train.columns.tolist()
    
    X_train_scaled = pd.DataFrame(
        scaler.fit_transform(X_train), 
        columns=feature_names, 
        index=X_train.index
    )
    X_test_scaled = pd.DataFrame(
        scaler.transform(X_test), 
        columns=feature_names, 
        index=X_test.index
    )
    
    return X_train_scaled, X_test_scaled, scaler


# 
# 6. HANDLE CLASS IMBALANCE (SMOTE)
# 

def handle_imbalance(X_train: pd.DataFrame, y_train: pd.Series, 
                     random_state: int = 42):
    """
    Apply SMOTE to oversample the minority class (Attrition=Yes).
    Only applied to the training set to avoid data leakage.
    
    Returns
    -------
    tuple
        (X_train_resampled, y_train_resampled)
    """
    smote = SMOTE(random_state=random_state)
    X_resampled, y_resampled = smote.fit_resample(X_train, y_train)
    
    print(f"Before SMOTE: {dict(y_train.value_counts())}")
    print(f"After SMOTE:  {{0: {(y_resampled == 0).sum()}, 1: {(y_resampled == 1).sum()}}}")
    
    return X_resampled, y_resampled


# 
# 7. HYBRID FEATURE SELECTION
# 

def select_features(X_train: pd.DataFrame, y_train: pd.Series, top_n: int = 20, random_state: int = 42):
    """
    Select features using a Smart Hybrid approach:
    1. Filter: Drop features with correlation < 0.05 to the target.
    2. Multicollinearity: Check VIF, drop features with VIF > 10.
    3. Wrapper (Boruta): Run Boruta to get statistically significant features.
    4. Finalize: Return top N features based on RF importance if > top_n.
    """
    print(f"\nPerforming Smart Hybrid Feature Selection...")
    
    # 1. Correlation Filter
    corr = X_train.corrwith(y_train).abs()
    valid_corr = corr[corr >= 0.05].index.tolist()
    X_filtered = X_train[valid_corr]
    print(f"1. Filtering by Correlation (> 0.05): {len(valid_corr)} features remain.")
    
    # 2. VIF for Multicollinearity
    print("2. Checking VIF (removing VIF > 10)...")
    vif_features = valid_corr.copy()
    while len(vif_features) > 0:
        vif_data = [variance_inflation_factor(X_filtered[vif_features].values, i) for i in range(len(vif_features))]
        max_vif = np.max(vif_data)
        if max_vif > 10:
            max_vif_idx = np.argmax(vif_data)
            vif_features.pop(max_vif_idx)
        else:
            break
            
    X_vif = X_filtered[vif_features]
    print(f"   Features remaining after VIF filter: {len(vif_features)}")
    
    # 3. Wrapper (Boruta)
    print("3. Running Boruta Feature Selection...")
    rf = RandomForestClassifier(n_jobs=-1, class_weight='balanced', max_depth=5, random_state=random_state)
    boruta_selector = BorutaPy(rf, n_estimators='auto', verbose=0, random_state=random_state)
    
    # Boruta expects numpy arrays
    import warnings
    with warnings.catch_warnings():
        # Hide internal boruta warnings if any
        boruta_selector.fit(X_vif.values, y_train.values)
    
    boruta_features = []
    for i, is_selected in enumerate(boruta_selector.support_):
        if is_selected:
            boruta_features.append(vif_features[i])
    for i, is_tentative in enumerate(boruta_selector.support_weak_):
        if is_tentative:
            boruta_features.append(vif_features[i])
            
    print(f"   Boruta selected {len(boruta_features)} features (Confirmed + Tentative).")
    
    # 4. Final List
    if len(boruta_features) > top_n:
        rf_final = RandomForestClassifier(random_state=random_state)
        rf_final.fit(X_train[boruta_features], y_train)
        importances = pd.Series(rf_final.feature_importances_, index=boruta_features)
        top_features = importances.sort_values(ascending=False).head(top_n).index.tolist()
    elif len(boruta_features) < 15:
        print(f"   Boruta selected {len(boruta_features)} features. Padding up to 15 features using RF importance.")
        rf_final = RandomForestClassifier(random_state=random_state)
        rf_final.fit(X_vif, y_train)
        importances = pd.Series(rf_final.feature_importances_, index=vif_features)
        
        # Keep boruta features, then add top RF features until we hit 15
        top_features = boruta_features.copy()
        remaining_sorted = importances.drop(labels=top_features, errors='ignore').sort_values(ascending=False)
        needed = 15 - len(top_features)
        top_features.extend(remaining_sorted.head(needed).index.tolist())
    else:
        top_features = boruta_features
        
    print(f"\nFinal Top {len(top_features)} Features selected:")
    for i, feat in enumerate(top_features[:min(5, len(top_features))]):
        print(f"  {i+1}. {feat}")
    
    return top_features


# 
# 8. FULL PIPELINE
# 

def build_pipeline(filepath: str, test_size: float = 0.2, 
                   random_state: int = 42, apply_smote: bool = True,
                   apply_scaling: bool = True, apply_selection: bool = True,
                   top_n_features: int = 20):
    """
    End-to-end preprocessing pipeline.
    
    Steps:
    1. Load & clean data
    2. Encode target variable
    3. Feature engineering
    4. Encode categorical features
    5. Train-test split
    6. Feature scaling (optional)
    7. Hybrid Feature Selection (optional)
    8. SMOTE oversampling on training data (optional)
    
    Parameters
    ----------
    filepath : str
        Path to the raw CSV file.
    test_size : float
        Proportion of data for testing.
    random_state : int
        Random seed for reproducibility.
    apply_smote : bool
        Whether to apply SMOTE oversampling.
    apply_scaling : bool
        Whether to apply StandardScaler.
    
    Returns
    -------
    dict
        Dictionary with keys: X_train, X_test, y_train, y_test, 
        scaler, feature_names
    """
    # Load & clean
    df = load_data(filepath)
    
    # Encode target
    df = encode_target(df)
    
    # Feature engineering (before encoding categoricals)
    df = create_features(df)
    
    # Encode categoricals
    df = encode_features(df)
    
    # Split features & target
    X = df.drop(columns=['Attrition'])
    y = df['Attrition']
    
    # Train-test split (stratified to preserve class distribution)
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=test_size, random_state=random_state, stratify=y
    )
    
    # Feature Selection 
    # (We temporarily scale just for selection if it's not already scaled)
    selected_features = X_train.columns.tolist()
    if apply_selection:
        # Temporary scaling for feature selection if needed
        X_train_temp, _, _ = scale_features(X_train, X_train)
        selected_features = select_features(X_train_temp, y_train, top_n=top_n_features, random_state=random_state)
        X_train = X_train[selected_features]
        X_test = X_test[selected_features]
        
    # Final Scaling on selected features
    scaler = None
    if apply_scaling:
        X_train, X_test, scaler = scale_features(X_train, X_test)
    
    # SMOTE
    if apply_smote:
        X_train, y_train = handle_imbalance(X_train, y_train, random_state)
    
    feature_names = X_train.columns.tolist()
    
    print(f"\nOK: Pipeline complete!")
    print(f"   Training samples: {len(X_train)} | Test samples: {len(X_test)}")
    print(f"   Features: {len(feature_names)}")
    
    return {
        'X_train': X_train,
        'X_test': X_test,
        'y_train': y_train,
        'y_test': y_test,
        'scaler': scaler,
        'feature_names': feature_names
    }
