export const Modal = ({ title, onClose, children }: any) => (
  <div
    className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50"
    onClick={onClose}
  >
    <div className="bg-white dark:bg-neutral-900 p-6 rounded-xl w-full max-w-xl shadow-xl space-y-5" onClick={(e) => e.stopPropagation()}>
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">{title}</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✖</button>
      </div>
      {children}
    </div>
  </div>
);
