from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import cv2
import numpy as np
import os
import smtplib
from email.message import EmailMessage
from tensorflow.keras.models import load_model
from tensorflow.keras.applications.resnet50 import preprocess_input
from werkzeug.utils import secure_filename
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from datetime import datetime

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = 'uploads'
REPORT_FOLDER = 'reports'
MODEL_PATH = r'C:\Users\mercy\OneDrive\Desktop\MainProject\prediction.h5'

# Ensure directories exist
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(REPORT_FOLDER, exist_ok=True)

# Load the model
if os.path.exists(MODEL_PATH):
    model = load_model(MODEL_PATH)
else:
    raise FileNotFoundError(f"Model file not found at {MODEL_PATH}")

# Class names
class_names = ['1M_2', '2L_1.5', '2L_2.5', '2M_1', '2M_2', '2M_3', '2R_1.5', '2R_2.5',
               '3L_1.5', '3L_2.5', '3M_1', '3M_2', '3M_3', '3R_2.5', '4L_2.5', '4M_1', '4M_3']

def preprocess_image(img_path):
    try:
        img = cv2.imread(img_path)
        if img is None:
            raise ValueError("Error loading image. Check the file format.")
        img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        img_resized = cv2.resize(img, (224, 224))
        img_processed = preprocess_input(img_resized.astype(np.float32))
        img_processed = np.expand_dims(img_processed, axis=0)
        return img_processed
    except Exception as e:
        print(f"Image preprocessing error: {e}")
        return None

def predict_shade(img_path):
    try:
        img_processed = preprocess_image(img_path)
        if img_processed is None:
            return None, None

        prediction = model.predict(img_processed)[0]
        predicted_class_index = np.argmax(prediction)
        predicted_class = class_names[predicted_class_index]
        confidence_scores = {class_names[i]: round(float(prediction[i]) * 100, 2) for i in range(len(class_names))}
        return predicted_class, confidence_scores
    except Exception as e:
        print(f"Prediction Error: {e}")
        return None, None

def generate_pdf_report(clinic_name, doctor_name, patient_name, age, sex, predicted_class, confidence_scores, filename):
    pdf_path = os.path.join(REPORT_FOLDER, filename)
    c = canvas.Canvas(pdf_path, pagesize=letter)
    width, height = letter
    timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')

    c.setFont("Helvetica-Bold", 18)
    c.drawString(50, height - 50, f"{clinic_name}")
    c.setFont("Helvetica", 12)
    c.drawString(50, height - 80, f"Date & Time: {timestamp}")
    c.drawString(50, height - 100, f"Doctor: {doctor_name}")
    c.drawString(50, height - 130, "Patient Details:")
    c.drawString(50, height - 150, f"Name: {patient_name}")
    c.drawString(50, height - 170, f"Age: {age}")
    c.drawString(50, height - 190, f"Sex: {sex}")
    c.drawString(50, height - 220, f"Predicted Shade: {predicted_class}")

    c.drawString(50, height - 250, "Shade Matching Confidence:")
    y_position = height - 270
    for shade, confidence in confidence_scores.items():
        c.drawString(50, y_position, f"{shade}: {confidence}%")
        y_position -= 20

    c.save()
    return filename

@app.route('/predict', methods=['POST'])
def predict():
    if 'image' not in request.files:
        return jsonify({'error': 'No image provided'}), 400

    file = request.files['image']
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400

    img_filename = secure_filename(file.filename)
    img_path = os.path.join(UPLOAD_FOLDER, img_filename)
    file.save(img_path)

    patient_name = request.form.get('patient_name', 'Unknown')
    age = request.form.get('patient_id', 'Unknown')
    sex = request.form.get('sex', 'Unknown')
    doctor_name = request.form.get('doctor_name', 'Unknown')
    clinic_name = request.form.get('clinic_name', 'Unknown')

    predicted_class, confidence_scores = predict_shade(img_path)
    os.remove(img_path)

    if predicted_class:
        report_filename = f"report_{datetime.now().strftime('%Y%m%d%H%M%S')}.pdf"
        generate_pdf_report(clinic_name, doctor_name, patient_name, age, sex, predicted_class, confidence_scores, report_filename)
        return jsonify({
            'predicted_shade': predicted_class,
            'confidence_scores': confidence_scores,
            'report_filename': report_filename
        })
    else:
        return jsonify({'error': 'Prediction failed'}), 500
    
@app.route('/download-report/<filename>', methods=['GET'])
def download_report(filename):
    report_path = os.path.join(REPORT_FOLDER, filename)
    if not os.path.exists(report_path):
        return jsonify({'error': 'Report file not found'}), 404
    return send_from_directory(REPORT_FOLDER, filename, as_attachment=True)

@app.route('/send-report', methods=['POST'])
def send_report():
    data = request.json
    email = data.get("email")
    filename = data.get("report_filename")

    if not email or not filename:
        return jsonify({'error': 'Missing email or report filename'}), 400

    report_path = os.path.join(REPORT_FOLDER, filename)

    if not os.path.exists(report_path):
        return jsonify({'error': 'Report file not found'}), 404

    try:
        sender_email = "mercyantony1112@gmail.com"  # Change to your email
        app_password = "xdvx dkvb dwyw sfoj"  # Use the generated App Password

        msg = EmailMessage()
        msg["Subject"] = "Tooth Shade Analysis Report"
        msg["From"] = sender_email
        msg["To"] = email
        msg.set_content("Please find attached the tooth shade analysis report.")

        with open(report_path, "rb") as f:
            msg.add_attachment(f.read(), maintype="application", subtype="pdf", filename=filename)

        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
            server.login(sender_email, app_password)
            server.send_message(msg)

        return jsonify({'message': 'Report sent successfully'})

    except Exception as e:
        print("Email Error:", e)
        return jsonify({'error': 'Failed to send email'}), 500


if __name__ == '__main__':
    app.run(debug=True)
