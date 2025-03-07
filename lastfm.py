import requests
from dotenv import load_dotenv
import os

load_dotenv() 
LASTFM_API_KEY = os.getenv('LASTFM_API_KEY')  

BASE_URL = "http://ws.audioscrobbler.com/2.0/"

def search_track(track_query):
    params = {
        "method": "track.search",
        "track": track_query,
        "api_key": LASTFM_API_KEY,
        "format": "json",
        "limit": 1
    }
    response = requests.get(BASE_URL, params=params)
    if response.status_code != 200:
        raise Exception(f"Error searching for track: {response.status_code}, {response.text}")
   
    data = response.json()
    trackmatches = data.get("results", {}).get("trackmatches", {}).get("track", [])
    if not trackmatches:
        raise Exception("No track found for the query")
   
    return trackmatches[0]

def get_track_info(artist, track):
    params = {
        "method": "track.getInfo",
        "artist": artist,
        "track": track,
        "api_key": LASTFM_API_KEY,
        "format": "json"
    }
    response = requests.get(BASE_URL, params=params)
    if response.status_code != 200:
        raise Exception(f"Error fetching track info: {response.status_code}, {response.text}")
   
    data = response.json()
    if "track" not in data:
        raise Exception("Track info not found")
   
    return data["track"]

def get_song_metadata(song_query):
    basic_track = search_track(song_query)
    track_name = basic_track.get("name")
    artist_name = basic_track.get("artist")
   
    track_info = get_track_info(artist_name, track_name)
   
    album = None
    if "album" in track_info and track_info["album"]:
        album = track_info["album"].get("title")
   
    tags = []
    if "toptags" in track_info and "tag" in track_info["toptags"]:
        for tag in track_info["toptags"]["tag"]:
            tags.append(tag.get("name"))
   
    wiki = None
    if "wiki" in track_info:
        wiki = track_info["wiki"].get("summary")
   
    metadata = {
        "name": track_name,
        "artist": artist_name,
        "album": album,
        "tags": tags,
        "wiki": wiki
    }
    return metadata
