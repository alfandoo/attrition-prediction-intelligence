import sys
import os
import pandas as pd
import numpy as np
import pytest

# Add project root to path to import app.utils
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.utils import get_risk_level, preprocess_input

def test_risk_level_mapping():
    """Test that risk levels are categorized correctly based on probability."""
    assert "HIGH" in get_risk_level(0.85)[0]
    assert "MEDIUM" in get_risk_level(0.55)[0]
    assert "LOW" in get_risk_level(0.25)[0]

def test_preprocess_input_structure():
    """Test that preprocessing returns a DataFrame with the correct shape and columns."""
    # Mock data matching the PredictRequest structure
    mock_input = {
        "MonthlyIncome": 5000,
        "Age": 30,
        "TotalWorkingYears": 10,
        "YearsAtCompany": 5,
        "DistanceFromHome": 2,
        "JobSatisfaction": 3,
        "WorkLifeBalance": 3,
        "OverTime": "Yes",
        "BusinessTravel": "Travel_Rarely",
        "StockOptionLevel": 1,
        "MaritalStatus": "Single",
        "NumCompaniesWorked": 1,
        "DailyRate": 800,
        "YearsWithCurrManager": 2,
        "YearsInCurrentRole": 2,
        "EnvironmentSatisfaction": 3,
        "RelationshipSatisfaction": 3,
        "YearsSinceLastPromotion": 0,
        "Department": "Sales",
        "EducationField": "Life Sciences",
        "Gender": "Male",
        "JobRole": "Sales Executive"
    }
    
    # Mock scaler and feature names
    class MockScaler:
        def transform(self, X):
            return X.values # Identity for testing structure
            
    feature_names = ["MonthlyIncome", "Age", "Overtime_Flag", "Years_per_Promotion"]
    
    # Run preprocessing
    try:
        processed_df = preprocess_input(mock_input, MockScaler(), feature_names)
        
        # Assertions
        assert isinstance(processed_df, pd.DataFrame)
        assert list(processed_df.columns) == feature_names
        assert len(processed_df) == 1
        assert processed_df["Overtime_Flag"].iloc[0] == 1
    except Exception as e:
        pytest.fail(f"Preprocessing failed with error: {e}")

if __name__ == "__main__":
    pytest.main([__file__])
