"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

import { Loader2, Trash2, Pencil, Plus } from "lucide-react";

import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import SelectModal from "@/components/SelectModal";

export default function BillingPage() {
  const qc = useQueryClient();

  // ---------------- Queries ----------------
  const { data: bills = [], isLoading } = useQuery({
    queryKey: ["billing"],
    queryFn: () => api.get("/billing/"),
  });

  const { data: patients = [] } = useQuery({
    queryKey: ["patients"],
    queryFn: () => api.get("/patients/"),
  });

  // ---------------- State ----------------
  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [current, setCurrent] = useState<any>(null);

  const [selectedPatient, setSelectedPatient] = useState<any>(null);

  const [showSelect, setShowSelect] = useState(false);
  const [selectItems, setSelectItems] = useState<any[]>([]);
  const [selectCb, setSelectCb] = useState<any>(() => () => {});

  const openSelect = (items: any[], cb: any) => {
    setSelectItems(items);
    setSelectCb(() => cb);
    setShowSelect(true);
  };

  // ---------------- Mutations ----------------
  const createBill = useMutation({
    mutationFn: (d: any) => api.post("/billing/", d),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["billing"] });
      setOpenCreate(false);
      setSelectedPatient(null);
    },
  });

  const updateBill = useMutation({
    mutationFn: ({ id, data }: any) => api.put(`/billing/${id}/`, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["billing"] });
      setOpenEdit(false);
      setSelectedPatient(null);
    },
  });

  const deleteBill = useMutation({
    mutationFn: (id: string) => api.delete(`/billing/${id}/`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["billing"] }),
  });

  return (
    <div className="space-y-8 p-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Billing</h1>

        <Button className="gap-2" onClick={() => setOpenCreate(true)}>
          <Plus size={18} /> Add Bill
        </Button>
      </div>

      {/* Bills List */}
      <section className="bg-white dark:bg-neutral-900 p-6 rounded-xl shadow-sm">
        <h2 className="text-xl font-semibold mb-4">All Bills</h2>

        {isLoading ? (
          <div className="py-10 flex justify-center">
            <Loader2 className="animate-spin w-6 h-6" />
          </div>
        ) : bills.length === 0 ? (
          <p className="p-6 text-neutral-500 text-center border rounded-lg">
            No bills found.
          </p>
        ) : (
          <div className="overflow-auto max-h-[550px] border rounded-xl shadow-sm">
            <table className="w-full text-sm border-collapse border border-gray-300 dark:border-neutral-700">
              <thead className="bg-gray-100 dark:bg-neutral-800 text-left">
                <tr className="text-gray-700 dark:text-gray-300">
                  <th className="p-3 border border-gray-300 dark:border-neutral-700">
                    Bill ID
                  </th>
                  <th className="p-3 border border-gray-300 dark:border-neutral-700">
                    Patient ID
                  </th>
                  <th className="p-3 border border-gray-300 dark:border-neutral-700">
                    Patient
                  </th>
                  <th className="p-3 border border-gray-300 dark:border-neutral-700">
                    Description
                  </th>
                  <th className="p-3 border border-gray-300 dark:border-neutral-700">
                    Amount
                  </th>
                  <th className="p-3 border border-gray-300 dark:border-neutral-700">
                    Status
                  </th>
                  <th className="p-3 border border-gray-300 dark:border-neutral-700 text-center">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {bills.map((b: any) => {
                  const patient = patients.find(
                    (p: any) => p.id === b.patient_id
                  );

                  return (
                    <tr
                      key={b.id}
                      className="hover:bg-gray-50 dark:hover:bg-neutral-800 transition"
                    >
                      <td className="p-3 border border-gray-300 dark:border-neutral-700">
                        {b.id}
                      </td>

                      <td className="p-3 border border-gray-300 dark:border-neutral-700 break-all">
                        {b.patient_id}
                      </td>

                      <td className="p-3 border border-gray-300 dark:border-neutral-700 whitespace-nowrap">
                        {patient?.name || (
                          <span className="text-gray-400 italic">Unknown</span>
                        )}
                      </td>

                      <td className="p-3 border border-gray-300 dark:border-neutral-700 max-w-[220px] truncate">
                        {b.description}
                      </td>

                      <td className="p-3 border border-gray-300 dark:border-neutral-700 font-semibold">
                        ₹{b.total_amount}
                      </td>

                      <td className="p-3 border border-gray-300 dark:border-neutral-700 capitalize">
                        <span
                          className={`
                  px-2 py-1 rounded-md text-xs font-medium
                  ${
                    b.status === "paid"
                      ? "bg-green-100 text-green-700"
                      : b.status === "due"
                      ? "bg-red-100 text-red-700"
                      : "bg-yellow-100 text-yellow-700"
                  }
                `}
                        >
                          {b.status}
                        </span>
                      </td>

                      <td className="p-3 border border-gray-300 dark:border-neutral-700 text-center">
                        <div className="flex justify-center gap-2">
                          <Button
                            variant="secondary"
                            size="sm"
                            className="gap-1"
                            onClick={() => {
                              setCurrent(b);
                              setSelectedPatient(patient || null);
                              setOpenEdit(true);
                            }}
                          >
                            <Pencil size={14} />
                          </Button>

                          <Button
                            variant="destructive"
                            size="sm"
                            className="gap-1"
                            onClick={() =>
                              confirm("Delete this bill?") &&
                              deleteBill.mutate(b.id)
                            }
                          >
                            <Trash2 size={14} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* ---------------- CREATE MODAL ---------------- */}
      {openCreate && (
        <Modal title="Create Bill" onClose={() => setOpenCreate(false)}>
          <div className="space-y-4">
            {/* Patient Select */}
            <label className="text-sm font-medium">Patient</label>
            <div className="flex gap-2">
              <input
                readOnly
                value={selectedPatient?.name || ""}
                placeholder="Select patient"
                className="input flex-1"
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

            {/* FORM */}
            <form
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
              onSubmit={(e) => {
                e.preventDefault();
                const fm = new FormData(e.currentTarget as HTMLFormElement);

                createBill.mutate({
                  patient_id: selectedPatient?.id,
                  description: fm.get("description"),
                  total_amount: Number(fm.get("total_amount")),
                  status: fm.get("status"),
                });
              }}
            >
              <Input label="Description" name="description" required />
              <Input
                label="Amount (₹)"
                type="number"
                name="total_amount"
                required
              />

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">Status</label>
                <select
                  name="status"
                  className="input"
                  defaultValue="pending"
                  required
                >
                  <option value="pending">Pending</option>
                  <option value="due">Due</option>
                  <option value="paid">Paid</option>
                </select>
              </div>

              <div className="md:col-span-2 flex justify-end gap-2">
                <Button type="submit">
                  {createBill.isLoading ? "Creating..." : "Create"}
                </Button>

                <Button
                  variant="secondary"
                  onClick={() => setOpenCreate(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </Modal>
      )}

      {/* ---------------- EDIT MODAL ---------------- */}
      {openEdit && current && (
        <Modal title="Edit Bill" onClose={() => setOpenEdit(false)}>
          <div className="space-y-4">
            {/* Patient Select */}
            <label className="text-sm font-medium">Patient</label>
            <div className="flex gap-2">
              <input
                readOnly
                value={selectedPatient?.name || ""}
                className="input flex-1"
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

            {/* FORM */}
            <form
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
              onSubmit={(e) => {
                e.preventDefault();
                const fm = new FormData(e.currentTarget as HTMLFormElement);

                updateBill.mutate({
                  id: current.id,
                  data: {
                    patient_id: selectedPatient?.id,
                    description: fm.get("description"),
                    total_amount: Number(fm.get("total_amount")),
                    status: fm.get("status"),
                  },
                });
              }}
            >
              <Input
                label="Description"
                name="description"
                defaultValue={current.description}
                required
              />

              <Input
                label="Amount (₹)"
                name="total_amount"
                type="number"
                defaultValue={current.total_amount}
                required
              />

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">Status</label>
                <select
                  name="status"
                  className="input"
                  defaultValue="pending"
                  required
                >
                  <option value="pending">Pending</option>
                  <option value="due">Due</option>
                  <option value="paid">Paid</option>
                </select>
              </div>

              <div className="md:col-span-2 flex justify-end gap-2">
                <Button type="submit">
                  {updateBill.isLoading ? "Saving..." : "Update"}
                </Button>

                <Button variant="secondary" onClick={() => setOpenEdit(false)}>
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
          title="Select Patient"
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
