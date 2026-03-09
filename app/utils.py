"""
utils.py  Helper functions for the Streamlit dashboard.

Handles model loading, input preprocessing, and SHAP explanations.
"""

import pandas as pd
import numpy as np
import joblib
import json
import shap
import os


def get_model_path(filename: str) -> str:
    """Get absolute path to model files."""
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    return os.path.join(base_dir, 'models', filename)


def load_model():
    """Load the trained model from disk."""
    model_path = get_model_path('best_model.pkl')
    return joblib.load(model_path)


def load_scaler():
    """Load the fitted StandardScaler from disk."""
    scaler_path = get_model_path('scaler.pkl')
    return joblib.load(scaler_path)


def load_feature_names():
    """Load expected feature names from disk."""
    path = get_model_path('feature_names.json')
    with open(path, 'r') as f:
        return json.load(f)

def load_selected_features():
    """Load selected features from disk if hybrid feature selection was used."""
    path = get_model_path('selected_features.json')
    if os.path.exists(path):
        with open(path, 'r') as f:
            return json.load(f)
    return None

def preprocess_input(input_data: dict, scaler, feature_names: list, selected_features: list = None) -> pd.DataFrame:
    """
    Transform raw user input into model-ready features.
    
    Parameters
    ----------
    input_data : dict
        Raw form input from Streamlit UI.
    scaler : StandardScaler
        Fitted scaler from training.
    feature_names : list
        Expected feature names in correct order.
    
    Returns
    -------
    pd.DataFrame
        Scaled features ready for prediction.
    """
    df = pd.DataFrame([input_data])
    
    # --- Feature Engineering ---
    # Fix NaN: Ensure Age is at least 1 and handle potential missing values
    age = max(float(df['Age'].iloc[0]), 1)
    df['Income_per_Age'] = df['MonthlyIncome'] / age
    
    df['Years_per_Promotion'] = df['YearsSinceLastPromotion'] / (df['YearsAtCompany'] + 1)
    
    sat_cols = ['JobSatisfaction', 'EnvironmentSatisfaction', 'RelationshipSatisfaction']
    existing_sat = [c for c in sat_cols if c in df.columns]
    if existing_sat:
        df['Satisfaction_Score'] = df[existing_sat].mean(axis=1)
        df['TotalSatisfaction'] = df[existing_sat].sum(axis=1)
    
    df['Overtime_Flag'] = df['OverTime'].map({'Yes': 1, 'No': 0}).fillna(0).astype(int)
    df.drop(columns=['OverTime'], inplace=True, errors='ignore')
    
    df['Experience_Company_Ratio'] = df['YearsAtCompany'] / (df['TotalWorkingYears'] + 1)
    
    # --- Ordinal Encoding: BusinessTravel ---
    travel_map = {'Non-Travel': 0, 'Travel_Rarely': 1, 'Travel_Frequently': 2}
    if 'BusinessTravel' in df.columns:
        df['BusinessTravel'] = df['BusinessTravel'].map(travel_map)
    
    # --- OneHot Encoding ---
    nominal_cols = ['Department', 'EducationField', 'Gender', 'JobRole', 'MaritalStatus']
    existing_nominal = [c for c in nominal_cols if c in df.columns]
    df = pd.get_dummies(df, columns=existing_nominal, drop_first=True, dtype=int)
    
    # --- Align columns to training features ---
    for col in feature_names:
        if col not in df.columns:
            df[col] = 0
    df = df[feature_names]
    
    # --- Scale ---
    df_scaled = pd.DataFrame(
        scaler.transform(df),
        columns=feature_names
    )
    
    # --- Feature Selection Filter ---
    if selected_features is not None:
        df_scaled = df_scaled[selected_features]
    
    return df_scaled


def get_shap_explanation(model, input_scaled: pd.DataFrame, feature_names: list):
    """
    Compute SHAP values for a single prediction.
    Robust handling for Logistic Regression.
    """
    if hasattr(model, 'coef_') and hasattr(model, 'intercept_'):
        # For Logistic Regression: SHAP = coef * scaled_value
        # Since we use StandardScaler, mean is zero, so this works perfectly
        coefs = model.coef_[0]
        intercept = model.intercept_[0]
        values = coefs * input_scaled.iloc[0].values
        base_value = intercept
    else:
        # Fallback for tree-based or other models
        explainer = shap.Explainer(model, input_scaled)
        shap_result = explainer(input_scaled)
        values = shap_result.values[0]
        if len(values.shape) > 1 and values.shape[1] > 1:
            values = values[:, 1]
        base_value = shap_result.base_values[0]
        if hasattr(base_value, "__len__") and len(base_value) > 1:
            base_value = base_value[1] 

    explanation = shap.Explanation(
        values=values,
        base_values=base_value,
        data=input_scaled.iloc[0].values,
        feature_names=feature_names
    )
    
    return values, base_value, explanation


def get_risk_level(probability: float) -> tuple:
    """
    Categorize attrition risk level.
    
    Returns
    -------
    tuple
        (risk_label, color, emoji)
    """
    if probability >= 0.7:
        return " HIGH RISK", "#FF1744", ""
    elif probability >= 0.4:
        return " MEDIUM RISK", "#FF9100", ""
    else:
        return " LOW RISK", "#00C853", ""


def get_recommendations(shap_values_arr, feature_names: list, top_n: int = 3, mode: str = 'risk') -> list:
    """
    Generate business recommendations based on top SHAP risk or stay factors.
    
    Parameters
    ----------
    mode : str
        'risk' for factors pushing towards attrition (positive SHAP).
        'stay' for factors pushing towards staying (negative SHAP).
    """
    recommendations_map = {
        'Overtime_Flag': 'Beban kerja terlalu tinggi (sering lembur). Berisiko kelelahan fisik dan mental.',
        'MonthlyIncome': 'Tingkat gaji saat ini belum kompetitif bagi karyawan. Perlu penyesuaian upah.',
        'Income_per_Age': 'Gaji belum sebanding dengan usia dan pengalaman. Karyawan merasa kurang dihargai.',
        'Age': 'Karyawan berada di usia awal karir yang cenderung aktif mencari peluang baru.',
        'JobSatisfaction': 'Kepuasan dalam peran saat ini rendah. Perlu diskusi mengenai tanggung jawab baru.',
        'EnvironmentSatisfaction': 'Lingkungan atau fasilitas kerja kurang nyaman. Perlu evaluasi budaya/suasana kantor.',
        'WorkLifeBalance': 'Waktu untuk kehidupan pribadi terganggu. Pertimbangkan kebijakan jam kerja fleksibel.',
        'YearsAtCompany': 'Masa kerja masih sangat baru. Loyalitas dan kedekatan dengan tim belum terbentuk kuat.',
        'DistanceFromHome': 'Jarak rumah ke kantor terlalu jauh. Menambah tingkat stres dan kelelahan harian.',
        'TotalWorkingYears': 'Masih di tahap awal karir. Membutuhkan lebih banyak pelatihan dan bimbingan.',
        'YearsSinceLastPromotion': 'Karir terasa jalan di tempat. Karyawan merasa kurang ada kemajuan atau promosi.',
        'NumCompaniesWorked': 'Memiliki riwayat sering berpindah perusahaan. Perlu pendekatan engagement khusus.',
        'RelationshipSatisfaction': 'Hubungan dengan rekan kerja atau atasan kurang harmonis. Berpotensi konflik tim.',
        'TrainingTimesLastYear': 'Kurangnya pelatihan atau pengembangan diri di tahun terakhir.',
        'TotalSatisfaction': 'Tingkat kepuasan kerja menyeluruh sedang menurun. Perlu evaluasi mendalam.',
        'Experience_Company_Ratio': 'Berpengalaman tapi baru bergabung. Seringkali merasa sulit beradaptasi dengan budaya baru.',
        'Years_per_Promotion': 'Kecepatan kenaikan jabatan dirasa terlalu lambat dibandingkan masa kerjanya.',
        'DailyRate': 'Tarif kompensasi harian yang rendah menjadi faktor penarik untuk mencari peluang lain.',
        'StockOptionLevel': 'Kepemilikan saham perusahaan (Stock Option) rendah, mengurangi rasa memiliki (ownership).',
        'YearsWithCurrManager': 'Kurang cocok dengan manajemen saat ini atau baru saja berganti atasan.',
        'YearsInCurrentRole': 'Terlalu lama di posisi yang sama tanpa ada rotasi atau penyegaran peran.',
    }

    stay_recommendations_map = {
        'Overtime_Flag': 'Waktu kerja sehat (jarang lembur). Menjaga karyawan tetap bugar dan betah.',
        'MonthlyIncome': 'Gaji yang kompetitif menjadi jangkar utama karyawan tetap bertahan.',
        'Income_per_Age': 'Penghasilan sangat baik untuk tahap usianya. Memberikan rasa aman finansial.',
        'Age': 'Berada di tahap karir yang stabil dengan tingkat loyalitas organisasi yang tinggi.',
        'JobSatisfaction': 'Sangat puas dengan perannya sekarang. Memiliki motivasi kerja yang tinggi.',
        'EnvironmentSatisfaction': 'Merasa sangat nyaman dengan fasilitas dan suasana kerja di kantor.',
        'WorkLifeBalance': 'Keseimbangan kerja dan pribadi yang baik mencegah keinginan untuk pindah.',
        'YearsAtCompany': 'Sudah memiliki ikatan emosional dan loyalitas yang dalam terhadap perusahaan.',
        'DistanceFromHome': 'Lokasi rumah yang dekat dengan kantor mengurangi hambatan perjalanan harian.',
        'TotalWorkingYears': 'Pengalaman profesional yang luas memberikan perspektif kerja yang lebih stabil.',
        'YearsSinceLastPromotion': 'Merasakan ada kemajuan karir yang jelas melalui promosi atau kenaikan jabatan.',
        'NumCompaniesWorked': 'Memiliki riwayat kerja yang stabil, menunjukkan profil karyawan yang setia.',
        'RelationshipSatisfaction': 'Hubungan harmonis dengan tim menjadi alasan kuat mereka nyaman bertahan.',
        'TrainingTimesLastYear': 'Investasi perusahaan dalam pelatihan membuat karyawan merasa sangat dihargai.',
        'TotalSatisfaction': 'Karyawan merasa sangat puas secara keseluruhan dengan pekerjaannya.',
        'Experience_Company_Ratio': 'Memiliki rekam jejak karir yang selaras dan matang di dalam perusahaan.',
        'DailyRate': 'Kompensasi harian yang memuasakan mendukung loyalitas jangka panjang.',
        'StockOptionLevel': 'Program kepemilikan saham memberikan rasa memiliki yang kuat terhadap perusahaan.',
        'YearsWithCurrManager': 'Hubungan dan dukungan yang baik dari atasan langsung menjaga kenyamanan kerja.',
        'YearsInCurrentRole': 'Masih memiliki ruang tumbuh atau baru saja mendapatkan penyegaran peran.',
    }
    
    shap_series = pd.Series(shap_values_arr, index=feature_names)
    
    if mode == 'risk':
        # Sort by most positive (risk factors)
        top_factors = shap_series.sort_values(ascending=False).head(top_n)
        current_map = recommendations_map
        valid_check = lambda x: x > 0
    else:
        # Sort by most negative (stay factors)
        top_factors = shap_series.sort_values(ascending=True).head(top_n)
        current_map = stay_recommendations_map
        valid_check = lambda x: x < 0
    
    results = []
    for feat, impact in top_factors.items():
        if valid_check(impact):
            rec = current_map.get(feat, f'Positive stability factor: {feat}.' if mode == 'stay' else f'Risk factor: {feat}.')
            results.append({
                'feature': feat,
                'impact': abs(float(impact)), # Return absolute impact for UI scaling
                'recommendation': rec,
                'type': 'stay' if mode == 'stay' else 'risk'
            })
    
    return results
