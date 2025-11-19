# routers/billing.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import SessionLocal
import models
import schemas

router = APIRouter(prefix="/billing", tags=["billing"])

def get_db():
    db = SessionLocal()
    try: yield db
    finally: db.close()

@router.post("/", response_model=schemas.BillingOut)
def create_bill(payload: schemas.BillingCreate, db: Session = Depends(get_db)):
    if not db.get(models.Patient, payload.patient_id):
        raise HTTPException(404, "Patient not found")

    bill = models.Billing(**payload.dict())
    db.add(bill)
    db.commit()
    db.refresh(bill)
    return bill

@router.get("/", response_model=list[schemas.BillingOut])
def get_bills(db: Session = Depends(get_db)):
    return db.query(models.Billing).all()

@router.get("/{id}", response_model=schemas.BillingOut)
def get_bill(id: str, db: Session = Depends(get_db)):
    bill = db.get(models.Billing, id)
    if not bill:
        raise HTTPException(404, "Bill not found")
    return bill

@router.put("/{id}", response_model=schemas.BillingOut)
def update_bill(id: str, payload: schemas.BillingCreate, db: Session = Depends(get_db)):
    bill = db.get(models.Billing, id)
    if not bill:
        raise HTTPException(404, "Bill not found")
    for k, v in payload.dict().items():
        setattr(bill, k, v)
    db.commit()
    db.refresh(bill)
    return bill

@router.patch("/{id}/status")
def update_bill_status(id: str, status: str, db: Session = Depends(get_db)):
    bill = db.get(models.Billing, id)
    if not bill:
        raise HTTPException(404, "Bill not found")
    bill.status = status
    db.commit()
    db.refresh(bill)
    return {"message": "Status updated", "status": bill.status}

@router.delete("/{id}")
def delete_bill(id: str, db: Session = Depends(get_db)):
    bill = db.get(models.Billing, id)
    if not bill:
        raise HTTPException(404, "Bill not found")
    db.delete(bill)
    db.commit()
    return {"message": "Bill deleted successfully"}
