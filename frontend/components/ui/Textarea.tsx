export const TextArea = ({ label, className = "", ...props }: any) => (
  <label className="flex flex-col gap-1">
    {label && <span className="text-sm font-medium">{label}</span>}
    <textarea
      {...props}
      className={`w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 h-[100px] focus:ring-2 focus:ring-blue-500/40 transition ${className}`}
    />
  </label>
);
