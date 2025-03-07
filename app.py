from flask import Flask, request, jsonify
from flask_cors import CORS  
from lastfm import get_song_metadata
from gemini_api_helper import get_movie_recommendations
from dotenv import load_dotenv 
import os 

load_dotenv()

app = Flask(__name__)
CORS(app)  

@app.route('/recommend', methods=['GET', 'POST'])
def recommend():
    if request.method == 'GET':
        return "This endpoint accepts POST requests with JSON: { 'song_query': 'Your Song' }"

    data = request.get_json()
    song_query = data.get('song_query')
    
    if not song_query:
        return jsonify({'error': 'No song query provided'}), 400

    try:
        metadata = get_song_metadata(song_query)
    except Exception as e:
        return jsonify({'error': f"Error fetching song metadata: {str(e)}"}), 500

    try:
        recommendations = get_movie_recommendations(metadata)
    except Exception as e:
        return jsonify({'error': f"Error generating movie recommendations: {str(e)}"}), 500

    return jsonify({'recommendations': recommendations})

@app.route('/', methods=['GET'])
def home():
    return "Hello! This is the root. Go to /recommend with a POST request to get recommendations."

if __name__ == '__main__':
    app.run(debug=True)
