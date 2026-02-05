import uvicorn
import sys

if __name__ == "__main__":
    print("Starting HRMS Backend Server...")
    sys.path.insert(0, r"c:\FluProject\hrms-lite\backend")
    
    uvicorn.run(
        "app.main:app",
        host="127.0.0.1",
        port=8000,
        reload=False,
        log_level="info"
    )
