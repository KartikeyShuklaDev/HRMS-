from pymongo import MongoClient
from pymongo.server_api import ServerApi
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Get MongoDB connection string from environment variable
MONGODB_URL = os.getenv("MONGODB_URL", "")

# Global variables
client = None
db = None
employee_collection = None
attendance_collection = None
connection_error = None  # Store the error for debugging

# Configure MongoDB client with server API for Atlas
if MONGODB_URL and "placeholder" not in MONGODB_URL.lower():
    try:
        if "mongodb+srv" in MONGODB_URL:
            # MongoDB Atlas connection with stable API
            client = MongoClient(
                MONGODB_URL,
                server_api=ServerApi('1'),
                tlsAllowInvalidCertificates=False,
                serverSelectionTimeoutMS=5000
            )
        else:
            # Local MongoDB connection
            client = MongoClient(MONGODB_URL, serverSelectionTimeoutMS=5000)
        
        # Test the connection
        client.admin.command('ping')
        print(f"✓ Successfully connected to MongoDB!")
        
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
            
    except Exception as e:
        connection_error = str(e)  # Store error for debugging
        print(f"✗ MongoDB connection error: {e}")
        print(f"✗ Error type: {type(e).__name__}")
        print("⚠ Running without database - API will return demo data")
else:
    print("⚠ No MongoDB URL configured - Running without database")

