# main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base

# Import routers
from routers import (
    patients,
    doctors,
    appointments,
    medical_records,
    billing,
    pharmacy,
    lab
)

# Create tables (for development)
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Hospital Management System (MySQL + UUID)",
    version="1.0.0",
    description="Complete CRUD-based Hospital Management System backend"
)

# ------------ CORS ------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],     # allow frontend (Streamlit)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ------------ ROUTES ------------
app.include_router(patients.router)
app.include_router(doctors.router)
app.include_router(appointments.router)
app.include_router(medical_records.router)
app.include_router(billing.router)
app.include_router(pharmacy.router)
app.include_router(lab.router)

# ------------ ROOT ENDPOINT ------------
@app.get("/")
def home():
    return {
        "message": "Hospital Management System API is running",
        "docs": "/docs",
        "redoc": "/redoc"
    }
