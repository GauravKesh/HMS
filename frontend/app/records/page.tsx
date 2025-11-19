"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

import { Pencil, Trash2, Loader2, Plus } from "lucide-react";

import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import SelectModal from "@/components/SelectModal";

const TextArea = ({ label, ...rest }: any) => (
  <div className="flex flex-col gap-1 md:col-span-2">
    <label className="text-sm font-medium">{label}</label>
    <textarea {...rest} className="input min-h-[110px] resize-none" />
  </div>
);

export default function RecordsPage() {
  const qc = useQueryClient();

  // ---------------- FETCH RECORDS ----------------
  const { data: records = [], isLoading } = useQuery({
    queryKey: ["records"],
    queryFn: () => api.get("/records/"),
  });

  // Patient and Doctor List (for selection modal)
  const { data: patients = [] } = useQuery({
    queryKey: ["patients"],
    queryFn: () => api.get("/patients/"),
  });

  const { data: doctors = [] } = useQuery({
    queryKey: ["doctors"],
    queryFn: () => api.get("/doctors/"),
  });

  // ---------------- MUTATIONS ----------------
  const createRecord = useMutation({
    mutationFn: (d: any) => api.post("/records/", d),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["records"] });
      setShowCreate(false);
      setSelectedPatient(null);
      setSelectedDoctor(null);
    },
  });

  const updateRecord = useMutation({
    mutationFn: ({ id, data }: any) => api.put(`/records/${id}/`, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["records"] });
      setShowEdit(false);
      setSelectedPatient(null);
      setSelectedDoctor(null);
    },
  });

  const deleteRecord = useMutation({
    mutationFn: (id: string) => api.delete(`/records/${id}/`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["records"] }),
  });

  // ---------------- UI STATES ----------------
  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [current, setCurrent] = useState<any>(null);

  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);

  // SelectModal control
  const [showSelect, setShowSelect] = useState(false);
  const [selectItems, setSelectItems] = useState<any[]>([]);
  const [selectCb, setSelectCb] = useState<any>(() => () => {});

  const openSelect = (items: any[], cb: any) => {
    setSelectItems(items);
    setSelectCb(() => cb);
    setShowSelect(true);
  };

  return (
    <div className="space-y-8 p-4">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Medical Records</h1>

        <Button className="gap-2" onClick={() => setShowCreate(true)}>
          Add Record
        </Button>
      </div>

      {/* LIST */}
      <section className="bg-white dark:bg-neutral-900 p-6 rounded-xl shadow-sm">
        <h2 className="text-xl font-semibold mb-4">All Records</h2>

        {isLoading ? (
          <div className="py-10 flex justify-center">
            <Loader2 className="animate-spin w-6 h-6" />
          </div>
        ) : records.length === 0 ? (
          <p className="p-6 text-neutral-500 text-center border rounded-lg">
            No medical records found.
          </p>
        ) : (
          <div className="overflow-auto max-h-[550px] border rounded-xl shadow-sm">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-100 dark:bg-neutral-800 text-left text-[13px] font-semibold text-gray-700 dark:text-gray-300">
                  <th className="p-4 border-b border-r">Patient</th>
                  <th className="p-4 border-b border-r">Doctor</th>
                  <th className="p-4 border-b border-r">Diagnosis</th>
                  <th className="p-4 border-b border-r">Prescription</th>
                  <th className="p-4 border-b text-center">Actions</th>
                </tr>
              </thead>

              <tbody>
                {records.map((r: any, idx: number) => {
                  const isLast = idx === records.length - 1;
                  const patient = patients.find(
                    (p: any) => p.id === r.patient_id
                  );
                  const doctor = doctors.find((d: any) => d.id === r.doctor_id);

                  return (
                    <tr
                      key={r.id}
                      className={`
              border-b dark:border-neutral-700 
              hover:bg-gray-50 dark:hover:bg-neutral-800/40
              transition-colors
              ${isLast ? "rounded-b-xl" : ""}
            `}
                    >
                      <td className="p-4 border-r">
                        {patient?.name || r.patient_id}
                      </td>
                      <td className="p-4 border-r">{doctor?.name || "—"}</td>
                      <td className="p-4 border-r">{r.diagnosis}</td>
                      <td className="p-4 border-r">{r.prescription}</td>

                      <td className="p-4 text-center">
                        <div className="flex justify-center gap-2">
                          <Button
                            variant="secondary"
                            size="sm"
                            className="flex items-center gap-1"
                            onClick={() => {
                              setCurrent(r);
                              setSelectedPatient(patient || null);
                              setSelectedDoctor(doctor || null);
                              setShowEdit(true);
                            }}
                          >
                            <Pencil size={14} />
                          </Button>

                          <Button
                            variant="destructive"
                            size="sm"
                            className="flex items-center gap-1"
                            onClick={() =>
                              confirm("Delete this record?") &&
                              deleteRecord.mutate(r.id)
                            }
                          >
                            <Trash2 size={14} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {!records.length && (
                  <tr>
                    <td
                      colSpan={5}
                      className="p-6 text-center text-neutral-500 dark:text-neutral-400"
                    >
                      No medical records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* ---------------- CREATE MODAL ---------------- */}
      {showCreate && (
        <Modal title="Add Medical Record" onClose={() => setShowCreate(false)}>
          <div className="space-y-4">
            {/* PATIENT SELECT */}
            <label className="text-sm font-medium">Patient</label>
            <div className="flex gap-2">
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

            {/* DOCTOR SELECT */}
            <label className="text-sm font-medium">Doctor</label>
            <div className="flex gap-2">
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

            {/* FORM */}
            <form
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
              onSubmit={(e) => {
                e.preventDefault();
                const fm = new FormData(e.currentTarget as HTMLFormElement);

                createRecord.mutate({
                  patient_id: selectedPatient?.id,
                  doctor_id: selectedDoctor?.id || null,
                  diagnosis: fm.get("diagnosis"),
                  prescription: fm.get("prescription"),
                });
              }}
            >
              <TextArea label="Diagnosis" name="diagnosis" required />
              <TextArea label="Prescription" name="prescription" required />

              <div className="md:col-span-2 flex justify-end gap-2">
                <Button type="submit">Create</Button>
                <Button
                  variant="secondary"
                  onClick={() => setShowCreate(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </Modal>
      )}

      {/* ---------------- EDIT MODAL ---------------- */}
      {showEdit && current && (
        <Modal title="Edit Medical Record" onClose={() => setShowEdit(false)}>
          <div className="space-y-4">
            {/* PATIENT SELECT */}
            <label className="text-sm font-medium">Patient</label>
            <div className="flex gap-2">
              <input
                className="input flex-1"
                readOnly
                value={selectedPatient?.name || ""}
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

            {/* DOCTOR SELECT */}
            <label className="text-sm font-medium">Doctor</label>
            <div className="flex gap-2">
              <input
                className="input flex-1"
                readOnly
                value={selectedDoctor?.name || ""}
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

            {/* FORM */}
            <form
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
              onSubmit={(e) => {
                e.preventDefault();
                const fm = new FormData(e.currentTarget as HTMLFormElement);

                updateRecord.mutate({
                  id: current.id,
                  data: {
                    patient_id: selectedPatient?.id,
                    doctor_id: selectedDoctor?.id || null,
                    diagnosis: fm.get("diagnosis"),
                    prescription: fm.get("prescription"),
                  },
                });
              }}
            >
              <TextArea
                label="Diagnosis"
                name="diagnosis"
                defaultValue={current.diagnosis}
                required
              />

              <TextArea
                label="Prescription"
                name="prescription"
                defaultValue={current.prescription}
                required
              />

              <div className="md:col-span-2 flex justify-end gap-2">
                <Button type="submit">Update</Button>
                <Button variant="secondary" onClick={() => setShowEdit(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </Modal>
      )}

      {/* ---------------- SELECT MODAL ---------------- */}
      {showSelect && (
        <SelectModal
          title="Select"
          items={selectItems}
          onSelect={(it: any) => {
            selectCb(it);
            setShowSelect(false);
          }}
          onClose={() => setShowSelect(false)}
        />
      )}
    </div>
  );
}
