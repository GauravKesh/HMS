"use client";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { useCrud } from "@/lib/hooks/useCrud";
import { API_ROUTES } from "@/lib/api/endpoints";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

// --- Utility: Calculate age from DOB ---
function calcAge(dob: string) {
  if (!dob) return 0;
  const birth = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age < 0 ? 0 : age;
}

export default function PatientsPage() {
  const {
    list: patientsQ,
    create: createPatient,
    update: updatePatient,
    remove: deletePatient,
  } = useCrud("patients", API_ROUTES.patients);

  const patients = patientsQ.data || [];
  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [current, setCurrent] = useState<any>(null);

  const [dobInput, setDobInput] = useState("");
  const [dobEditInput, setDobEditInput] = useState("");

  return (
    <div className="p-4 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl">Patients</h1>
        <Button onClick={() => setOpenCreate(true)}>Add Patient</Button>
      </div>

      {/* ---------- TABLE ---------- */}
      <section className="bg-white p-6 rounded-xl">
        <h2 className="text-xl mb-3">All Patients</h2>

        <div className="max-h-[450px] overflow-auto rounded-xl border shadow-sm">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-100 dark:bg-neutral-800 text-left text-[13px] font-semibold text-gray-700 dark:text-gray-300">
                <th className="p-3 border-b border-r">ID</th>
                <th className="p-3 border-b border-r">Name</th>
                <th className="p-3 border-b border-r">Age</th>
                <th className="p-3 border-b border-r">Gender</th>
                <th className="p-3 border-b border-r">Phone</th>
                <th className="p-3 border-b border-r">Address</th>
                <th className="p-3 border-b text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {patients.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-6 text-center text-neutral-500">
                    No patients found.
                  </td>
                </tr>
              ) : (
                patients.map((p: any, idx: number) => (
                  <tr
                    key={p.id}
                    className={`hover:bg-gray-50 dark:hover:bg-neutral-800 transition ${
                      idx !== patients.length - 1
                        ? "border-b dark:border-neutral-700"
                        : ""
                    }`}
                  >
                    <td className="p-3 border-r">{p.id}</td>
                    <td className="p-3 border-r">{p.name}</td>
                    <td className="p-3 border-r">{p.age}</td>
                    <td className="p-3 border-r">{p.gender}</td>
                    <td className="p-3 border-r">{p.phone}</td>
                    <td className="p-3 border-r">{p.address}</td>

                    <td className="p-3 text-center">
                      <div className="flex justify-center gap-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => {
                            setCurrent(p);
                            setDobEditInput(p.dob);
                            setOpenEdit(true);
                          }}
                        >
                          <Pencil size={14} />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() =>
                            confirm("Delete this patient?") &&
                            deletePatient.mutate(p.id)
                          }
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* ---------- CREATE MODAL ---------- */}
      {openCreate && (
        <Modal title="Add Patient" onClose={() => setOpenCreate(false)}>
          <form
            className="grid grid-cols-1 md:grid-cols-2 gap-3"
            onSubmit={(e) => {
              e.preventDefault();
              const age = calcAge(dobInput);
              const fm = new FormData(e.currentTarget);

              createPatient.mutate({
                name: fm.get("name"),
                dob: fm.get("dob"),
                age,
                gender: fm.get("gender"),
                address: fm.get("address"),
                phone: fm.get("phone"),
              });

              setDobInput("");
              e.currentTarget.reset();
            }}
          >
            <Input label="Name" name="name" required />

            {/* DOB */}
            <Input
              label="DOB"
              name="dob"
              type="date"
              required
              onChange={(e) => setDobInput(e.target.value)}
            />

            {/* AGE AUTO */}
            <Input
              label="Age (Auto)"
              value={dobInput ? calcAge(dobInput) : ""}
              disabled
            />

            {/* GENDER DROPDOWN */}
            <div className="flex flex-col">
              <label className="text-sm font-medium">Gender</label>
              <select
                name="gender"
                className="input"
                defaultValue=""
                required
              >
                <option value="" disabled>Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <Input label="Address" name="address" />
            <Input label="Phone" name="phone" />

            <div className="md:col-span-2">
              <Button type="submit">Create</Button>
            </div>
          </form>
        </Modal>
      )}

      {/* ---------- EDIT MODAL ---------- */}
      {openEdit && current && (
        <Modal title="Edit Patient" onClose={() => setOpenEdit(false)}>
          <form
            className="grid grid-cols-1 md:grid-cols-2 gap-3"
            onSubmit={(e) => {
              e.preventDefault();

              const age = calcAge(dobEditInput);
              const fm = new FormData(e.currentTarget);

              updatePatient.mutate({
                id: current.id,
                data: {
                  name: fm.get("name"),
                  dob: fm.get("dob"),
                  age,
                  gender: fm.get("gender"),
                  address: fm.get("address"),
                  phone: fm.get("phone"),
                },
              });
            }}
          >
            <Input
              label="Name"
              name="name"
              defaultValue={current.name}
              required
            />

            <Input
              label="DOB"
              name="dob"
              type="date"
              defaultValue={current.dob}
              required
              onChange={(e) => setDobEditInput(e.target.value)}
            />

            <Input
              label="Age (Auto)"
              value={dobEditInput ? calcAge(dobEditInput) : current.age}
              disabled
            />

            {/* GENDER DROPDOWN */}
            <div className="flex flex-col">
              <label className="text-sm font-medium">Gender</label>
              <select
                name="gender"
                className="input"
                defaultValue={current.gender}
                required
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <Input
              label="Address"
              name="address"
              defaultValue={current.address}
            />
            <Input
              label="Phone"
              name="phone"
              defaultValue={current.phone}
            />

            <div className="md:col-span-2">
              <Button type="submit">Update</Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
