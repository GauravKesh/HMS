# routers/lab.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import SessionLocal
import models
import schemas

router = APIRouter(prefix="/lab", tags=["lab"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ======================================================
#                   LAB TESTS
# ======================================================

@router.post("/tests", response_model=schemas.LabTestOut)
def create_test(payload: schemas.LabTestCreate, db: Session = Depends(get_db)):
    test = models.LabTest(**payload.dict())
    db.add(test)
    db.commit()
    db.refresh(test)
    return test


@router.get("/tests", response_model=list[schemas.LabTestOut])
def list_tests(db: Session = Depends(get_db)):
    return db.query(models.LabTest).all()


@router.put("/tests/{id}", response_model=schemas.LabTestOut)
def update_test(id: str, payload: schemas.LabTestCreate, db: Session = Depends(get_db)):
    test = db.get(models.LabTest, id)
    if not test:
        raise HTTPException(404, "Test not found")

    for k, v in payload.dict().items():
        setattr(test, k, v)

    db.commit()
    db.refresh(test)
    return test


@router.delete("/tests/{id}")
def delete_test(id: str, db: Session = Depends(get_db)):
    test = db.get(models.LabTest, id)
    if not test:
        raise HTTPException(404, "Test not found")

    db.delete(test)
    db.commit()
    return {"message": "Test deleted successfully"}


# ======================================================
#                   LAB REPORTS
# ======================================================

@router.post("/reports", response_model=schemas.LabReportOut)
def create_report(payload: schemas.LabReportCreate, db: Session = Depends(get_db)):
    if not db.get(models.Patient, payload.patient_id):
        raise HTTPException(404, "Patient not found")
    if not db.get(models.LabTest, payload.test_id):
        raise HTTPException(404, "Lab test not found")

    report = models.LabReport(**payload.dict())
    db.add(report)
    db.commit()
    db.refresh(report)
    return report


@router.get("/reports", response_model=list[schemas.LabReportOut])
def list_reports(db: Session = Depends(get_db)):
    return db.query(models.LabReport).all()


@router.get("/reports/{id}", response_model=schemas.LabReportOut)
def get_report(id: str, db: Session = Depends(get_db)):
    report = db.get(models.LabReport, id)
    if not report:
        raise HTTPException(404, "Report not found")
    return report


@router.put("/reports/{id}", response_model=schemas.LabReportOut)
def update_report(id: str, payload: schemas.LabReportCreate, db: Session = Depends(get_db)):
    report = db.get(models.LabReport, id)
    if not report:
        raise HTTPException(404, "Report not found")

    for k, v in payload.dict().items():
        setattr(report, k, v)

    db.commit()
    db.refresh(report)
    return report


# ---------- FIXED PATCH ENDPOINTS (JSON BODY REQUIRED!) ----------

@router.patch("/reports/{id}/status")
def update_report_status(id: str, payload: schemas.StatusUpdate, db: Session = Depends(get_db)):
    report = db.get(models.LabReport, id)
    if not report:
        raise HTTPException(404, "Report not found")

    report.status = payload.status
    db.commit()
    db.refresh(report)
    return {"message": "Status updated", "status": report.status}


@router.patch("/reports/{id}/result")
def update_report_result(id: str, payload: schemas.ResultUpdate, db: Session = Depends(get_db)):
    report = db.get(models.LabReport, id)
    if not report:
        raise HTTPException(404, "Report not found")

    report.result = payload.result
    db.commit()
    db.refresh(report)
    return {"message": "Result updated"}


# ---------- FIXED DELETE ROUTE ----------

@router.delete("/reports/{id}")
def delete_report(id: str, db: Session = Depends(get_db)):
    report = db.get(models.LabReport, id)
    if not report:
        raise HTTPException(404, "Report not found")

    db.delete(report)
    db.commit()
    return {"message": "Report deleted successfully"}
