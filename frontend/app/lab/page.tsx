// app/lab/page.tsx
"use client";

import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";

/* ---------------------- Reusable UI ---------------------- */

const Button = ({ children, className = "", ...rest }: any) => (
  <button
    {...rest}
    className={
      "inline-flex items-center gap-2 px-3 py-2 rounded-md shadow-sm text-sm transition " +
      className
    }
  >
    {children}
  </button>
);

const Input = ({ label, ...rest }: any) => (
  <div className="flex flex-col gap-1">
    {label && <label className="text-sm font-medium">{label}</label>}
    <input
      {...rest}
      className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 focus:ring-2 focus:ring-blue-500/30"
    />
  </div>
);

const TextArea = ({ label, ...rest }: any) => (
  <div className="flex flex-col gap-1 md:col-span-2">
    {label && <label className="text-sm font-medium">{label}</label>}
    <textarea
      {...rest}
      className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 min-h-[100px]"
    />
  </div>
);

/* ---------------------- SelectModal ----------------------
   - searchable
   - renders item list (simple) or mini-table if items have multiple fields
   - returns the selected item via onSelect
----------------------------------------------------------- */

function SelectModal({
  title,
  items = [],
  onSelect,
  onClose,
  renderItem,
}: {
  title?: string;
  items?: any[];
  onSelect: (item: any) => void;
  onClose: () => void;
  renderItem?: (item: any) => React.ReactNode;
}) {
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const ql = q.trim().toLowerCase();
    if (!ql) return items;
    return items.filter((it) => {
      // try common fields
      const searchable = [
        it.name,
        it.test_name,
        it.id,
        it.phone,
        it.description,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return searchable.includes(ql);
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
          <h3 className="text-lg font-semibold">{title || "Select"}</h3>
          <div className="flex gap-2 items-center">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search..."
              className="px-3 py-2 rounded-md border border-gray-200 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-800"
            />
            <button
              onClick={onClose}
              className="text-gray-600 hover:text-gray-800"
            >
              ✖
            </button>
          </div>
        </div>

        <div className="max-h-[360px] overflow-auto rounded-md border dark:border-neutral-800">
          {filtered.length === 0 ? (
            <div className="p-6 text-center text-neutral-500">No items</div>
          ) : (
            <div className="divide-y dark:divide-neutral-800">
              {filtered.map((it: any) => (
                <button
                  key={it.id}
                  onClick={() => onSelect(it)}
                  className="w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-neutral-800 flex justify-between items-center"
                >
                  <div className="flex flex-col">
                    {renderItem ? (
                      renderItem(it)
                    ) : (
                      <>
                        <span className="font-medium">
                          {it.name ?? it.test_name ?? it.id}
                        </span>
                        {it.id && (
                          <span className="text-xs text-neutral-500">
                            {it.id}
                          </span>
                        )}
                      </>
                    )}
                  </div>

                  {/* optional meta */}
                  <div className="text-xs text-neutral-500">
                    {it.phone ? it.phone : it.charges ? `₹${it.charges}` : null}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------------------- Page ---------------------- */

export default function LabPage() {
  const qc = useQueryClient();

  // queries (safe - always return array)
  const { data: tests = [], isLoading: testsLoading } = useQuery({
    queryKey: ["lab-tests"],
    queryFn: async () => {
      try {
        const d = await api.get("/lab/tests/");
        return d ?? [];
      } catch {
        return [];
      }
    },
  });

  const { data: reports = [], isLoading: reportsLoading } = useQuery({
    queryKey: ["lab-reports"],
    queryFn: async () => {
      try {
        const d = await api.get("/lab/reports/");
        return d ?? [];
      } catch {
        return [];
      }
    },
  });

  const { data: patients = [], isLoading: patientsLoading } = useQuery({
    queryKey: ["patients"],
    queryFn: async () => {
      try {
        const d = await api.get("/patients/");
        return d ?? [];
      } catch {
        return [];
      }
    },
  });

  const { data: doctors = [], isLoading: doctorsLoading } = useQuery({
    queryKey: ["doctors"],
    queryFn: async () => {
      try {
        const d = await api.get("/doctors/");
        return d ?? [];
      } catch {
        return [];
      }
    },
  });

  // mutations
  const addTest = useMutation({
    mutationFn: (payload: any) => api.post("/lab/tests/", payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["lab-tests"] }),
  });

  const orderTest = useMutation({
    mutationFn: (payload: any) => api.post("/lab/reports/", payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["lab-reports"] }),
  });

  const updateStatus = useMutation({
    mutationFn: ({ id, status }: any) =>
      api.patch(`/lab/reports/${id}/status`, { status }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["lab-reports"] }),
  });

  const updateResult = useMutation({
    mutationFn: ({ id, result }: any) =>
      api.patch(`/lab/reports/${id}/result`, { result }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["lab-reports"] }),
  });

  const deleteReport = useMutation({
    mutationFn: (id: string) => api.delete(`/lab/reports/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["lab-reports"] }),
  });

  // page UI state
  const [showAddTest, setShowAddTest] = useState(false);
  const [showOrder, setShowOrder] = useState(false);
  const [showUpdate, setShowUpdate] = useState(false);
  const [editingReport, setEditingReport] = useState<any>(null);

  // select modal state (reusable)
  const [showSelect, setShowSelect] = useState(false);
  const [selectItems, setSelectItems] = useState<any[]>([]);
  const [selectTitle, setSelectTitle] = useState("");
  const [onSelectCb, setOnSelectCb] = useState<(it: any) => void>(
    () => () => {}
  );
  const [activeTab, setActiveTab] = useState<"tests" | "reports">("tests");

  const openSelect = (title: string, items: any[], cb: (it: any) => void) => {
    setSelectTitle(title);
    setSelectItems(items);
    setOnSelectCb(() => cb);
    setShowSelect(true);
  };

  // order test selections stored in state (no hidden inputs)
  const [orderPatient, setOrderPatient] = useState<any | null>(null);
  const [orderDoctor, setOrderDoctor] = useState<any | null>(null);
  const [orderTestSel, setOrderTestSel] = useState<any | null>(null);

  // Add test form state
  const [testForm, setTestForm] = useState({
    test_name: "",
    charges: "",
    description: "",
  });

  // Update result textarea state
  const [resultText, setResultText] = useState("");

  // helpers
  const isBusy =
    addTest.isLoading ||
    orderTest.isLoading ||
    updateStatus.isLoading ||
    updateResult.isLoading ||
    deleteReport.isLoading;

  return (
    <div className="space-y-8 p-4">
      {/* header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Lab Management</h1>

        {/* ----------- TABS ----------- */}
        <div className="flex gap-2 border-b pb-2">
          <button
            className={`px-4 py-2 rounded-t-md ${
              activeTab === "tests"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 dark:bg-neutral-800"
            }`}
            onClick={() => setActiveTab("tests")}
          >
            Lab Tests
          </button>

          <button
            className={`px-4 py-2 rounded-t-md ${
              activeTab === "reports"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 dark:bg-neutral-800"
            }`}
            onClick={() => setActiveTab("reports")}
          >
            Lab Reports
          </button>
        </div>

        <div className="flex gap-3">
          <Button
            className="bg-purple-600 text-white hover:bg-purple-700"
            onClick={() => setShowOrder(true)}
          >
            🧪 Order Test
          </Button>

          <Button
            className="bg-blue-600 text-white hover:bg-blue-700"
            onClick={() => setShowAddTest(true)}
          >
            <Plus size={14} /> Add Test
          </Button>
        </div>
      </div>

      {/* tests table */}
      {activeTab === "tests" && (
        <section className="bg-white dark:bg-neutral-900 p-6 rounded-xl shadow-sm mt-4">
          <h2 className="text-xl font-semibold mb-4">Lab Tests</h2>

          <div className="max-h-[350px] overflow-auto rounded-lg border border-gray-200 dark:border-neutral-800 shadow-sm">
            <table className="w-full text-sm border-collapse border border-gray-300 dark:border-neutral-700">
              <thead className="sticky top-0 bg-gray-100 dark:bg-neutral-800 text-left text-gray-700 dark:text-gray-300">
                <tr>
                  <th className="p-3 border border-gray-300 dark:border-neutral-700">
                    ID
                  </th>
                  <th className="p-3 border border-gray-300 dark:border-neutral-700">
                    Test
                  </th>
                  <th className="p-3 border border-gray-300 dark:border-neutral-700">
                    Charges
                  </th>
                  <th className="p-3 border border-gray-300 dark:border-neutral-700">
                    Description
                  </th>
                </tr>
              </thead>

              <tbody>
                {tests.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="p-6 text-center border border-gray-300 dark:border-neutral-700 text-neutral-500 dark:text-neutral-400"
                    >
                      No tests yet
                    </td>
                  </tr>
                ) : (
                  tests.map((t: any) => (
                    <tr
                      key={t.id}
                      className="hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors"
                    >
                      <td className="p-3 border border-gray-300 dark:border-neutral-700 text-xs text-neutral-600 dark:text-neutral-400">
                        {t.id}
                      </td>

                      <td className="p-3 border border-gray-300 dark:border-neutral-700 font-medium text-gray-900 dark:text-gray-100">
                        {t.test_name}
                      </td>

                      <td className="p-3 border border-gray-300 dark:border-neutral-700">
                        ₹{t.charges}
                      </td>

                      <td className="p-3 border border-gray-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300">
                        {t.description}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* reports */}
      {activeTab === "reports" && (
        <section className="bg-white dark:bg-neutral-900 p-6 rounded-xl shadow-sm mt-4">
          <h2 className="text-xl font-semibold mb-4">Lab Reports</h2>

          <div className="overflow-auto max-h-[420px] border rounded-lg">
            <table className="w-full text-sm border-collapse border border-gray-300 dark:border-neutral-700">
              <thead>
                <tr className="bg-gray-100 dark:bg-neutral-800 text-left">
                  <th className="p-3 border border-gray-300 dark:border-neutral-700">
                    ID
                  </th>
                  <th className="p-3 border border-gray-300 dark:border-neutral-700">
                    Test
                  </th>
                  <th className="p-3 border border-gray-300 dark:border-neutral-700">
                    Patient
                  </th>
                  <th className="p-3 border border-gray-300 dark:border-neutral-700">
                    Doctor
                  </th>
                  <th className="p-3 border border-gray-300 dark:border-neutral-700">
                    Status
                  </th>
                  <th className="p-3 border border-gray-300 dark:border-neutral-700">
                    Result
                  </th>
                  <th className="p-3 border border-gray-300 dark:border-neutral-700 text-center">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {reports.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="p-6 text-center text-neutral-500 border border-gray-300 dark:border-neutral-700"
                    >
                      No reports
                    </td>
                  </tr>
                ) : (
                  reports.map((r: any) => {
                    const test = tests.find((t: any) => t.id === r.test_id);
                    const patient = patients.find(
                      (p: any) => p.id === r.patient_id
                    );
                    const doctor = doctors.find(
                      (d: any) => d.id === r.doctor_id
                    );

                    return (
                      <tr
                        key={r.id}
                        className="hover:bg-gray-50 dark:hover:bg-neutral-800 transition"
                      >
                        <td className="p-3 border border-gray-300 dark:border-neutral-700 text-xs text-neutral-600">
                          {r.id}
                        </td>

                        <td className="p-3 border border-gray-300 dark:border-neutral-700 font-medium">
                          {test?.test_name || r.test_id}
                        </td>

                        <td className="p-3 border border-gray-300 dark:border-neutral-700">
                          {patient?.name || r.patient_id}
                        </td>

                        <td className="p-3 border border-gray-300 dark:border-neutral-700">
                          {doctor?.name || "—"}
                        </td>

                        <td className="p-3 border border-gray-300 dark:border-neutral-700 capitalize">
                          {r.status}
                        </td>

                        <td className="p-3 border border-gray-300 dark:border-neutral-700">
                          {r.result ? (
                            <span className="text-sm">{r.result}</span>
                          ) : (
                            <span className="text-neutral-500">—</span>
                          )}
                        </td>

                        <td className="p-3 border border-gray-300 dark:border-neutral-700 text-center">
                          <div className="flex justify-center gap-2">
                            <Button
                              className="bg-blue-600 text-white hover:bg-blue-700 text-xs"
                              onClick={() => {
                                setEditingReport(r);
                                setResultText(r.result || "");
                                setShowUpdate(true);
                              }}
                            >
                              <Pencil size={14} />
                              Edit
                            </Button>

                            <Button
                              className="bg-red-600 text-white hover:bg-red-700 text-xs"
                              onClick={() =>
                                confirm("Delete this report?") &&
                                deleteReport.mutate(r.id)
                              }
                            >
                              <Trash2 size={14} />
                              Delete
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* ---------------- Add Test Modal ---------------- */}
      {showAddTest && (
        <div
          className="fixed inset-0 z-50 bg-black/40 flex items-start justify-center pt-24 px-4"
          onClick={() => setShowAddTest(false)}
        >
          <div
            className="bg-white dark:bg-neutral-900 w-full max-w-lg rounded-xl p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Add Lab Test</h3>
              <button onClick={() => setShowAddTest(false)}>✖</button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                addTest.mutate(
                  {
                    test_name: testForm.test_name,
                    charges: Number(testForm.charges || 0),
                    description: testForm.description,
                  },
                  {
                    onSuccess: () => {
                      setTestForm({
                        test_name: "",
                        charges: "",
                        description: "",
                      });
                      setShowAddTest(false);
                    },
                  }
                );
              }}
              className="grid grid-cols-1 md:grid-cols-2 gap-3"
            >
              <Input
                label="Test Name"
                name="test_name"
                required
                value={testForm.test_name}
                onChange={(e: any) =>
                  setTestForm({ ...testForm, test_name: e.target.value })
                }
              />
              <Input
                label="Charges (₹)"
                name="charges"
                required
                type="number"
                value={testForm.charges}
                onChange={(e: any) =>
                  setTestForm({ ...testForm, charges: e.target.value })
                }
              />
              <TextArea
                label="Description"
                name="description"
                value={testForm.description}
                onChange={(e: any) =>
                  setTestForm({ ...testForm, description: e.target.value })
                }
              />
              <div className="md:col-span-2 flex justify-end gap-2">
                <Button className="bg-blue-600 text-white" type="submit">
                  {addTest.isLoading ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    "Add Test"
                  )}
                </Button>
                <Button
                  onClick={() => setShowAddTest(false)}
                  className="bg-gray-200"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ---------------- Order Test Modal ---------------- */}
      {showOrder && (
        <div
          className="fixed inset-0 z-50 bg-black/40 flex items-start justify-center pt-16 px-4"
          onClick={() => setShowOrder(false)}
        >
          <div
            className="bg-white dark:bg-neutral-900 w-full max-w-2xl rounded-xl p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Order Lab Test</h3>
              <button onClick={() => setShowOrder(false)}>✖</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Patient */}
              <div>
                <label className="text-sm font-medium">Patient</label>
                <div className="mt-1 flex gap-2">
                  <input
                    readOnly
                    value={
                      orderPatient
                        ? `${orderPatient.name} (${orderPatient.id})`
                        : ""
                    }
                    placeholder="Select patient"
                    className="input flex-1"
                  />
                  <Button
                    className="bg-gray-100"
                    onClick={() =>
                      openSelect("Select Patient", patients, (p) =>
                        setOrderPatient(p)
                      )
                    }
                  >
                    Choose
                  </Button>
                </div>
              </div>

              {/* Doctor */}
              <div>
                <label className="text-sm font-medium">Doctor (optional)</label>
                <div className="mt-1 flex gap-2">
                  <input
                    readOnly
                    value={
                      orderDoctor
                        ? `${orderDoctor.name} (${orderDoctor.id})`
                        : ""
                    }
                    placeholder="Select doctor"
                    className="input flex-1"
                  />
                  <Button
                    className="bg-gray-100"
                    onClick={() =>
                      openSelect("Select Doctor", doctors, (d) =>
                        setOrderDoctor(d)
                      )
                    }
                  >
                    Choose
                  </Button>
                </div>
              </div>

              {/* Test */}
              <div>
                <label className="text-sm font-medium">Test</label>
                <div className="mt-1 flex gap-2">
                  <input
                    readOnly
                    value={
                      orderTestSel
                        ? `${orderTestSel.test_name} (${orderTestSel.id})`
                        : ""
                    }
                    placeholder="Select test"
                    className="input flex-1"
                  />
                  <Button
                    className="bg-gray-100"
                    onClick={() =>
                      openSelect("Select Test", tests, (t) =>
                        setOrderTestSel(t)
                      )
                    }
                  >
                    Choose
                  </Button>
                </div>
              </div>

              <div className="md:col-span-2 flex justify-end gap-2">
                <Button
                  className="bg-purple-600 text-white"
                  onClick={() => {
                    if (!orderPatient || !orderTestSel) {
                      alert("Please choose patient and test");
                      return;
                    }
                    orderTest.mutate(
                      {
                        patient_id: orderPatient.id,
                        doctor_id: orderDoctor?.id || null,
                        test_id: orderTestSel.id,
                      },
                      {
                        onSuccess: () => {
                          setOrderPatient(null);
                          setOrderDoctor(null);
                          setOrderTestSel(null);
                          setShowOrder(false);
                        },
                      }
                    );
                  }}
                >
                  {orderTest.isLoading ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    "Order Test"
                  )}
                </Button>

                <Button
                  onClick={() => setShowOrder(false)}
                  className="bg-gray-200"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- Update Report Modal ---------------- */}
      {showUpdate && editingReport && (
        <div
          className="fixed inset-0 z-50 bg-black/40 flex items-start justify-center pt-20 px-4"
          onClick={() => setShowUpdate(false)}
        >
          <div
            className="bg-white dark:bg-neutral-900 w-full max-w-xl rounded-xl p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Update Report</h3>
              <button onClick={() => setShowUpdate(false)}>✖</button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium">Status</label>
                <select
                  defaultValue={editingReport.status}
                  onChange={(e) =>
                    updateStatus.mutate({
                      id: editingReport.id,
                      status: e.target.value,
                    })
                  }
                  className="w-full input mt-1"
                >
                  <option value="pending">pending</option>
                  <option value="completed">completed</option>
                </select>
              </div>

              <TextArea
                label="Result"
                value={resultText}
                onChange={(e: any) => setResultText(e.target.value)}
              />

              <div className="flex justify-end gap-2">
                <Button
                  className="bg-blue-600 text-white"
                  onClick={() => {
                    updateResult.mutate(
                      { id: editingReport.id, result: resultText },
                      {
                        onSuccess: () => setShowUpdate(false),
                      }
                    );
                  }}
                >
                  {updateResult.isLoading ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    "Save"
                  )}
                </Button>

                <Button
                  onClick={() => setShowUpdate(false)}
                  className="bg-gray-200"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- Shared Select Modal ---------------- */}
      {showSelect && (
        <SelectModal
          title={selectTitle}
          items={selectItems}
          onSelect={(it) => {
            onSelectCb(it);
            setShowSelect(false);
          }}
          onClose={() => setShowSelect(false)}
        />
      )}
    </div>
  );
}
