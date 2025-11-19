"use client";

import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Plus, Pencil, Trash2 } from "lucide-react";

/* ============================================================
   Reusable UI
============================================================ */

const Button = ({ children, className = "", ...rest }: any) => (
  <button
    {...rest}
    className={`inline-flex items-center gap-2 px-3 py-2 rounded-md shadow-sm text-sm transition ${className}`}
  >
    {children}
  </button>
);

const Input = ({ label, ...rest }: any) => (
  <div className="flex flex-col gap-1">
    {label && <label className="text-sm font-medium">{label}</label>}
    <input
      {...rest}
      className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-900"
    />
  </div>
);

const Modal = ({ title, children, onClose }: any) => (
  <div
    className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center px-4"
    onClick={onClose}
  >
    <div
      className="bg-white dark:bg-neutral-900 w-full max-w-lg rounded-xl p-5 shadow-xl"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">{title}</h3>
        <button onClick={onClose}>✖</button>
      </div>
      {children}
    </div>
  </div>
);

/* ============================================================
   Searchable SelectModal
============================================================ */

function SelectModal({ title, items = [], onSelect, onClose }: any) {
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return items;
    return items.filter((it: any) => {
      const search = [it.name, it.id, it.batch_no, it.price]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return search.includes(s);
    });
  }, [items, q]);

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-start justify-center z-50 pt-20 px-4"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-neutral-900 w-full max-w-2xl rounded-xl p-4 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold">{title}</h3>

          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search..."
            className="px-3 py-2 rounded-md border bg-gray-50 dark:bg-neutral-800"
          />
        </div>

        <div className="max-h-[360px] overflow-auto rounded-md border divide-y">
          {filtered.length ? (
            filtered.map((it: any) => (
              <button
                key={it.id}
                className="w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-neutral-800"
                onClick={() => onSelect(it)}
              >
                <div className="font-medium">{it.name ?? it.id}</div>
                <div className="text-xs text-neutral-500">{it.id}</div>
              </button>
            ))
          ) : (
            <div className="p-6 text-center text-neutral-500">
              No items found
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   Page
============================================================ */

export default function PharmacyPage() {
  const qc = useQueryClient();

  /* ----------- Queries ----------- */
  const { data: meds = [] } = useQuery({
    queryKey: ["medicines"],
    queryFn: () => api.get("/pharmacy/medicines/"),
  });

  const { data: sales = [] } = useQuery({
    queryKey: ["sales"],
    queryFn: () => api.get("/pharmacy/sales/"),
  });

  const { data: patients = [] } = useQuery({
    queryKey: ["patients"],
    queryFn: () => api.get("/patients/"),
  });

  /* ----------- Mutations ----------- */
  const addMedicine = useMutation({
    mutationFn: (d: any) => api.post("/pharmacy/medicines/", d),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["medicines"] }),
  });

  const updateMedicine = useMutation({
    mutationFn: ({ id, data }: any) =>
      api.put(`/pharmacy/medicines/${id}/`, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["medicines"] }),
  });

  const deleteMedicine = useMutation({
    mutationFn: (id: string) => api.delete(`/pharmacy/medicines/${id}/`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["medicines"] }),
  });

  const sellMedicine = useMutation({
    mutationFn: (d: any) => api.post("/pharmacy/sell/", d),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["sales"] });
      qc.invalidateQueries({ queryKey: ["medicines"] });
    },
  });

  /* ----------- State ----------- */
  const [activeTab, setActiveTab] = useState<"meds" | "sales">("meds");

  const [showAdd, setShowAdd] = useState(false);
  const [showSell, setShowSell] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [current, setCurrent] = useState<any>(null);

  const [showSelect, setShowSelect] = useState(false);
  const [selectItems, setSelectItems] = useState([]);
  const [selectCb, setSelectCb] = useState(() => {});

  const openSelect = (items: any[], cb: any) => {
    setSelectItems(items);
    setSelectCb(() => cb);
    setShowSelect(true);
  };

  /* ============================================================
     Render
  ============================================================ */

  return (
    <div className="space-y-8 p-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Pharmacy</h1>

        <div className="flex gap-3">
          <Button
            className="bg-purple-600 text-white"
            onClick={() => setShowSell(true)}
          >
            💊 Sell Medicine
          </Button>

          <Button
            className="bg-blue-600 text-white"
            onClick={() => setShowAdd(true)}
          >
            <Plus size={16} /> Add Medicine
          </Button>
        </div>
      </div>

      {/* ---------------------- Tabs ---------------------- */}
      <div className="flex gap-2 border-b pb-2">
        <button
          onClick={() => setActiveTab("meds")}
          className={`px-4 py-2 rounded-t-md ${
            activeTab === "meds"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 dark:bg-neutral-800"
          }`}
        >
          Medicines
        </button>

        <button
          onClick={() => setActiveTab("sales")}
          className={`px-4 py-2 rounded-t-md ${
            activeTab === "sales"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 dark:bg-neutral-800"
          }`}
        >
          Sales
        </button>
      </div>

      {/* ---------------------- Medicines tab ---------------------- */}
      {activeTab === "meds" && (
        <section className="bg-white dark:bg-neutral-900 p-6 rounded-xl shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Medicines</h2>

   <div className="overflow-auto max-h-[350px] rounded-xl border border-gray-300 dark:border-neutral-700">
  <table className="w-full text-sm border-collapse">
    {/* HEADER */}
    <thead className="bg-gray-100 dark:bg-neutral-800 text-gray-700 dark:text-gray-300">
      <tr>
        <th className="p-3 border border-gray-300 dark:border-neutral-700">ID</th>
        <th className="p-3 border border-gray-300 dark:border-neutral-700">Name</th>
        <th className="p-3 border border-gray-300 dark:border-neutral-700">Stock</th>
        <th className="p-3 border border-gray-300 dark:border-neutral-700">Price</th>
        <th className="p-3 border border-gray-300 dark:border-neutral-700">Expiry</th>
        <th className="p-3 border border-gray-300 dark:border-neutral-700 text-center">Actions</th>
      </tr>
    </thead>

    {/* BODY */}
    <tbody>
      {meds.length === 0 && (
        <tr>
          <td
            colSpan={6}
            className="p-6 text-center border border-gray-300 dark:border-neutral-700 text-neutral-500"
          >
            No medicines found.
          </td>
        </tr>
      )}

      {meds.map((m: any) => (
        <tr key={m.id} className="hover:bg-gray-50 dark:hover:bg-neutral-800">
          <td className="p-3 border border-gray-300 dark:border-neutral-700">{m.id}</td>
          <td className="p-3 border border-gray-300 dark:border-neutral-700">{m.name}</td>
          <td className="p-3 border border-gray-300 dark:border-neutral-700">{m.stock}</td>
          <td className="p-3 border border-gray-300 dark:border-neutral-700">₹{m.price}</td>
          <td className="p-3 border border-gray-300 dark:border-neutral-700">{m.expiry_date}</td>

          <td className="p-3 border border-gray-300 dark:border-neutral-700">
            <div className="flex justify-center gap-2">
              <Button
                className="bg-blue-600 text-white text-xs hover:bg-blue-700"
                onClick={() => {
                  setCurrent(m);
                  setShowEdit(true);
                }}
              >
                <Pencil size={14} /> Edit
              </Button>

              <Button
                className="bg-red-600 text-white text-xs hover:bg-red-700"
                onClick={() =>
                  confirm("Delete this medicine?") &&
                  deleteMedicine.mutate(m.id)
                }
              >
                <Trash2 size={14} /> Delete
              </Button>
            </div>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>

        </section>
      )}

      {/* ---------------------- Sales tab ---------------------- */}
      {activeTab === "sales" && (
        <section className="bg-white dark:bg-neutral-900 p-6 rounded-xl shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Sales</h2>

        <div className="overflow-auto max-h-[300px] rounded-xl border border-gray-300 dark:border-neutral-700">
  <table className="w-full text-sm border-collapse">
    {/* HEADER */}
    <thead>
      <tr className="bg-gray-100 dark:bg-neutral-800 text-gray-700 dark:text-gray-300">
        <th className="p-3 border border-gray-300 dark:border-neutral-700">ID</th>
        <th className="p-3 border border-gray-300 dark:border-neutral-700">Medicine</th>
        <th className="p-3 border border-gray-300 dark:border-neutral-700">Qty</th>
        <th className="p-3 border border-gray-300 dark:border-neutral-700">Patient</th>
        <th className="p-3 border border-gray-300 dark:border-neutral-700">Date</th>
      </tr>
    </thead>

    {/* BODY */}
    <tbody>
      {sales.length === 0 && (
        <tr>
          <td
            colSpan={5}
            className="p-6 text-center border border-gray-300 dark:border-neutral-700 text-neutral-500"
          >
            No sales yet.
          </td>
        </tr>
      )}

      {sales.map((s: any) => (
        <tr
          key={s.id}
          className="hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors"
        >
          <td className="p-3 border border-gray-300 dark:border-neutral-700">
            {s.id}
          </td>

          <td className="p-3 border border-gray-300 dark:border-neutral-700">
            {meds.find((x: any) => x.id === s.medicine_id)?.name ??
              s.medicine_id}
          </td>

          <td className="p-3 border border-gray-300 dark:border-neutral-700">
            {s.quantity}
          </td>

          <td className="p-3 border border-gray-300 dark:border-neutral-700">
            {patients.find((p: any) => p.id === s.patient_id)?.name ??
              s.patient_id ??
              "—"}
          </td>

          <td className="p-3 border border-gray-300 dark:border-neutral-700">
            {s.date}
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>

        </section>
      )}

      {/* ---------------------- Modals (Add / Edit / Sell) ---------------------- */}
      {showAdd && (
        <Modal title="Add Medicine" onClose={() => setShowAdd(false)}>
          <form
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
            onSubmit={(e) => {
              e.preventDefault();
              const fm = new FormData(e.currentTarget);

              addMedicine.mutate({
                name: fm.get("name"),
                batch_no: fm.get("batch_no"),
                stock: Number(fm.get("stock")),
                price: Number(fm.get("price")),
                expiry_date: fm.get("expiry_date"),
              });

              setShowAdd(false);
            }}
          >
            <Input label="Name" name="name" required />
            <Input label="Batch No" name="batch_no" required />
            <Input label="Stock" name="stock" type="number" required />
            <Input label="Price" name="price" type="number" required />
            <Input
              label="Expiry Date"
              name="expiry_date"
              type="date"
              required
            />

            <Button className="col-span-2 bg-blue-600 text-white">Add</Button>
          </form>
        </Modal>
      )}

      {showEdit && current && (
        <Modal title="Edit Medicine" onClose={() => setShowEdit(false)}>
          <form
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
            onSubmit={(e) => {
              e.preventDefault();
              const fm = new FormData(e.currentTarget);

              updateMedicine.mutate({
                id: current.id,
                data: {
                  name: fm.get("name"),
                  batch_no: fm.get("batch_no"),
                  stock: Number(fm.get("stock")),
                  price: Number(fm.get("price")),
                  expiry_date: fm.get("expiry_date"),
                },
              });

              setShowEdit(false);
            }}
          >
            <Input label="Name" name="name" defaultValue={current.name} />
            <Input
              label="Batch No"
              name="batch_no"
              defaultValue={current.batch_no}
            />
            <Input
              label="Stock"
              name="stock"
              defaultValue={current.stock}
              type="number"
            />
            <Input
              label="Price"
              name="price"
              defaultValue={current.price}
              type="number"
            />
            <Input
              label="Expiry Date"
              name="expiry_date"
              defaultValue={current.expiry_date}
              type="date"
            />

            <Button className="col-span-2 bg-blue-600 text-white">
              Save Changes
            </Button>
          </form>
        </Modal>
      )}

      {showSell && (
        <Modal title="Sell Medicine" onClose={() => setShowSell(false)}>
          <form
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
            onSubmit={(e) => {
              e.preventDefault();
              const fm = new FormData(e.currentTarget);

              sellMedicine.mutate({
                patient_id: fm.get("patient_id") || null,
                medicine_id: fm.get("medicine_id"),
                quantity: Number(fm.get("quantity")),
              });

              setShowSell(false);
            }}
          >
            {/* Medicine Select */}
            <div>
              <label className="text-sm font-medium">Medicine</label>
              <input
                name="medicine_id"
                id="medicine_id"
                className="hidden"
                required
              />
              <div
                id="medicine_display"
                className="mt-1 px-3 py-2 border rounded-lg bg-gray-50"
              >
                No medicine selected
              </div>
              <Button
                type="button"
                className="mt-2 bg-gray-200"
                onClick={() =>
                  openSelect(meds, (m: any) => {
                    document.getElementById("medicine_id").value = m.id;
                    document.getElementById(
                      "medicine_display"
                    ).textContent = `${m.name} (${m.id})`;
                    setShowSelect(false);
                  })
                }
              >
                Select Medicine
              </Button>
            </div>

            {/* Patient Select */}
            <div>
              <label className="text-sm font-medium">Patient</label>
              <input name="patient_id" id="patient_id" className="hidden" />
              <div
                id="patient_display"
                className="mt-1 px-3 py-2 border rounded-lg bg-gray-50"
              >
                No patient selected
              </div>
              <Button
                type="button"
                className="mt-2 bg-gray-200"
                onClick={() =>
                  openSelect(patients, (p: any) => {
                    document.getElementById("patient_id").value = p.id;
                    document.getElementById(
                      "patient_display"
                    ).textContent = `${p.name} (${p.id})`;
                    setShowSelect(false);
                  })
                }
              >
                Select Patient
              </Button>
            </div>

            <Input
              label="Quantity"
              name="quantity"
              defaultValue={1}
              type="number"
              required
            />

            <Button className="col-span-2 bg-purple-600 text-white">
              Sell
            </Button>
          </form>
        </Modal>
      )}

      {showSelect && (
        <SelectModal
          title="Select"
          items={selectItems}
          onClose={() => setShowSelect(false)}
          onSelect={(it) => selectCb(it)}
        />
      )}
    </div>
  );
}
