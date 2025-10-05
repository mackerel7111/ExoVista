# backend.py
import pickle
import pandas as pd
from fastapi import FastAPI, UploadFile, File
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
)

# Load your trained model and label encoder at startup
model = None
label_encoder = None

try:
    with open("model.pkl", "rb") as f:
        model = pickle.load(f)
    print("[SUCCESS] Model loaded successfully")
except FileNotFoundError:
    print("[WARNING] model.pkl not found - upload one using /upload-model")
except Exception as e:
    print(f"[ERROR] Error loading model: {e}")

try:
    with open("label_encoder.pkl", "rb") as f:
        label_encoder = pickle.load(f)
    print("[SUCCESS] Label encoder loaded successfully")
except FileNotFoundError:
    print("[WARNING] label_encoder.pkl not found - will use default labels")
except Exception as e:
    print(f"[ERROR] Error loading label encoder: {e}")

@app.get("/")
async def root():
    """Welcome endpoint for ExoVista API"""
    return {
        "message": "Welcome to ExoVista API! 🪐",
        "description": "Exoplanet Classification and Analysis API",
        "version": "1.0.0",
        "status": "running",
        "endpoints": {
            "health": "/health - Check API health",
            "docs": "/docs - Interactive API documentation", 
            "info": "/info - Detailed API information",
            "analyze": "/analyze-parameters - Analyze exoplanet parameters",
            "predict": "/predict - Upload CSV for batch prediction"
        },
        "model_status": {
            "model_loaded": model is not None,
            "label_encoder_loaded": label_encoder is not None
        }
    }

@app.get("/health")
async def health():
    return {
        "status": "healthy", 
        "model_loaded": model is not None,
        "label_encoder_loaded": label_encoder is not None
    }

@app.get("/info")
async def info():
    """Get API information and expected parameters"""
    return {
        "api_version": "1.0",
        "expected_parameters": {
            "period": "Orbital period in days (0.1 - 10,000)",
            "duration": "Transit duration in hours (0.1 - 24)",
            "transitDepth": "Transit depth in % (0.001 - 100)",
            "planetRadius": "Planet radius in Earth radii (0.1 - 50)",
            "stellarRadius": "Stellar radius in Solar radii (0.1 - 100)"
        },
        "csv_format": {
            "expected_columns": ["Period", "Duration", "Transit Depth", "Planet Radius", "Stellar Radius"],
            "example_row": "365.25,2.5,0.01,1.0,1.0,Kepler",
            "note": "CSV can include additional columns like 'Source' - they will be ignored"
        },
        "endpoints": {
            "/analyze-parameters": "POST - Analyze exoplanet parameters (JSON)",
            "/predict": "POST - Upload CSV file for batch prediction",
            "/upload-model": "POST - Upload ML model (.pkl)",
            "/upload-label-encoder": "POST - Upload label encoder (.pkl)",
            "/health": "GET - Check API health",
            "/info": "GET - Get API information"
        }
    }

def predict_exoplanet(model, input_data, label_encoder=None):
    """Predict exoplanet classification with proper label decoding"""
    # Make prediction
    predictions = model.predict(input_data)
    prediction_proba = model.predict_proba(input_data) if hasattr(model, 'predict_proba') else None
    
    # Debug logging
    print(f"[DEBUG] Model predictions: {predictions}")
    print(f"[DEBUG] Prediction probabilities: {prediction_proba}")
    print(f"[DEBUG] Prediction shape: {predictions.shape if hasattr(predictions, 'shape') else 'No shape'}")
    if prediction_proba is not None:
        print(f"[DEBUG] Proba shape: {prediction_proba.shape}")
    
    # Get the predicted class
    predicted_class_index = predictions[0] if hasattr(predictions[0], '__len__') else predictions[0]
    
    # Convert to readable label
    if label_encoder is not None:
        try:
            predicted_label = label_encoder.inverse_transform([predicted_class_index])[0]
        except (ValueError, IndexError):
            predicted_label = f"Class_{predicted_class_index}"
    else:
        # Fallback to default labels
        default_labels = {0: "confirmed", 1: "candidate", 2: "false_positive"}
        predicted_label = default_labels.get(predicted_class_index, f"Class_{predicted_class_index}")
    
    # Get confidence scores
    confidence_scores = {}
    if prediction_proba is not None:
        if label_encoder is not None:
            try:
                class_labels = label_encoder.classes_
                print(f"[DEBUG] Label encoder classes: {class_labels}")
                for i, confidence in enumerate(prediction_proba[0]):
                    confidence_scores[class_labels[i]] = float(confidence)
                    print(f"[DEBUG] {class_labels[i]}: {confidence}")
            except Exception as e:
                print(f"[DEBUG] Label encoder error: {e}")
                # Fallback
                for i, confidence in enumerate(prediction_proba[0]):
                    confidence_scores[f"Class_{i}"] = float(confidence)
        else:
            # Default labels
            default_labels = ["confirmed", "candidate", "false_positive"]
            for i, confidence in enumerate(prediction_proba[0]):
                label = default_labels[i] if i < len(default_labels) else f"Class_{i}"
                confidence_scores[label] = float(confidence)
                print(f"[DEBUG] {label}: {confidence}")
    else:
        print("[DEBUG] No prediction probabilities available")
    
    print(f"[DEBUG] Final confidence scores: {confidence_scores}")
    
    return {
        "prediction": predicted_label,
        "confidence_scores": confidence_scores,
        "raw_predictions": predictions.tolist() if hasattr(predictions, 'tolist') else [predictions]
    }

@app.post("/upload-model")
async def upload_model(file: UploadFile = File(...)):
    global model
    try:
        contents = await file.read()
        with open("model.pkl", "wb") as f:
            f.write(contents)
        
        # Reload the model
        with open("model.pkl", "rb") as f:
            model = pickle.load(f)
        
        return {"message": "Model uploaded and loaded successfully"}
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=400)

@app.post("/upload-label-encoder")
async def upload_label_encoder(file: UploadFile = File(...)):
    global label_encoder
    try:
        # Save uploaded label encoder
        contents = await file.read()
        with open("label_encoder.pkl", "wb") as f:
            f.write(contents)
        
        # Reload the label encoder
        with open("label_encoder.pkl", "rb") as f:
            label_encoder = pickle.load(f)
        
        return {"message": "Label encoder uploaded and loaded successfully"}
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=400)

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    if model is None:
        return JSONResponse(content={"error": "Model not loaded. Please upload a model first."}, status_code=400)
    
    try:
        # Read uploaded CSV file
        contents = await file.read()
        df = pd.read_csv(pd.io.common.BytesIO(contents))

        # Expected column names for the CSV (with spaces and capitalization)
        expected_csv_columns = ['Period', 'Duration', 'Transit Depth', 'Planet Radius', 'Stellar Radius']
        
        # Check if CSV has the required columns
        missing_columns = [col for col in expected_csv_columns if col not in df.columns]
        if missing_columns:
            return JSONResponse(
                content={"error": f"CSV missing required columns: {missing_columns}. Expected columns: {expected_csv_columns}"}, 
                status_code=400
            )
        
        # Select and rename columns to match model expectations with all required features
        # Extract source information if available
        source = df.get('Source', pd.Series(['TOI'] * len(df))).iloc[0] if 'Source' in df.columns else 'TOI'
        
        df_model = pd.DataFrame({
            'period': df['Period'],
            'duration': df['Duration'], 
            'depth': df['Transit Depth'],  # Model expects 'depth'
            'radius': df['Planet Radius'],  # Model expects 'radius'
            'stellar_radius': df['Stellar Radius'],
            'stellar_temp': [0] * len(df),  # Default value
            'duration_period_ratio': df['Duration'] / df['Period'],  # Calculated
            'radius_stellar_ratio': df['Planet Radius'] / df['Stellar Radius'],  # Calculated
            'source_K2': [1 if source == 'K2' else 0] * len(df),  # Binary encoding
            'source_TOI': [1 if source == 'TOI' else 0] * len(df)  # Binary encoding
        })

        # Run inference
        predictions = model.predict(df_model)

        # Return structured predictions matching frontend expectations
        # Assuming predictions is array of probabilities [confirmed, candidate, false_positive]
        if len(predictions.shape) > 1 and predictions.shape[1] >= 3:
            # Multi-class probabilities
            confirmed_score = float(predictions[0][0])
            candidate_score = float(predictions[0][1]) 
            false_positive_score = float(predictions[0][2])
        else:
            # Binary classification - convert to 3-class format
            binary_score = float(predictions[0])
            if binary_score > 0.7:
                confirmed_score = binary_score
                candidate_score = 1 - binary_score
                false_positive_score = 0.1
            elif binary_score > 0.3:
                confirmed_score = binary_score * 0.6
                candidate_score = 0.8
                false_positive_score = 1 - binary_score
            else:
                confirmed_score = binary_score * 0.3
                candidate_score = 0.2
                false_positive_score = 1 - binary_score

        return {
            "confidenceScores": {
                "confirmed": round(confirmed_score, 2),
                "candidate": round(candidate_score, 2),
                "falsePositive": round(false_positive_score, 2)
            },
            "rawPredictions": predictions.tolist(),
            "num_samples": len(df),
            "features_used": df.columns.tolist(),
            "model_info": {
                "model_type": str(type(model).__name__),
                "prediction_shape": predictions.shape
            }
        }
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=400)

@app.post("/analyze-parameters")
async def analyze_parameters(data: dict):
    """Analyze exoplanet parameters directly without file upload"""
    if model is None:
        return JSONResponse(content={"error": "Model not loaded. Please upload a model first."}, status_code=400)
    
    try:
        # Extract parameters (updated to match frontend)
        period = data.get('period', 0)
        duration = data.get('duration', 0)
        transit_depth = data.get('transitDepth', 0)
        planet_radius = data.get('planetRadius', 0)
        stellar_radius = data.get('stellarRadius', 0)
        
        # Validate parameters
        if not all(isinstance(x, (int, float)) and x > 0 for x in [period, duration, transit_depth, planet_radius, stellar_radius]):
            return JSONResponse(content={"error": "All parameters must be positive numbers"}, status_code=400)
        
        # Additional validation ranges (based on frontend constraints)
        if period > 10000:
            return JSONResponse(content={"error": "Orbital period cannot exceed 10,000 days"}, status_code=400)
        if duration > 24:
            return JSONResponse(content={"error": "Transit duration cannot exceed 24 hours"}, status_code=400)
        if transit_depth > 100:
            return JSONResponse(content={"error": "Transit depth cannot exceed 100%"}, status_code=400)
        if planet_radius > 50:
            return JSONResponse(content={"error": "Planet radius cannot exceed 50 Earth radii"}, status_code=400)
        if stellar_radius > 100:
            return JSONResponse(content={"error": "Stellar radius cannot exceed 100 Solar radii"}, status_code=400)
        
        # Create DataFrame with ONLY the features your model actually recognizes
        # Based on error messages, your model only knows these features:
        
        minimal_columns = [
            'period', 'duration', 'depth', 'stellar_radius', 
            'duration_period_ratio', 'source_TOI'
        ]
        
        # Create DataFrame with only the recognized features
        df = pd.DataFrame(columns=minimal_columns)
        df.loc[0] = 0  # Initialize with zeros
        
        # Fill in the available values (only features the model recognizes)
        df.loc[0, 'period'] = period
        df.loc[0, 'duration'] = duration  
        df.loc[0, 'depth'] = transit_depth
        df.loc[0, 'stellar_radius'] = stellar_radius
        
        # Calculate derived features (only the ones model recognizes)
        df.loc[0, 'duration_period_ratio'] = duration / period if period > 0 else 0
        
        # Set default source (only source_TOI since model recognizes it)
        df.loc[0, 'source_TOI'] = 1
        
        print(f"[DEBUG] Using minimal feature set:")
        print(f"[DEBUG] Columns: {df.columns.tolist()}")
        print(f"[DEBUG] Values: {df.iloc[0].tolist()}")
        
        # Run inference using the proper prediction function
        result = predict_exoplanet(model, df, label_encoder)
        
        # Return results in the format expected by frontend
        return {
            "prediction": result["prediction"],
            "confidenceScores": result["confidence_scores"],
            "inputParameters": {
                "period": period,
                "duration": duration,
                "transitDepth": transit_depth,
                "planetRadius": planet_radius,
                "stellarRadius": stellar_radius
            },
            "rawPredictions": result["raw_predictions"],
            "model_info": {
                "model_type": str(type(model).__name__),
                "label_encoder_available": label_encoder is not None
            }
        }
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=400)
if __name__ == "__main__":
    import uvicorn
    print("Starting FastAPI server...")
    print("Visit: http://localhost:8000/docs")
    uvicorn.run(app, host="0.0.0.0", port=8000)
