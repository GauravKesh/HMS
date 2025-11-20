# HMS
# 🏥 Hospital Management System (HMS)

![Python](https://img.shields.io/badge/Python-3.8+-3776AB?style=for-the-badge&logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)
![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

A full-stack Hospital Management System designed to digitalize and streamline hospital operations.  
Built using **FastAPI (Python)** for the backend, **Next.js + React** for the frontend, and **MySQL** as the database.

---

## 🚀 Features

✅ **Patient Management**  
✅ **Doctor Management**  
✅ **Appointments Scheduling**  
✅ **Medical Records**  
✅ **Billing System**  
✅ **Pharmacy Inventory**  
✅ **Lab Tests & Reports**  
✅ **Fully CRUD-based**  
✅ **REST API with JSON responses**  

---

## 🛠️ Tech Stack

### **Frontend**
- Next.js  
- React.js  
- Tailwind CSS  

### **Backend**
- Python  
- FastAPI  
- Uvicorn  
- SQLAlchemy ORM  

### **Database**
- MySQL  

---

## 📂 Project Structure

```
dbms_prj/
│
├── backend/
│   ├── main.py
│   ├── database.py
│   ├── models.py
│   ├── schemas.py
│   ├── routers/
│   │   ├── patients.py
│   │   ├── doctors.py
│   │   ├── appointments.py
│   │   ├── medical_records.py
│   │   ├── billing.py
│   │   ├── pharmacy.py
│   │   └── lab.py
│   └── requirements.txt
│
└── frontend/
    ├── app/
    ├── components/
    ├── lib/
    ├── public/
    ├── package.json
    └── tsconfig.json
```

---

## ⚙️ Setup Instructions

### 🟦 **1. Database Setup (MySQL)**

Create the database:

```sql
CREATE DATABASE hms_db;
```

Update DB URL in `backend/database.py`:

```python
DATABASE_URL = "mysql+pymysql://root:password@localhost:3306/hms_db"
```

---

### 🟪 **2. Backend Setup (FastAPI)**

**Step 1** — Navigate to backend folder

```bash
cd backend
```

**Step 2** — Create and activate virtual environment

**Mac/Linux:**
```bash
python3 -m venv venv
source venv/bin/activate
```

**Windows:**
```bash
python -m venv venv
venv\Scripts\activate
```

**Step 3** — Install backend dependencies

```bash
pip install -r requirements.txt
```

**Step 4** — Run backend server

```bash
uvicorn main:app --reload --port 8000
```

**Backend is now live at:**  
👉 http://localhost:8000  
👉 **API Docs (Swagger):** http://localhost:8000/docs

---

### 🟩 **3. Frontend Setup (Next.js + React)**

**Step 1** — Navigate to frontend folder

```bash
cd frontend
```

**Step 2** — Install dependencies

```bash
npm install
```

**Step 3** — Start the development server

```bash
npm run dev
```

**Frontend runs at:**  
👉 http://localhost:3000

---

## 🔌 API Integration Notes

The frontend communicates with the backend at:

```
http://localhost:8000
```

⚠️ **Ensure backend is running first**, or the UI will show connection errors.

---

## 📊 ER Diagram & System Architecture

<img width="2521" height="1449" alt="architecture" src="https://github.com/user-attachments/assets/7bd4a186-d9fb-4d90-97d6-bb02b9bf8ca9" />


<img width="3659" height="1384" alt="mentor connect flowchart-2025-11-19-152720" src="https://github.com/user-attachments/assets/12483b31-eb7d-48cd-94a8-d92b49ce3f02" />


---

## 🎯 Results

- ✅ All hospital modules successfully implemented
- ✅ CRUD operations work across all components
- ✅ Fast API performance with low latency
- ✅ Responsive and modern UI using Next.js and Tailwind
- ✅ Clean database structure with proper foreign key relations

---

## 📝 Conclusion

This project demonstrates a complete full-stack hospital management system that automates day-to-day operations. It improves accuracy, reduces manual workload, and provides a scalable and secure architecture suitable for real-world deployment.

---

## 🙌 Author

**Gaurav**  
DBMS Mini Project  
FastAPI • Next.js • MySQL

---

## 📜 License

![License](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)

This project is licensed under the MIT License.

---

## 🌟 Show Your Support

Give a ⭐️ if this project helped you!
