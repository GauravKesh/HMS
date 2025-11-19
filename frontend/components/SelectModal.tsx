"use client";

import { X } from "lucide-react";

export default function SelectModal({ title, items, onSelect, onClose }: any) {
  return (
    <div
      className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-neutral-900 p-6 rounded-xl w-full max-w-md shadow-xl space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button onClick={onClose}>
            <X className="text-gray-500 hover:text-gray-700" />
          </button>
        </div>

        {/* List */}
        <div className="max-h-[400px] overflow-auto border rounded-lg">
          {items.map((item: any) => (
            <button
              key={item.id}
              onClick={() => onSelect(item)}
              className="w-full text-left px-4 py-3 hover:bg-gray-100 dark:hover:bg-neutral-800 border-b"
            >
              <p className="font-medium">{item.name || item.patient_name || item.doctor_name}</p>
              <p className="text-xs text-gray-500">{item.id}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
