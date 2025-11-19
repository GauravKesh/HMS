# routers/doctors.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import SessionLocal
import models
import schemas

router = APIRouter(prefix="/doctors", tags=["doctors"])

def get_db():
    db = SessionLocal()
    try: yield db
    finally: db.close()

@router.post("/", response_model=schemas.DoctorOut)
def create_doctor(payload: schemas.DoctorCreate, db: Session = Depends(get_db)):
    doctor = models.Doctor(**payload.dict())
    db.add(doctor)
    db.commit()
    db.refresh(doctor)
    return doctor

@router.get("/", response_model=list[schemas.DoctorOut])
def get_all_doctors(db: Session = Depends(get_db)):
    return db.query(models.Doctor).all()

@router.get("/{id}", response_model=schemas.DoctorOut)
def get_doctor(id: str, db: Session = Depends(get_db)):
    doctor = db.get(models.Doctor, id)
    if not doctor:
        raise HTTPException(404, "Doctor not found")
    return doctor

@router.put("/{id}", response_model=schemas.DoctorOut)
def update_doctor(id: str, payload: schemas.DoctorCreate, db: Session = Depends(get_db)):
    doctor = db.get(models.Doctor, id)
    if not doctor:
        raise HTTPException(404, "Doctor not found")
    for key, value in payload.dict().items():
        setattr(doctor, key, value)
    db.commit()
    db.refresh(doctor)
    return doctor

@router.delete("/{id}")
def delete_doctor(id: str, db: Session = Depends(get_db)):
    doctor = db.get(models.Doctor, id)
    if not doctor:
        raise HTTPException(404, "Doctor not found")
    db.delete(doctor)
    db.commit()
    return {"message": "Doctor deleted successfully"}
