from flask import Flask, render_template, request, redirect, url_for, flash
from flask_pymongo import PyMongo
from werkzeug.security import generate_password_hash, check_password_hash
from flask_mail import Mail, Message
import os

app = Flask(__name__)
app.secret_key = "your_secret_key"

# MongoDB setup
app.config["MONGO_URI"] = "mongodb://localhost:27018/mydatabase"  # Use your MongoDB URI
mongo = PyMongo(app)

# Mail setup for password reset
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USERNAME'] = 'kennykipc@gmail.com'
app.config['MAIL_PASSWORD'] = 'jfxf gvtb kric eegz'
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USE_SSL'] = False
mail = Mail(app)

# Routes
@app.route('/signup', methods=['GET', 'POST'])
def signup():
    if request.method == 'POST':
        username = request.form['username']
        email = request.form['email']
        password = generate_password_hash(request.form['password'])
        # Check if user exists
        if mongo.db.users.find_one({'email': email}):
            flash('Email already exists!')
            return redirect(url_for('signup'))
        # Insert new user
        mongo.db.users.insert_one({'username': username, 'email': email, 'password': password})
        flash('Signup successful!')
        return redirect(url_for('login'))
    return render_template('signup.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']
        user = mongo.db.users.find_one({'email': email})
        if user and check_password_hash(user['password'], password):
            flash('Login successful!')
            return redirect(url_for('dashboard'))
        else:
            flash('Invalid email or password!')
    return render_template('login.html')

@app.route('/reset_password', methods=['GET', 'POST'])
def reset_password():
    if request.method == 'POST':
        email = request.form['email']
        user = mongo.db.users.find_one({'email': email})
        if user:
            token = os.urandom(24).hex()  # Simple token generation
            msg = Message('Reset Your Password', sender='your-email@gmail.com', recipients=[email])
            msg.body = f'Use the following link to reset your password: http://localhost:5000/reset/{token}'
            mail.send(msg)
            flash('Password reset link has been sent to your email!')
        else:
            flash('Email not found!')
    return render_template('reset_password.html')

@app.route('/dashboard')
def dashboard():
    return 'Welcome to your dashboard!'

if __name__ == '__main__':
    app.run(debug=True)
