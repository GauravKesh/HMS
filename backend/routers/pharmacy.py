# routers/pharmacy.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import SessionLocal
import models
import schemas

router = APIRouter(prefix="/pharmacy", tags=["pharmacy"])

def get_db():
    db = SessionLocal()
    try: yield db
    finally: db.close()

# ---------- MEDICINES ----------
@router.post("/medicines", response_model=schemas.MedicineOut)
def create_medicine(payload: schemas.MedicineCreate, db: Session = Depends(get_db)):
    med = models.PharmacyMedicine(**payload.dict())
    db.add(med)
    db.commit()
    db.refresh(med)
    return med

@router.get("/medicines", response_model=list[schemas.MedicineOut])
def list_medicines(db: Session = Depends(get_db)):
    return db.query(models.PharmacyMedicine).all()

@router.get("/medicines/{id}", response_model=schemas.MedicineOut)
def get_medicine(id: str, db: Session = Depends(get_db)):
    med = db.get(models.PharmacyMedicine, id)
    if not med:
        raise HTTPException(404, "Medicine not found")
    return med

@router.put("/medicines/{id}", response_model=schemas.MedicineOut)
def update_medicine(id: str, payload: schemas.MedicineCreate, db: Session = Depends(get_db)):
    med = db.get(models.PharmacyMedicine, id)
    if not med:
        raise HTTPException(404, "Medicine not found")
    for k,v in payload.dict().items():
        setattr(med, k, v)
    db.commit()
    db.refresh(med)
    return med

@router.delete("/medicines/{id}")
def delete_medicine(id: str, db: Session = Depends(get_db)):
    med = db.get(models.PharmacyMedicine, id)
    if not med:
        raise HTTPException(404, "Medicine not found")
    db.delete(med)
    db.commit()
    return {"message": "Medicine deleted successfully"}

# ---------- SALES ----------
@router.post("/sell", response_model=schemas.PharmacySaleOut)
def sell_medicine(payload: schemas.PharmacySaleCreate, db: Session = Depends(get_db)):
    med = db.get(models.PharmacyMedicine, payload.medicine_id)
    if not med:
        raise HTTPException(404, "Medicine not found")

    if med.stock < payload.quantity:
        raise HTTPException(400, "Not enough stock")

    total = float(med.price) * payload.quantity

    sale = models.PharmacySale(
        patient_id=payload.patient_id,
        medicine_id=payload.medicine_id,
        quantity=payload.quantity,
        total_amount=total
    )

    med.stock -= payload.quantity

    db.add(sale)
    db.commit()
    db.refresh(sale)

    return sale

@router.get("/sales", response_model=list[schemas.PharmacySaleOut])
def list_sales(db: Session = Depends(get_db)):
    return db.query(models.PharmacySale).all()
