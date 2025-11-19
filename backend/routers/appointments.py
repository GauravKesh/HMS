# routers/appointments.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import SessionLocal
import schemas
import models


router = APIRouter(prefix="/appointments", tags=["appointments"])

def get_db():
    db = SessionLocal()
    try: yield db
    finally: db.close()

@router.post("/", response_model=schemas.AppointmentOut)
def create_appointment(payload: schemas.AppointmentCreate, db: Session = Depends(get_db)):
    if not db.get(models.Patient, payload.patient_id):
        raise HTTPException(404, "Patient not found")

    appointment = models.Appointment(**payload.dict())
    db.add(appointment)
    db.commit()
    db.refresh(appointment)
    return appointment

@router.get("/", response_model=list[schemas.AppointmentOut])
def get_all_appointments(db: Session = Depends(get_db)):
    return db.query(models.Appointment).all()

@router.get("/{id}", response_model=schemas.AppointmentOut)
def get_appointment(id: str, db: Session = Depends(get_db)):
    appt = db.get(models.Appointment, id)
    if not appt:
        raise HTTPException(404, "Appointment not found")
    return appt

@router.put("/{id}", response_model=schemas.AppointmentOut)
def update_appointment(id: str, payload: schemas.AppointmentCreate, db: Session = Depends(get_db)):
    appt = db.get(models.Appointment, id)
    if not appt:
        raise HTTPException(404, "Appointment not found")
    for key, value in payload.dict().items():
        setattr(appt, key, value)
    db.commit()
    db.refresh(appt)
    return appt

@router.patch("/{id}/status")
def update_status(id: str, status: str, db: Session = Depends(get_db)):
    appt = db.get(models.Appointment, id)
    if not appt:
        raise HTTPException(404, "Appointment not found")
    appt.status = status
    db.commit()
    db.refresh(appt)
    return {"message": "Status updated", "status": appt.status}

@router.delete("/{id}")
def delete_appointment(id: str, db: Session = Depends(get_db)):
    appt = db.get(models.Appointment, id)
    if not appt:
        raise HTTPException(404, "Appointment not found")
    db.delete(appt)
    db.commit()
    return {"message": "Appointment deleted successfully"}
