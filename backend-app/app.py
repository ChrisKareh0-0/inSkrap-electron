from flask import Flask, request
from flask_cors import CORS
from flask_socketio import SocketIO
from googleMaps_Scrape import scrape_google_maps

app = Flask(__name__)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")

@app.route('/scrape', methods=['POST'])
def scrape():
    data = request.json
    keyword = data.get('keyword')
    location = data.get('location')

    search_query = f"{keyword} in {location}"
    
    for result in scrape_google_maps(search_query):
        socketio.emit('new_data', result)
    
    return {"status": "Scraping started"}

if __name__ == '__main__':
    socketio.run(app, host='127.0.0.1', port=5000, debug=True, allow_unsafe_werkzeug=True)
