from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

# ✅ FIX: Use absolute imports instead of relative imports
from database import SessionLocal
import models
import schemas

router = APIRouter(prefix="/patients", tags=["patients"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/", response_model=schemas.PatientOut)
def create_patient(payload: schemas.PatientCreate, db: Session = Depends(get_db)):
    patient = models.Patient(**payload.dict())
    db.add(patient)
    db.commit()
    db.refresh(patient)
    return patient


@router.get("/", response_model=list[schemas.PatientOut])
def get_all_patients(db: Session = Depends(get_db)):
    return db.query(models.Patient).all()


@router.get("/{id}", response_model=schemas.PatientOut)
def get_patient(id: str, db: Session = Depends(get_db)):
    patient = db.get(models.Patient, id)
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    return patient


@router.put("/{id}", response_model=schemas.PatientOut)
def update_patient(id: str, payload: schemas.PatientCreate, db: Session = Depends(get_db)):
    patient = db.get(models.Patient, id)
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")

    for key, value in payload.dict().items():
        setattr(patient, key, value)

    db.commit()
    db.refresh(patient)
    return patient


@router.delete("/{id}")
def delete_patient(id: str, db: Session = Depends(get_db)):
    patient = db.get(models.Patient, id)
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")

    db.delete(patient)
    db.commit()
    return {"message": "Patient deleted successfully"}
