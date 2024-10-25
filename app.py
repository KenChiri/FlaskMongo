from dotenv import load_dotenv
from flask import Flask, jsonify, request, flash
from flask_cors import CORS
from flask_pymongo import PyMongo
from werkzeug.security import generate_password_hash, check_password_hash
from flask_mail import Mail, Message

import os

app = Flask(__name__)
app.secret_key = "your_secret_key"

# Enable CORS for all routes and allow requests from the specific origin (your React app)
CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}})

# Load environment variables from .env file
load_dotenv()

# MongoDB setup
app.config["MONGO_URI"] = "mongodb://localhost:27018/mydatabase"  # Use your MongoDB URI
mongo = PyMongo(app)

# Mail setup for password reset
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USERNAME'] = os.getenv('MAIL_USERNAME')
app.config['MAIL_PASSWORD'] = os.getenv('MAIL_PASSWORD')
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USE_SSL'] = False
mail = Mail(app)

# Allow cross-origin requests from your React app running on localhost:5173
CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}})

# API Routes
@app.route('/api/signup', methods=['POST'])
def signup():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = generate_password_hash(data.get('password'))

    # Check if the user exists
    if mongo.db.users.find_one({'email': email}):
        return jsonify({'error': 'Email already exists!'}), 400

    # Insert new user into MongoDB
    mongo.db.users.insert_one({'username': username, 'email': email, 'password': password})
    return jsonify({'message': 'Signup successful!'}), 201


@app.route('/login', methods=['POST', 'OPTIONS'])
def login():
    if request.method == "OPTIONS":  # Handle the preflight request
        response = jsonify({'status': 'OK'})
        response.status_code = 200
        response.headers["Access-Control-Allow-Origin"] = "http://localhost:5173"
        response.headers["Access-Control-Allow-Methods"] = "POST, OPTIONS"
        response.headers["Access-Control-Allow-Headers"] = "Content-Type"
        return response

    # Process the POST request for login
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    # Check if the user exists in the database
    user = mongo.db.users.find_one({'email': email})

    if user and check_password_hash(user['password'], password):
        # If login is successful, return the username
        return jsonify({"message": "Login successful!", "username": user['username']}), 200
    else:
        # If credentials are invalid, return an error
        return jsonify({"error": "Invalid email or password!"}), 401

@app.route('/api/reset_password', methods=['POST'])
def reset_password():
    data = request.get_json()
    email = data.get('email')
    user = mongo.db.users.find_one({'email': email})

    if not user:
        return jsonify({'error': 'Email not found!'}), 404

    token = os.urandom(24).hex()  # Simple token generation (you can enhance it)
    mongo.db.users.update_one({'email': email}, {'$set': {'reset_token': token}})

    # Send password reset email
    msg = Message('Reset Your Password', sender=app.config['MAIL_USERNAME'], recipients=[email])
    msg.body = f'Click the link to reset your password: http://localhost:3000/reset/{token}'
    mail.send(msg)

    return jsonify({'message': 'Password reset link sent to your email!'}), 200


@app.route('/api/reset/<token>', methods=['POST'])
def reset_password_token(token):
    data = request.get_json()
    new_password = data.get('new_password')
    confirm_password = data.get('confirm_password')

    if new_password != confirm_password:
        return jsonify({'error': 'Passwords do not match!'}), 400

    # Check if the token exists and is valid
    user = mongo.db.users.find_one({'reset_token': token})

    if not user:
        return jsonify({'error': 'Invalid or expired token!'}), 400

    hashed_password = generate_password_hash(new_password)
    mongo.db.users.update_one({'reset_token': token}, {'$set': {'password': hashed_password, 'reset_token': None}})

    return jsonify({'message': 'Password reset successfully!'}), 200


# Run the app
if __name__ == '__main__':
    app.run(debug=True)
