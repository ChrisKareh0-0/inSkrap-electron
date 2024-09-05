from flask import Flask, request
from flask_cors import CORS
from flask_socketio import SocketIO
from googleMaps_Scrape import scrape_google_maps
import os
from dotenv import load_dotenv

load_dotenv()
node_env = os.getenv('NODE_ENV')

app = Flask(__name__)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")

@app.route('/scrape', methods=['POST'])
def scrape():
    data = request.json
    keyword = data.get('keyword')
    location = data.get('location')

    # Construct the search query
    search_query = f"{keyword} in {location}"
    
    # Start the scraping process
    for result in scrape_google_maps(search_query):
        socketio.emit('new_data', result)
    
    return {"status": "Scraping started"}

if __name__ == '__main__':
    if node_env == 'production':
        # Use a production WSGI server (e.g., Waitress) in production
        from waitress import serve
        serve(app, host='0.0.0.0', port=5000)
    else:
        # Use Flask-SocketIO's built-in server for development/testing
        socketio.run(app, debug=True, allow_unsafe_werkzeug=True)
