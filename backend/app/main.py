from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes.employees import router as employee_router
from app.routes.attendance import router as attendance_router
from app.routes.dashboard import router as dashboard_router

app = FastAPI(title="HRMS Lite")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

app.include_router(employee_router)
app.include_router(attendance_router)
app.include_router(dashboard_router)

@app.get("/")
def root():
    return {"message": "HRMS Lite backend running"}
