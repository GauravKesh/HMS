from pydantic import BaseModel
from typing import Optional
from uuid import UUID
from datetime import date, time, datetime

# UUID is stored as STRING in DB, but Pydantic can still treat it as UUID
# ----------------- PATIENTS -----------------
class PatientCreate(BaseModel):
    name: str
    dob: Optional[date] = None
    age: Optional[int] = None
    gender: Optional[str] = None
    address: Optional[str] = None
    phone: Optional[str] = None

class PatientOut(PatientCreate):
    id: str
    created_at: Optional[datetime]
    class Config:
        orm_mode = True

# ----------------- DOCTORS -----------------
class DoctorCreate(BaseModel):
    name: str
    specialization: str
    phone: Optional[str] = None
    room_no: Optional[str] = None

class DoctorOut(DoctorCreate):
    id: str
    class Config:
        orm_mode = True

# ----------------- APPOINTMENTS -----------------
class AppointmentCreate(BaseModel):
    patient_id: str
    doctor_id: Optional[str]
    appointment_date: date
    appointment_time: Optional[time]

class AppointmentOut(AppointmentCreate):
    id: str
    status: Optional[str]
    created_at: Optional[datetime]
    class Config:
        orm_mode = True

# ----------------- MEDICAL RECORDS -----------------
class MedicalRecordCreate(BaseModel):
    patient_id: str
    doctor_id: Optional[str]
    diagnosis: Optional[str]
    prescription: Optional[str]

class MedicalRecordOut(MedicalRecordCreate):
    id: str
    visit_date: Optional[datetime]
    class Config:
        orm_mode = True

# ----------------- BILLING -----------------
class BillingCreate(BaseModel):
    patient_id: str
    description: Optional[str]
    total_amount: float
    status: Optional[str] = "pending"

class BillingOut(BillingCreate):
    id: str
    created_at: Optional[datetime]
    class Config:
        orm_mode = True

# ----------------- MEDICINES -----------------
class MedicineCreate(BaseModel):
    name: str
    batch_no: Optional[str]
    stock: int
    price: float
    expiry_date: Optional[date]

class MedicineOut(MedicineCreate):
    id: str
    class Config:
        orm_mode = True

# ----------------- SALES -----------------
class PharmacySaleCreate(BaseModel):
    patient_id: Optional[str]
    medicine_id: str
    quantity: int

class PharmacySaleOut(PharmacySaleCreate):
    id: str
    total_amount: float
    sale_date: Optional[datetime]
    class Config:
        orm_mode = True

# ----------------- LAB TESTS -----------------
class LabTestCreate(BaseModel):
    test_name: str
    description: Optional[str]
    charges: float

class LabTestOut(LabTestCreate):
    id: str
    class Config:
        orm_mode = True

# ----------------- LAB REPORTS -----------------
class LabReportCreate(BaseModel):
    patient_id: str
    doctor_id: Optional[str]
    test_id: str

class LabReportOut(LabReportCreate):
    id: str
    result: Optional[str]
    test_date: Optional[datetime]
    status: Optional[str]
    class Config:
        orm_mode = True


# ----------------- LAB REPORT UPDATES -----------------
class StatusUpdate(BaseModel):
    status: str

class ResultUpdate(BaseModel):
    result: str
