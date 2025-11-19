"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";

/* Modal component reused (same as before) */

export default function DoctorsPage() {
  const qc = useQueryClient();

  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);

  const { data: doctors = [] } = useQuery({
    queryKey: ["doctors"],
queryFn: () => api.get("/doctors/"),
  });

  const createDoctor = useMutation({
    mutationFn: (data: any) => api.post("/doctors/", data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["doctors"] });
      setOpenCreate(false);
    },
  });

  const updateDoctor = useMutation({
    mutationFn: ({ id, data }: any) => api.put(`/doctors/${id}`, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["doctors"] });
      setOpenEdit(false);
      setSelectedDoctor(null);
    },
  });

  const deleteDoctor = useMutation({
    mutationFn: (id: string) => api.delete(`/doctors/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["doctors"] }),
  });

  const inputClass = "w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition";
  const btnClass = "px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition";

  return (
    <div className="space-y-8 p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Doctors</h1>
        <button onClick={() => setOpenCreate(true)} className={btnClass}>+ Add Doctor</button>
      </div>

      <section className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-4">All Doctors</h2>

       <div className="max-h-[500px] overflow-auto rounded-xl border shadow-sm">
  <table className="w-full text-sm border-collapse">
    <thead>
      <tr className="bg-gray-100 dark:bg-neutral-800 text-left text-[13px] font-semibold text-gray-700 dark:text-gray-300">
        <th className="p-4 border-b border-r">ID</th>
        <th className="p-4 border-b border-r">Name</th>
        <th className="p-4 border-b border-r">Specialization</th>
        <th className="p-4 border-b border-r">Phone</th>
        <th className="p-4 border-b border-r">Room</th>
        <th className="p-4 border-b text-center">Actions</th>
      </tr>
    </thead>

    <tbody>
      {doctors.map((d: any, index: number) => {
        const isLast = index === doctors.length - 1;

        return (
          <tr
            key={d.id}
            className={`
              hover:bg-gray-50 dark:hover:bg-neutral-800/40
              transition-colors
              ${!isLast ? "border-b dark:border-neutral-700" : ""}
            `}
          >
            <td className="p-4 border-r">{d.id}</td>
            <td className="p-4 border-r">{d.name}</td>
            <td className="p-4 border-r">{d.specialization}</td>
            <td className="p-4 border-r">{d.phone}</td>
            <td className="p-4 border-r">{d.room_no}</td>

            <td className="p-4 text-center">
              <div className="flex justify-center gap-2">
                <button
                  onClick={() => {
                    setSelectedDoctor(d);
                    setOpenEdit(true);
                  }}
                  className="px-3 py-1 text-xs bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Edit
                </button>

                <button
                  onClick={() =>
                    confirm("Delete this doctor?") &&
                    deleteDoctor.mutate(d.id)
                  }
                  className="px-3 py-1 text-xs bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                >
                  Delete
                </button>
              </div>
            </td>
          </tr>
        );
      })}

      {!doctors.length && (
        <tr>
          <td
            colSpan={6}
            className="p-6 text-center text-neutral-500 dark:text-neutral-400"
          >
            No doctors found.
          </td>
        </tr>
      )}
    </tbody>
  </table>
</div>

      </section>

      {openCreate && (
        <Modal onClose={() => setOpenCreate(false)} title="Add Doctor">
          <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={(e) => {
            e.preventDefault();
            const fm = new FormData(e.currentTarget);
            createDoctor.mutate({
              name: fm.get("name"),
              specialization: fm.get("specialization"),
              phone: fm.get("phone"),
              room_no: fm.get("room_no"),
            });
            e.currentTarget.reset();
          }}>
            <input className={inputClass} name="name" placeholder="Name" required />
            <input className={inputClass} name="specialization" placeholder="Specialization" required />
            <input className={inputClass} name="phone" placeholder="Phone" required />
            <input className={inputClass} name="room_no" placeholder="Room No" required />
            <button type="submit" className="md:col-span-2 w-full py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700">Create</button>
          </form>
        </Modal>
      )}

      {openEdit && selectedDoctor && (
        <Modal onClose={() => setOpenEdit(false)} title="Edit Doctor">
          <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={(e) => {
            e.preventDefault();
            const fm = new FormData(e.currentTarget);
            updateDoctor.mutate({
              id: selectedDoctor.id,
              data: {
                name: fm.get("name"),
                specialization: fm.get("specialization"),
                phone: fm.get("phone"),
                room_no: fm.get("room_no"),
              },
            });
          }}>
            <input className={inputClass} name="name" defaultValue={selectedDoctor.name} required />
            <input className={inputClass} name="specialization" defaultValue={selectedDoctor.specialization} required />
            <input className={inputClass} name="phone" defaultValue={selectedDoctor.phone} required />
            <input className={inputClass} name="room_no" defaultValue={selectedDoctor.room_no} required />
            <button type="submit" className="md:col-span-2 w-full py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700">Update</button>
          </form>
        </Modal>
      )}
    </div>
  );
}

/* Modal component placed below (reused) */
function Modal({ children, onClose, title }: any) {
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white dark:bg-neutral-900 p-6 rounded-xl w-full max-w-lg shadow-xl space-y-5" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">{title}</h2>
          <button className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300" onClick={onClose}>✖</button>
        </div>
        {children}
      </div>
    </div>
  );
}


