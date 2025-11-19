import uuid
from sqlalchemy import Column, String, Date, Integer, Text, Numeric, DateTime, Time, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from database import Base

def gen_uuid():
    return str(uuid.uuid4())

# Patients
class Patient(Base):
    __tablename__ = "patients"
    id = Column(String(36), primary_key=True, default=gen_uuid)
    name = Column(String(100), nullable=False)
    dob = Column(Date)
    age = Column(Integer)
    gender = Column(String(10))
    address = Column(Text)
    phone = Column(String(20), unique=True)
    created_at = Column(DateTime, server_default=func.now())

# Doctors
class Doctor(Base):
    __tablename__ = "doctors"
    id = Column(String(36), primary_key=True, default=gen_uuid)
    name = Column(String(100), nullable=False)
    specialization = Column(String(100), nullable=False)
    phone = Column(String(20), unique=True)
    room_no = Column(String(10))

# Appointments
class Appointment(Base):
    __tablename__ = "appointments"
    id = Column(String(36), primary_key=True, default=gen_uuid)
    patient_id = Column(String(36), ForeignKey("patients.id"), nullable=False)
    doctor_id = Column(String(36), ForeignKey("doctors.id"))
    appointment_date = Column(Date, nullable=False)
    appointment_time = Column(Time)
    status = Column(String(20), default="scheduled")
    created_at = Column(DateTime, server_default=func.now())

# Medical Records
class MedicalRecord(Base):
    __tablename__ = "medical_records"
    id = Column(String(36), primary_key=True, default=gen_uuid)
    patient_id = Column(String(36), ForeignKey("patients.id"), nullable=False)
    doctor_id = Column(String(36), ForeignKey("doctors.id"))
    diagnosis = Column(Text)
    prescription = Column(Text)
    visit_date = Column(DateTime, server_default=func.now())

# Billing
class Billing(Base):
    __tablename__ = "billing"
    id = Column(String(36), primary_key=True, default=gen_uuid)
    patient_id = Column(String(36), ForeignKey("patients.id"), nullable=False)
    description = Column(Text)
    total_amount = Column(Numeric(12,2), nullable=False)
    status = Column(String(20), default="pending")
    created_at = Column(DateTime, server_default=func.now())

# Pharmacy Medicines
class PharmacyMedicine(Base):
    __tablename__ = "pharmacy_medicines"
    id = Column(String(36), primary_key=True, default=gen_uuid)
    name = Column(String(100), nullable=False)
    batch_no = Column(String(50))
    stock = Column(Integer, nullable=False, default=0)
    price = Column(Numeric(10,2), nullable=False)
    expiry_date = Column(Date)

# Pharmacy Sales
class PharmacySale(Base):
    __tablename__ = "pharmacy_sales"
    id = Column(String(36), primary_key=True, default=gen_uuid)
    patient_id = Column(String(36), ForeignKey("patients.id"))
    medicine_id = Column(String(36), ForeignKey("pharmacy_medicines.id"), nullable=False)
    quantity = Column(Integer, nullable=False)
    total_amount = Column(Numeric(12,2), nullable=False)
    sale_date = Column(DateTime, server_default=func.now())

# Lab Tests
class LabTest(Base):
    __tablename__ = "lab_tests"
    id = Column(String(36), primary_key=True, default=gen_uuid)
    test_name = Column(String(100), nullable=False)
    description = Column(Text)
    charges = Column(Numeric(10,2), nullable=False)

# Lab Reports
class LabReport(Base):
    __tablename__ = "lab_reports"
    id = Column(String(36), primary_key=True, default=gen_uuid)
    patient_id = Column(String(36), ForeignKey("patients.id"), nullable=False)
    doctor_id = Column(String(36), ForeignKey("doctors.id"))
    test_id = Column(String(36), ForeignKey("lab_tests.id"), nullable=False)
    result = Column(Text)
    test_date = Column(DateTime, server_default=func.now())
    status = Column(String(20), default="pending")
