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

# Load your trained model at startup
model = None
try:
    with open("model.pkl", "rb") as f:
        model = pickle.load(f)
    print("[SUCCESS] Model loaded successfully")
except FileNotFoundError:
    print("[WARNING] model.pkl not found - upload one using /upload-model")
except Exception as e:
    print(f"[ERROR] Error loading model: {e}")

@app.get("/health")
async def health():
    return {"status": "healthy", "model_loaded": model is not None}

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
        
        # Run inference
        predictions = model.predict(df)
        
        # Convert to structured format
        if len(predictions.shape) > 1 and predictions.shape[1] >= 3:
            confirmed_score = float(predictions[0][0])
            candidate_score = float(predictions[0][1])
            false_positive_score = float(predictions[0][2])
        else:
            # Binary classification conversion
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
            "inputParameters": {
                "orbitalPeriod": orbital_period,
                "transitDepth": transit_depth,
                "temperature": temperature
            },
            "model_info": {
                "model_type": str(type(model).__name__),
                "prediction_shape": predictions.shape
            }
        }
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=400)
if __name__ == "__main__":
    import uvicorn
    print("Starting FastAPI server...")
    print("Visit: http://localhost:8000/docs")
    uvicorn.run(app, host="0.0.0.0", port=8000)
