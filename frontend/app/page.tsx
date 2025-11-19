"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Users, Stethoscope, Calendar, CreditCard } from "lucide-react";
import { CardMetric } from "@/components/CardMetric";

import {
  LineChart,
  Line,
  CartesianGrid,
  Tooltip,
  XAxis,
  BarChart,
  Bar,
  ResponsiveContainer,
} from "recharts";

/* ---------------- Helpers ---------------- */
const formatDate = (iso: string) => {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return iso;
  }
};

const formatTime = (t: string) => {
  if (!t) return "—";
  return t.includes(":") ? t.slice(0, 5) : t;
};

/* ---------------- Modal ---------------- */
const AppointmentModal = ({ data, onClose }: any) => {
  if (!data) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white dark:bg-neutral-900 p-6 rounded-2xl w-full max-w-md shadow-xl space-y-4 animate-scale-in">
        <h2 className="text-xl font-semibold">Appointment Details</h2>

        <div className="space-y-2 text-sm">
          <p>
            <strong>Patient:</strong> {data._patient}
          </p>
          <p>
            <strong>Doctor:</strong> {data._doctor || "Not Assigned"}
          </p>
          <p>
            <strong>Date:</strong> {formatDate(data.appointment_date)}
          </p>
          <p>
            <strong>Time:</strong> {formatTime(data.appointment_time)}
          </p>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Close
        </button>
      </div>
    </div>
  );
};

/* ---------------- Page ---------------- */
export default function DashboardPage() {
  const [viewData, setViewData] = useState<any>(null);

  /* Queries */
  const { data: patients = [] } = useQuery({
    queryKey: ["patients"],
    queryFn: () => api.get("/patients/"),
  });

  const { data: doctors = [] } = useQuery({
    queryKey: ["doctors"],
    queryFn: () => api.get("/doctors/"),
  });

  const { data: appointments = [] } = useQuery({
    queryKey: ["appointments"],
    queryFn: () => api.get("/appointments/"),
  });

  const { data: bills = [] } = useQuery({
    queryKey: ["billing"],
    queryFn: () => api.get("/billing/"),
  });

  /* Lookups */
  const patientName = (id: any) =>
    patients.find((p: any) => p.id === id)?.name || id;
  const doctorName = (id: any) =>
    doctors.find((d: any) => d.id === id)?.name || id;

  const appts = appointments.map((a: any) => ({
    ...a,
    _patient: patientName(a.patient_id),
    _doctor: doctorName(a.doctor_id),
  }));

  /* Charts */
  const monthlyAppointments = (() => {
    const map: Record<string, number> = {};

    appts.forEach((a: any) => {
      if (!a.appointment_date) return;

      const d = new Date(a.appointment_date);

      // YYYY-MM (sortable format)
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
        2,
        "0"
      )}`;

      map[key] = (map[key] || 0) + 1;
    });

    // Sort keys: 2024-01 < 2024-02 < ... < 2025-01
    const sortedKeys = Object.keys(map).sort();

    return sortedKeys.map((key) => {
      const [year, month] = key.split("-");
      const monthName = new Date(
        Number(year),
        Number(month) - 1
      ).toLocaleString("en-US", {
        month: "short",
      });

      return {
        key, // "2024-11"
        monthLabel: `${monthName} ${year}`, // "Nov 2024"
        value: map[key],
      };
    });
  })();

  const dailyPatients = (() => {
    const days: Record<string, number> = {
      Mon: 0,
      Tue: 0,
      Wed: 0,
      Thu: 0,
      Fri: 0,
      Sat: 0,
      Sun: 0,
    };
    patients.forEach((p: any) => {
      if (!p.created_at) return;
      const d = new Date(p.created_at).toLocaleString("en-US", {
        weekday: "short",
      });
      if (days[d] !== undefined) days[d]++;
    });
    return Object.keys(days).map((d) => ({ day: d, value: days[d] }));
  })();

  const upcoming = appts.filter(
    (a: any) => new Date(a.appointment_date) > new Date()
  );

  const recent = [...appts]
    .sort((a: any, b: any) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 5);

  return (
    <div className="space-y-10 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold">Dashboard</h1>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <CardMetric title="Patients" value={patients.length} icon={<Users />} />
        <CardMetric
          title="Doctors"
          value={doctors.length}
          icon={<Stethoscope />}
        />
        <CardMetric
          title="Appointments"
          value={appointments.length}
          icon={<Calendar />}
        />
        <CardMetric title="Bills" value={bills.length} icon={<CreditCard />} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Monthly Appointments */}
        <div className="p-6 bg-white dark:bg-neutral-900 rounded-2xl shadow-lg">
          <h2 className="text-lg font-semibold mb-4">Appointments (Monthly)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyAppointments}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="monthLabel" />
              <Tooltip />
              <Line dataKey="value" stroke="#6366f1" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Daily Registration */}
        <div className="p-6 bg-white dark:bg-neutral-900 rounded-2xl shadow-lg">
          <h2 className="text-lg font-semibold mb-4">Daily New Patients</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dailyPatients}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <Tooltip />
              <Bar dataKey="value" fill="#14b8a6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Appointment Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upcoming */}
        <div className="p-6 bg-white dark:bg-neutral-900 rounded-2xl shadow-lg">
          <h2 className="text-lg font-semibold mb-4">Upcoming Appointments</h2>

          {upcoming.length === 0 && (
            <p className="text-gray-500 text-sm">No upcoming appointments.</p>
          )}

          <div className="space-y-3">
            {upcoming.map((a: any) => (
              <div
                key={a.id}
                className="flex justify-between items-center p-3 border rounded-xl hover:bg-gray-50 dark:hover:bg-neutral-800 transition"
              >
                <div>
                  <p className="font-medium">{a._patient}</p>
                  <p className="text-xs text-gray-500">
                    {formatDate(a.appointment_date)} •{" "}
                    {formatTime(a.appointment_time)}
                  </p>
                </div>

                <button
                  className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  onClick={() => setViewData(a)}
                >
                  View
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Recent */}
        <div className="p-6 bg-white dark:bg-neutral-900 rounded-2xl shadow-lg">
          <h2 className="text-lg font-semibold mb-4">Recent Appointments</h2>

          <div className="space-y-3">
            {recent.map((a: any) => (
              <div
                key={a.id}
                className="flex justify-between items-center p-3 border rounded-xl hover:bg-gray-50 dark:hover:bg-neutral-800 transition"
              >
                <div>
                  <p className="font-medium">{a._patient}</p>
                  <p className="text-xs text-gray-500">
                    {formatDate(a.appointment_date)} •{" "}
                    {formatTime(a.appointment_time)}
                  </p>
                  <p className="text-xs text-gray-500">{a._doctor}</p>
                </div>

                <button
                  className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  onClick={() => setViewData(a)}
                >
                  View
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <AppointmentModal data={viewData} onClose={() => setViewData(null)} />
    </div>
  );
}
