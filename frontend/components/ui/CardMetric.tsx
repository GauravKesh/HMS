export const CardMetric = ({ title, value, icon }: any) => (
  <div className="p-4 bg-white dark:bg-neutral-900 rounded-xl shadow flex items-center gap-4">
    <div className="p-3 rounded-lg bg-gray-100 dark:bg-neutral-800">{icon}</div>
    <div>
      <p className="text-xs text-neutral-500">{title}</p>
      <p className="text-2xl font-semibold">{value}</p>
    </div>
  </div>
);
