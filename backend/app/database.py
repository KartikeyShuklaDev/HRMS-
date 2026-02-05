from pymongo import MongoClient
from pymongo.server_api import ServerApi
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Get MongoDB connection string from environment variable
# Fallback to local MongoDB for development
MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://127.0.0.1:27017")

# Configure MongoDB client with server API for Atlas
try:
    if "mongodb+srv" in MONGODB_URL:
        # MongoDB Atlas connection with stable API
        client = MongoClient(
            MONGODB_URL,
            server_api=ServerApi('1'),
            tlsAllowInvalidCertificates=False
        )
    else:
        # Local MongoDB connection
        client = MongoClient(MONGODB_URL)
    
    # Test the connection
    client.admin.command('ping')
    print(f"✓ Successfully connected to MongoDB!")
    
except Exception as e:
    print(f"✗ MongoDB connection error: {e}")
    raise

db = client["hrms_lite"]

employee_collection = db["employees"]
attendance_collection = db["attendance"]

# Create indexes for better performance
try:
    employee_collection.create_index("employee_id", unique=True)
    employee_collection.create_index("email", unique=True)
    attendance_collection.create_index([("employee_id", 1), ("date", 1)], unique=True)
    print("✓ Database indexes created successfully!")
except Exception as e:
    print(f"Note: Indexes may already exist - {e}")

