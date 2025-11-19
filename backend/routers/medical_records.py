# routers/medical_records.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import SessionLocal
import schemas
import models

router = APIRouter(prefix="/records", tags=["medical_records"])

def get_db():
    db = SessionLocal()
    try: yield db
    finally: db.close()

@router.post("/", response_model=schemas.MedicalRecordOut)
def create_record(payload: schemas.MedicalRecordCreate, db: Session = Depends(get_db)):
    if not db.get(models.Patient, payload.patient_id):
        raise HTTPException(404, "Patient not found")

    record = models.MedicalRecord(**payload.dict())
    db.add(record)
    db.commit()
    db.refresh(record)
    return record

@router.get("/", response_model=list[schemas.MedicalRecordOut])
def get_all_records(db: Session = Depends(get_db)):
    return db.query(models.MedicalRecord).all()

@router.get("/{id}", response_model=schemas.MedicalRecordOut)
def get_record(id: str, db: Session = Depends(get_db)):
    record = db.get(models.MedicalRecord, id)
    if not record:
        raise HTTPException(404, "Record not found")
    return record

@router.put("/{id}", response_model=schemas.MedicalRecordOut)
def update_record(id: str, payload: schemas.MedicalRecordCreate, db: Session = Depends(get_db)):
    record = db.get(models.MedicalRecord, id)
    if not record:
        raise HTTPException(404, "Record not found")
    for key, value in payload.dict().items():
        setattr(record, key, value)
    db.commit()
    db.refresh(record)
    return record

@router.delete("/{id}")
def delete_record(id: str, db: Session = Depends(get_db)):
    record = db.get(models.MedicalRecord, id)
    if not record:
        raise HTTPException(404, "Record not found")
    db.delete(record)
    db.commit()
    return {"message": "Record deleted successfully"}
