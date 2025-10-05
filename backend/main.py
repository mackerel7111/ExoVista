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

@app.get("/health")
async def health():
    return {
        "status": "healthy", 
        "model_loaded": model is not None,
        "label_encoder_loaded": label_encoder is not None
    }

def predict_exoplanet(model, input_data, label_encoder=None):
    """Predict exoplanet classification with proper label decoding"""
    # Make prediction
    predictions = model.predict(input_data)
    prediction_proba = model.predict_proba(input_data) if hasattr(model, 'predict_proba') else None
    
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
                for i, confidence in enumerate(prediction_proba[0]):
                    confidence_scores[class_labels[i]] = float(confidence)
            except:
                # Fallback
                for i, confidence in enumerate(prediction_proba[0]):
                    confidence_scores[f"Class_{i}"] = float(confidence)
        else:
            # Default labels
            default_labels = ["confirmed", "candidate", "false_positive"]
            for i, confidence in enumerate(prediction_proba[0]):
                label = default_labels[i] if i < len(default_labels) else f"Class_{i}"
                confidence_scores[label] = float(confidence)
    
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

        # Run inference
        predictions = model.predict(df)

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
        # Extract parameters
        orbital_period = data.get('orbitalPeriod', 0)
        transit_depth = data.get('transitDepth', 0)
        temperature = data.get('temperature', 0)
        
        # Create DataFrame for prediction
        df = pd.DataFrame({
            'orbital_period': [orbital_period],
            'transit_depth': [transit_depth], 
            'temperature': [temperature]
        })
        
        # Run inference using the proper prediction function
        result = predict_exoplanet(model, df, label_encoder)
        
        # Return results in the format expected by frontend
        return {
            "prediction": result["prediction"],
            "confidenceScores": result["confidence_scores"],
            "inputParameters": {
                "orbitalPeriod": orbital_period,
                "transitDepth": transit_depth,
                "temperature": temperature
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
