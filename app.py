import os
from pathlib import Path
from flask import Flask, request, jsonify, send_from_directory
from ultralytics import YOLO
import cv2
from werkzeug.utils import secure_filename

BASE_DIR = Path(__file__).resolve().parent
UPLOAD_FOLDER = BASE_DIR / "uploads"
UPLOAD_FOLDER.mkdir(exist_ok=True)

ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "webp"}

app = Flask(__name__, static_folder=".", static_url_path="")
# Load YOLO model
model = YOLO("yolov8n.pt")
app.config["UPLOAD_FOLDER"] = str(UPLOAD_FOLDER)


def allowed_file(filename: str) -> bool:
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


@app.route("/")
def index():
    return send_from_directory(".", "index.html")


@app.route("/estimate-ai", methods=["POST"])
def estimate_ai():
    damage_type = request.form.get("damageType", "")
    market_price = float(request.form.get("marketPrice", 0) or 0)
    notes = request.form.get("notes", "")

    uploaded_files = request.files.getlist("damagePhotos")
    saved_files = []
    detected_objects = []

    for file in uploaded_files:
        if not file or file.filename == "":
            continue

        if allowed_file(file.filename):
            safe_name = secure_filename(file.filename)
            save_path = UPLOAD_FOLDER / safe_name
            file.save(save_path)
            saved_files.append(str(save_path))

            # YOLO detection
            results = model(str(save_path))
            for r in results:
                for box in r.boxes:
                    cls = int(box.cls[0])
                    label = model.names[cls]
                    detected_objects.append(label)

    # ВРЕМЕННАЯ computer-vision-style логика V1:
    # пока без настоящего YOLO-детектора повреждений,
    # но уже с upload flow и backend architecture.
    min_estimate = 0
    max_estimate = 0
    confidence = "Medium"
    components = []
    detected_areas = []

    # If YOLO detected multiple objects in image increase damage probability
    if len(detected_objects) > 4:
        detected_areas.append("major visible damage area")
        min_estimate = market_price * 0.18
        max_estimate = market_price * 0.30
        components = ["multiple body panels", "possible structural parts"]
    elif len(detected_objects) > 2:
        detected_areas.append("moderate damage area")
        min_estimate = market_price * 0.12
        max_estimate = market_price * 0.22
        components = ["body panels", "paint work"]
    elif len(detected_objects) > 0:
        detected_areas.append("localized damage area")
        min_estimate = market_price * 0.08
        max_estimate = market_price * 0.15
        components = ["single body panel"]

    if damage_type == "Front End":
        min_estimate = market_price * 0.12
        max_estimate = market_price * 0.20
        components = ["front bumper", "headlights", "hood", "fender"]
        detected_areas = ["front area"]
    elif damage_type == "Rear End":
        min_estimate = market_price * 0.08
        max_estimate = market_price * 0.15
        components = ["rear bumper", "trunk", "tail lights"]
        detected_areas = ["rear area"]
    elif damage_type == "Side Damage":
        min_estimate = market_price * 0.15
        max_estimate = market_price * 0.25
        components = ["doors", "side panels", "mirror", "paint work"]
        detected_areas = ["left/right side area"]
    elif damage_type == "Hail":
        min_estimate = market_price * 0.05
        max_estimate = market_price * 0.12
        components = ["roof", "hood", "trunk lid", "paintless dent repair"]
        detected_areas = ["roof / upper panels"]
    elif damage_type == "Flood":
        min_estimate = market_price * 0.20
        max_estimate = market_price * 0.40
        components = ["electrical system", "interior", "modules", "wiring"]
        detected_areas = ["interior / lower body risk"]
        confidence = "Low"
    elif damage_type == "Mechanical":
        min_estimate = market_price * 0.10
        max_estimate = market_price * 0.30
        components = ["engine components", "cooling system", "belts", "diagnostics"]
        detected_areas = ["engine bay / mechanical systems"]
        confidence = "Low"
    else:
        min_estimate = market_price * 0.10
        max_estimate = market_price * 0.18
        components = ["general body work", "inspection required"]
        detected_areas = ["unknown / mixed"]

    if saved_files:
        # если фото загружены, чуть повышаем “доверие”, потому что backend реально получил images
        if confidence == "Medium":
            confidence = "Medium-High"

    result = {
        "uploaded_images": len(saved_files),
        "detected_areas": detected_areas,
        "detected_objects": detected_objects,
        "components": components,
        "repair_range_min": round(min_estimate),
        "repair_range_max": round(max_estimate),
        "confidence": confidence,
        "notes": (
            "Approximate estimate based on uploaded photos, selected damage type, "
            "market price, and user notes. Hidden structural or internal damage may increase final cost."
        ),
        "userNotes": notes,
    }

    return jsonify(result)


if __name__ == "__main__":
    app.run(debug=True, port=5000)