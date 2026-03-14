# Salvage Car Analyzer

AI-assisted web tool for analyzing salvage vehicle deals and estimating repair costs using computer vision.

This project helps evaluate whether a salvage vehicle purchase is profitable by combining financial analysis with AI-based damage estimation.

---

# Features

### Deal Analysis
- Salvage vehicle ROI calculator
- Profit estimation
- Safe max bid calculation
- Risk level indicator

### Vehicle Information
- VIN decoding
- Vehicle details input
- Mileage and year tracking

### AI Repair Estimate
- Upload damage photos
- Computer vision analysis
- Damage zone estimation
- Likely damaged components detection
- Estimated repair cost range
- Confidence level indicator

### Financial Metrics
- Total investment calculation
- Potential profit
- Return on investment (ROI)
- Risk evaluation

---

# Tech Stack

### Frontend
- HTML  
- CSS  
- JavaScript  

### Backend
- Python  
- Flask  

### Computer Vision / AI
- YOLOv8  
- OpenCV  
- Pillow  
- NumPy  

---

# How It Works

1. Enter vehicle information (model, year, mileage).
2. Upload damage photos.
3. Select damage type.
4. AI estimates damage zone and possible damaged components.
5. System calculates estimated repair cost range.
6. Deal analyzer calculates ROI, profit, and investment risk.

---

# Example AI Output

```
Uploaded images: 1

Selected damage type: Front End

Approximate damage zone:
• front area

Likely damaged components:
• front bumper
• headlights
• hood
• fender

Estimated repair range:
$2,400 – $4,000

Confidence:
Medium-High
```

---

# Installation

Clone the repository

```
git clone https://github.com/YOUR_USERNAME/salvage-car-analyzer.git
cd salvage-car-analyzer
```

Install dependencies

```
pip install -r requirements.txt
```

Run the server

```
python app.py
```

Open in browser

```
http://127.0.0.1:5000
```

---

# Project Structure

```
salvage-car-analyzer
│
├── app.py              # Flask backend server
├── index.html          # Main frontend page
├── script.js           # Frontend logic and AI request handling
├── style.css           # UI styling
├── requirements.txt    # Python dependencies
├── yolov8n.pt          # YOLOv8 computer vision model
│
└── uploads/            # Folder for uploaded damage photos
```

---

# Future Improvements

- More advanced damage detection models
- Multi-image analysis
- Downloadable AI repair reports
- Insurance-style repair estimator
- Improved damage classification
- Better confidence scoring

---

# Disclaimer

The AI repair estimate is an approximate analysis based on uploaded photos, selected damage type, market value, and user input. Hidden structural or internal damage may increase final repair costs.

---

# Author

Aleksandr Korzhevskii

Computer Information Systems student interested in AI, computer vision, and automotive technology.

---

# License

This project is for educational and portfolio purposes.