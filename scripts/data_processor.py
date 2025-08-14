import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_squared_error, r2_score
import joblib
import json

class PromotionModelProcessor:
    def __init__(self):
        self.label_encoders = {}
        self.scaler = StandardScaler()
        self.model = None
        
    def load_data(self, train_url, validation_url):
        """Load training and validation data from URLs"""
        try:
            # Load training data
            train_df = pd.read_csv(train_url)
            validation_df = pd.read_csv(validation_url)
            
            print(f"Training data shape: {train_df.shape}")
            print(f"Validation data shape: {validation_df.shape}")
            
            return train_df, validation_df
        except Exception as e:
            print(f"Error loading data: {e}")
            return None, None
    
    def preprocess_data(self, df):
        """Preprocess the data for training"""
        # Create a copy to avoid modifying original data
        processed_df = df.copy()
        
        # Convert date column
        processed_df['Tanggal'] = pd.to_datetime(processed_df['Tanggal'])
        processed_df['Month'] = processed_df['Tanggal'].dt.month
        processed_df['DayOfWeek'] = processed_df['Tanggal'].dt.dayofweek
        
        # Convert Jumlah_Terjual to numeric (it's stored as string)
        processed_df['Jumlah_Terjual'] = pd.to_numeric(processed_df['Jumlah_Terjual'], errors='coerce')
        
        # Convert Stok_Aging to numeric (it's stored as string)
        processed_df['Stok_Aging'] = pd.to_numeric(processed_df['Stok_Aging'], errors='coerce')
        
        # Handle categorical variables
        categorical_columns = ['Produk', 'Kategori', 'Brand', 'Jenis_Promo', 'Musim', 'Cuaca', 'Event_Lokal']
        
        for col in categorical_columns:
            if col not in self.label_encoders:
                self.label_encoders[col] = LabelEncoder()
                processed_df[col + '_encoded'] = self.label_encoders[col].fit_transform(processed_df[col].astype(str))
            else:
                # For validation data, use existing encoders
                processed_df[col + '_encoded'] = self.label_encoders[col].transform(processed_df[col].astype(str))
        
        # Create feature columns
        feature_columns = [
            'Harga_Jual', 'Diskon', 'Stok_Harian', 'Stok_Aging',
            'Month', 'DayOfWeek'
        ] + [col + '_encoded' for col in categorical_columns]
        
        # Fill missing values
        processed_df[feature_columns] = processed_df[feature_columns].fillna(0)
        
        return processed_df, feature_columns
    
    def train_model(self, train_df, feature_columns, target_column='Jumlah_Terjual'):
        """Train the promotion model"""
        X = train_df[feature_columns]
        y = train_df[target_column]
        
        # Scale features
        X_scaled = self.scaler.fit_transform(X)
        
        # Split data
        X_train, X_test, y_train, y_test = train_test_split(
            X_scaled, y, test_size=0.2, random_state=42
        )
        
        # Train Random Forest model
        self.model = RandomForestRegressor(
            n_estimators=100,
            max_depth=10,
            random_state=42,
            n_jobs=-1
        )
        
        self.model.fit(X_train, y_train)
        
        # Evaluate model
        train_pred = self.model.predict(X_train)
        test_pred = self.model.predict(X_test)
        
        metrics = {
            'train_r2': r2_score(y_train, train_pred),
            'test_r2': r2_score(y_test, test_pred),
            'train_rmse': np.sqrt(mean_squared_error(y_train, train_pred)),
            'test_rmse': np.sqrt(mean_squared_error(y_test, test_pred))
        }
        
        print("Model Training Results:")
        print(f"Train R²: {metrics['train_r2']:.4f}")
        print(f"Test R²: {metrics['test_r2']:.4f}")
        print(f"Train RMSE: {metrics['train_rmse']:.4f}")
        print(f"Test RMSE: {metrics['test_rmse']:.4f}")
        
        return metrics
    
    def predict(self, input_data):
        """Make predictions on new data"""
        if self.model is None:
            raise ValueError("Model not trained yet!")
        
        # Preprocess input data
        processed_data, feature_columns = self.preprocess_data(input_data)
        X = processed_data[feature_columns]
        X_scaled = self.scaler.transform(X)
        
        # Make prediction
        prediction = self.model.predict(X_scaled)
        
        return prediction
    
    def save_model(self, filepath):
        """Save the trained model and preprocessors"""
        model_data = {
            'model': self.model,
            'scaler': self.scaler,
            'label_encoders': self.label_encoders
        }
        joblib.dump(model_data, filepath)
        print(f"Model saved to {filepath}")
    
    def load_model(self, filepath):
        """Load a trained model and preprocessors"""
        model_data = joblib.load(filepath)
        self.model = model_data['model']
        self.scaler = model_data['scaler']
        self.label_encoders = model_data['label_encoders']
        print(f"Model loaded from {filepath}")

# Example usage
if __name__ == "__main__":
    # Initialize processor
    processor = PromotionModelProcessor()
    
    # URLs for the data files
    train_url = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/train%20%285%29-ZAEru5YR6QNcDnPve8yVIfekeEnW5k.csv"
    validation_url = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/validation%20%282%29-xhoc1Kd9SG51xLb8aNZ9PmrHWdIgxV.csv"
    
    # Load data
    train_df, validation_df = processor.load_data(train_url, validation_url)
    
    if train_df is not None and validation_df is not None:
        # Preprocess training data
        train_processed, feature_columns = processor.preprocess_data(train_df)
        
        # Train model
        metrics = processor.train_model(train_processed, feature_columns)
        
        # Save model
        processor.save_model('promotion_model.joblib')
        
        # Test on validation data
        validation_processed, _ = processor.preprocess_data(validation_df)
        validation_predictions = processor.predict(validation_df)
        
        print(f"\nValidation predictions sample: {validation_predictions[:5]}")
        print(f"Validation data shape: {validation_df.shape}")
        
        # Save results
        results = {
            'training_metrics': metrics,
            'validation_predictions': validation_predictions.tolist(),
            'feature_columns': feature_columns
        }
        
        with open('model_results.json', 'w') as f:
            json.dump(results, f, indent=2)
        
        print("Training completed successfully!")
    else:
        print("Failed to load data. Please check the URLs.")
