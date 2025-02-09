from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import firebase_admin
from firebase_admin import credentials, db
import os

app = FastAPI()

origins = [
    "http://localhost:3000",    # React app
    "http://localhost:8000",    # FastAPI backend
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["*"],
    max_age=600,
)

# Initialize Firebase
try:
    cred = credentials.Certificate("./firebase-credentials.json")
    firebase_admin.initialize_app(cred, {
        'databaseURL': 'https://restaurant-allergy-manager-default-rtdb.firebaseio.com'  # Replace with your Firebase URL
    })
except Exception as e:
    print(f"Firebase initialization error: {e}")

# Import and include your router
from routes import router
app.include_router(router)

@app.get("/")
async def root():
    return {"message": "Restaurant Allergy Manager API"}