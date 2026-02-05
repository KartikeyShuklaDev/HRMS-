from fastapi import APIRouter, HTTPException
from app.database import employee_collection
from app.schemas import EmployeeCreate
import random
import string

router = APIRouter(prefix="/employees", tags=["Employees"])

# Predefined list of departments
PREDEFINED_DEPARTMENTS = [
    "Human Resources",
    "Engineering",
    "Sales",
    "Marketing",
    "Finance",
    "Operations",
    "Customer Support",
    "IT",
    "Research & Development",
    "Administration",
    "Legal",
    "Product Management"
]

def generate_unique_employee_id(full_name: str) -> str:
    """Generate a unique employee ID based on name and random numbers"""
    # Extract initials from the name
    name_parts = full_name.strip().split()
    if len(name_parts) >= 2:
        # Use first 2 letters of first name + first 2 letters of last name
        prefix = (name_parts[0][:2] + name_parts[-1][:2]).upper()
    else:
        # Use first 4 letters of the single name
        prefix = name_parts[0][:4].upper()
    
    # Generate unique ID with random numbers
    max_attempts = 100
    for _ in range(max_attempts):
        # Generate 4 random digits
        random_suffix = ''.join(random.choices(string.digits, k=4))
        employee_id = f"{prefix}{random_suffix}"
        
        # Check if ID already exists
        if not employee_collection.find_one({"employee_id": employee_id}):
            return employee_id
    
    # If still not unique after max attempts, add extra random characters
    random_suffix = ''.join(random.choices(string.digits, k=6))
    return f"{prefix}{random_suffix}"

@router.post("/generate-id")
def generate_employee_id(request: dict):
    """Generate a unique employee ID based on the provided name"""
    full_name = request.get("full_name", "")
    if not full_name or len(full_name.strip()) < 2:
        raise HTTPException(status_code=400, detail="Full name must be at least 2 characters")
    
    employee_id = generate_unique_employee_id(full_name)
    return {"employee_id": employee_id}

@router.get("/departments")
def get_departments():
    """Get list of predefined departments"""
    return {"departments": PREDEFINED_DEPARTMENTS}

@router.post("/")
def add_employee(employee: EmployeeCreate):
    # Validate phone number format
    if not EmployeeCreate.validate_phone(employee.phone):
        raise HTTPException(status_code=400, detail="Phone number must be exactly 10 digits")
    
    # Validate department
    if employee.department not in PREDEFINED_DEPARTMENTS:
        raise HTTPException(status_code=400, detail=f"Invalid department. Must be one of: {', '.join(PREDEFINED_DEPARTMENTS)}")
    
    # Check for duplicate employee ID
    if employee_collection.find_one({"employee_id": employee.employee_id}):
        raise HTTPException(status_code=409, detail="Employee ID already exists")

    # Check for duplicate email (case-insensitive)
    if employee_collection.find_one({"email": {"$regex": f"^{employee.email}$", "$options": "i"}}):
        raise HTTPException(status_code=409, detail="Email already exists")
    
    # Check for duplicate phone number
    if employee_collection.find_one({"phone": employee.phone}):
        raise HTTPException(status_code=409, detail="Phone number already exists")

    employee_collection.insert_one(employee.dict())
    return {"message": "Employee added successfully"}

@router.get("/")
def get_employees():
    employees = list(employee_collection.find({}, {"_id": 0}))
    return employees

@router.delete("/{employee_id}")
def delete_employee(employee_id: str):
    result = employee_collection.delete_one({"employee_id": employee_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Employee not found")
    return {"message": "Employee deleted successfully"}
