from flask import Flask, send_file, request, jsonify
import pandas as pd
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from reportlab.lib import colors
import io
import datetime
import requests
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Endpoint for logging to MongoDB via serverless function
LOGGING_ENDPOINT = 'https://us-east-1.aws.data.mongodb-api.com/app/application-0-jekzxop/endpoint/UploadLogs'
# In-memory storage for PDF files (for demonstration)
pdf_storage = {}

@app.route('/process', methods=['POST'])
def process_file():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    original_filename = file.filename

    try:
        df = pd.read_excel(file)
    except Exception as e:
        return jsonify({"error": f"Failed to read Excel file: {str(e)}"}), 500

    logs = []
    processed_files = []

    for index, row in df.iterrows():
        try:
            employee_id = row['Employee ID']
            employee_name = row['Name']
            email = row['Email']
            salary = row['Salary']
            designation = row['Designation']

            pdf_buffer = io.BytesIO()
            c = canvas.Canvas(pdf_buffer, pagesize=letter)
            c.setFont("Helvetica", 12)
            c.setFillColor(colors.black)
            c.drawString(100, 750, f"Employee ID: {employee_id}")
            c.drawString(100, 730, f"Employee Name: {employee_name}")
            c.drawString(100, 710, f"Designation: {designation}")
            c.drawString(100, 690, f"Salary: {salary}")
            c.save()
            pdf_buffer.seek(0)

            pdf_name = f"{employee_name}_{employee_id}_Salary_Slip.pdf"
            pdf_storage[pdf_name] = pdf_buffer

            processed_files.append({
                "employee_id": employee_id,
                "employee_name": employee_name,
                "email": email,
                "pdf_name": pdf_name
            })

        except Exception as e:
            logs.append({
                "employee_id": employee_id,
                "employee_name": employee_name,
                "status": "error",
                "error": str(e)
            })

    try:
        log_payload = {
            "filename": original_filename,
            "date": datetime.datetime.now().isoformat(),
            "errors": logs
        }
        response = requests.post(LOGGING_ENDPOINT, json=log_payload)
        response.raise_for_status()
    except Exception as e:
        return jsonify({"error": f"Failed to log data: {str(e)}"}), 500

    return jsonify({"message": "PDFs generated and file name stored in MongoDB.", "files": [pf['pdf_name'] for pf in processed_files], "errors": logs}), 200

@app.route('/download/<filename>', methods=['GET'])
def download_file(filename):
    if filename not in pdf_storage:
        return jsonify({"error": "File not found"}), 404
    
    pdf_buffer = pdf_storage[filename]
    return send_file(pdf_buffer, as_attachment=True, download_name=filename, mimetype='application/pdf')

@app.route('/send-email', methods=['POST'])
def send_email():
    data = request.json
    filename = data.get('filename')  # Adjusted to get the filename of the original file

    if not filename:
        return jsonify({"error": "No filename provided"}), 400

    print(f"Sending email with attachment: {filename}")

    return jsonify({"message": "Email sent successfully."}), 200

if __name__ == '__main__':
    app.run(debug=True)
