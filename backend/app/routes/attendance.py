from fastapi import APIRouter, HTTPException, Query
from app.database import attendance_collection, employee_collection
from app.schemas import AttendanceCreate, AttendanceUpdate
from datetime import date as date_class

router = APIRouter(prefix="/attendance", tags=["Attendance"])

@router.post("/")
def mark_attendance(attendance: AttendanceCreate):
    # Check if date is not in the future
    if not AttendanceUpdate.validate_date_not_future(attendance.date):
        raise HTTPException(status_code=400, detail="Cannot mark attendance for future dates")
    
    if not employee_collection.find_one({"employee_id": attendance.employee_id}):
        raise HTTPException(status_code=404, detail="Employee not found")

    if attendance.status not in ["Present", "Absent"]:
        raise HTTPException(status_code=400, detail="Invalid attendance status")

    # Check if attendance already exists for this employee and date
    existing = attendance_collection.find_one({
        "employee_id": attendance.employee_id,
        "date": str(attendance.date)
    })
    
    if existing:
        raise HTTPException(status_code=409, detail="Attendance already marked for this date. Use update endpoint to modify.")

    attendance_dict = attendance.dict()
    attendance_dict["date"] = str(attendance.date)
    attendance_collection.insert_one(attendance_dict)
    return {"message": "Attendance marked successfully"}

@router.put("/{employee_id}/{date}")
def update_attendance(employee_id: str, date: str, attendance: AttendanceUpdate):
    """Update attendance for a specific employee and date (only past and current dates)"""
    try:
        # Parse the date
        attendance_date = date_class.fromisoformat(date)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid date format. Use YYYY-MM-DD")
    
    # Check if date is not in the future
    if not AttendanceUpdate.validate_date_not_future(attendance_date):
        raise HTTPException(status_code=400, detail="Cannot edit attendance for future dates")
    
    # Check if employee exists
    if not employee_collection.find_one({"employee_id": employee_id}):
        raise HTTPException(status_code=404, detail="Employee not found")
    
    # Validate status
    if attendance.status not in ["Present", "Absent"]:
        raise HTTPException(status_code=400, detail="Invalid attendance status")
    
    # Update the attendance record
    result = attendance_collection.update_one(
        {"employee_id": employee_id, "date": date},
        {"$set": {"status": attendance.status}}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Attendance record not found for this employee and date")
    
    return {"message": "Attendance updated successfully"}

@router.get("/{employee_id}")
def get_attendance(
    employee_id: str,
    date: str | None = Query(default=None)
):
    if not employee_collection.find_one({"employee_id": employee_id}):
        raise HTTPException(status_code=404, detail="Employee not found")

    query = {"employee_id": employee_id}
    if date:
        query["date"] = date

    records = list(attendance_collection.find(query, {"_id": 0}))
    total_present_days = sum(
        1 for record in records if record["status"] == "Present"
    )

    return {
        "records": records,
        "total_present_days": total_present_days
    }
