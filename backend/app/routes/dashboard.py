from fastapi import APIRouter, HTTPException
from app.database import employee_collection, attendance_collection, db
from datetime import datetime, timedelta

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])

@router.get("/stats")
def get_dashboard_stats():
    """Get dashboard statistics"""
    if employee_collection is None or attendance_collection is None:
        # Return demo data when database is not available
        return {
            "total_employees": 2,
            "total_attendance_records": 10,
            "total_present": 8,
            "total_absent": 2,
            "present_today": 2,
            "absent_today": 0,
            "attendance_rate": 80.0,
            "present_this_month": 8,
            "absent_this_month": 2,
            "message": "Demo data - Database not connected"
        }
    
    try:
        # Total employees
        total_employees = employee_collection.count_documents({})
        
        # Total attendance records
        total_attendance_records = attendance_collection.count_documents({})
        
        # Present/Absent counts (all time)
        total_present = attendance_collection.count_documents({"status": "Present"})
        total_absent = attendance_collection.count_documents({"status": "Absent"})
        
        # Today's attendance
        today = datetime.now().date().isoformat()
        today_present = attendance_collection.count_documents({"status": "Present", "date": today})
        today_absent = attendance_collection.count_documents({"status": "Absent", "date": today})
        today_total = today_present + today_absent
        
        # Department wise employee count
        pipeline = [
            {"$group": {"_id": "$department", "count": {"$sum": 1}}},
            {"$sort": {"count": -1}}
        ]
        department_counts = list(employee_collection.aggregate(pipeline))
        department_stats = [{"department": item["_id"], "count": item["count"]} for item in department_counts]
        
        # Recent attendance (last 7 days)
        seven_days_ago = (datetime.now().date() - timedelta(days=7)).isoformat()
        recent_attendance = list(attendance_collection.find(
            {"date": {"$gte": seven_days_ago}},
            {"_id": 0}
        ).sort("date", -1).limit(10))
        
        # Attendance rate calculation
        attendance_rate = 0
        if total_attendance_records > 0:
            attendance_rate = round((total_present / total_attendance_records) * 100, 2)
        
        return {
            "total_employees": total_employees,
            "total_attendance_records": total_attendance_records,
            "total_present": total_present,
            "total_absent": total_absent,
            "attendance_rate": attendance_rate,
            "today": {
                "date": today,
                "present": today_present,
                "absent": today_absent,
                "total": today_total,
                "attendance_rate": round((today_present / today_total * 100), 2) if today_total > 0 else 0
            },
            "department_stats": department_stats,
            "recent_attendance": recent_attendance
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching dashboard stats: {str(e)}")

@router.get("/test")
def test_endpoint():
    """Simple test endpoint"""
    return {"message": "Test endpoint works"}

@router.get("/employees")
def get_employee_dashboard():
    """Get dashboard with individual employee summaries"""
    try:
        # Get all employees
        employees = list(employee_collection.find({}, {"_id": 0}))
        
        employee_summaries = []
        today = datetime.now().date().isoformat()
        seven_days_ago = (datetime.now().date() - timedelta(days=7)).isoformat()
        
        for emp in employees:
            emp_id = emp.get("employee_id")
            if not emp_id:
                continue
            
            # Get attendance stats
            all_attendance = list(attendance_collection.find({"employee_id": emp_id}, {"_id": 0}))
            total_records = len(all_attendance)
            present_count = len([r for r in all_attendance if r.get("status") == "Present"])
            absent_count = total_records - present_count
            
            attendance_rate = round((present_count / total_records) * 100, 2) if total_records > 0 else 0
            
            # Today's status
            today_rec = attendance_collection.find_one({"employee_id": emp_id, "date": today}, {"_id": 0})
            today_status = today_rec.get("status") if today_rec else "Not Marked"
            
            # Recent records
            recent = list(attendance_collection.find(
                {"employee_id": emp_id, "date": {"$gte": seven_days_ago}},
                {"_id": 0}
            ).sort("date", -1).limit(5))
            
            employee_summaries.append({
                "employee_id": str(emp_id),
                "full_name": str(emp.get("full_name", "Unknown")),
                "email": str(emp.get("email", "")),
                "phone": str(emp.get("phone", "")),
                "department": str(emp.get("department", "Unknown")),
                "total_records": int(total_records),
                "present_count": int(present_count),
                "absent_count": int(absent_count),
                "attendance_rate": float(attendance_rate),
                "today_status": str(today_status),
                "recent_attendance": recent
            })
        
        employee_summaries.sort(key=lambda x: x["full_name"])
        
        return {
            "total_employees": len(employee_summaries),
            "employees": employee_summaries
        }
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))


