from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes.employees import router as employee_router
from app.routes.attendance import router as attendance_router
from app.routes.dashboard import router as dashboard_router
import os

app = FastAPI(title="HRMS Lite")

# Allow requests from frontend deployed on Vercel and localhost
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://frontend-eight-ruddy-r8d4dvbk5g.vercel.app",
        "https://*.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

app.include_router(employee_router)
app.include_router(attendance_router)
app.include_router(dashboard_router)

@app.get("/")
def root():
    return {"message": "HRMS Lite backend running", "status": "active"}

@app.get("/debug/db-status")
def debug_db_status():
    from app.database import employee_collection, attendance_collection, MONGODB_URL, connection_error
    return {
        "mongodb_url_set": MONGODB_URL is not None and MONGODB_URL != "",
        "mongodb_url_length": len(MONGODB_URL) if MONGODB_URL else 0,
        "mongodb_url_prefix": MONGODB_URL[:30] if MONGODB_URL else "",
        "has_placeholder": "placeholder" in MONGODB_URL.lower() if MONGODB_URL else False,
        "employee_collection_connected": employee_collection is not None,
        "attendance_collection_connected": attendance_collection is not None,
        "env_var_exists": "MONGODB_URL" in os.environ,
        "connection_error": connection_error
    }
