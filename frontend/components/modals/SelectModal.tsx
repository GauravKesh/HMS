import { X } from "lucide-react";

export default function SelectModal({ title, items = [], onSelect, onClose }: any) {
  // lightweight client-side search
  const [q, setQ] = useState("");
  const list = q ? items.filter((it: any) => (it.name || it.test_name || "").toLowerCase().includes(q.toLowerCase())) : items;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50" onClick={onClose}>
      <div className="bg-white dark:bg-neutral-900 p-4 rounded-xl w-full max-w-md shadow-xl space-y-3" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center">
          <h3 className="font-semibold">{title}</h3>
          <button onClick={onClose} className="text-gray-500"><X /></button>
        </div>

        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search…" className="w-full px-3 py-2 rounded-lg border" />

        <div className="max-h-[340px] overflow-auto border rounded-lg">
          {list.map((item: any) => (
            <button key={item.id} onClick={() => onSelect(item)} className="w-full text-left p-3 hover:bg-gray-100 dark:hover:bg-neutral-800 border-b">
              <p className="font-medium">{item.name || item.test_name}</p>
              <p className="text-xs text-gray-500">{item.id}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// note: uses useState from react — import at top of file
import { useState } from "react";
