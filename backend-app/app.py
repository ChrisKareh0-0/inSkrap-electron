from flask import Flask, request, jsonify
from flask_cors import CORS
from googleMaps_Scrape import scrape_google_maps  # Make sure this module exists

app = Flask(__name__)
CORS(app)  # Allow cross-origin requests

@app.route('/scrape', methods=['POST'])
def scrape():
    data = request.json
    keyword = data.get('keyword')
    location = data.get('location')

    # Construct the search query
    search_query = f"{keyword} in {location}"
    
    # Collect the results in a list
    results = list(scrape_google_maps(search_query))
    
    # Return all results at once
    return jsonify(results)

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=5000, debug=True)
