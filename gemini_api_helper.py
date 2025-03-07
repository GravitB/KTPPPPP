from google import genai
from dotenv import load_dotenv
import os

load_dotenv()

GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')

if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY is not set in the .env file.")

client = genai.Client(api_key=GEMINI_API_KEY)

def get_movie_recommendations(metadata):
    prompt = f"""
Given the following track details:
Song: {metadata.get('name')}
Artist: {metadata.get('artist')}
Album: {metadata.get('album')}
Tags: {', '.join(metadata.get('tags', []))}
Wiki Summary: {metadata.get('wiki')}

Based on this information, only output the title of 3 movies based on the genre, description, mood of the song separated on a new line for each. for each movie have a 1 concise description of what it is about and how it connects to the song and separate each movie with a new line. bold the movie titles. 

"""
    response = client.models.generate_content(
        model="gemini-2.0-flash",
        contents=prompt
    )
    return response.text
