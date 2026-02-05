from pydantic import BaseModel, EmailStr, Field, field_validator, ConfigDict
from datetime import date as DateType
from typing import Optional
import re

class EmployeeCreate(BaseModel):
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "employee_id": "EMP001",
                "full_name": "John Doe",
                "email": "john.doe@company.com",
                "phone": "1234567890",
                "department": "Engineering"
            }
        }
    )
    
    employee_id: str = Field(..., description="Unique employee identifier")
    full_name: str = Field(..., min_length=2, max_length=100, description="Full name of employee")
    email: EmailStr = Field(..., description="Valid email address")
    phone: str = Field(..., description="10-digit phone number")
    department: str = Field(..., description="Department name")
    
    @field_validator('phone')
    @classmethod
    def validate_phone(cls, v):
        """Validate phone number format (10 digits)"""
        pattern = r'^[0-9]{10}$'
        if not re.match(pattern, v):
            raise ValueError('Phone number must be exactly 10 digits')
        return v
    
    @field_validator('employee_id')
    @classmethod
    def validate_employee_id(cls, v):
        """Validate employee ID format"""
        if not v or len(v.strip()) == 0:
            raise ValueError('Employee ID cannot be empty')
        return v.strip()
    
    @field_validator('full_name')
    @classmethod
    def validate_full_name(cls, v):
        """Validate full name"""
        if not v or len(v.strip()) < 2:
            raise ValueError('Full name must be at least 2 characters')
        return v.strip()
    
    @field_validator('department')
    @classmethod
    def validate_department(cls, v):
        """Validate department"""
        allowed_departments = ['HR', 'Engineering', 'Sales', 'Marketing', 'Finance', 'Operations']
        if v not in allowed_departments:
            raise ValueError(f'Department must be one of: {", ".join(allowed_departments)}')
        return v

class AttendanceCreate(BaseModel):
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "employee_id": "EMP001",
                "date": "2026-02-05",
                "status": "Present"
            }
        }
    )
    
    employee_id: str = Field(..., description="Employee ID")
    date: DateType = Field(..., description="Attendance date")
    status: str = Field(..., description="Present or Absent")
    
    @field_validator('status')
    @classmethod
    def validate_status(cls, v):
        """Validate attendance status"""
        allowed_statuses = ['Present', 'Absent']
        if v not in allowed_statuses:
            raise ValueError(f'Status must be either "Present" or "Absent"')
        return v
    
    @field_validator('date')
    @classmethod
    def validate_date_not_future(cls, v):
        """Validate that the date is not in the future"""
        from datetime import date as today_date
        today = today_date.today()
        if v > today:
            raise ValueError('Attendance date cannot be in the future')
        return v

class AttendanceUpdate(BaseModel):
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "status": "Present"
            }
        }
    )
    
    status: str = Field(..., description="Present or Absent")
    
    @field_validator('status')
    @classmethod
    def validate_status(cls, v):
        """Validate attendance status"""
        allowed_statuses = ['Present', 'Absent']
        if v not in allowed_statuses:
            raise ValueError(f'Status must be either "Present" or "Absent"')
        return v


