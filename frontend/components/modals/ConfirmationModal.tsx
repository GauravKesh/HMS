export default function ConfirmationModal({ title = "Confirm", message = "Are you sure?", onCancel, onConfirm }: any) {
  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50" onClick={onCancel}>
      <div className="bg-white dark:bg-neutral-900 p-6 rounded-xl w-full max-w-md shadow-xl" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-sm text-neutral-600 mb-4">{message}</p>

        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 py-2 rounded-lg bg-gray-200">Cancel</button>
          <button onClick={onConfirm} className="flex-1 py-2 rounded-lg bg-red-600 text-white">Delete</button>
        </div>
      </div>
    </div>
  );
}
