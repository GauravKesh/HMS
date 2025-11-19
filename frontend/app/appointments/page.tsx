"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { useCrud } from "@/lib/hooks/useCrud";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import SelectModal from "@/components/SelectModal";

export default function AppointmentsPage() {
  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [current, setCurrent] = useState<any>(null);

  const [showSelect, setShowSelect] = useState(false);
  const [selectItems, setSelectItems] = useState<any[]>([]);
  const [selectCb, setSelectCb] = useState<any>(() => () => {});

  const openSelect = (items: any[], cb: any) => {
    setSelectItems(items);
    setSelectCb(() => cb);
    setShowSelect(true);
  };

  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);

  // CRUD hooks
  const {
    list: apptsQ,
    create: createAppt,
    update: updateAppt,
    remove: deleteAppt,
  } = useCrud("appointments", "/appointments/");

  const { data: appts = [], isLoading } = apptsQ;

  const { list: patientsQ } = useCrud("patients", "/patients/");
  const patients = patientsQ.data || [];

  const { list: doctorsQ } = useCrud("doctors", "/doctors/");
  const doctors = doctorsQ.data || [];

  return (
    <div className="space-y-8 p-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Appointments</h1>

        <Button onClick={() => setOpenCreate(true)} className="gap-2">
          Book Appointment
        </Button>
      </div>

      {/* List */}
      <section className="bg-white dark:bg-neutral-900 p-6 rounded-xl shadow-sm">
        <h2 className="text-xl font-semibold mb-4">All Appointments</h2>

        {isLoading ? (
          <div className="py-10 text-center">
            <Loader2 className="animate-spin w-6 h-6" />
          </div>
        ) : (
          <div className="overflow-auto max-h-[550px] border rounded-xl shadow-sm">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-100 dark:bg-neutral-800 text-left text-[13px] font-semibold text-gray-700 dark:text-gray-300">
                  <th className="p-4 border-b border-r">Patient</th>
                  <th className="p-4 border-b border-r">Doctor</th>
                  <th className="p-4 border-b border-r">Date</th>
                  <th className="p-4 border-b border-r">Time</th>
                  <th className="p-4 border-b border-r">Status</th>
                  <th className="p-4 border-b text-center">Actions</th>
                </tr>
              </thead>

              <tbody>
                {appts.map((a: any, idx: number) => {
                  const isLast = idx === appts.length - 1;
                  const patient = patients.find(
                    (p: any) => p.id === a.patient_id
                  );
                  const doctor = doctors.find((d: any) => d.id === a.doctor_id);

                  return (
                    <tr
                      key={a.id}
                      className={`
              border-b dark:border-neutral-700 
              hover:bg-gray-50 dark:hover:bg-neutral-800/40
              transition-colors
              ${isLast ? "rounded-b-xl" : ""}
            `}
                    >
                      <td className="p-4 border-r">
                        {patient?.name || a.patient_id}
                      </td>
                      <td className="p-4 border-r">{doctor?.name || "—"}</td>
                      <td className="p-4 border-r">{a.appointment_date}</td>
                      <td className="p-4 border-r">{a.appointment_time}</td>
                      <td className="p-4 border-r capitalize">
                        <span className="px-2 py-1 rounded-full text-xs bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300">
                          {a.status}
                        </span>
                      </td>

                      <td className="p-4 text-center">
                        <div className="flex justify-center gap-2">
                          <Button
                            variant="secondary"
                            size="sm"
                            className="flex items-center gap-1"
                            onClick={() => {
                              setCurrent(a);
                              setSelectedPatient(patient || null);
                              setSelectedDoctor(doctor || null);
                              setOpenEdit(true);
                            }}
                          >
                            <Pencil size={14} />
                          </Button>

                          <Button
                            variant="destructive"
                            size="sm"
                            className="flex items-center gap-1"
                            onClick={() =>
                              confirm("Delete this appointment?") &&
                              deleteAppt.mutate(a.id)
                            }
                          >
                            <Trash2 size={14} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {!appts.length && (
                  <tr>
                    <td
                      colSpan={6}
                      className="p-6 text-center text-neutral-500 dark:text-neutral-400"
                    >
                      No appointments found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* ---------------- CREATE MODAL ---------------- */}
      {openCreate && (
        <Modal title="Book Appointment" onClose={() => setOpenCreate(false)}>
          <div className="space-y-4">
            {/* Patient selection */}
            <div>
              <label className="text-sm font-medium">Patient</label>
              <div className="flex gap-2 mt-1">
                <input
                  className="input flex-1"
                  readOnly
                  value={selectedPatient?.name || ""}
                  placeholder="Select patient"
                />
                <Button
                  variant="secondary"
                  onClick={() =>
                    openSelect(patients, (p: any) => {
                      setSelectedPatient(p);
                      setShowSelect(false);
                    })
                  }
                >
                  Choose
                </Button>
              </div>
            </div>

            {/* Doctor selection */}
            <div>
              <label className="text-sm font-medium">Doctor</label>
              <div className="flex gap-2 mt-1">
                <input
                  className="input flex-1"
                  readOnly
                  value={selectedDoctor?.name || ""}
                  placeholder="Select doctor"
                />
                <Button
                  variant="secondary"
                  onClick={() =>
                    openSelect(doctors, (d: any) => {
                      setSelectedDoctor(d);
                      setShowSelect(false);
                    })
                  }
                >
                  Choose
                </Button>
              </div>
            </div>

            {/* Form */}
            <form
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
              onSubmit={(e) => {
                e.preventDefault();
                createAppt.mutate({
                  patient_id: selectedPatient?.id,
                  doctor_id: selectedDoctor?.id || null,
                  appointment_date: (e.target as any).date.value,
                  appointment_time: (e.target as any).time.value,
                });
              }}
            >
              <Input label="Date" type="date" name="date" required />
              <Input label="Time" type="time" name="time" required />

              <div className="md:col-span-2 flex justify-end">
                <Button type="submit">Create</Button>
              </div>
            </form>
          </div>
        </Modal>
      )}

      {/* ---------------- EDIT MODAL ---------------- */}
      {openEdit && current && (
        <Modal title="Edit Appointment" onClose={() => setOpenEdit(false)}>
          <form
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
            onSubmit={(e) => {
              e.preventDefault();
              updateAppt.mutate({
                id: current.id,
                data: {
                  patient_id: selectedPatient?.id || current.patient_id,
                  doctor_id: selectedDoctor?.id || current.doctor_id,
                  appointment_date: (e.target as any).date.value,
                  appointment_time: (e.target as any).time.value,
                },
              });
            }}
          >
            <Input
              label="Date"
              type="date"
              name="date"
              defaultValue={current.appointment_date}
            />

            <Input
              label="Time"
              type="time"
              name="time"
              defaultValue={current.appointment_time}
            />

            <div className="md:col-span-2 flex justify-end">
              <Button type="submit">Update</Button>
            </div>
          </form>
        </Modal>
      )}

      {/* SELECT MODAL */}
      {showSelect && (
        <SelectModal
          title="Select"
          items={selectItems}
          onSelect={(item: any) => {
            selectCb(item);
            setShowSelect(false);
          }}
          onClose={() => setShowSelect(false)}
        />
      )}
    </div>
  );
}
