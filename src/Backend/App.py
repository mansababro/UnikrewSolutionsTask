from flask import Flask, request, jsonify
import pandas as pd
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from reportlab.lib import colors
from flask_mail import Mail, Message
from pymongo import MongoClient
import io

app = Flask(__name__)

# Configure Flask-Mail
app.config['MAIL_SERVER'] = 'smtp.example.com'  # Update this
app.config['MAIL_PORT'] = 587
app.config['MAIL_USERNAME'] = 'your_email@example.com'  # Update this
app.config['MAIL_PASSWORD'] = 'your_password'  # Update this
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USE_SSL'] = False

mail = Mail(app)

# Configure MongoDB
client = MongoClient('your_mongo_db_connection_string')  # Update this
db = client['salary_slip_db']
collection = db['logs']

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    try:
        df = pd.read_excel(file)
    except Exception as e:
        return jsonify({"error": f"Failed to read Excel file: {str(e)}"}), 500

    logs = []

    for _, row in df.iterrows():
        try:
            # Extract salary information
            employee_id = row['Employee ID']
            employee_name = row['Name']
            email = row['Email']
            salary = row['Salary']
            designation = row['Designation']

            # Generate PDF salary slip
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

            # Store PDF in MongoDB
            pdf_data = pdf_buffer.getvalue()
            collection.insert_one({
                "employee_id": employee_id,
                "employee_name": employee_name,
                "email": email,
                "pdf": pdf_data,
                "status": "pending"
            })
        except Exception as e:
            logs.append({
                "employee_id": employee_id,
                "employee_name": employee_name,
                "status": "error",
                "error": str(e)
            })

    if logs:
        collection.insert_many(logs)
    return jsonify({"message": "PDFs generated and stored in MongoDB.", "errors": logs}), 200

@app.route('/send_emails', methods=['POST'])
def send_emails():
    try:
        pending_logs = collection.find({"status": "pending"})
        for log in pending_logs:
            email = log['email']
            pdf_data = log['pdf']
            employee_name = log['employee_name']

            # Send email with salary slip
            msg = Message(subject="Your Salary Slip", sender="your_email@example.com", recipients=[email])
            msg.body = "Please find attached your salary slip."
            msg.attach(f"{employee_name}_Salary_Slip.pdf", "application/pdf", pdf_data)
            mail.send(msg)

            # Update status in MongoDB
            collection.update_one({"_id": log['_id']}, {"$set": {"status": "sent"}})

        return jsonify({"message": "Emails sent successfully."}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
