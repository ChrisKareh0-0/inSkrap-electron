from flask import Flask, request, jsonify
from flask_cors import CORS
from googleMaps_Scrape import scrape_google_maps  # Ensure this module exists
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_pymongo import PyMongo
from bson.objectid import ObjectId

app = Flask(__name__)
CORS(app)  # Allow cross-origin requests

# Corrected configuration key and URI scheme
app.config['MONGO_URI'] = 'mongodb://localhost:27017/authDB'
app.config['JWT_SECRET_KEY'] = 'your-secret-key'  # Change this to a strong secret in production

mongo = PyMongo(app)
bcrypt = Bcrypt(app)
jwt = JWTManager(app)

users_collection = mongo.db.users
history_collection = mongo.db.history


@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    first_name = data.get('first_name')
    last_name = data.get('last_name')
    email = data.get('email')
    password = data.get('password')

    if users_collection.find_one({"email": email}):
        return jsonify({'message': 'User already exists'}), 400

    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
    new_user = {
        "first_name": first_name,
        "last_name": last_name,
        "email": email,
        "password": hashed_password
    }

    users_collection.insert_one(new_user)
    return jsonify({'message': 'User registered successfully'}), 201

# User Login Endpoint
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    # Find user in MongoDB
    user = users_collection.find_one({"email": email})

    # Validate user credentials
    if not user or not bcrypt.check_password_hash(user['password'], password):
        return jsonify({'message': 'Invalid email or password'}), 401

    # Create JWT token for the logged-in user
    access_token = create_access_token(identity={'email': user['email'], 'id': str(user['_id'])})
    return jsonify({'access_token': access_token}), 200

@app.route('/protected', methods=['GET'])
@jwt_required()
def protected():
    current_user = get_jwt_identity()
    return jsonify(logged_in_as=current_user), 200

@app.route('/scrape', methods=['POST'])
def scrape():
    data = request.get_json()
    keyword = data.get('keyword')
    location = data.get('location')
    user = get_jwt_identity()
    user_id = user['id']

    if not keyword or not location:
        return jsonify({'message': 'Keyword and location are required'}), 400

    try:
        results = scrape_google_maps(keyword, location, user_id)
        return jsonify(results), 200
    except Exception as e:
        print(f"Error during scraping: {e}")
        return jsonify({'message': 'An error occurred during scraping'}), 500
    
def get_history():
    user = get_jwt_identity()
    user_id = user['id']

    history_entries = history_collection.find({'user_id': user_id}).sort('timestamp', -1)
    history_list = []
    for entry in history_entries:
        history_list.append({
            'keyword': entry['keyword'],
            'location': entry['location'],
            'search_query': entry['search_query'],
            'results': entry['results'],
            'timestamp': entry['timestamp']
        })

    return jsonify(history_list), 200
