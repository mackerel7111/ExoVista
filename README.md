
# ExoVista — Friendly exoplanet classification

Welcome to ExoVista — a lightweight web app that helps you explore and classify potential exoplanets using a trained machine-learning model. Enter observation parameters manually or upload a CSV and get predictions (confirmed / candidate / falsePositive) with confidence scores and quick guidance for follow-up.

## What you'll find here
- A React + TypeScript frontend with a smooth, space-themed UI
- A FastAPI backend that runs a scikit-learn / LightGBM pipeline
- CSV upload for batch scoring and a manual input form for single targets

## Quick start (Windows PowerShell)
Run these in two separate PowerShell windows from the project root.

```powershell
# Terminal 1 — Frontend
npm install
npm run dev

# Terminal 2 — Backend
cd backend
python -m pip install -r requirements.txt
python main.py
```

- Frontend: http://localhost:5173
- Backend: http://localhost:8000

Tip: If your environment uses a different Python executable name (for example `python3`), substitute it accordingly.

## Simple usage

Manual input
1. Open the app in your browser.
2. Go to the Manual Input form and enter the five required fields.
3. Click Analyze and read the prediction and confidence scores.

CSV upload
1. Prepare a CSV with the required columns (example below).
2. Open the Exploration page and upload the file.
3. Download or copy the results once processing completes.

Sample CSV (save as `sample_observations.csv`):

```csv
Period,Duration,Transit Depth,Planet Radius,Stellar Radius,Source
365.25,2.5,0.01,1.0,1.0,Kepler
87.97,1.2,0.008,0.83,0.95,TESS
11.86,4.8,0.022,2.1,1.2,K2
```

## Data formats & field meanings
- Period: orbital period (days)
- Duration: transit duration (hours)
- Transit Depth: fraction or percent of starlight blocked (use decimal like `0.01` for 1%)
- Planet Radius: in Earth radii
- Stellar Radius: in Solar radii
- Source (optional): Kepler, TESS, K2, TOI — used to derive a simple source flag

The backend computes a few derived features (for example, duration / period ratio) to match the model's training features.

## Where to change the backend URL
- If you host the backend elsewhere, update the frontend API endpoint in `src/components/LandingPage.tsx` or set an environment variable for `VITE_API_URL` (depending on your local config).

## Troubleshooting

- Backend not responding:
	- Confirm `python main.py` is running and listening on port 8000.
	- Check for errors in the backend console — missing `model.pkl` or `label_encoder.pkl` will cause startup or inference errors.

- CORS or cross-origin issues:
	- Ensure the backend allows requests from your frontend origin (CORS settings in `backend/main.py`).

- "Feature names should match those that were passed during fit":
	- This means the model expects specific feature names. Verify your CSV headers and see `backend/main.py` for the mapping logic.

## Deployment pointers

- Frontend: Cloudflare Pages works well. Build with `npm run build` and point the Pages deployment to the `dist` folder.
- Backend: Railway is already configured (see `backend/Procfile` and `backend/runtime.txt`). You can pause or scale down the Railway service to save costs when not in use.

## Project layout (short)

```
project/
├─ src/                # React app
├─ backend/            # FastAPI + model files
├─ package.json
└─ README.md
```

## Contributing

1. Fork and create a branch: `git checkout -b feature/your-change`
2. Make small, focused commits.
3. Open a pull request with a brief description of the change.

## License
MIT — see the `LICENSE` file.

---

If you'd like, I can: add a one-page quick-start screenshot guide, include example API curl commands, or generate a minimal Gist with the sample CSV. Tell me which and I'll add it.

