import os
import smtplib
from email.message import EmailMessage

from dotenv import load_dotenv
from flask import Flask, jsonify, request

load_dotenv()

app = Flask(__name__, static_url_path='', static_folder='.')


@app.after_request
def add_cors_headers(response):
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type'
    return response


@app.route('/')
def index():
    return app.send_static_file('index.html')


@app.route('/send-email', methods=['OPTIONS'])
def send_email_options():
    return '', 204


@app.route('/send-email', methods=['POST'])
def send_email():
    payload = request.get_json(silent=True) or {}

    restaurant = payload.get('restaurant', 'Selected restaurant')
    selected_date = payload.get('date', 'Not set')
    selected_time = payload.get('time', 'Not set')
    custom_message = payload.get('message') or ''

    email_to = (os.getenv('EMAIL_TO', 'mihaicojocaru962@gmail.com') or '').strip()
    email_from = (os.getenv('EMAIL_FROM') or os.getenv('GMAIL_USER') or '').strip()
    email_password = (os.getenv('EMAIL_PASSWORD') or os.getenv('GMAIL_APP_PASSWORD') or '').strip()
    email_password = ''.join(email_password.split())

    if not email_from or not email_password:
        return jsonify({
            'ok': False,
            'error': 'Email is not configured. Set EMAIL_FROM and EMAIL_PASSWORD (or GMAIL_USER and GMAIL_APP_PASSWORD) before sending.'
        }), 503

    body_lines = [
        f"Restaurant: {restaurant}",
        f"Date: {selected_date}",
        f"Time: {selected_time}"
    ]

    if custom_message.strip():
        body_lines.append('')
        body_lines.append(custom_message.strip())

    body = '\n'.join(body_lines)

    message = EmailMessage()
    message['Subject'] = 'Date plan for Monique'
    message['From'] = email_from
    message['To'] = email_to
    message.set_content(body)

    try:
        with smtplib.SMTP_SSL('smtp.gmail.com', 465) as server:
            server.login(email_from, email_password)
            server.send_message(message)

        return jsonify({
            'ok': True,
            'message': 'Email sent successfully.'
        })
    except Exception as exc:
        return jsonify({
            'ok': False,
            'error': f'Could not send email: {exc}'
        }), 500


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
